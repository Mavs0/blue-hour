"use client";

import { useState, useEffect } from "react";
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
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import {
  UserCircle,
  Mail,
  Phone,
  CreditCard,
  Calendar,
  Save,
  AlertCircle,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";

const perfilSchema = z.object({
  nome: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  email: z.string().email("Email inválido"),
  telefone: z.string().optional(),
  cpf: z
    .string()
    .optional()
    .refine(
      (val) => !val || val.replace(/\D/g, "").length === 11,
      "CPF deve ter 11 dígitos"
    ),
});

type PerfilFormData = z.infer<typeof perfilSchema>;

interface Cliente {
  id: string;
  nome: string;
  email: string;
  telefone: string | null;
  cpf: string | null;
  createdAt: string;
  totalCompras: number;
}

export default function PerfilPage() {
  const [buscarEmail, setBuscarEmail] = useState("");
  const [buscarCpf, setBuscarCpf] = useState("");
  const [loading, setLoading] = useState(false);
  const [salvando, setSalvando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [cliente, setCliente] = useState<Cliente | null>(null);
  const [modoBusca, setModoBusca] = useState(true);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<PerfilFormData>({
    resolver: zodResolver(perfilSchema),
  });

  const formatarCPF = (value: string) => {
    const cpfLimpo = value.replace(/\D/g, "");
    if (cpfLimpo.length <= 11) {
      return cpfLimpo.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
    }
    return value;
  };

  const formatarTelefone = (value: string) => {
    const telefoneLimpo = value.replace(/\D/g, "");
    if (telefoneLimpo.length <= 11) {
      if (telefoneLimpo.length <= 10) {
        return telefoneLimpo.replace(/(\d{2})(\d{4})(\d{4})/, "($1) $2-$3");
      }
      return telefoneLimpo.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
    }
    return value;
  };

  const handleBuscar = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    setCliente(null);

    if (!buscarEmail && !buscarCpf) {
      setError("Por favor, informe seu email ou CPF");
      setLoading(false);
      return;
    }

    try {
      const params = new URLSearchParams();
      if (buscarEmail) params.append("email", buscarEmail);
      if (buscarCpf) params.append("cpf", buscarCpf.replace(/\D/g, ""));

      const response = await fetch(`/api/perfil?${params.toString()}`);
      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Erro ao buscar perfil");
        return;
      }

      setCliente(data.cliente);
      setModoBusca(false);
      // Preencher formulário
      setValue("nome", data.cliente.nome);
      setValue("email", data.cliente.email);
      setValue("telefone", data.cliente.telefone || "");
      setValue("cpf", data.cliente.cpf || "");
    } catch (err) {
      setError("Erro ao buscar perfil. Tente novamente.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: PerfilFormData) => {
    if (!cliente) return;

    setSalvando(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch("/api/perfil", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: cliente.email,
          nome: data.nome,
          telefone: data.telefone,
          cpf: data.cpf,
        }),
      });

      const responseData = await response.json();

      if (!response.ok) {
        setError(responseData.error || "Erro ao atualizar perfil");
        return;
      }

      setSuccess("Perfil atualizado com sucesso!");
      setCliente({
        ...cliente,
        ...responseData.cliente,
      });
    } catch (err) {
      setError("Erro ao atualizar perfil. Tente novamente.");
      console.error(err);
    } finally {
      setSalvando(false);
    }
  };

  const formatarData = (data: string) => {
    return new Date(data).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-50 to-pink-50">
      <Navbar />
      <div className="container mx-auto px-4 py-24 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Meu Perfil</h1>
          <p className="text-gray-600">
            Gerencie suas informações pessoais e dados de conta
          </p>
        </div>

        {/* Busca inicial */}
        {modoBusca && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserCircle className="w-5 h-5" />
                Acessar Perfil
              </CardTitle>
              <CardDescription>
                Informe seu email ou CPF para acessar seu perfil
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleBuscar} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="buscar-email">Email</Label>
                    <Input
                      id="buscar-email"
                      type="email"
                      placeholder="seu@email.com"
                      value={buscarEmail}
                      onChange={(e) => setBuscarEmail(e.target.value)}
                      disabled={loading}
                    />
                  </div>
                  <div>
                    <Label htmlFor="buscar-cpf">CPF</Label>
                    <Input
                      id="buscar-cpf"
                      type="text"
                      placeholder="000.000.000-00"
                      value={buscarCpf}
                      onChange={(e) =>
                        setBuscarCpf(formatarCPF(e.target.value))
                      }
                      maxLength={14}
                      disabled={loading}
                    />
                  </div>
                </div>
                {error && (
                  <div className="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-lg">
                    <AlertCircle className="w-5 h-5" />
                    <span>{error}</span>
                  </div>
                )}
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full md:w-auto bg-gradient-to-r from-sky-500 to-pink-500 hover:from-sky-600 hover:to-pink-600"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Buscando...
                    </>
                  ) : (
                    "Acessar Perfil"
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Formulário de edição */}
        {cliente && !modoBusca && (
          <>
            {/* Informações do perfil */}
            <Card className="mb-6">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-2xl">{cliente.nome}</CardTitle>
                    <CardDescription className="flex items-center gap-2 mt-2">
                      <Mail className="w-4 h-4" />
                      {cliente.email}
                    </CardDescription>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-500">
                      Total de Compras
                    </div>
                    <div className="text-2xl font-bold text-purple-600">
                      {cliente.totalCompras}
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar className="w-4 h-4" />
                  Membro desde {formatarData(cliente.createdAt)}
                </div>
              </CardContent>
            </Card>

            {/* Formulário de edição */}
            <Card>
              <CardHeader>
                <CardTitle>Editar Informações</CardTitle>
                <CardDescription>
                  Atualize suas informações pessoais
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="nome">
                        Nome Completo <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="nome"
                        {...register("nome")}
                        placeholder="Seu nome completo"
                        disabled={salvando}
                      />
                      {errors.nome && (
                        <p className="text-sm text-red-600 mt-1">
                          {errors.nome.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="email">
                        Email <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        {...register("email")}
                        placeholder="seu@email.com"
                        disabled={true}
                        className="bg-gray-100"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        O email não pode ser alterado
                      </p>
                    </div>

                    <div>
                      <Label htmlFor="telefone">Telefone</Label>
                      <Input
                        id="telefone"
                        type="tel"
                        {...register("telefone")}
                        placeholder="(00) 00000-0000"
                        disabled={salvando}
                        onChange={(e) => {
                          const valorFormatado = formatarTelefone(
                            e.target.value
                          );
                          setValue("telefone", valorFormatado);
                        }}
                      />
                      {errors.telefone && (
                        <p className="text-sm text-red-600 mt-1">
                          {errors.telefone.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="cpf">CPF</Label>
                      <Input
                        id="cpf"
                        type="text"
                        {...register("cpf")}
                        placeholder="000.000.000-00"
                        maxLength={14}
                        disabled={salvando}
                        onChange={(e) => {
                          const valorFormatado = formatarCPF(e.target.value);
                          setValue("cpf", valorFormatado);
                        }}
                      />
                      {errors.cpf && (
                        <p className="text-sm text-red-600 mt-1">
                          {errors.cpf.message}
                        </p>
                      )}
                    </div>
                  </div>

                  {error && (
                    <div className="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-lg">
                      <AlertCircle className="w-5 h-5" />
                      <span>{error}</span>
                    </div>
                  )}

                  {success && (
                    <div className="flex items-center gap-2 text-green-600 bg-green-50 p-3 rounded-lg">
                      <CheckCircle2 className="w-5 h-5" />
                      <span>{success}</span>
                    </div>
                  )}

                  <div className="flex gap-4">
                    <Button
                      type="submit"
                      disabled={salvando}
                      className="bg-gradient-to-r from-sky-500 to-pink-500 hover:from-sky-600 hover:to-pink-600"
                    >
                      {salvando ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Salvando...
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4 mr-2" />
                          Salvar Alterações
                        </>
                      )}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setModoBusca(true);
                        setCliente(null);
                        reset();
                        setError(null);
                        setSuccess(null);
                      }}
                    >
                      Buscar Outro Perfil
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>

            {/* Links rápidos */}
            <div className="mt-6 grid md:grid-cols-2 gap-4">
              <Link href="/ingressos">
                <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-purple-100 rounded-lg">
                        <CreditCard className="w-6 h-6 text-purple-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold">Meus Ingressos</h3>
                        <p className="text-sm text-gray-600">
                          Ver todas as suas compras
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
              <Link href="/configuracoes">
                <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-sky-100 rounded-lg">
                        <Phone className="w-6 h-6 text-sky-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold">Configurações</h3>
                        <p className="text-sm text-gray-600">
                          Preferências e notificações
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </div>
          </>
        )}
      </div>
      <Footer />
    </main>
  );
}
