import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET - Buscar notificações por email ou CPF
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const email = searchParams.get("email");
    const cpf = searchParams.get("cpf");
    const apenasNaoLidas = searchParams.get("apenasNaoLidas") === "true";

    if (!email && !cpf) {
      return NextResponse.json(
        { error: "Email ou CPF é obrigatório" },
        { status: 400 }
      );
    }

    // Buscar cliente
    const cliente = await prisma.cliente.findFirst({
      where: {
        OR: [
          ...(email ? [{ email }] : []),
          ...(cpf ? [{ cpf: cpf.replace(/\D/g, "") }] : []),
        ],
      },
    });

    if (!cliente) {
      return NextResponse.json(
        { error: "Cliente não encontrado" },
        { status: 404 }
      );
    }

    // Buscar notificações
    const where: any = {
      clienteId: cliente.id,
    };

    if (apenasNaoLidas) {
      where.lida = false;
    }

    const notificacoes = await prisma.notificacao.findMany({
      where,
      orderBy: {
        createdAt: "desc",
      },
      take: 50, // Limitar a 50 notificações mais recentes
    });

    // Contar não lidas
    const naoLidasCount = await prisma.notificacao.count({
      where: {
        clienteId: cliente.id,
        lida: false,
      },
    });

    return NextResponse.json({
      notificacoes: notificacoes.map((notif) => ({
        id: notif.id,
        titulo: notif.titulo,
        mensagem: notif.mensagem,
        tipo: notif.tipo,
        lida: notif.lida,
        link: notif.link,
        createdAt: notif.createdAt,
      })),
      naoLidasCount,
    });
  } catch (error) {
    console.error("Erro ao buscar notificações:", error);
    return NextResponse.json(
      { error: "Erro ao buscar notificações" },
      { status: 500 }
    );
  }
}

// POST - Marcar notificação como lida
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { notificacaoId, email, cpf, marcarTodas } = body;

    if (!email && !cpf) {
      return NextResponse.json(
        { error: "Email ou CPF é obrigatório" },
        { status: 400 }
      );
    }

    // Buscar cliente
    const cliente = await prisma.cliente.findFirst({
      where: {
        OR: [
          ...(email ? [{ email }] : []),
          ...(cpf ? [{ cpf: cpf.replace(/\D/g, "") }] : []),
        ],
      },
    });

    if (!cliente) {
      return NextResponse.json(
        { error: "Cliente não encontrado" },
        { status: 404 }
      );
    }

    if (marcarTodas) {
      // Marcar todas como lidas
      await prisma.notificacao.updateMany({
        where: {
          clienteId: cliente.id,
          lida: false,
        },
        data: {
          lida: true,
        },
      });

      return NextResponse.json({
        message: "Todas as notificações foram marcadas como lidas",
      });
    } else {
      // Marcar uma específica como lida
      if (!notificacaoId) {
        return NextResponse.json(
          { error: "ID da notificação é obrigatório" },
          { status: 400 }
        );
      }

      const notificacao = await prisma.notificacao.update({
        where: {
          id: notificacaoId,
          clienteId: cliente.id, // Garantir que a notificação pertence ao cliente
        },
        data: {
          lida: true,
        },
      });

      if (!notificacao) {
        return NextResponse.json(
          { error: "Notificação não encontrada" },
          { status: 404 }
        );
      }

      return NextResponse.json({
        message: "Notificação marcada como lida",
      });
    }
  } catch (error) {
    console.error("Erro ao atualizar notificação:", error);
    return NextResponse.json(
      { error: "Erro ao atualizar notificação" },
      { status: 500 }
    );
  }
}
