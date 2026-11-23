import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';

// =============================================================================
// AWS SES Client Configuration
// =============================================================================
const region = process.env.APP_REGION || 'sa-east-1';
const accessKeyId = process.env.APP_ACCESS_KEY_ID || '';
const secretAccessKey = process.env.APP_SECRET_ACCESS_KEY || '';
export const SES_FROM_EMAIL = process.env.APP_SES_FROM_EMAIL || 'nao-responda@servicoindicado.com.br';

const hasAwsCredentials = Boolean(
  accessKeyId &&
  accessKeyId.trim() !== '' &&
  secretAccessKey &&
  secretAccessKey.trim() !== ''
);

let sesClient: SESClient | null = null;

if (hasAwsCredentials) {
  try {
    sesClient = new SESClient({
      region,
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
    });
  } catch (err) {
    console.warn('⚠️ Falha ao inicializar o cliente AWS SES:', err);
    sesClient = null;
  }
}

export interface SendEmailResult {
  success: boolean;
  messageId?: string;
  error?: string;
  verificationLink?: string;
}

/**
 * Sends an email verification link to a professional using AWS SES
 */
export async function sendVerificationEmail({
  toEmail,
  proName,
  token,
  baseUrl,
}: {
  toEmail: string;
  proName: string;
  token: string;
  baseUrl: string;
}): Promise<SendEmailResult> {
  const verificationUrl = `${baseUrl.replace(/\/$/, '')}/verificar-email?token=${encodeURIComponent(token)}`;

  const subject = 'Confirme seu e-mail no Serviço Indicado';

  const htmlBody = `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Confirmação de E-mail</title>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; color: #1e293b; margin: 0; padding: 24px; }
        .container { max-width: 560px; margin: 0 auto; background-color: #ffffff; border-radius: 20px; padding: 36px 32px; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); }
        .logo { font-size: 22px; font-weight: 800; color: #0f172a; margin-bottom: 24px; display: inline-block; }
        .logo span { color: #0d9488; }
        .title { font-size: 20px; font-weight: 800; color: #0f172a; margin-bottom: 12px; }
        .text { font-size: 14px; line-height: 1.6; color: #475569; margin-bottom: 24px; }
        .btn-container { text-align: center; margin: 32px 0; }
        .btn { display: inline-block; background-color: #0d9488; color: #ffffff !important; font-weight: 700; font-size: 14px; text-decoration: none; padding: 14px 28px; border-radius: 12px; box-shadow: 0 4px 12px rgba(13,148,136,0.25); }
        .footer { font-size: 12px; color: #94a3b8; text-align: center; border-top: 1px solid #f1f5f9; padding-top: 20px; margin-top: 24px; }
        .link-alt { word-break: break-all; font-size: 11px; color: #0d9488; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="logo">Serviço<span>Indicado</span></div>
        <div class="title">Olá, ${proName}! 👋</div>
        <p class="text">
          Obrigado por cadastrar seu perfil profissional no <strong>Serviço Indicado</strong>.
          Para ativar o selo de <strong>E-mail Verificado</strong> no seu perfil público e garantir a segurança do seu acesso, confirme seu endereço de e-mail clicando no botão abaixo:
        </p>

        <div class="btn-container">
          <a href="${verificationUrl}" class="btn" target="_blank">Confirmar Meu E-mail</a>
        </div>

        <p class="text" style="font-size: 12px; color: #64748b;">
          Este link de verificação é válido por <strong>24 horas</strong>. Se você não solicitou este cadastro, pode desconsiderar esta mensagem.
        </p>

        <p class="text" style="font-size: 11px; color: #94a3b8;">
          Se o botão acima não funcionar, copie e cole este link no seu navegador:<br>
          <a href="${verificationUrl}" class="link-alt">${verificationUrl}</a>
        </p>

        <div class="footer">
          &copy; ${new Date().getFullYear()} Serviço Indicado &bull; Conectando clientes aos melhores profissionais.
        </div>
      </div>
    </body>
    </html>
  `;

  const textBody = `
Olá, ${proName}!

Obrigado por cadastrar seu perfil profissional no Serviço Indicado.
Para ativar o selo de E-mail Verificado no seu perfil, confirme seu e-mail acessando o link abaixo:

${verificationUrl}

Este link é válido por 24 horas.

Serviço Indicado
  `.trim();

  // If no SES client available (e.g. offline sandbox or missing credentials)
  if (!sesClient) {
    console.warn(`[AWS SES Simulação] Cliente SES não configurado. Link de verificação para ${toEmail}: ${verificationUrl}`);
    return {
      success: true,
      messageId: `simulated-${Date.now()}`,
      verificationLink: verificationUrl,
    };
  }

  try {
    const command = new SendEmailCommand({
      Source: SES_FROM_EMAIL,
      Destination: {
        ToAddresses: [toEmail],
      },
      Message: {
        Subject: {
          Data: subject,
          Charset: 'UTF-8',
        },
        Body: {
          Html: {
            Data: htmlBody,
            Charset: 'UTF-8',
          },
          Text: {
            Data: textBody,
            Charset: 'UTF-8',
          },
        },
      },
    });

    const response = await sesClient.send(command);
    console.log(`[AWS SES] E-mail de verificação enviado com sucesso para ${toEmail}. MessageId: ${response.MessageId}`);

    return {
      success: true,
      messageId: response.MessageId,
      verificationLink: verificationUrl,
    };
  } catch (err: any) {
    console.error(`⚠️ [AWS SES] Erro ao enviar e-mail para ${toEmail}:`, err);
    // Provide link for debugging/dev environments even if SES threw an error
    return {
      success: false,
      error: err?.message || 'Erro ao enviar e-mail via AWS SES',
      verificationLink: verificationUrl,
    };
  }
}
