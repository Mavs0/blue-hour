import { z } from "zod";
import { validarCPF, limparCPF } from "./cpf-validator";
import { sanitizeString, sanitizeEmail, sanitizeNumber } from "./sanitize";

export const compraIngressoSchema = z.object({
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
  formaPagamento: z.enum(["pix", "cartao_credito", "cartao_debito"], {
    required_error: "Selecione uma forma de pagamento",
  }),
  // Campos opcionais para cartão (serão validados manualmente no componente)
  numeroCartao: z.string().optional(),
  nomeCartao: z.string().optional(),
  validadeCartao: z.string().optional(),
  cvvCartao: z.string().optional(),
  parcelas: z.number().optional(),
});

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
      (val) => {
        if (!val || val === "") return true;
        
        // Aceitar URLs absolutas (http://, https://)
        if (val.startsWith("http://") || val.startsWith("https://")) {
          try {
            new URL(val);
            return true;
          } catch {
            return false;
          }
        }
        
        // Aceitar caminhos relativos que começam com /
        if (val.startsWith("/")) {
          return true;
        }
        
        // Aceitar data URLs (base64)
        if (val.startsWith("data:image/")) {
          return true;
        }
        
        // Aceitar blob URLs (para previews locais)
        if (val.startsWith("blob:")) {
          return true;
        }
        
        return false;
      },
      { message: "URL inválida. Use uma URL válida (http://, https://) ou um caminho relativo (/caminho/para/imagem.jpg)" }
    ),
  ingressos: z
    .array(ingressoSchema)
    .min(1, "Adicione pelo menos um tipo de ingresso"),
});

export type EventoInput = z.infer<typeof eventoSchema>;
export type IngressoInput = z.infer<typeof ingressoSchema>;
