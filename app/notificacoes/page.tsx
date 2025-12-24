"use client";

import { useState, useEffect } from "react";
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
  Bell,
  CheckCircle2,
  AlertCircle,
  Info,
  AlertTriangle,
  Mail,
  Search,
  CheckCheck,
  Loader2,
  ExternalLink,
  Calendar,
} from "lucide-react";
import Link from "next/link";

interface Notificacao {
  id: string;
  titulo: string;
  mensagem: string;
  tipo: "info" | "success" | "warning" | "error";
  lida: boolean;
  link: string | null;
  createdAt: string;
}

export default function NotificacoesPage() {
  const [buscarEmail, setBuscarEmail] = useState("");
  const [buscarCpf, setBuscarCpf] = useState("");
  const [loading, setLoading] = useState(false);
  const [marcandoComoLida, setMarcandoComoLida] = useState<string | null>(null);
  const [marcandoTodas, setMarcandoTodas] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notificacoes, setNotificacoes] = useState<Notificacao[]>([]);
  const [naoLidasCount, setNaoLidasCount] = useState(0);
  const [modoBusca, setModoBusca] = useState(true);
  const [filtro, setFiltro] = useState<"todas" | "naoLidas">("todas");

  const formatarCPF = (value: string) => {
    const cpfLimpo = value.replace(/\D/g, "");
    if (cpfLimpo.length <= 11) {
      return cpfLimpo.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
    }
    return value;
  };

  const handleBuscar = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setNotificacoes([]);
    setNaoLidasCount(0);

    if (!buscarEmail && !buscarCpf) {
      setError("Por favor, informe seu email ou CPF");
      setLoading(false);
      return;
    }

    try {
      await buscarNotificacoes();
    } catch (err) {
      setError("Erro ao buscar notificações. Tente novamente.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const buscarNotificacoes = async () => {
    const params = new URLSearchParams();
    if (buscarEmail) params.append("email", buscarEmail);
    if (buscarCpf) params.append("cpf", buscarCpf.replace(/\D/g, ""));
    if (filtro === "naoLidas") params.append("apenasNaoLidas", "true");

    const response = await fetch(`/api/notificacoes?${params.toString()}`);
    const data = await response.json();

    if (!response.ok) {
      setError(data.error || "Erro ao buscar notificações");
      return;
    }

    setNotificacoes(data.notificacoes || []);
    setNaoLidasCount(data.naoLidasCount || 0);
    setModoBusca(false);
  };

  useEffect(() => {
    if (!modoBusca && (buscarEmail || buscarCpf)) {
      buscarNotificacoes();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filtro]);

  const marcarComoLida = async (notificacaoId: string) => {
    setMarcandoComoLida(notificacaoId);
    try {
      const response = await fetch("/api/notificacoes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          notificacaoId,
          email: buscarEmail || undefined,
          cpf: buscarCpf ? buscarCpf.replace(/\D/g, "") : undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Erro ao marcar notificação como lida");
        return;
      }

      // Atualizar estado local
      setNotificacoes((prev) =>
        prev.map((notif) =>
          notif.id === notificacaoId ? { ...notif, lida: true } : notif
        )
      );
      setNaoLidasCount((prev) => Math.max(0, prev - 1));
    } catch (err) {
      setError("Erro ao marcar notificação como lida");
      console.error(err);
    } finally {
      setMarcandoComoLida(null);
    }
  };

  const marcarTodasComoLidas = async () => {
    setMarcandoTodas(true);
    try {
      const response = await fetch("/api/notificacoes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          marcarTodas: true,
          email: buscarEmail || undefined,
          cpf: buscarCpf ? buscarCpf.replace(/\D/g, "") : undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Erro ao marcar notificações como lidas");
        return;
      }

      // Atualizar estado local
      setNotificacoes((prev) => prev.map((notif) => ({ ...notif, lida: true })));
      setNaoLidasCount(0);
    } catch (err) {
      setError("Erro ao marcar notificações como lidas");
      console.error(err);
    } finally {
      setMarcandoTodas(false);
    }
  };

  const obterIconePorTipo = (tipo: string) => {
    switch (tipo) {
      case "success":
        return CheckCircle2;
      case "warning":
        return AlertTriangle;
      case "error":
        return AlertCircle;
      default:
        return Info;
    }
  };

  const obterCorPorTipo = (tipo: string) => {
    switch (tipo) {
      case "success":
        return "bg-green-100 text-green-800 border-green-200";
      case "warning":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "error":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-blue-100 text-blue-800 border-blue-200";
    }
  };

  const formatarData = (data: string) => {
    const dataObj = new Date(data);
    const agora = new Date();
    const diffMs = agora.getTime() - dataObj.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Agora";
    if (diffMins < 60) return `${diffMins} min atrás`;
    if (diffHours < 24) return `${diffHours}h atrás`;
    if (diffDays < 7) return `${diffDays} dia(s) atrás`;

    return dataObj.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <main className="flex flex-col flex-1 bg-gradient-to-b from-purple-50 to-pink-50">
      <Navbar />
      <div className="flex-1 container mx-auto px-4 py-24 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Notificações
          </h1>
          <p className="text-gray-600">
            Visualize e gerencie suas notificações
          </p>
        </div>

        {/* Busca inicial */}
        {modoBusca && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5" />
                Acessar Notificações
              </CardTitle>
              <CardDescription>
                Informe seu email ou CPF para visualizar suas notificações
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleBuscar} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="buscar-email">Email</Label>
                    <Input
                      id="buscar-email"
                      type="email"
                      placeholder="seu@email.com"
                      value={buscarEmail}
                      onChange={(e) => setBuscarEmail(e.target.value)}
                      disabled={loading}
                    />
                  </div>
                  <div>
                    <Label htmlFor="buscar-cpf">CPF</Label>
                    <Input
                      id="buscar-cpf"
                      type="text"
                      placeholder="000.000.000-00"
                      value={buscarCpf}
                      onChange={(e) =>
                        setBuscarCpf(formatarCPF(e.target.value))
                      }
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
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Buscando...
                    </>
                  ) : (
                    <>
                      <Search className="w-4 h-4 mr-2" />
                      Buscar Notificações
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Lista de notificações */}
        {!modoBusca && (
          <>
            {/* Filtros e ações */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <div className="flex gap-2">
                <Button
                  variant={filtro === "todas" ? "default" : "outline"}
                  onClick={() => setFiltro("todas")}
                  className={
                    filtro === "todas"
                      ? "bg-gradient-to-r from-sky-500 to-pink-500 hover:from-sky-600 hover:to-pink-600"
                      : ""
                  }
                >
                  Todas ({notificacoes.length})
                </Button>
                <Button
                  variant={filtro === "naoLidas" ? "default" : "outline"}
                  onClick={() => setFiltro("naoLidas")}
                  className={
                    filtro === "naoLidas"
                      ? "bg-gradient-to-r from-sky-500 to-pink-500 hover:from-sky-600 hover:to-pink-600"
                      : ""
                  }
                >
                  Não Lidas ({naoLidasCount})
                </Button>
              </div>
              {naoLidasCount > 0 && (
                <Button
                  variant="outline"
                  onClick={marcarTodasComoLidas}
                  disabled={marcandoTodas}
                  className="text-sm"
                >
                  {marcandoTodas ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Marcando...
                    </>
                  ) : (
                    <>
                      <CheckCheck className="w-4 h-4 mr-2" />
                      Marcar Todas como Lidas
                    </>
                  )}
                </Button>
              )}
            </div>

            {/* Lista */}
            {notificacoes.length === 0 ? (
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center py-12">
                    <Bell className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-2">
                      {filtro === "naoLidas"
                        ? "Nenhuma notificação não lida"
                        : "Nenhuma notificação encontrada"}
                    </p>
                    <p className="text-sm text-gray-500">
                      Você será notificado sobre suas compras, pagamentos e
                      eventos importantes
                    </p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {notificacoes.map((notif) => {
                  const Icone = obterIconePorTipo(notif.tipo);
                  const cor = obterCorPorTipo(notif.tipo);

                  return (
                    <Card
                      key={notif.id}
                      className={`transition-all ${
                        notif.lida
                          ? "opacity-60 bg-gray-50"
                          : "border-2 shadow-md"
                      }`}
                    >
                      <CardContent className="pt-6">
                        <div className="flex items-start gap-4">
                          <div
                            className={`p-2 rounded-lg ${cor} flex-shrink-0`}
                          >
                            <Icone className="w-5 h-5" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2 mb-1">
                              <h3
                                className={`font-semibold ${
                                  notif.lida ? "text-gray-600" : "text-gray-900"
                                }`}
                              >
                                {notif.titulo}
                              </h3>
                              {!notif.lida && (
                                <span className="flex-shrink-0 w-2 h-2 bg-purple-500 rounded-full mt-2"></span>
                              )}
                            </div>
                            <p
                              className={`text-sm mb-3 ${
                                notif.lida ? "text-gray-500" : "text-gray-700"
                              }`}
                            >
                              {notif.mensagem}
                            </p>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2 text-xs text-gray-500">
                                <Calendar className="w-3 h-3" />
                                {formatarData(notif.createdAt)}
                              </div>
                              <div className="flex items-center gap-2">
                                {notif.link && (
                                  <Link href={notif.link}>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="h-7 text-xs"
                                    >
                                      Ver
                                      <ExternalLink className="w-3 h-3 ml-1" />
                                    </Button>
                                  </Link>
                                )}
                                {!notif.lida && (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => marcarComoLida(notif.id)}
                                    disabled={marcandoComoLida === notif.id}
                                    className="h-7 text-xs"
                                  >
                                    {marcandoComoLida === notif.id ? (
                                      <Loader2 className="w-3 h-3 animate-spin" />
                                    ) : (
                                      "Marcar como lida"
                                    )}
                                  </Button>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}

            {/* Botão para buscar outro perfil */}
            <div className="mt-6 text-center">
              <Button
                variant="outline"
                onClick={() => {
                  setModoBusca(true);
                  setNotificacoes([]);
                  setNaoLidasCount(0);
                  setError(null);
                  setFiltro("todas");
                }}
              >
                Buscar Outro Perfil
              </Button>
            </div>
          </>
        )}
      </div>
      <Footer />
    </main>
  );
}

