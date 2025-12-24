import { z } from "zod";
import { validarCPF, limparCPF } from "./cpf-validator";
import { sanitizeString, sanitizeEmail, sanitizeNumber } from "./sanitize";

export const compraIngressoSchema = z
  .object({
    nome: z
      .string()
      .min(3, "Nome deve ter pelo menos 3 caracteres")
      .max(100, "Nome muito longo")
      .transform((val) => sanitizeString(val, 100)),
    email: z
      .string()
      .email("Email inválido")
      .transform((val) => sanitizeEmail(val)),
    telefone: z
      .string()
      .min(10, "Telefone inválido")
      .regex(/^[\d\s()-]+$/, "Telefone deve conter apenas números")
      .transform((val) => sanitizeNumber(val)),
    cpf: z
      .string()
      .min(11, "CPF deve ter 11 dígitos")
      .max(14, "CPF inválido")
      .transform((val) => limparCPF(val))
      .refine((val) => val.length === 11, "CPF deve ter 11 dígitos")
      .refine((val) => validarCPF(val), "CPF inválido"),
    quantidade: z
      .number()
      .min(1, "Quantidade mínima é 1")
      .max(10, "Quantidade máxima é 10")
      .int("Quantidade deve ser um número inteiro"),
    formaPagamento: z.enum(
      ["pix", "cartao_credito", "cartao_debito", "boleto"],
      {
        required_error: "Selecione uma forma de pagamento",
      }
    ),
    // Campos opcionais para cartão
    numeroCartao: z
      .string()
      .optional()
      .transform((val) => (val ? sanitizeNumber(val) : val)),
    nomeCartao: z
      .string()
      .optional()
      .transform((val) => (val ? sanitizeString(val, 50) : val)),
    validadeCartao: z
      .string()
      .optional()
      .transform((val) => (val ? sanitizeString(val, 5) : val)),
    cvvCartao: z
      .string()
      .optional()
      .transform((val) => (val ? sanitizeNumber(val) : val)),
    parcelas: z.number().optional(),
  })
  .refine(
    (data) => {
      // Se for cartão, validar campos obrigatórios
      if (
        data.formaPagamento === "cartao_credito" ||
        data.formaPagamento === "cartao_debito"
      ) {
        return !!(
          data.numeroCartao &&
          data.nomeCartao &&
          data.validadeCartao &&
          data.cvvCartao
        );
      }
      return true;
    },
    {
      message: "Preencha todos os dados do cartão",
      path: ["numeroCartao"],
    }
  );

export type CompraIngressoInput = z.infer<typeof compraIngressoSchema>;

export const ingressoSchema = z.object({
  tipo: z.string().min(1, "Tipo de ingresso é obrigatório"),
  preco: z.number().min(0.01, "Preço deve ser maior que zero"),
  quantidade: z.number().min(1, "Quantidade mínima é 1").int(),
  kit: z.string().optional(), // Descrição do kit (nome do elemento, quantidade, observações)
});

export const eventoSchema = z.object({
  nome: z.string().min(3, "Nome deve ter pelo menos 3 caracteres"),
  descricao: z.string().optional(),
  data: z.string().refine(
    (date) => {
      const d = new Date(date);
      return !isNaN(d.getTime());
    },
    { message: "Data inválida" }
  ),
  local: z.string().min(3, "Local é obrigatório"),
  cidade: z.string().min(2, "Cidade é obrigatória"),
  imagemUrl: z
    .string()
    .optional()
    .refine(
      (val) => !val || val === "" || z.string().url().safeParse(val).success,
      { message: "URL inválida" }
    ),
  ingressos: z
    .array(ingressoSchema)
    .min(1, "Adicione pelo menos um tipo de ingresso"),
});

export type EventoInput = z.infer<typeof eventoSchema>;
export type IngressoInput = z.infer<typeof ingressoSchema>;
