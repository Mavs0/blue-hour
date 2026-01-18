import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  try {
    // Durante o build, retornar dados vazios para não quebrar
    if (process.env.NEXT_PHASE === "phase-production-build") {
      return NextResponse.json(
        {
          eventos: { total: 0, esteMes: 0 },
          ingressos: { vendidos: 0, percentualVariacao: 0 },
          receita: { total: 0, percentualVariacao: 0 },
          clientes: { total: 0, novosEsteMes: 0 },
        },
        { status: 200 }
      );
    }

    // Verificar se DATABASE_URL está configurada
    if (!process.env.DATABASE_URL) {
      return NextResponse.json(
        {
          eventos: { total: 0, esteMes: 0 },
          ingressos: { vendidos: 0, percentualVariacao: 0 },
          receita: { total: 0, percentualVariacao: 0 },
          clientes: { total: 0, novosEsteMes: 0 },
        },
        { status: 200 }
      );
    }

    // Buscar total de eventos
    const totalEventos = await prisma.evento.count({
      where: { ativo: true },
    });

    // Buscar eventos criados este mês
    const inicioMes = new Date();
    inicioMes.setDate(1);
    inicioMes.setHours(0, 0, 0, 0);

    const eventosEsteMes = await prisma.evento.count({
      where: {
        ativo: true,
        createdAt: {
          gte: inicioMes,
        },
      },
    });

    // Buscar total de ingressos vendidos
    const totalIngressosVendidos = await prisma.venda.aggregate({
      _sum: {
        quantidade: true,
      },
      where: {
        status: {
          not: "cancelada",
        },
      },
    });

    // Buscar ingressos vendidos no mês anterior para comparação
    const inicioMesAnterior = new Date(inicioMes);
    inicioMesAnterior.setMonth(inicioMesAnterior.getMonth() - 1);

    const fimMesAnterior = new Date(inicioMes);
    fimMesAnterior.setDate(0);
    fimMesAnterior.setHours(23, 59, 59, 999);

    const ingressosMesAnterior = await prisma.venda.aggregate({
      _sum: {
        quantidade: true,
      },
      where: {
        status: {
          not: "cancelada",
        },
        createdAt: {
          gte: inicioMesAnterior,
          lte: fimMesAnterior,
        },
      },
    });

    // Buscar receita total (vendas confirmadas)
    const receitaTotal = await prisma.venda.aggregate({
      _sum: {
        valorTotal: true,
      },
      where: {
        statusPagamento: "confirmado",
        status: {
          not: "cancelada",
        },
      },
    });

    // Buscar receita do mês anterior
    const receitaMesAnterior = await prisma.venda.aggregate({
      _sum: {
        valorTotal: true,
      },
      where: {
        statusPagamento: "confirmado",
        status: {
          not: "cancelada",
        },
        createdAt: {
          gte: inicioMesAnterior,
          lte: fimMesAnterior,
        },
      },
    });

    // Buscar clientes únicos (contar clientes distintos que fizeram compras)
    const vendasComClientes = await prisma.venda.findMany({
      where: {
        status: {
          not: "cancelada",
        },
      },
      select: {
        clienteId: true,
      },
      distinct: ["clienteId"],
    });

    // Contar novos clientes este mês
    const vendasNovosClientes = await prisma.venda.findMany({
      where: {
        status: {
          not: "cancelada",
        },
        createdAt: {
          gte: inicioMes,
        },
      },
      select: {
        clienteId: true,
      },
      distinct: ["clienteId"],
    });

    // Calcular percentuais
    const ingressosVendidos = totalIngressosVendidos._sum.quantidade || 0;
    const ingressosMesAnteriorCount = ingressosMesAnterior._sum.quantidade || 0;
    const percentualIngressos =
      ingressosMesAnteriorCount > 0
        ? ((ingressosVendidos - ingressosMesAnteriorCount) /
            ingressosMesAnteriorCount) *
          100
        : 0;

    const receita = receitaTotal._sum.valorTotal || 0;
    const receitaAnterior = receitaMesAnterior._sum.valorTotal || 0;
    const percentualReceita =
      receitaAnterior > 0
        ? ((receita - receitaAnterior) / receitaAnterior) * 100
        : 0;

    return NextResponse.json({
      eventos: {
        total: totalEventos,
        esteMes: eventosEsteMes,
      },
      ingressos: {
        vendidos: ingressosVendidos,
        percentualVariacao: percentualIngressos,
      },
      receita: {
        total: receita,
        percentualVariacao: percentualReceita,
      },
      clientes: {
        total: vendasComClientes.length,
        novosEsteMes: vendasNovosClientes.length,
      },
    });
  } catch (error: any) {
    console.error("Erro ao buscar dados do dashboard:", error);

    // Em caso de erro, retornar dados zerados
    if (
      error?.code === "P1001" ||
      error?.code === "P1000" ||
      error?.message?.includes("connect")
    ) {
      return NextResponse.json(
        {
          eventos: { total: 0, esteMes: 0 },
          ingressos: { vendidos: 0, percentualVariacao: 0 },
          receita: { total: 0, percentualVariacao: 0 },
          clientes: { total: 0, novosEsteMes: 0 },
        },
        { status: 200 }
      );
    }

    // Retornar dados zerados em vez de erro para não quebrar o build
    return NextResponse.json(
      {
        eventos: { total: 0, esteMes: 0 },
        ingressos: { vendidos: 0, percentualVariacao: 0 },
        receita: { total: 0, percentualVariacao: 0 },
        clientes: { total: 0, novosEsteMes: 0 },
      },
      { status: 200 }
    );
  }
}
