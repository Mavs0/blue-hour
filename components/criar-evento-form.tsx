"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  eventoSchema,
  type EventoInput,
  type IngressoInput,
} from "@/lib/validations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Plus, Trash2, X } from "lucide-react";

interface CriarEventoFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function CriarEventoForm({
  open,
  onOpenChange,
  onSuccess,
}: CriarEventoFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<EventoInput>({
    resolver: zodResolver(eventoSchema),
    defaultValues: {
      nome: "",
      descricao: "",
      data: "",
      local: "",
      cidade: "Manaus",
      imagemUrl: "",
      ingressos: [{ tipo: "", preco: 0, quantidade: 0 }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "ingressos",
  });

  const onSubmit = async (data: EventoInput) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/eventos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Erro ao criar evento");
      }

      // Resetar formulário
      reset();

      if (onSuccess) {
        onSuccess();
      } else {
        router.push("/admin/eventos");
        router.refresh();
      }

      // Não fechar o dialog automaticamente - manter aberto
    } catch (err: any) {
      setError(err.message || "Erro ao criar evento. Tente novamente.");
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Criar Novo Evento</DialogTitle>
          <DialogDescription>
            Preencha os dados do evento e configure os tipos de ingressos
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Informações Básicas */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Informações do Evento</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nome">Nome do Evento *</Label>
                <Input
                  id="nome"
                  {...register("nome")}
                  placeholder="Ex: TXT Blue Hour Concert"
                />
                {errors.nome && (
                  <p className="text-sm text-red-500">{errors.nome.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="data">Data e Hora *</Label>
                <Input id="data" type="datetime-local" {...register("data")} />
                {errors.data && (
                  <p className="text-sm text-red-500">{errors.data.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="local">Local *</Label>
                <Input
                  id="local"
                  {...register("local")}
                  placeholder="Ex: Arena da Amazônia"
                />
                {errors.local && (
                  <p className="text-sm text-red-500">{errors.local.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="cidade">Cidade *</Label>
                <Input
                  id="cidade"
                  {...register("cidade")}
                  placeholder="Manaus"
                />
                {errors.cidade && (
                  <p className="text-sm text-red-500">
                    {errors.cidade.message}
                  </p>
                )}
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="imagemUrl">URL da Imagem (opcional)</Label>
                <Input
                  id="imagemUrl"
                  type="url"
                  {...register("imagemUrl")}
                  placeholder="https://exemplo.com/imagem.jpg"
                />
                {errors.imagemUrl && (
                  <p className="text-sm text-red-500">
                    {errors.imagemUrl.message}
                  </p>
                )}
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="descricao">Descrição (opcional)</Label>
                <Textarea
                  id="descricao"
                  {...register("descricao")}
                  placeholder="Descreva o evento..."
                  rows={4}
                />
                {errors.descricao && (
                  <p className="text-sm text-red-500">
                    {errors.descricao.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Ingressos */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Tipos de Ingressos</h3>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => append({ tipo: "", preco: 0, quantidade: 0 })}
              >
                <Plus className="w-4 h-4 mr-2" />
                Adicionar Ingresso
              </Button>
            </div>

            {fields.map((field, index) => (
              <div
                key={field.id}
                className="p-4 border rounded-lg space-y-4 bg-gray-50"
              >
                <div className="flex justify-between items-center">
                  <h4 className="font-medium">Ingresso {index + 1}</h4>
                  {fields.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => remove(index)}
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor={`ingressos.${index}.tipo`}>Tipo *</Label>
                    <Input
                      {...register(`ingressos.${index}.tipo`)}
                      placeholder="Ex: Pista, VIP, Camarote"
                    />
                    {errors.ingressos?.[index]?.tipo && (
                      <p className="text-sm text-red-500">
                        {errors.ingressos[index]?.tipo?.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`ingressos.${index}.preco`}>
                      Preço (R$) *
                    </Label>
                    <Input
                      type="number"
                      step="0.01"
                      min="0"
                      {...register(`ingressos.${index}.preco`, {
                        valueAsNumber: true,
                      })}
                      placeholder="0.00"
                    />
                    {errors.ingressos?.[index]?.preco && (
                      <p className="text-sm text-red-500">
                        {errors.ingressos[index]?.preco?.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`ingressos.${index}.quantidade`}>
                      Quantidade *
                    </Label>
                    <Input
                      type="number"
                      min="1"
                      {...register(`ingressos.${index}.quantidade`, {
                        valueAsNumber: true,
                      })}
                      placeholder="0"
                    />
                    {errors.ingressos?.[index]?.quantidade && (
                      <p className="text-sm text-red-500">
                        {errors.ingressos[index]?.quantidade?.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {errors.ingressos &&
              typeof errors.ingressos === "object" &&
              "message" in errors.ingressos && (
                <p className="text-sm text-red-500">
                  {errors.ingressos.message as string}
                </p>
              )}
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <div className="flex gap-4 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                reset();
                onOpenChange(false);
              }}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-gradient-to-r from-sky-500 to-pink-500 hover:from-sky-600 hover:to-pink-600"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Criando..." : "Criar Evento"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
