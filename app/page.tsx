import { prisma } from "@/lib/prisma";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { HeroSection } from "@/components/home/hero-section";
import {
  EventsSection,
  type EventoComIngressos,
} from "@/components/home/events-section";
import { WhySection } from "@/components/home/why-section";
import { CTASection } from "@/components/home/cta-section";
import { StatsSection } from "@/components/home/stats-section";

export const dynamic = "force-dynamic";

export default async function Home() {
  let eventos: EventoComIngressos[] = [];
  let stats = {
    totalEventos: 0,
    totalVendas: 0,
    eventosProximos: 0,
  };

  try {
    eventos = await prisma.evento.findMany({
      where: { ativo: true },
      include: {
        ingressos: {
          where: { ativo: true },
        },
      },
      orderBy: {
        data: "asc",
      },
      take: 6,
    });

    // Calcular estatísticas
    const agora = new Date();
    const eventosProximos = eventos.filter(
      (e) => new Date(e.data) >= agora
    ).length;

    const totalVendas = await prisma.venda.count({
      where: {
        statusPagamento: "confirmado",
      },
    });

    stats = {
      totalEventos: eventos.length,
      totalVendas,
      eventosProximos,
    };
  } catch (error) {
    console.error("Erro ao buscar eventos:", error);
    // Continua com array vazio para não quebrar a página
  }

  return (
    <main className="flex flex-col flex-1 bg-white dark:bg-gray-950">
      <Navbar />
      <HeroSection />
      <StatsSection
        totalEventos={stats.totalEventos}
        totalVendas={stats.totalVendas}
        eventosProximos={stats.eventosProximos}
      />
      <EventsSection eventos={eventos} />
      <WhySection />
      <CTASection />
      <Footer />
    </main>
  );
}
