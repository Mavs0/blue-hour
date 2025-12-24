"use client";

import { useState, useEffect } from "react";
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
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
  const [filters, setFilters] = useState({
    status: "",
    statusPagamento: "",
    formaPagamento: "",
    codigo: "",
    clienteNome: "",
    eventoId: "",
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 50,
    total: 0,
    totalPages: 0,
  });

  const fetchVendas = async () => {
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
      if (filters.eventoId) params.append("eventoId", filters.eventoId);
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
  };

  useEffect(() => {
    fetchVendas();
  }, [filters, pagination.page]);

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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Gerenciar Vendas</h1>
        <p className="text-sm text-gray-500 mt-1">
          Visualize e gerencie todas as vendas realizadas
        </p>
      </div>

      {/* Estatísticas */}
      {stats && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          <Card className="border-l-4 border-l-blue-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Total de Vendas
              </CardTitle>
              <Ticket className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">
                {stats.totalVendas}
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-green-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Vendas Confirmadas
              </CardTitle>
              <CheckCircle2 className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">
                {stats.quantidadeConfirmada}
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-purple-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Receita Total
              </CardTitle>
              <DollarSign className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">
                {formatarMoeda(stats.totalReceita)}
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-pink-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Receita Confirmada
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-pink-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">
                {formatarMoeda(stats.receitaConfirmada)}
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-orange-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Ingressos Vendidos
              </CardTitle>
              <Users className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">
                {stats.totalQuantidade}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filtros
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
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
                  className="pl-9"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Buscar por Cliente
              </label>
              <Input
                placeholder="Nome do cliente"
                value={filters.clienteNome}
                onChange={(e) =>
                  setFilters({ ...filters, clienteNome: e.target.value })
                }
              />
            </div>

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
                  eventoId: "",
                });
                setPagination({ ...pagination, page: 1 });
              }}
            >
              Limpar Filtros
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Vendas */}
      <Card>
        <CardHeader>
          <CardTitle>Vendas</CardTitle>
          <CardDescription>
            {pagination.total} venda(s) encontrada(s)
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
              <p className="mt-4 text-gray-500">Carregando vendas...</p>
            </div>
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
                          <div className="text-2xl font-bold text-gray-900">
                            {formatarMoeda(venda.valorTotal)}
                          </div>
                          <div className="text-xs text-gray-500">
                            {venda.quantidade} ingresso(s)
                          </div>
                        </div>

                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm">
                              <Eye className="w-4 h-4 mr-2" />
                              Ver Detalhes
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-64">
                            <div className="p-3 space-y-2">
                              <div className="text-xs">
                                <div className="font-semibold mb-1">
                                  Informações:
                                </div>
                                <div className="space-y-1 text-gray-600">
                                  <div>
                                    <span className="font-medium">Código:</span>{" "}
                                    {venda.codigo}
                                  </div>
                                  {venda.codigoPagamento && (
                                    <div>
                                      <span className="font-medium">
                                        Código Pagamento:
                                      </span>{" "}
                                      {venda.codigoPagamento.substring(0, 20)}
                                      ...
                                    </div>
                                  )}
                                  {venda.cliente.telefone && (
                                    <div>
                                      <span className="font-medium">
                                        Telefone:
                                      </span>{" "}
                                      {venda.cliente.telefone}
                                    </div>
                                  )}
                                  {venda.cliente.cpf && (
                                    <div>
                                      <span className="font-medium">CPF:</span>{" "}
                                      {venda.cliente.cpf}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </DropdownMenuContent>
                        </DropdownMenu>
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
    </div>
  );
}
