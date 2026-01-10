"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  HelpCircle,
  Book,
  MessageCircle,
  FileText,
  Calendar,
  Ticket,
  DollarSign,
  Settings,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { useState } from "react";

const faqItems = [
  {
    category: "Eventos",
    icon: Calendar,
    questions: [
      {
        question: "Como criar um novo evento?",
        answer:
          "Acesse a seção 'Eventos' no menu lateral e clique em 'Novo Evento'. Preencha todas as informações obrigatórias (nome, data, local, cidade) e adicione pelo menos um tipo de ingresso. Você pode adicionar múltiplos tipos de ingressos clicando em 'Adicionar Ingresso'.",
      },
      {
        question: "Posso editar um evento após criá-lo?",
        answer:
          "Sim, você pode editar eventos. Clique no botão 'Editar' no card do evento. Note que algumas alterações podem afetar ingressos já vendidos.",
      },
      {
        question: "Como desativar um evento?",
        answer:
          "Atualmente, você pode editar o evento e alterar seu status. Eventos desativados não aparecerão para compra no site público.",
      },
    ],
  },
  {
    category: "Ingressos",
    icon: Ticket,
    questions: [
      {
        question: "Como criar tipos de ingressos?",
        answer:
          "Você pode criar ingressos ao criar um evento ou criar ingressos separadamente na seção 'Ingressos'. Defina o tipo (ex: Pista, VIP), preço, quantidade disponível e opcionalmente descreva o kit incluído.",
      },
      {
        question: "O que é o campo 'Kit'?",
        answer:
          "O campo 'Kit' permite descrever detalhadamente o que está incluído no ingresso, como itens físicos, quantidades e observações. Isso ajuda os clientes a entenderem o que receberão.",
      },
      {
        question: "Posso alterar a quantidade de ingressos após vendas?",
        answer:
          "Sim, você pode editar a quantidade total de ingressos. O sistema mostra quantos já foram vendidos para ajudar no controle.",
      },
      {
        question: "Como excluir um ingresso?",
        answer:
          "Você pode excluir ingressos que não tenham vendas. Ingressos com vendas não podem ser excluídos para manter a integridade dos dados.",
      },
    ],
  },
  {
    category: "Vendas",
    icon: DollarSign,
    questions: [
      {
        question: "Como visualizar todas as vendas?",
        answer:
          "Acesse a seção 'Vendas' no menu lateral. Você verá uma lista completa de todas as vendas com filtros por status, forma de pagamento e evento.",
      },
      {
        question: "Como filtrar vendas?",
        answer:
          "Use os filtros na parte superior da página de vendas para filtrar por status de pagamento, forma de pagamento, evento específico ou código de venda.",
      },
      {
        question: "O que significam os diferentes status de venda?",
        answer:
          "Os status incluem: Pendente (aguardando pagamento), Confirmada (pagamento confirmado), Cancelada (venda cancelada). Você pode filtrar por esses status.",
      },
      {
        question: "Como ver estatísticas de vendas?",
        answer:
          "Na página de vendas, você verá cards com estatísticas no topo mostrando total de vendas, vendas confirmadas, receita total e receita confirmada.",
      },
    ],
  },
  {
    category: "Configurações",
    icon: Settings,
    questions: [
      {
        question: "Como alterar minha senha?",
        answer:
          "Acesse 'Configurações' > 'Segurança' e preencha os campos para alterar sua senha. Você precisará informar sua senha atual e a nova senha.",
      },
      {
        question: "Como alterar o tema do painel?",
        answer:
          "Vá em 'Configurações' > 'Preferências' e escolha entre tema Claro, Escuro ou seguir o sistema operacional.",
      },
      {
        question: "Onde vejo informações do sistema?",
        answer:
          "Em 'Configurações' > 'Sistema' você encontra informações sobre versão, ambiente, banco de dados e framework utilizado.",
      },
    ],
  },
];

