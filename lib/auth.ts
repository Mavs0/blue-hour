import { cookies } from "next/headers";
import { redirect } from "next/navigation";

// Lista de usuários admin autorizados
const ADMIN_USERS: Record<string, string> = {
  "manuela.alves": "admin123",
  "hilda.luiza": "admin123",
  "janaina.almada": "admin123",
  "aliane.pacheco": "admin123",
  "gabriel.malcher": "admin123",
  // Usuário padrão (pode ser removido se não for mais necessário)
  ...(process.env.ADMIN_USERNAME && process.env.ADMIN_PASSWORD
    ? { [process.env.ADMIN_USERNAME]: process.env.ADMIN_PASSWORD }
    : {}),
};

export function validateCredentials(
  username: string,
  password: string
): boolean {
  // Verificar se o usuário existe e se a senha está correta
  return ADMIN_USERS[username] === password;
}

export async function isAuthenticated(): Promise<boolean> {
  try {
    const cookieStore = await cookies();
    const session = cookieStore.get("admin_session");
    return !!session?.value;
  } catch {
    return false;
  }
}

export async function requireAuth() {
  const authenticated = await isAuthenticated();
  if (!authenticated) {
    redirect("/admin/login");
  }
}
