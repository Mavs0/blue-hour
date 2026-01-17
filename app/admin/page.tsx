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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Calendar,
  Ticket,
  DollarSign,
  TrendingUp,
  Users,
  ArrowRight,
  Download,
  BarChart3,
  PieChart,
  LineChart,
  Target,
} from "lucide-react";
import { AdminLoading } from "@/components/admin/admin-loading";
import {
  VendasTempoChart,
  EventosVendasChart,
  FormasPagamentoChart,
  MesesComparativoChart,
} from "@/components/admin/dashboard/charts";

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

interface DashboardAvancadoData {
  vendasTempo: Array<{ data: string; vendas: number; receita: number }>;
  eventosVendas: Array<{
    id: string;
    nome: string;
    vendas: number;
    receita: number;
  }>;
  formasPagamento: Array<{
    forma: string;
    quantidade: number;
    receita: number;
  }>;
  mesesComparativo: Array<{ mes: string; vendas: number; receita: number }>;
  metricas: {
    taxaConversao: string;
    receitaTotal: number;
    projecaoMes: number;
    mediaDiaria: number;
  };
}

export default function AdminPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [dataAvancado, setDataAvancado] =
    useState<DashboardAvancadoData | null>(null);
  const [loading, setLoading] = useState(true);
  const [periodo, setPeriodo] = useState<
    "dia" | "semana" | "mes" | "ano" | "todos"
  >("mes");

  useEffect(() => {
    fetchDashboardData();
  }, []);

  useEffect(() => {
    fetchDashboardAvancado();
  }, [periodo]);

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

  const fetchDashboardAvancado = async () => {
    try {
      const response = await fetch(
        `/api/admin/dashboard/avancado?periodo=${periodo}`
      );
      const result = await response.json();
      if (response.ok) {
        setDataAvancado(result);
      }
    } catch (error) {
      console.error("Erro ao buscar dados avançados:", error);
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

  const exportarRelatorio = () => {
    if (!dataAvancado) return;

    // Criar CSV
    const csvLines = [
      "Relatório de Vendas - Blue Hour",
      `Período: ${periodo}`,
      `Data: ${new Date().toLocaleDateString("pt-BR")}`,
      "",
      "Vendas por Evento",
      "Evento,Vendas,Receita",
      ...dataAvancado.eventosVendas.map(
        (e) => `"${e.nome}",${e.vendas},${e.receita.toFixed(2)}`
      ),
      "",
      "Formas de Pagamento",
      "Forma,Quantidade,Receita",
      ...dataAvancado.formasPagamento.map(
        (f) => `"${f.forma}",${f.quantidade},${f.receita.toFixed(2)}`
      ),
    ];

    const csv = csvLines.join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `relatorio-vendas-${periodo}-${Date.now()}.csv`
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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

  const dashboardAvancado = dataAvancado || {
    vendasTempo: [],
    eventosVendas: [],
    formasPagamento: [],
    mesesComparativo: [],
    metricas: {
      taxaConversao: "0.00",
      receitaTotal: 0,
      projecaoMes: 0,
      mediaDiaria: 0,
    },
  };

  return (
    <div className="space-y-4 md:space-y-6 px-2 md:px-0">
      {/* Header */}
      <div className="flex flex-col gap-3 md:flex-row md:justify-between md:items-center">
      <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
            Dashboard
          </h1>
          <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400 mt-1">
          Visão geral do sistema Blue Hour
        </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <Select value={periodo} onValueChange={(v: any) => setPeriodo(v)}>
            <SelectTrigger className="w-full sm:w-40 h-10 md:h-auto dark:bg-gray-800 dark:border-gray-700">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="dia">Hoje</SelectItem>
              <SelectItem value="semana">Última Semana</SelectItem>
              <SelectItem value="mes">Este Mês</SelectItem>
              <SelectItem value="ano">Este Ano</SelectItem>
              <SelectItem value="todos">Todos</SelectItem>
            </SelectContent>
          </Select>
          <Button
            onClick={exportarRelatorio}
            variant="outline"
            className="w-full sm:w-auto h-10 md:h-auto dark:border-gray-700 dark:text-gray-300"
          >
            <Download className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">Exportar CSV</span>
            <span className="sm:hidden">Exportar</span>
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        <Card className="border-l-4 border-l-sky-500 dark:bg-gray-800 dark:border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-4 pt-4 md:px-6 md:pt-6">
            <CardTitle className="text-xs md:text-sm font-medium text-gray-600 dark:text-gray-400">
              Total de Eventos
            </CardTitle>
            <Calendar className="h-4 w-4 md:h-5 md:w-5 text-sky-500 flex-shrink-0" />
          </CardHeader>
          <CardContent className="px-4 pb-4 md:px-6 md:pb-6">
            <div className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
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

        <Card className="border-l-4 border-l-pink-500 dark:bg-gray-800 dark:border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-4 pt-4 md:px-6 md:pt-6">
            <CardTitle className="text-xs md:text-sm font-medium text-gray-600 dark:text-gray-400">
              Ingressos Vendidos
            </CardTitle>
            <Ticket className="h-4 w-4 md:h-5 md:w-5 text-pink-500 flex-shrink-0" />
          </CardHeader>
          <CardContent className="px-4 pb-4 md:px-6 md:pb-6">
            <div className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
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

        <Card className="border-l-4 border-l-purple-500 dark:bg-gray-800 dark:border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-4 pt-4 md:px-6 md:pt-6">
            <CardTitle className="text-xs md:text-sm font-medium text-gray-600 dark:text-gray-400">
              Receita Total
            </CardTitle>
            <DollarSign className="h-4 w-4 md:h-5 md:w-5 text-purple-500 flex-shrink-0" />
          </CardHeader>
          <CardContent className="px-4 pb-4 md:px-6 md:pb-6">
            <div className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white break-words">
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

        <Card className="border-l-4 border-l-green-500 dark:bg-gray-800 dark:border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-4 pt-4 md:px-6 md:pt-6">
            <CardTitle className="text-xs md:text-sm font-medium text-gray-600 dark:text-gray-400">
              Clientes
            </CardTitle>
            <Users className="h-4 w-4 md:h-5 md:w-5 text-green-500 flex-shrink-0" />
          </CardHeader>
          <CardContent className="px-4 pb-4 md:px-6 md:pb-6">
            <div className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
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

      {/* Métricas Avançadas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardHeader className="px-4 pt-4 md:px-6 md:pt-6">
            <CardTitle className="text-xs md:text-sm font-medium text-gray-600 dark:text-gray-400 flex items-center gap-2">
              <Target className="h-4 w-4 text-purple-500 flex-shrink-0" />
              Taxa de Conversão
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-4 md:px-6 md:pb-6">
            <div className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
              {dashboardAvancado.metricas.taxaConversao}%
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Visualizações convertidas em vendas
            </p>
          </CardContent>
        </Card>

        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardHeader className="px-4 pt-4 md:px-6 md:pt-6">
            <CardTitle className="text-xs md:text-sm font-medium text-gray-600 dark:text-gray-400 flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-green-500 flex-shrink-0" />
              Média Diária
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-4 md:px-6 md:pb-6">
            <div className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white break-words">
              {formatarMoeda(dashboardAvancado.metricas.mediaDiaria)}
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Receita média por dia
            </p>
          </CardContent>
        </Card>

        <Card className="dark:bg-gray-800 dark:border-gray-700 sm:col-span-2 lg:col-span-1">
          <CardHeader className="px-4 pt-4 md:px-6 md:pt-6">
            <CardTitle className="text-xs md:text-sm font-medium text-gray-600 dark:text-gray-400 flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-blue-500 flex-shrink-0" />
              Projeção do Mês
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-4 md:px-6 md:pb-6">
            <div className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white break-words">
              {formatarMoeda(dashboardAvancado.metricas.projecaoMes)}
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Baseado na média atual
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Gráficos */}
      <div className="grid gap-4 md:gap-6 lg:grid-cols-2">
        {/* Vendas ao Longo do Tempo */}
        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardHeader className="px-4 pt-4 md:px-6 md:pt-6">
            <div className="flex items-center gap-2">
              <LineChart className="h-4 w-4 md:h-5 md:w-5 text-blue-500 flex-shrink-0" />
              <CardTitle className="text-base md:text-lg dark:text-white">
                Vendas ao Longo do Tempo
              </CardTitle>
            </div>
            <CardDescription className="text-xs md:text-sm dark:text-gray-400 mt-1">
              Evolução de vendas e receita
            </CardDescription>
          </CardHeader>
          <CardContent className="px-4 pb-4 md:px-6 md:pb-6">
            {dashboardAvancado.vendasTempo.length > 0 ? (
              <div className="w-full overflow-x-auto">
                <div className="min-w-[300px]">
                  <VendasTempoChart data={dashboardAvancado.vendasTempo} />
                </div>
              </div>
            ) : (
              <div className="h-[250px] md:h-[300px] flex items-center justify-center text-gray-400 dark:text-gray-500 text-sm">
                Nenhum dado disponível para o período selecionado
              </div>
            )}
          </CardContent>
        </Card>

        {/* Formas de Pagamento */}
        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardHeader className="px-4 pt-4 md:px-6 md:pt-6">
            <div className="flex items-center gap-2">
              <PieChart className="h-4 w-4 md:h-5 md:w-5 text-pink-500 flex-shrink-0" />
              <CardTitle className="text-base md:text-lg dark:text-white">
                Formas de Pagamento
              </CardTitle>
            </div>
            <CardDescription className="text-xs md:text-sm dark:text-gray-400 mt-1">
              Distribuição por método de pagamento
            </CardDescription>
          </CardHeader>
          <CardContent className="px-4 pb-4 md:px-6 md:pb-6">
            {dashboardAvancado.formasPagamento.length > 0 ? (
              <div className="w-full overflow-x-auto">
                <div className="min-w-[250px]">
                  <FormasPagamentoChart data={dashboardAvancado.formasPagamento} />
                </div>
              </div>
            ) : (
              <div className="h-[250px] md:h-[300px] flex items-center justify-center text-gray-400 dark:text-gray-500 text-sm">
                Nenhum dado disponível para o período selecionado
              </div>
            )}
          </CardContent>
        </Card>

        {/* Vendas por Evento */}
        <Card className="lg:col-span-2 dark:bg-gray-800 dark:border-gray-700">
          <CardHeader className="px-4 pt-4 md:px-6 md:pt-6">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4 md:h-5 md:w-5 text-purple-500 flex-shrink-0" />
              <CardTitle className="text-base md:text-lg dark:text-white">
                Top Eventos Mais Vendidos
              </CardTitle>
            </div>
            <CardDescription className="text-xs md:text-sm dark:text-gray-400 mt-1">
              Eventos com maior número de vendas
            </CardDescription>
          </CardHeader>
          <CardContent className="px-4 pb-4 md:px-6 md:pb-6">
            {dashboardAvancado.eventosVendas.length > 0 ? (
              <div className="w-full overflow-x-auto">
                <div className="min-w-[400px]">
                  <EventosVendasChart data={dashboardAvancado.eventosVendas} />
                </div>
              </div>
            ) : (
              <div className="h-[250px] md:h-[300px] flex items-center justify-center text-gray-400 dark:text-gray-500 text-sm">
                Nenhum dado disponível para o período selecionado
              </div>
            )}
          </CardContent>
        </Card>

        {/* Comparativo Mensal */}
        <Card className="lg:col-span-2 dark:bg-gray-800 dark:border-gray-700">
          <CardHeader className="px-4 pt-4 md:px-6 md:pt-6">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4 md:h-5 md:w-5 text-green-500 flex-shrink-0" />
              <CardTitle className="text-base md:text-lg dark:text-white">
                Comparativo Mensal
              </CardTitle>
            </div>
            <CardDescription className="text-xs md:text-sm dark:text-gray-400 mt-1">
              Últimos 6 meses de vendas e receita
            </CardDescription>
          </CardHeader>
          <CardContent className="px-4 pb-4 md:px-6 md:pb-6">
            {dashboardAvancado.mesesComparativo.length > 0 ? (
              <div className="w-full overflow-x-auto">
                <div className="min-w-[400px]">
                  <MesesComparativoChart
                    data={dashboardAvancado.mesesComparativo}
                  />
                </div>
              </div>
            ) : (
              <div className="h-[250px] md:h-[300px] flex items-center justify-center text-gray-400 dark:text-gray-500 text-sm">
                Nenhum dado disponível
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-lg md:text-xl font-semibold text-gray-900 dark:text-white mb-3 md:mb-4">
          Ações Rápidas
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
          <Card className="hover:shadow-lg transition-all cursor-pointer group border-2 border-transparent hover:border-sky-200 dark:bg-gray-800 dark:border-gray-700">
            <Link href="/admin/eventos">
              <CardHeader className="px-4 pt-4 md:px-6 md:pt-6">
                <div className="flex items-center justify-between">
                  <div className="flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-xl bg-gradient-to-br from-sky-500 to-pink-500">
                    <Calendar className="h-5 w-5 md:h-6 md:w-6 text-white" />
                  </div>
                  <ArrowRight className="h-4 w-4 md:h-5 md:w-5 text-gray-400 group-hover:text-sky-500 transition-colors" />
                </div>
                <CardTitle className="mt-3 md:mt-4 text-base md:text-lg dark:text-white">
                  Gerenciar Eventos
                </CardTitle>
                <CardDescription className="text-xs md:text-sm dark:text-gray-400">
                  Crie e edite eventos do TXT
                </CardDescription>
              </CardHeader>
            </Link>
          </Card>

          <Card className="hover:shadow-lg transition-all cursor-pointer group border-2 border-transparent hover:border-pink-200 dark:bg-gray-800 dark:border-gray-700">
            <Link href="/admin/ingressos">
              <CardHeader className="px-4 pt-4 md:px-6 md:pt-6">
                <div className="flex items-center justify-between">
                  <div className="flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-xl bg-gradient-to-br from-pink-500 to-purple-500">
                    <Ticket className="h-5 w-5 md:h-6 md:w-6 text-white" />
                  </div>
                  <ArrowRight className="h-4 w-4 md:h-5 md:w-5 text-gray-400 group-hover:text-pink-500 transition-colors" />
                </div>
                <CardTitle className="mt-3 md:mt-4 text-base md:text-lg dark:text-white">
                  Gerenciar Ingressos
                </CardTitle>
                <CardDescription className="text-xs md:text-sm dark:text-gray-400">
                  Configure tipos e quantidades
                </CardDescription>
              </CardHeader>
            </Link>
          </Card>

          <Card className="hover:shadow-lg transition-all cursor-pointer group border-2 border-transparent hover:border-purple-200 dark:bg-gray-800 dark:border-gray-700 sm:col-span-2 lg:col-span-1">
            <Link href="/admin/vendas">
              <CardHeader className="px-4 pt-4 md:px-6 md:pt-6">
                <div className="flex items-center justify-between">
                  <div className="flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-sky-500">
                    <DollarSign className="h-5 w-5 md:h-6 md:w-6 text-white" />
                  </div>
                  <ArrowRight className="h-4 w-4 md:h-5 md:w-5 text-gray-400 group-hover:text-purple-500 transition-colors" />
                </div>
                <CardTitle className="mt-3 md:mt-4 text-base md:text-lg dark:text-white">
                  Visualizar Vendas
                </CardTitle>
                <CardDescription className="text-xs md:text-sm dark:text-gray-400">
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