export default function AdminAjudaPage() {
  const [openCategory, setOpenCategory] = useState<string | null>(null);
  const [openQuestion, setOpenQuestion] = useState<string | null>(null);

  const toggleCategory = (category: string) => {
    setOpenCategory(openCategory === category ? null : category);
    setOpenQuestion(null);
  };

  const toggleQuestion = (questionId: string) => {
    setOpenQuestion(openQuestion === questionId ? null : questionId);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
          <HelpCircle className="h-8 w-8 text-sky-500" />
          Central de Ajuda - Administrador
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
          Encontre respostas para suas dúvidas sobre o uso do painel
          administrativo
        </p>
      </div>

      {/* Guias Rápidos */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Book className="h-5 w-5" />
            Guias Rápidos
          </CardTitle>
          <CardDescription>
            Aprenda a usar as principais funcionalidades do sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
              <Calendar className="h-6 w-6 text-sky-500 mb-2" />
              <h3 className="font-medium text-gray-900 dark:text-white mb-1">
                Criar Evento
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Passo a passo para criar e configurar eventos
              </p>
            </div>
            <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
              <Ticket className="h-6 w-6 text-pink-500 mb-2" />
              <h3 className="font-medium text-gray-900 dark:text-white mb-1">
                Gerenciar Ingressos
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Como criar e configurar tipos de ingressos
              </p>
            </div>
            <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
              <DollarSign className="h-6 w-6 text-green-500 mb-2" />
              <h3 className="font-medium text-gray-900 dark:text-white mb-1">
                Acompanhar Vendas
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Visualizar e filtrar vendas realizadas
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* FAQ por Categoria */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Perguntas Frequentes
        </h2>
        {faqItems.map((category) => {
          const Icon = category.icon;
          const isOpen = openCategory === category.category;

          return (
            <Card key={category.category}>
              <CardHeader>
                <button
                  onClick={() => toggleCategory(category.category)}
                  className="flex items-center justify-between w-full text-left"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-sky-100 dark:bg-sky-900/20 rounded-lg">
                      <Icon className="h-5 w-5 text-sky-600 dark:text-sky-400" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">
                        {category.category}
                      </CardTitle>
                      <CardDescription>
                        {category.questions.length} perguntas
                      </CardDescription>
                    </div>
                  </div>
                  {isOpen ? (
                    <ChevronUp className="h-5 w-5 text-gray-400" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </CardHeader>
              {isOpen && (
                <CardContent className="space-y-3">
                  {category.questions.map((item, index) => {
                    const questionId = `${category.category}-${index}`;
                    const isQuestionOpen = openQuestion === questionId;

                    return (
                      <div
                        key={index}
                        className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden"
                      >
                        <button
                          onClick={() => toggleQuestion(questionId)}
                          className="w-full p-4 flex items-center justify-between text-left hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                        >
                          <span className="font-medium text-gray-900 dark:text-white pr-4">
                            {item.question}
                          </span>
                          {isQuestionOpen ? (
                            <ChevronUp className="h-4 w-4 text-gray-400 flex-shrink-0" />
                          ) : (
                            <ChevronDown className="h-4 w-4 text-gray-400 flex-shrink-0" />
                          )}
                        </button>
                        {isQuestionOpen && (
                          <div className="p-4 pt-0 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
                            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                              {item.answer}
                            </p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </CardContent>
              )}
            </Card>
          );
        })}
      </div>

      {/* Contato */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5" />
            Precisa de mais ajuda?
          </CardTitle>
          <CardDescription>
            Entre em contato com nossa equipe de suporte
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
              <p className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                Email de Suporte
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                suporte@bluehour.com.br
              </p>
            </div>
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
              <p className="text-sm text-blue-900 dark:text-blue-100">
                <strong>Dica:</strong> Ao entrar em contato, mencione sua dúvida
                específica e, se possível, inclua capturas de tela para
                facilitar o atendimento.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
