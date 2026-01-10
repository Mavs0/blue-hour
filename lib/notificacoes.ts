// Utilitários para criar e gerenciar notificações

import { prisma } from "./prisma";

interface CriarNotificacaoParams {
  clienteId: string;
  titulo: string;
  mensagem: string;
  tipo?: "info" | "success" | "warning" | "error";
  link?: string;
}

/**
 * Cria uma nova notificação para um cliente
 */
export async function criarNotificacao({
  clienteId,
  titulo,
  mensagem,
  tipo = "info",
  link,
}: CriarNotificacaoParams) {
  try {
    const notificacao = await prisma.notificacao.create({
      data: {
        clienteId,
        titulo,
        mensagem,
        tipo,
        link,
      },
    });

    return notificacao;
  } catch (error) {
    console.error("Erro ao criar notificação:", error);
    throw error;
  }
}

/**
 * Cria notificação de confirmação de compra
 */
export async function criarNotificacaoCompra(
  clienteId: string,
  codigoVenda: string,
  nomeEvento: string
) {
  return criarNotificacao({
    clienteId,
    titulo: "Compra Confirmada!",
    mensagem: `Sua compra do evento "${nomeEvento}" foi confirmada. Código: ${codigoVenda}`,
    tipo: "success",
    link: `/compra/confirmacao?codigo=${codigoVenda}`,
  });
}

/**
 * Cria notificação de confirmação de pagamento
 */
export async function criarNotificacaoPagamento(
  clienteId: string,
  codigoVenda: string,
  formaPagamento: string
) {
  const formasPagamento: Record<string, string> = {
    pix: "PIX",
    cartao_credito: "Cartão de Crédito",
    cartao_debito: "Cartão de Débito",
    boleto: "Boleto Bancário",
  };

  return criarNotificacao({
    clienteId,
    titulo: "Pagamento Confirmado!",
    mensagem: `Seu pagamento via ${
      formasPagamento[formaPagamento] || formaPagamento
    } foi confirmado.`,
    tipo: "success",
    link: `/compra/confirmacao?codigo=${codigoVenda}`,
  });
}

/**
 * Cria notificação de lembrete de evento
 */
export async function criarNotificacaoLembrete(
  clienteId: string,
  nomeEvento: string,
  dataEvento: Date,
  codigoVenda: string
) {
  const diasRestantes = Math.ceil(
    (dataEvento.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
  );

  return criarNotificacao({
    clienteId,
    titulo: `Lembrete: ${nomeEvento}`,
    mensagem: `O evento "${nomeEvento}" acontece em ${diasRestantes} dia(s). Não esqueça de levar seu ingresso!`,
    tipo: "info",
    link: `/ingressos`,
  });
}

/**
 * Cria notificação de pagamento pendente
 */
export async function criarNotificacaoPagamentoPendente(
  clienteId: string,
  codigoVenda: string,
  formaPagamento: string,
  vencimento?: Date
) {
  const formasPagamento: Record<string, string> = {
    pix: "PIX",
    cartao_credito: "Cartão de Crédito",
    cartao_debito: "Cartão de Débito",
    boleto: "Boleto Bancário",
  };

  let mensagem = `Seu pagamento via ${
    formasPagamento[formaPagamento] || formaPagamento
  } está pendente.`;
  if (vencimento) {
    mensagem += ` Vence em ${vencimento.toLocaleDateString("pt-BR")}.`;
  }

  return criarNotificacao({
    clienteId,
    titulo: "Pagamento Pendente",
    mensagem,
    tipo: "warning",
    link: `/compra/pagamento?codigo=${codigoVenda}`,
  });
}

/**
 * Cria notificação de pagamento expirado
 */
export async function criarNotificacaoPagamentoExpirado(
  clienteId: string,
  codigoVenda: string
) {
  return criarNotificacao({
    clienteId,
    titulo: "Pagamento Expirado",
    mensagem:
      "O prazo para pagamento expirou. Realize uma nova compra se ainda desejar participar do evento.",
    tipo: "error",
    link: `/eventos`,
  });
}

/**
 * Cria uma notificação administrativa (para todos os admins)
 */
export async function criarNotificacaoAdmin({
  titulo,
  mensagem,
  tipo = "info",
  link,
}: {
  titulo: string;
  mensagem: string;
  tipo?: "info" | "success" | "warning" | "error";
  link?: string;
}) {
  try {
    const notificacao = await prisma.notificacaoAdmin.create({
      data: {
        titulo,
        mensagem,
        tipo,
        link,
      },
    });

    return notificacao;
  } catch (error) {
    console.error("Erro ao criar notificação administrativa:", error);
    throw error;
  }
}

/**
 * Cria notificação administrativa de nova compra
 */
export async function criarNotificacaoAdminCompra(
  nomeCliente: string,
  tipoIngresso: string,
  nomeEvento: string,
  quantidade: number,
  valorTotal: number,
  codigoVenda: string,
  kit?: string | null
) {
  const mensagemKit = kit ? ` (Kit: ${kit})` : "";
  const mensagem = `${nomeCliente} fez uma compra de ${quantidade} ingresso(s) ${tipoIngresso}${mensagemKit} do evento "${nomeEvento}" no valor de R$ ${valorTotal.toFixed(
    2
  )}. Código: ${codigoVenda}`;

  return criarNotificacaoAdmin({
    titulo: "Nova Compra Realizada",
    mensagem,
    tipo: "success",
    link: `/admin/vendas?codigo=${codigoVenda}`,
  });
}
