"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Copy, Check, Receipt, Download } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface InstrucoesBoletoProps {
  codigoBarras: string;
  valor: number;
  vencimento: Date;
  codigoVenda: string;
}

export function InstrucoesBoleto({
  codigoBarras,
  valor,
  vencimento,
  codigoVenda,
}: InstrucoesBoletoProps) {
  const [copiado, setCopiado] = useState(false);

  const copiarCodigo = () => {
    navigator.clipboard.writeText(codigoBarras);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2000);
  };

  const formatarVencimento = (data: Date) => {
    return new Date(data).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  return (
    <div className="space-y-4">
      <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Receipt className="h-5 w-5 text-orange-600 mt-0.5" />
          <div className="flex-1">
            <h4 className="font-semibold text-orange-900 mb-2">
              Pagamento via Boleto Bancário
            </h4>
            <p className="text-sm text-orange-800">
              Pague o boleto até a data de vencimento. A confirmação pode levar
              até 2 dias úteis após o pagamento.
            </p>
          </div>
        </div>
      </div>

      {/* Código de Barras */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">
          Código de Barras
        </label>
        <div className="flex gap-2">
          <div className="flex-1 p-3 bg-white border-2 border-gray-300 rounded-md font-mono text-sm tracking-wider text-center">
            {codigoBarras.match(/.{1,5}/g)?.join(" ")}
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

      {/* Informações do Boleto */}
      <Card>
        <CardContent className="pt-6 space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Valor:</span>
            <span className="text-xl font-bold text-gray-900">
              R$ {valor.toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Vencimento:</span>
            <span className="font-semibold text-gray-900">
              {formatarVencimento(vencimento)}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Código da Compra:</span>
            <span className="font-mono font-semibold text-sm">
              {codigoVenda}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Botão de Download */}
      <Button className="w-full" variant="outline">
        <Download className="mr-2 h-4 w-4" />
        Baixar Boleto (PDF)
      </Button>

      {/* Instruções */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-2 text-sm">
        <p className="font-semibold text-blue-900">Como pagar:</p>
        <ol className="list-decimal list-inside space-y-1 text-blue-800">
          <li>Copie o código de barras ou baixe o boleto</li>
          <li>Pague em qualquer banco, lotérica ou internet banking</li>
          <li>Aguarde até 2 dias úteis para confirmação</li>
          <li>Você receberá um email quando o pagamento for confirmado</li>
        </ol>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
        <p className="text-xs text-yellow-800">
          <strong>Atenção:</strong> O boleto vence em{" "}
          {formatarVencimento(vencimento)}. Após o vencimento, sua compra será
          cancelada automaticamente.
        </p>
      </div>
    </div>
  );
}
