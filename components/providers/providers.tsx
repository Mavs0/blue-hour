"use client";

import { ThemeProvider } from "./theme-provider";
import { I18nProvider } from "./i18n-provider";
import { ToastProvider } from "@/components/ui/toaster";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <I18nProvider defaultLocale="pt-BR">
        <ToastProvider>{children}</ToastProvider>
      </I18nProvider>
    </ThemeProvider>
  );
}
