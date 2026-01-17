import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const statusPagamento = searchParams.get("statusPagamento");
    const formaPagamento = searchParams.get("formaPagamento");
    const codigo = searchParams.get("codigo");
    const clienteNome = searchParams.get("clienteNome");
    const clienteEmail = searchParams.get("clienteEmail");
    const clienteCPF = searchParams.get("clienteCPF");
    const eventoId = searchParams.get("eventoId");
    const eventoNome = searchParams.get("eventoNome");
    const dataInicio = searchParams.get("dataInicio");
    const dataFim = searchParams.get("dataFim");
    const valorMin = searchParams.get("valorMin");
    const valorMax = searchParams.get("valorMax");
    const filterMode = searchParams.get("filterMode") || "AND"; // AND ou OR
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "50");
    const skip = (page - 1) * limit;

    // Construir filtros
    const where: any = {};
    const orConditions: any[] = [];
    const andConditions: any[] = [];

    // Filtros simples (sempre AND)
    if (status) {
      andConditions.push({ status });
    }

    if (statusPagamento) {
      andConditions.push({ statusPagamento });
    }

    if (formaPagamento) {
      andConditions.push({ formaPagamento });
    }

    if (codigo) {
      andConditions.push({
        codigo: {
          contains: codigo,
          mode: "insensitive" as const,
        },
      });
    }

    // Filtros de busca (podem ser AND ou OR)
    const searchConditions: any[] = [];

    if (clienteNome) {
      searchConditions.push({
        cliente: {
          nome: {
            contains: clienteNome,
            mode: "insensitive" as const,
          },
        },
      });
    }

    if (clienteEmail) {
      searchConditions.push({
        cliente: {
          email: {
            contains: clienteEmail,
            mode: "insensitive" as const,
          },
        },
      });
    }

    if (clienteCPF) {
      searchConditions.push({
        cliente: {
          cpf: {
            contains: clienteCPF.replace(/\D/g, ""),
          },
        },
      });
    }

    if (eventoNome) {
      searchConditions.push({
        ingresso: {
          evento: {
            nome: {
              contains: eventoNome,
              mode: "insensitive" as const,
            },
          },
        },
      });
    }

    if (eventoId) {
      andConditions.push({
        ingresso: {
          eventoId: eventoId,
        },
      });
    }

    // Filtros de data
    if (dataInicio || dataFim) {
      const dateFilter: any = {};
      if (dataInicio) {
        dateFilter.gte = new Date(dataInicio);
      }
      if (dataFim) {
        const fim = new Date(dataFim);
        fim.setHours(23, 59, 59, 999);
        dateFilter.lte = fim;
      }
      andConditions.push({ createdAt: dateFilter });
    }

    // Filtros de valor
    if (valorMin || valorMax) {
      const valorFilter: any = {};
      if (valorMin) {
        valorFilter.gte = parseFloat(valorMin);
      }
      if (valorMax) {
        valorFilter.lte = parseFloat(valorMax);
      }
      andConditions.push({ valorTotal: valorFilter });
    }

    // Combinar condições de busca
    if (searchConditions.length > 0) {
      if (filterMode === "OR") {
        orConditions.push({ OR: searchConditions });
      } else {
        andConditions.push(...searchConditions);
      }
    }

    // Construir where final
    if (orConditions.length > 0 && andConditions.length > 0) {
      where.AND = [...andConditions, { OR: orConditions }];
    } else if (orConditions.length > 0) {
      where.OR = orConditions;
    } else if (andConditions.length > 0) {
      where.AND = andConditions;
    }

    // Buscar vendas com paginação
    const [vendas, total] = await Promise.all([
      prisma.venda.findMany({
        where,
        include: {
          cliente: {
            select: {
              id: true,
              nome: true,
              email: true,
              telefone: true,
              cpf: true,
            },
          },
          ingresso: {
            include: {
              evento: {
                select: {
                  id: true,
                  nome: true,
                  data: true,
                  local: true,
                  cidade: true,
                },
              },
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        skip,
        take: limit,
      }),
      prisma.venda.count({ where }),
    ]);

    // Calcular estatísticas
    const stats = await prisma.venda.aggregate({
      where: {},
      _sum: {
        valorTotal: true,
        quantidade: true,
      },
      _count: {
        id: true,
      },
    });

    const statsConfirmadas = await prisma.venda.aggregate({
      where: {
        statusPagamento: "confirmado",
      },
      _sum: {
        valorTotal: true,
        quantidade: true,
      },
    });

    return NextResponse.json({
      vendas: vendas.map((venda) => ({
        id: venda.id,
        codigo: venda.codigo,
        quantidade: venda.quantidade,
        valorTotal: venda.valorTotal,
        formaPagamento: venda.formaPagamento,
        statusPagamento: venda.statusPagamento,
        status: venda.status,
        codigoPagamento: venda.codigoPagamento,
        vencimentoBoleto: venda.vencimentoBoleto,
        createdAt: venda.createdAt,
        updatedAt: venda.updatedAt,
        cliente: venda.cliente,
        ingresso: {
          id: venda.ingresso.id,
          tipo: venda.ingresso.tipo,
          preco: venda.ingresso.preco,
          evento: venda.ingresso.evento,
        },
      })),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
      stats: {
        totalVendas: stats._count.id,
        totalQuantidade: stats._sum.quantidade || 0,
        totalReceita: stats._sum.valorTotal || 0,
        receitaConfirmada: statsConfirmadas._sum.valorTotal || 0,
        quantidadeConfirmada: statsConfirmadas._sum.quantidade || 0,
      },
    });
  } catch (error) {
    console.error("Erro ao buscar vendas:", error);
    return NextResponse.json(
      { error: "Erro ao buscar vendas" },
      { status: 500 }
    );
  }
}
