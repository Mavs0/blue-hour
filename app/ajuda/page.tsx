"use client";

import { useState } from "react";
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
  HelpCircle,
  Search,
  MessageCircle,
  Mail,
  Phone,
  Clock,
  ChevronDown,
  ChevronUp,
  Ticket,
  CreditCard,
  User,
  Settings,
  FileText,
  Shield,
  CheckCircle2,
  AlertCircle,
  Info,
} from "lucide-react";
import Link from "next/link";

interface FAQItem {
  id: string;
  pergunta: string;
  resposta: string;
  categoria: string;
}

const faqs: FAQItem[] = [
  {
    id: "1",
    categoria: "Compra de Ingressos",
    pergunta: "Como compro ingressos?",
    resposta:
      "Para comprar ingressos, navegue até a página do evento desejado, selecione o tipo de ingresso e a quantidade, preencha seus dados pessoais, escolha a forma de pagamento e finalize a compra. Você receberá um código de confirmação por email.",
  },
  {
    id: "2",
    categoria: "Compra de Ingressos",
    pergunta: "Quais formas de pagamento são aceitas?",
    resposta:
      "Aceitamos PIX, Cartão de Crédito, Cartão de Débito e Boleto Bancário. O pagamento via PIX é confirmado automaticamente em até 2 minutos. Para cartões, a confirmação é imediata. Boletos têm validade de 3 dias.",
  },
  {
    id: "3",
    categoria: "Compra de Ingressos",
    pergunta: "Posso comprar mais de um ingresso?",
    resposta:
      "Sim! Você pode comprar até 10 ingressos por transação. Basta selecionar a quantidade desejada no momento da compra.",
  },
  {
    id: "4",
    categoria: "Compra de Ingressos",
    pergunta: "Como recebo meu ingresso?",
    resposta:
      "Após a confirmação do pagamento, você receberá um email com o código da compra e o QR Code do ingresso. Você também pode acessar seus ingressos na seção 'Meus Ingressos' usando seu email ou CPF.",
  },
  {
    id: "5",
    categoria: "Pagamento",
    pergunta: "Quanto tempo tenho para pagar?",
    resposta:
      "Para PIX e Cartão, o pagamento deve ser realizado imediatamente. Para Boleto, você tem 3 dias corridos a partir da data de geração. Após esse período, o boleto expira e você precisará realizar uma nova compra.",
  },
  {
    id: "6",
    categoria: "Pagamento",
    pergunta: "Meu pagamento não foi confirmado, o que fazer?",
    resposta:
      "Pagamentos via PIX podem levar até 2 minutos para serem confirmados. Se após esse período o pagamento ainda estiver pendente, verifique se o pagamento foi realizado corretamente. Para cartões, entre em contato conosco se houver problemas. Para boletos, verifique se o pagamento foi realizado dentro do prazo de validade.",
  },
  {
    id: "7",
    categoria: "Pagamento",
    pergunta: "Posso cancelar uma compra?",
    resposta:
      "Cancelamentos podem ser solicitados através do nosso suporte. O reembolso seguirá nossa política de cancelamento, que varia conforme a proximidade da data do evento. Entre em contato conosco para mais informações.",
  },
  {
    id: "8",
    categoria: "Conta e Perfil",
    pergunta: "Preciso criar uma conta para comprar?",
    resposta:
      "Não é necessário criar uma conta. Você pode comprar ingressos informando seus dados pessoais. No entanto, ao fazer uma compra, seus dados são salvos e você pode acessar seus ingressos usando seu email ou CPF na seção 'Meus Ingressos'.",
  },
  {
    id: "9",
    categoria: "Conta e Perfil",
    pergunta: "Como acesso meus ingressos?",
    resposta:
      "Acesse a seção 'Meus Ingressos' no menu e informe seu email ou CPF usado na compra. Você verá todas as suas compras e poderá visualizar os detalhes, QR Codes e códigos de pagamento quando necessário.",
  },
  {
    id: "10",
    categoria: "Conta e Perfil",
    pergunta: "Como atualizo meus dados pessoais?",
    resposta:
      "Acesse a seção 'Meu Perfil' no menu, informe seu email ou CPF para buscar seu perfil, e então você poderá editar suas informações pessoais como nome, telefone e CPF.",
  },
  {
    id: "11",
    categoria: "Eventos",
    pergunta: "Onde posso ver os eventos disponíveis?",
    resposta:
      "Na página inicial você encontrará os eventos em destaque. Para ver todos os eventos disponíveis, acesse a seção 'Eventos' no menu principal ou use a barra de busca para encontrar eventos específicos.",
  },
  {
    id: "12",
    categoria: "Eventos",
    pergunta: "Os ingressos podem esgotar?",
    resposta:
      "Sim, cada tipo de ingresso tem uma quantidade limitada. Recomendamos realizar a compra assim que os ingressos forem disponibilizados para garantir sua participação no evento.",
  },
  {
    id: "13",
    categoria: "Segurança",
    pergunta: "Meus dados estão seguros?",
    resposta:
      "Sim! Utilizamos criptografia para proteger todas as informações pessoais e de pagamento. Nunca compartilhamos seus dados com terceiros sem sua autorização. Para mais informações, consulte nossa política de privacidade.",
  },
  {
    id: "14",
    categoria: "Segurança",
    pergunta: "O que fazer se perder meu código de compra?",
    resposta:
      "Não se preocupe! Você pode acessar seus ingressos a qualquer momento na seção 'Meus Ingressos' usando seu email ou CPF. Todos os seus ingressos e códigos estarão disponíveis lá.",
  },
];

