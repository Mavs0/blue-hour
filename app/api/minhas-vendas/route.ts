import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { checkRateLimit, getClientIP } from "@/lib/rate-limit";
import { sanitizeEmail } from "@/lib/sanitize";
import { limparCPF } from "@/lib/cpf-validator";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    // Rate limiting: 10 buscas por minuto por IP
    const clientIP = getClientIP(request);
    if (!checkRateLimit(clientIP, 10, 60000)) {
      return NextResponse.json(
        {
          error:
            "Muitas tentativas. Aguarde um momento antes de tentar novamente.",
        },
        { status: 429 }
      );
    }

    const searchParams = request.nextUrl.searchParams;
    const email = searchParams.get("email")
      ? sanitizeEmail(searchParams.get("email")!)
      : null;
    const cpf = searchParams.get("cpf")
      ? limparCPF(searchParams.get("cpf")!)
      : null;

    if (!email && !cpf) {
      return NextResponse.json(
        { error: "Email ou CPF é obrigatório" },
        { status: 400 }
      );
    }

    // Buscar cliente por email ou CPF
    const cliente = await prisma.cliente.findFirst({
      where: {
        OR: [...(email ? [{ email }] : []), ...(cpf ? [{ cpf }] : [])],
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
