"use client";

import { Ticket, Calendar, Users } from "lucide-react";
import { useI18n } from "@/components/providers/i18n-provider";

export function WhySection() {
  const { t } = useI18n();

  return (
    <section className="py-16 bg-gray-50 dark:bg-gray-800">
      <div className="container mx-auto px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              {t("home.why.title")}
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              {t("home.why.subtitle")}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-gray-900 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="w-12 h-12 bg-sky-100 dark:bg-sky-900 rounded-lg flex items-center justify-center mb-4">
                <Ticket className="w-6 h-6 text-sky-600 dark:text-sky-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                {t("home.why.tickets.title")}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                {t("home.why.tickets.desc")}
              </p>
            </div>

            <div className="bg-white dark:bg-gray-900 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="w-12 h-12 bg-pink-100 dark:bg-pink-900 rounded-lg flex items-center justify-center mb-4">
                <Calendar className="w-6 h-6 text-pink-600 dark:text-pink-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                {t("home.why.events.title")}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                {t("home.why.events.desc")}
              </p>
            </div>

            <div className="bg-white dark:bg-gray-900 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                {t("home.why.community.title")}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                {t("home.why.community.desc")}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
