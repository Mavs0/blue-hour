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
  } catch (error: any) {
    console.error("Erro ao buscar notificações administrativas:", error);
    
    // Erro de conexão com banco
    if (
      error?.code === "P1001" ||
      error?.code === "P1000" ||
      error?.code === "P1017" ||
      error?.message?.includes("Can't reach database") ||
      error?.message?.includes("Connection")
    ) {
      return NextResponse.json(
        { 
          error: "Erro de conexão com o banco de dados",
          message: "Não foi possível conectar ao banco. Verifique se o projeto Supabase está ativo.",
        },
        { status: 503 }
      );
    }
    
    return NextResponse.json(
      { error: "Erro ao buscar notificações", message: error?.message },
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
  } catch (error: any) {
    console.error("Erro ao marcar notificação como lida:", error);
    
    // Erro de conexão com banco
    if (
      error?.code === "P1001" ||
      error?.code === "P1000" ||
      error?.code === "P1017" ||
      error?.message?.includes("Can't reach database") ||
      error?.message?.includes("Connection")
    ) {
      return NextResponse.json(
        { 
          error: "Erro de conexão com o banco de dados",
          message: "Não foi possível conectar ao banco. Verifique se o projeto Supabase está ativo.",
        },
        { status: 503 }
      );
    }
    
    return NextResponse.json(
      { error: "Erro ao atualizar notificação", message: error?.message },
      { status: 500 }
    );
  }
}
