"use client";

import { useState, useEffect } from "react";
import { Clock, AlertCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface ContadorRegressivoProps {
  dataExpiracao: Date;
  onExpirar?: () => void;
}

export function ContadorRegressivo({
  dataExpiracao,
  onExpirar,
}: ContadorRegressivoProps) {
  const [tempoRestante, setTempoRestante] = useState<{
    horas: number;
    minutos: number;
    segundos: number;
    expirado: boolean;
  }>({ horas: 0, minutos: 0, segundos: 0, expirado: false });

  useEffect(() => {
    const calcularTempoRestante = () => {
      const agora = new Date();
      const diferenca = dataExpiracao.getTime() - agora.getTime();

      if (diferenca <= 0) {
        setTempoRestante({ horas: 0, minutos: 0, segundos: 0, expirado: true });
        if (onExpirar) {
          onExpirar();
        }
        return;
      }

      const horas = Math.floor(diferenca / (1000 * 60 * 60));
      const minutos = Math.floor((diferenca % (1000 * 60 * 60)) / (1000 * 60));
      const segundos = Math.floor((diferenca % (1000 * 60)) / 1000);

      setTempoRestante({ horas, minutos, segundos, expirado: false });
    };

    // Calcular imediatamente
    calcularTempoRestante();

    // Atualizar a cada segundo
    const interval = setInterval(calcularTempoRestante, 1000);

    return () => clearInterval(interval);
  }, [dataExpiracao, onExpirar]);

  if (tempoRestante.expirado) {
    return (
      <Card className="bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800">
        <CardContent className="pt-6">
          <div className="flex items-center gap-3">
            <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 flex-shrink-0" />
            <div>
              <p className="text-sm font-semibold text-red-900 dark:text-red-200">
                Pagamento Expirado
              </p>
              <p className="text-xs text-red-800 dark:text-red-300">
                O prazo para pagamento expirou. Entre em contato para mais informações.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const tempoFormatado = `${tempoRestante.horas.toString().padStart(2, "0")}:${tempoRestante.minutos.toString().padStart(2, "0")}:${tempoRestante.segundos.toString().padStart(2, "0")}`;
  const tempoTotalMinutos = tempoRestante.horas * 60 + tempoRestante.minutos;
  const isUrgente = tempoTotalMinutos < 5; // Menos de 5 minutos
  const isAviso = tempoTotalMinutos < 15; // Menos de 15 minutos

  return (
    <Card
      className={`${
        isUrgente
          ? "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800"
          : isAviso
          ? "bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800"
          : "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800"
      }`}
    >
      <CardContent className="pt-6">
        <div className="flex items-center gap-3">
          <div
            className={`p-2 rounded-lg ${
              isUrgente
                ? "bg-red-100 dark:bg-red-900/30"
                : isAviso
                ? "bg-yellow-100 dark:bg-yellow-900/30"
                : "bg-blue-100 dark:bg-blue-900/30"
            }`}
          >
            <Clock
              className={`h-5 w-5 ${
                isUrgente
                  ? "text-red-600 dark:text-red-400"
                  : isAviso
                  ? "text-yellow-600 dark:text-yellow-400"
                  : "text-blue-600 dark:text-blue-400"
              }`}
            />
          </div>
          <div className="flex-1">
            <p
              className={`text-sm font-semibold ${
                isUrgente
                  ? "text-red-900 dark:text-red-200"
                  : isAviso
                  ? "text-yellow-900 dark:text-yellow-200"
                  : "text-blue-900 dark:text-blue-200"
              }`}
            >
              {isUrgente
                ? "⏰ Tempo Restante (Urgente!)"
                : isAviso
                ? "⏰ Tempo Restante"
                : "⏰ Tempo para Pagamento"}
            </p>
            <div className="flex items-baseline gap-2 mt-1">
              <span
                className={`text-2xl font-bold font-mono ${
                  isUrgente
                    ? "text-red-700 dark:text-red-300"
                    : isAviso
                    ? "text-yellow-700 dark:text-yellow-300"
                    : "text-blue-700 dark:text-blue-300"
                }`}
              >
                {tempoFormatado}
              </span>
              <span
                className={`text-xs ${
                  isUrgente
                    ? "text-red-800 dark:text-red-300"
                    : isAviso
                    ? "text-yellow-800 dark:text-yellow-300"
                    : "text-blue-800 dark:text-blue-300"
                }`}
              >
                {tempoRestante.horas > 0
                  ? `${tempoRestante.horas}h ${tempoRestante.minutos}m`
                  : `${tempoRestante.minutos}m ${tempoRestante.segundos}s`}
              </span>
            </div>
            {isUrgente && (
              <p className="text-xs text-red-800 dark:text-red-300 mt-1 font-medium">
                ⚠️ Complete o pagamento o quanto antes!
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

