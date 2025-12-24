// Utilitários para processamento de pagamento

export function gerarCodigoPix(valor: number, codigoVenda: string): string {
  // Simulação de geração de código PIX
  // Em produção, integrar com gateway de pagamento real
  const chavePix = "bluehour@eventos.com.br";
  const valorFormatado = valor.toFixed(2).replace(".", ",");
  return `00020126580014BR.GOV.BCB.PIX0136${chavePix}5204000053039865802BR5909BLUE HOUR6009SAO PAULO62070503***6304${codigoVenda}`;
}

export function gerarCodigoBarras(valor: number, vencimento: Date): string {
  // Simulação de código de barras para boleto
  // Em produção, integrar com gateway de pagamento real
  const valorFormatado = valor.toFixed(2).replace(".", "").padStart(10, "0");
  const vencimentoFormatado = vencimento
    .toISOString()
    .slice(0, 10)
    .replace(/-/g, "");
  return `34191${vencimentoFormatado}${valorFormatado}00000000000000000000000000`;
}

export function validarCartao(numero: string): {
  valido: boolean;
  bandeira?: string;
  ultimosDigitos?: string;
} {
  // Remove espaços e caracteres não numéricos
  const numeroLimpo = numero.replace(/\D/g, "");

  if (numeroLimpo.length < 13 || numeroLimpo.length > 19) {
    return { valido: false };
  }

  // Algoritmo de Luhn para validar cartão
  let soma = 0;
  let alternar = false;

  for (let i = numeroLimpo.length - 1; i >= 0; i--) {
    let digito = parseInt(numeroLimpo.charAt(i));

    if (alternar) {
      digito *= 2;
      if (digito > 9) {
        digito -= 9;
      }
    }

    soma += digito;
    alternar = !alternar;
  }

  const valido = soma % 10 === 0;

  if (!valido) {
    return { valido: false };
  }

  // Identificar bandeira
  let bandeira = "Desconhecida";
  const primeiroDigito = numeroLimpo[0];
  const primeirosDois = numeroLimpo.slice(0, 2);

  if (primeiroDigito === "4") {
    bandeira = "Visa";
  } else if (primeirosDois >= "51" && primeirosDois <= "55") {
    bandeira = "Mastercard";
  } else if (primeirosDois === "34" || primeirosDois === "37") {
    bandeira = "American Express";
  } else if (primeirosDois >= "36" && primeirosDois <= "38") {
    bandeira = "Diners Club";
  } else if (primeiroDigito === "6") {
    bandeira = "Discover";
  }

  return {
    valido: true,
    bandeira,
    ultimosDigitos: numeroLimpo.slice(-4),
  };
}

export function formatarValidadeCartao(validade: string): string {
  // Formata MM/YY
  const limpo = validade.replace(/\D/g, "");
  if (limpo.length >= 2) {
    return `${limpo.slice(0, 2)}/${limpo.slice(2, 4)}`;
  }
  return limpo;
}

export function processarPagamentoCartao(
  dadosCartao: {
    numero: string;
    nome: string;
    validade: string;
    cvv: string;
  },
  valor: number,
  tipo: "credito" | "debito"
): Promise<{ sucesso: boolean; transacaoId?: string; erro?: string }> {
  // Simulação de processamento de pagamento
  // Em produção, integrar com gateway real (Stripe, PagSeguro, etc)
  return new Promise((resolve) => {
    setTimeout(() => {
      const validacao = validarCartao(dadosCartao.numero);
      if (!validacao.valido) {
        resolve({ sucesso: false, erro: "Cartão inválido" });
        return;
      }

      // Simular aprovação/rejeição (90% de aprovação)
      const aprovado = Math.random() > 0.1;
      if (aprovado) {
        const transacaoId = `TXN${Date.now()}${Math.random()
          .toString(36)
          .substring(2, 8)
          .toUpperCase()}`;
        resolve({ sucesso: true, transacaoId });
      } else {
        resolve({ sucesso: false, erro: "Pagamento recusado pela operadora" });
      }
    }, 2000);
  });
}
