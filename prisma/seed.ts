import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Iniciando seed do banco de dados...");

  // Criar evento de exemplo
  const evento = await prisma.evento.create({
    data: {
      nome: "K-POP Festival Manaus 2024",
      descricao:
        "O maior festival de K-POP do Norte do Brasil! Venha viver uma experiência única com seus artistas favoritos.",
      data: new Date("2024-12-15T20:00:00"),
      local: "Centro de Convenções do Amazonas",
      cidade: "Manaus",
      imagemUrl: null,
      ativo: true,
      ingressos: {
        create: [
          {
            tipo: "Pista",
            preco: 150.0,
            quantidade: 500,
            vendidos: 0,
            ativo: true,
          },
          {
            tipo: "VIP",
            preco: 300.0,
            quantidade: 200,
            vendidos: 0,
            ativo: true,
          },
          {
            tipo: "Camarote",
            preco: 500.0,
            quantidade: 50,
            vendidos: 0,
            ativo: true,
          },
        ],
      },
    },
  });

  console.log("✅ Evento criado:", evento.nome);

  // Criar outro evento
  const evento2 = await prisma.evento.create({
    data: {
      nome: "K-POP Night Manaus",
      descricao: "Uma noite especial dedicada aos fãs de K-POP em Manaus!",
      data: new Date("2024-11-20T19:00:00"),
      local: "Arena da Amazônia",
      cidade: "Manaus",
      imagemUrl: null,
      ativo: true,
      ingressos: {
        create: [
          {
            tipo: "Pista",
            preco: 120.0,
            quantidade: 1000,
            vendidos: 150,
            ativo: true,
          },
          {
            tipo: "VIP",
            preco: 250.0,
            quantidade: 300,
            vendidos: 50,
            ativo: true,
          },
        ],
      },
    },
  });

  console.log("✅ Evento criado:", evento2.nome);

  console.log("🎉 Seed concluído com sucesso!");
}

main()
  .catch((e) => {
    console.error("❌ Erro ao executar seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
