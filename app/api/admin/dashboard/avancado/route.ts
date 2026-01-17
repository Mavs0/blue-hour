import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

interface PeriodoQuery {
  periodo?: "dia" | "semana" | "mes" | "ano" | "todos";
}

function getDateRange(periodo: string = "mes") {
  const agora = new Date();
  let inicio: Date;

  switch (periodo) {
    case "dia":
      inicio = new Date(agora);
      inicio.setHours(0, 0, 0, 0);
      break;
    case "semana":
      inicio = new Date(agora);
      inicio.setDate(agora.getDate() - 7);
      break;
    case "mes":
      inicio = new Date(agora.getFullYear(), agora.getMonth(), 1);
      break;
    case "ano":
      inicio = new Date(agora.getFullYear(), 0, 1);
      break;
    default:
      inicio = new Date(0); // Todos os tempos
  }

  return { inicio, fim: agora };
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const periodo = (searchParams.get("periodo") || "mes") as string;

    const { inicio, fim } = getDateRange(periodo);

    // Vendas ao longo do tempo (para gráfico de linha)
    const vendasPorData = await prisma.venda.findMany({
      where: {
        statusPagamento: "confirmado",
        status: {
          not: "cancelada",
        },
        createdAt: {
          gte: inicio,
          lte: fim,
        },
      },
      select: {
        createdAt: true,
        valorTotal: true,
        quantidade: true,
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    // Agrupar vendas por data
    const vendasAgrupadasPorData: Record<
      string,
      { vendas: number; receita: number }
    > = {};
    vendasPorData.forEach((venda) => {
      const data = new Date(venda.createdAt).toLocaleDateString("pt-BR");
      if (!vendasAgrupadasPorData[data]) {
        vendasAgrupadasPorData[data] = { vendas: 0, receita: 0 };
      }
      vendasAgrupadasPorData[data].vendas += venda.quantidade;
      vendasAgrupadasPorData[data].receita += venda.valorTotal;
    });

    const vendasTempo = Object.entries(vendasAgrupadasPorData).map(
      ([data, valores]) => ({
        data,
        vendas: valores.vendas,
        receita: valores.receita,
      })
    );

    // Vendas por evento (para gráfico de barras)
    const vendasPorEvento = await prisma.venda.findMany({
      where: {
        statusPagamento: "confirmado",
        status: {
          not: "cancelada",
        },
        createdAt: {
          gte: inicio,
          lte: fim,
        },
      },
      include: {
        ingresso: {
          include: {
            evento: {
              select: {
                id: true,
                nome: true,
              },
            },
          },
        },
      },
    });

    const eventosAgrupados: Record<
      string,
      { nome: string; vendas: number; receita: number }
    > = {};
    vendasPorEvento.forEach((venda) => {
      const eventoId = venda.ingresso.evento.id;
      const eventoNome = venda.ingresso.evento.nome;
      if (!eventosAgrupados[eventoId]) {
        eventosAgrupados[eventoId] = {
          nome: eventoNome,
          vendas: 0,
          receita: 0,
        };
      }
      eventosAgrupados[eventoId].vendas += venda.quantidade;
      eventosAgrupados[eventoId].receita += venda.valorTotal;
    });

    const eventosVendas = Object.entries(eventosAgrupados)
      .map(([id, dados]) => ({
        id,
        nome: dados.nome,
        vendas: dados.vendas,
        receita: dados.receita,
      }))
      .sort((a, b) => b.vendas - a.vendas)
      .slice(0, 10); // Top 10 eventos

    // Formas de pagamento (para gráfico de pizza)
    const vendasPorFormaPagamento = await prisma.venda.groupBy({
      by: ["formaPagamento"],
      where: {
        statusPagamento: "confirmado",
        status: {
          not: "cancelada",
        },
        createdAt: {
          gte: inicio,
          lte: fim,
        },
      },
      _count: {
        id: true,
      },
      _sum: {
        valorTotal: true,
      },
    });

    const formasPagamento = vendasPorFormaPagamento.map((item) => ({
      forma:
        item.formaPagamento === "pix"
          ? "PIX"
          : item.formaPagamento === "cartao_credito"
          ? "Cartão de Crédito"
          : item.formaPagamento === "cartao_debito"
          ? "Cartão de Débito"
          : "Boleto",
      quantidade: item._count.id,
      receita: item._sum.valorTotal || 0,
    }));

    // Comparativo mensal (últimos 6 meses)
    const agora = new Date();
    const mesesComparativo: Array<{
      mes: string;
      vendas: number;
      receita: number;
    }> = [];

    for (let i = 5; i >= 0; i--) {
      const dataMes = new Date(agora.getFullYear(), agora.getMonth() - i, 1);
      const inicioMes = new Date(dataMes.getFullYear(), dataMes.getMonth(), 1);
      const fimMes = new Date(
        dataMes.getFullYear(),
        dataMes.getMonth() + 1,
        0,
        23,
        59,
        59
      );

      const vendasMes = await prisma.venda.aggregate({
        where: {
          statusPagamento: "confirmado",
          status: {
            not: "cancelada",
          },
          createdAt: {
            gte: inicioMes,
            lte: fimMes,
          },
        },
        _sum: {
          quantidade: true,
          valorTotal: true,
        },
        _count: {
          id: true,
        },
      });

      mesesComparativo.push({
        mes: dataMes.toLocaleDateString("pt-BR", {
          month: "short",
          year: "numeric",
        }),
        vendas: vendasMes._sum.quantidade || 0,
        receita: vendasMes._sum.valorTotal || 0,
      });
    }

    // Taxa de conversão (vendas confirmadas / total de visualizações estimado)
    // Como não temos tracking de visualizações, vamos usar uma estimativa baseada em eventos ativos
    const eventosAtivos = await prisma.evento.count({
      where: { ativo: true },
    });

    const totalVendasConfirmadas = await prisma.venda.count({
      where: {
        statusPagamento: "confirmado",
        status: {
          not: "cancelada",
        },
        createdAt: {
          gte: inicio,
          lte: fim,
        },
      },
    });

    // Estimativa: assumindo que cada evento ativo gera ~100 visualizações
    const estimativaVisualizacoes = eventosAtivos * 100;
    const taxaConversao =
      estimativaVisualizacoes > 0
        ? (totalVendasConfirmadas / estimativaVisualizacoes) * 100
        : 0;

    // Receita total e projeção
    const receitaTotal = await prisma.venda.aggregate({
      where: {
        statusPagamento: "confirmado",
        status: {
          not: "cancelada",
        },
        createdAt: {
          gte: inicio,
          lte: fim,
        },
      },
      _sum: {
        valorTotal: true,
      },
    });

    const receitaAtual = receitaTotal._sum.valorTotal || 0;

    // Projeção baseada na média diária
    const diasNoPeriodo = Math.max(
      1,
      Math.ceil((fim.getTime() - inicio.getTime()) / (1000 * 60 * 60 * 24))
    );
    const diasRestantesMes =
      new Date(agora.getFullYear(), agora.getMonth() + 1, 0).getDate() -
      agora.getDate();
    const mediaDiaria = receitaAtual / diasNoPeriodo;
    const projecaoMes =
      mediaDiaria *
      new Date(agora.getFullYear(), agora.getMonth() + 1, 0).getDate();

    return NextResponse.json({
      vendasTempo,
      eventosVendas,
      formasPagamento,
      mesesComparativo,
      metricas: {
        taxaConversao: taxaConversao.toFixed(2),
        receitaTotal: receitaAtual,
        projecaoMes: projecaoMes,
        mediaDiaria: mediaDiaria,
      },
    });
  } catch (error: any) {
    console.error("Erro ao buscar dados avançados do dashboard:", error);
    return NextResponse.json(
      {
        error: "Erro ao buscar dados",
        message: error?.message || "Erro desconhecido",
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
      },
      { status: 500 }
    );
  }
}
