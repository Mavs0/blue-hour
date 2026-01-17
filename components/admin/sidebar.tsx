"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  Calendar,
  Ticket,
  DollarSign,
  Home,
  Sparkles,
  LayoutDashboard,
  LogOut,
  ChevronLeft,
  ChevronRight,
  X,
  Settings,
} from "lucide-react";

const menuItems = [
  {
    title: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    title: "Eventos",
    href: "/admin/eventos",
    icon: Calendar,
  },
  {
    title: "Ingressos",
    href: "/admin/ingressos",
    icon: Ticket,
  },
  {
    title: "Vendas",
    href: "/admin/vendas",
    icon: DollarSign,
  },
  {
    title: "Configurações",
    href: "/admin/configuracoes",
    icon: Settings,
  },
];

interface AdminSidebarProps {
  collapsed?: boolean;
  onToggleCollapse?: () => void;
  onClose?: () => void;
}

export function AdminSidebar({
  collapsed = false,
  onToggleCollapse,
  onClose,
}: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleLogout = async () => {
    try {
      await fetch("/api/admin/logout", { method: "POST" });
      router.push("/admin/login");
      router.refresh();
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    }
  };

  // Fechar sidebar mobile ao clicar em um link
  const handleLinkClick = () => {
    if (onClose) {
      onClose();
    }
  };

  // No mobile ou quando onClose está presente, sempre mostrar largura completa (não colapsada)
  const isMobileMode = isMobile || !!onClose;
  const sidebarWidth = isMobileMode ? "w-64" : collapsed ? "w-20" : "w-64";

  return (
    <aside
      className={cn(
        "h-screen border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm transition-all duration-300 flex flex-col",
        sidebarWidth
      )}
    >
      {/* Logo */}
      <div
        className={cn(
          "flex items-center border-b border-gray-200 dark:border-gray-700 px-4 bg-gradient-to-r from-sky-50 to-pink-50 dark:from-sky-900/20 dark:to-pink-900/20 transition-all duration-300",
          collapsed && !isMobileMode ? "h-16 justify-center" : "h-16 gap-3"
        )}
      >
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-sky-500 to-pink-500 shadow-lg flex-shrink-0">
          <Sparkles className="h-5 w-5 text-white" />
        </div>
        {(!collapsed || isMobileMode) && (
          <div className="flex-1 min-w-0">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white truncate">
              Blue Hour
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
              Admin Panel
            </p>
          </div>
        )}
        {/* Mobile Close Button */}
        {onClose && (
          <button
            onClick={onClose}
            className="ml-auto p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 transition-colors"
            aria-label="Fechar menu"
          >
            <X className="h-5 w-5" />
          </button>
        )}
        {/* Desktop Collapse Button */}
        {onToggleCollapse && !onClose && (
          <button
            onClick={onToggleCollapse}
            className="hidden md:flex ml-auto p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 transition-all"
            aria-label={collapsed ? "Expandir menu" : "Recolher menu"}
          >
            {collapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-3 py-4 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={handleLinkClick}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 group relative",
                collapsed && !isMobileMode ? "justify-center" : "",
                isActive
                  ? "bg-gradient-to-r from-sky-500 to-pink-500 text-white shadow-md shadow-pink-500/20"
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white"
              )}
              title={collapsed && !isMobileMode ? item.title : undefined}
            >
              <Icon
                className={cn(
                  "h-5 w-5 flex-shrink-0",
                  isActive ? "text-white" : "text-gray-500 dark:text-gray-400"
                )}
              />
              {(!collapsed || isMobileMode) && <span className="truncate">{item.title}</span>}
              {collapsed && !isMobileMode && (
                <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 dark:bg-gray-700 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                  {item.title}
                </div>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-gray-200 dark:border-gray-700 p-4 bg-gray-50 dark:bg-gray-900/50 space-y-2">
        <Link
          href="/"
          onClick={handleLinkClick}
          className={cn(
            "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white transition-all duration-200",
            collapsed && !isMobileMode && "justify-center"
          )}
          title={collapsed && !isMobileMode ? "Voltar ao Site" : undefined}
        >
          <Home className="h-5 w-5 text-gray-500 dark:text-gray-400 flex-shrink-0" />
          {(!collapsed || isMobileMode) && <span>Voltar ao Site</span>}
        </Link>
        <button
          onClick={() => {
            handleLogout();
            if (onClose) onClose();
          }}
          className={cn(
            "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200",
            collapsed && !isMobileMode && "justify-center"
          )}
          title={collapsed && !isMobileMode ? "Sair" : undefined}
        >
          <LogOut className="h-5 w-5 flex-shrink-0" />
          {(!collapsed || isMobileMode) && <span>Sair</span>}
        </button>
      </div>
    </aside>
  );
}
