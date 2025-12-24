import { AdminLayoutClient } from "@/components/admin/admin-layout-client";
import { isAuthenticated } from "@/lib/auth";
import { headers } from "next/headers";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Obter pathname do header adicionado pelo middleware
  const headersList = await headers();
  const pathname = headersList.get("x-pathname") || "";

  // Se estiver na página de login, retornar apenas o children sem o layout admin
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  // Para outras rotas admin, verificar autenticação
  const authenticated = await isAuthenticated();

  // Se não estiver autenticado, retornar apenas children (middleware já redirecionou)
  if (!authenticated) {
    return <>{children}</>;
  }

  // Se estiver autenticado, aplicar o layout admin
  return <AdminLayoutClient>{children}</AdminLayoutClient>;
}
