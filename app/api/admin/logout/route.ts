import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const response = NextResponse.json({ success: true });
    response.cookies.delete("admin_session");
    return response;
  } catch (error) {
    console.error("Erro ao fazer logout:", error);
    return NextResponse.json(
      { error: "Erro ao processar logout" },
      { status: 500 }
    );
  }
}
