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
    const eventoId = searchParams.get("eventoId");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "50");
    const skip = (page - 1) * limit;

    // Construir filtros
    const where: any = {};

    if (status) {
      where.status = status;
    }

    if (statusPagamento) {
      where.statusPagamento = statusPagamento;
    }

    if (formaPagamento) {
      where.formaPagamento = formaPagamento;
    }

    if (codigo) {
      where.codigo = {
        contains: codigo,
        mode: "insensitive" as const,
      };
    }

    if (clienteNome) {
      where.cliente = {
        nome: {
          contains: clienteNome,
          mode: "insensitive" as const,
        },
      };
    }

    if (eventoId) {
      where.ingresso = {
        eventoId: eventoId,
      };
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
