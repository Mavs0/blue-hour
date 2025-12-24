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
  LogOut,
  UserCircle,
  CreditCard,
  HelpCircle,
} from "lucide-react";
import { useState, useEffect } from "react";

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);

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

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm"
          : "bg-white/95 backdrop-blur-md border-b border-gray-200/50"
      }`}
    >
      <div className="container mx-auto px-4 lg:px-6">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 flex-shrink-0">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-sky-500 to-pink-500">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <span className="text-lg font-bold text-gray-900">Blue Hour</span>
          </Link>

          {/* Search Bar - Desktop */}
          <form
            onSubmit={handleSearch}
            className="hidden md:flex flex-1 max-w-md mx-8"
          >
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                type="search"
                placeholder="Buscar eventos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
                className={`w-full pl-9 pr-4 bg-gray-50 border-gray-200 focus:bg-white transition-colors ${
                  searchFocused ? "ring-2 ring-sky-500 border-sky-500" : ""
                }`}
              />
            </div>
          </form>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-2">
            <Link
              href="/eventos"
              className="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors px-3 py-2 rounded-md hover:bg-gray-100"
            >
              Eventos
            </Link>

            {/* Notifications */}
            <Link href="/notificacoes">
              <Button
                variant="ghost"
                size="icon"
                className="relative hover:bg-gray-100"
              >
                <Bell className="h-5 w-5 text-gray-600" />
                <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"></span>
              </Button>
            </Link>

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="flex items-center gap-2 hover:bg-gray-100 px-2"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-sky-500 to-pink-500">
                    <User className="h-4 w-4 text-white" />
                  </div>
                  <span className="hidden lg:block text-sm font-medium text-gray-700">
                    Usuário
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium">Usuário</p>
                    <p className="text-xs text-gray-500">usuario@email.com</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link
                    href="/perfil"
                    className="flex items-center cursor-pointer"
                  >
                    <UserCircle className="mr-2 h-4 w-4" />
                    Meu Perfil
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link
                    href="/ingressos"
                    className="flex items-center cursor-pointer"
                  >
                    <CreditCard className="mr-2 h-4 w-4" />
                    Meus Ingressos
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link
                    href="/configuracoes"
                    className="flex items-center cursor-pointer"
                  >
                    <Settings className="mr-2 h-4 w-4" />
                    Configurações
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link
                    href="/ajuda"
                    className="flex items-center cursor-pointer"
                  >
                    <HelpCircle className="mr-2 h-4 w-4" />
                    Ajuda
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-red-600 focus:text-red-600 cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4" />
                  Trocar de Conta
                </DropdownMenuItem>
                <DropdownMenuItem className="text-red-600 focus:text-red-600 cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4" />
                  Sair
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-gray-900"
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
          <div className="md:hidden border-t border-gray-200 bg-white py-4">
            <form onSubmit={handleSearch} className="mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  type="search"
                  placeholder="Buscar eventos..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 bg-gray-50 border-gray-200"
                />
              </div>
            </form>

            <div className="flex flex-col gap-1">
              <Link
                href="/eventos"
                className="px-4 py-2 text-gray-700 font-medium hover:bg-gray-100 rounded-md transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Eventos
              </Link>
              <Link
                href="/perfil"
                className="px-4 py-2 text-gray-700 font-medium hover:bg-gray-100 rounded-md transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Meu Perfil
              </Link>
              <Link
                href="/ingressos"
                className="px-4 py-2 text-gray-700 font-medium hover:bg-gray-100 rounded-md transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Meus Ingressos
              </Link>
              <Link
                href="/configuracoes"
                className="px-4 py-2 text-gray-700 font-medium hover:bg-gray-100 rounded-md transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Configurações
              </Link>
              <div className="border-t border-gray-200 my-2"></div>
              <button
                className="px-4 py-2 text-red-600 font-medium hover:bg-red-50 rounded-md transition-colors text-left"
                onClick={() => setMobileMenuOpen(false)}
              >
                Trocar de Conta
              </button>
              <button
                className="px-4 py-2 text-red-600 font-medium hover:bg-red-50 rounded-md transition-colors text-left"
                onClick={() => setMobileMenuOpen(false)}
              >
                Sair
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
