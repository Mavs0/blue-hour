"use client";

import Link from "next/link";
import { Sparkles, Calendar, Shield } from "lucide-react";
import { useI18n } from "@/components/providers/i18n-provider";

export function Footer() {
  const { t } = useI18n();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 dark:bg-gray-950 text-white py-12 border-t border-gray-800 dark:border-gray-900">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-sky-400 to-pink-400 rounded-lg flex items-center justify-center shadow-lg">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold">Blue Hour</span>
            </div>
            <p className="text-gray-400 dark:text-gray-500 mb-4 max-w-md">
              {t("footer.description")
                .split("{brand}")
                .map((part, i, arr) =>
                  i === arr.length - 1 ? (
                    part
                  ) : (
                    <span key={i}>
                      {part}
                      <span className="text-pink-400 dark:text-pink-500 font-semibold">
                        TXT
                      </span>
                    </span>
                  )
                )}
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-4">{t("footer.quickLinks")}</h3>
            <ul className="space-y-3 text-gray-400 dark:text-gray-500">
              <li>
                <Link
                  href="/eventos"
                  className="group flex items-center gap-2 hover:text-white dark:hover:text-gray-200 transition-all duration-200 font-medium"
                >
                  <div className="p-1.5 rounded-md bg-gradient-to-br from-sky-500/20 to-pink-500/20 group-hover:from-sky-500/30 group-hover:to-pink-500/30 transition-all">
                    <Calendar className="w-4 h-4 text-sky-400 dark:text-sky-500 group-hover:text-sky-300 dark:group-hover:text-sky-400" />
                  </div>
                  <span className="group-hover:translate-x-1 transition-transform">
                    {t("nav.events")}
                  </span>
                </Link>
              </li>
              <li>
                <Link
                  href="/admin"
                  className="group flex items-center gap-2 hover:text-white dark:hover:text-gray-200 transition-all duration-200 font-medium"
                >
                  <div className="p-1.5 rounded-md bg-gradient-to-br from-purple-500/20 to-pink-500/20 group-hover:from-purple-500/30 group-hover:to-pink-500/30 transition-all">
                    <Shield className="w-4 h-4 text-purple-400 dark:text-purple-500 group-hover:text-purple-300 dark:group-hover:text-purple-400" />
                  </div>
                  <span className="group-hover:translate-x-1 transition-transform">
                    {t("footer.admin")}
                  </span>
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">{t("footer.contact")}</h3>
            <ul className="space-y-2 text-gray-400 dark:text-gray-500">
              <li>{t("footer.location")}</li>
              <li>{t("footer.email")}</li>
              <li>{t("footer.exclusive")}</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 dark:border-gray-900 mt-8 pt-8 text-center text-gray-400 dark:text-gray-500">
          <p>
            {t("footer.copyright").replace("{year}", currentYear.toString())}
          </p>
        </div>
      </div>
    </footer>
  );
}
