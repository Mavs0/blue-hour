"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import {
  Calendar,
  CreditCard,
  Mail,
  Phone,
  User,
  Ticket,
  DollarSign,
  FileText,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
} from "lucide-react";

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

interface VendaDetalhesModalProps {
  venda: Venda | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function VendaDetalhesModal({
  venda,
  open,
  onOpenChange,
}: VendaDetalhesModalProps) {
  if (!venda) return null;

  const formatarData = (data: string) => {
    return new Date(data).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "long",
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
        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-semibold bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
          <CheckCircle2 className="w-4 h-4" />
          Confirmado
        </span>
      );
    }
    if (statusPagamento === "pendente") {
      return (
        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-semibold bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
          <Clock className="w-4 h-4" />
          Pendente
        </span>
      );
    }
    if (statusPagamento === "expirado" || statusPagamento === "cancelado") {
      return (
        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-semibold bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
          <XCircle className="w-4 h-4" />
          {statusPagamento === "expirado" ? "Expirado" : "Cancelado"}
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-semibold bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200">
        <AlertCircle className="w-4 h-4" />
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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto dark:bg-gray-800 dark:border-gray-700">
        <DialogHeader>
          <DialogTitle className="text-2xl dark:text-white">
            Detalhes da Venda
          </DialogTitle>
          <DialogDescription className="dark:text-gray-400">
            Informações completas da venda {venda.codigo}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Status e Código */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Código da Venda
              </p>
              <p className="text-xl font-mono font-bold text-gray-900 dark:text-white">
                {venda.codigo}
              </p>
            </div>
            {getStatusBadge(venda.status, venda.statusPagamento)}
          </div>

          <Separator className="dark:bg-gray-700" />

          {/* Informações do Cliente */}
          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2 dark:text-white">
              <User className="w-5 h-5" />
              Informações do Cliente
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-sm text-gray-500 dark:text-gray-400">Nome</p>
                <p className="font-medium dark:text-white">
                  {venda.cliente.nome}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
                  <Mail className="w-4 h-4" />
                  Email
                </p>
                <p className="font-medium dark:text-white">
                  {venda.cliente.email}
                </p>
              </div>
              {venda.cliente.telefone && (
                <div className="space-y-1">
                  <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
                    <Phone className="w-4 h-4" />
                    Telefone
                  </p>
                  <p className="font-medium dark:text-white">
                    {venda.cliente.telefone}
                  </p>
                </div>
              )}
              {venda.cliente.cpf && (
                <div className="space-y-1">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    CPF
                  </p>
                  <p className="font-medium dark:text-white">
                    {venda.cliente.cpf}
                  </p>
                </div>
              )}
            </div>
          </div>

          <Separator className="dark:bg-gray-700" />

          {/* Informações do Evento */}
          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2 dark:text-white">
              <Calendar className="w-5 h-5" />
              Informações do Evento
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Nome do Evento
                </p>
                <p className="font-medium dark:text-white">
                  {venda.ingresso.evento.nome}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Data do Evento
                </p>
                <p className="font-medium dark:text-white">
                  {formatarData(venda.ingresso.evento.data)}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Local
                </p>
                <p className="font-medium dark:text-white">
                  {venda.ingresso.evento.local}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Cidade
                </p>
                <p className="font-medium dark:text-white">
                  {venda.ingresso.evento.cidade}
                </p>
              </div>
            </div>
          </div>

          <Separator className="dark:bg-gray-700" />

          {/* Informações da Venda */}
          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2 dark:text-white">
              <Ticket className="w-5 h-5" />
              Informações da Venda
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Tipo de Ingresso
                </p>
                <p className="font-medium dark:text-white">
                  {venda.ingresso.tipo}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Quantidade
                </p>
                <p className="font-medium dark:text-white">
                  {venda.quantidade}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Preço Unitário
                </p>
                <p className="font-medium dark:text-white">
                  {formatarMoeda(venda.ingresso.preco)}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
                  <DollarSign className="w-4 h-4" />
                  Valor Total
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {formatarMoeda(venda.valorTotal)}
                </p>
              </div>
            </div>
          </div>

          <Separator className="dark:bg-gray-700" />

          {/* Informações de Pagamento */}
          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2 dark:text-white">
              <CreditCard className="w-5 h-5" />
              Informações de Pagamento
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Forma de Pagamento
                </p>
                <p className="font-medium dark:text-white">
                  {getFormaPagamentoLabel(venda.formaPagamento)}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Status do Pagamento
                </p>
                <p className="font-medium dark:text-white capitalize">
                  {venda.statusPagamento}
                </p>
              </div>
              {venda.codigoPagamento && (
                <div className="space-y-1 md:col-span-2">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Código de Pagamento
                  </p>
                  <p className="font-mono text-sm break-all dark:text-white">
                    {venda.codigoPagamento}
                  </p>
                </div>
              )}
              {venda.vencimentoBoleto && (
                <div className="space-y-1">
                  <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    Vencimento
                  </p>
                  <p className="font-medium dark:text-white">
                    {formatarData(venda.vencimentoBoleto)}
                  </p>
                </div>
              )}
            </div>
          </div>

          <Separator className="dark:bg-gray-700" />

          {/* Histórico */}
          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2 dark:text-white">
              <Clock className="w-5 h-5" />
              Histórico
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Data de Criação
                </p>
                <p className="font-medium dark:text-white">
                  {formatarData(venda.createdAt)}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Última Atualização
                </p>
                <p className="font-medium dark:text-white">
                  {formatarData(venda.updatedAt)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
