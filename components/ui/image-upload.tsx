"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, X, Image as ImageIcon, Loader2 } from "lucide-react";
import Image from "next/image";
import { useToast } from "@/components/ui/toaster";

interface ImageUploadProps {
  value?: string;
  onChange: (url: string) => void;
  label?: string;
  maxSizeMB?: number;
  maxWidth?: number;
  maxHeight?: number;
  className?: string;
}

export function ImageUpload({
  value,
  onChange,
  label = "Imagem do Evento",
  maxSizeMB = 5,
  maxWidth = 1920,
  maxHeight = 1080,
  className,
}: ImageUploadProps) {
  const { success, error: showError } = useToast();
  const [preview, setPreview] = useState<string | null>(value || null);
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Atualizar preview quando value mudar (modo de edição)
  useEffect(() => {
    if (value) {
      setPreview(value);
    } else if (!value && preview && preview.startsWith("blob:")) {
      // Se value foi removido e preview é um blob local, limpar
      setPreview(null);
    }
  }, [value]);

  const ALLOWED_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
  const MAX_SIZE = maxSizeMB * 1024 * 1024;

  const validateFile = (file: File): string | null => {
    // Validar tipo
    if (!ALLOWED_TYPES.includes(file.type)) {
      return `Tipo de arquivo não permitido. Use JPEG, PNG ou WebP.`;
    }

    // Validar tamanho
    if (file.size > MAX_SIZE) {
      return `Arquivo muito grande. Máximo: ${maxSizeMB}MB.`;
    }

    return null;
  };

  const resizeImage = (
    file: File,
    maxWidth: number,
    maxHeight: number
  ): Promise<File> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new window.Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement("canvas");
          let width = img.width;
          let height = img.height;

          // Calcular novas dimensões mantendo proporção
          if (width > maxWidth || height > maxHeight) {
            const ratio = Math.min(maxWidth / width, maxHeight / height);
            width = width * ratio;
            height = height * ratio;
          }

          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext("2d");
          if (!ctx) {
            reject(new Error("Não foi possível criar contexto do canvas"));
            return;
          }

          ctx.drawImage(img, 0, 0, width, height);

          canvas.toBlob(
            (blob) => {
              if (!blob) {
                reject(new Error("Erro ao redimensionar imagem"));
                return;
              }
              const resizedFile = new File([blob], file.name, {
                type: file.type,
                lastModified: Date.now(),
              });
              resolve(resizedFile);
            },
            file.type,
            0.9 // Qualidade
          );
        };
        img.onerror = () => reject(new Error("Erro ao carregar imagem"));
      };
      reader.onerror = () => reject(new Error("Erro ao ler arquivo"));
    });
  };

  const handleFile = useCallback(
    async (file: File) => {
      // Validar arquivo
      const validationError = validateFile(file);
      if (validationError) {
        showError("Erro de validação", validationError);
        return;
      }

      // Criar preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);

      // Redimensionar se necessário
      setUploading(true);
      try {
        let fileToUpload = file;

        // Verificar se precisa redimensionar
        const img = new window.Image();
        const objectUrl = URL.createObjectURL(file);
        img.src = objectUrl;
        await new Promise((resolve, reject) => {
          img.onload = () => {
            if (img.width > maxWidth || img.height > maxHeight) {
              resizeImage(file, maxWidth, maxHeight)
                .then((resized) => {
                  fileToUpload = resized;
                  URL.revokeObjectURL(objectUrl);
                  resolve(null);
                })
                .catch(reject);
            } else {
              URL.revokeObjectURL(objectUrl);
              resolve(null);
            }
          };
          img.onerror = reject;
        });

        // Fazer upload
        const formData = new FormData();
        formData.append("file", fileToUpload);

        const response = await fetch("/api/upload/image", {
          method: "POST",
          body: formData,
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Erro ao fazer upload");
        }

        onChange(data.url);
        success("Upload realizado", "Imagem enviada com sucesso!");
      } catch (err: any) {
        console.error("Erro ao fazer upload:", err);
        showError("Erro ao fazer upload", err.message || "Tente novamente");
        setPreview(null);
      } finally {
        setUploading(false);
      }
    },
    [onChange, maxWidth, maxHeight, showError, success]
  );

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);

      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        handleFile(e.dataTransfer.files[0]);
      }
    },
    [handleFile]
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      e.preventDefault();
      if (e.target.files && e.target.files[0]) {
        handleFile(e.target.files[0]);
      }
    },
    [handleFile]
  );

  const handleRemove = () => {
    setPreview(null);
    onChange("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <Label>{label}</Label>
      <div
        className={`relative border-2 border-dashed rounded-lg transition-colors ${
          dragActive
            ? "border-purple-500 bg-purple-50 dark:bg-purple-900/20"
            : "border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50"
        } ${preview ? "p-2" : "p-8"}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        {preview ? (
          <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
            <Image
              src={preview}
              alt="Preview"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            <div className="absolute inset-0 bg-black/0 hover:bg-black/20 transition-colors flex items-center justify-center">
              <div className="opacity-0 hover:opacity-100 transition-opacity flex gap-2">
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="bg-white/90 hover:bg-white"
                >
                  {uploading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Upload className="w-4 h-4 mr-2" />
                  )}
                  Trocar
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={handleRemove}
                  disabled={uploading}
                  className="bg-white/90 hover:bg-white text-red-600 hover:text-red-700"
                >
                  <X className="w-4 h-4 mr-2" />
                  Remover
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center text-center">
            <div className="mb-4 p-4 bg-purple-100 dark:bg-purple-900/30 rounded-full">
              {uploading ? (
                <Loader2 className="w-8 h-8 text-purple-600 dark:text-purple-400 animate-spin" />
              ) : (
                <ImageIcon className="w-8 h-8 text-purple-600 dark:text-purple-400" />
              )}
            </div>
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {uploading ? "Enviando imagem..." : "Arraste uma imagem aqui"}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
              ou clique para selecionar
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500">
              JPEG, PNG ou WebP (máx. {maxSizeMB}MB)
            </p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="mt-4 dark:border-gray-700 dark:text-gray-300"
            >
              <Upload className="w-4 h-4 mr-2" />
              Selecionar Imagem
            </Button>
          </div>
        )}
        <Input
          ref={fileInputRef}
          type="file"
          accept={ALLOWED_TYPES.join(",")}
          onChange={handleChange}
          className="hidden"
          disabled={uploading}
        />
      </div>
      {value && !preview && (
        <p className="text-xs text-gray-500 dark:text-gray-400">
          URL atual: {value}
        </p>
      )}
    </div>
  );
}
