import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const email = searchParams.get("email");
    const cpf = searchParams.get("cpf");

    if (!email && !cpf) {
      return NextResponse.json(
        { error: "Email ou CPF é obrigatório" },
        { status: 400 }
      );
    }

    // Buscar cliente por email ou CPF
    const cliente = await prisma.cliente.findFirst({
      where: {
        OR: [
          ...(email ? [{ email }] : []),
          ...(cpf ? [{ cpf: cpf.replace(/\D/g, "") }] : []),
        ],
      },
    });

    if (!cliente) {
      return NextResponse.json(
        { error: "Nenhuma compra encontrada com os dados informados" },
        { status: 404 }
      );
    }

    // Buscar todas as vendas do cliente
    const vendas = await prisma.venda.findMany({
      where: {
        clienteId: cliente.id,
      },
      include: {
        ingresso: {
          include: {
            evento: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({
      cliente: {
        id: cliente.id,
        nome: cliente.nome,
        email: cliente.email,
        telefone: cliente.telefone,
      },
      vendas: vendas.map((venda: any) => ({
        id: venda.id,
        codigo: venda.codigo,
        quantidade: venda.quantidade,
        valorTotal: venda.valorTotal,
        formaPagamento: venda.formaPagamento || "pix",
        statusPagamento: venda.statusPagamento || "pendente",
        status: venda.status || "pendente",
        codigoPagamento: venda.codigoPagamento || null,
        qrCodePix: venda.qrCodePix || null,
        vencimentoBoleto: venda.vencimentoBoleto || null,
        dadosCartao: venda.dadosCartao || null,
        createdAt: venda.createdAt,
        evento: {
          id: venda.ingresso.evento.id,
          nome: venda.ingresso.evento.nome,
          data: venda.ingresso.evento.data,
          local: venda.ingresso.evento.local,
          cidade: venda.ingresso.evento.cidade,
          imagemUrl: venda.ingresso.evento.imagemUrl,
        },
        ingresso: {
          id: venda.ingresso.id,
          tipo: venda.ingresso.tipo,
          preco: venda.ingresso.preco,
        },
      })),
    });
  } catch (error) {
    console.error("Erro ao buscar vendas:", error);
    return NextResponse.json(
      { error: "Erro ao buscar suas compras" },
      { status: 500 }
    );
  }
}
