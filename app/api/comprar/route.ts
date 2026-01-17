import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { compraIngressoSchema } from "@/lib/validations";
import { gerarCodigoPix, processarPagamentoCartao } from "@/lib/pagamento";
import { gerarPixReal } from "@/lib/pix-api";
import {
  criarNotificacaoCompra,
  criarNotificacaoPagamento,
  criarNotificacaoPagamentoPendente,
  criarNotificacaoAdminCompra,
} from "@/lib/notificacoes";
import {
  enviarEmailConfirmacaoCompra,
  enviarEmailInstrucoesPix,
  enviarEmailConfirmacaoPagamento,
} from "@/lib/email";
import { checkRateLimit, getClientIP } from "@/lib/rate-limit";
import { sanitizeString } from "@/lib/sanitize";
import { randomBytes } from "crypto";

// Forçar rota dinâmica para evitar coleta de dados estáticos durante o build
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    // Rate limiting: 5 compras por minuto por IP
    const clientIP = getClientIP(request);
    if (!checkRateLimit(clientIP, 5, 60000)) {
      return NextResponse.json(
        {
          error:
            "Muitas tentativas. Aguarde um momento antes de tentar novamente.",
        },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { eventoId, ingressoId, ...dadosCliente } = body;

    // Sanitizar IDs
    const eventoIdSanitizado = sanitizeString(eventoId || "");
    const ingressoIdSanitizado = sanitizeString(ingressoId || "");

    // Validar dados do cliente
    const dadosValidados = compraIngressoSchema.parse(dadosCliente);

    // Verificar se o evento e ingresso existem e estão ativos
    const evento = await prisma.evento.findUnique({
      where: { id: eventoIdSanitizado },
      include: {
        ingressos: {
          where: { id: ingressoIdSanitizado },
        },
      },
    });

    if (!evento || !evento.ativo) {
      return NextResponse.json(
        { error: "Evento não encontrado ou inativo" },
        { status: 404 }
      );
    }

    const ingresso = evento.ingressos[0];

    if (!ingresso || !ingresso.ativo) {
      return NextResponse.json(
        { error: "Ingresso não encontrado ou inativo" },
        { status: 404 }
      );
    }

    // Verificar disponibilidade
    const disponivel = ingresso.quantidade - ingresso.vendidos;
    if (dadosValidados.quantidade > disponivel) {
      return NextResponse.json(
        { error: `Apenas ${disponivel} ingresso(s) disponível(is)` },
        { status: 400 }
      );
    }

    if (dadosValidados.quantidade <= 0) {
      return NextResponse.json(
        { error: "Quantidade deve ser maior que zero" },
        { status: 400 }
      );
    }

    // Calcular valor total
    const valorTotal = ingresso.preco * dadosValidados.quantidade;

    // Gerar código único para a venda
    const codigo = `BLUE-${randomBytes(4).toString("hex").toUpperCase()}`;

    // Processar pagamento baseado na forma escolhida
    let statusPagamento = "pendente";
    let codigoPagamento: string | null = null;
    let qrCodePix: string | null = null;
    let dadosCartaoSalvos: string | null = null;

    if (
      dadosValidados.formaPagamento === "cartao_credito" ||
      dadosValidados.formaPagamento === "cartao_debito"
    ) {
      // Validar se todos os dados do cartão foram fornecidos
      if (
        !dadosValidados.numeroCartao ||
        !dadosValidados.nomeCartao ||
        !dadosValidados.validadeCartao ||
        !dadosValidados.cvvCartao
      ) {
        return NextResponse.json(
          { error: "Dados do cartão incompletos. Preencha todos os campos." },
          { status: 400 }
        );
      }

      // Processar pagamento com cartão
      try {
        const resultado = await processarPagamentoCartao(
          {
            numero: dadosValidados.numeroCartao,
            nome: dadosValidados.nomeCartao,
            validade: dadosValidados.validadeCartao,
            cvv: dadosValidados.cvvCartao,
          },
          valorTotal,
          dadosValidados.formaPagamento === "cartao_credito"
            ? "credito"
            : "debito"
        );

        if (resultado.sucesso && resultado.transacaoId) {
          statusPagamento = "confirmado";
          codigoPagamento = resultado.transacaoId;
          // Salvar apenas últimos 4 dígitos e bandeira (não salvar dados completos)
          const numeroLimpo = dadosValidados.numeroCartao.replace(/\D/g, "");
          dadosCartaoSalvos = JSON.stringify({
            ultimosDigitos: numeroLimpo.slice(-4),
            bandeira: "Cartão",
            tipo:
              dadosValidados.formaPagamento === "cartao_credito"
                ? "crédito"
                : "débito",
          });
        } else {
          return NextResponse.json(
            {
              error: resultado.erro || "Erro ao processar pagamento",
              details: "Verifique os dados do cartão e tente novamente.",
            },
            { status: 400 }
          );
        }
      } catch (error: any) {
        console.error("Erro ao processar pagamento com cartão:", error);
        return NextResponse.json(
          {
            error: "Erro ao processar pagamento com cartão",
            details:
              error.message ||
              "Tente novamente ou use outra forma de pagamento.",
          },
          { status: 500 }
        );
      }
    } else if (dadosValidados.formaPagamento === "pix") {
      // Gerar código PIX real usando API de pagamento
      try {
        const pixResponse = await gerarPixReal(
          valorTotal,
          codigo,
          dadosValidados.nome,
          dadosValidados.email,
          dadosValidados.cpf
        );
        codigoPagamento = pixResponse.codigoPix;
        // Armazenar QR Code base64 no campo qrCodePix junto com o código
        // Formato: "codigoPix|base64" para facilitar separação depois
        qrCodePix = pixResponse.qrCodeBase64
          ? `${pixResponse.codigoPix}|${pixResponse.qrCodeBase64}`
          : pixResponse.codigoPix;
        statusPagamento = "pendente";
      } catch (error) {
        console.error("Erro ao gerar PIX:", error);
        // Fallback para código PIX simulado se a API falhar
        codigoPagamento = gerarCodigoPix(valorTotal, codigo);
        qrCodePix = codigoPagamento;
        statusPagamento = "pendente";
      }
    }

    // Criar ou encontrar cliente (buscar por email ou CPF)
    let cliente = await prisma.cliente.findFirst({
      where: {
        OR: [
          { email: dadosValidados.email },
          ...(dadosValidados.cpf ? [{ cpf: dadosValidados.cpf }] : []),
        ],
      },
    });

    if (!cliente) {
      cliente = await prisma.cliente.create({
        data: {
          nome: dadosValidados.nome,
          email: dadosValidados.email,
          telefone: dadosValidados.telefone,
          cpf: dadosValidados.cpf,
        },
      });
    } else {
      // Atualizar dados do cliente se necessário
      cliente = await prisma.cliente.update({
        where: { id: cliente.id },
        data: {
          nome: dadosValidados.nome,
          telefone: dadosValidados.telefone,
          ...(dadosValidados.cpf && !cliente.cpf
            ? { cpf: dadosValidados.cpf }
            : {}),
        },
      });
    }

    // Criar venda
    const dadosVenda: any = {
      clienteId: cliente.id,
      ingressoId: ingresso.id,
      quantidade: dadosValidados.quantidade,
      valorTotal,
      formaPagamento: dadosValidados.formaPagamento || "pix",
      status: statusPagamento === "confirmado" ? "confirmada" : "pendente",
      codigo,
      statusPagamento,
      codigoPagamento: codigoPagamento || null,
      qrCodePix: qrCodePix || null,
      dadosCartao: dadosCartaoSalvos || null,
    };

    const venda = await prisma.venda.create({
      data: dadosVenda as any,
    });

    // Atualizar quantidade de ingressos vendidos apenas se pagamento confirmado
    if (statusPagamento === "confirmado") {
      await prisma.ingresso.update({
        where: { id: ingresso.id },
        data: {
          vendidos: {
            increment: dadosValidados.quantidade,
          },
        },
      });
    }

    // Criar notificações automaticamente
    try {
      if (statusPagamento === "confirmado") {
        // Pagamento confirmado (cartão) - criar notificação de compra e pagamento
        await criarNotificacaoCompra(cliente.id, codigo, evento.nome);
        await criarNotificacaoPagamento(
          cliente.id,
          codigo,
          dadosValidados.formaPagamento || "pix"
        );

        // Enviar email de confirmação de compra e pagamento
        try {
          console.log(
            `📧 Enviando emails de confirmação para ${cliente.email}...`
          );

          await enviarEmailConfirmacaoCompra(
            cliente.email,
            cliente.nome,
            codigo,
            evento.nome,
            ingresso.tipo,
            dadosValidados.quantidade,
            valorTotal,
            evento.data,
            evento.local,
            evento.cidade
          );
          console.log(
            `✅ Email de confirmação de compra enviado para ${cliente.email}`
          );

          await enviarEmailConfirmacaoPagamento(
            cliente.email,
            cliente.nome,
            codigo,
            evento.nome,
            ingresso.tipo,
            dadosValidados.quantidade,
            valorTotal,
            evento.data,
            evento.local,
            evento.cidade,
            dadosValidados.formaPagamento || "pix"
          );
          console.log(
            `✅ Email de confirmação de pagamento enviado para ${cliente.email}`
          );
        } catch (emailError: any) {
          console.error("❌ Erro ao enviar email:", emailError);
          console.error("   Detalhes:", emailError.message || emailError);
          // Não falhar a compra se houver erro ao enviar email
        }
      } else {
        // Pagamento pendente (PIX) - criar notificação de compra e pagamento pendente
        await criarNotificacaoCompra(cliente.id, codigo, evento.nome);
        await criarNotificacaoPagamentoPendente(
          cliente.id,
          codigo,
          dadosValidados.formaPagamento || "pix"
        );

        // Enviar email de confirmação de compra, instruções PIX e confirmação de pagamento pendente
        try {
          console.log(
            `📧 Enviando emails para compra pendente (PIX) para ${cliente.email}...`
          );

          await enviarEmailConfirmacaoCompra(
            cliente.email,
            cliente.nome,
            codigo,
            evento.nome,
            ingresso.tipo,
            dadosValidados.quantidade,
            valorTotal,
            evento.data,
            evento.local,
            evento.cidade
          );
          console.log(
            `✅ Email de confirmação de compra enviado para ${cliente.email}`
          );

          // Extrair QR Code base64 se existir
          const qrCodeBase64 = qrCodePix?.includes("|")
            ? qrCodePix.split("|")[1]
            : undefined;

          await enviarEmailInstrucoesPix(
            cliente.email,
            cliente.nome,
            codigo,
            evento.nome,
            valorTotal,
            codigoPagamento || "",
            qrCodeBase64
          );
          console.log(
            `✅ Email com instruções PIX enviado para ${cliente.email}`
          );

          // Enviar email de confirmação de pagamento (mesmo pendente)
          await enviarEmailConfirmacaoPagamento(
            cliente.email,
            cliente.nome,
            codigo,
            evento.nome,
            ingresso.tipo,
            dadosValidados.quantidade,
            valorTotal,
            evento.data,
            evento.local,
            evento.cidade,
            dadosValidados.formaPagamento || "pix"
          );
          console.log(
            `✅ Email de confirmação de pagamento (pendente) enviado para ${cliente.email}`
          );
        } catch (emailError: any) {
          console.error("❌ Erro ao enviar email:", emailError);
          console.error("   Detalhes:", emailError.message || emailError);
          // Não falhar a compra se houver erro ao enviar email
        }
      }

      // Criar notificação administrativa para todos os admins
      await criarNotificacaoAdminCompra(
        dadosValidados.nome,
        ingresso.tipo,
        evento.nome,
        dadosValidados.quantidade,
        valorTotal,
        codigo,
        ingresso.kit
      );
    } catch (notificacaoError) {
      // Não falhar a compra se houver erro ao criar notificação
      console.error("Erro ao criar notificação:", notificacaoError);
    }

    return NextResponse.json({
      success: true,
      venda: {
        id: venda.id,
        codigo: venda.codigo,
        valorTotal: venda.valorTotal,
        quantidade: venda.quantidade,
        evento: evento.nome,
        ingresso: ingresso.tipo,
        formaPagamento: dadosValidados.formaPagamento || "pix",
        statusPagamento: statusPagamento,
        codigoPagamento: codigoPagamento,
        qrCodePix: qrCodePix,
      },
    });
  } catch (error: any) {
    console.error("Erro ao processar compra:", error);

    if (error.name === "ZodError") {
      return NextResponse.json(
        { error: "Dados inválidos", details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Erro ao processar compra. Tente novamente." },
      { status: 500 }
    );
  }
}
