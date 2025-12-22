import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { compraIngressoSchema } from "@/lib/validations";
import { randomBytes } from "crypto";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { eventoId, ingressoId, ...dadosCliente } = body;

    // Validar dados do cliente
    const dadosValidados = compraIngressoSchema.parse(dadosCliente);

    // Verificar se o evento e ingresso existem e estão ativos
    const evento = await prisma.evento.findUnique({
      where: { id: eventoId },
      include: {
        ingressos: {
          where: { id: ingressoId },
        },
      },
    });

    if (!evento || !evento.ativo) {
      return NextResponse.json(
        { error: "Evento não encontrado ou inativo" },
        { status: 404 }
      );
    }

    const ingresso = evento.ingressos[0];

    if (!ingresso || !ingresso.ativo) {
      return NextResponse.json(
        { error: "Ingresso não encontrado ou inativo" },
        { status: 404 }
      );
    }

    // Verificar disponibilidade
    const disponivel = ingresso.quantidade - ingresso.vendidos;
    if (dadosValidados.quantidade > disponivel) {
      return NextResponse.json(
        { error: `Apenas ${disponivel} ingresso(s) disponível(is)` },
        { status: 400 }
      );
    }

    if (dadosValidados.quantidade <= 0) {
      return NextResponse.json(
        { error: "Quantidade deve ser maior que zero" },
        { status: 400 }
      );
    }

    // Calcular valor total
    const valorTotal = ingresso.preco * dadosValidados.quantidade;

    // Gerar código único para a venda
    const codigo = `BLUE-${randomBytes(4).toString("hex").toUpperCase()}`;

    // Criar ou encontrar cliente (buscar por email ou CPF)
    let cliente = await prisma.cliente.findFirst({
      where: {
        OR: [
          { email: dadosValidados.email },
          ...(dadosValidados.cpf ? [{ cpf: dadosValidados.cpf }] : []),
        ],
      },
    });

    if (!cliente) {
      cliente = await prisma.cliente.create({
        data: {
          nome: dadosValidados.nome,
          email: dadosValidados.email,
          telefone: dadosValidados.telefone,
          cpf: dadosValidados.cpf,
        },
      });
    } else {
      // Atualizar dados do cliente se necessário
      cliente = await prisma.cliente.update({
        where: { id: cliente.id },
        data: {
          nome: dadosValidados.nome,
          telefone: dadosValidados.telefone,
          ...(dadosValidados.cpf && !cliente.cpf
            ? { cpf: dadosValidados.cpf }
            : {}),
        },
      });
    }

    // Criar venda
    const venda = await prisma.venda.create({
      data: {
        clienteId: cliente.id,
        ingressoId: ingresso.id,
        quantidade: dadosValidados.quantidade,
        valorTotal,
        status: "confirmada",
        codigo,
      },
    });

    // Atualizar quantidade de ingressos vendidos
    await prisma.ingresso.update({
      where: { id: ingresso.id },
      data: {
        vendidos: {
          increment: dadosValidados.quantidade,
        },
      },
    });

    return NextResponse.json({
      success: true,
      venda: {
        id: venda.id,
        codigo: venda.codigo,
        valorTotal: venda.valorTotal,
        quantidade: venda.quantidade,
        evento: evento.nome,
        ingresso: ingresso.tipo,
      },
    });
  } catch (error: any) {
    console.error("Erro ao processar compra:", error);

    if (error.name === "ZodError") {
      return NextResponse.json(
        { error: "Dados inválidos", details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Erro ao processar compra. Tente novamente." },
      { status: 500 }
    );
  }
}
