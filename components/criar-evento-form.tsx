"use client";

import { useState, useEffect } from "react";
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
import { ImageUpload } from "@/components/ui/image-upload";

interface CriarEventoFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
  eventoId?: string; // Se fornecido, será modo de edição
}

export function CriarEventoForm({
  open,
  onOpenChange,
  onSuccess,
  eventoId,
}: CriarEventoFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loadingEvento, setLoadingEvento] = useState(false);
  const isEditMode = !!eventoId;

  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    setValue,
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

  const { fields, append, remove, replace } = useFieldArray({
    control,
    name: "ingressos",
  });

  // Carregar dados do evento quando em modo de edição
  useEffect(() => {
    if (isEditMode && open) {
      loadEventoData();
    } else if (!open) {
      // Resetar formulário quando fechar
      reset({
        nome: "",
        descricao: "",
        data: "",
        local: "",
        cidade: "Manaus",
        imagemUrl: "",
        ingressos: [{ tipo: "", preco: 0, quantidade: 0 }],
      });
      setError(null);
    }
  }, [isEditMode, open, eventoId]);

  const loadEventoData = async () => {
    if (!eventoId) return;

    setLoadingEvento(true);
    try {
      const response = await fetch(`/api/eventos/${eventoId}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erro ao carregar evento");
      }

      const evento = data.evento;

      // Formatar data para datetime-local
      const dataFormatada = evento.data
        ? new Date(evento.data).toISOString().slice(0, 16)
        : "";

      // Preparar ingressos com IDs para edição
      const ingressosFormatados = evento.ingressos.map((ing: any) => ({
        id: ing.id,
        tipo: ing.tipo,
        preco: ing.preco,
        quantidade: ing.quantidade,
        kit: ing.kit || "",
      }));

      reset({
        nome: evento.nome || "",
        descricao: evento.descricao || "",
        data: dataFormatada,
        local: evento.local || "",
        cidade: evento.cidade || "Manaus",
        imagemUrl: evento.imagemUrl || "",
        ingressos:
          ingressosFormatados.length > 0
            ? ingressosFormatados
            : [{ tipo: "", preco: 0, quantidade: 0 }],
      });

      replace(ingressosFormatados.length > 0 ? ingressosFormatados : []);
    } catch (err: any) {
      setError(err.message || "Erro ao carregar dados do evento");
    } finally {
      setLoadingEvento(false);
    }
  };

  const onSubmit = async (data: EventoInput) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const url = isEditMode ? `/api/eventos/${eventoId}` : "/api/eventos";
      const method = isEditMode ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.error || `Erro ao ${isEditMode ? "atualizar" : "criar"} evento`
        );
      }

      // Resetar formulário apenas se não for edição ou se quiser criar outro
      if (!isEditMode) {
        reset();
      }

      if (onSuccess) {
        onSuccess();
      } else {
        router.push("/admin/eventos");
        router.refresh();
      }

      // Fechar dialog após sucesso
      if (isEditMode) {
        onOpenChange(false);
      }
    } catch (err: any) {
      setError(
        err.message ||
          `Erro ao ${
            isEditMode ? "atualizar" : "criar"
          } evento. Tente novamente.`
      );
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            {isEditMode ? "Editar Evento" : "Criar Novo Evento"}
          </DialogTitle>
          <DialogDescription>
            {isEditMode
              ? "Atualize os dados do evento e configure os tipos de ingressos"
              : "Preencha os dados do evento e configure os tipos de ingressos"}
          </DialogDescription>
        </DialogHeader>

        {loadingEvento ? (
          <div className="flex items-center justify-center py-12">
            <p className="text-gray-600 dark:text-gray-400">
              Carregando dados do evento...
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Informações Básicas */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold dark:text-white">
                Informações do Evento
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nome">Nome do Evento *</Label>
                  <Input
                    id="nome"
                    {...register("nome")}
                    placeholder="Ex: TXT Blue Hour Concert"
                    className="dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                  />
                  {errors.nome && (
                    <p className="text-sm text-red-500">
                      {errors.nome.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="data">Data e Hora *</Label>
                  <Input
                    id="data"
                    type="datetime-local"
                    {...register("data")}
                    className="dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                  />
                  {errors.data && (
                    <p className="text-sm text-red-500">
                      {errors.data.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="local">Local *</Label>
                  <Input
                    id="local"
                    {...register("local")}
                    placeholder="Ex: Arena da Amazônia"
                    className="dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                  />
                  {errors.local && (
                    <p className="text-sm text-red-500">
                      {errors.local.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cidade">Cidade *</Label>
                  <Input
                    id="cidade"
                    {...register("cidade")}
                    placeholder="Manaus"
                    className="dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                  />
                  {errors.cidade && (
                    <p className="text-sm text-red-500">
                      {errors.cidade.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2 md:col-span-2">
                  <ImageUpload
                    value={watch("imagemUrl")}
                    onChange={(url) => {
                      setValue("imagemUrl", url, { shouldValidate: true });
                    }}
                    label="Imagem do Evento (opcional)"
                    maxSizeMB={5}
                    maxWidth={1920}
                    maxHeight={1080}
                  />
                  {errors.imagemUrl && (
                    <p className="text-sm text-red-500">
                      {errors.imagemUrl.message}
                    </p>
                  )}
                  {/* Campo oculto para manter compatibilidade com o schema */}
                  <Input
                    id="imagemUrl"
                    type="hidden"
                    {...register("imagemUrl")}
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="descricao">Descrição (opcional)</Label>
                  <Textarea
                    id="descricao"
                    {...register("descricao")}
                    placeholder="Descreva o evento..."
                    rows={4}
                    className="dark:bg-gray-800 dark:border-gray-700 dark:text-white"
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
                <h3 className="text-lg font-semibold dark:text-white">
                  Tipos de Ingressos
                </h3>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => append({ tipo: "", preco: 0, quantidade: 0 })}
                  className="dark:border-gray-700 dark:text-gray-300"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Adicionar Ingresso
                </Button>
              </div>

              {fields.map((field, index) => (
                <div
                  key={field.id}
                  className="p-4 border rounded-lg space-y-4 bg-gray-50 dark:bg-gray-800 dark:border-gray-700"
                >
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium dark:text-white">
                      Ingresso {index + 1}
                    </h4>
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
                        className="dark:bg-gray-900 dark:border-gray-700 dark:text-white"
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
                        className="dark:bg-gray-900 dark:border-gray-700 dark:text-white"
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
                        className="dark:bg-gray-900 dark:border-gray-700 dark:text-white"
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
              <div className="p-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-md">
                <p className="text-sm text-red-600 dark:text-red-400">
                  {error}
                </p>
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
                className="flex-1 dark:border-gray-700 dark:text-gray-300"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-gradient-to-r from-sky-500 to-pink-500 hover:from-sky-600 hover:to-pink-600"
                disabled={isSubmitting || loadingEvento}
              >
                {isSubmitting
                  ? isEditMode
                    ? "Atualizando..."
                    : "Criando..."
                  : isEditMode
                  ? "Atualizar Evento"
                  : "Criar Evento"}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
