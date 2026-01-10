"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sparkles,
  Menu,
  X,
  Search,
  Bell,
  User,
  Settings,
  UserCircle,
  CreditCard,
  HelpCircle,
  Calendar,
  CheckCircle2,
  AlertCircle,
  Info,
  AlertTriangle,
  LogOut,
  Mail,
  CheckCheck,
  ExternalLink,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useI18n } from "@/components/providers/i18n-provider";
import { useTheme } from "next-themes";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useRouter } from "next/navigation";

interface Notificacao {
  id: string;
  titulo: string;
  mensagem: string;
  tipo: "info" | "success" | "warning" | "error";
  lida: boolean;
  link: string | null;
  createdAt: string;
}

export function Navbar() {
  const { t } = useI18n();
  const { theme, setTheme } = useTheme();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);
  const [notificacoes, setNotificacoes] = useState<Notificacao[]>([]);
  const [naoLidasCount, setNaoLidasCount] = useState(0);
  const [loadingNotificacoes, setLoadingNotificacoes] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [userCpf, setUserCpf] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
    // Tentar obter email/CPF do localStorage
    const storedEmail = localStorage.getItem("user_email");
    const storedCpf = localStorage.getItem("user_cpf");
    if (storedEmail) setUserEmail(storedEmail);
    if (storedCpf) setUserCpf(storedCpf);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    // Buscar notificações se tiver email ou CPF
    if (userEmail || userCpf) {
      buscarNotificacoes();
      // Atualizar a cada 30 segundos
      const interval = setInterval(() => {
        buscarNotificacoes();
      }, 30000);
      return () => clearInterval(interval);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userEmail, userCpf]);

  const buscarNotificacoes = async () => {
    if (!userEmail && !userCpf) return;

    setLoadingNotificacoes(true);
    try {
      const params = new URLSearchParams();
      if (userEmail) params.append("email", userEmail);
      if (userCpf) params.append("cpf", userCpf.replace(/\D/g, ""));
      params.append("apenasNaoLidas", "true");

      const response = await fetch(`/api/notificacoes?${params.toString()}`);
      const data = await response.json();

      if (response.ok) {
        setNotificacoes(data.notificacoes?.slice(0, 5) || []); // Últimas 5 não lidas
        setNaoLidasCount(data.naoLidasCount || 0);
      }
    } catch (error) {
      console.error("Erro ao buscar notificações:", error);
    } finally {
      setLoadingNotificacoes(false);
    }
  };

  const marcarComoLida = async (notificacaoId: string) => {
    if (!userEmail && !userCpf) return;

    try {
      const response = await fetch("/api/notificacoes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          notificacaoId,
          email: userEmail || undefined,
          cpf: userCpf ? userCpf.replace(/\D/g, "") : undefined,
        }),
      });

      if (response.ok) {
        setNotificacoes((prev) =>
          prev.map((notif) =>
            notif.id === notificacaoId ? { ...notif, lida: true } : notif
          )
        );
        setNaoLidasCount((prev) => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error("Erro ao marcar notificação como lida:", error);
    }
  };

  const getTipoIcon = (tipo: string) => {
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

  const getTipoColor = (tipo: string) => {
    switch (tipo) {
      case "success":
        return "text-green-500 dark:text-green-400";
      case "warning":
        return "text-yellow-500 dark:text-yellow-400";
      case "error":
        return "text-red-500 dark:text-red-400";
      default:
        return "text-blue-500 dark:text-blue-400";
    }
  };

  const formatarData = (data: string) => {
    const date = new Date(data);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Agora";
    if (diffMins < 60) return `${diffMins}min atrás`;
    if (diffHours < 24) return `${diffHours}h atrás`;
    if (diffDays < 7) return `${diffDays}d atrás`;
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
    });
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/eventos?search=${encodeURIComponent(
        searchQuery
      )}`;
    }
  };

  if (!mounted) {
    return null; // Evitar hydration mismatch
  }

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 shadow-sm"
          : "bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-b border-gray-200/50 dark:border-gray-800/50"
      }`}
    >
      <div className="container mx-auto px-4 lg:px-6">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2.5 flex-shrink-0 group/logo transition-transform hover:scale-105"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-sky-500 to-pink-500 shadow-lg group-hover/logo:shadow-xl group-hover/logo:from-sky-600 group-hover/logo:to-pink-600 transition-all duration-300">
              <Sparkles className="h-5 w-5 text-white group-hover/logo:rotate-12 transition-transform duration-300" />
            </div>
            <span className="text-lg font-bold bg-gradient-to-r from-sky-600 to-pink-600 dark:from-sky-400 dark:to-pink-400 bg-clip-text text-transparent group-hover/logo:from-sky-700 group-hover/logo:to-pink-700 dark:group-hover/logo:from-sky-300 dark:group-hover/logo:to-pink-300 transition-all">
              Blue Hour
            </span>
          </Link>

          {/* Search Bar - Desktop */}
          <form
            onSubmit={handleSearch}
            className="hidden md:flex flex-1 max-w-md mx-8"
          >
            <div className="relative w-full group/search">
              <Search
                className={`absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transition-colors ${
                  searchFocused
                    ? "text-sky-500 dark:text-sky-400"
                    : "text-gray-400 dark:text-gray-500"
                }`}
              />
              <Input
                type="search"
                placeholder={t("nav.search.placeholder")}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
                className={`w-full pl-9 pr-4 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 focus:bg-white dark:focus:bg-gray-800 transition-all duration-200 text-gray-900 dark:text-white ${
                  searchFocused
                    ? "ring-2 ring-sky-500 dark:ring-sky-400 border-sky-500 dark:border-sky-400 shadow-sm"
                    : "hover:border-gray-300 dark:hover:border-gray-600"
                }`}
              />
            </div>
          </form>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  href="/eventos"
                  className="group/events flex items-center gap-1.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-all px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 hover:shadow-sm"
                >
                  <Calendar className="h-4 w-4 group-hover/events:text-sky-500 dark:group-hover/events:text-sky-400 transition-colors" />
                  <span className="group-hover/events:translate-x-0.5 transition-transform">
                    {t("nav.events")}
                  </span>
                </Link>
              </TooltipTrigger>
              <TooltipContent>
                <p>{t("nav.events")}</p>
              </TooltipContent>
            </Tooltip>

            {/* Notifications Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative hover:bg-gray-100 dark:hover:bg-gray-800 transition-all hover:scale-110"
                >
                  <Bell className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                  {naoLidasCount > 0 && (
                    <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500 dark:bg-red-400 ring-2 ring-white dark:ring-gray-900 animate-pulse"></span>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-80 p-0 dark:bg-gray-800 dark:border-gray-700 shadow-xl"
              >
                <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-2">
                    <Bell className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {t("nav.notifications")}
                    </h3>
                    {naoLidasCount > 0 && (
                      <span className="px-2 py-0.5 text-xs font-medium bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-full">
                        {naoLidasCount}
                      </span>
                    )}
                  </div>
                  <Link href="/notificacoes">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-xs h-7 dark:text-gray-300 dark:hover:bg-gray-700"
                    >
                      Ver todas
                    </Button>
                  </Link>
                </div>
                <ScrollArea className="h-[400px]">
                  {loadingNotificacoes ? (
                    <div className="flex items-center justify-center p-8">
                      <div className="h-6 w-6 animate-spin rounded-full border-2 border-gray-300 dark:border-gray-600 border-t-sky-500"></div>
                    </div>
                  ) : notificacoes.length === 0 ? (
                    <div className="flex flex-col items-center justify-center p-8 text-center">
                      <Bell className="h-12 w-12 text-gray-300 dark:text-gray-600 mb-3" />
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Nenhuma notificação nova
                      </p>
                      {!userEmail && !userCpf && (
                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                          Faça login para ver notificações
                        </p>
                      )}
                    </div>
                  ) : (
                    <div className="divide-y divide-gray-200 dark:divide-gray-700">
                      {notificacoes.map((notif) => {
                        const Icon = getTipoIcon(notif.tipo);
                        const colorClass = getTipoColor(notif.tipo);
                        const content = (
                          <div
                            className={`p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer ${
                              !notif.lida
                                ? "bg-blue-50/50 dark:bg-blue-900/10"
                                : ""
                            }`}
                            onClick={() => {
                              if (notif.link) {
                                router.push(notif.link);
                              }
                              if (!notif.lida) {
                                marcarComoLida(notif.id);
                              }
                            }}
                          >
                            <div className="flex items-start gap-3">
                              <div
                                className={`flex-shrink-0 mt-0.5 ${colorClass}`}
                              >
                                <Icon className="h-5 w-5" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between gap-2">
                                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                                    {notif.titulo}
                                  </p>
                                  {!notif.lida && (
                                    <span className="flex-shrink-0 h-2 w-2 rounded-full bg-blue-500 dark:bg-blue-400"></span>
                                  )}
                                </div>
                                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                                  {notif.mensagem}
                                </p>
                                <div className="flex items-center justify-between mt-2">
                                  <span className="text-xs text-gray-400 dark:text-gray-500">
                                    {formatarData(notif.createdAt)}
                                  </span>
                                  {notif.link && (
                                    <ExternalLink className="h-3 w-3 text-gray-400 dark:text-gray-500" />
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                        return <div key={notif.id}>{content}</div>;
                      })}
                    </div>
                  )}
                </ScrollArea>
                {notificacoes.length > 0 && (
                  <div className="border-t border-gray-200 dark:border-gray-700 p-2">
                    <Link href="/notificacoes">
                      <Button
                        variant="ghost"
                        className="w-full text-sm dark:text-gray-300 dark:hover:bg-gray-700"
                      >
                        Ver todas as notificações
                      </Button>
                    </Link>
                  </div>
                )}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Menu de Navegação */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="flex items-center gap-2 hover:bg-gray-100 dark:hover:bg-gray-800 px-2 transition-all hover:scale-105 group/menu"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-sky-500 to-pink-500 shadow-md group-hover/menu:shadow-lg group-hover/menu:from-sky-600 group-hover/menu:to-pink-600 transition-all duration-300">
                    <User className="h-4 w-4 text-white" />
                  </div>
                  <span className="hidden lg:block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Menu
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-64 dark:bg-gray-800 dark:border-gray-700 shadow-xl"
              >
                {/* User Info Header */}
                {(userEmail || userCpf) && (
                  <>
                    <div className="px-3 py-2 border-b border-gray-200 dark:border-gray-700">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-sky-500 to-pink-500">
                          <User className="h-5 w-5 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                            {userEmail || "Usuário"}
                          </p>
                          {userCpf && (
                            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                              {userCpf.replace(
                                /(\d{3})(\d{3})(\d{3})(\d{2})/,
                                "$1.$2.$3-$4"
                              )}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                    <DropdownMenuSeparator className="dark:bg-gray-700" />
                  </>
                )}
                <DropdownMenuLabel className="text-xs font-semibold text-gray-500 dark:text-gray-400 px-3 py-2">
                  Menu
                </DropdownMenuLabel>
                <DropdownMenuItem
                  asChild
                  className="dark:hover:bg-gray-700 cursor-pointer transition-colors"
                >
                  <Link
                    href="/perfil"
                    className="flex items-center dark:text-gray-300 group/item"
                  >
                    <UserCircle className="mr-2 h-4 w-4 group-hover/item:text-sky-500 dark:group-hover/item:text-sky-400 transition-colors" />
                    {t("nav.profile")}
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                  asChild
                  className="dark:hover:bg-gray-700 cursor-pointer transition-colors"
                >
                  <Link
                    href="/ingressos"
                    className="flex items-center dark:text-gray-300 group/item"
                  >
                    <CreditCard className="mr-2 h-4 w-4 group-hover/item:text-sky-500 dark:group-hover/item:text-sky-400 transition-colors" />
                    {t("nav.tickets")}
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                  asChild
                  className="dark:hover:bg-gray-700 cursor-pointer transition-colors"
                >
                  <Link
                    href="/configuracoes"
                    className="flex items-center dark:text-gray-300 group/item"
                  >
                    <Settings className="mr-2 h-4 w-4 group-hover/item:text-sky-500 dark:group-hover/item:text-sky-400 transition-colors" />
                    {t("nav.settings")}
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="dark:bg-gray-700" />
                <DropdownMenuItem
                  asChild
                  className="dark:hover:bg-gray-700 cursor-pointer transition-colors"
                >
                  <Link
                    href="/ajuda"
                    className="flex items-center dark:text-gray-300 group/item"
                  >
                    <HelpCircle className="mr-2 h-4 w-4 group-hover/item:text-sky-500 dark:group-hover/item:text-sky-400 transition-colors" />
                    {t("nav.help")}
                  </Link>
                </DropdownMenuItem>
                {(userEmail || userCpf) && (
                  <>
                    <DropdownMenuSeparator className="dark:bg-gray-700" />
                    <DropdownMenuItem
                      className="dark:hover:bg-gray-700 cursor-pointer transition-colors text-red-600 dark:text-red-400"
                      onClick={() => {
                        localStorage.removeItem("user_email");
                        localStorage.removeItem("user_cpf");
                        setUserEmail(null);
                        setUserCpf(null);
                        setNotificacoes([]);
                        setNaoLidasCount(0);
                      }}
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Limpar dados
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-gray-900 dark:text-white"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Search Bar */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 py-4">
            <form onSubmit={handleSearch} className="mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
                <Input
                  type="search"
                  placeholder={t("nav.search.placeholder")}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white"
                />
              </div>
            </form>

            <div className="flex flex-col gap-1">
              <Link
                href="/eventos"
                className="group flex items-center gap-2 px-4 py-2.5 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-all hover:translate-x-1"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Calendar className="h-4 w-4 group-hover:text-sky-500 dark:group-hover:text-sky-400 transition-colors" />
                {t("nav.events")}
              </Link>
              <Link
                href="/perfil"
                className="group flex items-center gap-2 px-4 py-2.5 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-all hover:translate-x-1"
                onClick={() => setMobileMenuOpen(false)}
              >
                <UserCircle className="h-4 w-4 group-hover:text-sky-500 dark:group-hover:text-sky-400 transition-colors" />
                {t("nav.profile")}
              </Link>
              <Link
                href="/ingressos"
                className="group flex items-center gap-2 px-4 py-2.5 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-all hover:translate-x-1"
                onClick={() => setMobileMenuOpen(false)}
              >
                <CreditCard className="h-4 w-4 group-hover:text-sky-500 dark:group-hover:text-sky-400 transition-colors" />
                {t("nav.tickets")}
              </Link>
              <Link
                href="/configuracoes"
                className="group flex items-center gap-2 px-4 py-2.5 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-all hover:translate-x-1"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Settings className="h-4 w-4 group-hover:text-sky-500 dark:group-hover:text-sky-400 transition-colors" />
                {t("nav.settings")}
              </Link>
              <Link
                href="/notificacoes"
                className="group relative flex items-center gap-2 px-4 py-2.5 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-all hover:translate-x-1"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Bell className="h-4 w-4 group-hover:text-sky-500 dark:group-hover:text-sky-400 transition-colors" />
                {t("nav.notifications")}
                <span className="absolute right-4 h-2 w-2 rounded-full bg-red-500 dark:bg-red-400"></span>
              </Link>
              <Link
                href="/ajuda"
                className="group flex items-center gap-2 px-4 py-2.5 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-all hover:translate-x-1"
                onClick={() => setMobileMenuOpen(false)}
              >
                <HelpCircle className="h-4 w-4 group-hover:text-sky-500 dark:group-hover:text-sky-400 transition-colors" />
                {t("nav.help")}
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
