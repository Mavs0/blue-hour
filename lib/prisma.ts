import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaClient() {
  // Verificar se DATABASE_URL está configurada
  if (!process.env.DATABASE_URL) {
    console.error("⚠️  DATABASE_URL não está configurada!");
    console.error("Por favor, configure a variável DATABASE_URL no arquivo .env.local");
    console.error("Veja mais informações em: COMO_CONFIGURAR_ENV.md");
  }

  const client = new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
    datasources: {
      db: {
        url: process.env.DATABASE_URL,
      },
    },
  });

  // Handle connection errors gracefully
  client.$connect().catch((error) => {
    console.error("❌ Erro ao conectar com o banco de dados:", error);
    if (error.code === "P1001" || error.code === "P1000") {
      console.error("💡 Dica: Verifique se:");
      console.error("   1. O arquivo .env.local existe e contém DATABASE_URL");
      console.error("   2. A connection string está correta");
      console.error("   3. O banco de dados está ativo (não pausado)");
      console.error("   4. Sua conexão com a internet está funcionando");
    }
  });

  return client;
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
