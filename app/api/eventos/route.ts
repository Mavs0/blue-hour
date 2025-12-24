import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { eventoSchema } from "@/lib/validations";

export async function GET() {
  try {
    const eventos = await prisma.evento.findMany({
      include: {
        ingressos: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({ eventos });
  } catch (error) {
    console.error("Erro ao buscar eventos:", error);
    return NextResponse.json(
      { error: "Erro ao buscar eventos" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const dadosValidados = eventoSchema.parse(body);

    const evento = await prisma.evento.create({
      data: {
        nome: dadosValidados.nome,
        descricao: dadosValidados.descricao || null,
        data: new Date(dadosValidados.data),
        local: dadosValidados.local,
        cidade: dadosValidados.cidade,
        imagemUrl: dadosValidados.imagemUrl || null,
        ativo: true,
        ingressos: {
          create: dadosValidados.ingressos.map((ingresso) => ({
            tipo: ingresso.tipo,
            preco: ingresso.preco,
            quantidade: ingresso.quantidade,
            vendidos: 0,
            ativo: true,
          })),
        },
      },
      include: {
        ingressos: true,
      },
    });

    return NextResponse.json({
      success: true,
      evento,
    });
  } catch (error: any) {
    console.error("Erro ao criar evento:", error);

    if (error.name === "ZodError") {
      return NextResponse.json(
        { error: "Dados inválidos", details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Erro ao criar evento. Tente novamente." },
      { status: 500 }
    );
  }
}
