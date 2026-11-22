import crypto from 'crypto';

const CAPTCHA_SECRET =
  process.env.APP_CAPTCHA_SECRET_KEY ||
  process.env.CAPTCHA_SECRET ||
  'servico-indicado-captcha-secret-salt-2026';

export interface CaptchaChallengeData {
  challengeId: string;
  question: string;
  token: string;
}

/**
 * Generates a challenge question (e.g. simple math) with an HMAC-signed token
 */
export function generateCaptchaChallenge(): CaptchaChallengeData {
  const n1 = Math.floor(Math.random() * 9) + 1;
  const n2 = Math.floor(Math.random() * 9) + 1;
  const answer = String(n1 + n2);
  const timestamp = Date.now();
  const challengeId = crypto.randomUUID().slice(0, 8);

  const payload = `${challengeId}:${answer}:${timestamp}`;
  const hmac = crypto.createHmac('sha256', CAPTCHA_SECRET).update(payload).digest('hex');

  // Packed token containing challengeId, timestamp and HMAC
  const token = Buffer.from(`${challengeId}:${timestamp}:${hmac}`).toString('base64');

  return {
    challengeId,
    question: `Quanto é ${n1} + ${n2}?`,
    token,
  };
}

/**
 * Validates a submitted captcha token and user answer.
 * Also supports external Cloudflare Turnstile tokens if configured.
 */
export async function verifyCaptcha(
  token: string,
  userAnswer?: string
): Promise<{ success: boolean; error?: string }> {
  if (!token || typeof token !== 'string') {
    return { success: false, error: 'Verificação de segurança (Captcha) obrigatória.' };
  }

  // 1. Check if external Cloudflare Turnstile is configured
  const turnstileSecret = process.env.APP_TURNSTILE_SECRET_KEY || process.env.TURNSTILE_SECRET_KEY;
  if (turnstileSecret) {
    try {
      const verifyRes = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          secret: turnstileSecret,
          response: token,
        }),
      });
      const data = await verifyRes.json();
      if (data.success) {
        return { success: true };
      }
      return { success: false, error: 'Falha na verificação do Captcha Cloudflare.' };
    } catch (err) {
      console.warn('Erro ao validar Turnstile na Cloudflare:', err);
      // Fallback to internal verification if Cloudflare fails
    }
  }

  // 2. Validate internal signed challenge
  try {
    const decoded = Buffer.from(token, 'base64').toString('utf-8');
    const [challengeId, timestampStr, hmac] = decoded.split(':');

    if (!challengeId || !timestampStr || !hmac) {
      return { success: false, error: 'Token de segurança inválido.' };
    }

    const timestamp = parseInt(timestampStr, 10);
    const now = Date.now();

    // Expire challenge after 10 minutes (600,000 ms)
    if (now - timestamp > 10 * 60 * 1000) {
      return { success: false, error: 'Desafio expirado. Por favor, tente novamente.' };
    }

    if (!userAnswer || !userAnswer.trim()) {
      return { success: false, error: 'Responda à pergunta de verificação humana.' };
    }

    const cleanAnswer = userAnswer.trim();
    const expectedPayload = `${challengeId}:${cleanAnswer}:${timestamp}`;
    const expectedHmac = crypto.createHmac('sha256', CAPTCHA_SECRET).update(expectedPayload).digest('hex');

    // Constant time comparison to prevent timing attacks
    const isValid = crypto.timingSafeEqual(
      Buffer.from(hmac, 'hex'),
      Buffer.from(expectedHmac, 'hex')
    );

    if (!isValid) {
      return { success: false, error: 'Resposta de verificação incorreta. Tente novamente.' };
    }

    return { success: true };
  } catch (e) {
    return { success: false, error: 'Erro ao validar desafio de segurança.' };
  }
}
