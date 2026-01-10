import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { eventoSchema } from "@/lib/validations";

export const dynamic = "force-dynamic";

// GET - Buscar evento específico
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const evento = await prisma.evento.findUnique({
      where: { id: params.id },
      include: {
        ingressos: true,
      },
    });

    if (!evento) {
      return NextResponse.json(
        { error: "Evento não encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json({ evento }, { status: 200 });
  } catch (error: any) {
    console.error("Erro ao buscar evento:", error);
    return NextResponse.json(
      {
        error: "Erro ao buscar evento",
        message: error?.message || "Erro desconhecido",
      },
      { status: 500 }
    );
  }
}

// PUT - Atualizar evento
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();

    // Validar dados
    const dadosValidados = eventoSchema.parse(body);

    // Verificar se o evento existe
    const eventoExistente = await prisma.evento.findUnique({
      where: { id: params.id },
      include: {
        ingressos: {
          include: {
            _count: {
              select: {
                vendas: true,
              },
            },
          },
        },
      },
    });

    if (!eventoExistente) {
      return NextResponse.json(
        { error: "Evento não encontrado" },
        { status: 404 }
      );
    }

    // Verificar se há ingressos
    if (!dadosValidados.ingressos || dadosValidados.ingressos.length === 0) {
      return NextResponse.json(
        { error: "É necessário pelo menos um tipo de ingresso" },
        { status: 400 }
      );
    }

    // Atualizar evento e ingressos
    // Primeiro, atualizar o evento
    const evento = await prisma.evento.update({
      where: { id: params.id },
      data: {
        nome: dadosValidados.nome,
        descricao: dadosValidados.descricao || null,
        data: new Date(dadosValidados.data),
        local: dadosValidados.local,
        cidade: dadosValidados.cidade,
        imagemUrl: dadosValidados.imagemUrl || null,
      },
    });

    // Deletar ingressos antigos que não estão na lista atual
    const ingressosIdsNovos = dadosValidados.ingressos
      .map((ing) => (ing as any).id)
      .filter((id) => id);

    await prisma.ingresso.deleteMany({
      where: {
        eventoId: params.id,
        id: {
          notIn: ingressosIdsNovos.length > 0 ? ingressosIdsNovos : [],
        },
      },
    });

    // Atualizar ou criar ingressos
    for (const ingressoData of dadosValidados.ingressos) {
      const ingressoDataComId = ingressoData as any;
      if (ingressoDataComId.id) {
        // Atualizar ingresso existente
        await prisma.ingresso.update({
          where: { id: ingressoDataComId.id },
          data: {
            tipo: ingressoDataComId.tipo,
            preco: ingressoDataComId.preco,
            quantidade: ingressoDataComId.quantidade,
            kit: ingressoDataComId.kit || null,
            // Não atualizar vendidos - manter o valor atual
          },
        });
      } else {
        // Criar novo ingresso
        await prisma.ingresso.create({
          data: {
            eventoId: params.id,
            tipo: ingressoDataComId.tipo,
            preco: ingressoDataComId.preco,
            quantidade: ingressoDataComId.quantidade,
            vendidos: 0,
            ativo: true,
            kit: ingressoDataComId.kit || null,
          },
        });
      }
    }

    // Buscar evento atualizado com ingressos
    const eventoAtualizado = await prisma.evento.findUnique({
      where: { id: params.id },
      include: {
        ingressos: true,
      },
    });

    return NextResponse.json(
      {
        success: true,
        evento: eventoAtualizado,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Erro ao atualizar evento:", error);

    // Erro de validação Zod
    if (error?.name === "ZodError") {
      return NextResponse.json(
        {
          error: "Dados inválidos",
          details: error.errors,
          message: "Verifique os dados do formulário",
        },
        { status: 400 }
      );
    }

    // Erro de conexão com banco
    if (
      error?.code === "P1001" ||
      error?.code === "P1000" ||
      error?.message?.includes("connect") ||
      error?.message?.includes("connection") ||
      error?.message?.includes("timeout")
    ) {
      return NextResponse.json(
        {
          error: "Erro de conexão com o banco de dados",
          message: "Verifique a configuração do DATABASE_URL",
        },
        { status: 503 }
      );
    }

    return NextResponse.json(
      {
        error: "Erro ao atualizar evento",
        message: error?.message || "Erro desconhecido. Tente novamente.",
      },
      { status: 500 }
    );
  }
}

// DELETE - Excluir evento
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Verificar se o evento existe e se tem vendas
    const evento = await prisma.evento.findUnique({
      where: { id: params.id },
      include: {
        ingressos: {
          include: {
            _count: {
              select: {
                vendas: true,
              },
            },
          },
        },
      },
    });

    if (!evento) {
      return NextResponse.json(
        { error: "Evento não encontrado" },
        { status: 404 }
      );
    }

    // Contar vendas através dos ingressos
    const totalVendas = evento.ingressos.reduce(
      (total, ingresso) => total + ingresso._count.vendas,
      0
    );

    // Verificar se há vendas associadas
    if (totalVendas > 0) {
      return NextResponse.json(
        {
          error: "Não é possível excluir evento com vendas associadas",
          message: `Este evento possui ${totalVendas} venda(s). Desative o evento ao invés de excluí-lo.`,
          vendas: totalVendas,
        },
        { status: 400 }
      );
    }

    // Excluir ingressos primeiro (devido à constraint de foreign key)
    await prisma.ingresso.deleteMany({
      where: { eventoId: params.id },
    });

    // Excluir evento
    await prisma.evento.delete({
      where: { id: params.id },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Evento excluído com sucesso",
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Erro ao excluir evento:", error);

    // Erro de conexão com banco
    if (
      error?.code === "P1001" ||
      error?.code === "P1000" ||
      error?.message?.includes("connect") ||
      error?.message?.includes("connection") ||
      error?.message?.includes("timeout")
    ) {
      return NextResponse.json(
        {
          error: "Erro de conexão com o banco de dados",
          message: "Verifique a configuração do DATABASE_URL",
        },
        { status: 503 }
      );
    }

    return NextResponse.json(
      {
        error: "Erro ao excluir evento",
        message: error?.message || "Erro desconhecido. Tente novamente.",
      },
      { status: 500 }
    );
  }
}

// PATCH - Atualizar apenas status (ativação/desativação)
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { ativo } = body;

    if (typeof ativo !== "boolean") {
      return NextResponse.json(
        { error: "Campo 'ativo' deve ser um booleano" },
        { status: 400 }
      );
    }

    const evento = await prisma.evento.update({
      where: { id: params.id },
      data: { ativo },
      include: {
        ingressos: true,
      },
    });

    return NextResponse.json(
      {
        success: true,
        evento,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Erro ao atualizar status do evento:", error);

    if (error?.code === "P2025") {
      return NextResponse.json(
        { error: "Evento não encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        error: "Erro ao atualizar status do evento",
        message: error?.message || "Erro desconhecido",
      },
      { status: 500 }
    );
  }
}
