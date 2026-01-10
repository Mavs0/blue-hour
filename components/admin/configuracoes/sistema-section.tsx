"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Database, Server, Package, Code } from "lucide-react";

export function SistemaSection() {
  const systemInfo = [
    {
      label: "Versão do Sistema",
      value: "1.0.0",
      icon: Package,
    },
    {
      label: "Ambiente",
      value:
        process.env.NODE_ENV === "production" ? "Produção" : "Desenvolvimento",
      icon: Server,
    },
    {
      label: "Banco de Dados",
      value: "PostgreSQL (Supabase)",
      icon: Database,
    },
    {
      label: "Framework",
      value: "Next.js 14",
      icon: Code,
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Server className="h-5 w-5" />
          Informações do Sistema
        </CardTitle>
        <CardDescription>Detalhes técnicos sobre a plataforma</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {systemInfo.map((info, index) => {
            const Icon = info.icon;
            return (
              <div
                key={index}
                className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
                    <Icon className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {info.label}
                    </p>
                  </div>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 font-mono">
                  {info.value}
                </p>
              </div>
            );
          })}
        </div>

        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <p className="text-sm text-blue-900 dark:text-blue-100">
            <strong>Nota:</strong> Para mais informações sobre o sistema, entre
            em contato com o administrador.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
