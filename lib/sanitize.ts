/**
 * Utilitários de sanitização de inputs
 */

/**
 * Remove tags HTML e caracteres perigosos
 */
export function sanitizeHTML(input: string): string {
  if (typeof input !== "string") return "";

  return input
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .replace(/\//g, "&#x2F;");
}

/**
 * Remove caracteres especiais, mantendo apenas letras, números e espaços
 */
export function sanitizeAlphanumeric(input: string): string {
  if (typeof input !== "string") return "";
  return input.replace(/[^a-zA-Z0-9\s]/g, "");
}

/**
 * Sanitiza email removendo caracteres inválidos
 */
export function sanitizeEmail(email: string): string {
  if (typeof email !== "string") return "";
  return email
    .trim()
    .toLowerCase()
    .replace(/[^a-zA-Z0-9@._-]/g, "");
}

/**
 * Sanitiza número removendo tudo exceto dígitos
 */
export function sanitizeNumber(input: string): string {
  if (typeof input !== "string") return "";
  return input.replace(/\D/g, "");
}

/**
 * Sanitiza string genérica removendo caracteres de controle
 */
export function sanitizeString(input: string, maxLength?: number): string {
  if (typeof input !== "string") return "";

  let sanitized = input
    .trim()
    .replace(/[\x00-\x1F\x7F]/g, "") // Remove caracteres de controle
    .replace(/\s+/g, " "); // Normaliza espaços múltiplos

  if (maxLength && sanitized.length > maxLength) {
    sanitized = sanitized.substring(0, maxLength);
  }

  return sanitized;
}

/**
 * Sanitiza objeto recursivamente
 */
export function sanitizeObject<T extends Record<string, any>>(
  obj: T,
  fields: Partial<Record<keyof T, (value: any) => string>>
): T {
  const sanitized = { ...obj } as T;

  for (const key in fields) {
    if (
      key in sanitized &&
      sanitized[key] !== undefined &&
      sanitized[key] !== null
    ) {
      const sanitizer = fields[key];
      if (sanitizer) {
        (sanitized as any)[key] = sanitizer(sanitized[key]);
      }
    }
  }

  return sanitized;
}
