import { Suspense } from "react";
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
import {
  CheckCircle2,
  Calendar,
  MapPin,
  Ticket,
  User,
  Mail,
  Phone,
  CreditCard,
  Sparkles,
} from "lucide-react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

async function ConfirmacaoContent({ codigo }: { codigo: string }) {
  const venda = await prisma.venda.findUnique({
    where: { codigo },
    include: {
      cliente: true,
      ingresso: {
        include: {
          evento: true,
        },
      },
    },
  });

  if (!venda) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-purple-50 via-pink-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <Navbar />
        <div className="container mx-auto px-4 py-16 max-w-2xl">
          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardContent className="pt-6">
              <p className="text-center text-red-600 dark:text-red-400">
                Venda não encontrada. Verifique o código informado.
              </p>
              <div className="mt-4 text-center">
                <Link href="/eventos">
                  <Button className="dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600">
                    Ver Eventos
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
        <Footer />
      </main>
    );
  }

  const dataEvento = new Date(venda.ingresso.evento.data);

  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-50 via-pink-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Navbar />
      <div className="container mx-auto px-4 py-8 md:py-16 max-w-3xl">
        {/* Card Principal de Confirmação */}
        <Card className="border-2 border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20 shadow-xl">
          <CardHeader className="text-center pb-6">
            <div className="flex justify-center mb-4">
              <div className="relative">
                <div className="absolute inset-0 bg-green-400 dark:bg-green-500 rounded-full blur-xl opacity-50 animate-pulse"></div>
                <CheckCircle2 className="h-20 w-20 text-green-600 dark:text-green-400 relative z-10" />
              </div>
            </div>
            <div className="flex items-center justify-center gap-2 mb-2">
              <Sparkles className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              <CardTitle className="text-3xl md:text-4xl font-bold text-green-800 dark:text-green-300">
                Compra Confirmada!
              </CardTitle>
            </div>
            <CardDescription className="text-lg md:text-xl text-green-700 dark:text-green-400">
              Seu ingresso foi reservado com sucesso
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Detalhes da Compra */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700 shadow-md">
              <h3 className="font-bold text-xl mb-6 text-gray-900 dark:text-white flex items-center gap-2">
                <Ticket className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                Detalhes da Compra
              </h3>
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                  <span className="text-gray-600 dark:text-gray-400 font-medium">
                    Código da Compra:
                  </span>
                  <span className="font-bold text-lg text-purple-600 dark:text-purple-400 font-mono">
                    {venda.codigo}
                  </span>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                  <span className="text-gray-600 dark:text-gray-400 font-medium">
                    Evento:
                  </span>
                  <span className="font-semibold text-gray-900 dark:text-white text-right">
                    {venda.ingresso.evento.nome}
                  </span>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                  <span className="text-gray-600 dark:text-gray-400 font-medium flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Data do Evento:
                  </span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {dataEvento.toLocaleDateString("pt-BR", {
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                    })}
                  </span>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                  <span className="text-gray-600 dark:text-gray-400 font-medium">
                    Tipo de Ingresso:
                  </span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {venda.ingresso.tipo}
                  </span>
                </div>
                {"kit" in venda.ingresso && venda.ingresso.kit && (
                  <div className="p-3 bg-purple-50 dark:bg-purple-900/30 rounded-lg border border-purple-200 dark:border-purple-800">
                    <span className="text-gray-600 dark:text-gray-400 font-medium block mb-2">
                      Kit Incluído:
                    </span>
                    <div className="bg-white dark:bg-gray-800 p-3 rounded-lg border border-purple-200 dark:border-purple-700">
                      <p className="text-sm text-purple-800 dark:text-purple-300 whitespace-pre-line">
                        {String(venda.ingresso.kit)}
                      </p>
                    </div>
                  </div>
                )}
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                  <span className="text-gray-600 dark:text-gray-400 font-medium">
                    Quantidade:
                  </span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {venda.quantidade}
                  </span>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                  <span className="text-gray-600 dark:text-gray-400 font-medium">
                    Valor Unitário:
                  </span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    R$ {venda.ingresso.preco.toFixed(2).replace(".", ",")}
                  </span>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                  <span className="text-gray-600 dark:text-gray-400 font-medium flex items-center gap-2">
                    <CreditCard className="w-4 h-4" />
                    Forma de Pagamento:
                  </span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {venda.formaPagamento === "pix" && "PIX"}
                    {venda.formaPagamento === "cartao_credito" &&
                      "Cartão de Crédito"}
                    {venda.formaPagamento === "cartao_debito" &&
                      "Cartão de Débito"}
                    {venda.formaPagamento === "boleto" && "Boleto Bancário"}
                  </span>
                </div>
                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 p-4 bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 rounded-lg">
                    <span className="text-lg font-semibold text-gray-900 dark:text-white">
                      Total Pago:
                    </span>
                    <span className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
                      R$ {venda.valorTotal.toFixed(2).replace(".", ",")}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Dados do Comprador */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700 shadow-md">
              <h3 className="font-bold text-xl mb-6 text-gray-900 dark:text-white flex items-center gap-2">
                <User className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                Dados do Comprador
              </h3>
              <div className="space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                  <span className="text-gray-600 dark:text-gray-400 font-medium flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Nome:
                  </span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {venda.cliente.nome}
                  </span>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                  <span className="text-gray-600 dark:text-gray-400 font-medium flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    Email:
                  </span>
                  <span className="font-semibold text-gray-900 dark:text-white break-all">
                    {venda.cliente.email}
                  </span>
                </div>
                {venda.cliente.telefone && (
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                    <span className="text-gray-600 dark:text-gray-400 font-medium flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      Telefone:
                    </span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {venda.cliente.telefone}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Informações do Evento */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700 shadow-md">
              <h3 className="font-bold text-xl mb-6 text-gray-900 dark:text-white flex items-center gap-2">
                <MapPin className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                Informações do Evento
              </h3>
              <div className="space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                  <span className="text-gray-600 dark:text-gray-400 font-medium">
                    Local:
                  </span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {venda.ingresso.evento.local}
                  </span>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                  <span className="text-gray-600 dark:text-gray-400 font-medium">
                    Cidade:
                  </span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {venda.ingresso.evento.cidade}
                  </span>
                </div>
              </div>
            </div>

            {/* Aviso Importante */}
            <div className="bg-blue-50 dark:bg-blue-900/30 p-5 rounded-lg border-2 border-blue-200 dark:border-blue-800 shadow-md">
              <p className="text-sm md:text-base text-blue-800 dark:text-blue-300 leading-relaxed">
                <strong className="font-bold">Importante:</strong> Guarde o
                código da compra (
                <span className="font-mono font-bold">{venda.codigo}</span>)
                para retirada dos ingressos no dia do evento. Você também
                receberá um email de confirmação em breve.
              </p>
            </div>

            {/* Botões de Ação */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link href="/eventos" className="flex-1">
                <Button
                  variant="outline"
                  className="w-full h-12 text-base dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
                >
                  Ver Mais Eventos
                </Button>
              </Link>
              <Link href="/" className="flex-1">
                <Button className="w-full h-12 text-base bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 dark:from-purple-500 dark:to-pink-500 dark:hover:from-purple-600 dark:hover:to-pink-600 text-white shadow-lg">
                  Voltar ao Início
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
      <Footer />
    </main>
  );
}

export const dynamic = "force-dynamic";

export default function ConfirmacaoPage({
  searchParams,
}: {
  searchParams: { codigo?: string };
}) {
  const codigo = searchParams.codigo;

  if (!codigo) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-purple-50 via-pink-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <Navbar />
        <div className="container mx-auto px-4 py-16 max-w-2xl">
          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardContent className="pt-6">
              <p className="text-center text-red-600 dark:text-red-400">
                Código de compra não fornecido.
              </p>
              <div className="mt-4 text-center">
                <Link href="/eventos">
                  <Button className="dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600">
                    Ver Eventos
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-gradient-to-b from-purple-50 via-pink-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
          <Navbar />
          <div className="container mx-auto px-4 py-16 max-w-2xl">
            <Card className="dark:bg-gray-800 dark:border-gray-700">
              <CardContent className="pt-6">
                <p className="text-center text-gray-600 dark:text-gray-400">
                  Carregando...
                </p>
              </CardContent>
            </Card>
          </div>
          <Footer />
        </main>
      }
    >
      <ConfirmacaoContent codigo={codigo} />
    </Suspense>
  );
}
