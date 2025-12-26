import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import {
  Calendar,
  MapPin,
  Ticket,
  ArrowLeft,
  ArrowRight,
  Clock,
  PartyPopper,
} from "lucide-react";

export const dynamic = "force-dynamic";

type EventoComIngressos = {
  id: string;
  nome: string;
  descricao: string | null;
  data: Date;
  local: string;
  cidade: string;
  imagemUrl: string | null;
  ativo: boolean;
  ingressos: Array<{
    id: string;
    tipo: string;
    preco: number;
    quantidade: number;
    vendidos: number;
    ativo: boolean;
  }>;
};

export default async function EventosPage() {
  let eventos: EventoComIngressos[] = [];

  try {
    eventos = await prisma.evento.findMany({
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
  } catch (error) {
    console.error("Erro ao buscar eventos:", error);
    // Continua com array vazio para não quebrar a página
  }

  const ingressosDisponiveis = (evento: EventoComIngressos) => {
    return evento.ingressos.reduce(
      (total, ingresso) =>
        total + Math.max(0, ingresso.quantidade - ingresso.vendidos),
      0
    );
  };

  return (
    <main className="flex flex-col flex-1 bg-gradient-to-b from-purple-50 to-pink-50 dark:from-gray-900 dark:to-gray-800">
      <Navbar />
      <div className="flex-1 container mx-auto px-4 py-24 max-w-7xl">
        <div className="mb-8">
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

        <div className="mb-12 text-center">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 dark:from-purple-400 dark:via-pink-400 dark:to-purple-400 bg-clip-text text-transparent animate-gradient">
            Eventos Disponíveis
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Descubra os melhores eventos de K-POP em Manaus
          </p>
        </div>

        {eventos.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 px-4 min-h-[60vh]">
            <div className="relative mb-8 w-full max-w-md">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full blur-3xl opacity-20 animate-pulse"></div>
              <div className="relative flex justify-center">
                <div className="bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 p-8 rounded-full">
                  <PartyPopper className="w-20 h-20 text-purple-600 dark:text-purple-400" />
                </div>
              </div>
            </div>
            <div className="text-center max-w-lg mx-auto">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Nenhum evento disponível no momento
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
                Estamos preparando eventos incríveis para você! Fique atento às
                novidades.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/">
                  <Button className="bg-gradient-to-r from-sky-500 to-pink-500 hover:from-sky-600 hover:to-pink-600">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Voltar para Início
                  </Button>
                </Link>
                <Link href="/notificacoes">
                  <Button
                    variant="outline"
                    className="dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
                  >
                    <Ticket className="w-4 h-4 mr-2" />
                    Ativar Notificações
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {eventos.map((evento) => {
              const disponiveis = ingressosDisponiveis(evento);
              const dataEvento = new Date(evento.data);
              const hoje = new Date();
              const diasRestantes = Math.ceil(
                (dataEvento.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24)
              );

              return (
                <Card
                  key={evento.id}
                  className="group hover:shadow-xl dark:hover:shadow-2xl transition-all duration-300 overflow-hidden dark:bg-gray-800 dark:border-gray-700 hover:scale-105"
                >
                  {evento.imagemUrl && (
                    <div className="relative h-48 w-full overflow-hidden">
                      <Image
                        src={evento.imagemUrl}
                        alt={evento.nome}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-300"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                      {disponiveis > 0 && (
                        <div className="absolute top-4 right-4 bg-green-500 dark:bg-green-600 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                          <Ticket className="w-3 h-3" />
                          {disponiveis} disponíveis
                        </div>
                      )}
                      {disponiveis === 0 && (
                        <div className="absolute top-4 right-4 bg-red-500 dark:bg-red-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
                          Esgotado
                        </div>
                      )}
                    </div>
                  )}
                  <CardHeader>
                    <CardTitle className="text-xl dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                      {evento.nome}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-2 dark:text-gray-400">
                      <Calendar className="w-4 h-4" />
                      {dataEvento.toLocaleDateString("pt-BR", {
                        day: "2-digit",
                        month: "long",
                        year: "numeric",
                      })}
                    </CardDescription>
                    <CardDescription className="flex items-center gap-2 dark:text-gray-400">
                      <Clock className="w-4 h-4" />
                      {dataEvento.toLocaleTimeString("pt-BR", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0 text-purple-600 dark:text-purple-400" />
                      <div>
                        <p className="font-medium">{evento.local}</p>
                        <p className="text-xs">{evento.cidade}</p>
                      </div>
                    </div>
                    {evento.descricao && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                        {evento.descricao}
                      </p>
                    )}
                    <div className="flex items-center justify-between pt-4 border-t dark:border-gray-700">
                      <div className="flex items-center gap-2">
                        <Ticket className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                        <span className="text-sm font-semibold dark:text-gray-300">
                          {evento.ingressos.length}{" "}
                          {evento.ingressos.length === 1 ? "tipo" : "tipos"}
                        </span>
                      </div>
                      <Link href={`/eventos/${evento.id}`}>
                        <Button className="bg-gradient-to-r from-sky-500 to-pink-500 hover:from-sky-600 hover:to-pink-600 group/btn">
                          Ver Detalhes
                          <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                        </Button>
                      </Link>
                    </div>
                    {diasRestantes > 0 && diasRestantes <= 30 && (
                      <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-2 text-center">
                        <p className="text-xs text-purple-700 dark:text-purple-300 font-medium">
                          {diasRestantes === 1
                            ? "Amanhã!"
                            : `${diasRestantes} dias restantes`}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
      <Footer />
    </main>
  );
}
