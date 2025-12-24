import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { compraIngressoSchema } from "@/lib/validations";
import {
  gerarCodigoPix,
  gerarCodigoBarras,
  processarPagamentoCartao,
} from "@/lib/pagamento";
import {
  criarNotificacaoCompra,
  criarNotificacaoPagamento,
  criarNotificacaoPagamentoPendente,
} from "@/lib/notificacoes";
import { randomBytes } from "crypto";

// Forçar rota dinâmica para evitar coleta de dados estáticos durante o build
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { eventoId, ingressoId, ...dadosCliente } = body;

    // Validar dados do cliente
    const dadosValidados = compraIngressoSchema.parse(dadosCliente);

    // Verificar se o evento e ingresso existem e estão ativos
    const evento = await prisma.evento.findUnique({
      where: { id: eventoId },
      include: {
        ingressos: {
          where: { id: ingressoId },
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
    let vencimentoBoleto: Date | null = null;
    let dadosCartaoSalvos: string | null = null;

    if (
      dadosValidados.formaPagamento === "cartao_credito" ||
      dadosValidados.formaPagamento === "cartao_debito"
    ) {
      // Processar pagamento com cartão
      if (
        dadosValidados.numeroCartao &&
        dadosValidados.nomeCartao &&
        dadosValidados.validadeCartao &&
        dadosValidados.cvvCartao
      ) {
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
          dadosCartaoSalvos = JSON.stringify({
            ultimosDigitos: dadosValidados.numeroCartao.slice(-4),
            bandeira: "Cartão",
          });
        } else {
          return NextResponse.json(
            { error: resultado.erro || "Erro ao processar pagamento" },
            { status: 400 }
          );
        }
      }
    } else if (dadosValidados.formaPagamento === "pix") {
      // Gerar código PIX
      codigoPagamento = gerarCodigoPix(valorTotal, codigo);
      qrCodePix = codigoPagamento; // Em produção, gerar QR Code real
      statusPagamento = "pendente";
    } else if (dadosValidados.formaPagamento === "boleto") {
      // Gerar boleto
      const vencimento = new Date();
      vencimento.setDate(vencimento.getDate() + 3); // 3 dias para vencer
      codigoPagamento = gerarCodigoBarras(valorTotal, vencimento);
      vencimentoBoleto = vencimento;
      statusPagamento = "pendente";
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
      vencimentoBoleto: vencimentoBoleto || null,
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
      } else {
        // Pagamento pendente (PIX ou Boleto) - criar notificação de compra e pagamento pendente
        await criarNotificacaoCompra(cliente.id, codigo, evento.nome);
        await criarNotificacaoPagamentoPendente(
          cliente.id,
          codigo,
          dadosValidados.formaPagamento || "pix",
          vencimentoBoleto || undefined
        );
      }
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
        vencimentoBoleto: vencimentoBoleto,
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
