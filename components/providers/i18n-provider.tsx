"use client";

import * as React from "react";
import { createContext, useContext, useState, useEffect } from "react";
import type { Locale } from "@/lib/i18n";

type I18nContextType = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string) => string;
};

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export function I18nProvider({
  children,
  defaultLocale = "pt-BR",
}: {
  children: React.ReactNode;
  defaultLocale?: Locale;
}) {
  const [locale, setLocaleState] = useState<Locale>(defaultLocale);

  // Carregar locale do localStorage ao montar (apenas no cliente)
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedLocale = localStorage.getItem("locale") as Locale;
      if (savedLocale && ["pt-BR", "en-US", "es-ES"].includes(savedLocale)) {
        setLocaleState(savedLocale);
        document.documentElement.lang = savedLocale;
      } else {
        document.documentElement.lang = defaultLocale;
      }
    }
  }, [defaultLocale]);

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    localStorage.setItem("locale", newLocale);
    // Atualizar lang do HTML
    document.documentElement.lang = newLocale;
  };

  const t = (key: string): string => {
    // Importação dinâmica para evitar problemas de SSR
    try {
      const translations = require("@/lib/i18n").translations;
      return translations[locale]?.[key] || translations["pt-BR"]?.[key] || key;
    } catch {
      return key;
    }
  };

  // Sempre fornecer um valor válido, mesmo durante SSR
  const value: I18nContextType = {
    locale,
    setLocale,
    t,
  };

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (context === undefined) {
    throw new Error("useI18n must be used within an I18nProvider");
  }
  return context;
}
