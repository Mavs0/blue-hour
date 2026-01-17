import { notFound } from "next/navigation";
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
import { CompartilharEvento } from "@/components/eventos/compartilhar-evento";
import {
  Calendar,
  MapPin,
  Clock,
  Ticket,
  ArrowLeft,
  Sparkles,
  Users,
  Gift,
  ExternalLink,
  TrendingUp,
  AlertCircle,
} from "lucide-react";
import { Metadata } from "next";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  try {
    const evento = await prisma.evento.findUnique({
      where: { id: params.id },
      include: {
        ingressos: {
          where: { ativo: true },
        },
      },
    });

    if (!evento || !evento.ativo) {
      return {
        title: "Evento não encontrado",
      };
    }

    const precoMinimo = Math.min(
      ...evento.ingressos.map((i) => i.preco),
      Infinity
    );
    const precoFormatado =
      precoMinimo !== Infinity ? `A partir de R$ ${precoMinimo.toFixed(2)}` : "";

    return {
      title: `${evento.nome} | Blue Hour`,
      description:
        evento.descricao ||
        `Confira os detalhes do evento ${evento.nome}. ${precoFormatado}`,
      openGraph: {
        title: evento.nome,
        description: evento.descricao || `Evento em ${evento.local}`,
        images: evento.imagemUrl ? [evento.imagemUrl] : [],
        type: "website",
      },
      twitter: {
        card: "summary_large_image",
        title: evento.nome,
        description: evento.descricao || `Evento em ${evento.local}`,
        images: evento.imagemUrl ? [evento.imagemUrl] : [],
      },
    };
  } catch (error) {
    return {
      title: "Evento | Blue Hour",
    };
  }
}

