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
import { CheckCircle2 } from "lucide-react";

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
      <Card>
        <CardContent className="pt-6">
          <p className="text-center text-red-600">
            Venda não encontrada. Verifique o código informado.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-50 to-pink-50">
      <div className="container mx-auto px-4 py-16 max-w-2xl">
        <Card className="border-green-200 bg-green-50">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <CheckCircle2 className="h-16 w-16 text-green-600" />
            </div>
            <CardTitle className="text-3xl text-green-800">
              Compra Confirmada!
            </CardTitle>
            <CardDescription className="text-lg">
              Seu ingresso foi reservado com sucesso
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-white p-6 rounded-lg border">
              <h3 className="font-semibold text-lg mb-4">Detalhes da Compra</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Código da Compra:</span>
                  <span className="font-bold text-purple-600">
                    {venda.codigo}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Evento:</span>
                  <span className="font-semibold">
                    {venda.ingresso.evento.nome}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tipo de Ingresso:</span>
                  <span className="font-semibold">{venda.ingresso.tipo}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Quantidade:</span>
                  <span className="font-semibold">{venda.quantidade}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Valor Unitário:</span>
                  <span>R$ {venda.ingresso.preco.toFixed(2)}</span>
                </div>
                <div className="pt-3 border-t">
                  <div className="flex justify-between">
                    <span className="text-lg font-semibold">Total Pago:</span>
                    <span className="text-2xl font-bold text-purple-600">
                      R$ {venda.valorTotal.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg border">
              <h3 className="font-semibold text-lg mb-4">Dados do Comprador</h3>
              <div className="space-y-2">
                <p>
                  <span className="text-gray-600">Nome:</span>{" "}
                  <span className="font-semibold">{venda.cliente.nome}</span>
                </p>
                <p>
                  <span className="text-gray-600">Email:</span>{" "}
                  <span className="font-semibold">{venda.cliente.email}</span>
                </p>
                {venda.cliente.telefone && (
                  <p>
                    <span className="text-gray-600">Telefone:</span>{" "}
                    <span className="font-semibold">
                      {venda.cliente.telefone}
                    </span>
                  </p>
                )}
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-800">
                <strong>Importante:</strong> Guarde o código da compra (
                {venda.codigo}) para retirada dos ingressos no dia do evento.
                Você também receberá um email de confirmação em breve.
              </p>
            </div>

            <div className="flex gap-4">
              <Link href="/eventos" className="flex-1">
                <Button variant="outline" className="w-full">
                  Ver Mais Eventos
                </Button>
              </Link>
              <Link href="/" className="flex-1">
                <Button className="w-full bg-purple-600 hover:bg-purple-700">
                  Voltar ao Início
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

export default function ConfirmacaoPage({
  searchParams,
}: {
  searchParams: { codigo?: string };
}) {
  const codigo = searchParams.codigo;

  if (!codigo) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-purple-50 to-pink-50">
        <div className="container mx-auto px-4 py-16 max-w-2xl">
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
        <main className="min-h-screen bg-gradient-to-b from-purple-50 to-pink-50">
          <div className="container mx-auto px-4 py-16 max-w-2xl">
            <Card>
              <CardContent className="pt-6">
                <p className="text-center">Carregando...</p>
              </CardContent>
            </Card>
          </div>
        </main>
      }
    >
      <ConfirmacaoContent codigo={codigo} />
    </Suspense>
  );
}
