import { NextRequest, NextResponse } from 'next/server';
import { verifyProfessionalEmail } from '@/lib/db';

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
    const token = searchParams.get('token');

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Token de verificação não informado' },
        { status: 400, headers: corsHeaders }
      );
    }

    const result = await verifyProfessionalEmail(token);
    if (!result.success || !result.pro) {
      return NextResponse.json(
        { success: false, error: result.error || 'Token inválido ou expirado' },
        { status: 400, headers: corsHeaders }
      );
    }

    const { passwordHash: _discard, ...safePro } = result.pro;

    return NextResponse.json(
      {
        success: true,
        message: 'E-mail verificado com sucesso!',
        data: safePro,
      },
      { headers: corsHeaders }
    );
  } catch (error) {
    console.error('Error verifying email:', error);
    return NextResponse.json(
      { success: false, error: 'Erro interno ao validar e-mail' },
      { status: 500, headers: corsHeaders }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const token = body?.token;

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Token de verificação não informado' },
        { status: 400, headers: corsHeaders }
      );
    }

    const result = await verifyProfessionalEmail(token);
    if (!result.success || !result.pro) {
      return NextResponse.json(
        { success: false, error: result.error || 'Token inválido ou expirado' },
        { status: 400, headers: corsHeaders }
      );
    }

    const { passwordHash: _discard, ...safePro } = result.pro;

    return NextResponse.json(
      {
        success: true,
        message: 'E-mail verificado com sucesso!',
        data: safePro,
      },
      { headers: corsHeaders }
    );
  } catch (error) {
    console.error('Error verifying email:', error);
    return NextResponse.json(
      { success: false, error: 'Erro interno ao validar e-mail' },
      { status: 500, headers: corsHeaders }
    );
  }
}
