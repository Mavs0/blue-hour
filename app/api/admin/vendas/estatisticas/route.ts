import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const periodo = searchParams.get("periodo") || "mes";
    const eventoId = searchParams.get("eventoId");

    // Calcular período
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
        inicio = new Date(0);
    }

    const where: any = {
      statusPagamento: "confirmado",
      status: {
        not: "cancelada",
      },
      createdAt: {
        gte: inicio,
        lte: agora,
      },
    };

    if (eventoId) {
      where.ingresso = {
        eventoId: eventoId,
      };
    }

    // Vendas por data (para gráfico)
    const vendasPorData = await prisma.venda.findMany({
      where,
      select: {
        createdAt: true,
        valorTotal: true,
        quantidade: true,
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    // Agrupar por data
    const vendasAgrupadas: Record<string, { vendas: number; receita: number }> =
      {};
    vendasPorData.forEach((venda) => {
      const data = new Date(venda.createdAt).toLocaleDateString("pt-BR");
      if (!vendasAgrupadas[data]) {
        vendasAgrupadas[data] = { vendas: 0, receita: 0 };
      }
      vendasAgrupadas[data].vendas += venda.quantidade;
      vendasAgrupadas[data].receita += venda.valorTotal;
    });

    const vendasTempo = Object.entries(vendasAgrupadas).map(
      ([data, valores]) => ({
        data,
        vendas: valores.vendas,
        receita: valores.receita,
      })
    );

    // Estatísticas por evento
    const vendasPorEvento = await prisma.venda.groupBy({
      by: ["ingressoId"],
      where,
      _sum: {
        valorTotal: true,
        quantidade: true,
      },
      _count: {
        id: true,
      },
    });

    const eventosStats = await Promise.all(
      vendasPorEvento.map(async (item) => {
        const ingresso = await prisma.ingresso.findUnique({
          where: { id: item.ingressoId },
          include: {
            evento: {
              select: {
                id: true,
                nome: true,
              },
            },
          },
        });

        return {
          eventoId: ingresso?.evento.id || "",
          eventoNome: ingresso?.evento.nome || "",
          vendas: item._count.id,
          quantidade: item._sum.quantidade || 0,
          receita: item._sum.valorTotal || 0,
        };
      })
    );

    return NextResponse.json({
      vendasTempo,
      eventosStats: eventosStats.sort((a, b) => b.receita - a.receita),
    });
  } catch (error: any) {
    console.error("Erro ao buscar estatísticas:", error);
    return NextResponse.json(
      {
        error: "Erro ao buscar estatísticas",
        vendasTempo: [],
        eventosStats: [],
      },
      { status: 500 }
    );
  }
}
