"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Ticket, ArrowRight, Sparkles } from "lucide-react";
import { useI18n } from "@/components/providers/i18n-provider";

export function CTASection() {
  const { t } = useI18n();

  return (
    <section className="relative py-20 overflow-hidden bg-gradient-to-br from-purple-900 via-pink-900 to-purple-900 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-20"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl"></div>

      <div className="container mx-auto px-6 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 bg-white/10 backdrop-blur-md border border-white/20 rounded-full">
            <Sparkles className="w-4 h-4 text-yellow-400" />
            <span className="text-sm font-semibold text-white/90">
              Não perca nenhum evento
            </span>
          </div>

          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            <span className="bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent">
              {t("home.cta.title")}
            </span>
          </h2>
          <p className="text-xl text-gray-200 mb-10 max-w-2xl mx-auto">
            {t("home.cta.subtitle")}
          </p>
          <Link href="/eventos">
            <Button
              size="lg"
              className="bg-gradient-to-r from-white to-gray-100 text-gray-900 hover:from-gray-100 hover:to-white text-lg px-12 py-7 rounded-xl font-semibold shadow-2xl hover:shadow-white/20 transition-all duration-300 group"
            >
              <Ticket className="mr-2 w-6 h-6" />
              {t("home.cta.button")}
              <ArrowRight className="ml-2 w-6 h-6 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
