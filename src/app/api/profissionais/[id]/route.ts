import { NextRequest, NextResponse } from 'next/server';
import { getProfessionalById, updateProfessional, getProfessionalByPhone, getProfessionalByEmail } from '@/lib/db';
import { checkRateLimit, getRateLimitHeaders } from '@/lib/rate-limit';
import { hashPassword } from '@/lib/auth';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, PATCH, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const pro = await getProfessionalById(id);

    if (!pro) {
      return NextResponse.json(
        { success: false, error: 'Profissional não encontrado' },
        { status: 404, headers: corsHeaders }
      );
    }

    return NextResponse.json(
      { success: true, data: pro },
      { headers: corsHeaders }
    );
  } catch (error) {
    console.error('Error fetching pro by id:', error);
    return NextResponse.json(
      { success: false, error: 'Falha ao buscar profissional' },
      { status: 500, headers: corsHeaders }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    // Rate limit check: max 30 updates por 10 minutos por IP
    const rateLimit = checkRateLimit(request, {
      actionName: 'update_pro',
      limit: 30,
      windowMs: 10 * 60 * 1000,
    });

    const rateLimitHeaders = getRateLimitHeaders(rateLimit);

    if (!rateLimit.success) {
      return NextResponse.json(
        { success: false, error: rateLimit.error },
        { status: 429, headers: { ...corsHeaders, ...rateLimitHeaders } }
      );
    }

    const { id } = await context.params;
    const body = await request.json();
    const patchPayload = { ...body };

    // Check duplicate phone if being updated
    if (patchPayload.phone) {
      const existingPhone = await getProfessionalByPhone(patchPayload.phone);
      if (existingPhone && existingPhone.id !== id) {
        return NextResponse.json(
          { success: false, error: 'Este número de WhatsApp já está cadastrado em outra conta.' },
          { status: 409, headers: { ...corsHeaders, ...rateLimitHeaders } }
        );
      }
    }

    // Check duplicate email if being updated
    if (patchPayload.email) {
      const cleanEmail = String(patchPayload.email).trim().toLowerCase();
      const existingEmail = await getProfessionalByEmail(cleanEmail);
      if (existingEmail && existingEmail.id !== id) {
        return NextResponse.json(
          { success: false, error: 'Este endereço de e-mail já está cadastrado em outra conta.' },
          { status: 409, headers: { ...corsHeaders, ...rateLimitHeaders } }
        );
      }
    }

    if (patchPayload.newPassword) {
      patchPayload.passwordHash = hashPassword(String(patchPayload.newPassword).trim());
      delete patchPayload.newPassword;
    }
    delete patchPayload.password;

    const updated = await updateProfessional(id, patchPayload);

    if (!updated) {
      return NextResponse.json(
        { success: false, error: 'Profissional não encontrado' },
        { status: 404, headers: { ...corsHeaders, ...rateLimitHeaders } }
      );
    }

    return NextResponse.json(
      { success: true, data: updated },
      { headers: { ...corsHeaders, ...rateLimitHeaders } }
    );
  } catch (error) {
    console.error('Error updating professional:', error);
    return NextResponse.json(
      { success: false, error: 'Falha ao atualizar profissional' },
      { status: 500, headers: corsHeaders }
    );
  }
}
