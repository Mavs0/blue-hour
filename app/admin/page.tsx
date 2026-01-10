"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Calendar,
  Ticket,
  DollarSign,
  TrendingUp,
  Users,
  ArrowRight,
} from "lucide-react";
import { AdminLoading } from "@/components/admin/admin-loading";

interface DashboardData {
  eventos: {
    total: number;
    esteMes: number;
  };
  ingressos: {
    vendidos: number;
    percentualVariacao: number;
  };
  receita: {
    total: number;
    percentualVariacao: number;
  };
  clientes: {
    total: number;
    novosEsteMes: number;
  };
}

export default function AdminPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await fetch("/api/admin/dashboard");
      const result = await response.json();
      if (response.ok) {
        setData(result);
      }
    } catch (error) {
      console.error("Erro ao buscar dados do dashboard:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatarMoeda = (valor: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(valor);
  };

  const formatarNumero = (numero: number) => {
    return new Intl.NumberFormat("pt-BR").format(numero);
  };

  if (loading) {
    return <AdminLoading message="Carregando dashboard..." />;
  }

  const dashboardData = data || {
    eventos: { total: 0, esteMes: 0 },
    ingressos: { vendidos: 0, percentualVariacao: 0 },
    receita: { total: 0, percentualVariacao: 0 },
    clientes: { total: 0, novosEsteMes: 0 },
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Dashboard
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Visão geral do sistema Blue Hour
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-l-4 border-l-sky-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Total de Eventos
            </CardTitle>
            <Calendar className="h-4 w-4 text-sky-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {formatarNumero(dashboardData.eventos.total)}
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              <span className="text-green-600 dark:text-green-400">
                +{dashboardData.eventos.esteMes}
              </span>{" "}
              este mês
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-pink-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Ingressos Vendidos
            </CardTitle>
            <Ticket className="h-4 w-4 text-pink-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {formatarNumero(dashboardData.ingressos.vendidos)}
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {dashboardData.ingressos.percentualVariacao !== 0 && (
                <span
                  className={
                    dashboardData.ingressos.percentualVariacao > 0
                      ? "text-green-600 dark:text-green-400"
                      : "text-red-600 dark:text-red-400"
                  }
                >
                  {dashboardData.ingressos.percentualVariacao > 0 ? "+" : ""}
                  {dashboardData.ingressos.percentualVariacao.toFixed(1)}%
                </span>
              )}{" "}
              {dashboardData.ingressos.percentualVariacao !== 0 &&
                "vs mês anterior"}
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Receita Total
            </CardTitle>
            <DollarSign className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {formatarMoeda(dashboardData.receita.total)}
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {dashboardData.receita.percentualVariacao !== 0 && (
                <span
                  className={
                    dashboardData.receita.percentualVariacao > 0
                      ? "text-green-600 dark:text-green-400"
                      : "text-red-600 dark:text-red-400"
                  }
                >
                  {dashboardData.receita.percentualVariacao > 0 ? "+" : ""}
                  {dashboardData.receita.percentualVariacao.toFixed(1)}%
                </span>
              )}{" "}
              {dashboardData.receita.percentualVariacao !== 0 &&
                "vs mês anterior"}
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Clientes
            </CardTitle>
            <Users className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {formatarNumero(dashboardData.clientes.total)}
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              <span className="text-green-600 dark:text-green-400">
                +{dashboardData.clientes.novosEsteMes}
              </span>{" "}
              novos clientes
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Ações Rápidas
        </h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card className="hover:shadow-lg transition-all cursor-pointer group border-2 border-transparent hover:border-sky-200">
            <Link href="/admin/eventos">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-sky-500 to-pink-500">
                    <Calendar className="h-6 w-6 text-white" />
                  </div>
                  <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-sky-500 transition-colors" />
                </div>
                <CardTitle className="mt-4 dark:text-white">
                  Gerenciar Eventos
                </CardTitle>
                <CardDescription className="dark:text-gray-400">
                  Crie e edite eventos do TXT
                </CardDescription>
              </CardHeader>
            </Link>
          </Card>

          <Card className="hover:shadow-lg transition-all cursor-pointer group border-2 border-transparent hover:border-pink-200">
            <Link href="/admin/ingressos">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-pink-500 to-purple-500">
                    <Ticket className="h-6 w-6 text-white" />
                  </div>
                  <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-pink-500 transition-colors" />
                </div>
                <CardTitle className="mt-4 dark:text-white">
                  Gerenciar Ingressos
                </CardTitle>
                <CardDescription className="dark:text-gray-400">
                  Configure tipos e quantidades
                </CardDescription>
              </CardHeader>
            </Link>
          </Card>

          <Card className="hover:shadow-lg transition-all cursor-pointer group border-2 border-transparent hover:border-purple-200">
            <Link href="/admin/vendas">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-sky-500">
                    <DollarSign className="h-6 w-6 text-white" />
                  </div>
                  <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-purple-500 transition-colors" />
                </div>
                <CardTitle className="mt-4 dark:text-white">
                  Visualizar Vendas
                </CardTitle>
                <CardDescription className="dark:text-gray-400">
                  Acompanhe todas as vendas realizadas
                </CardDescription>
              </CardHeader>
            </Link>
          </Card>
        </div>
      </div>
    </div>
  );
}
