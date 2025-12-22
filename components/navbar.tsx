"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sparkles, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/95 backdrop-blur-md shadow-lg py-4"
          : "bg-transparent py-6"
      }`}
    >
      <div className="container mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-3 group transition-transform hover:scale-105"
          >
            <div
              className={`w-12 h-12 bg-gradient-to-br from-sky-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow ${
                scrolled ? "scale-90" : ""
              }`}
            >
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <span
              className={`text-2xl font-black transition-colors ${
                scrolled
                  ? "bg-gradient-to-r from-sky-500 via-pink-500 to-purple-500 bg-clip-text text-transparent"
                  : "text-white drop-shadow-lg"
              }`}
            >
              Blue Hour
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              href="/eventos"
              className={`font-semibold transition-colors ${
                scrolled
                  ? "text-gray-700 hover:text-pink-500"
                  : "text-white/90 hover:text-white drop-shadow-md"
              }`}
            >
              Eventos
            </Link>
            <Link href="/eventos">
              <Button
                className={
                  scrolled
                    ? "bg-gradient-to-r from-sky-500 to-pink-500 hover:from-sky-600 hover:to-pink-600 text-white shadow-lg font-semibold"
                    : "bg-white/20 backdrop-blur-md border border-white/40 text-white hover:bg-white/30 shadow-lg font-semibold"
                }
              >
                Ver Eventos
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className={`md:hidden transition-colors ${
              scrolled ? "text-gray-700" : "text-white drop-shadow-lg"
            }`}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-6 pb-4 bg-white/95 backdrop-blur-md rounded-2xl border border-gray-200 shadow-xl">
            <div className="flex flex-col gap-3 p-4">
              <Link
                href="/eventos"
                className="text-gray-700 font-semibold hover:text-pink-500 transition-colors py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Eventos
              </Link>
              <Link href="/eventos" onClick={() => setMobileMenuOpen(false)}>
                <Button className="w-full bg-gradient-to-r from-sky-500 to-pink-500 hover:from-sky-600 hover:to-pink-600 text-white font-semibold">
                  Ver Eventos
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
