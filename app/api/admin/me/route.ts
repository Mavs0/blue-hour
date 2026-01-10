import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const session = cookieStore.get("admin_session");

    if (!session) {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
    }

    // Por enquanto, retornamos apenas que está autenticado
    // Em uma implementação real, você poderia armazenar o username na sessão
    return NextResponse.json({
      authenticated: true,
      username: "admin", // Placeholder - pode ser melhorado armazenando na sessão
    });
  } catch (error) {
    console.error("Erro ao obter informações do usuário:", error);
    return NextResponse.json(
      { error: "Erro ao obter informações" },
      { status: 500 }
    );
  }
}
