import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAuthenticated } from "@/lib/auth";

export const dynamic = "force-dynamic";

// GET - Buscar notificações administrativas
export async function GET(request: NextRequest) {
  try {
    // Verificar autenticação
    const authenticated = await isAuthenticated();
    if (!authenticated) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const apenasNaoLidas = searchParams.get("apenasNaoLidas") === "true";
    const limit = parseInt(searchParams.get("limit") || "50");

    const where: any = {};
    if (apenasNaoLidas) {
      where.lida = false;
    }

    const notificacoes = await prisma.notificacaoAdmin.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: limit,
    });

    const naoLidasCount = await prisma.notificacaoAdmin.count({
      where: { lida: false },
    });

    return NextResponse.json({
      notificacoes,
      naoLidasCount,
    });
  } catch (error) {
    console.error("Erro ao buscar notificações administrativas:", error);
    return NextResponse.json(
      { error: "Erro ao buscar notificações" },
      { status: 500 }
    );
  }
}

// POST - Marcar notificação como lida
export async function POST(request: NextRequest) {
  try {
    // Verificar autenticação
    const authenticated = await isAuthenticated();
    if (!authenticated) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const body = await request.json();
    const { notificacaoId } = body;

    if (!notificacaoId) {
      return NextResponse.json(
        { error: "ID da notificação é obrigatório" },
        { status: 400 }
      );
    }

    await prisma.notificacaoAdmin.update({
      where: { id: notificacaoId },
      data: { lida: true },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erro ao marcar notificação como lida:", error);
    return NextResponse.json(
      { error: "Erro ao atualizar notificação" },
      { status: 500 }
    );
  }
}
