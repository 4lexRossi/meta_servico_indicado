import { NextRequest, NextResponse } from 'next/server';
import { getProfessionalByEmailOrPhone, getProfessionalById } from '@/lib/db';
import { checkRateLimit, getRateLimitHeaders } from '@/lib/rate-limit';
import { verifyPassword } from '@/lib/auth';

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
    const identifier = String(body.identifier || body.phone || body.email || '').trim();
    const password = String(body.password || '').trim();
    const id = body.id ? String(body.id).trim() : '';

      if (!identifier && !id) {
        return NextResponse.json(
          { success: false, error: 'Informe seu WhatsApp ou E-mail cadastrado.' },
          { status: 400, headers: corsHeaders }
        );
      }

      let pro = null;
      if (id) {
        pro = await getProfessionalById(id);
      } else if (identifier) {
        pro = await getProfessionalByEmailOrPhone(identifier);
      }

      if (!pro) {
        return NextResponse.json(
          {
            success: false,
          error: 'Nenhum profissional encontrado com esse WhatsApp ou E-mail. Verifique os dados digitados ou faça o cadastro inicial.'
          },
          { status: 404, headers: corsHeaders }
        );
      }

      // Verify password (demo click bypass without password is only allowed if clicking demo with ID)
      if (!id || password) {
        if (!password) {
          return NextResponse.json(
            { success: false, error: 'Por favor, digite a sua senha de acesso.' },
            { status: 400, headers: corsHeaders }
          );
        }

        const isValid = verifyPassword(password, pro.passwordHash);
        if (!isValid) {
          return NextResponse.json(
            { success: false, error: 'Senha incorreta. Verifique sua senha e tente novamente.' },
            { status: 401, headers: corsHeaders }
          );
        }
      }

      // Strip passwordHash before returning to frontend
      const { passwordHash: _discard, ...safePro } = pro;

      return NextResponse.json(
        {
          success: true,
          message: `Bem-vindo de volta, ${pro.name}!`,
          data: safePro,
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
