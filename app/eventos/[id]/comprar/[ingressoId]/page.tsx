import { notFound, redirect } from "next/navigation";
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
import Link from "next/link";
import { ComprarIngressoForm } from "@/components/comprar-ingresso-form";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import {
  Calendar,
  MapPin,
  Ticket,
  ArrowLeft,
  Gift,
  Users,
  CheckCircle2,
} from "lucide-react";

export const dynamic = "force-dynamic";

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
  const percentualDisponivel = (disponivel / ingresso.quantidade) * 100;

  if (disponivel <= 0) {
    redirect(`/eventos/${evento.id}`);
  }

  const dataFormatada = new Date(evento.data).toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <main className="flex flex-col min-h-screen bg-gradient-to-b from-purple-50 via-pink-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Navbar />
      <div className="flex-1 container mx-auto px-4 py-8 max-w-6xl">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Link href={`/eventos/${evento.id}`}>
            <Button
              variant="outline"
              className="dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar para o Evento
            </Button>
          </Link>
        </div>

        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Passo 1 de 2
            </span>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Informações da Compra
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 h-2 rounded-full w-1/2 transition-all" />
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Coluna Esquerda - Resumo */}
          <div className="lg:col-span-1 space-y-6">
            {/* Card do Evento */}
            <Card className="dark:bg-gray-800 dark:border-gray-700 overflow-hidden">
              {evento.imagemUrl && (
                <div className="relative w-full h-48">
                  <Image
                    src={evento.imagemUrl}
                    alt={evento.nome}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <h2 className="text-xl font-bold text-white mb-1">
                      {evento.nome}
                    </h2>
                  </div>
                </div>
              )}
              <CardHeader className={evento.imagemUrl ? "pt-4" : ""}>
                {!evento.imagemUrl && (
                  <CardTitle className="text-xl dark:text-white">
                    {evento.nome}
                  </CardTitle>
                )}
                <CardDescription className="dark:text-gray-400">
                  {ingresso.tipo}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                      <Calendar className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Data e Horário
                      </p>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {dataFormatada}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-pink-100 dark:bg-pink-900/30 rounded-lg">
                      <MapPin className="w-5 h-5 text-pink-600 dark:text-pink-400" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Localização
                      </p>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {evento.local}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {evento.cidade}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                      <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Disponibilidade
                      </p>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {disponivel} de {ingresso.quantidade} ingressos
                      </p>
                      <div className="mt-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
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
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Card do Ingresso */}
            <Card className="dark:bg-gray-800 dark:border-gray-700 border-l-4 border-l-purple-500">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 dark:text-white">
                  <Ticket className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  Detalhes do Ingresso
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                    Tipo
                  </p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">
                    {ingresso.tipo}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                    Preço Unitário
                  </p>
                  <p className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent dark:from-purple-400 dark:to-pink-400">
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
              </CardContent>
            </Card>

            {/* Card de Segurança */}
            <Card className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-semibold text-green-900 dark:text-green-200 mb-1">
                      Compra Segura
                    </p>
                    <p className="text-xs text-green-800 dark:text-green-300">
                      Seus dados estão protegidos. Pagamento processado de forma
                      segura.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Coluna Direita - Formulário */}
          <div className="lg:col-span-2">
            <Card className="dark:bg-gray-800 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="text-2xl dark:text-white">
                  Finalizar Compra
                </CardTitle>
                <CardDescription className="dark:text-gray-400">
                  Preencha seus dados para completar a compra
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ComprarIngressoForm
                  eventoId={evento.id}
                  ingressoId={ingresso.id}
                  precoUnitario={ingresso.preco}
                  disponivel={disponivel}
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
