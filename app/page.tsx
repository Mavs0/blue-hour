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

export const dynamic = "force-dynamic";

export default async function Home() {
  let eventos: EventoComIngressos[] = [];

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
  } catch (error) {
    console.error("Erro ao buscar eventos:", error);
    // Continua com array vazio para não quebrar a página
  }

  return (
    <main className="flex flex-col flex-1 bg-white dark:bg-gray-950">
      <Navbar />
      <HeroSection />
      <EventsSection eventos={eventos} />
      <WhySection />
      <CTASection />
      <Footer />
    </main>
  );
}
