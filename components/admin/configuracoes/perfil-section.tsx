"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { User, Mail, Calendar, CheckCircle2, AlertCircle } from "lucide-react";
import { useToast } from "@/components/ui/toaster";

export function PerfilSection() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const { success, error } = useToast();

  useEffect(() => {
    // Tentar obter informações do usuário atual
    fetch("/api/admin/me")
      .then((res) => res.json())
      .then((data) => {
        if (data.username) {
          setUsername(data.username);
        }
        if (data.email) {
          setEmail(data.email);
        }
      })
      .catch(() => {
        // Se não conseguir obter, deixar vazio
      });
  }, []);

  const handleSave = async () => {
    setLoading(true);
    setSaved(false);

    try {
      // Simular salvamento
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setSaved(true);
      success(
        "Perfil atualizado",
        "Suas informações foram salvas com sucesso."
      );

      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      error("Erro", "Não foi possível salvar as informações.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          Informações do Perfil
        </CardTitle>
        <CardDescription>
          Atualize suas informações pessoais e de contato
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="username" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Nome de Usuário
            </Label>
            <Input
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="seu.usuario"
              disabled
              className="bg-gray-50 dark:bg-gray-900"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400">
              O nome de usuário não pode ser alterado
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              Email
            </Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Email para notificações e recuperação de conta
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <Calendar className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          <div className="flex-1">
            <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
              Último acesso
            </p>
            <p className="text-xs text-blue-700 dark:text-blue-300">
              {new Date().toLocaleString("pt-BR")}
            </p>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
          <Button
            onClick={handleSave}
            disabled={loading}
            className="bg-gradient-to-r from-sky-500 to-pink-500 hover:from-sky-600 hover:to-pink-600"
          >
            {loading ? (
              "Salvando..."
            ) : saved ? (
              <>
                <CheckCircle2 className="h-4 w-4 mr-2" />
                Salvo!
              </>
            ) : (
              "Salvar Alterações"
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
