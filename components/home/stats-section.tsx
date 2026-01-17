"use client";

import { Ticket, Users, Calendar, TrendingUp } from "lucide-react";

interface StatsSectionProps {
  totalEventos?: number;
  totalVendas?: number;
  eventosProximos?: number;
}

export function StatsSection({
  totalEventos = 0,
  totalVendas = 0,
  eventosProximos = 0,
}: StatsSectionProps) {
  const stats = [
    {
      icon: Calendar,
      value: totalEventos || "10+",
      label: "Eventos Realizados",
      color: "purple",
    },
    {
      icon: Users,
      value: totalVendas || "500+",
      label: "Participantes",
      color: "pink",
    },
    {
      icon: Ticket,
      value: eventosProximos || "5+",
      label: "Próximos Eventos",
      color: "blue",
    },
    {
      icon: TrendingUp,
      value: "100%",
      label: "Satisfação",
      color: "green",
    },
  ];

  return (
    <section className="py-12 bg-gradient-to-r from-purple-50 via-pink-50 to-purple-50 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800 border-y border-purple-100 dark:border-gray-700">
      <div className="container mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            const colorClasses = {
              purple: "bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400",
              pink: "bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400",
              blue: "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400",
              green: "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400",
            };

            return (
              <div
                key={index}
                className="text-center animate-in fade-in slide-in-from-bottom-4 duration-700"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4 ${colorClasses[stat.color as keyof typeof colorClasses]}`}>
                  <Icon className="w-8 h-8" />
                </div>
                <div className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                  {stat.label}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
