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
} from "lucide-react";
import { useI18n } from "@/components/providers/i18n-provider";

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
    <section id="eventos" className="py-16 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
              {t("home.events.title")}
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              {t("home.events.subtitle")}
            </p>
          </div>
          <Link href="/eventos" className="hidden md:block">
            <Button
              variant="outline"
              className="border-gray-300 dark:border-gray-700"
            >
              {t("home.events.viewAll")}
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </Link>
        </div>

        {eventos.length === 0 ? (
          <div className="text-center py-16 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <Ticket className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              {t("home.events.none")}
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              {t("home.events.noneDesc")}
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {eventos.map((evento) => {
              const precoMinimo = obterPrecoMinimo(evento.ingressos);
              const ingressosDisponiveis = evento.ingressos.reduce(
                (acc, ing) => acc + (ing.quantidade - ing.vendidos),
                0
              );

              return (
                <Card
                  key={evento.id}
                  className="group hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700 overflow-hidden"
                >
                  {evento.imagemUrl && (
                    <div className="relative h-48 bg-gradient-to-br from-sky-500 to-pink-500 overflow-hidden">
                      <Image
                        src={evento.imagemUrl}
                        alt={evento.nome}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-300"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                      <div className="absolute top-4 right-4">
                        {ingressosDisponiveis > 0 ? (
                          <span className="px-3 py-1 bg-green-500 text-white text-xs font-semibold rounded-full">
                            {t("home.events.available")}
                          </span>
                        ) : (
                          <span className="px-3 py-1 bg-red-500 text-white text-xs font-semibold rounded-full">
                            {t("home.events.soldOut")}
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                  {!evento.imagemUrl && (
                    <div className="relative h-48 bg-gradient-to-br from-sky-500 via-pink-500 to-purple-500 flex items-center justify-center">
                      <Ticket className="w-16 h-16 text-white/30" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                      <div className="absolute top-4 right-4">
                        {ingressosDisponiveis > 0 ? (
                          <span className="px-3 py-1 bg-green-500 text-white text-xs font-semibold rounded-full">
                            {t("home.events.available")}
                          </span>
                        ) : (
                          <span className="px-3 py-1 bg-red-500 text-white text-xs font-semibold rounded-full">
                            {t("home.events.soldOut")}
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  <CardHeader className="pb-3">
                    <CardTitle className="text-xl font-bold text-gray-900 dark:text-white line-clamp-2 group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
                      {evento.nome}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-4 mt-2">
                      <div className="flex items-center gap-1.5 text-sm">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-600 dark:text-gray-300">
                          {formatarData(evento.data)}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 text-sm">
                        <Clock className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-600 dark:text-gray-300">
                          {formatarHora(evento.data)}
                        </span>
                      </div>
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="pt-0">
                    <div className="flex items-center gap-2 mb-4 text-sm text-gray-600 dark:text-gray-300">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <span className="line-clamp-1">
                        {evento.local} - {evento.cidade}
                      </span>
                    </div>

                    {evento.descricao && (
                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
                        {evento.descricao}
                      </p>
                    )}

                    <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                      <div>
                        {precoMinimo !== null ? (
                          <div>
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              {t("home.events.fromPrice")}
                            </span>
                            <div className="text-xl font-bold text-gray-900 dark:text-white">
                              R$ {precoMinimo.toFixed(2).replace(".", ",")}
                            </div>
                          </div>
                        ) : (
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {t("home.events.pricesSoon")}
                          </div>
                        )}
                      </div>
                      <Link href={`/eventos/${evento.id}`}>
                        <Button
                          size="sm"
                          className="bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-100"
                          disabled={ingressosDisponiveis === 0}
                        >
                          {ingressosDisponiveis > 0
                            ? t("home.events.buy")
                            : t("home.events.soldOut")}
                          <ArrowRight className="ml-1 w-4 h-4" />
                        </Button>
                      </Link>
                    </div>

                    {evento.ingressos.length > 0 && (
                      <div className="mt-3 flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                        <Users className="w-3 h-3" />
                        <span>
                          {evento.ingressos.length}{" "}
                          {evento.ingressos.length > 1
                            ? t("home.events.ticketTypesPlural")
                            : t("home.events.ticketTypes")}{" "}
                          {t("home.events.ofTicket")}
                        </span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
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
