"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  compraIngressoSchema,
  type CompraIngressoInput,
} from "@/lib/validations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  CreditCard,
  Smartphone,
  Receipt,
  Wallet,
  Users,
  Ticket,
} from "lucide-react";
import { DadosCartaoForm } from "./dados-cartao-form";

interface ComprarIngressoFormProps {
  eventoId: string;
  ingressoId: string;
  precoUnitario: number;
  disponivel: number;
}

export function ComprarIngressoForm({
  eventoId,
  ingressoId,
  precoUnitario,
  disponivel,
}: ComprarIngressoFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CompraIngressoInput>({
    resolver: zodResolver(compraIngressoSchema),
    defaultValues: {
      quantidade: 1,
      formaPagamento: "pix",
    },
  });

  const quantidade = watch("quantidade") || 1;
  const formaPagamento = watch("formaPagamento") || "pix";
  const valorTotal = precoUnitario * quantidade;
  const [dadosCartao, setDadosCartao] = useState<{
    numero: string;
    nome: string;
    validade: string;
    cvv: string;
    parcelas?: number;
  } | null>(null);

  // Resetar dados do cartão quando mudar forma de pagamento
  const handleFormaPagamentoChange = (value: string) => {
    setValue(
      "formaPagamento",
      value as "pix" | "cartao_credito" | "cartao_debito",
      {
        shouldValidate: true,
      }
    );
    if (value !== "cartao_credito" && value !== "cartao_debito") {
      setDadosCartao(null);
    }
  };

  const onSubmit = async (data: CompraIngressoInput) => {
    console.log("onSubmit chamado", { data, dadosCartao });
    setIsSubmitting(true);
    setError(null);

    // Verificar se há erros de validação do react-hook-form
    console.log("Erros de validação:", errors);

    try {
      // Validar dados do cartão se necessário
      if (
        data.formaPagamento === "cartao_credito" ||
        data.formaPagamento === "cartao_debito"
      ) {
        if (!dadosCartao) {
          console.error("Dados do cartão não encontrados");
          setError("Preencha os dados do cartão");
          setIsSubmitting(false);
          return;
        }

        // Validar se todos os campos obrigatórios estão preenchidos
        if (
          !dadosCartao.numero ||
          !dadosCartao.nome ||
          !dadosCartao.validade ||
          !dadosCartao.cvv
        ) {
          console.error("Campos do cartão incompletos:", dadosCartao);
          setError("Preencha todos os dados do cartão");
          setIsSubmitting(false);
          return;
        }

        // Validar formato básico
        const numeroLimpo = dadosCartao.numero.replace(/\D/g, "");
        if (numeroLimpo.length < 13 || numeroLimpo.length > 19) {
          console.error("Número do cartão inválido:", numeroLimpo.length);
          setError("Número do cartão inválido");
          setIsSubmitting(false);
          return;
        }

        const cvvLimpo = dadosCartao.cvv.replace(/\D/g, "");
        if (cvvLimpo.length < 3 || cvvLimpo.length > 4) {
          console.error("CVV inválido:", cvvLimpo.length);
          setError("CVV inválido");
          setIsSubmitting(false);
          return;
        }

        const validadeLimpa = dadosCartao.validade.replace(/\D/g, "");
        if (validadeLimpa.length !== 4) {
          console.error("Validade inválida:", validadeLimpa);
          setError("Validade inválida. Use o formato MM/AA");
          setIsSubmitting(false);
          return;
        }
      }

      const payload: any = {
        eventoId,
        ingressoId,
        ...data,
      };

      // Adicionar dados do cartão se for pagamento com cartão
      if (
        data.formaPagamento === "cartao_credito" ||
        data.formaPagamento === "cartao_debito"
      ) {
        if (!dadosCartao) {
          throw new Error("Dados do cartão não encontrados");
        }
        payload.numeroCartao = dadosCartao.numero;
        payload.nomeCartao = dadosCartao.nome;
        payload.validadeCartao = dadosCartao.validade;
        payload.cvvCartao = dadosCartao.cvv;
        if (data.formaPagamento === "cartao_credito" && dadosCartao.parcelas) {
          payload.parcelas = dadosCartao.parcelas;
        }

        // Debug: verificar dados antes de enviar
        console.log("Dados do cartão sendo enviados:", {
          numero: payload.numeroCartao?.substring(0, 4) + "****",
          nome: payload.nomeCartao,
          validade: payload.validadeCartao,
          cvv: "***",
          formaPagamento: data.formaPagamento,
        });
      }

      console.log("Enviando requisição para /api/comprar", {
        eventoId,
        ingressoId,
        formaPagamento: payload.formaPagamento,
      });

      const response = await fetch("/api/comprar", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      console.log("Resposta recebida:", {
        status: response.status,
        ok: response.ok,
      });

      const result = await response.json();
      console.log("Resultado parseado:", result);

      if (!response.ok) {
        const errorMessage =
          result.error || result.details || "Erro ao processar compra";
        console.error("Erro na resposta:", {
          status: response.status,
          error: result.error,
          details: result.details,
          result,
        });
        throw new Error(errorMessage);
      }

      console.log("Compra realizada com sucesso, redirecionando...");

      // Redirecionar baseado no status do pagamento
      if (result.venda?.statusPagamento === "confirmado") {
        router.push(`/compra/confirmacao?codigo=${result.venda.codigo}`);
      } else {
        router.push(`/compra/pagamento?codigo=${result.venda.codigo}`);
      }
    } catch (err: any) {
      console.error("Erro ao processar compra:", err);
      setError(err.message || "Erro ao processar compra. Tente novamente.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <form
        onSubmit={handleSubmit(onSubmit, (validationErrors) => {
          console.error("Erros de validação do formulário:", validationErrors);
          // Filtrar erros de campos do cartão que não estão no formulário principal
          const errosFiltrados = Object.keys(validationErrors).filter(
            (key) =>
              ![
                "numeroCartao",
                "nomeCartao",
                "validadeCartao",
                "cvvCartao",
              ].includes(key)
          );

          if (errosFiltrados.length > 0) {
            const primeiroErro =
              validationErrors[
                errosFiltrados[0] as keyof typeof validationErrors
              ];
            setError(
              primeiroErro?.message?.toString() ||
                "Por favor, preencha todos os campos corretamente."
            );
          } else {
            // Se só tem erros de cartão, validar manualmente
            if (
              (formaPagamento === "cartao_credito" ||
                formaPagamento === "cartao_debito") &&
              (!dadosCartao ||
                !dadosCartao.numero ||
                !dadosCartao.nome ||
                !dadosCartao.validade ||
                !dadosCartao.cvv)
            ) {
              setError("Preencha todos os dados do cartão");
            }
          }
          setIsSubmitting(false);
        })}
        className="space-y-6"
      >
        {/* Seção: Dados Pessoais */}
        <div>
          <h3 className="text-lg font-semibold mb-4 dark:text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            Dados Pessoais
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nome" className="dark:text-gray-300">
                Nome Completo *
              </Label>
              <Input
                id="nome"
                {...register("nome")}
                placeholder="Seu nome completo"
                className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
              {errors.nome && (
                <p className="text-sm text-red-500 dark:text-red-400">
                  {errors.nome.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="dark:text-gray-300">
                Email *
              </Label>
              <Input
                id="email"
                type="email"
                {...register("email")}
                placeholder="seu@email.com"
                className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
              {errors.email && (
                <p className="text-sm text-red-500 dark:text-red-400">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="telefone" className="dark:text-gray-300">
                Telefone *
              </Label>
              <Input
                id="telefone"
                {...register("telefone")}
                placeholder="(92) 99999-9999"
                className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                onInput={(e) => {
                  const value = e.currentTarget.value.replace(/\D/g, "");
                  if (value.length <= 11) {
                    e.currentTarget.value = value;
                  }
                }}
              />
              {errors.telefone && (
                <p className="text-sm text-red-500 dark:text-red-400">
                  {errors.telefone.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="cpf" className="dark:text-gray-300">
                CPF *
              </Label>
              <Input
                id="cpf"
                {...register("cpf")}
                placeholder="00000000000"
                maxLength={11}
                className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                onInput={(e) => {
                  e.currentTarget.value = e.currentTarget.value.replace(
                    /\D/g,
                    ""
                  );
                }}
              />
              {errors.cpf && (
                <p className="text-sm text-red-500 dark:text-red-400">
                  {errors.cpf.message}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Seção: Ingressos */}
        <div>
          <h3 className="text-lg font-semibold mb-4 dark:text-white flex items-center gap-2">
            <Ticket className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            Ingressos
          </h3>
          <div className="space-y-2">
            <Label htmlFor="quantidade" className="dark:text-gray-300">
              Quantidade *
            </Label>
            <Input
              id="quantidade"
              type="number"
              min={1}
              max={Math.min(disponivel, 10)}
              {...register("quantidade", { valueAsNumber: true })}
              className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
            {errors.quantidade && (
              <p className="text-sm text-red-500 dark:text-red-400">
                {errors.quantidade.message}
              </p>
            )}
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Máximo: {Math.min(disponivel, 10)} ingresso(s) disponível(is)
            </p>
          </div>
        </div>

        {/* Seção: Pagamento */}
        <div>
          <h3 className="text-lg font-semibold mb-4 dark:text-white flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            Forma de Pagamento
          </h3>
          <div className="space-y-2">
            <Label htmlFor="formaPagamento" className="dark:text-gray-300">
              Selecione a forma de pagamento *
            </Label>
            <Select
              defaultValue="pix"
              value={formaPagamento}
              onValueChange={handleFormaPagamentoChange}
            >
              <SelectTrigger
                id="formaPagamento"
                className="w-full dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                <SelectValue placeholder="Selecione a forma de pagamento" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pix">
                  <div className="flex items-center gap-2">
                    <Smartphone className="h-4 w-4" />
                    <span>PIX</span>
                  </div>
                </SelectItem>
                <SelectItem value="cartao_credito">
                  <div className="flex items-center gap-2">
                    <CreditCard className="h-4 w-4" />
                    <span>Cartão de Crédito</span>
                  </div>
                </SelectItem>
                <SelectItem value="cartao_debito">
                  <div className="flex items-center gap-2">
                    <Wallet className="h-4 w-4" />
                    <span>Cartão de Débito</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
            {errors.formaPagamento && (
              <p className="text-sm text-red-500 dark:text-red-400">
                {errors.formaPagamento.message}
              </p>
            )}
          </div>

          {/* Formulário de dados do cartão */}
          {(formaPagamento === "cartao_credito" ||
            formaPagamento === "cartao_debito") && (
            <div className="mt-4">
              <DadosCartaoForm
                onDadosChange={(dados) => setDadosCartao(dados)}
                valorTotal={valorTotal}
                tipo={
                  formaPagamento === "cartao_credito" ? "credito" : "debito"
                }
              />
            </div>
          )}
        </div>

        {/* Resumo e Total */}
        <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
          <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-6 space-y-3 mb-6">
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">
                {quantidade} ingresso(s) × R$ {precoUnitario.toFixed(2)}
              </span>
              <span className="text-lg font-semibold text-gray-900 dark:text-white">
                R$ {(precoUnitario * quantidade).toFixed(2)}
              </span>
            </div>
            <div className="border-t border-gray-200 dark:border-gray-700 pt-3 flex justify-between items-center">
              <span className="text-lg font-semibold text-gray-900 dark:text-white">
                Total:
              </span>
              <span className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent dark:from-purple-400 dark:to-pink-400">
                R$ {valorTotal.toFixed(2)}
              </span>
            </div>
          </div>

          {error && (
            <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}

          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white text-lg py-6 dark:from-purple-600 dark:to-pink-600 dark:hover:from-purple-700 dark:hover:to-pink-700"
            disabled={isSubmitting || disponivel <= 0}
            onClick={(e) => {
              console.log("Botão clicado", {
                isSubmitting,
                disponivel,
                disabled: isSubmitting || disponivel <= 0,
              });
              // Não prevenir default aqui, deixar o form.handleSubmit fazer o trabalho
            }}
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Processando...
              </span>
            ) : (
              "Finalizar Compra"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
