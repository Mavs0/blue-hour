"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import {
  Ticket,
  Calendar,
  MapPin,
  CreditCard,
  CheckCircle2,
  Clock,
  XCircle,
  Download,
  QrCode,
  Search,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";
import { useI18n } from "@/components/providers/i18n-provider";
import { formatarCPF } from "@/lib/cpf-validator";
import { useToast } from "@/components/ui/toaster";

interface Ingresso {
  id: string;
  tipo: string;
  preco: number;
}

interface Evento {
  id: string;
  nome: string;
  data: string;
  local: string;
  cidade: string;
  imagemUrl: string | null;
}

interface Venda {
  id: string;
  codigo: string;
  quantidade: number;
  valorTotal: number;
  formaPagamento: string;
  statusPagamento: string;
  status: string;
  codigoPagamento: string | null;
  qrCodePix: string | null;
  vencimentoBoleto: string | null;
  dadosCartao: string | null;
  createdAt: string;
  evento: Evento;
  ingresso: Ingresso;
}

interface Cliente {
  id: string;
  nome: string;
  email: string;
  telefone: string | null;
}

export default function MeusIngressosPage() {
  const { t, locale } = useI18n();
  const toast = useToast();
  const [email, setEmail] = useState("");
  const [cpf, setCpf] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cliente, setCliente] = useState<Cliente | null>(null);
  const [vendas, setVendas] = useState<Venda[]>([]);

  const handleCpfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const valorFormatado = formatarCPF(e.target.value);
    setCpf(valorFormatado);
  };

  const handleBuscar = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setCliente(null);
    setVendas([]);

    if (!email && !cpf) {
      setError(t("tickets.search.error"));
      setLoading(false);
      return;
    }

    try {
      const params = new URLSearchParams();
      if (email) params.append("email", email);
      if (cpf) params.append("cpf", cpf.replace(/\D/g, ""));

      const response = await fetch(`/api/minhas-vendas?${params.toString()}`);
      const data = await response.json();

      if (!response.ok) {
        setError(data.error || t("tickets.search.errorFetch"));
        return;
      }

      setCliente(data.cliente);
      setVendas(data.vendas);
      if (data.vendas.length > 0) {
        toast.success(
          t("tickets.found").replace("{count}", data.vendas.length.toString())
        );
      }
    } catch (err: any) {
      const errorMessage = err.message || t("tickets.search.errorRetry");
      setError(errorMessage);
      toast.error(t("error.generic"), errorMessage);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const obterStatusBadge = (statusPagamento: string, status: string) => {
    if (status === "cancelada") {
      return {
        texto: t("tickets.status.cancelled"),
        cor: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
        icone: XCircle,
      };
    }

    if (statusPagamento === "confirmado") {
      return {
        texto: t("tickets.status.confirmed"),
        cor: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
        icone: CheckCircle2,
      };
    }

    if (statusPagamento === "processando") {
      return {
        texto: t("tickets.status.processing"),
        cor: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
        icone: Clock,
      };
    }

    if (statusPagamento === "expirado") {
      return {
        texto: t("tickets.status.expired"),
        cor: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200",
        icone: XCircle,
      };
    }

    return {
      texto: t("tickets.status.pending"),
      cor: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
      icone: Clock,
    };
  };

  const formatarFormaPagamento = (forma: string) => {
    const formas: Record<string, string> = {
      pix: t("tickets.payment.pix"),
      cartao_credito: t("tickets.payment.creditCard"),
      cartao_debito: t("tickets.payment.debitCard"),
      boleto: t("tickets.payment.bankSlip"),
    };
    return formas[forma] || forma;
  };

  const formatarData = (data: string) => {
    const localeStr =
      locale === "pt-BR" ? "pt-BR" : locale === "en-US" ? "en-US" : "es-ES";
    return new Date(data).toLocaleDateString(localeStr, {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatarDataEvento = (data: string) => {
    const localeStr =
      locale === "pt-BR" ? "pt-BR" : locale === "en-US" ? "en-US" : "es-ES";
    return new Date(data).toLocaleDateString(localeStr, {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  const formatarHoraEvento = (data: string) => {
    const localeStr =
      locale === "pt-BR" ? "pt-BR" : locale === "en-US" ? "en-US" : "es-ES";
    return new Date(data).toLocaleTimeString(localeStr, {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <main className="flex flex-col flex-1 bg-gradient-to-b from-purple-50 to-pink-50 dark:from-gray-900 dark:to-gray-800">
      <Navbar />
      <div className="flex-1 container mx-auto px-4 py-24 max-w-6xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            {t("tickets.title")}
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            {t("tickets.subtitle")}
          </p>
        </div>

        {/* Formulário de Busca */}
        <Card className="mb-8 dark:bg-gray-800 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 dark:text-white">
              <Search className="w-5 h-5" />
              {t("tickets.search.title")}
            </CardTitle>
            <CardDescription className="dark:text-gray-300">
              {t("tickets.search.subtitle")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleBuscar} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="email" className="dark:text-gray-300">
                    {t("tickets.search.email")}
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder={t("tickets.search.emailPlaceholder")}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={loading}
                    className="dark:bg-gray-900 dark:border-gray-700"
                  />
                </div>
                <div>
                  <Label htmlFor="cpf" className="dark:text-gray-300">
                    {t("tickets.search.cpf")}
                  </Label>
                  <Input
                    id="cpf"
                    type="text"
                    placeholder={t("tickets.search.cpfPlaceholder")}
                    value={cpf}
                    onChange={handleCpfChange}
                    maxLength={14}
                    disabled={loading}
                    className="dark:bg-gray-900 dark:border-gray-700"
                  />
                </div>
              </div>
              {error && (
                <div className="flex items-center gap-2 text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 p-3 rounded-lg">
                  <AlertCircle className="w-5 h-5" />
                  <span>{error}</span>
                </div>
              )}
              <Button
                type="submit"
                disabled={loading}
                className="w-full md:w-auto bg-gradient-to-r from-sky-500 to-pink-500 hover:from-sky-600 hover:to-pink-600"
              >
                {loading
                  ? t("tickets.search.loading")
                  : t("tickets.search.button")}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Resultados */}
        {cliente && (
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
              {t("tickets.greeting").replace("{name}", cliente.nome)}
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              {t("tickets.found").replace("{count}", vendas.length.toString())}
            </p>
          </div>
        )}

        {vendas.length > 0 && (
          <div className="space-y-6">
            {vendas.map((venda) => {
              const statusBadge = obterStatusBadge(
                venda.statusPagamento,
                venda.status
              );
              const StatusIcon = statusBadge.icone;
              const eventoPassou = new Date(venda.evento.data) < new Date();

              return (
                <Card
                  key={venda.id}
                  className={`overflow-hidden dark:bg-gray-800 dark:border-gray-700 ${
                    venda.status === "cancelada"
                      ? "opacity-60"
                      : "hover:shadow-lg transition-shadow"
                  }`}
                >
                  <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-gray-700 dark:to-gray-700">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <CardTitle className="text-xl mb-2 dark:text-white">
                          {venda.evento.nome}
                        </CardTitle>
                        <CardDescription className="flex items-center gap-4 flex-wrap dark:text-gray-300">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {formatarDataEvento(venda.evento.data)}{" "}
                            {locale === "pt-BR"
                              ? "às"
                              : locale === "en-US"
                              ? "at"
                              : "a las"}{" "}
                            {formatarHoraEvento(venda.evento.data)}
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            {venda.evento.local} - {venda.evento.cidade}
                          </span>
                        </CardDescription>
                      </div>
                      <div
                        className={`px-3 py-1 rounded-full flex items-center gap-1 text-sm font-medium ${statusBadge.cor}`}
                      >
                        <StatusIcon className="w-4 h-4" />
                        {statusBadge.texto}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      {/* Informações da Compra */}
                      <div className="space-y-4">
                        <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
                          {t("tickets.details.title")}
                        </h3>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600 dark:text-gray-300">
                              {t("tickets.details.code")}
                            </span>
                            <span className="font-mono font-semibold dark:text-white">
                              {venda.codigo}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600 dark:text-gray-300">
                              {t("tickets.details.ticketType")}
                            </span>
                            <span className="font-semibold dark:text-white">
                              {venda.ingresso.tipo}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600 dark:text-gray-300">
                              {t("tickets.details.quantity")}
                            </span>
                            <span className="font-semibold dark:text-white">
                              {venda.quantidade}{" "}
                              {t("tickets.details.quantityUnit")}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600 dark:text-gray-300">
                              {t("tickets.details.unitPrice")}
                            </span>
                            <span className="dark:text-white">
                              R$ {venda.ingresso.preco.toFixed(2)}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600 dark:text-gray-300">
                              {t("tickets.details.paymentMethod")}
                            </span>
                            <span className="font-semibold dark:text-white">
                              {formatarFormaPagamento(venda.formaPagamento)}
                            </span>
                          </div>
                          <div className="pt-2 border-t dark:border-gray-700">
                            <div className="flex justify-between">
                              <span className="font-semibold dark:text-white">
                                {t("tickets.details.total")}
                              </span>
                              <span className="text-xl font-bold text-purple-600 dark:text-purple-400">
                                R$ {venda.valorTotal.toFixed(2)}
                              </span>
                            </div>
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            {t("tickets.details.purchaseDate").replace(
                              "{date}",
                              formatarData(venda.createdAt)
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Ações */}
                      <div className="space-y-4">
                        <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
                          {t("tickets.actions.title")}
                        </h3>
                        <div className="space-y-2">
                          {venda.statusPagamento === "pendente" &&
                            venda.formaPagamento === "pix" && (
                              <Link
                                href={`/compra/pagamento?codigo=${venda.codigo}`}
                                className="w-full"
                              >
                                <Button
                                  variant="outline"
                                  className="w-full justify-start dark:border-gray-700 dark:text-gray-300"
                                >
                                  <QrCode className="w-4 h-4 mr-2" />
                                  {t("tickets.actions.viewPix")}
                                </Button>
                              </Link>
                            )}
                          {venda.statusPagamento === "pendente" &&
                            venda.formaPagamento === "boleto" && (
                              <Link
                                href={`/compra/pagamento?codigo=${venda.codigo}`}
                                className="w-full"
                              >
                                <Button
                                  variant="outline"
                                  className="w-full justify-start dark:border-gray-700 dark:text-gray-300"
                                >
                                  <CreditCard className="w-4 h-4 mr-2" />
                                  {t("tickets.actions.viewBarcode")}
                                </Button>
                              </Link>
                            )}
                          {venda.statusPagamento === "confirmado" &&
                            !eventoPassou && (
                              <Button
                                variant="outline"
                                className="w-full justify-start dark:border-gray-700 dark:text-gray-300"
                                onClick={() => {
                                  // TODO: Implementar download de QR Code
                                  alert(t("tickets.actions.downloadSoon"));
                                }}
                              >
                                <Download className="w-4 h-4 mr-2" />
                                {t("tickets.actions.download")}
                              </Button>
                            )}
                          <Link
                            href={`/compra/confirmacao?codigo=${venda.codigo}`}
                            className="w-full"
                          >
                            <Button
                              variant="outline"
                              className="w-full justify-start dark:border-gray-700 dark:text-gray-300"
                            >
                              <Ticket className="w-4 h-4 mr-2" />
                              {t("tickets.actions.viewDetails")}
                            </Button>
                          </Link>
                        </div>

                        {/* Informações Adicionais */}
                        {venda.statusPagamento === "pendente" && (
                          <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                            <p className="text-sm text-yellow-800 dark:text-yellow-200">
                              <strong>{t("tickets.pending.warning")}</strong>{" "}
                              {t("tickets.pending.message")}
                            </p>
                          </div>
                        )}
                        {venda.statusPagamento === "confirmado" &&
                          eventoPassou && (
                            <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
                              <p className="text-sm text-gray-600 dark:text-gray-300">
                                {t("tickets.pastEvent.message")}
                              </p>
                            </div>
                          )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {vendas.length === 0 && cliente && (
          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardContent className="pt-6">
              <div className="text-center py-8">
                <Ticket className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  {t("tickets.none.title")}
                </p>
                <Link href="/eventos">
                  <Button className="bg-gradient-to-r from-sky-500 to-pink-500 hover:from-sky-600 hover:to-pink-600">
                    {t("tickets.none.button")}
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
      <Footer />
    </main>
  );
}
