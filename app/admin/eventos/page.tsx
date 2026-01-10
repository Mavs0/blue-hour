"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { CriarEventoForm } from "@/components/criar-evento-form";
import { AdminLoading } from "@/components/admin/admin-loading";
import {
  Plus,
  Calendar,
  MapPin,
  Ticket,
  Edit,
  Trash2,
  Power,
  PowerOff,
} from "lucide-react";
import { useToast } from "@/components/ui/toaster";

interface Ingresso {
  id: string;
  tipo: string;
  preco: number;
  quantidade: number;
  vendidos: number;
}

interface Evento {
  id: string;
  nome: string;
  descricao: string | null;
  data: string;
  local: string;
  cidade: string;
  ativo: boolean;
  ingressos: Ingresso[];
}

export default function AdminEventosPage() {
  const { success, error: showError } = useToast();
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingEventoId, setEditingEventoId] = useState<string | null>(null);
  const [deletingEventoId, setDeletingEventoId] = useState<string | null>(null);
  const [togglingEventoId, setTogglingEventoId] = useState<string | null>(null);

  useEffect(() => {
    fetchEventos();
  }, []);

  const fetchEventos = async () => {
    try {
      const response = await fetch("/api/eventos");
      const data = await response.json();
      setEventos(data.eventos || []);
    } catch (error) {
      console.error("Erro ao buscar eventos:", error);
      showError("Erro ao carregar eventos", "Tente novamente mais tarde");
    } finally {
      setLoading(false);
    }
  };

  const handleEventoCriado = () => {
    fetchEventos();
    if (!editingEventoId) {
      // Não fechar o dialog se não estiver editando - manter aberto para criar mais eventos
    } else {
      setEditingEventoId(null);
      setShowForm(false);
    }
  };

  const handleEdit = (eventoId: string) => {
    setEditingEventoId(eventoId);
    setShowForm(true);
  };

  const handleDelete = async () => {
    if (!deletingEventoId) return;

    try {
      const response = await fetch(`/api/eventos/${deletingEventoId}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erro ao excluir evento");
      }

      success("Evento excluído", "O evento foi excluído com sucesso");
      setDeletingEventoId(null);
      fetchEventos();
    } catch (error: any) {
      console.error("Erro ao excluir evento:", error);
      showError(
        "Erro ao excluir evento",
        error.message || "Não foi possível excluir o evento"
      );
    }
  };

  const handleToggleStatus = async (eventoId: string, ativo: boolean) => {
    setTogglingEventoId(eventoId);
    try {
      const response = await fetch(`/api/eventos/${eventoId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ativo: !ativo }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erro ao atualizar status");
      }

      success(
        `Evento ${!ativo ? "ativado" : "desativado"}`,
        `O evento foi ${!ativo ? "ativado" : "desativado"} com sucesso`
      );
      fetchEventos();
    } catch (error: any) {
      console.error("Erro ao atualizar status:", error);
      showError(
        "Erro ao atualizar status",
        error.message || "Não foi possível atualizar o status do evento"
      );
    } finally {
      setTogglingEventoId(null);
    }
  };

  const eventoDeletando = eventos.find((e) => e.id === deletingEventoId);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Gerenciar Eventos
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Crie e gerencie seus eventos
          </p>
        </div>
        <Button
          onClick={() => {
            setEditingEventoId(null);
            setShowForm(true);
          }}
          className="bg-gradient-to-r from-sky-500 to-pink-500 hover:from-sky-600 hover:to-pink-600"
        >
          <Plus className="w-4 h-4 mr-2" />
          Novo Evento
        </Button>
      </div>

      <CriarEventoForm
        open={showForm}
        onOpenChange={(open) => {
          setShowForm(open);
          if (!open) {
            setEditingEventoId(null);
          }
        }}
        eventoId={editingEventoId || undefined}
        onSuccess={handleEventoCriado}
      />

      {loading ? (
        <AdminLoading message="Carregando eventos..." />
      ) : eventos.length === 0 ? (
        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardContent className="pt-6">
            <div className="text-center py-12">
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Nenhum evento cadastrado ainda.
              </p>
              <Button
                onClick={() => {
                  setEditingEventoId(null);
                  setShowForm(true);
                }}
                className="bg-gradient-to-r from-sky-500 to-pink-500 hover:from-sky-600 hover:to-pink-600"
              >
                <Plus className="w-4 h-4 mr-2" />
                Criar Primeiro Evento
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {eventos.map((evento) => (
            <Card
              key={evento.id}
              className="hover:shadow-xl transition-all transform hover:-translate-y-1 dark:bg-gray-800 dark:border-gray-700"
            >
              <CardHeader>
                <div className="flex justify-between items-start mb-2">
                  <CardTitle className="text-xl dark:text-white">
                    {evento.nome}
                  </CardTitle>
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      evento.ativo
                        ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                        : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                    }`}
                  >
                    {evento.ativo ? "Ativo" : "Inativo"}
                  </span>
                </div>
                {evento.descricao && (
                  <CardDescription className="line-clamp-2 dark:text-gray-400">
                    {evento.descricao}
                  </CardDescription>
                )}
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <Calendar className="w-4 h-4" />
                    <span>
                      {new Date(evento.data).toLocaleDateString("pt-BR", {
                        day: "2-digit",
                        month: "long",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <MapPin className="w-4 h-4" />
                    <span>
                      {evento.local} - {evento.cidade}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <Ticket className="w-4 h-4" />
                    <span>{evento.ingressos.length} tipo(s) de ingresso</span>
                  </div>
                </div>

                <div className="pt-4 border-t dark:border-gray-700">
                  <div className="flex flex-col gap-2">
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 dark:border-gray-700 dark:text-gray-300"
                        onClick={() => handleEdit(evento.id)}
                      >
                        <Edit className="w-4 h-4 mr-1" />
                        Editar
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className={`flex-1 ${
                          evento.ativo
                            ? "text-orange-600 hover:text-orange-700 hover:border-orange-300 dark:text-orange-400 dark:hover:text-orange-500"
                            : "text-green-600 hover:text-green-700 hover:border-green-300 dark:text-green-400 dark:hover:text-green-500"
                        } dark:border-gray-700`}
                        onClick={() =>
                          handleToggleStatus(evento.id, evento.ativo)
                        }
                        disabled={togglingEventoId === evento.id}
                      >
                        {togglingEventoId === evento.id ? (
                          <span className="animate-spin">⏳</span>
                        ) : evento.ativo ? (
                          <>
                            <PowerOff className="w-4 h-4 mr-1" />
                            Desativar
                          </>
                        ) : (
                          <>
                            <Power className="w-4 h-4 mr-1" />
                            Ativar
                          </>
                        )}
                      </Button>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full text-red-600 hover:text-red-700 hover:border-red-300 dark:text-red-400 dark:hover:text-red-500 dark:border-gray-700"
                      onClick={() => setDeletingEventoId(evento.id)}
                    >
                      <Trash2 className="w-4 h-4 mr-1" />
                      Excluir
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Dialog de Confirmação de Exclusão */}
      <AlertDialog
        open={!!deletingEventoId}
        onOpenChange={(open) => !open && setDeletingEventoId(null)}
      >
        <AlertDialogContent className="dark:bg-gray-800 dark:border-gray-700">
          <AlertDialogHeader>
            <AlertDialogTitle className="dark:text-white">
              Confirmar Exclusão
            </AlertDialogTitle>
            <AlertDialogDescription className="dark:text-gray-300">
              Tem certeza que deseja excluir o evento{" "}
              <strong className="text-gray-900 dark:text-white">
                {eventoDeletando?.nome}
              </strong>
              ? Esta ação não pode ser desfeita.
              {eventoDeletando?.ingressos.some((i) => i.vendidos > 0) && (
                <span className="block mt-2 text-red-600 dark:text-red-400 font-semibold">
                  ⚠️ Este evento possui ingressos vendidos. A exclusão pode não
                  ser permitida.
                </span>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="dark:border-gray-700 dark:text-gray-300">
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
