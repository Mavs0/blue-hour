"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Copy, Check, Smartphone, QrCode } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface InstrucoesPixProps {
  codigoPix: string;
  valor: number;
  codigoVenda: string;
}

export function InstrucoesPix({
  codigoPix,
  valor,
  codigoVenda,
}: InstrucoesPixProps) {
  const [copiado, setCopiado] = useState(false);

  const copiarCodigo = () => {
    navigator.clipboard.writeText(codigoPix);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2000);
  };

  return (
    <div className="space-y-4">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Smartphone className="h-5 w-5 text-blue-600 mt-0.5" />
          <div className="flex-1">
            <h4 className="font-semibold text-blue-900 mb-2">
              Pagamento via PIX
            </h4>
            <p className="text-sm text-blue-800">
              Escaneie o QR Code ou copie o código PIX para pagar. O pagamento é
              confirmado automaticamente em até 2 minutos.
            </p>
          </div>
        </div>
      </div>

      {/* QR Code Simulado */}
      <div className="flex justify-center">
        <Card className="p-4 border-2 border-dashed border-gray-300">
          <CardContent className="p-4">
            <div className="w-64 h-64 bg-gray-100 rounded-lg flex items-center justify-center flex-col">
              <QrCode className="h-32 w-32 text-gray-400" />
              <p className="text-xs text-gray-500 mt-2 text-center">
                QR Code PIX
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Escaneie com seu app bancário
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Código PIX */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">
          Código PIX (Copiar e Colar)
        </label>
        <div className="flex gap-2">
          <div className="flex-1 p-3 bg-gray-50 border border-gray-200 rounded-md font-mono text-xs break-all">
            {codigoPix}
          </div>
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={copiarCodigo}
            className="flex-shrink-0"
          >
            {copiado ? (
              <Check className="h-4 w-4 text-green-600" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </Button>
        </div>
        {copiado && <p className="text-xs text-green-600">Código copiado!</p>}
      </div>

      {/* Informações */}
      <div className="bg-gray-50 rounded-lg p-4 space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-600">Valor:</span>
          <span className="font-bold text-gray-900">R$ {valor.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Código da Compra:</span>
          <span className="font-mono font-semibold">{codigoVenda}</span>
        </div>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
        <p className="text-xs text-yellow-800">
          <strong>Importante:</strong> Após realizar o pagamento, aguarde até 2
          minutos para confirmação automática. Você receberá um email quando o
          pagamento for confirmado.
        </p>
      </div>
    </div>
  );
}
