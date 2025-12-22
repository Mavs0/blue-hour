import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function AdminPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-50 to-pink-50">
      <div className="container mx-auto px-4 py-16">
        <div className="mb-8">
          <Link href="/">
            <Button variant="outline">← Voltar</Button>
          </Link>
        </div>

        <h1 className="text-4xl font-bold mb-8 text-center bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          Área Administrativa
        </h1>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle>📅 Gerenciar Eventos</CardTitle>
              <CardDescription>Criar e editar eventos</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/admin/eventos">
                <Button className="w-full">Acessar</Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle>🎫 Gerenciar Ingressos</CardTitle>
              <CardDescription>
                Configurar tipos e quantidades de ingressos
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/admin/ingressos">
                <Button className="w-full">Acessar</Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle>💰 Vendas</CardTitle>
              <CardDescription>Visualizar e gerenciar vendas</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/admin/vendas">
                <Button className="w-full">Acessar</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
