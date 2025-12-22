import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function AdminEventosPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-50 to-pink-50">
      <div className="container mx-auto px-4 py-16">
        <div className="mb-8">
          <Link href="/admin">
            <Button variant="outline">← Voltar</Button>
          </Link>
        </div>

        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Gerenciar Eventos
          </h1>
          <Button>+ Novo Evento</Button>
        </div>

        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-gray-600">
              Sistema de gerenciamento de eventos em desenvolvimento.
            </p>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
