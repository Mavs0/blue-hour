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
  Settings,
  Bell,
  Mail,
  Shield,
  Globe,
  Moon,
  Sun,
  Save,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Smartphone,
  CreditCard,
} from "lucide-react";
import Link from "next/link";

export default function ConfiguracoesPage() {
  const [salvando, setSalvando] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Estados para notificações
  const [notificacoesEmail, setNotificacoesEmail] = useState(true);
  const [notificacoesCompra, setNotificacoesCompra] = useState(true);
  const [notificacoesPagamento, setNotificacoesPagamento] = useState(true);
  const [notificacoesLembrete, setNotificacoesLembrete] = useState(true);
  const [notificacoesPromocoes, setNotificacoesPromocoes] = useState(false);

  // Estados para preferências
  const [tema, setTema] = useState<"claro" | "escuro" | "sistema">("sistema");
  const [idioma, setIdioma] = useState("pt-BR");

  const handleSalvar = async () => {
    setSalvando(true);
    setError(null);
    setSuccess(null);

    // Simular salvamento (em produção, salvaria no banco de dados)
    setTimeout(() => {
      setSuccess("Configurações salvas com sucesso!");
      setSalvando(false);
      setTimeout(() => setSuccess(null), 3000);
    }, 1000);
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-50 to-pink-50">
      <Navbar />
      <div className="container mx-auto px-4 py-24 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Configurações
          </h1>
          <p className="text-gray-600">
            Gerencie suas preferências e configurações da conta
          </p>
        </div>

        <div className="space-y-6">
          {/* Notificações */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5" />
                Notificações
              </CardTitle>
              <CardDescription>
                Escolha como e quando você deseja ser notificado
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <Label
                      htmlFor="notif-email"
                      className="text-base font-medium"
                    >
                      Notificações por Email
                    </Label>
                    <p className="text-sm text-gray-500 mt-1">
                      Receba notificações importantes por email
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notificacoesEmail}
                      onChange={(e) => setNotificacoesEmail(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                  </label>
                </div>

                <div className="border-t pt-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <Label className="text-base font-medium">
                        Confirmação de Compra
                      </Label>
                      <p className="text-sm text-gray-500 mt-1">
                        Receba email quando realizar uma compra
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={notificacoesCompra}
                        onChange={(e) =>
                          setNotificacoesCompra(e.target.checked)
                        }
                        disabled={!notificacoesEmail}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600 peer-disabled:opacity-50 peer-disabled:cursor-not-allowed"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <Label className="text-base font-medium">
                        Status de Pagamento
                      </Label>
                      <p className="text-sm text-gray-500 mt-1">
                        Receba atualizações sobre o status do pagamento
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={notificacoesPagamento}
                        onChange={(e) =>
                          setNotificacoesPagamento(e.target.checked)
                        }
                        disabled={!notificacoesEmail}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600 peer-disabled:opacity-50 peer-disabled:cursor-not-allowed"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <Label className="text-base font-medium">
                        Lembretes de Eventos
                      </Label>
                      <p className="text-sm text-gray-500 mt-1">
                        Receba lembretes antes dos eventos que você comprou
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={notificacoesLembrete}
                        onChange={(e) =>
                          setNotificacoesLembrete(e.target.checked)
                        }
                        disabled={!notificacoesEmail}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600 peer-disabled:opacity-50 peer-disabled:cursor-not-allowed"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <Label className="text-base font-medium">
                        Promoções e Ofertas
                      </Label>
                      <p className="text-sm text-gray-500 mt-1">
                        Receba ofertas exclusivas e novidades
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={notificacoesPromocoes}
                        onChange={(e) =>
                          setNotificacoesPromocoes(e.target.checked)
                        }
                        disabled={!notificacoesEmail}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600 peer-disabled:opacity-50 peer-disabled:cursor-not-allowed"></div>
                    </label>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Preferências */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Preferências
              </CardTitle>
              <CardDescription>
                Personalize sua experiência na plataforma
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label
                  htmlFor="tema"
                  className="text-base font-medium mb-2 block"
                >
                  Tema
                </Label>
                <div className="grid grid-cols-3 gap-4">
                  <button
                    onClick={() => setTema("claro")}
                    className={`p-4 border-2 rounded-lg transition-all ${
                      tema === "claro"
                        ? "border-purple-500 bg-purple-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <Sun className="w-6 h-6 mx-auto mb-2 text-yellow-500" />
                    <span className="text-sm font-medium">Claro</span>
                  </button>
                  <button
                    onClick={() => setTema("escuro")}
                    className={`p-4 border-2 rounded-lg transition-all ${
                      tema === "escuro"
                        ? "border-purple-500 bg-purple-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <Moon className="w-6 h-6 mx-auto mb-2 text-indigo-500" />
                    <span className="text-sm font-medium">Escuro</span>
                  </button>
                  <button
                    onClick={() => setTema("sistema")}
                    className={`p-4 border-2 rounded-lg transition-all ${
                      tema === "sistema"
                        ? "border-purple-500 bg-purple-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <Settings className="w-6 h-6 mx-auto mb-2 text-gray-500" />
                    <span className="text-sm font-medium">Sistema</span>
                  </button>
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  O tema escuro ainda não está disponível
                </p>
              </div>

              <div>
                <Label
                  htmlFor="idioma"
                  className="text-base font-medium mb-2 block"
                >
                  Idioma
                </Label>
                <select
                  id="idioma"
                  value={idioma}
                  onChange={(e) => setIdioma(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="pt-BR">Português (Brasil)</option>
                  <option value="en-US">English (US)</option>
                  <option value="es-ES">Español</option>
                </select>
                <p className="text-sm text-gray-500 mt-2">
                  Outros idiomas serão adicionados em breve
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Privacidade e Segurança */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Privacidade e Segurança
              </CardTitle>
              <CardDescription>
                Gerencie suas configurações de privacidade
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Seus dados estão seguros:</strong> Utilizamos
                  criptografia para proteger suas informações pessoais e de
                  pagamento. Nunca compartilhamos seus dados com terceiros sem
                  sua autorização.
                </p>
              </div>
              <div className="space-y-2">
                <Button variant="outline" className="w-full justify-start">
                  <Shield className="w-4 h-4 mr-2" />
                  Alterar Senha
                </Button>
                <p className="text-xs text-gray-500">
                  Sistema de autenticação será implementado em breve
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Mensagens de sucesso/erro */}
          {success && (
            <div className="flex items-center gap-2 text-green-600 bg-green-50 p-4 rounded-lg border border-green-200">
              <CheckCircle2 className="w-5 h-5" />
              <span>{success}</span>
            </div>
          )}

          {error && (
            <div className="flex items-center gap-2 text-red-600 bg-red-50 p-4 rounded-lg border border-red-200">
              <AlertCircle className="w-5 h-5" />
              <span>{error}</span>
            </div>
          )}

          {/* Botão salvar */}
          <div className="flex justify-end">
            <Button
              onClick={handleSalvar}
              disabled={salvando}
              className="bg-gradient-to-r from-sky-500 to-pink-500 hover:from-sky-600 hover:to-pink-600"
            >
              {salvando ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Salvando...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Salvar Configurações
                </>
              )}
            </Button>
          </div>

          {/* Links rápidos */}
          <div className="grid md:grid-cols-3 gap-4 pt-6 border-t">
            <Link href="/perfil">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center text-center">
                    <div className="p-3 bg-purple-100 rounded-lg mb-3">
                      <Mail className="w-6 h-6 text-purple-600" />
                    </div>
                    <h3 className="font-semibold mb-1">Meu Perfil</h3>
                    <p className="text-sm text-gray-600">
                      Editar informações pessoais
                    </p>
                  </div>
                </CardContent>
              </Card>
            </Link>
            <Link href="/ingressos">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center text-center">
                    <div className="p-3 bg-sky-100 rounded-lg mb-3">
                      <CreditCard className="w-6 h-6 text-sky-600" />
                    </div>
                    <h3 className="font-semibold mb-1">Meus Ingressos</h3>
                    <p className="text-sm text-gray-600">Ver suas compras</p>
                  </div>
                </CardContent>
              </Card>
            </Link>
            <Link href="/eventos">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center text-center">
                    <div className="p-3 bg-pink-100 rounded-lg mb-3">
                      <Smartphone className="w-6 h-6 text-pink-600" />
                    </div>
                    <h3 className="font-semibold mb-1">Eventos</h3>
                    <p className="text-sm text-gray-600">
                      Explorar eventos disponíveis
                    </p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
