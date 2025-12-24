"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  HelpCircle,
  Search,
  MessageCircle,
  Mail,
  Phone,
  Clock,
  ChevronDown,
  ChevronUp,
  Ticket,
  User,
  Settings,
  FileText,
  Shield,
  CheckCircle2,
  AlertCircle,
  Info,
} from "lucide-react";
import Link from "next/link";
import { useI18n } from "@/components/providers/i18n-provider";

interface FAQItem {
  id: string;
  perguntaKey: string;
  respostaKey: string;
  categoriaKey: string;
}

const faqs: FAQItem[] = [
  {
    id: "1",
    categoriaKey: "help.categories.tickets",
    perguntaKey: "help.faq.tickets.howToBuy",
    respostaKey: "help.faq.tickets.howToBuy.answer",
  },
  {
    id: "2",
    categoriaKey: "help.categories.tickets",
    perguntaKey: "help.faq.tickets.paymentMethods",
    respostaKey: "help.faq.tickets.paymentMethods.answer",
  },
  {
    id: "3",
    categoriaKey: "help.categories.tickets",
    perguntaKey: "help.faq.tickets.multipleTickets",
    respostaKey: "help.faq.tickets.multipleTickets.answer",
  },
  {
    id: "4",
    categoriaKey: "help.categories.tickets",
    perguntaKey: "help.faq.tickets.howToReceive",
    respostaKey: "help.faq.tickets.howToReceive.answer",
  },
  {
    id: "5",
    categoriaKey: "help.categories.payment",
    perguntaKey: "help.faq.payment.timeToPay",
    respostaKey: "help.faq.payment.timeToPay.answer",
  },
  {
    id: "6",
    categoriaKey: "help.categories.payment",
    perguntaKey: "help.faq.payment.notConfirmed",
    respostaKey: "help.faq.payment.notConfirmed.answer",
  },
  {
    id: "7",
    categoriaKey: "help.categories.payment",
    perguntaKey: "help.faq.payment.cancel",
    respostaKey: "help.faq.payment.cancel.answer",
  },
  {
    id: "8",
    categoriaKey: "help.categories.account",
    perguntaKey: "help.faq.account.needAccount",
    respostaKey: "help.faq.account.needAccount.answer",
  },
  {
    id: "9",
    categoriaKey: "help.categories.account",
    perguntaKey: "help.faq.account.accessTickets",
    respostaKey: "help.faq.account.accessTickets.answer",
  },
  {
    id: "10",
    categoriaKey: "help.categories.account",
    perguntaKey: "help.faq.account.updateData",
    respostaKey: "help.faq.account.updateData.answer",
  },
  {
    id: "11",
    categoriaKey: "help.categories.events",
    perguntaKey: "help.faq.events.whereToSee",
    respostaKey: "help.faq.events.whereToSee.answer",
  },
  {
    id: "12",
    categoriaKey: "help.categories.events",
    perguntaKey: "help.faq.events.soldOut",
    respostaKey: "help.faq.events.soldOut.answer",
  },
  {
    id: "13",
    categoriaKey: "help.categories.security",
    perguntaKey: "help.faq.security.dataSafe",
    respostaKey: "help.faq.security.dataSafe.answer",
  },
  {
    id: "14",
    categoriaKey: "help.categories.security",
    perguntaKey: "help.faq.security.lostCode",
    respostaKey: "help.faq.security.lostCode.answer",
  },
];

const categoriaKeys = [
  "help.categories.all",
  "help.categories.tickets",
  "help.categories.payment",
  "help.categories.account",
  "help.categories.events",
  "help.categories.security",
];

