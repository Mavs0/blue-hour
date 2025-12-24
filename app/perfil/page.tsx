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
import { useI18n } from "@/components/providers/i18n-provider";
import { validarCPF, limparCPF, formatarCPF } from "@/lib/cpf-validator";
import { sanitizeString, sanitizeEmail, sanitizeNumber } from "@/lib/sanitize";
import { useToast } from "@/components/ui/toaster";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";

const createPerfilSchema = (t: (key: string) => string) =>
  z.object({
    nome: z
      .string()
      .min(2, t("profile.validation.nameMin"))
      .max(100, "Nome muito longo")
      .transform((val) => sanitizeString(val, 100)),
    email: z
      .string()
      .email(t("profile.validation.emailInvalid"))
      .transform((val) => sanitizeEmail(val)),
    telefone: z
      .string()
      .optional()
      .transform((val) => (val ? sanitizeNumber(val) : val)),
    cpf: z
      .string()
      .optional()
      .transform((val) => (val ? limparCPF(val) : val))
      .refine(
        (val) => !val || val.length === 11,
        t("profile.validation.cpfInvalid")
      )
      .refine(
        (val) => !val || validarCPF(val),
        t("profile.validation.cpfInvalid")
      ),
  });

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
  const { t, locale } = useI18n();
  const toast = useToast();
  const [buscarEmail, setBuscarEmail] = useState("");
  const [buscarCpf, setBuscarCpf] = useState("");
  const [loading, setLoading] = useState(false);
  const [salvando, setSalvando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [cliente, setCliente] = useState<Cliente | null>(null);
  const [modoBusca, setModoBusca] = useState(true);
  const [showConfirmReset, setShowConfirmReset] = useState(false);

  const perfilSchema = createPerfilSchema(t);
  type PerfilFormData = z.infer<typeof perfilSchema>;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<PerfilFormData>({
    resolver: zodResolver(perfilSchema),
  });

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
      setError(t("profile.access.error"));
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
        setError(data.error || t("profile.access.errorFetch"));
        return;
      }

      setCliente(data.cliente);
      setModoBusca(false);
      // Preencher formulário
      setValue("nome", data.cliente.nome);
      setValue("email", data.cliente.email);
      setValue("telefone", data.cliente.telefone || "");
      setValue("cpf", data.cliente.cpf || "");
      toast.success(t("profile.access.button"), t("success.action"));
    } catch (err: any) {
      const errorMessage = err.message || t("profile.access.errorRetry");
      setError(errorMessage);
      toast.error(t("error.generic"), errorMessage);
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
        setError(responseData.error || t("profile.edit.error"));
        return;
      }

      const successMessage = t("profile.edit.success");
      setSuccess(successMessage);
      toast.success(successMessage);
      setCliente({
        ...cliente,
        ...responseData.cliente,
      });
    } catch (err: any) {
      const errorMessage = err.message || t("profile.edit.errorRetry");
      setError(errorMessage);
      toast.error(t("error.generic"), errorMessage);
      console.error(err);
    } finally {
      setSalvando(false);
    }
  };

  const handleResetSearch = () => {
    setModoBusca(true);
    setCliente(null);
    reset();
    setError(null);
    setSuccess(null);
    setShowConfirmReset(false);
  };

  const formatarData = (data: string) => {
    const localeStr =
      locale === "pt-BR" ? "pt-BR" : locale === "en-US" ? "en-US" : "es-ES";
    return new Date(data).toLocaleDateString(localeStr, {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <main className="flex flex-col flex-1 bg-gradient-to-b from-purple-50 to-pink-50 dark:from-gray-900 dark:to-gray-800">
      <Navbar />
      <div className="flex-1 container mx-auto px-4 py-24 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            {t("profile.title")}
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            {t("profile.subtitle")}
          </p>
        </div>

        {/* Busca inicial */}
        {modoBusca && (
          <Card className="mb-8 dark:bg-gray-800 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 dark:text-white">
                <UserCircle className="w-5 h-5" />
                {t("profile.access.title")}
              </CardTitle>
              <CardDescription className="dark:text-gray-300">
                {t("profile.access.subtitle")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleBuscar} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label
                      htmlFor="buscar-email"
                      className="dark:text-gray-300"
                    >
                      {t("profile.access.email")}
                    </Label>
                    <Input
                      id="buscar-email"
                      type="email"
                      placeholder={t("profile.access.emailPlaceholder")}
                      value={buscarEmail}
                      onChange={(e) => setBuscarEmail(e.target.value)}
                      disabled={loading}
                      className="dark:bg-gray-900 dark:border-gray-700"
                    />
                  </div>
                  <div>
                    <Label htmlFor="buscar-cpf" className="dark:text-gray-300">
                      {t("profile.access.cpf")}
                    </Label>
                    <Input
                      id="buscar-cpf"
                      type="text"
                      placeholder={t("profile.access.cpfPlaceholder")}
                      value={buscarCpf}
                      onChange={(e) =>
                        setBuscarCpf(formatarCPF(e.target.value))
                      }
                      maxLength={14}
                      disabled={loading}
                      className="dark:bg-gray-900 dark:border-gray-700"
                    />
                  </div>
                </div>
                {error && (
                  <div className="flex items-center gap-2 text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 p-3 rounded-lg">
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
                      {t("profile.access.loading")}
                    </>
                  ) : (
                    t("profile.access.button")
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
            <Card className="mb-6 dark:bg-gray-800 dark:border-gray-700">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-2xl dark:text-white">
                      {cliente.nome}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-2 mt-2 dark:text-gray-300">
                      <Mail className="w-4 h-4" />
                      {cliente.email}
                    </CardDescription>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {t("profile.info.totalPurchases")}
                    </div>
                    <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                      {cliente.totalCompras}
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                  <Calendar className="w-4 h-4" />
                  {t("profile.info.memberSince").replace(
                    "{date}",
                    formatarData(cliente.createdAt)
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Formulário de edição */}
            <Card className="dark:bg-gray-800 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="dark:text-white">
                  {t("profile.edit.title")}
                </CardTitle>
                <CardDescription className="dark:text-gray-300">
                  {t("profile.edit.subtitle")}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="nome" className="dark:text-gray-300">
                        {t("profile.edit.name")}{" "}
                        <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="nome"
                        {...register("nome")}
                        placeholder={t("profile.edit.namePlaceholder")}
                        disabled={salvando}
                        className="dark:bg-gray-900 dark:border-gray-700"
                      />
                      {errors.nome && (
                        <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                          {errors.nome.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="email" className="dark:text-gray-300">
                        {t("profile.edit.email")}{" "}
                        <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        {...register("email")}
                        placeholder={t("profile.edit.emailPlaceholder")}
                        disabled={true}
                        className="bg-gray-100 dark:bg-gray-900 dark:border-gray-700"
                      />
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {t("profile.edit.emailDisabled")}
                      </p>
                    </div>

                    <div>
                      <Label htmlFor="telefone" className="dark:text-gray-300">
                        {t("profile.edit.phone")}
                      </Label>
                      <Input
                        id="telefone"
                        type="tel"
                        {...register("telefone")}
                        placeholder={t("profile.edit.phonePlaceholder")}
                        disabled={salvando}
                        className="dark:bg-gray-900 dark:border-gray-700"
                        onChange={(e) => {
                          const valorFormatado = formatarTelefone(
                            e.target.value
                          );
                          setValue("telefone", valorFormatado);
                        }}
                      />
                      {errors.telefone && (
                        <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                          {errors.telefone.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="cpf" className="dark:text-gray-300">
                        {t("profile.edit.cpf")}
                      </Label>
                      <Input
                        id="cpf"
                        type="text"
                        {...register("cpf")}
                        placeholder={t("profile.edit.cpfPlaceholder")}
                        maxLength={14}
                        disabled={salvando}
                        className="dark:bg-gray-900 dark:border-gray-700"
                        onChange={(e) => {
                          const valorFormatado = formatarCPF(e.target.value);
                          setValue("cpf", valorFormatado);
                        }}
                      />
                      {errors.cpf && (
                        <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                          {errors.cpf.message}
                        </p>
                      )}
                    </div>
                  </div>

                  {error && (
                    <div className="flex items-center gap-2 text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 p-3 rounded-lg">
                      <AlertCircle className="w-5 h-5" />
                      <span>{error}</span>
                    </div>
                  )}

                  {success && (
                    <div className="flex items-center gap-2 text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
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
                          {t("profile.edit.saving")}
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4 mr-2" />
                          {t("profile.edit.save")}
                        </>
                      )}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      className="dark:border-gray-700 dark:text-gray-300"
                      onClick={() => setShowConfirmReset(true)}
                    >
                      {t("profile.edit.searchOther")}
                    </Button>
                    <ConfirmDialog
                      open={showConfirmReset}
                      onOpenChange={setShowConfirmReset}
                      title={t("confirm.cancel")}
                      description={t("confirm.action")}
                      confirmText={t("profile.edit.searchOther")}
                      cancelText={t("settings.cancel") || "Cancelar"}
                      onConfirm={handleResetSearch}
                    />
                  </div>
                </form>
              </CardContent>
            </Card>

            {/* Links rápidos */}
            <div className="mt-6 grid md:grid-cols-2 gap-4">
              <Link href="/ingressos">
                <Card className="hover:shadow-lg transition-shadow cursor-pointer dark:bg-gray-800 dark:border-gray-700">
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-lg">
                        <CreditCard className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                      </div>
                      <div>
                        <h3 className="font-semibold dark:text-white">
                          {t("profile.links.tickets.title")}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          {t("profile.links.tickets.desc")}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
              <Link href="/configuracoes">
                <Card className="hover:shadow-lg transition-shadow cursor-pointer dark:bg-gray-800 dark:border-gray-700">
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-sky-100 dark:bg-sky-900 rounded-lg">
                        <Phone className="w-6 h-6 text-sky-600 dark:text-sky-400" />
                      </div>
                      <div>
                        <h3 className="font-semibold dark:text-white">
                          {t("profile.links.settings.title")}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          {t("profile.links.settings.desc")}
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
