import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const ADMIN_USERNAME = process.env.ADMIN_USERNAME || "admin";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123";

export function validateCredentials(
  username: string,
  password: string
): boolean {
  return username === ADMIN_USERNAME && password === ADMIN_PASSWORD;
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
