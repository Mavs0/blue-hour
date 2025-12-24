import { AdminLayoutClient } from "@/components/admin/admin-layout-client";
import { requireAuth } from "@/lib/auth";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAuth();
  return <AdminLayoutClient>{children}</AdminLayoutClient>;
}
