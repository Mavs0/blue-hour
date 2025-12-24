import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const atualizarPerfilSchema = z.object({
  nome: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  telefone: z.string().optional(),
  cpf: z
    .string()
    .optional()
    .refine(
      (val) => !val || val.replace(/\D/g, "").length === 11,
      "CPF deve ter 11 dígitos"
    ),
});

// GET - Buscar perfil por email ou CPF
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const email = searchParams.get("email");
    const cpf = searchParams.get("cpf");

    if (!email && !cpf) {
      return NextResponse.json(
        { error: "Email ou CPF é obrigatório" },
        { status: 400 }
      );
    }

    const cliente = await prisma.cliente.findFirst({
      where: {
        OR: [
          ...(email ? [{ email }] : []),
          ...(cpf ? [{ cpf: cpf.replace(/\D/g, "") }] : []),
        ],
      },
      select: {
        id: true,
        nome: true,
        email: true,
        telefone: true,
        cpf: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            vendas: true,
          },
        },
      },
    });

    if (!cliente) {
      return NextResponse.json(
        { error: "Perfil não encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      cliente: {
        ...cliente,
        totalCompras: cliente._count.vendas,
      },
    });
  } catch (error) {
    console.error("Erro ao buscar perfil:", error);
    return NextResponse.json(
      { error: "Erro ao buscar perfil" },
      { status: 500 }
    );
  }
}

// PUT - Atualizar perfil
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, cpf: cpfBusca, ...dadosAtualizacao } = body;

    if (!email && !cpfBusca) {
      return NextResponse.json(
        { error: "Email ou CPF é obrigatório para identificar o perfil" },
        { status: 400 }
      );
    }

    // Validar dados
    const dadosValidados = atualizarPerfilSchema.parse(dadosAtualizacao);

    // Buscar cliente
    const clienteExistente = await prisma.cliente.findFirst({
      where: {
        OR: [
          ...(email ? [{ email }] : []),
          ...(cpfBusca ? [{ cpf: cpfBusca.replace(/\D/g, "") }] : []),
        ],
      },
    });

    if (!clienteExistente) {
      return NextResponse.json(
        { error: "Perfil não encontrado" },
        { status: 404 }
      );
    }

    // Preparar dados para atualização
    const dadosParaAtualizar: any = {
      nome: dadosValidados.nome,
      ...(dadosValidados.telefone && { telefone: dadosValidados.telefone }),
    };

    // Só atualizar CPF se não existir ou se for diferente
    if (dadosValidados.cpf) {
      const cpfLimpo = dadosValidados.cpf.replace(/\D/g, "");
      if (!clienteExistente.cpf || clienteExistente.cpf !== cpfLimpo) {
        // Verificar se o CPF já está em uso por outro cliente
        const cpfEmUso = await prisma.cliente.findFirst({
          where: {
            cpf: cpfLimpo,
            id: { not: clienteExistente.id },
          },
        });

        if (cpfEmUso) {
          return NextResponse.json(
            { error: "Este CPF já está cadastrado para outro cliente" },
            { status: 400 }
          );
        }

        dadosParaAtualizar.cpf = cpfLimpo;
      }
    }

    // Atualizar cliente
    const clienteAtualizado = await prisma.cliente.update({
      where: { id: clienteExistente.id },
      data: dadosParaAtualizar,
      select: {
        id: true,
        nome: true,
        email: true,
        telefone: true,
        cpf: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({
      message: "Perfil atualizado com sucesso",
      cliente: clienteAtualizado,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Dados inválidos", details: error.errors },
        { status: 400 }
      );
    }

    console.error("Erro ao atualizar perfil:", error);
    return NextResponse.json(
      { error: "Erro ao atualizar perfil" },
      { status: 500 }
    );
  }
}
