"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Calendar,
  MapPin,
  Ticket,
  ArrowRight,
  Clock,
  PartyPopper,
  Search,
  Filter,
  X,
  Sparkles,
} from "lucide-react";

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

type EventosListProps = {
  eventos: EventoComIngressos[];
};

export function EventosList({ eventos }: EventosListProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"data" | "nome" | "preco">("data");
  const [filterDisponibilidade, setFilterDisponibilidade] = useState<
    "all" | "disponivel" | "esgotado"
  >("all");

  const ingressosDisponiveis = (evento: EventoComIngressos) => {
    return evento.ingressos.reduce(
      (total, ingresso) =>
        total + Math.max(0, ingresso.quantidade - ingresso.vendidos),
      0
    );
  };

  const obterPrecoMinimo = (ingressos: Array<{ preco: number }>) => {
    if (ingressos.length === 0) return null;
    const precos = ingressos.map((i) => i.preco);
    return Math.min(...precos);
  };

  const eventosFiltrados = useMemo(() => {
    let filtrados = [...eventos];

    // Filtro de busca
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtrados = filtrados.filter(
        (evento) =>
          evento.nome.toLowerCase().includes(query) ||
          evento.descricao?.toLowerCase().includes(query) ||
          evento.local.toLowerCase().includes(query) ||
          evento.cidade.toLowerCase().includes(query)
      );
    }

    // Filtro de disponibilidade
    if (filterDisponibilidade === "disponivel") {
      filtrados = filtrados.filter(
        (evento) => ingressosDisponiveis(evento) > 0
      );
    } else if (filterDisponibilidade === "esgotado") {
      filtrados = filtrados.filter(
        (evento) => ingressosDisponiveis(evento) === 0
      );
    }

    // Ordenação
    filtrados.sort((a, b) => {
      if (sortBy === "data") {
        return new Date(a.data).getTime() - new Date(b.data).getTime();
      } else if (sortBy === "nome") {
        return a.nome.localeCompare(b.nome);
      } else if (sortBy === "preco") {
        const precoA = obterPrecoMinimo(a.ingressos) || Infinity;
        const precoB = obterPrecoMinimo(b.ingressos) || Infinity;
        return precoA - precoB;
      }
      return 0;
    });

    return filtrados;
  }, [eventos, searchQuery, sortBy, filterDisponibilidade]);

  const temFiltrosAtivos =
    searchQuery.trim() !== "" || filterDisponibilidade !== "all";

  return (
    <div className="flex-1 container mx-auto px-4 py-8 md:py-16 max-w-7xl">
      {/* Header */}
      <div className="mb-8">
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center mb-4">
            <Sparkles className="w-8 h-8 text-purple-600 dark:text-purple-400 mr-2" />
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 dark:from-purple-400 dark:via-pink-400 dark:to-purple-400 bg-clip-text text-transparent">
              Eventos Disponíveis
            </h1>
          </div>
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Descubra os melhores eventos de K-POP em Manaus
          </p>
        </div>

        {/* Barra de Busca e Filtros */}
        <div className="space-y-4 mb-8">
          {/* Busca */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Buscar eventos por nome, local ou cidade..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-10 h-12 text-base dark:bg-gray-800 dark:border-gray-700 dark:text-white"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Filtros */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Select value={sortBy} onValueChange={(v: any) => setSortBy(v)}>
                <SelectTrigger className="h-12 dark:bg-gray-800 dark:border-gray-700">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Ordenar por" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="data">Data do Evento</SelectItem>
                  <SelectItem value="nome">Nome (A-Z)</SelectItem>
                  <SelectItem value="preco">Menor Preço</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex-1">
              <Select
                value={filterDisponibilidade}
                onValueChange={(v: any) => setFilterDisponibilidade(v)}
              >
                <SelectTrigger className="h-12 dark:bg-gray-800 dark:border-gray-700">
                  <Ticket className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Disponibilidade" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="disponivel">Com Ingressos</SelectItem>
                  <SelectItem value="esgotado">Esgotados</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {temFiltrosAtivos && (
              <Button
                variant="outline"
                onClick={() => {
                  setSearchQuery("");
                  setFilterDisponibilidade("all");
                }}
                className="h-12 dark:border-gray-700 dark:text-gray-300"
              >
                <X className="w-4 h-4 mr-2" />
                Limpar
              </Button>
            )}
          </div>

          {/* Contador de resultados */}
          {temFiltrosAtivos && (
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {eventosFiltrados.length === 1
                ? "1 evento encontrado"
                : `${eventosFiltrados.length} eventos encontrados`}
            </div>
          )}
        </div>
      </div>

      {/* Lista de Eventos */}
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
          </div>
        </div>
      ) : eventosFiltrados.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 px-4 min-h-[60vh]">
          <div className="text-center max-w-lg mx-auto">
            <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Nenhum evento encontrado
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
              Tente ajustar seus filtros de busca
            </p>
            <Button
              variant="outline"
              onClick={() => {
                setSearchQuery("");
                setFilterDisponibilidade("all");
              }}
              className="dark:border-gray-700 dark:text-gray-300"
            >
              <X className="w-4 h-4 mr-2" />
              Limpar Filtros
            </Button>
          </div>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {eventosFiltrados.map((evento, index) => {
            const disponiveis = ingressosDisponiveis(evento);
            const precoMinimo = obterPrecoMinimo(evento.ingressos);
            const dataEvento = new Date(evento.data);
            const hoje = new Date();
            const diasRestantes = Math.ceil(
              (dataEvento.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24)
            );

            return (
              <Card
                key={evento.id}
                className="group hover:shadow-2xl dark:hover:shadow-purple-900/20 transition-all duration-300 overflow-hidden dark:bg-gray-800 dark:border-gray-700 hover:scale-[1.02] border-2 hover:border-purple-300 dark:hover:border-purple-700"
                style={{
                  animationDelay: `${index * 50}ms`,
                }}
              >
                {evento.imagemUrl && (
                  <div className="relative h-56 w-full overflow-hidden bg-gradient-to-br from-purple-500 to-pink-500">
                    <Image
                      src={evento.imagemUrl}
                      alt={evento.nome}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
                    {disponiveis > 0 && (
                      <div className="absolute top-4 right-4 bg-green-500 dark:bg-green-600 text-white px-4 py-2 rounded-full text-xs font-bold flex items-center gap-2 shadow-lg">
                        <Ticket className="w-4 h-4" />
                        {disponiveis} disponíveis
                      </div>
                    )}
                    {disponiveis === 0 && (
                      <div className="absolute top-4 right-4 bg-red-500 dark:bg-red-600 text-white px-4 py-2 rounded-full text-xs font-bold shadow-lg">
                        Esgotado
                      </div>
                    )}
                    {diasRestantes > 0 && diasRestantes <= 7 && (
                      <div className="absolute top-4 left-4 bg-purple-600 dark:bg-purple-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                        {diasRestantes === 1
                          ? "Amanhã!"
                          : `${diasRestantes} dias`}
                      </div>
                    )}
                  </div>
                )}
                {!evento.imagemUrl && (
                  <div className="relative h-56 w-full bg-gradient-to-br from-purple-500 via-pink-500 to-purple-500 flex items-center justify-center">
                    <Ticket className="w-20 h-20 text-white/30" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    {disponiveis > 0 && (
                      <div className="absolute top-4 right-4 bg-green-500 dark:bg-green-600 text-white px-4 py-2 rounded-full text-xs font-bold shadow-lg">
                        {disponiveis} disponíveis
                      </div>
                    )}
                    {disponiveis === 0 && (
                      <div className="absolute top-4 right-4 bg-red-500 dark:bg-red-600 text-white px-4 py-2 rounded-full text-xs font-bold shadow-lg">
                        Esgotado
                      </div>
                    )}
                  </div>
                )}
                <CardHeader className="pb-3">
                  <CardTitle className="text-xl md:text-2xl font-bold dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors line-clamp-2">
                    {evento.nome}
                  </CardTitle>
                  <div className="space-y-2 mt-3">
                    <CardDescription className="flex items-center gap-2 text-sm dark:text-gray-400">
                      <Calendar className="w-4 h-4 text-purple-600 dark:text-purple-400 flex-shrink-0" />
                      <span>
                        {dataEvento.toLocaleDateString("pt-BR", {
                          day: "2-digit",
                          month: "long",
                          year: "numeric",
                        })}
                      </span>
                    </CardDescription>
                    <CardDescription className="flex items-center gap-2 text-sm dark:text-gray-400">
                      <Clock className="w-4 h-4 text-purple-600 dark:text-purple-400 flex-shrink-0" />
                      <span>
                        {dataEvento.toLocaleTimeString("pt-BR", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </CardDescription>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <MapPin className="w-5 h-5 mt-0.5 flex-shrink-0 text-purple-600 dark:text-purple-400" />
                    <div>
                      <p className="font-semibold dark:text-gray-300">
                        {evento.local}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-500">
                        {evento.cidade}
                      </p>
                    </div>
                  </div>
                  {evento.descricao && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3">
                      {evento.descricao}
                    </p>
                  )}
                  <div className="flex items-center justify-between pt-4 border-t dark:border-gray-700">
                    <div className="flex-1">
                      {precoMinimo !== null ? (
                        <div>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            A partir de
                          </span>
                          <div className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
                            R$ {precoMinimo.toFixed(2).replace(".", ",")}
                          </div>
                        </div>
                      ) : (
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          Preços em breve
                        </div>
                      )}
                    </div>
                    <Link href={`/eventos/${evento.id}`}>
                      <Button
                        className="bg-gradient-to-r from-sky-500 to-pink-500 hover:from-sky-600 hover:to-pink-600 group/btn shadow-lg hover:shadow-xl transition-all"
                        disabled={disponiveis === 0}
                      >
                        {disponiveis > 0 ? "Ver Detalhes" : "Esgotado"}
                        <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                    <Ticket className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                    <span>
                      {evento.ingressos.length}{" "}
                      {evento.ingressos.length === 1 ? "tipo" : "tipos"} de
                      ingresso
                    </span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
