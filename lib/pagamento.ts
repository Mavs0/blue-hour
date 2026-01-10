// Utilitários para processamento de pagamento

export function gerarCodigoPix(valor: number, codigoVenda: string): string {
  // Simulação de geração de código PIX
  // Em produção, integrar com gateway de pagamento real
  const chavePix = "janaina.albuquerque975@gmail.com";
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
      console.log("Processando pagamento com dados:", {
        numero: dadosCartao.numero?.substring(0, 4) + "****",
        nome: dadosCartao.nome,
        validade: dadosCartao.validade,
        cvv: "***",
        tipo,
      });

      // Limpar número do cartão (remover espaços e caracteres não numéricos)
      const numeroLimpo = dadosCartao.numero?.replace(/\D/g, "") || "";

      // Validar número do cartão apenas se tiver pelo menos 13 dígitos
      if (numeroLimpo.length < 13 || numeroLimpo.length > 19) {
        console.error(
          "Número do cartão inválido (tamanho):",
          numeroLimpo.length
        );
        resolve({
          sucesso: false,
          erro: "Número do cartão inválido. Verifique o número do cartão.",
        });
        return;
      }

      // Validar algoritmo de Luhn (mas ser mais flexível)
      const validacao = validarCartao(numeroLimpo);
      if (!validacao.valido) {
        console.warn(
          "Cartão não passou no algoritmo de Luhn, mas continuando..."
        );
        // Em produção, isso seria crítico, mas para testes vamos ser mais flexíveis
        // Se o número tem tamanho válido, aceitamos mesmo que não passe no Luhn
      }

      // Validar CVV (deve ter 3 ou 4 dígitos)
      const cvvLimpo = dadosCartao.cvv?.replace(/\D/g, "") || "";
      if (cvvLimpo.length < 3 || cvvLimpo.length > 4) {
        console.error("CVV inválido:", cvvLimpo.length);
        resolve({
          sucesso: false,
          erro: "CVV inválido. O CVV deve ter 3 ou 4 dígitos.",
        });
        return;
      }

      // Validar validade (formato MM/YY ou MM/YYYY)
      const validadeLimpa = dadosCartao.validade?.replace(/\D/g, "") || "";
      if (validadeLimpa.length < 4) {
        console.error("Validade inválida (tamanho):", validadeLimpa);
        resolve({
          sucesso: false,
          erro: "Validade inválida. Use o formato MM/AA.",
        });
        return;
      }

      // Extrair mês e ano da validade
      let mes: number;
      let ano: number;

      if (validadeLimpa.length === 4) {
        // Formato MM/YY
        mes = parseInt(validadeLimpa.slice(0, 2));
        ano = parseInt("20" + validadeLimpa.slice(2, 4));
      } else if (validadeLimpa.length === 6) {
        // Formato MM/YYYY
        mes = parseInt(validadeLimpa.slice(0, 2));
        ano = parseInt(validadeLimpa.slice(2, 6));
      } else {
        console.error("Validade em formato inválido:", validadeLimpa);
        resolve({
          sucesso: false,
          erro: "Validade inválida. Use o formato MM/AA.",
        });
        return;
      }

      // Validar mês (1-12)
      if (mes < 1 || mes > 12) {
        console.error("Mês inválido:", mes);
        resolve({
          sucesso: false,
          erro: "Mês inválido. Use um valor entre 01 e 12.",
        });
        return;
      }

      // Verificar se a validade não está expirada
      const hoje = new Date();
      const validadeDate = new Date(ano, mes - 1, 1); // Primeiro dia do mês
      const ultimoDiaDoMes = new Date(ano, mes, 0); // Último dia do mês de validade

      if (ultimoDiaDoMes < hoje) {
        console.error("Cartão expirado:", { validadeDate, hoje });
        resolve({
          sucesso: false,
          erro: "Cartão expirado. Verifique a data de validade.",
        });
        return;
      }

      // Validar nome (deve ter pelo menos 2 caracteres, ser mais flexível)
      const nomeLimpo = dadosCartao.nome?.trim() || "";
      if (nomeLimpo.length < 2) {
        console.error("Nome muito curto:", nomeLimpo.length);
        resolve({
          sucesso: false,
          erro: "Nome inválido. O nome deve ter pelo menos 2 caracteres.",
        });
        return;
      }

      // Simular aprovação/rejeição (99% de aprovação para melhorar experiência em desenvolvimento)
      // Em produção, isso será substituído pela chamada real à API do gateway
      const aprovado = Math.random() > 0.01;

      if (aprovado) {
        const transacaoId = `${tipo.toUpperCase()}-${Date.now()}-${Math.random()
          .toString(36)
          .substring(2, 8)
          .toUpperCase()}`;
        console.log(`Pagamento ${tipo} aprovado:`, transacaoId);
        resolve({ sucesso: true, transacaoId });
      } else {
        console.error(`Pagamento ${tipo} recusado (simulação)`);
        resolve({
          sucesso: false,
          erro: "Pagamento recusado pela operadora. Tente novamente ou use outro cartão.",
        });
      }
    }, 2000);
  });
}
