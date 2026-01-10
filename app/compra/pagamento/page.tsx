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
} from "lucide-react";
import { InstrucoesPix } from "@/components/instrucoes-pix";

async function PagamentoContent({ codigo }: { codigo: string }) {
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
      <Card>
        <CardContent className="pt-6">
          <p className="text-center text-red-600">
            Venda não encontrada. Verifique o código informado.
          </p>
        </CardContent>
      </Card>
    );
  }

  const vendaCompleta = venda as any;

  const getStatusInfo = () => {
    const statusPagamento = vendaCompleta.statusPagamento || venda.status;
    switch (statusPagamento) {
      case "confirmado":
        return {
          icon: CheckCircle2,
          color: "text-green-600",
          bgColor: "bg-green-50",
          borderColor: "border-green-200",
          title: "Pagamento Confirmado",
          message: "Seu pagamento foi confirmado com sucesso!",
        };
      case "processando":
        return {
          icon: Clock,
          color: "text-blue-600",
          bgColor: "bg-blue-50",
          borderColor: "border-blue-200",
          title: "Processando Pagamento",
          message: "Aguarde enquanto processamos seu pagamento...",
        };
      case "expirado":
        return {
          icon: AlertCircle,
          color: "text-red-600",
          bgColor: "bg-red-50",
          borderColor: "border-red-200",
          title: "Pagamento Expirado",
          message: "O prazo para pagamento expirou.",
        };
      default:
        return {
          icon: Clock,
          color: "text-yellow-600",
          bgColor: "bg-yellow-50",
          borderColor: "border-yellow-200",
          title: "Aguardando Pagamento",
          message: "Complete o pagamento para confirmar sua compra.",
        };
    }
  };

  const statusInfo = getStatusInfo();
  const StatusIcon = statusInfo.icon;

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Status do Pagamento */}
        <Card
          className={`mb-6 ${statusInfo.bgColor} ${statusInfo.borderColor} border-2`}
        >
          <CardHeader>
            <div className="flex items-center gap-4">
              <StatusIcon className={`h-12 w-12 ${statusInfo.color}`} />
              <div>
                <CardTitle className={statusInfo.color}>
                  {statusInfo.title}
                </CardTitle>
                <CardDescription className="text-base mt-1">
                  {statusInfo.message}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
        </Card>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Informações da Compra */}
          <Card>
            <CardHeader>
              <CardTitle>Detalhes da Compra</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-gray-600">Código da Compra</p>
                <p className="font-bold text-lg text-purple-600">
                  {venda.codigo}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Evento</p>
                <p className="font-semibold">{venda.ingresso.evento.nome}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Tipo de Ingresso</p>
                <p className="font-semibold">{venda.ingresso.tipo}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Quantidade</p>
                <p className="font-semibold">{venda.quantidade} ingresso(s)</p>
              </div>
              <div className="pt-4 border-t">
                <div className="flex justify-between items-center">
                  <p className="text-lg font-semibold">Total</p>
                  <p className="text-2xl font-bold text-purple-600">
                    R$ {venda.valorTotal.toFixed(2)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Instruções de Pagamento */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {vendaCompleta.formaPagamento === "pix" && (
                  <Smartphone className="h-5 w-5" />
                )}
                {(vendaCompleta.formaPagamento === "cartao_credito" ||
                  vendaCompleta.formaPagamento === "cartao_debito") && (
                  <CreditCard className="h-5 w-5" />
                )}
                Instruções de Pagamento
              </CardTitle>
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
                  <div className="text-center py-8">
                    <CheckCircle2 className="h-16 w-16 text-green-600 mx-auto mb-4" />
                    <p className="text-lg font-semibold text-green-600 mb-2">
                      Pagamento Aprovado!
                    </p>
                    <p className="text-gray-600">
                      Seu pagamento foi processado com sucesso.
                    </p>
                  </div>
                )}
            </CardContent>
          </Card>
        </div>

        <div className="mt-6 flex gap-4">
          <Link href="/eventos" className="flex-1">
            <Button variant="outline" className="w-full">
              Ver Mais Eventos
            </Button>
          </Link>
          <Link href="/" className="flex-1">
            <Button className="w-full">Voltar ao Início</Button>
          </Link>
        </div>
      </div>
    </main>
  );
}

export const dynamic = "force-dynamic";

export default function PagamentoPage({
  searchParams,
}: {
  searchParams: { codigo?: string };
}) {
  const codigo = searchParams.codigo;

  if (!codigo) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12">
        <div className="container mx-auto px-4 max-w-2xl">
          <Card>
            <CardContent className="pt-6">
              <p className="text-center text-red-600">
                Código de compra não fornecido.
              </p>
              <div className="mt-4 text-center">
                <Link href="/eventos">
                  <Button>Ver Eventos</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    );
  }

  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12">
          <div className="container mx-auto px-4 max-w-2xl">
            <Card>
              <CardContent className="pt-6">
                <p className="text-center">Carregando...</p>
              </CardContent>
            </Card>
          </div>
        </main>
      }
    >
      <PagamentoContent codigo={codigo} />
    </Suspense>
  );
}
