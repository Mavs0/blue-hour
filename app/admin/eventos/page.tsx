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
import { CriarEventoForm } from "@/components/criar-evento-form";
import { Plus, Calendar, MapPin, Ticket, Edit, Trash2 } from "lucide-react";

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
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

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
    } finally {
      setLoading(false);
    }
  };

  const handleEventoCriado = () => {
    setShowForm(false);
    fetchEventos();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Gerenciar Eventos
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Crie e gerencie seus eventos
          </p>
        </div>
        {!showForm && (
          <Button
            onClick={() => setShowForm(true)}
            className="bg-gradient-to-r from-sky-500 to-pink-500 hover:from-sky-600 hover:to-pink-600"
          >
            <Plus className="w-4 h-4 mr-2" />
            Novo Evento
          </Button>
        )}
      </div>

      {showForm ? (
        <div className="mb-8">
          <CriarEventoForm
            onSuccess={handleEventoCriado}
            onCancel={() => setShowForm(false)}
          />
        </div>
      ) : (
        <>
          {loading ? (
            <Card>
              <CardContent className="pt-6">
                <p className="text-center text-gray-600">Carregando...</p>
              </CardContent>
            </Card>
          ) : eventos.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-12">
                  <p className="text-gray-600 mb-4">
                    Nenhum evento cadastrado ainda.
                  </p>
                  <Button
                    onClick={() => setShowForm(true)}
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
                  className="hover:shadow-xl transition-all transform hover:-translate-y-1"
                >
                  <CardHeader>
                    <div className="flex justify-between items-start mb-2">
                      <CardTitle className="text-xl">{evento.nome}</CardTitle>
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          evento.ativo
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {evento.ativo ? "Ativo" : "Inativo"}
                      </span>
                    </div>
                    {evento.descricao && (
                      <CardDescription className="line-clamp-2">
                        {evento.descricao}
                      </CardDescription>
                    )}
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2 text-gray-600">
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
                      <div className="flex items-center gap-2 text-gray-600">
                        <MapPin className="w-4 h-4" />
                        <span>
                          {evento.local} - {evento.cidade}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Ticket className="w-4 h-4" />
                        <span>
                          {evento.ingressos.length} tipo(s) de ingresso
                        </span>
                      </div>
                    </div>

                    <div className="pt-4 border-t">
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1"
                          onClick={() => {
                            // TODO: Implementar edição
                            alert("Edição em desenvolvimento");
                          }}
                        >
                          <Edit className="w-4 h-4 mr-1" />
                          Editar
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 text-red-600 hover:text-red-700 hover:border-red-300"
                          onClick={() => {
                            // TODO: Implementar exclusão
                            alert("Exclusão em desenvolvimento");
                          }}
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
        </>
      )}
    </div>
  );
}
