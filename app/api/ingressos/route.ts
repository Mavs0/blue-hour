import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ingressoSchema } from "@/lib/validations";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const eventoId = searchParams.get("eventoId");

    const where = eventoId ? { eventoId } : {};

    const ingressos = await prisma.ingresso.findMany({
      where,
      include: {
        evento: {
          select: {
            id: true,
            nome: true,
            data: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({ ingressos }, { status: 200 });
  } catch (error: any) {
    console.error("Erro ao buscar ingressos:", error);
    console.error("Detalhes do erro:", {
      name: error?.name,
      code: error?.code,
      message: error?.message,
    });

    // Erro de conexão com banco - retornar array vazio para não quebrar o frontend
    if (
      error?.code === "P1001" ||
      error?.code === "P1000" ||
      error?.message?.includes("connect") ||
      error?.message?.includes("connection") ||
      error?.message?.includes("timeout")
    ) {
      console.warn(
        "Erro de conexão ao buscar ingressos, retornando array vazio:",
        error?.message
      );
      return NextResponse.json({ ingressos: [] }, { status: 200 });
    }

    // Para outros erros inesperados, ainda retornar 200 com array vazio para não quebrar o frontend
    console.warn(
      "Erro ao buscar ingressos, retornando array vazio:",
      error?.message
    );
    return NextResponse.json({ ingressos: [] }, { status: 200 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { eventoId, ...dadosIngresso } = body;

    // Validar dados
    const dadosValidados = ingressoSchema.parse(dadosIngresso);

    // Verificar se o evento existe
    const evento = await prisma.evento.findUnique({
      where: { id: eventoId },
    });

    if (!evento) {
      return NextResponse.json(
        { error: "Evento não encontrado" },
        { status: 404 }
      );
    }

    const ingresso = await prisma.ingresso.create({
      data: {
        eventoId,
        tipo: dadosValidados.tipo,
        preco: dadosValidados.preco,
        quantidade: dadosValidados.quantidade,
        kit: dadosValidados.kit || null,
        vendidos: 0,
        ativo: true,
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
    console.error("Erro ao criar ingresso:", error);

    if (error.name === "ZodError") {
      return NextResponse.json(
        { error: "Dados inválidos", details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Erro ao criar ingresso. Tente novamente." },
      { status: 500 }
    );
  }
}
