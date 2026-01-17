// Importação dinâmica do SendGrid para evitar erro se não estiver instalado
let sgMail: any = null;

try {
  sgMail = require("@sendgrid/mail");
  // Configurar SendGrid
  if (process.env.SENDGRID_API_KEY) {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  }
} catch (error) {
  console.warn(
    "⚠️ @sendgrid/mail não instalado. Execute: npm install @sendgrid/mail"
  );
}

const FROM_EMAIL = process.env.SENDGRID_FROM_EMAIL || "noreply@bluehour.com.br";
const FROM_NAME = process.env.SENDGRID_FROM_NAME || "Blue Hour";

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

/**
 * Envia um email usando SendGrid
 */
export async function sendEmail({
  to,
  subject,
  html,
  text,
}: EmailOptions): Promise<void> {
  // Verificar se SendGrid está instalado
  if (!sgMail) {
    console.error("❌ [ERRO] @sendgrid/mail não está instalado!");
    console.error("   Execute: npm install @sendgrid/mail");
    console.log("📧 [DEV MODE] Email não enviado - Simulando envio:");
    console.log("   To:", to);
    console.log("   Subject:", subject);
    return;
  }

  // Verificar se API key está configurada
  if (!process.env.SENDGRID_API_KEY) {
    console.error("❌ [ERRO] SENDGRID_API_KEY não está configurada!");
    console.error("   Configure no arquivo .env.local:");
    console.error("   SENDGRID_API_KEY=sua_chave_aqui");
    console.error("   SENDGRID_FROM_EMAIL=seu_email@dominio.com");
    console.log("📧 [DEV MODE] Email não enviado - Simulando envio:");
    console.log("   To:", to);
    console.log("   Subject:", subject);
    return;
  }

  // Verificar se email de origem está configurado
  if (!process.env.SENDGRID_FROM_EMAIL) {
    console.warn(
      "⚠️ [AVISO] SENDGRID_FROM_EMAIL não configurado, usando padrão:",
      FROM_EMAIL
    );
  }

  try {
    const result = await sgMail.send({
      from: {
        email: FROM_EMAIL,
        name: FROM_NAME,
      },
      to,
      subject,
      html,
      text: text || html.replace(/<[^>]*>/g, ""), // Texto simples removendo HTML
    });

    console.log(`✅ Email enviado com sucesso para ${to}`);
    console.log(`   Status Code: ${result[0]?.statusCode || "N/A"}`);
    return;
  } catch (error: any) {
    console.error("❌ Erro ao enviar email:", error.message || error);

    if (error.response) {
      console.error("   Status Code:", error.response.statusCode);
      console.error("   Body:", JSON.stringify(error.response.body, null, 2));

      // Mensagens de erro mais amigáveis
      if (error.response.statusCode === 401) {
        console.error("   ⚠️ API Key inválida ou não autorizada!");
        console.error("   Verifique se a SENDGRID_API_KEY está correta.");
      } else if (error.response.statusCode === 403) {
        console.error("   ⚠️ Acesso negado!");
        console.error("   Verifique as permissões da sua API Key no SendGrid.");
      } else if (error.response.statusCode === 400) {
        console.error("   ⚠️ Requisição inválida!");
        console.error(
          "   Verifique se o email de origem está verificado no SendGrid."
        );
      }
    }

    // Não lançar erro em desenvolvimento para não quebrar o fluxo
    if (process.env.NODE_ENV === "development") {
      console.warn("   ⚠️ Continuando em modo desenvolvimento...");
      return;
    }

    throw error;
  }
}

/**
 * Template base de email
 */
