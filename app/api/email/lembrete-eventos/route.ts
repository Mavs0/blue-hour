import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { enviarEmailLembreteEvento } from "@/lib/email";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/**
 * POST - Enviar lembretes de eventos que acontecem em 24 horas
 *
 * Este endpoint deve ser chamado periodicamente (ex: via cron job)
 * para enviar lembretes aos clientes sobre eventos próximos
 */
export async function POST(request: NextRequest) {
  try {
    // Verificar autenticação (opcional - pode adicionar API key)
    const authHeader = request.headers.get("authorization");
    const expectedToken = process.env.CRON_SECRET || "change-me-in-production";

    if (authHeader !== `Bearer ${expectedToken}`) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const agora = new Date();
    const em24Horas = new Date(agora.getTime() + 24 * 60 * 60 * 1000);
    const em25Horas = new Date(agora.getTime() + 25 * 60 * 60 * 1000);

    // Buscar eventos que acontecem entre 24 e 25 horas a partir de agora
    const eventosProximos = await prisma.evento.findMany({
      where: {
        ativo: true,
        data: {
          gte: em24Horas,
          lte: em25Horas,
        },
      },
      include: {
        ingressos: {
          include: {
            vendas: {
              where: {
                statusPagamento: "confirmado",
                status: "confirmada",
              },
              include: {
                cliente: true,
              },
            },
          },
        },
      },
    });

    let emailsEnviados = 0;
    let erros = 0;

    for (const evento of eventosProximos) {
      // Coletar todos os clientes únicos que compraram ingressos para este evento
      const clientesUnicos = new Map<string, any>();

      for (const ingresso of evento.ingressos) {
        for (const venda of ingresso.vendas) {
          if (!clientesUnicos.has(venda.cliente.id)) {
            clientesUnicos.set(venda.cliente.id, {
              cliente: venda.cliente,
              vendas: [],
            });
          }
          clientesUnicos.get(venda.cliente.id)!.vendas.push({
            codigo: venda.codigo,
            tipoIngresso: ingresso.tipo,
            quantidade: venda.quantidade,
          });
        }
      }

      // Enviar email para cada cliente
      for (const { cliente, vendas } of clientesUnicos.values()) {
        // Enviar um email por venda (cada venda pode ter ingressos diferentes)
        for (const venda of vendas) {
          try {
            await enviarEmailLembreteEvento(
              cliente.email,
              cliente.nome,
              venda.codigo,
              evento.nome,
              evento.data,
              evento.local,
              evento.cidade,
              venda.tipoIngresso,
              venda.quantidade
            );
            emailsEnviados++;
          } catch (error) {
            console.error(
              `Erro ao enviar lembrete para ${cliente.email}:`,
              error
            );
            erros++;
          }
        }
      }
    }

    return NextResponse.json({
      success: true,
      eventosProcessados: eventosProximos.length,
      emailsEnviados,
      erros,
      message: `Processados ${eventosProximos.length} evento(s), ${emailsEnviados} email(s) enviado(s)`,
    });
  } catch (error: any) {
    console.error("Erro ao enviar lembretes:", error);
    return NextResponse.json(
      {
        error: "Erro ao enviar lembretes",
        message: error?.message || "Erro desconhecido",
      },
      { status: 500 }
    );
  }
}

/**
 * GET - Verificar eventos que precisam de lembretes (para debug)
 */
export async function GET() {
  try {
    const agora = new Date();
    const em24Horas = new Date(agora.getTime() + 24 * 60 * 60 * 1000);
    const em25Horas = new Date(agora.getTime() + 25 * 60 * 60 * 1000);

    const eventosProximos = await prisma.evento.findMany({
      where: {
        ativo: true,
        data: {
          gte: em24Horas,
          lte: em25Horas,
        },
      },
      include: {
        ingressos: {
          include: {
            _count: {
              select: {
                vendas: {
                  where: {
                    statusPagamento: "confirmado",
                    status: "confirmada",
                  },
                },
              },
            },
          },
        },
      },
    });

    return NextResponse.json({
      eventos: eventosProximos.map((evento) => ({
        id: evento.id,
        nome: evento.nome,
        data: evento.data,
        totalVendas: evento.ingressos.reduce(
          (total, ing) => total + ing._count.vendas,
          0
        ),
      })),
      total: eventosProximos.length,
    });
  } catch (error: any) {
    console.error("Erro ao buscar eventos:", error);
    return NextResponse.json(
      {
        error: "Erro ao buscar eventos",
        message: error?.message || "Erro desconhecido",
      },
      { status: 500 }
    );
  }
}
