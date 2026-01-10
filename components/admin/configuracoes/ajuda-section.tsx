"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  HelpCircle,
  Book,
  MessageCircle,
  FileText,
  ExternalLink,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";

const helpItems = [
  {
    title: "Como criar um evento?",
    description: "Aprenda a criar e configurar eventos na plataforma",
    icon: Book,
    href: "/admin/ajuda",
  },
  {
    title: "Gerenciar ingressos",
    description: "Saiba como criar e gerenciar tipos de ingressos",
    icon: FileText,
    href: "/admin/ajuda",
  },
  {
    title: "Visualizar vendas",
    description: "Entenda como acompanhar suas vendas e relatórios",
    icon: MessageCircle,
    href: "/admin/ajuda",
  },
];

const quickLinks = [
  {
    title: "Central de Ajuda",
    description: "Acesse a central completa de ajuda",
    href: "/admin/ajuda",
    external: false,
  },
  {
    title: "Suporte",
    description: "Entre em contato com o suporte",
    href: "/admin/ajuda",
    external: false,
  },
  {
    title: "FAQ",
    description: "Perguntas frequentes",
    href: "/admin/ajuda",
    external: false,
  },
];

export function AjudaSection() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HelpCircle className="h-5 w-5" />
            Guias Rápidos
          </CardTitle>
          <CardDescription>
            Aprenda a usar as principais funcionalidades do sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {helpItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <Link
                  key={index}
                  href={item.href}
                  className="flex items-start gap-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors group"
                >
                  <div className="p-2 bg-sky-100 dark:bg-sky-900/20 rounded-lg group-hover:bg-sky-200 dark:group-hover:bg-sky-900/30 transition-colors">
                    <Icon className="h-5 w-5 text-sky-600 dark:text-sky-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-900 dark:text-white group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      {item.description}
                    </p>
                  </div>
                  <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors flex-shrink-0" />
                </Link>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5" />
            Links Úteis
          </CardTitle>
          <CardDescription>
            Acesse recursos adicionais e suporte
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {quickLinks.map((link, index) => (
              <Link
                key={index}
                href={link.href}
                className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 hover:border-sky-300 dark:hover:border-sky-700 transition-all group"
              >
                <h3 className="font-medium text-gray-900 dark:text-white group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors mb-1">
                  {link.title}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {link.description}
                </p>
                {link.external && (
                  <ExternalLink className="h-4 w-4 text-gray-400 mt-2" />
                )}
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Precisa de mais ajuda?</CardTitle>
          <CardDescription>
            Entre em contato com nossa equipe de suporte
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
              <p className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                Email de Suporte
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                suporte@bluehour.com.br
              </p>
            </div>
            <Link href="/admin/ajuda">
              <Button className="w-full bg-gradient-to-r from-sky-500 to-pink-500 hover:from-sky-600 hover:to-pink-600">
                Acessar Central de Ajuda
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
