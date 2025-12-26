"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { useI18n } from "@/components/providers/i18n-provider";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  Monitor,
  Save,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Smartphone,
  CreditCard,
} from "lucide-react";
import Link from "next/link";
import { locales, localeNames, type Locale } from "@/lib/i18n";

export default function ConfiguracoesPage() {
  const { theme, setTheme } = useTheme();
  const { locale, setLocale, t } = useI18n();
  const [mounted, setMounted] = useState(false);
  const [salvando, setSalvando] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Estados para notificações
  const [notificacoesEmail, setNotificacoesEmail] = useState(true);
  const [notificacoesCompra, setNotificacoesCompra] = useState(true);
  const [notificacoesPagamento, setNotificacoesPagamento] = useState(true);
  const [notificacoesLembrete, setNotificacoesLembrete] = useState(true);
  const [notificacoesPromocoes, setNotificacoesPromocoes] = useState(false);

  // Aguardar montagem para evitar hydration mismatch
  useEffect(() => {
    setMounted(true);
    // Carregar preferências do localStorage
    const savedNotifications = localStorage.getItem("notifications");
    if (savedNotifications) {
      try {
        const prefs = JSON.parse(savedNotifications);
        setNotificacoesEmail(prefs.email ?? true);
        setNotificacoesCompra(prefs.compra ?? true);
        setNotificacoesPagamento(prefs.pagamento ?? true);
        setNotificacoesLembrete(prefs.lembrete ?? true);
        setNotificacoesPromocoes(prefs.promocoes ?? false);
      } catch (e) {
        console.error("Erro ao carregar preferências:", e);
      }
    }
  }, []);

  const handleSalvar = async () => {
    setSalvando(true);
    setError(null);
    setSuccess(null);

    try {
      // Salvar preferências no localStorage
      const preferences = {
        email: notificacoesEmail,
        compra: notificacoesCompra,
        pagamento: notificacoesPagamento,
        lembrete: notificacoesLembrete,
        promocoes: notificacoesPromocoes,
      };
      localStorage.setItem("notifications", JSON.stringify(preferences));

      // O tema e idioma já são salvos automaticamente pelos providers
      setSuccess(t("settings.saved"));
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(t("error.saveSettings"));
    } finally {
      setSalvando(false);
    }
  };

  if (!mounted) {
    return null; // Evitar hydration mismatch
  }

  return (
    <main className="flex flex-col flex-1 bg-gradient-to-b from-purple-50 to-pink-50 dark:from-gray-900 dark:to-gray-800">
      <Navbar />
      <div className="flex-1 container mx-auto px-4 py-24 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            {t("settings.title")}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {t("settings.subtitle")}
          </p>
        </div>

        <div className="space-y-6">
          {/* Notificações */}
          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 dark:text-white">
                <Bell className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                {t("notifications.title")}
              </CardTitle>
              <CardDescription className="dark:text-gray-300">
                {t("notifications.subtitle")}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <Label
                      htmlFor="notif-email"
                      className="text-base font-medium dark:text-gray-300"
                    >
                      {t("notifications.email")}
                    </Label>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      {t("notifications.email.desc")}
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notificacoesEmail}
                      onChange={(e) => setNotificacoesEmail(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 dark:bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 dark:peer-focus:ring-purple-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600 dark:peer-checked:bg-purple-500"></div>
                  </label>
                </div>

                <div className="border-t dark:border-gray-700 pt-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <Label className="text-base font-medium dark:text-gray-300">
                        {t("notifications.purchase")}
                      </Label>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        {t("notifications.purchase.desc")}
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
                      <div className="w-11 h-6 bg-gray-200 dark:bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 dark:peer-focus:ring-purple-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600 dark:peer-checked:bg-purple-500 peer-disabled:opacity-50 peer-disabled:cursor-not-allowed"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <Label className="text-base font-medium dark:text-gray-300">
                        {t("notifications.payment")}
                      </Label>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        {t("notifications.payment.desc")}
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
                      <div className="w-11 h-6 bg-gray-200 dark:bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 dark:peer-focus:ring-purple-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600 dark:peer-checked:bg-purple-500 peer-disabled:opacity-50 peer-disabled:cursor-not-allowed"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <Label className="text-base font-medium dark:text-gray-300">
                        {t("notifications.reminder")}
                      </Label>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        {t("notifications.reminder.desc")}
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
                      <div className="w-11 h-6 bg-gray-200 dark:bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 dark:peer-focus:ring-purple-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600 dark:peer-checked:bg-purple-500 peer-disabled:opacity-50 peer-disabled:cursor-not-allowed"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <Label className="text-base font-medium dark:text-gray-300">
                        {t("notifications.promotions")}
                      </Label>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        {t("notifications.promotions.desc")}
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
                      <div className="w-11 h-6 bg-gray-200 dark:bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 dark:peer-focus:ring-purple-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600 dark:peer-checked:bg-purple-500 peer-disabled:opacity-50 peer-disabled:cursor-not-allowed"></div>
                    </label>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Preferências */}
          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 dark:text-white">
                <Settings className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                {t("preferences.title")}
              </CardTitle>
              <CardDescription className="dark:text-gray-300">
                {t("preferences.subtitle")}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label
                  htmlFor="tema"
                  className="text-base font-medium mb-2 block dark:text-gray-300"
                >
                  {t("settings.theme")}
                </Label>
                <div className="grid grid-cols-3 gap-4">
                  <button
                    onClick={() => setTheme("light")}
                    className={`group p-4 border-2 rounded-lg transition-all hover:scale-105 ${
                      theme === "light"
                        ? "border-purple-500 dark:border-purple-400 bg-purple-50 dark:bg-purple-900/20 shadow-md"
                        : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 bg-white dark:bg-gray-900"
                    }`}
                  >
                    <Sun
                      className={`w-6 h-6 mx-auto mb-2 transition-colors ${
                        theme === "light"
                          ? "text-yellow-500"
                          : "text-yellow-400 dark:text-yellow-500"
                      }`}
                    />
                    <span className="text-sm font-medium dark:text-gray-300">
                      {t("settings.theme.light")}
                    </span>
                  </button>
                  <button
                    onClick={() => setTheme("dark")}
                    className={`group p-4 border-2 rounded-lg transition-all hover:scale-105 ${
                      theme === "dark"
                        ? "border-purple-500 dark:border-purple-400 bg-purple-50 dark:bg-purple-900/20 shadow-md"
                        : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 bg-white dark:bg-gray-900"
                    }`}
                  >
                    <Moon
                      className={`w-6 h-6 mx-auto mb-2 transition-colors ${
                        theme === "dark"
                          ? "text-indigo-500"
                          : "text-indigo-400 dark:text-indigo-500"
                      }`}
                    />
                    <span className="text-sm font-medium dark:text-gray-300">
                      {t("settings.theme.dark")}
                    </span>
                  </button>
                  <button
                    onClick={() => setTheme("system")}
                    className={`group p-4 border-2 rounded-lg transition-all hover:scale-105 ${
                      theme === "system"
                        ? "border-purple-500 dark:border-purple-400 bg-purple-50 dark:bg-purple-900/20 shadow-md"
                        : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 bg-white dark:bg-gray-900"
                    }`}
                  >
                    <Monitor
                      className={`w-6 h-6 mx-auto mb-2 transition-colors ${
                        theme === "system"
                          ? "text-gray-600 dark:text-gray-400"
                          : "text-gray-400 dark:text-gray-500"
                      }`}
                    />
                    <span className="text-sm font-medium dark:text-gray-300">
                      {t("settings.theme.system")}
                    </span>
                  </button>
                </div>
              </div>

              <div>
                <Label
                  htmlFor="idioma"
                  className="text-base font-medium mb-2 block dark:text-gray-300"
                >
                  {t("settings.language")}
                </Label>
                <Select
                  value={locale}
                  onValueChange={(value) => setLocale(value as Locale)}
                >
                  <SelectTrigger className="dark:bg-gray-900 dark:border-gray-700 dark:text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
                    {locales.map((loc) => (
                      <SelectItem
                        key={loc}
                        value={loc}
                        className="dark:text-gray-300 dark:hover:bg-gray-700"
                      >
                        {localeNames[loc]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Privacidade e Segurança */}
          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 dark:text-white">
                <Shield className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                {t("privacy.title")}
              </CardTitle>
              <CardDescription className="dark:text-gray-300">
                {t("privacy.subtitle")}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  {t("privacy.dataSafe")}
                </p>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-2 mb-2">
                    <Shield className="w-4 h-4 text-green-600 dark:text-green-400" />
                    <span className="text-sm font-medium dark:text-gray-300">
                      Dados Protegidos
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    Seus dados pessoais são armazenados de forma segura e
                    criptografada.
                  </p>
                </div>
                <div className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-2 mb-2">
                    <Shield className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    <span className="text-sm font-medium dark:text-gray-300">
                      Privacidade
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    Respeitamos sua privacidade e não compartilhamos seus dados
                    com terceiros.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Mensagens de sucesso/erro */}
          {success && (
            <div className="flex items-center gap-2 text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
              <CheckCircle2 className="w-5 h-5" />
              <span>{success}</span>
            </div>
          )}

          {error && (
            <div className="flex items-center gap-2 text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 p-4 rounded-lg border border-red-200 dark:border-red-800">
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
                  {t("settings.saving")}
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  {t("settings.save")}
                </>
              )}
            </Button>
          </div>

          {/* Links rápidos */}
          <div className="grid md:grid-cols-3 gap-4 pt-6 border-t dark:border-gray-700">
            <Link href="/perfil">
              <Card className="hover:shadow-lg dark:hover:shadow-xl transition-all cursor-pointer group dark:bg-gray-800 dark:border-gray-700 hover:scale-105">
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center text-center">
                    <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg mb-3 group-hover:bg-purple-200 dark:group-hover:bg-purple-900/50 transition-colors">
                      <Mail className="w-6 h-6 text-purple-600 dark:text-purple-400 group-hover:scale-110 transition-transform" />
                    </div>
                    <h3 className="font-semibold mb-1 dark:text-gray-300">
                      {t("links.profile.title")}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {t("links.profile.desc")}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </Link>
            <Link href="/ingressos">
              <Card className="hover:shadow-lg dark:hover:shadow-xl transition-all cursor-pointer group dark:bg-gray-800 dark:border-gray-700 hover:scale-105">
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center text-center">
                    <div className="p-3 bg-sky-100 dark:bg-sky-900/30 rounded-lg mb-3 group-hover:bg-sky-200 dark:group-hover:bg-sky-900/50 transition-colors">
                      <CreditCard className="w-6 h-6 text-sky-600 dark:text-sky-400 group-hover:scale-110 transition-transform" />
                    </div>
                    <h3 className="font-semibold mb-1 dark:text-gray-300">
                      {t("links.tickets.title")}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {t("links.tickets.desc")}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </Link>
            <Link href="/eventos">
              <Card className="hover:shadow-lg dark:hover:shadow-xl transition-all cursor-pointer group dark:bg-gray-800 dark:border-gray-700 hover:scale-105">
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center text-center">
                    <div className="p-3 bg-pink-100 dark:bg-pink-900/30 rounded-lg mb-3 group-hover:bg-pink-200 dark:group-hover:bg-pink-900/50 transition-colors">
                      <Smartphone className="w-6 h-6 text-pink-600 dark:text-pink-400 group-hover:scale-110 transition-transform" />
                    </div>
                    <h3 className="font-semibold mb-1 dark:text-gray-300">
                      {t("links.events.title")}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {t("links.events.desc")}
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
