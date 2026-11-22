import { NextRequest, NextResponse } from 'next/server';
import { getProfessionalByPhone, getProfessionalById, getProfessionals } from '@/lib/db';
import { checkRateLimit, getRateLimitHeaders } from '@/lib/rate-limit';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function POST(request: NextRequest) {
  try {
    // Rate limit check: max 10 tentativas de login por 15 minutos por IP
    const rateLimit = checkRateLimit(request, {
      actionName: 'login_pro',
      limit: 10,
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
    const phone = body.phone ? String(body.phone).trim() : '';
    const id = body.id ? String(body.id).trim() : '';

    if (!phone && !id) {
      return NextResponse.json(
        { success: false, error: 'Informe o WhatsApp ou ID do profissional.' },
        { status: 400, headers: corsHeaders }
      );
    }

    let pro = null;
    if (id) {
      pro = await getProfessionalById(id);
    } else if (phone) {
      pro = await getProfessionalByPhone(phone);
    }

    if (!pro) {
      // Return list of available demo pros or clean not found
      return NextResponse.json(
        { 
          success: false, 
          error: 'Nenhum profissional encontrado com esse número de WhatsApp. Verifique o número digitado ou faça o cadastro inicial.' 
        },
        { status: 404, headers: corsHeaders }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: `Bem-vindo de volta, ${pro.name}!`,
        data: pro,
      },
      { status: 200, headers: corsHeaders }
    );
  } catch (error) {
    console.error('Erro no login do profissional:', error);
    return NextResponse.json(
      { success: false, error: 'Falha ao processar login' },
      { status: 500, headers: corsHeaders }
    );
  }
}
