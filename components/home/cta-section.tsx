"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Ticket, ArrowRight } from "lucide-react";
import { useI18n } from "@/components/providers/i18n-provider";

export function CTASection() {
  const { t } = useI18n();

  return (
    <section className="py-16 bg-gray-900 dark:bg-gray-950">
      <div className="container mx-auto px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            {t("home.cta.title")}
          </h2>
          <p className="text-lg text-gray-300 mb-8">{t("home.cta.subtitle")}</p>
          <Link href="/eventos">
            <Button
              size="lg"
              className="bg-white text-gray-900 hover:bg-gray-100 text-base px-10 py-6 rounded-lg font-semibold shadow-xl group"
            >
              <Ticket className="mr-2 w-5 h-5" />
              {t("home.cta.button")}
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