export default async function EventoDetalhesPage({
  params,
}: {
  params: { id: string };
}) {
  let evento = null;

  try {
    evento = await prisma.evento.findUnique({
      where: { id: params.id },
      include: {
        ingressos: {
          where: { ativo: true },
          orderBy: { preco: "asc" },
        },
      },
    });
  } catch (error) {
    console.error("Erro ao buscar evento:", error);
    notFound();
  }

  if (!evento || !evento.ativo) {
    notFound();
  }

  const ingressosDisponiveis = evento.ingressos.filter(
    (ingresso) => ingresso.quantidade - ingresso.vendidos > 0
  );

  const dataFormatada = new Date(evento.data).toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const dataHora = new Date(evento.data);
  const agora = new Date();
  const diasRestantes = Math.ceil(
    (dataHora.getTime() - agora.getTime()) / (1000 * 60 * 60 * 24)
  );

  // Estatísticas do evento
  const totalIngressos = evento.ingressos.reduce(
    (acc, ing) => acc + ing.quantidade,
    0
  );
  const totalVendidos = evento.ingressos.reduce(
    (acc, ing) => acc + ing.vendidos,
    0
  );
  const totalDisponiveis = totalIngressos - totalVendidos;
  const percentualVendido = totalIngressos > 0 
    ? (totalVendidos / totalIngressos) * 100 
    : 0;

  // Status do evento
  const estaEsgotado = ingressosDisponiveis.length === 0;
  const estaQuaseEsgotado = percentualVendido >= 80 && !estaEsgotado;
  const eventoPassou = dataHora < agora;

  // Link para Google Maps
  const enderecoCompleto = `${evento.local}, ${evento.cidade}`;
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    enderecoCompleto
  )}`;

  return (
    <main className="flex flex-col min-h-screen bg-gradient-to-b from-purple-50 via-pink-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Navbar />
      <div className="flex-1 w-full">
        {/* Hero Section com Imagem */}
        {evento.imagemUrl ? (
          <div className="relative w-full h-[400px] md:h-[500px] lg:h-[600px] overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-gray-900/50 to-transparent z-10" />
            <Image
              src={evento.imagemUrl}
              alt={evento.nome}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 z-20 flex flex-col justify-end p-6 md:p-12">
              <div className="max-w-7xl mx-auto w-full">
                <Link href="/eventos">
                  <Button
                    variant="outline"
                    size="sm"
                    className="mb-6 bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20 dark:bg-gray-900/20 dark:border-gray-700/50"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Voltar
                  </Button>
                </Link>
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="w-6 h-6 text-purple-400" />
                  <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white drop-shadow-lg">
                    {evento.nome}
                  </h1>
                </div>
                <div className="flex flex-wrap items-center gap-4 text-white/90">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    <span className="text-lg">{dataFormatada}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-5 h-5" />
                    <span className="text-lg">
                      {evento.local} - {evento.cidade}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 dark:from-purple-900 dark:via-pink-900 dark:to-purple-900 py-16 md:py-24">
            <div className="container mx-auto px-4 max-w-7xl">
              <Link href="/eventos">
                <Button
                  variant="outline"
                  className="mb-6 bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20 dark:bg-gray-900/20 dark:border-gray-700/50"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Voltar
                </Button>
              </Link>
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-6 h-6 text-white" />
                <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white">
                  {evento.nome}
                </h1>
              </div>
              <div className="flex flex-wrap items-center gap-4 text-white/90">
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  <span className="text-lg">{dataFormatada}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  <span className="text-lg">
                    {evento.local} - {evento.cidade}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="container mx-auto px-4 py-8 md:py-12 max-w-7xl">
          {/* Badge de Status */}
          {estaEsgotado && (
            <div className="mb-6">
              <Card className="bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
                    <div>
                      <p className="font-semibold text-red-900 dark:text-red-200">
                        Evento Esgotado
                      </p>
                      <p className="text-sm text-red-700 dark:text-red-300">
                        Todos os ingressos foram vendidos
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
          {estaQuaseEsgotado && !estaEsgotado && (
            <div className="mb-6">
              <Card className="bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <TrendingUp className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
                    <div>
                      <p className="font-semibold text-yellow-900 dark:text-yellow-200">
                        Últimos Ingressos!
                      </p>
                      <p className="text-sm text-yellow-700 dark:text-yellow-300">
                        Restam apenas {totalDisponiveis} ingressos disponíveis
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
          {eventoPassou && (
            <div className="mb-6">
              <Card className="bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <Clock className="w-6 h-6 text-gray-600 dark:text-gray-400" />
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-gray-200">
                        Evento Realizado
                      </p>
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        Este evento já aconteceu
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Compartilhar e Estatísticas */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
            <CompartilharEvento nome={evento.nome} url={`/eventos/${evento.id}`} />
            {totalIngressos > 0 && (
              <Card className="dark:bg-gray-800 dark:border-gray-700">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                        {totalVendidos}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Vendidos
                      </p>
                    </div>
                    <div className="h-12 w-px bg-gray-300 dark:bg-gray-700" />
                    <div className="text-center">
                      <p className="text-2xl font-bold text-pink-600 dark:text-pink-400">
                        {totalDisponiveis}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Disponíveis
                      </p>
                    </div>
                    <div className="h-12 w-px bg-gray-300 dark:bg-gray-700" />
                    <div className="text-center">
                      <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                        {totalIngressos}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Total
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Informações Adicionais */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <Card className="dark:bg-gray-800 dark:border-gray-700 border-l-4 border-l-purple-500">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                    <Calendar className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Data do Evento
                    </p>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {new Date(evento.data).toLocaleDateString("pt-BR", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="dark:bg-gray-800 dark:border-gray-700 border-l-4 border-l-pink-500">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-pink-100 dark:bg-pink-900/30 rounded-lg">
                    <Clock className="w-6 h-6 text-pink-600 dark:text-pink-400" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Horário
                    </p>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {new Date(evento.data).toLocaleTimeString("pt-BR", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="dark:bg-gray-800 dark:border-gray-700 border-l-4 border-l-blue-500">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                    <MapPin className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Localização
                    </p>
                    <p className="font-semibold text-gray-900 dark:text-white mb-1">
                      {evento.local}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                      {evento.cidade}
                    </p>
                    <a
                      href={googleMapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                    >
                      Ver no mapa
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Descrição */}
          {evento.descricao && (
            <Card className="mb-8 dark:bg-gray-800 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 dark:text-white">
                  <Sparkles className="w-5 h-5 text-purple-500" />
                  Sobre o Evento
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg">
                  {evento.descricao}
                </p>
              </CardContent>
            </Card>
          )}

          {/* Contador de Dias */}
          {diasRestantes > 0 && (
            <Card className="mb-8 bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-800 dark:to-pink-800 border-0 text-white">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm opacity-90 mb-1">
                      {diasRestantes === 1
                        ? "O evento é amanhã!"
                        : `Faltam ${diasRestantes} dias para o evento`}
                    </p>
                    <p className="text-2xl font-bold">
                      Não perca essa oportunidade!
                    </p>
                  </div>
                  <div className="hidden md:block">
                    <Clock className="w-16 h-16 opacity-50" />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Título Seção Ingressos */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Ticket className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                Ingressos Disponíveis
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Escolha o ingresso ideal para você
              </p>
            </div>
          </div>

          {/* Cards de Ingressos */}
          {ingressosDisponiveis.length === 0 ? (
            <Card className="dark:bg-gray-800 dark:border-gray-700">
              <CardContent className="pt-12 pb-12">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-700 mb-4">
                    <Ticket className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    Todos os ingressos foram vendidos
                  </p>
                  <p className="text-gray-600 dark:text-gray-400">
                    Que pena! Este evento está esgotado. 😢
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {ingressosDisponiveis.map((ingresso, index) => {
                const disponivel = ingresso.quantidade - ingresso.vendidos;
                const percentualDisponivel =
                  (disponivel / ingresso.quantidade) * 100;
                const isPopular = index === 0; // Primeiro ingresso (mais barato) é popular

                return (
                  <Card
                    key={ingresso.id}
                    className={`group relative overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 dark:bg-gray-800 dark:border-gray-700 ${
                      isPopular
                        ? "border-2 border-purple-500 dark:border-purple-600 shadow-lg"
                        : ""
                    }`}
                  >
                    {isPopular && (
                      <div className="absolute top-0 right-0 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
                        Mais Popular
                      </div>
                    )}
                    <CardHeader className="pb-4">
                      <div className="flex items-start justify-between mb-2">
                        <CardTitle className="text-xl dark:text-white">
                          {ingresso.tipo}
                        </CardTitle>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Users className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                        <CardDescription className="dark:text-gray-400">
                          {disponivel} de {ingresso.quantidade} disponíveis
                        </CardDescription>
                      </div>
                      {/* Barra de disponibilidade */}
                      <div className="mt-3 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all ${
                            percentualDisponivel > 50
                              ? "bg-green-500"
                              : percentualDisponivel > 20
                              ? "bg-yellow-500"
                              : "bg-red-500"
                          }`}
                          style={{ width: `${percentualDisponivel}%` }}
                        />
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                          Preço
                        </p>
                        <p className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent dark:from-purple-400 dark:to-pink-400">
                          R$ {ingresso.preco.toFixed(2)}
                        </p>
                      </div>

                      {ingresso.kit && (
                        <div className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/30 dark:to-pink-900/30 rounded-lg border border-purple-200 dark:border-purple-800">
                          <div className="flex items-center gap-2 mb-2">
                            <Gift className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                            <p className="text-sm font-semibold text-purple-900 dark:text-purple-200">
                              Kit Incluído
                            </p>
                          </div>
                          <p className="text-sm text-purple-800 dark:text-purple-300 whitespace-pre-line leading-relaxed">
                            {ingresso.kit}
                          </p>
                        </div>
                      )}

                      <Link
                        href={`/eventos/${evento.id}/comprar/${ingresso.id}`}
                      >
                        <Button
                          className={`w-full group ${
                            isPopular
                              ? "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                              : "dark:bg-purple-600 dark:hover:bg-purple-700"
                          }`}
                        >
                          <span className="flex items-center justify-center gap-2">
                            Comprar Agora
                            <ArrowLeft className="w-4 h-4 rotate-180 group-hover:translate-x-1 transition-transform" />
                          </span>
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </main>
  );
}
