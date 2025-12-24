import Link from "next/link";
import { prisma } from "@/lib/prisma";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

export default async function EventosPage() {
  const eventos = await prisma.evento.findMany({
    where: { ativo: true },
    include: {
      ingressos: {
        where: { ativo: true },
      },
    },
    orderBy: {
      data: "asc",
    },
  });

  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-50 to-pink-50">
      <div className="container mx-auto px-4 py-16">
        <div className="mb-8">
          <Link href="/">
            <Button variant="outline">← Voltar</Button>
          </Link>
        </div>

        <h1 className="text-4xl font-bold mb-8 text-center bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          Eventos Disponíveis
        </h1>

        {eventos.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-xl text-gray-600 mb-4">
              Nenhum evento disponível no momento.
            </p>
            <p className="text-gray-500">
              Fique atento para novos eventos em breve!
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {eventos.map((evento) => (
              <Card
                key={evento.id}
                className="hover:shadow-lg transition-shadow"
              >
                <CardHeader>
                  <CardTitle>{evento.nome}</CardTitle>
                  <CardDescription>
                    {new Date(evento.data).toLocaleDateString("pt-BR", {
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4">
                    📍 {evento.local} - {evento.cidade}
                  </p>
                  {evento.descricao && (
                    <p className="text-sm text-gray-500 mb-4 line-clamp-2">
                      {evento.descricao}
                    </p>
                  )}
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-semibold">
                      {evento.ingressos.length} tipo(s) de ingresso
                    </span>
                    <Link href={`/eventos/${evento.id}`}>
                      <Button>Ver Detalhes</Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
