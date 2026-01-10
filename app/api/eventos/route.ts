import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { eventoSchema } from "@/lib/validations";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const eventos = await prisma.evento.findMany({
      include: {
        ingressos: {
          where: {
            ativo: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({ eventos }, { status: 200 });
  } catch (error: any) {
    console.error("Erro ao buscar eventos:", error);

    // Se for erro de conexão com banco ou qualquer erro do Prisma, retornar array vazio com status 200
    if (
      error?.code === "P1001" ||
      error?.code === "P1000" ||
      error?.code === "P2002" ||
      error?.name === "PrismaClientKnownRequestError" ||
      error?.name === "PrismaClientUnknownRequestError" ||
      error?.name === "PrismaClientRustPanicError" ||
      error?.message?.includes("connect") ||
      error?.message?.includes("connection") ||
      error?.message?.includes("timeout") ||
      error?.message?.includes("Can't reach database")
    ) {
      console.warn(
        "Erro de conexão com banco de dados, retornando array vazio"
      );
      return NextResponse.json({ eventos: [] }, { status: 200 });
    }

    // Para outros erros inesperados, ainda retornar 200 com array vazio para não quebrar o frontend
    console.warn(
      "Erro ao buscar eventos, retornando array vazio:",
      error?.message
    );
    return NextResponse.json({ eventos: [] }, { status: 200 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validar dados
    const dadosValidados = eventoSchema.parse(body);

    // Verificar se há ingressos
    if (!dadosValidados.ingressos || dadosValidados.ingressos.length === 0) {
      return NextResponse.json(
        { error: "É necessário pelo menos um tipo de ingresso" },
        { status: 400 }
      );
    }

    // Criar evento com ingressos
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
            kit: ingresso.kit || null,
          })),
        },
      },
      include: {
        ingressos: true,
      },
    });

    return NextResponse.json(
      {
        success: true,
        evento,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Erro ao criar evento:", error);
    console.error("Detalhes do erro:", {
      name: error?.name,
      code: error?.code,
      message: error?.message,
      stack: error?.stack,
      cause: error?.cause,
    });

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

    if (
      error?.message?.includes("notificacaoAdmin") ||
      error?.message?.includes("NotificacaoAdmin") ||
      error?.message?.includes("Unknown model") ||
      error?.code === "P2001"
    ) {
      return NextResponse.json(
        {
          error: "Erro de configuração do banco de dados",
          message:
            "Execute 'npx prisma generate' e 'npx prisma db push' para atualizar o schema",
          details: error?.message,
        },
        { status: 500 }
      );
    }

    // Erro de conexão com banco
    if (
      error?.code === "P1001" ||
      error?.code === "P1000" ||
      error?.message?.includes("connect") ||
      error?.message?.includes("connection") ||
      error?.message?.includes("timeout") ||
      error?.message?.includes("Can't reach database")
    ) {
      return NextResponse.json(
        {
          error: "Erro de conexão com o banco de dados",
          message: "Verifique a configuração do DATABASE_URL",
        },
        { status: 503 }
      );
    }

    // Erro de constraint do banco
    if (error?.code === "P2002") {
      return NextResponse.json(
        {
          error: "Já existe um evento com esses dados",
          message: error?.meta?.target || "Dados duplicados",
        },
        { status: 409 }
      );
    }

    // Outros erros
    return NextResponse.json(
      {
        error: "Erro ao criar evento",
        message: error?.message || "Erro desconhecido. Tente novamente.",
        details:
          process.env.NODE_ENV === "development" ? error?.stack : undefined,
      },
      { status: 500 }
    );
  }
}
