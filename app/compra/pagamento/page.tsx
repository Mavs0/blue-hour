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
  Smartphone,
  CreditCard,
  Receipt,
  Copy,
  CheckCircle2,
  Clock,
  AlertCircle,
  Calendar,
  MapPin,
  Ticket,
  ArrowLeft,
  Home,
  Sparkles,
} from "lucide-react";
import { InstrucoesPix } from "@/components/instrucoes-pix";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { ContadorRegressivo } from "@/components/contador-regressivo";

async function PagamentoContent({ codigo }: { codigo: string }) {
  let venda;

  try {
    venda = await prisma.venda.findUnique({
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
  } catch (error: any) {
    console.error("Erro ao buscar venda:", error);

    // Se for erro de conexão com banco de dados
    if (
      error.message?.includes("Can't reach database server") ||
      error.message?.includes("database server")
    ) {
      return (
        <main className="flex flex-col min-h-screen bg-gradient-to-b from-purple-50 via-pink-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
          <Navbar />
          <div className="flex-1 container mx-auto px-4 py-16 max-w-2xl">
            <Card className="dark:bg-gray-800 dark:border-gray-700">
              <CardContent className="pt-6">
                <div className="text-center">
                  <AlertCircle className="h-16 w-16 text-yellow-500 dark:text-yellow-400 mx-auto mb-4" />
                  <p className="text-center text-yellow-600 dark:text-yellow-400 text-lg font-semibold mb-2">
                    Problema de Conexão
                  </p>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    Não foi possível conectar ao banco de dados. Isso pode ser
                    temporário.
                  </p>
                  <div className="space-y-2 text-sm text-gray-500 dark:text-gray-400 mb-6">
                    <p>
                      <strong>Possíveis causas:</strong>
                    </p>
                    <ul className="list-disc list-inside space-y-1 text-left">
                      <li>Banco de dados temporariamente indisponível</li>
                      <li>
                        Projeto Supabase pausado (projetos gratuitos pausam após
                        inatividade)
                      </li>
                      <li>Problema de rede temporário</li>
                    </ul>
                  </div>
                  <div className="flex gap-4 justify-center">
                    <Button
                      onClick={() => window.location.reload()}
                      className="dark:bg-purple-600 dark:hover:bg-purple-700"
                    >
                      Tentar Novamente
                    </Button>
                    <Link href="/eventos">
                      <Button
                        variant="outline"
                        className="dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
                      >
                        Ver Eventos
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          <Footer />
        </main>
      );
    }

    // Outros erros - mostrar mensagem genérica
    throw error;
  }

  if (!venda) {
    return (
      <main className="flex flex-col min-h-screen bg-gradient-to-b from-purple-50 via-pink-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <Navbar />
        <div className="flex-1 container mx-auto px-4 py-16 max-w-2xl">
          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardContent className="pt-6">
              <div className="text-center">
                <AlertCircle className="h-16 w-16 text-red-500 dark:text-red-400 mx-auto mb-4" />
                <p className="text-center text-red-600 dark:text-red-400 text-lg font-semibold mb-2">
                  Venda não encontrada
                </p>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Verifique o código informado.
                </p>
                <Link href="/eventos">
                  <Button className="dark:bg-purple-600 dark:hover:bg-purple-700">
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

  const vendaCompleta = venda as any;

  const getStatusInfo = () => {
    const statusPagamento = vendaCompleta.statusPagamento || venda.status;
    switch (statusPagamento) {
      case "confirmado":
        return {
          icon: CheckCircle2,
          color: "text-green-600 dark:text-green-400",
          bgColor: "bg-green-50 dark:bg-green-900/20",
          borderColor: "border-green-200 dark:border-green-800",
          title: "Pagamento Confirmado",
          message: "Seu pagamento foi confirmado com sucesso!",
        };
      case "processando":
        return {
          icon: Clock,
          color: "text-blue-600 dark:text-blue-400",
          bgColor: "bg-blue-50 dark:bg-blue-900/20",
          borderColor: "border-blue-200 dark:border-blue-800",
          title: "Processando Pagamento",
          message: "Aguarde enquanto processamos seu pagamento...",
        };
      case "expirado":
        return {
          icon: AlertCircle,
          color: "text-red-600 dark:text-red-400",
          bgColor: "bg-red-50 dark:bg-red-900/20",
          borderColor: "border-red-200 dark:border-red-800",
          title: "Pagamento Expirado",
          message: "O prazo para pagamento expirou.",
        };
      default:
        return {
          icon: Clock,
          color: "text-yellow-600 dark:text-yellow-400",
          bgColor: "bg-yellow-50 dark:bg-yellow-900/20",
          borderColor: "border-yellow-200 dark:border-yellow-800",
          title: "Aguardando Pagamento",
          message: "Complete o pagamento para confirmar sua compra.",
        };
    }
  };

  const statusInfo = getStatusInfo();
  const StatusIcon = statusInfo.icon;
  const dataEvento = new Date(venda.ingresso.evento.data);

  // Calcular data de expiração do pagamento (30 minutos após criação para PIX)
  const dataCriacao = new Date(venda.createdAt);
  const tempoExpiracaoMinutos = 30; // 30 minutos para PIX
  const dataExpiracao = new Date(
    dataCriacao.getTime() + tempoExpiracaoMinutos * 60 * 1000
  );
  const pagamentoPendente =
    (venda.statusPagamento === "pendente" || !venda.statusPagamento) &&
    venda.formaPagamento === "pix";

  return (
    <main className="flex flex-col min-h-screen bg-gradient-to-b from-purple-50 via-pink-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Navbar />
      <div className="flex-1 container mx-auto px-4 py-8 max-w-6xl">
        {/* Status do Pagamento */}
        <Card
          className={`mb-6 ${statusInfo.bgColor} ${statusInfo.borderColor} border-2 shadow-lg`}
        >
          <CardHeader>
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white dark:bg-gray-800 rounded-full">
                <StatusIcon className={`h-10 w-10 ${statusInfo.color}`} />
              </div>
              <div className="flex-1">
                <CardTitle className={`${statusInfo.color} text-2xl`}>
                  {statusInfo.title}
                </CardTitle>
                <CardDescription className="text-base mt-1 dark:text-gray-300">
                  {statusInfo.message}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Contador Regressivo para Pagamento Pendente */}
        {pagamentoPendente && (
          <div className="mb-6">
            <ContadorRegressivo
              dataExpiracao={dataExpiracao}
              onExpirar={() => {
                // Quando expirar, pode redirecionar ou atualizar status
                console.log("Pagamento expirado!");
              }}
            />
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Coluna Esquerda - Detalhes da Compra */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="dark:bg-gray-800 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 dark:text-white">
                  <Receipt className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  Detalhes da Compra
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                    Código da Compra
                  </p>
                  <p className="font-bold text-lg bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent dark:from-purple-400 dark:to-pink-400">
                    {venda.codigo}
                  </p>
                </div>

                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                      <Ticket className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Evento
                      </p>
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {venda.ingresso.evento.nome}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 mb-3">
                    <div className="p-2 bg-pink-100 dark:bg-pink-900/30 rounded-lg">
                      <Ticket className="w-5 h-5 text-pink-600 dark:text-pink-400" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Tipo de Ingresso
                      </p>
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {venda.ingresso.tipo}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 mb-3">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                      <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Data do Evento
                      </p>
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {dataEvento.toLocaleDateString("pt-BR", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        {dataEvento.toLocaleTimeString("pt-BR", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                      <MapPin className="w-5 h-5 text-green-600 dark:text-green-400" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Local
                      </p>
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {venda.ingresso.evento.local}
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        {venda.ingresso.evento.cidade}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex justify-between items-center mb-2">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Quantidade
                    </p>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {venda.quantidade} ingresso(s)
                    </p>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-lg font-semibold text-gray-900 dark:text-white">
                      Total
                    </p>
                    <p className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent dark:from-purple-400 dark:to-pink-400">
                      R$ {venda.valorTotal.toFixed(2)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Informações do Cliente */}
            <Card className="dark:bg-gray-800 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="text-lg dark:text-white">
                  Dados do Comprador
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Nome
                  </p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {venda.cliente.nome}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Email
                  </p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {venda.cliente.email}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Coluna Direita - Instruções de Pagamento */}
          <div className="lg:col-span-2">
            <Card className="dark:bg-gray-800 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 dark:text-white">
                  {vendaCompleta.formaPagamento === "pix" && (
                    <Smartphone className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  )}
                  {(vendaCompleta.formaPagamento === "cartao_credito" ||
                    vendaCompleta.formaPagamento === "cartao_debito") && (
                    <CreditCard className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  )}
                  Instruções de Pagamento
                </CardTitle>
                <CardDescription className="dark:text-gray-400">
                  {vendaCompleta.formaPagamento === "pix"
                    ? "Siga as instruções abaixo para realizar o pagamento via PIX"
                    : "Status do pagamento com cartão"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {vendaCompleta.formaPagamento === "pix" &&
                  vendaCompleta.qrCodePix && (
                    <InstrucoesPix
                      codigoPix={
                        vendaCompleta.qrCodePix.includes("|")
                          ? vendaCompleta.qrCodePix.split("|")[0]
                          : vendaCompleta.qrCodePix
                      }
                      valor={venda.valorTotal}
                      codigoVenda={venda.codigo}
                      qrCodeBase64={
                        vendaCompleta.qrCodePix.includes("|")
                          ? vendaCompleta.qrCodePix.split("|")[1]
                          : undefined
                      }
                    />
                  )}

                {(vendaCompleta.formaPagamento === "cartao_credito" ||
                  vendaCompleta.formaPagamento === "cartao_debito") &&
                  (vendaCompleta.statusPagamento === "confirmado" ||
                    venda.status === "confirmada") && (
                    <div className="text-center py-12">
                      <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/30 mb-6">
                        <CheckCircle2 className="h-12 w-12 text-green-600 dark:text-green-400" />
                      </div>
                      <p className="text-2xl font-bold text-green-600 dark:text-green-400 mb-2">
                        Pagamento Aprovado!
                      </p>
                      <p className="text-gray-600 dark:text-gray-400">
                        Seu pagamento foi processado com sucesso.
                      </p>
                    </div>
                  )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Botões de Ação */}
        <div className="mt-8 flex flex-col sm:flex-row gap-4">
          <Link href="/eventos" className="flex-1">
            <Button
              variant="outline"
              className="w-full dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Ver Mais Eventos
            </Button>
          </Link>
          <Link href="/" className="flex-1">
            <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 dark:from-purple-600 dark:to-pink-600 dark:hover:from-purple-700 dark:hover:to-pink-700">
              <Home className="w-4 h-4 mr-2" />
              Voltar ao Início
            </Button>
          </Link>
        </div>
      </div>
      <Footer />
    </main>
  );
}

export const dynamic = "force-dynamic";

export default function PagamentoPage({
  searchParams,
}: {
  searchParams: { codigo?: string };
}) {
  const codigo = searchParams?.codigo;

  if (!codigo) {
    return (
      <main className="flex flex-col min-h-screen bg-gradient-to-b from-purple-50 via-pink-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <Navbar />
        <div className="flex-1 container mx-auto px-4 py-16 max-w-2xl">
          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardContent className="pt-6">
              <div className="text-center">
                <AlertCircle className="h-16 w-16 text-red-500 dark:text-red-400 mx-auto mb-4" />
                <p className="text-center text-red-600 dark:text-red-400 text-lg font-semibold mb-2">
                  Código de compra não fornecido
                </p>
                <div className="mt-6">
                  <Link href="/eventos">
                    <Button className="dark:bg-purple-600 dark:hover:bg-purple-700">
                      Ver Eventos
                    </Button>
                  </Link>
                </div>
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
        <main className="flex flex-col min-h-screen bg-gradient-to-b from-purple-50 via-pink-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
          <Navbar />
          <div className="flex-1 container mx-auto px-4 py-16 max-w-2xl">
            <Card className="dark:bg-gray-800 dark:border-gray-700">
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                  <p className="text-center text-gray-600 dark:text-gray-400">
                    Carregando informações do pagamento...
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
          <Footer />
        </main>
      }
    >
      <PagamentoContent codigo={codigo} />
    </Suspense>
  );
}
