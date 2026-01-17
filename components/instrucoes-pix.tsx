"use client";

import { useState } from "react";
import {
  Smartphone,
  QrCode,
  Clock,
  AlertCircle,
  MessageCircle,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface InstrucoesPixProps {
  codigoPix: string;
  valor: number;
  codigoVenda: string;
  qrCodeBase64?: string;
}

export function InstrucoesPix({
  codigoPix,
  valor,
  codigoVenda,
  qrCodeBase64,
}: InstrucoesPixProps) {
  const [qrCodeErro, setQrCodeErro] = useState(false);
  const [qrCodePath, setQrCodePath] = useState("/uploads/eventos/qrcode-pix.png");

  // Número do WhatsApp para envio de comprovante
  const whatsappNumber = "+5592992440502"; // (92) 99244-05-02 sem formatação
  const whatsappMessage = encodeURIComponent(
    `Olá! Acabei de realizar o pagamento PIX para a compra ${codigoVenda} no valor de R$ ${valor.toFixed(2)}. Segue o comprovante:`
  );
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

  return (
    <div className="space-y-6">
      {/* Banner Informativo */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-5">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
            <Smartphone className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div className="flex-1">
            <h4 className="font-semibold text-blue-900 dark:text-blue-200 mb-2 text-lg">
              Pagamento via PIX
            </h4>
            <p className="text-sm text-blue-800 dark:text-blue-300 leading-relaxed">
              Escaneie o QR Code ou copie o código PIX para pagar. O pagamento é
              confirmado automaticamente em até 2 minutos após a transação.
            </p>
          </div>
        </div>
      </div>

      {/* QR Code */}
      <div className="flex justify-center">
        <Card className="p-6 border-2 border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-lg">
          <CardContent className="p-4">
            {qrCodeBase64 ? (
              <div className="w-64 h-64 flex items-center justify-center bg-white dark:bg-gray-900 rounded-lg">
                <img
                  src={`data:image/png;base64,${qrCodeBase64}`}
                  alt="QR Code PIX"
                  className="w-full h-full object-contain"
                />
              </div>
            ) : qrCodeErro ? (
              // Placeholder se o PNG não existir
              <div className="w-64 h-64 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center flex-col">
                <QrCode className="h-32 w-32 text-gray-400 dark:text-gray-500" />
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 text-center font-medium">
                  QR Code PIX
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                  Escaneie com seu app bancário
                </p>
              </div>
            ) : (
              // Tentar usar PNG estático da pasta public
              <div className="w-64 h-64 flex items-center justify-center bg-white dark:bg-gray-900 rounded-lg">
                <img
                  src={qrCodePath}
                  alt="QR Code PIX"
                  className="w-full h-full object-contain"
                  onError={() => {
                    // Tentar caminhos alternativos
                    if (qrCodePath === "/uploads/eventos/qrcode-pix.png") {
                      setQrCodePath("/qrcode-pix.png");
                    } else {
                      setQrCodeErro(true);
                    }
                  }}
                />
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Código PIX */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
          <QrCode className="w-4 h-4" />
          Código PIX (Copiar e Colar)
        </label>
        <div className="p-4 bg-gray-50 dark:bg-gray-900 border-2 border-gray-300 dark:border-gray-600 rounded-lg">
          <p className="font-mono text-sm break-all text-gray-900 dark:text-gray-100 select-all leading-relaxed">
            {codigoPix}
          </p>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Selecione o código acima e copie (Ctrl+C ou Cmd+C) para colar no app do seu banco
        </p>
      </div>

      {/* Informações */}
      <Card className="bg-gray-50 dark:bg-gray-900/50 border-gray-200 dark:border-gray-700">
        <CardContent className="pt-6">
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400 font-medium">
                Valor:
              </span>
              <span className="font-bold text-lg text-gray-900 dark:text-white">
                R$ {valor.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between items-center pt-3 border-t border-gray-200 dark:border-gray-700">
              <span className="text-gray-600 dark:text-gray-400 font-medium">
                Código da Compra:
              </span>
              <span className="font-mono font-semibold text-purple-600 dark:text-purple-400">
                {codigoVenda}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Instrução para Enviar Comprovante */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
            <MessageCircle className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-green-900 dark:text-green-200 mb-2">
              Envie seu comprovante
            </p>
            <p className="text-xs text-green-800 dark:text-green-300 leading-relaxed mb-3">
              Após realizar o pagamento PIX, envie o comprovante para o contato abaixo:
            </p>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800 text-white rounded-lg text-sm font-medium transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              Enviar comprovante via WhatsApp
            </a>
            <p className="text-xs text-green-700 dark:text-green-400 mt-2">
              Contato: <strong>(92) 99244-0502</strong>
            </p>
          </div>
        </div>
      </div>

      {/* Aviso Importante */}
      <div className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm font-semibold text-yellow-900 dark:text-yellow-200 mb-1">
              Importante
            </p>
            <p className="text-xs text-yellow-800 dark:text-yellow-300 leading-relaxed">
              Após realizar o pagamento, aguarde até 2 minutos para confirmação
              automática. Você receberá um email quando o pagamento for
              confirmado. Mantenha esta página aberta para acompanhar o status.
            </p>
          </div>
        </div>
      </div>

      {/* Timer de Expiração */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          <p className="text-xs text-blue-800 dark:text-blue-300">
            <strong>Tempo estimado:</strong> O pagamento expira em 30 minutos.
            Complete o pagamento o quanto antes.
          </p>
        </div>
      </div>
    </div>
  );
}