const categorias = [
  "Todos",
  "Compra de Ingressos",
  "Pagamento",
  "Conta e Perfil",
  "Eventos",
  "Segurança",
];

export default function AjudaPage() {
  const [busca, setBusca] = useState("");
  const [categoriaSelecionada, setCategoriaSelecionada] = useState("Todos");
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

  const faqsFiltrados = faqs.filter((faq) => {
    const matchBusca =
      busca === "" ||
      faq.pergunta.toLowerCase().includes(busca.toLowerCase()) ||
      faq.resposta.toLowerCase().includes(busca.toLowerCase());
    const matchCategoria =
      categoriaSelecionada === "Todos" ||
      faq.categoria === categoriaSelecionada;
    return matchBusca && matchCategoria;
  });

  const faqsPorCategoria = categorias
    .filter((cat) => cat !== "Todos")
    .map((categoria) => ({
      categoria,
      faqs: faqsFiltrados.filter((faq) => faq.categoria === categoria),
    }))
    .filter((grupo) => grupo.faqs.length > 0);

  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-50 to-pink-50">
      <Navbar />
      <div className="container mx-auto px-4 py-24 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-sky-500 to-pink-500 rounded-full mb-4">
            <HelpCircle className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Central de Ajuda
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Encontre respostas para suas dúvidas ou entre em contato conosco
          </p>
        </div>

        {/* Busca */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="search"
                placeholder="Busque por palavras-chave..."
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Filtros por categoria */}
        <div className="flex flex-wrap gap-2 mb-8">
          {categorias.map((categoria) => (
            <Button
              key={categoria}
              variant={
                categoriaSelecionada === categoria ? "default" : "outline"
              }
              onClick={() => setCategoriaSelecionada(categoria)}
              className={
                categoriaSelecionada === categoria
                  ? "bg-gradient-to-r from-sky-500 to-pink-500 hover:from-sky-600 hover:to-pink-600"
                  : ""
              }
            >
              {categoria}
            </Button>
          ))}
        </div>

        {/* FAQ */}
        {faqsFiltrados.length > 0 ? (
          <div className="space-y-6 mb-12">
            {faqsPorCategoria.map((grupo) => (
              <div key={grupo.categoria}>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  {grupo.categoria}
                </h2>
                <div className="space-y-3">
                  {grupo.faqs.map((faq) => {
                    const estaAberto = faqsAbertos.has(faq.id);
                    return (
                      <Card
                        key={faq.id}
                        className="hover:shadow-md transition-shadow"
                      >
                        <CardHeader
                          className="cursor-pointer"
                          onClick={() => toggleFaq(faq.id)}
                        >
                          <div className="flex items-start justify-between gap-4">
                            <CardTitle className="text-lg flex-1">
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
                            <p className="text-gray-600 leading-relaxed">
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
          <Card className="mb-12">
            <CardContent className="pt-6 text-center py-12">
              <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">
                Nenhuma pergunta encontrada com os filtros selecionados.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Guias Rápidos */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Guias Rápidos
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link href="/ingressos">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center text-center">
                    <div className="p-3 bg-purple-100 rounded-lg mb-3">
                      <Ticket className="w-6 h-6 text-purple-600" />
                    </div>
                    <h3 className="font-semibold mb-1">Meus Ingressos</h3>
                    <p className="text-sm text-gray-600">
                      Acesse seus ingressos comprados
                    </p>
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link href="/perfil">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center text-center">
                    <div className="p-3 bg-sky-100 rounded-lg mb-3">
                      <User className="w-6 h-6 text-sky-600" />
                    </div>
                    <h3 className="font-semibold mb-1">Meu Perfil</h3>
                    <p className="text-sm text-gray-600">
                      Gerencie suas informações
                    </p>
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link href="/configuracoes">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center text-center">
                    <div className="p-3 bg-pink-100 rounded-lg mb-3">
                      <Settings className="w-6 h-6 text-pink-600" />
                    </div>
                    <h3 className="font-semibold mb-1">Configurações</h3>
                    <p className="text-sm text-gray-600">
                      Ajuste suas preferências
                    </p>
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link href="/eventos">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center text-center">
                    <div className="p-3 bg-green-100 rounded-lg mb-3">
                      <FileText className="w-6 h-6 text-green-600" />
                    </div>
                    <h3 className="font-semibold mb-1">Ver Eventos</h3>
                    <p className="text-sm text-gray-600">
                      Explore eventos disponíveis
                    </p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>

        {/* Contato */}
        <Card className="bg-gradient-to-r from-sky-50 to-pink-50 border-2 border-sky-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageCircle className="w-5 h-5" />
              Ainda precisa de ajuda?
            </CardTitle>
            <CardDescription>
              Entre em contato conosco através dos canais abaixo
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-white rounded-lg">
                  <Mail className="w-5 h-5 text-sky-600" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Email</h3>
                  <p className="text-sm text-gray-600">
                    suporte@bluehour.com.br
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Resposta em até 24h
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 bg-white rounded-lg">
                  <Phone className="w-5 h-5 text-pink-600" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Telefone</h3>
                  <p className="text-sm text-gray-600">(92) 99999-9999</p>
                  <p className="text-xs text-gray-500 mt-1">
                    Seg-Sex, 9h às 18h
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 bg-white rounded-lg">
                  <Clock className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Horário de Atendimento</h3>
                  <p className="text-sm text-gray-600">Segunda a Sexta</p>
                  <p className="text-xs text-gray-500 mt-1">
                    9h às 18h (horário de Manaus)
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 p-4 bg-white rounded-lg border border-gray-200">
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-700">
                    <strong>Dica:</strong> Antes de entrar em contato, verifique
                    se sua dúvida já está respondida na seção de perguntas
                    frequentes acima. Isso pode agilizar o atendimento!
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Informações Importantes */}
        <div className="mt-12 grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Política de Privacidade
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                Seus dados estão protegidos. Conheça nossa política de
                privacidade e termos de uso.
              </p>
              <Button variant="outline" className="w-full">
                Ver Política Completa
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5" />
                Termos de Uso
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                Leia nossos termos e condições antes de utilizar nossos
                serviços.
              </p>
              <Button variant="outline" className="w-full">
                Ver Termos Completos
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer />
    </main>
  );
}
