import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ComprarIngressoForm } from "@/components/comprar-ingresso-form";

export default async function ComprarIngressoPage({
  params,
}: {
  params: { id: string; ingressoId: string };
}) {
  const evento = await prisma.evento.findUnique({
    where: { id: params.id },
    include: {
      ingressos: {
        where: { id: params.ingressoId },
      },
    },
  });

  if (!evento || !evento.ativo) {
    notFound();
  }

  const ingresso = evento.ingressos[0];

  if (!ingresso || !ingresso.ativo) {
    notFound();
  }

  const disponivel = ingresso.quantidade - ingresso.vendidos;

  if (disponivel <= 0) {
    redirect(`/eventos/${evento.id}`);
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-50 to-pink-50">
      <div className="container mx-auto px-4 py-16 max-w-2xl">
        <div className="mb-8">
          <Link href={`/eventos/${evento.id}`}>
            <Button variant="outline">← Voltar</Button>
          </Link>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Comprar Ingresso</CardTitle>
            <CardDescription>
              {evento.nome} - {ingresso.tipo}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="font-semibold mb-2">Detalhes do Evento</h3>
              <p className="text-sm text-gray-600">
                📅{" "}
                {new Date(evento.data).toLocaleDateString("pt-BR", {
                  weekday: "long",
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
              <p className="text-sm text-gray-600">
                📍 {evento.local} - {evento.cidade}
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Ingresso</h3>
              <p className="text-sm text-gray-600 mb-2">
                Tipo: <strong>{ingresso.tipo}</strong>
              </p>
              <p className="text-sm text-gray-600 mb-2">
                Disponíveis: {disponivel} de {ingresso.quantidade}
              </p>
              <p className="text-2xl font-bold text-purple-600">
                R$ {ingresso.preco.toFixed(2)}
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="mt-6">
          <ComprarIngressoForm
            eventoId={evento.id}
            ingressoId={ingresso.id}
            precoUnitario={ingresso.preco}
            disponivel={disponivel}
          />
        </div>
      </div>
    </main>
  );
}
