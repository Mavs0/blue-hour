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

    // Log do body recebido (sem dados sensíveis)
    console.log("Body recebido:", {
      hasNome: !!body.nome,
      hasData: !!body.data,
      hasLocal: !!body.local,
      hasCidade: !!body.cidade,
      ingressosCount: body.ingressos?.length || 0,
      ingressos: body.ingressos?.map((i: any) => ({
        tipo: i.tipo,
        preco: typeof i.preco,
        quantidade: typeof i.quantidade,
      })),
    });

    // Validar dados
    let dadosValidados;
    try {
      dadosValidados = eventoSchema.parse(body);
    } catch (validationError: any) {
      console.error("Erro de validação:", validationError);
      console.error("Body que causou erro:", JSON.stringify(body, null, 2));
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

    // Validar e normalizar ingressos antes de criar
    const ingressosParaCriar = dadosValidados.ingressos.map((ingresso) => {
      // Garantir que preco e quantidade são números
      const preco = typeof ingresso.preco === "string" 
        ? parseFloat(ingresso.preco) 
        : Number(ingresso.preco);
      
      const quantidade = typeof ingresso.quantidade === "string"
        ? parseInt(ingresso.quantidade, 10)
        : Number(ingresso.quantidade);

      if (isNaN(preco) || preco <= 0) {
        throw new Error(`Preço inválido para ingresso: ${ingresso.tipo}`);
      }

      if (isNaN(quantidade) || quantidade <= 0) {
        throw new Error(`Quantidade inválida para ingresso: ${ingresso.tipo}`);
      }

      return {
        tipo: String(ingresso.tipo).trim(),
        preco: preco,
        quantidade: Math.floor(quantidade),
        vendidos: 0,
        ativo: true,
        kit: ingresso.kit ? String(ingresso.kit).trim() : null,
      };
    });

    console.log("Dados validados e normalizados:", {
      nome: dadosValidados.nome,
      cidade: dadosValidados.cidade,
      ingressosCount: ingressosParaCriar.length,
    });

    // Criar evento com ingressos
    // O Prisma gerencia a conexão automaticamente, não precisa verificar manualmente
    let evento;
    try {
      evento = await prisma.evento.create({
        data: {
          nome: String(dadosValidados.nome).trim(),
          descricao: dadosValidados.descricao ? String(dadosValidados.descricao).trim() : null,
          data: dataEvento,
          local: String(dadosValidados.local).trim(),
          cidade: String(dadosValidados.cidade).trim(),
          imagemUrl: dadosValidados.imagemUrl ? String(dadosValidados.imagemUrl).trim() : null,
          ativo: true,
          ingressos: {
            create: ingressosParaCriar,
          },
        },
        include: {
          ingressos: true,
        },
      });
    } catch (dbError: any) {
      console.error("Erro ao criar evento no banco:", dbError);
      console.error("Código do erro:", dbError?.code);
      console.error("Mensagem do erro:", dbError?.message);
      console.error("Meta do erro:", dbError?.meta);
      console.error("Dados que causaram erro:", {
        nome: dadosValidados.nome,
        data: dadosValidados.data,
        local: dadosValidados.local,
        cidade: dadosValidados.cidade,
        ingressosCount: dadosValidados.ingressos.length,
        ingressos: ingressosParaCriar,
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
    if (error?.name === "ZodError" || error?.issues) {
      return NextResponse.json(
        {
          error: "Dados inválidos",
          details: error.errors || error.issues,
          message: "Verifique os dados do formulário",
        },
        { status: 400 }
      );
    }

    // Erro de tipo de dados (preco/quantidade inválidos)
    if (error?.message?.includes("inválido") || error?.message?.includes("Preço") || error?.message?.includes("Quantidade")) {
      return NextResponse.json(
        {
          error: "Dados de ingresso inválidos",
          message: error.message,
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
      error?.code === "P1017" ||
      error?.message?.includes("connect") ||
      error?.message?.includes("connection") ||
      error?.message?.includes("timeout") ||
      error?.message?.includes("Can't reach database") ||
      error?.message?.includes("Connection closed") ||
      error?.message?.includes("Connection terminated")
    ) {
      console.error("Erro de conexão detectado:", error?.code, error?.message);
      return NextResponse.json(
        {
          error: "Erro de conexão com o banco de dados",
          message: "Não foi possível conectar ao banco de dados. Tente novamente em alguns instantes.",
          code: error?.code,
        },
        { status: 503 }
      );
    }

    // Erro de constraint do banco
    if (error?.code === "P2002") {
      return NextResponse.json(
        {
          error: "Já existe um evento com esses dados",
          message: error?.meta?.target ? `Campo duplicado: ${error.meta.target.join(", ")}` : "Dados duplicados",
        },
        { status: 409 }
      );
    }

    // Erro de valor inválido
    if (error?.code === "P2003") {
      return NextResponse.json(
        {
          error: "Erro de referência",
          message: error?.meta?.field_name 
            ? `Campo inválido: ${error.meta.field_name}`
            : "Referência inválida no banco de dados",
        },
        { status: 400 }
      );
    }

    // Erro de valor nulo em campo obrigatório
    if (error?.code === "P2011") {
      return NextResponse.json(
        {
          error: "Campo obrigatório ausente",
          message: error?.meta?.target 
            ? `Campo obrigatório não fornecido: ${error.meta.target}`
            : "Alguns campos obrigatórios não foram fornecidos",
        },
        { status: 400 }
      );
    }

    // Erro de valor inválido para tipo
    if (error?.code === "P2009") {
      return NextResponse.json(
        {
          error: "Tipo de dado inválido",
          message: "Alguns dados estão em formato incorreto",
          details: error?.meta,
        },
        { status: 400 }
      );
    }

    // Outros erros do Prisma
    if (error?.code?.startsWith("P")) {
      console.error("Erro do Prisma não tratado:", {
        code: error.code,
        message: error.message,
        meta: error.meta,
      });
      return NextResponse.json(
        {
          error: "Erro no banco de dados",
          message: error?.message || "Erro ao processar dados no banco",
          code: error?.code,
        },
        { status: 500 }
      );
    }

    // Outros erros
    return NextResponse.json(
      {
        error: "Erro ao criar evento",
        message: error?.message || "Erro desconhecido. Tente novamente.",
        details:
          process.env.NODE_ENV === "development" ? error?.stack : undefined,
        code: error?.code,
      },
      { status: 500 }
    );
  }
}
