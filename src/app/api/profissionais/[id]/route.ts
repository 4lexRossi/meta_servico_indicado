import { NextRequest, NextResponse } from 'next/server';
import { getProfessionalById } from '@/lib/db';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
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
