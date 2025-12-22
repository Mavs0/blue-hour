import { z } from "zod";

export const compraIngressoSchema = z.object({
  nome: z.string().min(3, "Nome deve ter pelo menos 3 caracteres"),
  email: z.string().email("Email inválido"),
  telefone: z
    .string()
    .min(10, "Telefone inválido")
    .regex(/^[\d\s()-]+$/, "Telefone deve conter apenas números"),
  cpf: z
    .string()
    .min(11, "CPF deve ter 11 dígitos")
    .max(11, "CPF deve ter 11 dígitos")
    .regex(/^\d+$/, "CPF deve conter apenas números"),
  quantidade: z
    .number()
    .min(1, "Quantidade mínima é 1")
    .max(10, "Quantidade máxima é 10")
    .int("Quantidade deve ser um número inteiro"),
});

export type CompraIngressoInput = z.infer<typeof compraIngressoSchema>;
