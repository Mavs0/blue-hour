import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const ingresso = await prisma.ingresso.findUnique({
      where: { id: params.id },
    });

    if (!ingresso) {
      return NextResponse.json(
        { error: "Ingresso não encontrado" },
        { status: 404 }
      );
    }

    const ingressoAtualizado = await prisma.ingresso.update({
      where: { id: params.id },
      data: {
        ativo: !ingresso.ativo,
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
      ingresso: ingressoAtualizado,
    });
  } catch (error) {
    console.error("Erro ao alterar status do ingresso:", error);
    return NextResponse.json(
      { error: "Erro ao alterar status. Tente novamente." },
      { status: 500 }
    );
  }
}
