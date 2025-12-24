import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  criarNotificacaoPagamento,
  criarNotificacaoPagamentoExpirado,
} from "@/lib/notificacoes";

// Forçar rota dinâmica para evitar coleta de dados estáticos durante o build
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

// POST - Confirmar pagamento de uma venda (simula confirmação de PIX/Boleto)
export async function POST(
  request: NextRequest,
  { params }: { params: { codigo: string } }
) {
  try {
    const { codigo } = params;
    const body = await request.json();
    const { status } = body; // "confirmado" ou "expirado"

    if (!status || !["confirmado", "expirado"].includes(status)) {
      return NextResponse.json(
        { error: "Status inválido. Use 'confirmado' ou 'expirado'" },
        { status: 400 }
      );
    }

    // Buscar venda
    const venda = await prisma.venda.findUnique({
      where: { codigo },
      include: {
        cliente: true,
        ingresso: {
          include: {
            evento: true,
          },
        },
      },
    });

    if (!venda) {
      return NextResponse.json(
        { error: "Venda não encontrada" },
        { status: 404 }
      );
    }

    // Verificar se já está no status desejado
    if (venda.statusPagamento === status) {
      return NextResponse.json({
        message: `Pagamento já está ${status}`,
        venda,
      });
    }

    // Atualizar status
    const vendaAtualizada = await prisma.venda.update({
      where: { codigo },
      data: {
        statusPagamento: status,
        status: status === "confirmado" ? "confirmada" : "pendente",
      },
      include: {
        cliente: true,
        ingresso: {
          include: {
            evento: true,
          },
        },
      },
    });

    // Se confirmado, atualizar quantidade de ingressos vendidos
    if (status === "confirmado" && venda.statusPagamento !== "confirmado") {
      await prisma.ingresso.update({
        where: { id: venda.ingressoId },
        data: {
          vendidos: {
            increment: venda.quantidade,
          },
        },
      });
    }

    // Criar notificações
    try {
      if (status === "confirmado") {
        await criarNotificacaoPagamento(
          venda.clienteId,
          codigo,
          venda.formaPagamento
        );
      } else if (status === "expirado") {
        await criarNotificacaoPagamentoExpirado(venda.clienteId, codigo);
      }
    } catch (notificacaoError) {
      console.error("Erro ao criar notificação:", notificacaoError);
      // Não falhar a atualização se houver erro na notificação
    }

    return NextResponse.json({
      success: true,
      message: `Pagamento ${
        status === "confirmado" ? "confirmado" : "expirado"
      } com sucesso`,
      venda: vendaAtualizada,
    });
  } catch (error) {
    console.error("Erro ao confirmar pagamento:", error);
    return NextResponse.json(
      { error: "Erro ao confirmar pagamento" },
      { status: 500 }
    );
  }
}
