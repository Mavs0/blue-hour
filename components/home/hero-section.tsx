"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sparkles, ArrowRight, Music2, Star } from "lucide-react";
import { useI18n } from "@/components/providers/i18n-provider";

export function HeroSection() {
  const { t } = useI18n();

  return (
    <section className="relative pt-20 pb-16 md:pt-32 md:pb-24 overflow-hidden bg-gradient-to-br from-purple-900 via-pink-900 to-purple-900 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-20"></div>
      
      {/* Animated Gradient Orbs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/30 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-pink-500/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>

      <div className="container mx-auto px-6 lg:px-8 relative z-10">
        <div className="max-w-5xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 mb-8 bg-white/10 backdrop-blur-md border border-white/20 rounded-full animate-in fade-in slide-in-from-top-4 duration-1000">
            <Sparkles className="w-4 h-4 text-purple-300 animate-pulse" />
            <span className="text-xs font-semibold text-white/90 uppercase tracking-wide">
              {t("home.hero.badge")}
            </span>
            <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
          </div>

          {/* Main Title */}
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-200">
            <span className="bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent">
              {t("home.hero.title")}
            </span>
          </h1>
          
          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-gray-200 mb-10 max-w-3xl mx-auto leading-relaxed animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-300">
            {t("home.hero.subtitle")}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-500">
            <Link href="#eventos">
              <Button
                size="lg"
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white text-lg px-10 py-7 rounded-xl font-semibold shadow-2xl hover:shadow-purple-500/50 transition-all duration-300 group"
              >
                {t("home.hero.cta")}
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href="/eventos">
              <Button
                size="lg"
                variant="outline"
                className="bg-white/10 backdrop-blur-md border-white/20 text-white hover:bg-white/20 text-lg px-10 py-7 rounded-xl font-semibold transition-all duration-300"
              >
                Ver Todos os Eventos
              </Button>
            </Link>
          </div>

          {/* Features Icons */}
          <div className="flex items-center justify-center gap-8 text-white/80 animate-in fade-in duration-1000 delay-700">
            <div className="flex items-center gap-2">
              <Music2 className="w-5 h-5 text-purple-300" />
              <span className="text-sm">K-POP</span>
            </div>
            <div className="w-1 h-1 rounded-full bg-white/40"></div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-pink-300" />
              <span className="text-sm">Experiências Únicas</span>
            </div>
            <div className="w-1 h-1 rounded-full bg-white/40"></div>
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
              <span className="text-sm">Ingressos Seguros</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
