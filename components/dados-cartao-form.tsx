"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CreditCard, Lock, User, Calendar } from "lucide-react";
import { useState } from "react";
import { formatarValidadeCartao, validarCartao } from "@/lib/pagamento";

interface DadosCartaoFormProps {
  onDadosChange: (dados: {
    numero: string;
    nome: string;
    validade: string;
    cvv: string;
    parcelas?: number;
  }) => void;
  valorTotal: number;
  tipo: "credito" | "debito";
}

export function DadosCartaoForm({
  onDadosChange,
  valorTotal,
  tipo,
}: DadosCartaoFormProps) {
  const [numeroCartao, setNumeroCartao] = useState("");
  const [nomeCartao, setNomeCartao] = useState("");
  const [validadeCartao, setValidadeCartao] = useState("");
  const [cvvCartao, setCvvCartao] = useState("");
  const [parcelas, setParcelas] = useState(1);
  const [bandeira, setBandeira] = useState<string>("");

  const handleNumeroChange = (value: string) => {
    const limpo = value.replace(/\D/g, "");
    const formatado = limpo.replace(/(\d{4})(?=\d)/g, "$1 ").substring(0, 19);
    setNumeroCartao(formatado);

    if (limpo.length >= 13) {
      const validacao = validarCartao(limpo);
      setBandeira(validacao.bandeira || "");
    } else {
      setBandeira("");
    }

    atualizarDados({
      numero: limpo,
      nome: nomeCartao,
      validade: validadeCartao,
      cvv: cvvCartao,
      parcelas: tipo === "credito" ? parcelas : undefined,
    });
  };

  const handleValidadeChange = (value: string) => {
    const formatado = formatarValidadeCartao(value);
    setValidadeCartao(formatado);
    atualizarDados({
      numero: numeroCartao.replace(/\D/g, ""),
      nome: nomeCartao,
      validade: formatado,
      cvv: cvvCartao,
      parcelas: tipo === "credito" ? parcelas : undefined,
    });
  };

  const atualizarDados = (dados: {
    numero: string;
    nome: string;
    validade: string;
    cvv: string;
    parcelas?: number;
  }) => {
    // Garantir que todos os campos estão preenchidos antes de atualizar
    if (dados.numero && dados.nome && dados.validade && dados.cvv) {
      onDadosChange(dados);
    } else {
      // Atualizar mesmo se incompleto para permitir digitação progressiva
      onDadosChange(dados);
    }
  };

  const opcoesParcela = [];
  if (tipo === "credito") {
    for (let i = 1; i <= 12; i++) {
      const valorParcela = valorTotal / i;
      opcoesParcela.push({
        valor: i,
        label: `${i}x de R$ ${valorParcela.toFixed(2)}`,
      });
    }
  }

  return (
    <div className="space-y-4 p-6 bg-gradient-to-br from-gray-50 to-purple-50 dark:from-gray-800 dark:to-purple-900/20 rounded-lg border border-gray-200 dark:border-gray-700">
      <div className="flex items-center gap-2 mb-4">
        <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
          <CreditCard className="h-5 w-5 text-purple-600 dark:text-purple-400" />
        </div>
        <h3 className="font-semibold text-gray-900 dark:text-white">
          Dados do Cartão {tipo === "credito" ? "de Crédito" : "de Débito"}
        </h3>
        {bandeira && (
          <span className="ml-auto text-xs bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 px-3 py-1 rounded-full font-medium">
            {bandeira}
          </span>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="numeroCartao" className="dark:text-gray-300">
          Número do Cartão *
        </Label>
        <div className="relative">
          <CreditCard className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
          <Input
            id="numeroCartao"
            type="text"
            placeholder="0000 0000 0000 0000"
            value={numeroCartao}
            onChange={(e) => handleNumeroChange(e.target.value)}
            maxLength={19}
            className="pl-9 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="nomeCartao" className="dark:text-gray-300">
          Nome no Cartão *
        </Label>
        <div className="relative">
          <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
          <Input
            id="nomeCartao"
            type="text"
            placeholder="NOME COMO ESTÁ NO CARTÃO"
            value={nomeCartao}
            onChange={(e) => {
              setNomeCartao(e.target.value.toUpperCase());
              atualizarDados({
                numero: numeroCartao.replace(/\D/g, ""),
                nome: e.target.value.toUpperCase(),
                validade: validadeCartao,
                cvv: cvvCartao,
                parcelas: tipo === "credito" ? parcelas : undefined,
              });
            }}
            className="pl-9 uppercase dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="validadeCartao" className="dark:text-gray-300">
            Validade *
          </Label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
            <Input
              id="validadeCartao"
              type="text"
              placeholder="MM/AA"
              value={validadeCartao}
              onChange={(e) => handleValidadeChange(e.target.value)}
              maxLength={5}
              className="pl-9 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="cvvCartao" className="dark:text-gray-300">
            CVV *
          </Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
            <Input
              id="cvvCartao"
              type="password"
              placeholder="123"
              value={cvvCartao}
              onChange={(e) => {
                const limpo = e.target.value.replace(/\D/g, "").substring(0, 4);
                setCvvCartao(limpo);
                atualizarDados({
                  numero: numeroCartao.replace(/\D/g, ""),
                  nome: nomeCartao,
                  validade: validadeCartao,
                  cvv: limpo,
                  parcelas: tipo === "credito" ? parcelas : undefined,
                });
              }}
              maxLength={4}
              className="pl-9 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>
        </div>
      </div>

      {tipo === "credito" && (
        <div className="space-y-2">
          <Label htmlFor="parcelas" className="dark:text-gray-300">
            Parcelas
          </Label>
          <Select
            value={parcelas.toString()}
            onValueChange={(value) => {
              const numParcelas = parseInt(value);
              setParcelas(numParcelas);
              atualizarDados({
                numero: numeroCartao.replace(/\D/g, ""),
                nome: nomeCartao,
                validade: validadeCartao,
                cvv: cvvCartao,
                parcelas: numParcelas,
              });
            }}
          >
            <SelectTrigger className="dark:bg-gray-700 dark:border-gray-600 dark:text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {opcoesParcela.map((opcao) => (
                <SelectItem key={opcao.valor} value={opcao.valor.toString()}>
                  {opcao.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
        <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
          <Lock className="h-3 w-3" />
          Seus dados estão seguros e criptografados
        </p>
      </div>
    </div>
  );
}
