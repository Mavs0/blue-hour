/**
 * Rate limiting simples em memória
 * Para produção, considere usar Redis ou um serviço dedicado
 */

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

const rateLimitStore = new Map<string, RateLimitEntry>();

/**
 * Limpa entradas expiradas periodicamente
 */
setInterval(() => {
  const now = Date.now();
  const keysToDelete: string[] = [];

  rateLimitStore.forEach((entry, key) => {
    if (now > entry.resetTime) {
      keysToDelete.push(key);
    }
  });

  keysToDelete.forEach((key) => {
    rateLimitStore.delete(key);
  });
}, 60000); // Limpa a cada minuto

/**
 * Verifica se uma requisição excedeu o limite de taxa
 * @param identifier Identificador único (IP, userId, etc.)
 * @param maxRequests Número máximo de requisições
 * @param windowMs Janela de tempo em milissegundos
 * @returns true se dentro do limite, false se excedeu
 */
export function checkRateLimit(
  identifier: string,
  maxRequests: number = 10,
  windowMs: number = 60000 // 1 minuto padrão
): boolean {
  const now = Date.now();
  const entry = rateLimitStore.get(identifier);

  if (!entry || now > entry.resetTime) {
    // Nova entrada ou janela expirada
    rateLimitStore.set(identifier, {
      count: 1,
      resetTime: now + windowMs,
    });
    return true;
  }

  if (entry.count >= maxRequests) {
    return false; // Limite excedido
  }

  // Incrementa contador
  entry.count++;
  return true;
}

/**
 * Obtém informações sobre o rate limit atual
 */
export function getRateLimitInfo(identifier: string): {
  remaining: number;
  resetTime: number;
} | null {
  const entry = rateLimitStore.get(identifier);
  if (!entry) return null;

  const now = Date.now();
  if (now > entry.resetTime) return null;

  return {
    remaining: Math.max(0, 10 - entry.count), // Assumindo maxRequests = 10
    resetTime: entry.resetTime,
  };
}

/**
 * Obtém o IP do cliente da requisição
 */
export function getClientIP(request: Request): string {
  // Tenta obter do header X-Forwarded-For (Vercel, Cloudflare, etc.)
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }

  // Tenta obter do header X-Real-IP
  const realIP = request.headers.get("x-real-ip");
  if (realIP) {
    return realIP;
  }

  // Fallback para localhost em desenvolvimento
  return "127.0.0.1";
}
