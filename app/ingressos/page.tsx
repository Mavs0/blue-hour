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
  const [email, setEmail] = useState("");
  const [cpf, setCpf] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cliente, setCliente] = useState<Cliente | null>(null);
  const [vendas, setVendas] = useState<Venda[]>([]);

  const formatarCPF = (value: string) => {
    const cpfLimpo = value.replace(/\D/g, "");
    if (cpfLimpo.length <= 11) {
      return cpfLimpo.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
    }
    return value;
  };

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
      setError("Por favor, informe seu email ou CPF");
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
        setError(data.error || "Erro ao buscar suas compras");
        return;
      }

      setCliente(data.cliente);
      setVendas(data.vendas);
    } catch (err) {
      setError("Erro ao buscar suas compras. Tente novamente.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const obterStatusBadge = (statusPagamento: string, status: string) => {
    if (status === "cancelada") {
      return {
        texto: "Cancelada",
        cor: "bg-red-100 text-red-800",
        icone: XCircle,
      };
    }

    if (statusPagamento === "confirmado") {
      return {
        texto: "Confirmada",
        cor: "bg-green-100 text-green-800",
        icone: CheckCircle2,
      };
    }

    if (statusPagamento === "processando") {
      return {
        texto: "Processando",
        cor: "bg-blue-100 text-blue-800",
        icone: Clock,
      };
    }

    if (statusPagamento === "expirado") {
      return {
        texto: "Expirado",
        cor: "bg-gray-100 text-gray-800",
        icone: XCircle,
      };
    }

    return {
      texto: "Aguardando Pagamento",
      cor: "bg-yellow-100 text-yellow-800",
      icone: Clock,
    };
  };

  const formatarFormaPagamento = (forma: string) => {
    const formas: Record<string, string> = {
      pix: "PIX",
      cartao_credito: "Cartão de Crédito",
      cartao_debito: "Cartão de Débito",
      boleto: "Boleto Bancário",
    };
    return formas[forma] || forma;
  };

  const formatarData = (data: string) => {
    return new Date(data).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatarDataEvento = (data: string) => {
    return new Date(data).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  const formatarHoraEvento = (data: string) => {
    return new Date(data).toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-50 to-pink-50">
      <Navbar />
      <div className="container mx-auto px-4 py-24 max-w-6xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Meus Ingressos
          </h1>
          <p className="text-gray-600">
            Consulte suas compras informando seu email ou CPF
          </p>
        </div>

        {/* Formulário de Busca */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="w-5 h-5" />
              Buscar Minhas Compras
            </CardTitle>
            <CardDescription>
              Informe seu email ou CPF para visualizar seus ingressos
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleBuscar} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={loading}
                  />
                </div>
                <div>
                  <Label htmlFor="cpf">CPF</Label>
                  <Input
                    id="cpf"
                    type="text"
                    placeholder="000.000.000-00"
                    value={cpf}
                    onChange={handleCpfChange}
                    maxLength={14}
                    disabled={loading}
                  />
                </div>
              </div>
              {error && (
                <div className="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-lg">
                  <AlertCircle className="w-5 h-5" />
                  <span>{error}</span>
                </div>
              )}
              <Button
                type="submit"
                disabled={loading}
                className="w-full md:w-auto bg-gradient-to-r from-sky-500 to-pink-500 hover:from-sky-600 hover:to-pink-600"
              >
                {loading ? "Buscando..." : "Buscar Ingressos"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Resultados */}
        {cliente && (
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              Olá, {cliente.nome}!
            </h2>
            <p className="text-gray-600">
              Encontramos {vendas.length} compra(s) realizada(s)
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
                  className={`overflow-hidden ${
                    venda.status === "cancelada"
                      ? "opacity-60"
                      : "hover:shadow-lg transition-shadow"
                  }`}
                >
                  <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <CardTitle className="text-xl mb-2">
                          {venda.evento.nome}
                        </CardTitle>
                        <CardDescription className="flex items-center gap-4 flex-wrap">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {formatarDataEvento(venda.evento.data)} às{" "}
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
                        <h3 className="font-semibold text-lg text-gray-900">
                          Detalhes da Compra
                        </h3>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Código:</span>
                            <span className="font-mono font-semibold">
                              {venda.codigo}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">
                              Tipo de Ingresso:
                            </span>
                            <span className="font-semibold">
                              {venda.ingresso.tipo}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Quantidade:</span>
                            <span className="font-semibold">
                              {venda.quantidade} ingresso(s)
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">
                              Valor Unitário:
                            </span>
                            <span>R$ {venda.ingresso.preco.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">
                              Forma de Pagamento:
                            </span>
                            <span className="font-semibold">
                              {formatarFormaPagamento(venda.formaPagamento)}
                            </span>
                          </div>
                          <div className="pt-2 border-t">
                            <div className="flex justify-between">
                              <span className="font-semibold">Total:</span>
                              <span className="text-xl font-bold text-purple-600">
                                R$ {venda.valorTotal.toFixed(2)}
                              </span>
                            </div>
                          </div>
                          <div className="text-xs text-gray-500">
                            Compra realizada em {formatarData(venda.createdAt)}
                          </div>
                        </div>
                      </div>

                      {/* Ações */}
                      <div className="space-y-4">
                        <h3 className="font-semibold text-lg text-gray-900">
                          Ações
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
                                  className="w-full justify-start"
                                >
                                  <QrCode className="w-4 h-4 mr-2" />
                                  Ver QR Code PIX
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
                                  className="w-full justify-start"
                                >
                                  <CreditCard className="w-4 h-4 mr-2" />
                                  Ver Código de Barras
                                </Button>
                              </Link>
                            )}
                          {venda.statusPagamento === "confirmado" &&
                            !eventoPassou && (
                              <Button
                                variant="outline"
                                className="w-full justify-start"
                                onClick={() => {
                                  // TODO: Implementar download de QR Code
                                  alert("Download de QR Code em breve!");
                                }}
                              >
                                <Download className="w-4 h-4 mr-2" />
                                Baixar Ingresso
                              </Button>
                            )}
                          <Link
                            href={`/compra/confirmacao?codigo=${venda.codigo}`}
                            className="w-full"
                          >
                            <Button
                              variant="outline"
                              className="w-full justify-start"
                            >
                              <Ticket className="w-4 h-4 mr-2" />
                              Ver Detalhes Completos
                            </Button>
                          </Link>
                        </div>

                        {/* Informações Adicionais */}
                        {venda.statusPagamento === "pendente" && (
                          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                            <p className="text-sm text-yellow-800">
                              <strong>Atenção:</strong> Seu pagamento ainda está
                              pendente. Após a confirmação, você receberá seu
                              ingresso por email.
                            </p>
                          </div>
                        )}
                        {venda.statusPagamento === "confirmado" &&
                          eventoPassou && (
                            <div className="mt-4 p-3 bg-gray-50 border border-gray-200 rounded-lg">
                              <p className="text-sm text-gray-600">
                                Este evento já aconteceu. Obrigado por
                                participar!
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
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-8">
                <Ticket className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-4">
                  Nenhuma compra encontrada para este cliente.
                </p>
                <Link href="/eventos">
                  <Button className="bg-gradient-to-r from-sky-500 to-pink-500 hover:from-sky-600 hover:to-pink-600">
                    Ver Eventos Disponíveis
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
