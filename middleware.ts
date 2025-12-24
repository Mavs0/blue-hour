import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const adminSession = request.cookies.get("admin_session");

  // Criar resposta
  const response = NextResponse.next();

  // Adicionar header com pathname para uso no layout
  response.headers.set("x-pathname", pathname);

  // Permitir acesso à página de login sem autenticação
  if (pathname === "/admin/login") {
    // Se já estiver autenticado, redirecionar para o dashboard
    if (adminSession) {
      const url = request.nextUrl.clone();
      url.pathname = "/admin";
      return NextResponse.redirect(url);
    }
    // Permitir acesso à página de login
    return response;
  }

  // Proteger todas as outras rotas /admin
  if (pathname.startsWith("/admin")) {
    if (!adminSession) {
      const url = request.nextUrl.clone();
      url.pathname = "/admin/login";
      return NextResponse.redirect(url);
    }
  }

  return response;
}

export const config = {
  matcher: ["/admin/:path*"],
};
