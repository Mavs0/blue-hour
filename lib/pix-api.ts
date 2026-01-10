// Integração com API de PIX real
// Suporta múltiplos provedores: Mercado Pago, Asaas, Gerencianet, etc.

interface PixResponse {
  codigoPix: string;
  qrCodeBase64?: string;
  qrCodeUrl?: string;
  txId?: string;
  expiresAt?: Date;
}

interface PixRequest {
  valor: number;
  codigoVenda: string;
  nomeCliente: string;
  emailCliente: string;
  cpfCliente?: string;
}

/**
 * Gera um PIX real usando a API configurada
 */
export async function gerarPixReal(
  valor: number,
  codigoVenda: string,
  nomeCliente: string,
  emailCliente: string,
  cpfCliente?: string
): Promise<PixResponse> {
  const provider = process.env.PIX_PROVIDER || "mercadopago";

  switch (provider) {
    case "mercadopago":
      return gerarPixMercadoPago({
        valor,
        codigoVenda,
        nomeCliente,
        emailCliente,
        cpfCliente,
      });
    case "asaas":
      return gerarPixAsaas({
        valor,
        codigoVenda,
        nomeCliente,
        emailCliente,
        cpfCliente,
      });
    case "gerencianet":
      return gerarPixGerencianet({
        valor,
        codigoVenda,
        nomeCliente,
        emailCliente,
        cpfCliente,
      });
    default:
      throw new Error(`Provedor de PIX não configurado: ${provider}`);
  }
}

/**
 * Gera PIX usando Mercado Pago
 */
async function gerarPixMercadoPago(request: PixRequest): Promise<PixResponse> {
  const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN;
  if (!accessToken) {
    throw new Error("MERCADOPAGO_ACCESS_TOKEN não configurado");
  }

  try {
    const response = await fetch("https://api.mercadopago.com/v1/payments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        transaction_amount: request.valor,
        description: `Compra ${request.codigoVenda} - ${request.nomeCliente}`,
        payment_method_id: "pix",
        payer: {
          email: request.emailCliente,
          first_name: request.nomeCliente.split(" ")[0],
          last_name:
            request.nomeCliente.split(" ").slice(1).join(" ") ||
            request.nomeCliente.split(" ")[0],
          identification: request.cpfCliente
            ? {
                type: "CPF",
                number: request.cpfCliente.replace(/\D/g, ""),
              }
            : undefined,
        },
        external_reference: request.codigoVenda,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(
        error.message || `Erro ao gerar PIX: ${response.statusText}`
      );
    }

    const data = await response.json();

    // Buscar QR Code
    const qrCodeResponse = await fetch(
      `https://api.mercadopago.com/v1/payments/${data.id}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    const paymentData = await qrCodeResponse.json();
    const qrCode = paymentData.point_of_interaction?.transaction_data?.qr_code;
    const qrCodeBase64 =
      paymentData.point_of_interaction?.transaction_data?.qr_code_base64;

    return {
      codigoPix: qrCode || data.point_of_interaction?.transaction_data?.qr_code,
      qrCodeBase64: qrCodeBase64,
      txId: data.id?.toString(),
      expiresAt: paymentData.date_of_expiration
        ? new Date(paymentData.date_of_expiration)
        : undefined,
    };
  } catch (error: any) {
    console.error("Erro ao gerar PIX no Mercado Pago:", error);
    throw new Error(
      `Erro ao gerar PIX: ${error.message || "Erro desconhecido"}`
    );
  }
}

/**
 * Gera PIX usando Asaas
 */
async function gerarPixAsaas(request: PixRequest): Promise<PixResponse> {
  const apiKey = process.env.ASAAS_API_KEY;
  if (!apiKey) {
    throw new Error("ASAAS_API_KEY não configurado");
  }

  try {
    const response = await fetch(
      `${process.env.ASAAS_API_URL || "https://www.asaas.com/api/v3"}/payments`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          access_token: apiKey,
        },
        body: JSON.stringify({
          billingType: "PIX",
          value: request.valor,
          dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
            .toISOString()
            .split("T")[0],
          description: `Compra ${request.codigoVenda}`,
          externalReference: request.codigoVenda,
          customer: request.emailCliente,
          name: request.nomeCliente,
          cpfCnpj: request.cpfCliente?.replace(/\D/g, ""),
        }),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(
        error.message || `Erro ao gerar PIX: ${response.statusText}`
      );
    }

    const data = await response.json();

    return {
      codigoPix: data.pixCopiaECola || data.encodedImage,
      qrCodeBase64: data.encodedImage,
      txId: data.id,
      expiresAt: data.dueDate ? new Date(data.dueDate) : undefined,
    };
  } catch (error: any) {
    console.error("Erro ao gerar PIX no Asaas:", error);
    throw new Error(
      `Erro ao gerar PIX: ${error.message || "Erro desconhecido"}`
    );
  }
}

/**
 * Gera PIX usando Gerencianet (Efí Pay)
 */
async function gerarPixGerencianet(request: PixRequest): Promise<PixResponse> {
  const clientId = process.env.GERENCIANET_CLIENT_ID;
  const clientSecret = process.env.GERENCIANET_CLIENT_SECRET;
  const sandbox = process.env.GERENCIANET_SANDBOX === "true";

  if (!clientId || !clientSecret) {
    throw new Error(
      "GERENCIANET_CLIENT_ID e GERENCIANET_CLIENT_SECRET não configurados"
    );
  }

  try {
    // Obter token de acesso
    const tokenResponse = await fetch(
      `https://${sandbox ? "pix-h" : "pix"}.gerencianet.com.br/oauth/token`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          grant_type: "client_credentials",
        }),
        // Autenticação básica
        // @ts-ignore
        auth: {
          username: clientId,
          password: clientSecret,
        },
      }
    );

    if (!tokenResponse.ok) {
      throw new Error("Erro ao obter token de acesso");
    }

    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;

    // Gerar PIX
    const pixResponse = await fetch(
      `https://${sandbox ? "pix-h" : "pix"}.gerencianet.com.br/v2/cob`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          calendario: {
            expiracao: 3600, // 1 hora
          },
          valor: {
            original: request.valor.toFixed(2),
          },
          chave: process.env.GERENCIANET_PIX_KEY,
          solicitacaoPagador: `Compra ${request.codigoVenda}`,
        }),
      }
    );

    if (!pixResponse.ok) {
      const error = await pixResponse.json();
      throw new Error(
        error.message || `Erro ao gerar PIX: ${pixResponse.statusText}`
      );
    }

    const data = await pixResponse.json();

    // Buscar QR Code
    const qrCodeResponse = await fetch(
      `https://${sandbox ? "pix-h" : "pix"}.gerencianet.com.br/v2/loc/${
        data.loc.id
      }/qrcode`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    const qrCodeData = await qrCodeResponse.json();

    return {
      codigoPix: qrCodeData.qrcode,
      qrCodeBase64: qrCodeData.imagemQrcode,
      txId: data.txid,
      expiresAt: data.calendario?.expiracao
        ? new Date(Date.now() + data.calendario.expiracao * 1000)
        : undefined,
    };
  } catch (error: any) {
    console.error("Erro ao gerar PIX na Gerencianet:", error);
    throw new Error(
      `Erro ao gerar PIX: ${error.message || "Erro desconhecido"}`
    );
  }
}
