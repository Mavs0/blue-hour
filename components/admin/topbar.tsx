"use client";

import {
  Bell,
  Search,
  User,
  Menu,
  X,
  CheckCircle2,
  AlertCircle,
  Info,
  AlertTriangle,
  Settings,
  LogOut,
  ExternalLink,
} from "lucide-react";
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
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface AdminTopbarProps {
  onMenuClick?: () => void;
  sidebarOpen?: boolean;
}

interface Notificacao {
  id: string;
  titulo: string;
  mensagem: string;
  tipo: "info" | "success" | "warning" | "error";
  lida: boolean;
  link: string | null;
  createdAt: string;
}

export function AdminTopbar({ onMenuClick, sidebarOpen }: AdminTopbarProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);
  const [notificacoes, setNotificacoes] = useState<Notificacao[]>([]);
  const [naoLidasCount, setNaoLidasCount] = useState(0);
  const [loadingNotificacoes, setLoadingNotificacoes] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [userCpf, setUserCpf] = useState<string | null>(null);

  useEffect(() => {
    // Buscar notificações administrativas
    buscarNotificacoes();
    // Atualizar a cada 30 segundos
    const interval = setInterval(() => {
      buscarNotificacoes();
    }, 30000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const buscarNotificacoes = async () => {
    setLoadingNotificacoes(true);
    try {
      const params = new URLSearchParams();
      params.append("apenasNaoLidas", "true");
      params.append("limit", "5");

      const response = await fetch(
        `/api/admin/notificacoes?${params.toString()}`
      );
      const data = await response.json();

      if (response.ok) {
        setNotificacoes(data.notificacoes || []); // Últimas 5 não lidas
        setNaoLidasCount(data.naoLidasCount || 0);
      }
    } catch (error) {
      console.error("Erro ao buscar notificações:", error);
    } finally {
      setLoadingNotificacoes(false);
    }
  };

  const marcarComoLida = async (notificacaoId: string) => {
    try {
      const response = await fetch("/api/admin/notificacoes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          notificacaoId,
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

  return (
    <header className="sticky top-0 z-50 flex h-16 items-center gap-4 border-b border-gray-200 dark:border-gray-700 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm px-4 shadow-sm md:px-6">
      {/* Mobile Menu Button */}
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden dark:hover:bg-gray-700"
        onClick={onMenuClick}
      >
        {sidebarOpen ? (
          <X className="h-5 w-5 dark:text-gray-300" />
        ) : (
          <Menu className="h-5 w-5 dark:text-gray-300" />
        )}
      </Button>
      {/* Search */}
      <div className="flex-1 max-w-md">
        <div className="relative group">
          <Search
            className={`absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transition-colors ${
              searchFocused
                ? "text-sky-500 dark:text-sky-400"
                : "text-gray-400 dark:text-gray-500"
            }`}
          />
          <Input
            type="search"
            placeholder="Buscar eventos, ingressos, vendas..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            className={`w-full pl-9 pr-4 bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 focus:bg-white dark:focus:bg-gray-800 text-gray-900 dark:text-white transition-all ${
              searchFocused
                ? "ring-2 ring-sky-500 dark:ring-sky-400 border-sky-500 dark:border-sky-400 shadow-sm"
                : "hover:border-gray-300 dark:hover:border-gray-600"
            }`}
          />
        </div>
      </div>
      {/* Right Side Actions */}
      <div className="flex items-center gap-2">
        {/* Notifications Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="relative hover:bg-gray-100 dark:hover:bg-gray-700 transition-all hover:scale-110"
            >
              <Bell className="h-5 w-5 text-gray-600 dark:text-gray-300" />
              {naoLidasCount > 0 && (
                <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500 dark:bg-red-400 ring-2 ring-white dark:ring-gray-800 animate-pulse"></span>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-80 p-0 dark:bg-gray-800 dark:border-gray-700 shadow-xl z-[100]"
          >
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  Notificações
                </h3>
                {naoLidasCount > 0 && (
                  <span className="px-2 py-0.5 text-xs font-medium bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-full">
                    {naoLidasCount}
                  </span>
                )}
              </div>
              <Link href="/admin/vendas">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-xs h-7 dark:text-gray-300 dark:hover:bg-gray-700"
                >
                  Ver vendas
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
                </div>
              ) : (
                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                  {notificacoes.map((notif) => {
                    const Icon = getTipoIcon(notif.tipo);
                    const colorClass = getTipoColor(notif.tipo);
                    return (
                      <div
                        key={notif.id}
                        className={`p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer ${
                          !notif.lida ? "bg-blue-50/50 dark:bg-blue-900/10" : ""
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
                          <div className={`flex-shrink-0 mt-0.5 ${colorClass}`}>
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
                  })}
                </div>
              )}
            </ScrollArea>
            {notificacoes.length > 0 && (
              <div className="border-t border-gray-200 dark:border-gray-700 p-2">
                <Link href="/admin/vendas">
                  <Button
                    variant="ghost"
                    className="w-full text-sm dark:text-gray-300 dark:hover:bg-gray-700"
                  >
                    Ver todas as vendas
                  </Button>
                </Link>
              </div>
            )}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* User Menu Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="hover:bg-gray-100 dark:hover:bg-gray-700 transition-all hover:scale-110"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-sky-500 to-pink-500 shadow-md">
                <User className="h-4 w-4 text-white" />
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-64 dark:bg-gray-800 dark:border-gray-700 shadow-xl z-[100]"
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
                <User className="mr-2 h-4 w-4 group-hover/item:text-sky-500 dark:group-hover/item:text-sky-400 transition-colors" />
                Meu Perfil
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
                <Bell className="mr-2 h-4 w-4 group-hover/item:text-sky-500 dark:group-hover/item:text-sky-400 transition-colors" />
                Meus Ingressos
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
                Configurações
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
                <Info className="mr-2 h-4 w-4 group-hover/item:text-sky-500 dark:group-hover/item:text-sky-400 transition-colors" />
                Ajuda
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
    </header>
  );
}
