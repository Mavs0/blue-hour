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
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

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
    formState: { errors },
  } = useForm<CompraIngressoInput>({
    resolver: zodResolver(compraIngressoSchema),
    defaultValues: {
      quantidade: 1,
    },
  });

  const quantidade = watch("quantidade") || 1;
  const valorTotal = precoUnitario * quantidade;

  const onSubmit = async (data: CompraIngressoInput) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/comprar", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          eventoId,
          ingressoId,
          ...data,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Erro ao processar compra");
      }

      // Redirecionar para página de confirmação
      router.push(`/compra/confirmacao?codigo=${result.venda.codigo}`);
    } catch (err: any) {
      setError(err.message || "Erro ao processar compra. Tente novamente.");
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">Dados para Compra</CardTitle>
        <CardDescription>
          Preencha seus dados para finalizar a compra
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nome">Nome Completo *</Label>
              <Input
                id="nome"
                {...register("nome")}
                placeholder="Seu nome completo"
              />
              {errors.nome && (
                <p className="text-sm text-red-500">{errors.nome.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                {...register("email")}
                placeholder="seu@email.com"
              />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="telefone">Telefone *</Label>
              <Input
                id="telefone"
                {...register("telefone")}
                placeholder="(92) 99999-9999"
                onInput={(e) => {
                  const value = e.currentTarget.value.replace(/\D/g, "");
                  if (value.length <= 11) {
                    e.currentTarget.value = value;
                  }
                }}
              />
              {errors.telefone && (
                <p className="text-sm text-red-500">
                  {errors.telefone.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="cpf">CPF *</Label>
              <Input
                id="cpf"
                {...register("cpf")}
                placeholder="00000000000"
                maxLength={11}
                onInput={(e) => {
                  e.currentTarget.value = e.currentTarget.value.replace(
                    /\D/g,
                    ""
                  );
                }}
              />
              {errors.cpf && (
                <p className="text-sm text-red-500">{errors.cpf.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="quantidade">Quantidade *</Label>
              <Input
                id="quantidade"
                type="number"
                min={1}
                max={Math.min(disponivel, 10)}
                {...register("quantidade", { valueAsNumber: true })}
              />
              {errors.quantidade && (
                <p className="text-sm text-red-500">
                  {errors.quantidade.message}
                </p>
              )}
              <p className="text-xs text-gray-500">
                Máximo: {Math.min(disponivel, 10)} ingresso(s)
              </p>
            </div>
          </div>

          <div className="pt-4 border-t">
            <div className="flex justify-between items-center mb-4">
              <span className="text-lg font-semibold">Total:</span>
              <span className="text-2xl font-bold text-purple-600">
                R$ {valorTotal.toFixed(2)}
              </span>
            </div>
            <p className="text-sm text-gray-500 mb-4">
              {quantidade} ingresso(s) × R$ {precoUnitario.toFixed(2)}
            </p>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <Button
              type="submit"
              className="w-full"
              disabled={isSubmitting || disponivel <= 0}
            >
              {isSubmitting ? "Processando..." : "Finalizar Compra"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
