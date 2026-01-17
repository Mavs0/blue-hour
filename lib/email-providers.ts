/**
 * Sistema de Email - Mailjet e Brevo
 * Suporta: Mailjet (API/SMTP), Brevo (API/SMTP)
 */

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

type EmailProvider = "mailjet" | "brevo" | "console";

// Detectar qual provedor usar baseado nas variáveis de ambiente
function detectProvider(): EmailProvider {
  if (process.env.MAILJET_API_KEY && process.env.MAILJET_SECRET_KEY) return "mailjet";
  if (process.env.BREVO_API_KEY) return "brevo";
  return "console";
}

/**
 * Envia email usando Mailjet (API)
 */
async function sendWithMailjet(options: EmailOptions): Promise<void> {
  try {
    const apiKey = process.env.MAILJET_API_KEY!;
    const secretKey = process.env.MAILJET_SECRET_KEY!;
    const fromEmail = process.env.MAILJET_FROM_EMAIL || process.env.EMAIL_FROM || "noreply@bluehour.com.br";
    const fromName = process.env.MAILJET_FROM_NAME || process.env.EMAIL_FROM_NAME || "Blue Hour";

    // Usar API do Mailjet
    const response = await fetch("https://api.mailjet.com/v3.1/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${Buffer.from(`${apiKey}:${secretKey}`).toString("base64")}`,
      },
      body: JSON.stringify({
        Messages: [
          {
            From: {
              Email: fromEmail,
              Name: fromName,
            },
            To: [
              {
                Email: options.to,
              },
            ],
            Subject: options.subject,
            HTMLPart: options.html,
            TextPart: options.text || options.html.replace(/<[^>]*>/g, ""),
            // List-Unsubscribe header para melhorar entregabilidade
            Headers: {
              "List-Unsubscribe": `<mailto:unsubscribe@${fromEmail.split("@")[1]}?subject=Unsubscribe>, <${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/unsubscribe>`,
            },
          },
        ],
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`Mailjet API error: ${JSON.stringify(errorData)}`);
    }

    const result = await response.json();
    console.log(`✅ [Mailjet] Email enviado com sucesso para ${options.to}`);
    console.log(`   Message ID: ${result.Messages?.[0]?.To?.[0]?.MessageID || "N/A"}`);
  } catch (error: any) {
    console.error("❌ [Mailjet] Erro ao enviar email:", error.message);
    throw error;
  }
}

/**
 * Envia email usando Brevo (API)
 */
async function sendWithBrevo(options: EmailOptions): Promise<void> {
  try {
    const apiKey = process.env.BREVO_API_KEY!;
    const fromEmail = process.env.BREVO_FROM_EMAIL || process.env.EMAIL_FROM || "noreply@bluehour.com.br";
    const fromName = process.env.BREVO_FROM_NAME || process.env.EMAIL_FROM_NAME || "Blue Hour";

    // Usar API do Brevo
    const response = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": apiKey,
      },
      body: JSON.stringify({
        sender: {
          name: fromName,
          email: fromEmail,
        },
        to: [
          {
            email: options.to,
          },
        ],
        subject: options.subject,
        htmlContent: options.html,
        textContent: options.text || options.html.replace(/<[^>]*>/g, ""),
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`Brevo API error: ${JSON.stringify(errorData)}`);
    }

    const result = await response.json();
    console.log(`✅ [Brevo] Email enviado com sucesso para ${options.to}`);
    console.log(`   Message ID: ${result.messageId || "N/A"}`);
  } catch (error: any) {
    console.error("❌ [Brevo] Erro ao enviar email:", error.message);
    throw error;
  }
}

/**
 * Modo console (apenas para desenvolvimento)
 */
async function sendWithConsole(options: EmailOptions): Promise<void> {
  console.log("📧 [DEV MODE] Email não enviado - Simulando envio:");
  console.log("   To:", options.to);
  console.log("   Subject:", options.subject);
  console.log("   HTML Preview:", options.html.substring(0, 100) + "...");
}

/**
 * Função principal para enviar emails
 * Detecta automaticamente qual provedor usar
 */
export async function sendEmail(options: EmailOptions): Promise<void> {
  const provider = detectProvider();

  if (provider === "console") {
    console.warn("⚠️ [AVISO] Nenhum provedor de email configurado!");
    console.warn("   Configure uma das opções no .env.local:");
    console.warn("   1. Mailjet: MAILJET_API_KEY=..., MAILJET_SECRET_KEY=...");
    console.warn("   2. Brevo: BREVO_API_KEY=...");
    console.warn("   Veja: CONFIGURAR_EMAIL.md");
    return sendWithConsole(options);
  }

  console.log(`📧 Enviando email usando: ${provider.toUpperCase()}`);

  try {
    switch (provider) {
      case "mailjet":
        return await sendWithMailjet(options);
      case "brevo":
        return await sendWithBrevo(options);
      default:
        return await sendWithConsole(options);
    }
  } catch (error: any) {
    console.error(`❌ Erro ao enviar email com ${provider}:`, error.message);
    // Em desenvolvimento, não quebrar a aplicação
    if (process.env.NODE_ENV === "development") {
      console.log("⚠️ Continuando em modo desenvolvimento...");
      return sendWithConsole(options);
    }
    throw error;
  }
}

/**
 * Verifica se o sistema de email está configurado
 */
export function isEmailConfigured(): boolean {
  return detectProvider() !== "console";
}

/**
 * Retorna qual provedor está sendo usado
 */
export function getCurrentProvider(): EmailProvider {
  return detectProvider();
}
