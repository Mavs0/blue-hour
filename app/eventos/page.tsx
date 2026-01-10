import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import {
  EventosList,
  type EventoComIngressos,
} from "@/components/eventos/eventos-list";
import { ArrowLeft } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function EventosPage() {
  let eventos: EventoComIngressos[] = [];

  try {
    const eventosData = await prisma.evento.findMany({
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

    // Converter as datas para objetos Date serializáveis
    eventos = eventosData.map((evento) => ({
      ...evento,
      data: evento.data,
      ingressos: evento.ingressos.map((ingresso) => ({
        ...ingresso,
      })),
    }));
  } catch (error) {
    console.error("Erro ao buscar eventos:", error);
    // Continua com array vazio para não quebrar a página
  }

  return (
    <main className="flex flex-col flex-1 bg-gradient-to-b from-purple-50 via-pink-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 min-h-screen">
      <Navbar />
      <div className="flex-1 container mx-auto px-4 py-8 max-w-7xl">
        <div className="mb-6">
          <Link href="/">
            <Button
              variant="outline"
              className="group dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
              Voltar
            </Button>
          </Link>
        </div>
        <EventosList eventos={eventos} />
      </div>
      <Footer />
    </main>
  );
}