function getEmailTemplate(content: string, title?: string): string {
  return `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title || "Blue Hour"}</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 30px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: bold;">
                🎵 Blue Hour
              </h1>
              <p style="margin: 10px 0 0 0; color: #ffffff; font-size: 14px; opacity: 0.9;">
                Seu ingresso para os melhores eventos de K-POP em Manaus
              </p>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 40px 30px;">
              ${content}
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background-color: #f9fafb; padding: 30px; text-align: center; border-top: 1px solid #e5e7eb;">
              <p style="margin: 0 0 10px 0; color: #6b7280; font-size: 12px;">
                Este é um email automático, por favor não responda.
              </p>
              <p style="margin: 0; color: #9ca3af; font-size: 11px;">
                © ${new Date().getFullYear()} Blue Hour. Todos os direitos reservados.
              </p>
              <p style="margin: 15px 0 0 0; color: #9ca3af; font-size: 11px;">
                <a href="${
                  process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
                }" style="color: #667eea; text-decoration: none;">Visite nosso site</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}

/**
 * Email de confirmação de compra
 */
export async function enviarEmailConfirmacaoCompra(
  email: string,
  nome: string,
  codigoVenda: string,
  nomeEvento: string,
  tipoIngresso: string,
  quantidade: number,
  valorTotal: number,
  dataEvento: Date,
  local: string,
  cidade: string
): Promise<void> {
  const dataFormatada = new Date(dataEvento).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const content = `
    <h2 style="margin: 0 0 20px 0; color: #111827; font-size: 24px;">
      ✅ Compra Confirmada!
    </h2>
    
    <p style="margin: 0 0 20px 0; color: #374151; font-size: 16px; line-height: 1.6;">
      Olá <strong>${nome}</strong>,
    </p>
    
    <p style="margin: 0 0 20px 0; color: #374151; font-size: 16px; line-height: 1.6;">
      Sua compra foi registrada com sucesso! Seguem os detalhes:
    </p>
    
    <div style="background-color: #f9fafb; border-radius: 8px; padding: 20px; margin: 20px 0; border-left: 4px solid #667eea;">
      <table width="100%" cellpadding="8">
        <tr>
          <td style="color: #6b7280; font-size: 14px; width: 140px;"><strong>Código da Compra:</strong></td>
          <td style="color: #111827; font-size: 14px; font-family: monospace; font-weight: bold;">${codigoVenda}</td>
        </tr>
        <tr>
          <td style="color: #6b7280; font-size: 14px;"><strong>Evento:</strong></td>
          <td style="color: #111827; font-size: 14px;">${nomeEvento}</td>
        </tr>
        <tr>
          <td style="color: #6b7280; font-size: 14px;"><strong>Data:</strong></td>
          <td style="color: #111827; font-size: 14px;">${dataFormatada}</td>
        </tr>
        <tr>
          <td style="color: #6b7280; font-size: 14px;"><strong>Local:</strong></td>
          <td style="color: #111827; font-size: 14px;">${local} - ${cidade}</td>
        </tr>
        <tr>
          <td style="color: #6b7280; font-size: 14px;"><strong>Ingresso:</strong></td>
          <td style="color: #111827; font-size: 14px;">${tipoIngresso}</td>
        </tr>
        <tr>
          <td style="color: #6b7280; font-size: 14px;"><strong>Quantidade:</strong></td>
          <td style="color: #111827; font-size: 14px;">${quantidade}</td>
        </tr>
        <tr>
          <td style="color: #6b7280; font-size: 14px;"><strong>Valor Total:</strong></td>
          <td style="color: #111827; font-size: 18px; font-weight: bold; color: #667eea;">R$ ${valorTotal
            .toFixed(2)
            .replace(".", ",")}</td>
        </tr>
      </table>
    </div>
    
    <div style="background-color: #fef3c7; border-radius: 8px; padding: 15px; margin: 20px 0; border-left: 4px solid #f59e0b;">
      <p style="margin: 0; color: #92400e; font-size: 14px;">
        <strong>⚠️ Importante:</strong> Guarde o código da compra (<strong>${codigoVenda}</strong>) para retirada dos ingressos no dia do evento.
      </p>
    </div>
    
    <p style="margin: 20px 0 0 0; color: #374151; font-size: 16px; line-height: 1.6;">
      Em breve você receberá mais informações sobre o pagamento e o ingresso.
    </p>
  `;

  await sendEmail({
    to: email,
    subject: `✅ Compra Confirmada - ${nomeEvento}`,
    html: getEmailTemplate(content, "Compra Confirmada"),
  });
}

/**
 * Email com instruções de pagamento PIX
 */
export async function enviarEmailInstrucoesPix(
  email: string,
  nome: string,
  codigoVenda: string,
  nomeEvento: string,
  valorTotal: number,
  codigoPix: string,
  qrCodeBase64?: string
): Promise<void> {
  const qrCodeImage = qrCodeBase64
    ? `<img src="data:image/png;base64,${qrCodeBase64}" alt="QR Code PIX" style="max-width: 300px; display: block; margin: 20px auto; border: 2px solid #e5e7eb; border-radius: 8px;" />`
    : "";

  const content = `
    <h2 style="margin: 0 0 20px 0; color: #111827; font-size: 24px;">
      💳 Instruções de Pagamento PIX
    </h2>
    
    <p style="margin: 0 0 20px 0; color: #374151; font-size: 16px; line-height: 1.6;">
      Olá <strong>${nome}</strong>,
    </p>
    
    <p style="margin: 0 0 20px 0; color: #374151; font-size: 16px; line-height: 1.6;">
      Para finalizar sua compra do evento <strong>${nomeEvento}</strong>, realize o pagamento via PIX no valor de:
    </p>
    
    <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 8px; padding: 30px; margin: 20px 0; text-align: center;">
      <p style="margin: 0 0 10px 0; color: #ffffff; font-size: 14px; opacity: 0.9;">Valor a pagar</p>
      <p style="margin: 0; color: #ffffff; font-size: 36px; font-weight: bold;">R$ ${valorTotal
        .toFixed(2)
        .replace(".", ",")}</p>
    </div>
    
    ${qrCodeImage}
    
    <div style="background-color: #f9fafb; border-radius: 8px; padding: 20px; margin: 20px 0;">
      <h3 style="margin: 0 0 15px 0; color: #111827; font-size: 18px;">
        📋 Código PIX (Copiar e Colar)
      </h3>
      <div style="background-color: #ffffff; border: 2px dashed #d1d5db; border-radius: 6px; padding: 15px; word-break: break-all;">
        <code style="color: #111827; font-size: 12px; font-family: monospace;">${codigoPix}</code>
      </div>
      <p style="margin: 15px 0 0 0; color: #6b7280; font-size: 12px;">
        Copie o código acima e cole no app do seu banco para pagar via PIX.
      </p>
    </div>
    
    <div style="background-color: #eff6ff; border-radius: 8px; padding: 15px; margin: 20px 0; border-left: 4px solid #3b82f6;">
      <h4 style="margin: 0 0 10px 0; color: #1e40af; font-size: 16px;">
        📱 Como pagar:
      </h4>
      <ol style="margin: 0; padding-left: 20px; color: #1e40af; font-size: 14px; line-height: 1.8;">
        <li>Abra o app do seu banco</li>
        <li>Escaneie o QR Code acima ou cole o código PIX</li>
        <li>Confirme o pagamento</li>
        <li>Aguarde a confirmação (pode levar alguns minutos)</li>
      </ol>
    </div>
    
    <div style="background-color: #fef3c7; border-radius: 8px; padding: 15px; margin: 20px 0; border-left: 4px solid #f59e0b;">
      <p style="margin: 0; color: #92400e; font-size: 14px;">
        <strong>⏰ Prazo:</strong> O pagamento deve ser realizado em até 24 horas. Após esse período, o código PIX expira.
      </p>
    </div>
    
    <p style="margin: 20px 0 0 0; color: #374151; font-size: 16px; line-height: 1.6;">
      Após a confirmação do pagamento, você receberá um email com seu ingresso.
    </p>
  `;

  await sendEmail({
    to: email,
    subject: `💳 Instruções de Pagamento PIX - ${nomeEvento}`,
    html: getEmailTemplate(content, "Instruções de Pagamento"),
  });
}

/**
 * Email de confirmação de pagamento
 */
export async function enviarEmailConfirmacaoPagamento(
  email: string,
  nome: string,
  codigoVenda: string,
  nomeEvento: string,
  tipoIngresso: string,
  quantidade: number,
  valorTotal: number,
  dataEvento: Date,
  local: string,
  cidade: string,
  formaPagamento: string
): Promise<void> {
  const dataFormatada = new Date(dataEvento).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const formaPagamentoTexto =
    formaPagamento === "pix"
      ? "PIX"
      : formaPagamento === "cartao_credito"
      ? "Cartão de Crédito"
      : formaPagamento === "cartao_debito"
      ? "Cartão de Débito"
      : "Boleto Bancário";

  const content = `
    <h2 style="margin: 0 0 20px 0; color: #111827; font-size: 24px;">
      🎉 Pagamento Confirmado!
    </h2>
    
    <p style="margin: 0 0 20px 0; color: #374151; font-size: 16px; line-height: 1.6;">
      Olá <strong>${nome}</strong>,
    </p>
    
    <p style="margin: 0 0 20px 0; color: #374151; font-size: 16px; line-height: 1.6;">
      Seu pagamento foi confirmado com sucesso! Seus ingressos estão garantidos para o evento:
    </p>
    
    <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); border-radius: 8px; padding: 30px; margin: 20px 0; text-align: center;">
      <p style="margin: 0 0 10px 0; color: #ffffff; font-size: 20px; font-weight: bold;">
        ${nomeEvento}
      </p>
      <p style="margin: 0; color: #ffffff; font-size: 14px; opacity: 0.9;">
        ${dataFormatada}
      </p>
    </div>
    
    <div style="background-color: #f9fafb; border-radius: 8px; padding: 20px; margin: 20px 0;">
      <table width="100%" cellpadding="8">
        <tr>
          <td style="color: #6b7280; font-size: 14px; width: 140px;"><strong>Código da Compra:</strong></td>
          <td style="color: #111827; font-size: 14px; font-family: monospace; font-weight: bold;">${codigoVenda}</td>
        </tr>
        <tr>
          <td style="color: #6b7280; font-size: 14px;"><strong>Ingresso:</strong></td>
          <td style="color: #111827; font-size: 14px;">${tipoIngresso}</td>
        </tr>
        <tr>
          <td style="color: #6b7280; font-size: 14px;"><strong>Quantidade:</strong></td>
          <td style="color: #111827; font-size: 14px;">${quantidade}</td>
        </tr>
        <tr>
          <td style="color: #6b7280; font-size: 14px;"><strong>Forma de Pagamento:</strong></td>
          <td style="color: #111827; font-size: 14px;">${formaPagamentoTexto}</td>
        </tr>
        <tr>
          <td style="color: #6b7280; font-size: 14px;"><strong>Valor Pago:</strong></td>
          <td style="color: #111827; font-size: 18px; font-weight: bold; color: #10b981;">R$ ${valorTotal
            .toFixed(2)
            .replace(".", ",")}</td>
        </tr>
        <tr>
          <td style="color: #6b7280; font-size: 14px;"><strong>Local:</strong></td>
          <td style="color: #111827; font-size: 14px;">${local} - ${cidade}</td>
        </tr>
      </table>
    </div>
    
    <div style="background-color: #eff6ff; border-radius: 8px; padding: 15px; margin: 20px 0; border-left: 4px solid #3b82f6;">
      <p style="margin: 0; color: #1e40af; font-size: 14px;">
        <strong>📱 Próximos passos:</strong>
      </p>
      <ul style="margin: 10px 0 0 0; padding-left: 20px; color: #1e40af; font-size: 14px; line-height: 1.8;">
        <li>Guarde o código da compra (<strong>${codigoVenda}</strong>)</li>
        <li>Apresente este código no dia do evento para retirar seus ingressos</li>
        <li>Você receberá um lembrete 24 horas antes do evento</li>
      </ul>
    </div>
    
    <div style="text-align: center; margin: 30px 0;">
      <a href="${
        process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
      }/compra/confirmacao?codigo=${codigoVenda}" 
         style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; padding: 14px 28px; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 16px;">
        Ver Detalhes da Compra
      </a>
    </div>
  `;

  await sendEmail({
    to: email,
    subject: `🎉 Pagamento Confirmado - ${nomeEvento}`,
    html: getEmailTemplate(content, "Pagamento Confirmado"),
  });
}

/**
 * Email de lembrete antes do evento
 */
export async function enviarEmailLembreteEvento(
  email: string,
  nome: string,
  codigoVenda: string,
  nomeEvento: string,
  dataEvento: Date,
  local: string,
  cidade: string,
  tipoIngresso: string,
  quantidade: number
): Promise<void> {
  const dataFormatada = new Date(dataEvento).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const content = `
    <h2 style="margin: 0 0 20px 0; color: #111827; font-size: 24px;">
      ⏰ Lembrete: Seu evento é amanhã!
    </h2>
    
    <p style="margin: 0 0 20px 0; color: #374151; font-size: 16px; line-height: 1.6;">
      Olá <strong>${nome}</strong>,
    </p>
    
    <p style="margin: 0 0 20px 0; color: #374151; font-size: 16px; line-height: 1.6;">
      Este é um lembrete de que o evento <strong>${nomeEvento}</strong> acontece amanhã!
    </p>
    
    <div style="background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); border-radius: 8px; padding: 30px; margin: 20px 0; text-align: center;">
      <p style="margin: 0 0 10px 0; color: #ffffff; font-size: 20px; font-weight: bold;">
        ${nomeEvento}
      </p>
      <p style="margin: 0 0 15px 0; color: #ffffff; font-size: 16px;">
        📅 ${dataFormatada}
      </p>
      <p style="margin: 0; color: #ffffff; font-size: 14px; opacity: 0.9;">
        📍 ${local} - ${cidade}
      </p>
    </div>
    
    <div style="background-color: #f9fafb; border-radius: 8px; padding: 20px; margin: 20px 0;">
      <table width="100%" cellpadding="8">
        <tr>
          <td style="color: #6b7280; font-size: 14px; width: 140px;"><strong>Código da Compra:</strong></td>
          <td style="color: #111827; font-size: 14px; font-family: monospace; font-weight: bold;">${codigoVenda}</td>
        </tr>
        <tr>
          <td style="color: #6b7280; font-size: 14px;"><strong>Ingresso:</strong></td>
          <td style="color: #111827; font-size: 14px;">${tipoIngresso}</td>
        </tr>
        <tr>
          <td style="color: #6b7280; font-size: 14px;"><strong>Quantidade:</strong></td>
          <td style="color: #111827; font-size: 14px;">${quantidade}</td>
        </tr>
      </table>
    </div>
    
    <div style="background-color: #eff6ff; border-radius: 8px; padding: 15px; margin: 20px 0; border-left: 4px solid #3b82f6;">
      <h4 style="margin: 0 0 10px 0; color: #1e40af; font-size: 16px;">
        📋 Não esqueça:
      </h4>
      <ul style="margin: 0; padding-left: 20px; color: #1e40af; font-size: 14px; line-height: 1.8;">
        <li>Leve o código da compra (<strong>${codigoVenda}</strong>)</li>
        <li>Chegue com antecedência</li>
        <li>Leve um documento com foto</li>
        <li>Divirta-se! 🎉</li>
      </ul>
    </div>
    
    <div style="text-align: center; margin: 30px 0;">
      <a href="${
        process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
      }/compra/confirmacao?codigo=${codigoVenda}" 
         style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; padding: 14px 28px; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 16px;">
        Ver Detalhes da Compra
      </a>
    </div>
  `;

  await sendEmail({
    to: email,
    subject: `⏰ Lembrete: ${nomeEvento} é amanhã!`,
    html: getEmailTemplate(content, "Lembrete de Evento"),
  });
}
