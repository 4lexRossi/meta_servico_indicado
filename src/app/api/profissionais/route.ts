import { NextRequest, NextResponse } from 'next/server';
import { getProfessionals, createProfessional } from '@/lib/db';
import { checkRateLimit, getRateLimitHeaders } from '@/lib/rate-limit';
import { verifyCaptcha } from '@/lib/captcha';
import { hashPassword } from '@/lib/auth';
import { validatePhone } from '@/lib/phone';

// CORS headers to enable direct calls from React Native / Mobile App
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const pillar = searchParams.get('pillar') || undefined;
    const subcategory = searchParams.get('subcategory') || undefined;
    const region = searchParams.get('region') || undefined;
    const search = searchParams.get('search') || undefined;

    const pros = await getProfessionals({
      pillar,
      subcategory,
      region,
      search,
    });

    return NextResponse.json(
      {
        success: true,
        count: pros.length,
        data: pros,
      },
      { headers: corsHeaders }
    );
  } catch (error) {
    console.error('Error fetching professionals:', error);
    return NextResponse.json(
      { success: false, error: 'Falha ao buscar profissionais' },
      { status: 500, headers: corsHeaders }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // 1. Rate Limit check: max 5 cadastros por 15 minutos por IP
    const rateLimit = checkRateLimit(request, {
      actionName: 'register_pro',
      limit: 5,
      windowMs: 15 * 60 * 1000,
    });

    const rateLimitHeaders = getRateLimitHeaders(rateLimit);

    if (!rateLimit.success) {
      return NextResponse.json(
        { success: false, error: rateLimit.error },
        { status: 429, headers: { ...corsHeaders, ...rateLimitHeaders } }
      );
    }

    const body = await request.json();

    // 2. Captcha verification check
    const captchaCheck = await verifyCaptcha(body.captchaToken, body.captchaAnswer);
    if (!captchaCheck.success) {
      return NextResponse.json(
        { success: false, error: captchaCheck.error || 'Verificação de segurança falhou.' },
        { status: 400, headers: { ...corsHeaders, ...rateLimitHeaders } }
      );
    }

    // 3. Validation
    if (!body.name || !body.phone) {
      return NextResponse.json(
        { success: false, error: 'Nome e WhatsApp são obrigatórios' },
        { status: 400, headers: { ...corsHeaders, ...rateLimitHeaders } }
      );
    }

    const phoneCheck = validatePhone(body.phone);
    if (!phoneCheck.isValid) {
      return NextResponse.json(
        { success: false, error: phoneCheck.error || 'Número de WhatsApp inválido' },
        { status: 400, headers: { ...corsHeaders, ...rateLimitHeaders } }
      );
    }

    const proPayload = {
      ...body,
      email: body.email ? String(body.email).trim().toLowerCase() : undefined,
      passwordHash: body.password ? hashPassword(String(body.password).trim()) : undefined,
    };
    delete proPayload.password;
    delete proPayload.captchaToken;
    delete proPayload.captchaAnswer;

    const newPro = await createProfessional(proPayload);
    const { passwordHash: _discard, ...safePro } = newPro;

    return NextResponse.json(
      {
        success: true,
        message: 'Profissional cadastrado com sucesso no Serviço Indicado!',
        data: safePro,
      },
      { status: 201, headers: { ...corsHeaders, ...rateLimitHeaders } }
    );
  } catch (error) {
    console.error('Error creating professional:', error);
    return NextResponse.json(
      { success: false, error: 'Falha ao cadastrar profissional' },
      { status: 500, headers: corsHeaders }
    );
  }
}
