import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ingressoSchema } from "@/lib/validations";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const ingresso = await prisma.ingresso.findUnique({
      where: { id: params.id },
      include: {
        evento: {
          select: {
            id: true,
            nome: true,
            data: true,
          },
        },
      },
    });

    if (!ingresso) {
      return NextResponse.json(
        { error: "Ingresso não encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json({ ingresso });
  } catch (error) {
    console.error("Erro ao buscar ingresso:", error);
    return NextResponse.json(
      { error: "Erro ao buscar ingresso" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const dadosValidados = ingressoSchema.parse(body);

    // Verificar se o ingresso existe
    const ingressoExistente = await prisma.ingresso.findUnique({
      where: { id: params.id },
    });

    if (!ingressoExistente) {
      return NextResponse.json(
        { error: "Ingresso não encontrado" },
        { status: 404 }
      );
    }

    // Validar que a nova quantidade não seja menor que vendidos
    if (dadosValidados.quantidade < ingressoExistente.vendidos) {
      return NextResponse.json(
        {
          error: `A quantidade não pode ser menor que ${ingressoExistente.vendidos} (já vendidos)`,
        },
        { status: 400 }
      );
    }

    const ingresso = await prisma.ingresso.update({
      where: { id: params.id },
      data: {
        tipo: dadosValidados.tipo,
        preco: dadosValidados.preco,
        quantidade: dadosValidados.quantidade,
      },
      include: {
        evento: {
          select: {
            id: true,
            nome: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      ingresso,
    });
  } catch (error: any) {
    console.error("Erro ao atualizar ingresso:", error);

    if (error.name === "ZodError") {
      return NextResponse.json(
        { error: "Dados inválidos", details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Erro ao atualizar ingresso. Tente novamente." },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const ingresso = await prisma.ingresso.findUnique({
      where: { id: params.id },
      include: {
        vendas: true,
      },
    });

    if (!ingresso) {
      return NextResponse.json(
        { error: "Ingresso não encontrado" },
        { status: 404 }
      );
    }

    // Não permitir excluir se houver vendas
    if (ingresso.vendas.length > 0) {
      return NextResponse.json(
        {
          error:
            "Não é possível excluir ingresso com vendas associadas. Desative-o ao invés de excluir.",
        },
        { status: 400 }
      );
    }

    await prisma.ingresso.delete({
      where: { id: params.id },
    });

    return NextResponse.json({
      success: true,
      message: "Ingresso excluído com sucesso",
    });
  } catch (error) {
    console.error("Erro ao excluir ingresso:", error);
    return NextResponse.json(
      { error: "Erro ao excluir ingresso. Tente novamente." },
      { status: 500 }
    );
  }
}