export default function AjudaPage() {
  const { t } = useI18n();
  const [busca, setBusca] = useState("");
  const [categoriaSelecionada, setCategoriaSelecionada] = useState(
    "help.categories.all"
  );
  const [faqsAbertos, setFaqsAbertos] = useState<Set<string>>(new Set());

  const toggleFaq = (id: string) => {
    const novosAbertos = new Set(faqsAbertos);
    if (novosAbertos.has(id)) {
      novosAbertos.delete(id);
    } else {
      novosAbertos.add(id);
    }
    setFaqsAbertos(novosAbertos);
  };

  const faqsComTraducao = useMemo(() => {
    return faqs.map((faq) => ({
      ...faq,
      pergunta: t(faq.perguntaKey),
      resposta: t(faq.respostaKey),
      categoria: t(faq.categoriaKey),
    }));
  }, [t]);

  const faqsFiltrados = faqsComTraducao.filter((faq) => {
    const matchBusca =
      busca === "" ||
      faq.pergunta.toLowerCase().includes(busca.toLowerCase()) ||
      faq.resposta.toLowerCase().includes(busca.toLowerCase());
    const matchCategoria =
      categoriaSelecionada === "help.categories.all" ||
      faq.categoriaKey === categoriaSelecionada;
    return matchBusca && matchCategoria;
  });

  const faqsPorCategoria = categoriaKeys
    .filter((key) => key !== "help.categories.all")
    .map((categoriaKey) => ({
      categoriaKey,
      categoria: t(categoriaKey),
      faqs: faqsFiltrados.filter((faq) => faq.categoriaKey === categoriaKey),
    }))
    .filter((grupo) => grupo.faqs.length > 0);

  return (
    <main className="flex flex-col flex-1 bg-gradient-to-b from-purple-50 to-pink-50 dark:from-gray-900 dark:to-gray-800">
      <Navbar />
      <div className="flex-1 container mx-auto px-4 py-24 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-sky-500 to-pink-500 rounded-full mb-4">
            <HelpCircle className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            {t("help.title")}
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            {t("help.subtitle")}
          </p>
        </div>

        {/* Busca */}
        <Card className="mb-8 dark:bg-gray-800 dark:border-gray-700">
          <CardContent className="pt-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="search"
                placeholder={t("help.search.placeholder")}
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                className="pl-10 dark:bg-gray-900 dark:border-gray-700"
              />
            </div>
          </CardContent>
        </Card>

        {/* Filtros por categoria */}
        <div className="flex flex-wrap gap-2 mb-8">
          {categoriaKeys.map((categoriaKey) => (
            <Button
              key={categoriaKey}
              variant={
                categoriaSelecionada === categoriaKey ? "default" : "outline"
              }
              onClick={() => setCategoriaSelecionada(categoriaKey)}
              className={
                categoriaSelecionada === categoriaKey
                  ? "bg-gradient-to-r from-sky-500 to-pink-500 hover:from-sky-600 hover:to-pink-600"
                  : "dark:border-gray-700 dark:text-gray-300"
              }
            >
              {t(categoriaKey)}
            </Button>
          ))}
        </div>

        {/* FAQ */}
        {faqsFiltrados.length > 0 ? (
          <div className="space-y-6 mb-12">
            {faqsPorCategoria.map((grupo) => (
              <div key={grupo.categoriaKey}>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  {grupo.categoria}
                </h2>
                <div className="space-y-3">
                  {grupo.faqs.map((faq) => {
                    const estaAberto = faqsAbertos.has(faq.id);
                    return (
                      <Card
                        key={faq.id}
                        className="hover:shadow-md transition-shadow dark:bg-gray-800 dark:border-gray-700"
                      >
                        <CardHeader
                          className="cursor-pointer"
                          onClick={() => toggleFaq(faq.id)}
                        >
                          <div className="flex items-start justify-between gap-4">
                            <CardTitle className="text-lg flex-1 dark:text-white">
                              {faq.pergunta}
                            </CardTitle>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="flex-shrink-0"
                            >
                              {estaAberto ? (
                                <ChevronUp className="w-5 h-5" />
                              ) : (
                                <ChevronDown className="w-5 h-5" />
                              )}
                            </Button>
                          </div>
                        </CardHeader>
                        {estaAberto && (
                          <CardContent>
                            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                              {faq.resposta}
                            </p>
                          </CardContent>
                        )}
                      </Card>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <Card className="mb-12 dark:bg-gray-800 dark:border-gray-700">
            <CardContent className="pt-6 text-center py-12">
              <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-300">
                {t("help.noResults")}
              </p>
            </CardContent>
          </Card>
        )}

        {/* Guias Rápidos */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            {t("help.guides.title")}
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link href="/ingressos">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full dark:bg-gray-800 dark:border-gray-700">
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center text-center">
                    <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-lg mb-3">
                      <Ticket className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                    </div>
                    <h3 className="font-semibold mb-1 dark:text-white">
                      {t("help.guides.myTickets.title")}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {t("help.guides.myTickets.desc")}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link href="/perfil">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full dark:bg-gray-800 dark:border-gray-700">
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center text-center">
                    <div className="p-3 bg-sky-100 dark:bg-sky-900 rounded-lg mb-3">
                      <User className="w-6 h-6 text-sky-600 dark:text-sky-400" />
                    </div>
                    <h3 className="font-semibold mb-1 dark:text-white">
                      {t("help.guides.myProfile.title")}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {t("help.guides.myProfile.desc")}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link href="/configuracoes">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full dark:bg-gray-800 dark:border-gray-700">
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center text-center">
                    <div className="p-3 bg-pink-100 dark:bg-pink-900 rounded-lg mb-3">
                      <Settings className="w-6 h-6 text-pink-600 dark:text-pink-400" />
                    </div>
                    <h3 className="font-semibold mb-1 dark:text-white">
                      {t("help.guides.settings.title")}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {t("help.guides.settings.desc")}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link href="/eventos">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full dark:bg-gray-800 dark:border-gray-700">
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center text-center">
                    <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg mb-3">
                      <FileText className="w-6 h-6 text-green-600 dark:text-green-400" />
                    </div>
                    <h3 className="font-semibold mb-1 dark:text-white">
                      {t("help.guides.viewEvents.title")}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {t("help.guides.viewEvents.desc")}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>

        {/* Contato */}
        <Card className="bg-gradient-to-r from-sky-50 to-pink-50 dark:from-gray-800 dark:to-gray-800 border-2 border-sky-200 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 dark:text-white">
              <MessageCircle className="w-5 h-5" />
              {t("help.contact.title")}
            </CardTitle>
            <CardDescription className="dark:text-gray-300">
              {t("help.contact.subtitle")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-white dark:bg-gray-900 rounded-lg">
                  <Mail className="w-5 h-5 text-sky-600 dark:text-sky-400" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1 dark:text-white">
                    {t("help.contact.email")}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    blue.hour5@gmail.com
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {t("help.contact.emailResponse")}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 bg-white dark:bg-gray-900 rounded-lg">
                  <Phone className="w-5 h-5 text-pink-600 dark:text-pink-400" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1 dark:text-white">
                    {t("help.contact.phone")}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    +55 (92) 99244-0502
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {t("help.contact.phoneHours")}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 bg-white dark:bg-gray-900 rounded-lg">
                  <Clock className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1 dark:text-white">
                    {t("help.contact.hours")}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {t("help.contact.hoursDesc")}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {t("help.contact.hoursTime")}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 p-4 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    <strong>{t("help.contact.tip")}</strong>{" "}
                    {t("help.contact.tipText")}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Informações Importantes */}
        <div className="mt-12 grid md:grid-cols-2 gap-6">
          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 dark:text-white">
                <Shield className="w-5 h-5" />
                {t("help.privacy.title")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                {t("help.privacy.desc")}
              </p>
              <Button
                variant="outline"
                className="w-full dark:border-gray-700 dark:text-gray-300"
              >
                {t("help.privacy.button")}
              </Button>
            </CardContent>
          </Card>

          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 dark:text-white">
                <CheckCircle2 className="w-5 h-5" />
                {t("help.terms.title")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                {t("help.terms.desc")}
              </p>
              <Button
                variant="outline"
                className="w-full dark:border-gray-700 dark:text-gray-300"
              >
                {t("help.terms.button")}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer />
    </main>
  );
}
