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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { IngressoForm } from "@/components/ingresso-form";
import {
  Plus,
  Ticket,
  Edit,
  Trash2,
  Power,
  Calendar,
  DollarSign,
  Users,
} from "lucide-react";

interface Evento {
  id: string;
  nome: string;
}

interface Ingresso {
  id: string;
  tipo: string;
  preco: number;
  quantidade: number;
  vendidos: number;
  ativo: boolean;
  kit: string | null;
  evento: {
    id: string;
    nome: string;
    data: string;
  };
}

export default function AdminIngressosPage() {
  const [ingressos, setIngressos] = useState<Ingresso[]>([]);
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [filterEventoId, setFilterEventoId] = useState<string>("all");

  useEffect(() => {
    fetchEventos();
    fetchIngressos();
  }, []);

  useEffect(() => {
    fetchIngressos();
  }, [filterEventoId]);

  const fetchEventos = async () => {
    try {
      const response = await fetch("/api/eventos");
      const data = await response.json();
      setEventos(data.eventos || []);
    } catch (error) {
      console.error("Erro ao buscar eventos:", error);
    }
  };

  const fetchIngressos = async () => {
    try {
      const url =
        filterEventoId === "all"
          ? "/api/ingressos"
          : `/api/ingressos?eventoId=${filterEventoId}`;
      const response = await fetch(url);
      const data = await response.json();
      setIngressos(data.ingressos || []);
    } catch (error) {
      console.error("Erro ao buscar ingressos:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSuccess = () => {
    setShowForm(false);
    setEditingId(null);
    fetchIngressos();
  };

  const handleEdit = (id: string) => {
    setEditingId(id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir este ingresso?")) {
      return;
    }

    try {
      const response = await fetch(`/api/ingressos/${id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || "Erro ao excluir ingresso");
        return;
      }

      fetchIngressos();
    } catch (error) {
      console.error("Erro ao excluir ingresso:", error);
      alert("Erro ao excluir ingresso. Tente novamente.");
    }
  };

  const handleToggleStatus = async (id: string) => {
    try {
      const response = await fetch(`/api/ingressos/${id}/toggle`, {
        method: "PATCH",
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || "Erro ao alterar status");
        return;
      }

      fetchIngressos();
    } catch (error) {
      console.error("Erro ao alterar status:", error);
      alert("Erro ao alterar status. Tente novamente.");
    }
  };

  const ingressosFiltrados = ingressos.filter((ingresso) => {
    if (filterEventoId === "all") return true;
    return ingresso.evento.id === filterEventoId;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Gerenciar Ingressos
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Configure tipos e quantidades de ingressos
          </p>
        </div>
        {!showForm && (
          <Button
            onClick={() => {
              setEditingId(null);
              setShowForm(true);
            }}
            className="bg-gradient-to-r from-sky-500 to-pink-500 hover:from-sky-600 hover:to-pink-600"
          >
            <Plus className="w-4 h-4 mr-2" />
            Novo Ingresso
          </Button>
        )}
      </div>

      {showForm ? (
        <div className="mb-8">
          <IngressoForm
            ingressoId={editingId || undefined}
            onSuccess={handleSuccess}
            onCancel={() => {
              setShowForm(false);
              setEditingId(null);
            }}
          />
        </div>
      ) : (
        <>
          {/* Filtro */}
          <div className="mb-6">
            <Select value={filterEventoId} onValueChange={setFilterEventoId}>
              <SelectTrigger className="w-full md:w-64">
                <SelectValue placeholder="Filtrar por evento" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os eventos</SelectItem>
                {eventos.map((evento) => (
                  <SelectItem key={evento.id} value={evento.id}>
                    {evento.nome}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {loading ? (
            <Card>
              <CardContent className="pt-6">
                <p className="text-center text-gray-600">Carregando...</p>
              </CardContent>
            </Card>
          ) : ingressosFiltrados.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-12">
                  <p className="text-gray-600 mb-4">
                    Nenhum ingresso encontrado.
                  </p>
                  <Button
                    onClick={() => setShowForm(true)}
                    className="bg-gradient-to-r from-sky-500 to-pink-500 hover:from-sky-600 hover:to-pink-600"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Criar Primeiro Ingresso
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {ingressosFiltrados.map((ingresso) => {
                const disponivel = ingresso.quantidade - ingresso.vendidos;
                const percentualVendido =
                  (ingresso.vendidos / ingresso.quantidade) * 100;

                return (
                  <Card
                    key={ingresso.id}
                    className={`hover:shadow-xl transition-all transform hover:-translate-y-1 ${
                      !ingresso.ativo ? "opacity-60" : ""
                    }`}
                  >
                    <CardHeader>
                      <div className="flex justify-between items-start mb-2">
                        <CardTitle className="text-xl">
                          {ingresso.tipo}
                        </CardTitle>
                        <span
                          className={`px-2 py-1 text-xs rounded-full ${
                            ingresso.ativo
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {ingresso.ativo ? "Ativo" : "Inativo"}
                        </span>
                      </div>
                      <CardDescription>{ingresso.evento.nome}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600 flex items-center gap-2">
                            <DollarSign className="w-4 h-4" />
                            Preço:
                          </span>
                          <span className="font-bold text-lg text-pink-600">
                            R$ {ingresso.preco.toFixed(2)}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600 flex items-center gap-2">
                            <Users className="w-4 h-4" />
                            Disponíveis:
                          </span>
                          <span className="font-semibold">
                            {disponivel} / {ingresso.quantidade}
                          </span>
                        </div>
                        {ingresso.kit && (
                          <div className="pt-2 border-t">
                            <span className="text-gray-600 flex items-center gap-2 mb-1">
                              <Ticket className="w-4 h-4" />
                              Kit Incluído:
                            </span>
                            <p className="text-xs text-gray-700 whitespace-pre-line bg-gray-50 p-2 rounded">
                              {ingresso.kit}
                            </p>
                          </div>
                        )}
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600 flex items-center gap-2">
                            <Ticket className="w-4 h-4" />
                            Vendidos:
                          </span>
                          <span className="font-semibold">
                            {ingresso.vendidos}
                          </span>
                        </div>
                      </div>

                      {/* Barra de progresso */}
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs text-gray-500">
                          <span>Vendas</span>
                          <span>{percentualVendido.toFixed(0)}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-sky-500 to-pink-500 h-2 rounded-full transition-all"
                            style={{ width: `${percentualVendido}%` }}
                          ></div>
                        </div>
                      </div>

                      <div className="pt-4 border-t space-y-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full"
                          onClick={() => handleEdit(ingresso.id)}
                        >
                          <Edit className="w-4 h-4 mr-1" />
                          Editar
                        </Button>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1"
                            onClick={() => handleToggleStatus(ingresso.id)}
                          >
                            <Power className="w-4 h-4 mr-1" />
                            {ingresso.ativo ? "Desativar" : "Ativar"}
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1 text-red-600 hover:text-red-700 hover:border-red-300"
                            onClick={() => handleDelete(ingresso.id)}
                            disabled={ingresso.vendidos > 0}
                            title={
                              ingresso.vendidos > 0
                                ? "Não é possível excluir ingresso com vendas"
                                : ""
                            }
                          >
                            <Trash2 className="w-4 h-4 mr-1" />
                            Excluir
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </>
      )}
    </div>
  );
}
