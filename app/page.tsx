import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Sparkles,
  Calendar,
  MapPin,
  Ticket,
  ArrowRight,
  Clock,
  Users,
} from "lucide-react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

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

export default async function Home() {
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
      take: 6,
    });
  } catch (error) {
    console.error("Erro ao buscar eventos:", error);
    // Continua com array vazio para não quebrar a página
  }

  const formatarData = (data: Date) => {
    return new Date(data).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatarHora = (data: Date) => {
    return new Date(data).toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const obterPrecoMinimo = (ingressos: Array<{ preco: number }>) => {
    if (ingressos.length === 0) return null;
    const precos = ingressos.map((i) => i.preco);
    return Math.min(...precos);
  };

  return (
    <main className="min-h-screen bg-white">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-24 pb-12 md:pt-32 md:pb-16 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-20"></div>

        <div className="container mx-auto px-6 lg:px-8 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-6 bg-white/10 backdrop-blur-md border border-white/20 rounded-full">
              <Sparkles className="w-4 h-4 text-sky-400" />
              <span className="text-xs font-semibold text-white/90 uppercase tracking-wide">
                Eventos Exclusivos TXT
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight">
              Blue Hour
            </h1>
            <p className="text-lg md:text-xl text-gray-300 mb-8">
              A maior experiência de K-POP em Manaus
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="#eventos">
                <Button
                  size="lg"
                  className="bg-white text-gray-900 hover:bg-gray-100 text-base px-8 py-6 rounded-lg font-semibold shadow-xl group"
                >
                  Ver Eventos Disponíveis
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Events Section */}
      <section id="eventos" className="py-16 bg-white">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                Eventos em Destaque
              </h2>
              <p className="text-gray-600">
                Confira os próximos eventos do TXT em Manaus
              </p>
            </div>
            <Link href="/eventos" className="hidden md:block">
              <Button variant="outline" className="border-gray-300">
                Ver Todos
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </div>

          {eventos.length === 0 ? (
            <div className="text-center py-16 bg-gray-50 rounded-lg border border-gray-200">
              <Ticket className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Nenhum evento disponível no momento
              </h3>
              <p className="text-gray-600">
                Fique atento para novos eventos em breve!
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
                    className="group hover:shadow-xl transition-all duration-300 border border-gray-200 overflow-hidden"
                  >
                    {evento.imagemUrl && (
                      <div className="relative h-48 bg-gradient-to-br from-sky-500 to-pink-500 overflow-hidden">
                        <img
                          src={evento.imagemUrl}
                          alt={evento.nome}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                        <div className="absolute top-4 right-4">
                          {ingressosDisponiveis > 0 ? (
                            <span className="px-3 py-1 bg-green-500 text-white text-xs font-semibold rounded-full">
                              Disponível
                            </span>
                          ) : (
                            <span className="px-3 py-1 bg-red-500 text-white text-xs font-semibold rounded-full">
                              Esgotado
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
                              Disponível
                            </span>
                          ) : (
                            <span className="px-3 py-1 bg-red-500 text-white text-xs font-semibold rounded-full">
                              Esgotado
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    <CardHeader className="pb-3">
                      <CardTitle className="text-xl font-bold text-gray-900 line-clamp-2 group-hover:text-sky-600 transition-colors">
                        {evento.nome}
                      </CardTitle>
                      <CardDescription className="flex items-center gap-4 mt-2">
                        <div className="flex items-center gap-1.5 text-sm">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-600">
                            {formatarData(evento.data)}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 text-sm">
                          <Clock className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-600">
                            {formatarHora(evento.data)}
                          </span>
                        </div>
                      </CardDescription>
                    </CardHeader>

                    <CardContent className="pt-0">
                      <div className="flex items-center gap-2 mb-4 text-sm text-gray-600">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        <span className="line-clamp-1">
                          {evento.local} - {evento.cidade}
                        </span>
                      </div>

                      {evento.descricao && (
                        <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                          {evento.descricao}
                        </p>
                      )}

                      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                        <div>
                          {precoMinimo !== null ? (
                            <div>
                              <span className="text-xs text-gray-500">
                                A partir de
                              </span>
                              <div className="text-xl font-bold text-gray-900">
                                R$ {precoMinimo.toFixed(2).replace(".", ",")}
                              </div>
                            </div>
                          ) : (
                            <div className="text-sm text-gray-500">
                              Preços em breve
                            </div>
                          )}
                        </div>
                        <Link href={`/eventos/${evento.id}`}>
                          <Button
                            size="sm"
                            className="bg-gray-900 text-white hover:bg-gray-800"
                            disabled={ingressosDisponiveis === 0}
                          >
                            {ingressosDisponiveis > 0 ? "Comprar" : "Esgotado"}
                            <ArrowRight className="ml-1 w-4 h-4" />
                          </Button>
                        </Link>
                      </div>

                      {evento.ingressos.length > 0 && (
                        <div className="mt-3 flex items-center gap-2 text-xs text-gray-500">
                          <Users className="w-3 h-3" />
                          <span>
                            {evento.ingressos.length} tipo
                            {evento.ingressos.length > 1 ? "s" : ""} de ingresso
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
                <Button variant="outline" className="w-full border-gray-300">
                  Ver Todos os Eventos
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Why Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Por que escolher a Blue Hour?
              </h2>
              <p className="text-lg text-gray-600">
                A melhor experiência de eventos TXT em Manaus
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <div className="w-12 h-12 bg-sky-100 rounded-lg flex items-center justify-center mb-4">
                  <Ticket className="w-6 h-6 text-sky-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Ingressos Seguros
                </h3>
                <p className="text-gray-600 text-sm">
                  Sistema confiável e seguro para compra de ingressos online
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center mb-4">
                  <Calendar className="w-6 h-6 text-pink-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Eventos Exclusivos
                </h3>
                <p className="text-gray-600 text-sm">
                  Acesso aos melhores eventos do TXT em Manaus
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Comunidade MOA
                </h3>
                <p className="text-gray-600 text-sm">
                  Conecte-se com outros fãs e viva momentos inesquecíveis
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gray-900">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Não perca nossos próximos eventos TXT
            </h2>
            <p className="text-lg text-gray-300 mb-8">
              Fique por dentro de todos os eventos exclusivos da Blue Hour
            </p>
            <Link href="/eventos">
              <Button
                size="lg"
                className="bg-white text-gray-900 hover:bg-gray-100 text-base px-10 py-6 rounded-lg font-semibold shadow-xl group"
              >
                <Ticket className="mr-2 w-5 h-5" />
                Ver Todos os Eventos
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
