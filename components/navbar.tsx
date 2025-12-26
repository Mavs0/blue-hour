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
} from "lucide-react";
import { useState, useEffect } from "react";
import { useI18n } from "@/components/providers/i18n-provider";
import { useTheme } from "next-themes";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function Navbar() {
  const { t } = useI18n();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
    <TooltipProvider delayDuration={300}>
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

              {/* Notifications */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link href="/notificacoes">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="relative hover:bg-gray-100 dark:hover:bg-gray-800 transition-all hover:scale-110"
                    >
                      <Bell className="h-5 w-5 text-gray-600 dark:text-gray-300 group-hover:animate-pulse" />
                      <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500 dark:bg-red-400 ring-2 ring-white dark:ring-gray-900 animate-pulse"></span>
                    </Button>
                  </Link>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{t("nav.notifications")}</p>
                </TooltipContent>
              </Tooltip>

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
                  className="w-56 dark:bg-gray-800 dark:border-gray-700 shadow-xl"
                >
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
    </TooltipProvider>
  );
}
