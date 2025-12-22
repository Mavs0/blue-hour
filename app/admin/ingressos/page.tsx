import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function AdminIngressosPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-50 to-pink-50">
      <div className="container mx-auto px-4 py-16">
        <div className="mb-8">
          <Link href="/admin">
            <Button variant="outline">← Voltar</Button>
          </Link>
        </div>

        <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          Gerenciar Ingressos
        </h1>

        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-gray-600">
              Sistema de gerenciamento de ingressos em desenvolvimento.
            </p>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
