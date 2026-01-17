"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DollarSign,
  Ticket,
  Users,
  TrendingUp,
  Search,
  Filter,
  Calendar,
  CreditCard,
  CheckCircle2,
  Clock,
  XCircle,
  AlertCircle,
  Eye,
  Download,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AdminLoading } from "@/components/admin/admin-loading";
import { VendaDetalhesModal } from "@/components/admin/vendas/venda-detalhes-modal";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type Venda = {
  id: string;
  codigo: string;
  quantidade: number;
  valorTotal: number;
  formaPagamento: string;
  statusPagamento: string;
  status: string;
  codigoPagamento: string | null;
  vencimentoBoleto: string | null;
  createdAt: string;
  updatedAt: string;
  cliente: {
    id: string;
    nome: string;
    email: string;
    telefone: string | null;
    cpf: string | null;
  };
  ingresso: {
    id: string;
    tipo: string;
    preco: number;
    evento: {
      id: string;
      nome: string;
      data: string;
      local: string;
      cidade: string;
    };
  };
};

type Stats = {
  totalVendas: number;
  totalQuantidade: number;
  totalReceita: number;
  receitaConfirmada: number;
  quantidadeConfirmada: number;
};

export default function AdminVendasPage() {
  const [vendas, setVendas] = useState<Venda[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedVenda, setSelectedVenda] = useState<Venda | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [filterMode, setFilterMode] = useState<"AND" | "OR">("AND");
  const [activeTab, setActiveTab] = useState("basico");
  const [filters, setFilters] = useState({
    status: "",
    statusPagamento: "",
    formaPagamento: "",
    codigo: "",
    clienteNome: "",
    clienteEmail: "",
    clienteCPF: "",
    eventoId: "",
    eventoNome: "",
    dataInicio: "",
    dataFim: "",
    valorMin: "",
    valorMax: "",
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 50,
    total: 0,
    totalPages: 0,
  });

  const fetchVendas = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.status) params.append("status", filters.status);
      if (filters.statusPagamento)
        params.append("statusPagamento", filters.statusPagamento);
      if (filters.formaPagamento)
        params.append("formaPagamento", filters.formaPagamento);
      if (filters.codigo) params.append("codigo", filters.codigo);
      if (filters.clienteNome)
        params.append("clienteNome", filters.clienteNome);
      if (filters.clienteEmail)
        params.append("clienteEmail", filters.clienteEmail);
      if (filters.clienteCPF) params.append("clienteCPF", filters.clienteCPF);
      if (filters.eventoId) params.append("eventoId", filters.eventoId);
      if (filters.eventoNome) params.append("eventoNome", filters.eventoNome);
      if (filters.dataInicio) params.append("dataInicio", filters.dataInicio);
      if (filters.dataFim) params.append("dataFim", filters.dataFim);
      if (filters.valorMin) params.append("valorMin", filters.valorMin);
      if (filters.valorMax) params.append("valorMax", filters.valorMax);
      params.append("filterMode", filterMode);
      params.append("page", pagination.page.toString());
      params.append("limit", pagination.limit.toString());

      const response = await fetch(`/api/admin/vendas?${params}`);
      const data = await response.json();

      if (response.ok) {
        setVendas(data.vendas);
        setStats(data.stats);
        setPagination(data.pagination);
      }
    } catch (error) {
      console.error("Erro ao buscar vendas:", error);
    } finally {
      setLoading(false);
    }
  }, [filters, pagination.page, pagination.limit]);

  useEffect(() => {
    fetchVendas();
  }, [fetchVendas]);

  const formatarData = (data: string) => {
    return new Date(data).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatarMoeda = (valor: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(valor);
  };

  const getStatusBadge = (status: string, statusPagamento: string) => {
    if (statusPagamento === "confirmado") {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">
          <CheckCircle2 className="w-3 h-3" />
          Confirmado
        </span>
      );
    }
    if (statusPagamento === "pendente") {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800">
          <Clock className="w-3 h-3" />
          Pendente
        </span>
      );
    }
    if (statusPagamento === "expirado" || statusPagamento === "cancelado") {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800">
          <XCircle className="w-3 h-3" />
          {statusPagamento === "expirado" ? "Expirado" : "Cancelado"}
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-800">
        <AlertCircle className="w-3 h-3" />
        {statusPagamento}
      </span>
    );
  };

  const getFormaPagamentoLabel = (forma: string) => {
    const formas: Record<string, string> = {
      pix: "PIX",
      cartao_credito: "Cartão de Crédito",
      cartao_debito: "Cartão de Débito",
      boleto: "Boleto",
    };
    return formas[forma] || forma;
  };

  const exportarRelatorio = () => {
    if (vendas.length === 0) return;

    const csvLines = [
      "Relatório de Vendas - Blue Hour",
      `Data de Exportação: ${new Date().toLocaleDateString("pt-BR")}`,
      `Total de Vendas: ${pagination.total}`,
      `Filtros Aplicados: ${
        Object.entries(filters).filter(([_, v]) => v).length > 0 ? "Sim" : "Não"
      }`,
      "",
      "Dados das Vendas",
      "Código,Cliente,Email,Telefone,CPF,Evento,Ingresso,Quantidade,Valor Unitário,Valor Total,Forma Pagamento,Status Pagamento,Data Criação,Data Atualização",
      ...vendas.map((venda) => {
        const linha = [
          venda.codigo,
          `"${venda.cliente.nome}"`,
          venda.cliente.email,
          venda.cliente.telefone || "",
          venda.cliente.cpf || "",
          `"${venda.ingresso.evento.nome}"`,
          `"${venda.ingresso.tipo}"`,
          venda.quantidade.toString(),
          venda.ingresso.preco.toFixed(2).replace(".", ","),
          venda.valorTotal.toFixed(2).replace(".", ","),
          getFormaPagamentoLabel(venda.formaPagamento),
          venda.statusPagamento,
          formatarData(venda.createdAt),
          formatarData(venda.updatedAt),
        ];
        return linha.join(",");
      }),
    ];

    const csv = csvLines.join("\n");
    const blob = new Blob(["\uFEFF" + csv], {
      type: "text/csv;charset=utf-8;",
    });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `relatorio-vendas-${new Date().toISOString().split("T")[0]}.csv`
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Gerenciar Vendas
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Visualize e gerencie todas as vendas realizadas
          </p>
        </div>
        <Button
          onClick={exportarRelatorio}
          variant="outline"
          className="dark:border-gray-700 dark:text-gray-300"
          disabled={vendas.length === 0}
        >
          <Download className="w-4 h-4 mr-2" />
          Exportar CSV
        </Button>
      </div>

      {/* Estatísticas */}
      {stats && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          <Card className="border-l-4 border-l-blue-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Total de Vendas
              </CardTitle>
              <Ticket className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats.totalVendas}
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-green-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Vendas Confirmadas
              </CardTitle>
              <CheckCircle2 className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats.quantidadeConfirmada}
              </div>
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
                {formatarMoeda(stats.totalReceita)}
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-pink-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Receita Confirmada
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-pink-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {formatarMoeda(stats.receitaConfirmada)}
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-orange-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Ingressos Vendidos
              </CardTitle>
              <Users className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats.totalQuantidade}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 dark:text-white">
            <Filter className="w-5 h-5" />
            Filtros
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList>
              <TabsTrigger value="basico">Filtros Básicos</TabsTrigger>
              <TabsTrigger value="avancado">Filtros Avançados</TabsTrigger>
            </TabsList>

            <TabsContent value="basico">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mt-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Buscar por Código
                  </label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <Input
                      placeholder="Ex: BLUE-1234"
                      value={filters.codigo}
                      onChange={(e) =>
                        setFilters({ ...filters, codigo: e.target.value })
                      }
                      className="pl-9 dark:bg-gray-800 dark:border-gray-700"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Buscar por Cliente
                  </label>
                  <Input
                    placeholder="Nome do cliente"
                    value={filters.clienteNome}
                    onChange={(e) =>
                      setFilters({ ...filters, clienteNome: e.target.value })
                    }
                    className="dark:bg-gray-800 dark:border-gray-700"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Status do Pagamento
                  </label>
                  <Select
                    value={filters.statusPagamento || "all"}
                    onValueChange={(value) =>
                      setFilters({
                        ...filters,
                        statusPagamento: value === "all" ? "" : value,
                      })
                    }
                  >
                    <SelectTrigger className="dark:bg-gray-800 dark:border-gray-700">
                      <SelectValue placeholder="Todos" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos</SelectItem>
                      <SelectItem value="pendente">Pendente</SelectItem>
                      <SelectItem value="confirmado">Confirmado</SelectItem>
                      <SelectItem value="expirado">Expirado</SelectItem>
                      <SelectItem value="cancelado">Cancelado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Forma de Pagamento
                  </label>
                  <Select
                    value={filters.formaPagamento || "all"}
                    onValueChange={(value) =>
                      setFilters({
                        ...filters,
                        formaPagamento: value === "all" ? "" : value,
                      })
                    }
                  >
                    <SelectTrigger className="dark:bg-gray-800 dark:border-gray-700">
                      <SelectValue placeholder="Todas" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todas</SelectItem>
                      <SelectItem value="pix">PIX</SelectItem>
                      <SelectItem value="cartao_credito">
                        Cartão de Crédito
                      </SelectItem>
                      <SelectItem value="cartao_debito">
                        Cartão de Débito
                      </SelectItem>
                      <SelectItem value="boleto">Boleto</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="avancado">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mt-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Email do Cliente
                  </label>
                  <Input
                    type="email"
                    placeholder="email@exemplo.com"
                    value={filters.clienteEmail}
                    onChange={(e) =>
                      setFilters({ ...filters, clienteEmail: e.target.value })
                    }
                    className="dark:bg-gray-800 dark:border-gray-700"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    CPF do Cliente
                  </label>
                  <Input
                    placeholder="000.000.000-00"
                    value={filters.clienteCPF}
                    onChange={(e) =>
                      setFilters({ ...filters, clienteCPF: e.target.value })
                    }
                    className="dark:bg-gray-800 dark:border-gray-700"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Nome do Evento
                  </label>
                  <Input
                    placeholder="Nome do evento"
                    value={filters.eventoNome}
                    onChange={(e) =>
                      setFilters({ ...filters, eventoNome: e.target.value })
                    }
                    className="dark:bg-gray-800 dark:border-gray-700"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Data Início
                  </label>
                  <Input
                    type="date"
                    value={filters.dataInicio}
                    onChange={(e) =>
                      setFilters({ ...filters, dataInicio: e.target.value })
                    }
                    className="dark:bg-gray-800 dark:border-gray-700"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Data Fim
                  </label>
                  <Input
                    type="date"
                    value={filters.dataFim}
                    onChange={(e) =>
                      setFilters({ ...filters, dataFim: e.target.value })
                    }
                    className="dark:bg-gray-800 dark:border-gray-700"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Valor Mínimo (R$)
                  </label>
                  <Input
                    type="number"
                    placeholder="0.00"
                    value={filters.valorMin}
                    onChange={(e) =>
                      setFilters({ ...filters, valorMin: e.target.value })
                    }
                    className="dark:bg-gray-800 dark:border-gray-700"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Valor Máximo (R$)
                  </label>
                  <Input
                    type="number"
                    placeholder="9999.99"
                    value={filters.valorMax}
                    onChange={(e) =>
                      setFilters({ ...filters, valorMax: e.target.value })
                    }
                    className="dark:bg-gray-800 dark:border-gray-700"
                  />
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <div className="mt-4 flex gap-2 flex-wrap">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Status do Pagamento
              </label>
              <Select
                value={filters.statusPagamento || "all"}
                onValueChange={(value) =>
                  setFilters({
                    ...filters,
                    statusPagamento: value === "all" ? "" : value,
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Todos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="pendente">Pendente</SelectItem>
                  <SelectItem value="confirmado">Confirmado</SelectItem>
                  <SelectItem value="expirado">Expirado</SelectItem>
                  <SelectItem value="cancelado">Cancelado</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Forma de Pagamento
              </label>
              <Select
                value={filters.formaPagamento || "all"}
                onValueChange={(value) =>
                  setFilters({
                    ...filters,
                    formaPagamento: value === "all" ? "" : value,
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Todas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  <SelectItem value="pix">PIX</SelectItem>
                  <SelectItem value="cartao_credito">
                    Cartão de Crédito
                  </SelectItem>
                  <SelectItem value="cartao_debito">
                    Cartão de Débito
                  </SelectItem>
                  <SelectItem value="boleto">Boleto</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="mt-4 flex gap-2">
            <Button onClick={fetchVendas} className="flex items-center gap-2">
              <Search className="w-4 h-4" />
              Buscar
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setFilters({
                  status: "",
                  statusPagamento: "",
                  formaPagamento: "",
                  codigo: "",
                  clienteNome: "",
                  clienteEmail: "",
                  clienteCPF: "",
                  eventoId: "",
                  eventoNome: "",
                  dataInicio: "",
                  dataFim: "",
                  valorMin: "",
                  valorMax: "",
                });
                setPagination({ ...pagination, page: 1 });
                setActiveTab("basico");
              }}
            >
              Limpar Filtros
            </Button>
            <Select
              value={filterMode}
              onValueChange={(v: "AND" | "OR") => setFilterMode(v)}
            >
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="AND">E (AND)</SelectItem>
                <SelectItem value="OR">OU (OR)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Vendas */}
      <Card>
        <CardHeader>
          <CardTitle className="dark:text-white">Vendas</CardTitle>
          <CardDescription className="dark:text-gray-400">
            {pagination.total} venda(s) encontrada(s)
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <AdminLoading message="Carregando vendas..." variant="inline" />
          ) : vendas.length === 0 ? (
            <div className="text-center py-12">
              <Ticket className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Nenhuma venda encontrada</p>
            </div>
          ) : (
            <div className="space-y-4">
              {vendas.map((venda) => (
                <Card
                  key={venda.id}
                  className="hover:shadow-md transition-shadow"
                >
                  <CardContent className="pt-6">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-3">
                          <span className="font-mono font-semibold text-lg text-gray-900">
                            {venda.codigo}
                          </span>
                          {getStatusBadge(venda.status, venda.statusPagamento)}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                          <div>
                            <span className="text-gray-500">Cliente:</span>{" "}
                            <span className="font-medium">
                              {venda.cliente.nome}
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-500">Email:</span>{" "}
                            <span className="font-medium">
                              {venda.cliente.email}
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-500">Evento:</span>{" "}
                            <span className="font-medium">
                              {venda.ingresso.evento.nome}
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-500">Ingresso:</span>{" "}
                            <span className="font-medium">
                              {venda.ingresso.tipo}
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-500">Quantidade:</span>{" "}
                            <span className="font-medium">
                              {venda.quantidade}
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-500">
                              Forma de Pagamento:
                            </span>{" "}
                            <span className="font-medium">
                              {getFormaPagamentoLabel(venda.formaPagamento)}
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-500">Data:</span>{" "}
                            <span className="font-medium">
                              {formatarData(venda.createdAt)}
                            </span>
                          </div>
                          {venda.vencimentoBoleto && (
                            <div>
                              <span className="text-gray-500">Vencimento:</span>{" "}
                              <span className="font-medium">
                                {formatarData(venda.vencimentoBoleto)}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-col items-end gap-2">
                        <div className="text-right">
                          <div className="text-2xl font-bold text-gray-900 dark:text-white">
                            {formatarMoeda(venda.valorTotal)}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            {venda.quantidade} ingresso(s)
                          </div>
                        </div>

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedVenda(venda);
                            setModalOpen(true);
                          }}
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          Ver Detalhes
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Paginação */}
          {pagination.totalPages > 1 && (
            <div className="mt-6 flex items-center justify-between">
              <div className="text-sm text-gray-500">
                Página {pagination.page} de {pagination.totalPages}
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setPagination({ ...pagination, page: pagination.page - 1 })
                  }
                  disabled={pagination.page === 1}
                >
                  Anterior
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setPagination({ ...pagination, page: pagination.page + 1 })
                  }
                  disabled={pagination.page === pagination.totalPages}
                >
                  Próxima
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal de Detalhes */}
      <VendaDetalhesModal
        venda={selectedVenda}
        open={modalOpen}
        onOpenChange={setModalOpen}
      />
    </div>
  );
}
