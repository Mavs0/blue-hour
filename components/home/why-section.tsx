"use client";

import { Ticket, Calendar, Users, Shield, Zap, Heart } from "lucide-react";
import { useI18n } from "@/components/providers/i18n-provider";

export function WhySection() {
  const { t } = useI18n();

  const features = [
    {
      icon: Ticket,
      title: t("home.why.tickets.title"),
      desc: t("home.why.tickets.desc"),
      color: "purple",
      gradient: "from-purple-500 to-purple-600",
    },
    {
      icon: Calendar,
      title: t("home.why.events.title"),
      desc: t("home.why.events.desc"),
      color: "pink",
      gradient: "from-pink-500 to-pink-600",
    },
    {
      icon: Users,
      title: t("home.why.community.title"),
      desc: t("home.why.community.desc"),
      color: "blue",
      gradient: "from-blue-500 to-blue-600",
    },
    {
      icon: Shield,
      title: "Pagamento Seguro",
      desc: "Transações protegidas com criptografia de ponta a ponta",
      color: "green",
      gradient: "from-green-500 to-green-600",
    },
    {
      icon: Zap,
      title: "Confirmação Rápida",
      desc: "Receba seus ingressos instantaneamente após o pagamento",
      color: "yellow",
      gradient: "from-yellow-500 to-yellow-600",
    },
    {
      icon: Heart,
      title: "Experiência Completa",
      desc: "Do ingresso à experiência, cuidamos de cada detalhe",
      color: "red",
      gradient: "from-red-500 to-red-600",
    },
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                {t("home.why.title")}
              </span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              {t("home.why.subtitle")}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="group relative bg-white dark:bg-gray-800 p-8 rounded-2xl border-2 border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-600 transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
                  style={{
                    animationDelay: `${index * 100}ms`,
                  }}
                >
                  <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.gradient} mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    {feature.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
