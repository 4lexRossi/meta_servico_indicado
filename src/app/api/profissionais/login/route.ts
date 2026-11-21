import { NextRequest, NextResponse } from 'next/server';
import { getProfessionalByPhone, getProfessionalById, getProfessionals } from '@/lib/db';

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
