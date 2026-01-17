"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Calendar,
  MapPin,
  Ticket,
  ArrowRight,
  Clock,
  Users,
  Sparkles,
} from "lucide-react";
import { useI18n } from "@/components/providers/i18n-provider";
import { Carousel } from "@/components/ui/carousel";

export type EventoComIngressos = {
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

type EventsSectionProps = {
  eventos: EventoComIngressos[];
};

export function EventsSection({ eventos }: EventsSectionProps) {
  const { t, locale } = useI18n();

  const formatarData = (data: Date) => {
    return new Date(data).toLocaleDateString(
      locale === "pt-BR" ? "pt-BR" : locale === "en-US" ? "en-US" : "es-ES",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  const formatarHora = (data: Date) => {
    return new Date(data).toLocaleTimeString(
      locale === "pt-BR" ? "pt-BR" : locale === "en-US" ? "en-US" : "es-ES",
      {
        hour: "2-digit",
        minute: "2-digit",
      }
    );
  };

  const obterPrecoMinimo = (ingressos: Array<{ preco: number }>) => {
    if (ingressos.length === 0) return null;
    const precos = ingressos.map((i) => i.preco);
    return Math.min(...precos);
  };

  return (
    <section id="eventos" className="py-20 bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-12">
          <div className="mb-6 md:mb-0">
            <div className="inline-flex items-center gap-2 mb-4">
              <Sparkles className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">
                <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  {t("home.events.title")}
                </span>
              </h2>
            </div>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl">
              {t("home.events.subtitle")}
            </p>
          </div>
          <Link href="/eventos" className="hidden md:block">
            <Button
              variant="outline"
              className="border-purple-300 dark:border-purple-700 text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20"
            >
              {t("home.events.viewAll")}
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </Link>
        </div>

        {eventos.length === 0 ? (
          <div className="text-center py-20 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-800 dark:to-gray-700 rounded-2xl border-2 border-purple-200 dark:border-purple-800">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-purple-100 dark:bg-purple-900/30 mb-6">
              <Ticket className="w-10 h-10 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
              {t("home.events.none")}
            </h3>
            <p className="text-gray-600 dark:text-gray-300 max-w-md mx-auto">
              {t("home.events.noneDesc")}
            </p>
          </div>
        ) : (
          <Carousel
            autoPlay={true}
            interval={5000}
            showArrows={true}
            showDots={true}
            className="mb-8"
          >
            {eventos.map((evento) => {
              const precoMinimo = obterPrecoMinimo(evento.ingressos);
              const ingressosDisponiveis = evento.ingressos.reduce(
                (acc, ing) => acc + (ing.quantidade - ing.vendidos),
                0
              );

              return (
                <Card
                  key={evento.id}
                  className="group h-full hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-600 overflow-hidden bg-white dark:bg-gray-800"
                >
                  {evento.imagemUrl && (
                    <div className="relative h-40 bg-gradient-to-br from-purple-500 to-pink-500 overflow-hidden">
                      <Image
                        src={evento.imagemUrl}
                        alt={evento.nome}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                      <div className="absolute top-3 right-3 z-10">
                        {ingressosDisponiveis > 0 ? (
                          <span className="px-2.5 py-1 bg-green-500 text-white text-xs font-bold rounded-full shadow-lg backdrop-blur-sm">
                            {t("home.events.available")}
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 bg-red-500 text-white text-xs font-bold rounded-full shadow-lg backdrop-blur-sm">
                            {t("home.events.soldOut")}
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                  {!evento.imagemUrl && (
                    <div className="relative h-40 bg-gradient-to-br from-purple-500 via-pink-500 to-purple-600 flex items-center justify-center">
                      <Ticket className="w-16 h-16 text-white/30" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                      <div className="absolute top-3 right-3 z-10">
                        {ingressosDisponiveis > 0 ? (
                          <span className="px-2.5 py-1 bg-green-500 text-white text-xs font-bold rounded-full shadow-lg backdrop-blur-sm">
                            {t("home.events.available")}
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 bg-red-500 text-white text-xs font-bold rounded-full shadow-lg backdrop-blur-sm">
                            {t("home.events.soldOut")}
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  <CardHeader className="pb-3 px-4 pt-4">
                    <CardTitle className="text-lg font-bold text-gray-900 dark:text-white line-clamp-2 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors mb-2">
                      {evento.nome}
                    </CardTitle>
                    <CardDescription className="flex flex-col gap-1.5">
                      <div className="flex items-center gap-1.5 text-xs">
                        <Calendar className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400 flex-shrink-0" />
                        <span className="text-gray-600 dark:text-gray-400">
                          {formatarData(evento.data)}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs">
                        <Clock className="w-3.5 h-3.5 text-pink-600 dark:text-pink-400 flex-shrink-0" />
                        <span className="text-gray-600 dark:text-gray-400">
                          {formatarHora(evento.data)}
                        </span>
                      </div>
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="pt-0 px-4 pb-4 flex flex-col flex-1">
                    <div className="flex items-start gap-1.5 mb-3 text-xs">
                      <MapPin className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-600 dark:text-gray-400 line-clamp-1">
                        {evento.local} - {evento.cidade}
                      </span>
                    </div>

                    {evento.descricao && (
                      <p className="text-xs text-gray-600 dark:text-gray-400 mb-4 line-clamp-2 flex-1">
                        {evento.descricao}
                      </p>
                    )}

                    <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-700 mt-auto">
                      <div>
                        {precoMinimo !== null ? (
                          <div>
                            <span className="text-xs text-gray-500 dark:text-gray-400 mb-0.5 block">
                              {t("home.events.fromPrice")}
                            </span>
                            <div className="text-lg font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                              R$ {precoMinimo.toFixed(2).replace(".", ",")}
                            </div>
                          </div>
                        ) : (
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            {t("home.events.pricesSoon")}
                          </div>
                        )}
                      </div>
                      <Link href={`/eventos/${evento.id}`}>
                        <Button
                          size="sm"
                          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white text-xs px-3 py-1.5 h-auto shadow-md hover:shadow-lg transition-all duration-300"
                          disabled={ingressosDisponiveis === 0}
                        >
                          {ingressosDisponiveis > 0
                            ? t("home.events.buy")
                            : t("home.events.soldOut")}
                          <ArrowRight className="ml-1 w-3 h-3" />
                        </Button>
                      </Link>
                    </div>

                    {evento.ingressos.length > 0 && (
                      <div className="mt-3 flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400 pt-2 border-t border-gray-100 dark:border-gray-700">
                        <Ticket className="w-3 h-3 text-purple-600 dark:text-purple-400" />
                        <span>
                          {evento.ingressos.length}{" "}
                          {evento.ingressos.length > 1
                            ? t("home.events.ticketTypesPlural")
                            : t("home.events.ticketTypes")}
                        </span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </Carousel>
        )}

        {eventos.length > 0 && (
          <div className="mt-8 text-center md:hidden">
            <Link href="/eventos">
              <Button
                variant="outline"
                className="w-full border-gray-300 dark:border-gray-700"
              >
                {t("home.events.viewAllMobile")}
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
