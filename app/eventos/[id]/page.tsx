import { notFound } from "next/navigation";
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

export default async function EventoDetalhesPage({
  params,
}: {
  params: { id: string };
}) {
  const evento = await prisma.evento.findUnique({
    where: { id: params.id },
    include: {
      ingressos: {
        where: { ativo: true },
        orderBy: { preco: "asc" },
      },
    },
  });

  if (!evento || !evento.ativo) {
    notFound();
  }

  const ingressosDisponiveis = evento.ingressos.filter(
    (ingresso) => ingresso.quantidade - ingresso.vendidos > 0
  );

  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-50 to-pink-50">
      <div className="container mx-auto px-4 py-16">
        <div className="mb-8">
          <Link href="/eventos">
            <Button variant="outline">← Voltar para Eventos</Button>
          </Link>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-3xl">{evento.nome}</CardTitle>
            <CardDescription className="text-lg">
              {new Date(evento.data).toLocaleDateString("pt-BR", {
                weekday: "long",
                day: "2-digit",
                month: "long",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-lg mb-4">
              📍 <strong>Local:</strong> {evento.local}
            </p>
            <p className="text-lg mb-4">
              🏙️ <strong>Cidade:</strong> {evento.cidade}
            </p>
            {evento.descricao && (
              <p className="text-gray-700 mb-6">{evento.descricao}</p>
            )}
          </CardContent>
        </Card>

        <h2 className="text-2xl font-bold mb-6">Ingressos Disponíveis</h2>

        {ingressosDisponiveis.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <p className="text-center text-gray-600">
                Todos os ingressos foram vendidos. 😢
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {ingressosDisponiveis.map((ingresso) => {
              const disponivel = ingresso.quantidade - ingresso.vendidos;
              return (
                <Card
                  key={ingresso.id}
                  className="hover:shadow-lg transition-shadow"
                >
                  <CardHeader>
                    <CardTitle>{ingresso.tipo}</CardTitle>
                    <CardDescription>
                      {disponivel} de {ingresso.quantidade} disponíveis
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-4">
                      <p className="text-3xl font-bold text-purple-600">
                        R$ {ingresso.preco.toFixed(2)}
                      </p>
                    </div>
                    <Link href={`/eventos/${evento.id}/comprar/${ingresso.id}`}>
                      <Button className="w-full">Comprar Ingresso</Button>
                    </Link>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
