import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { getProfessionalById, setProfessionalVerificationToken } from '@/lib/db';
import { sendVerificationEmail } from '@/lib/ses';
import { checkRateLimit, getRateLimitHeaders } from '@/lib/rate-limit';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function POST(request: NextRequest) {
  try {
    const rateLimit = checkRateLimit(request, {
      actionName: 'resend_verification',
      limit: 3,
      windowMs: 5 * 60 * 1000,
    });
    const rateLimitHeaders = getRateLimitHeaders(rateLimit);

    if (!rateLimit.success) {
      return NextResponse.json(
        { success: false, error: rateLimit.error },
        { status: 429, headers: { ...corsHeaders, ...rateLimitHeaders } }
      );
    }

    const body = await request.json();
    const id = body?.id;

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'ID do profissional não informado' },
        { status: 400, headers: { ...corsHeaders, ...rateLimitHeaders } }
      );
    }

    const pro = await getProfessionalById(id);
    if (!pro) {
      return NextResponse.json(
        { success: false, error: 'Profissional não encontrado' },
        { status: 404, headers: { ...corsHeaders, ...rateLimitHeaders } }
      );
    }

    if (!pro.email) {
      return NextResponse.json(
        { success: false, error: 'Nenhum e-mail cadastrado para este profissional' },
        { status: 400, headers: { ...corsHeaders, ...rateLimitHeaders } }
      );
    }

    if (pro.emailVerified) {
      return NextResponse.json(
        { success: true, message: 'Seu e-mail já está verificado!', alreadyVerified: true },
        { headers: { ...corsHeaders, ...rateLimitHeaders } }
      );
    }

    const newToken = crypto.randomBytes(32).toString('hex');
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

    await setProfessionalVerificationToken(pro.id, newToken, expires);

    const baseUrl = request.nextUrl.origin || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const emailResult = await sendVerificationEmail({
      toEmail: pro.email,
      proName: pro.name,
      token: newToken,
      baseUrl,
    });

    return NextResponse.json(
      {
        success: true,
        message: 'E-mail de confirmação reenviado com sucesso via AWS!',
        emailSent: emailResult.success,
        verificationLink: emailResult.verificationLink,
      },
      { headers: { ...corsHeaders, ...rateLimitHeaders } }
    );
  } catch (error) {
    console.error('Error resending verification email:', error);
    return NextResponse.json(
      { success: false, error: 'Erro ao reenviar e-mail de verificação' },
      { status: 500, headers: corsHeaders }
    );
  }
}
