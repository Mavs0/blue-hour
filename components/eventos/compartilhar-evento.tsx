"use client";

import { Button } from "@/components/ui/button";
import {
  Share2,
  Copy,
  Check,
  MessageCircle,
} from "lucide-react";
import { useState } from "react";
import { useToast } from "@/components/ui/toaster";

interface CompartilharEventoProps {
  nome: string;
  url: string;
}

export function CompartilharEvento({ nome, url }: CompartilharEventoProps) {
  const [copiado, setCopiado] = useState(false);
  const { success, error } = useToast();
  const urlCompleta = typeof window !== "undefined" ? window.location.href : url;
  const textoCompartilhamento = `Confira este evento incrível: ${nome}`;

  const copiarLink = async () => {
    try {
      await navigator.clipboard.writeText(urlCompleta);
      setCopiado(true);
      success(
        "Link copiado!",
        "O link do evento foi copiado para a área de transferência."
      );
      setTimeout(() => setCopiado(false), 2000);
    } catch (err) {
      error(
        "Erro ao copiar",
        "Não foi possível copiar o link."
      );
    }
  };

  const compartilharWhatsApp = () => {
    const urlWhatsApp = `https://wa.me/?text=${encodeURIComponent(
      `${textoCompartilhamento} ${urlCompleta}`
    )}`;
    window.open(urlWhatsApp, "_blank");
  };

  const compartilharNativo = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: nome,
          text: textoCompartilhamento,
          url: urlCompleta,
        });
      } catch (error) {
        // Usuário cancelou ou erro
      }
    } else {
      copiarLink();
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Button
        onClick={compartilharNativo}
        variant="outline"
        size="sm"
        className="dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
      >
        <Share2 className="w-4 h-4 mr-2" />
        Compartilhar
      </Button>
      <Button
        onClick={copiarLink}
        variant="outline"
        size="sm"
        className="dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
      >
        {copiado ? (
          <>
            <Check className="w-4 h-4 mr-2" />
            Copiado!
          </>
        ) : (
          <>
            <Copy className="w-4 h-4 mr-2" />
            Copiar Link
          </>
        )}
      </Button>
      <Button
        onClick={compartilharWhatsApp}
        variant="outline"
        size="sm"
        className="dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
        title="Compartilhar no WhatsApp"
      >
        <MessageCircle className="w-4 h-4 mr-2 text-green-600 dark:text-green-400" />
        WhatsApp
      </Button>
    </div>
  );
}
