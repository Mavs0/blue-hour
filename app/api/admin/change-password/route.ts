import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { validateCredentials } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const session = cookieStore.get("admin_session");

    if (!session) {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
    }

    const body = await request.json();
    const { currentPassword, newPassword } = body;

    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { error: "Senha atual e nova senha são obrigatórias" },
        { status: 400 }
      );
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { error: "A nova senha deve ter pelo menos 6 caracteres" },
        { status: 400 }
      );
    }

    // Por enquanto, não podemos alterar a senha porque ela está hardcoded
    // Em uma implementação real, você precisaria de um sistema de usuários no banco
    return NextResponse.json(
      {
        error:
          "A alteração de senha não está disponível no momento. Entre em contato com o administrador do sistema.",
      },
      { status: 501 }
    );
  } catch (error) {
    console.error("Erro ao alterar senha:", error);
    return NextResponse.json(
      { error: "Erro ao alterar senha" },
      { status: 500 }
    );
  }
}
