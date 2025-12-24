import { NextRequest, NextResponse } from "next/server";
import { validateCredentials } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json(
        { error: "Usuário e senha são obrigatórios" },
        { status: 400 }
      );
    }

    const isValid = validateCredentials(username, password);

    if (isValid) {
      const sessionToken =
        Math.random().toString(36).substring(2, 15) +
        Math.random().toString(36).substring(2, 15) +
        Date.now().toString(36);

      const response = NextResponse.json({ success: true });
      response.cookies.set("admin_session", sessionToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7, // 7 dias
        path: "/",
      });

      return response;
    } else {
      return NextResponse.json(
        { error: "Credenciais inválidas" },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error("Erro ao fazer login:", error);
    return NextResponse.json(
      { error: "Erro ao processar login" },
      { status: 500 }
    );
  }
}
