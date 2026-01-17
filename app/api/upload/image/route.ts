import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

// Tipos de imagem permitidos
const ALLOWED_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
const MAX_SIZE = 5 * 1024 * 1024; // 5MB

// Dimensões máximas recomendadas
const MAX_WIDTH = 1920;
const MAX_HEIGHT = 1080;

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { error: "Nenhum arquivo enviado" },
        { status: 400 }
      );
    }

    // Validar tipo de arquivo
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        {
          error: "Tipo de arquivo não permitido",
          message: `Apenas imagens JPEG, PNG ou WebP são permitidas. Tipo recebido: ${file.type}`,
        },
        { status: 400 }
      );
    }

    // Validar tamanho
    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        {
          error: "Arquivo muito grande",
          message: `O arquivo deve ter no máximo ${
            MAX_SIZE / 1024 / 1024
          }MB. Tamanho recebido: ${(file.size / 1024 / 1024).toFixed(2)}MB`,
        },
        { status: 400 }
      );
    }

    // Criar nome único para o arquivo
    const timestamp = Date.now();
    const randomStr = Math.random().toString(36).substring(2, 15);
    const extension = file.name.split(".").pop() || "jpg";
    const filename = `evento-${timestamp}-${randomStr}.${extension}`;

    // Criar diretório se não existir
    const uploadDir = join(process.cwd(), "public", "uploads", "eventos");
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }

    // Converter File para Buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Salvar arquivo
    const filepath = join(uploadDir, filename);
    await writeFile(filepath, buffer);

    // Retornar URL pública
    const publicUrl = `/uploads/eventos/${filename}`;

    return NextResponse.json(
      {
        success: true,
        url: publicUrl,
        filename,
        size: file.size,
        type: file.type,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Erro ao fazer upload:", error);
    return NextResponse.json(
      {
        error: "Erro ao fazer upload da imagem",
        message: error?.message || "Erro desconhecido",
      },
      { status: 500 }
    );
  }
}
