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
    let body;
    try {
      body = await request.json();
    } catch (jsonError: any) {
      console.error("Erro ao fazer parse do JSON:", jsonError);
      return NextResponse.json(
        {
          error: "Formato de dados inválido",
          message: "O corpo da requisição deve ser um JSON válido",
          details: jsonError?.message,
        },
        { status: 400 }
      );
    }

    // Validar se body não está vazio
    if (!body || Object.keys(body).length === 0) {
      return NextResponse.json(
        {
          error: "Dados não fornecidos",
          message: "O corpo da requisição está vazio",
        },
        { status: 400 }
      );
    }

    // Validar dados
    let dadosValidados;
    try {
      dadosValidados = eventoSchema.parse(body);
    } catch (validationError: any) {
      console.error("Erro de validação:", validationError);
      return NextResponse.json(
        {
          error: "Dados inválidos",
          details: validationError.errors || validationError.issues,
          message: "Verifique os dados do formulário",
        },
        { status: 400 }
      );
    }

    // Verificar se há ingressos
    if (!dadosValidados.ingressos || dadosValidados.ingressos.length === 0) {
      return NextResponse.json(
        { error: "É necessário pelo menos um tipo de ingresso" },
        { status: 400 }
      );
    }

    // Validar data antes de criar
    const dataEvento = new Date(dadosValidados.data);
    if (isNaN(dataEvento.getTime())) {
      return NextResponse.json(
        {
          error: "Data inválida",
          message: "A data do evento é inválida",
        },
        { status: 400 }
      );
    }

    // Verificar conexão com banco antes de criar
    try {
      await prisma.$connect();
    } catch (connectError: any) {
      console.error("Erro ao conectar com banco:", connectError);
      return NextResponse.json(
        {
          error: "Erro de conexão com banco de dados",
          message: "Não foi possível conectar ao banco de dados",
          details: process.env.NODE_ENV === "development" ? connectError?.message : undefined,
        },
        { status: 503 }
      );
    }

    // Criar evento com ingressos
    let evento;
    try {
      evento = await prisma.evento.create({
        data: {
          nome: dadosValidados.nome,
          descricao: dadosValidados.descricao || null,
          data: dataEvento,
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
    } catch (dbError: any) {
      console.error("Erro ao criar evento no banco:", dbError);
      console.error("Dados que causaram erro:", {
        nome: dadosValidados.nome,
        data: dadosValidados.data,
        local: dadosValidados.local,
        cidade: dadosValidados.cidade,
        ingressosCount: dadosValidados.ingressos.length,
      });
      
      // Re-throw para ser capturado pelo catch externo
      throw dbError;
    }

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
      meta: error?.meta,
    });
    
    // Log adicional para produção
    if (process.env.NODE_ENV === "production") {
      console.error("Erro em produção - POST /api/eventos:", {
        errorName: error?.name,
        errorCode: error?.code,
        errorMessage: error?.message,
        timestamp: new Date().toISOString(),
      });
    }

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
