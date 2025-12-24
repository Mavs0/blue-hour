"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ingressoSchema, type IngressoInput } from "@/lib/validations";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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

interface Evento {
  id: string;
  nome: string;
}

interface IngressoFormProps {
  eventoId?: string;
  ingressoId?: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function IngressoForm({
  eventoId: initialEventoId,
  ingressoId,
  onSuccess,
  onCancel,
}: IngressoFormProps) {
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedEventoId, setSelectedEventoId] = useState<string>(
    initialEventoId || ""
  );

  const ingressoComEventoSchema = ingressoSchema.extend({
    eventoId: z.string().min(1, "Selecione um evento"),
  });

  type FormData = z.infer<typeof ingressoComEventoSchema>;

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(
      ingressoId ? ingressoSchema : ingressoComEventoSchema
    ) as any,
    defaultValues: {
      tipo: "",
      preco: 0,
      quantidade: 0,
      kit: "",
      eventoId: initialEventoId || "",
    },
  });

  useEffect(() => {
    fetchEventos();
    if (ingressoId) {
      fetchIngresso();
    }
  }, [ingressoId]);

  const fetchEventos = async () => {
    try {
      const response = await fetch("/api/eventos");
      const data = await response.json();
      setEventos(data.eventos || []);
    } catch (error) {
      console.error("Erro ao buscar eventos:", error);
    }
  };

  const fetchIngresso = async () => {
    if (!ingressoId) return;
    setLoading(true);
    try {
      const response = await fetch(`/api/ingressos/${ingressoId}`);
      const data = await response.json();
      if (data.ingresso) {
        setValue("tipo", data.ingresso.tipo);
        setValue("preco", data.ingresso.preco);
        setValue("quantidade", data.ingresso.quantidade);
        setValue("kit", data.ingresso.kit || "");
        if (!ingressoId) {
          setSelectedEventoId(data.ingresso.eventoId);
          setValue("eventoId", data.ingresso.eventoId);
        }
      }
    } catch (error) {
      console.error("Erro ao buscar ingresso:", error);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const url = ingressoId
        ? `/api/ingressos/${ingressoId}`
        : "/api/ingressos";
      const method = ingressoId ? "PUT" : "POST";

      const body = ingressoId
        ? {
            tipo: data.tipo,
            preco: data.preco,
            quantidade: data.quantidade,
            kit: data.kit || null,
          }
        : {
            tipo: data.tipo,
            preco: data.preco,
            quantidade: data.quantidade,
            kit: data.kit || null,
            eventoId: data.eventoId!,
          };

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Erro ao salvar ingresso");
      }

      if (onSuccess) {
        onSuccess();
      }
    } catch (err: any) {
      setError(err.message || "Erro ao salvar ingresso. Tente novamente.");
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-center text-gray-600">Carregando...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">
          {ingressoId ? "Editar Ingresso" : "Criar Novo Ingresso"}
        </CardTitle>
        <CardDescription>
          {ingressoId
            ? "Atualize as informações do ingresso"
            : "Configure um novo tipo de ingresso para um evento"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {!ingressoId && (
            <div className="space-y-2">
              <Label htmlFor="eventoId">Evento *</Label>
              <Select
                value={selectedEventoId}
                onValueChange={(value) => {
                  setSelectedEventoId(value);
                  setValue("eventoId", value, { shouldValidate: true });
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um evento" />
                </SelectTrigger>
                <SelectContent>
                  {eventos.map((evento) => (
                    <SelectItem key={evento.id} value={evento.id}>
                      {evento.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.eventoId && (
                <p className="text-sm text-red-500">
                  {errors.eventoId.message}
                </p>
              )}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="tipo">Tipo de Ingresso *</Label>
              <Input
                id="tipo"
                {...register("tipo")}
                placeholder="Ex: Pista, VIP, Camarote"
              />
              {errors.tipo && (
                <p className="text-sm text-red-500">{errors.tipo.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="preco">Preço (R$) *</Label>
              <Input
                id="preco"
                type="number"
                step="0.01"
                min="0"
                {...register("preco", { valueAsNumber: true })}
                placeholder="0.00"
              />
              {errors.preco && (
                <p className="text-sm text-red-500">{errors.preco.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="quantidade">Quantidade Total *</Label>
              <Input
                id="quantidade"
                type="number"
                min="1"
                {...register("quantidade", { valueAsNumber: true })}
                placeholder="0"
              />
              {errors.quantidade && (
                <p className="text-sm text-red-500">
                  {errors.quantidade.message}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="kit">Kit Incluído</Label>
            <Textarea
              id="kit"
              {...register("kit")}
              placeholder="Descreva o que está incluído no kit deste ingresso. Exemplo:&#10;- Lightstick oficial: 1 unidade&#10;- Photocard exclusivo: 2 unidades&#10;- Pôster autografado: 1 unidade&#10;- Observação: Itens sujeitos à disponibilidade"
              rows={6}
              className="resize-none"
            />
            <p className="text-xs text-gray-500">
              Descreva cada item incluído no kit, com nome e quantidade.
              Adicione observações se necessário.
            </p>
            {errors.kit && (
              <p className="text-sm text-red-500">{errors.kit.message}</p>
            )}
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <div className="flex gap-4 pt-4">
            {onCancel && (
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                className="flex-1"
              >
                Cancelar
              </Button>
            )}
            <Button
              type="submit"
              className="flex-1 bg-gradient-to-r from-sky-500 to-pink-500 hover:from-sky-600 hover:to-pink-600"
              disabled={isSubmitting}
            >
              {isSubmitting
                ? ingressoId
                  ? "Salvando..."
                  : "Criando..."
                : ingressoId
                ? "Salvar Alterações"
                : "Criar Ingresso"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
