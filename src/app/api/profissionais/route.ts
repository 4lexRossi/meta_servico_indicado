import { NextRequest, NextResponse } from 'next/server';
import { getProfessionals, createProfessional } from '@/lib/db';

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
    const body = await request.json();

    if (!body.name || !body.phone) {
      return NextResponse.json(
        { success: false, error: 'Nome e WhatsApp são obrigatórios' },
        { status: 400, headers: corsHeaders }
      );
    }

    const newPro = await createProfessional(body);

    return NextResponse.json(
      {
        success: true,
        message: 'Profissional cadastrado com sucesso no Serviço Indicado!',
        data: newPro,
      },
      { status: 201, headers: corsHeaders }
    );
  } catch (error) {
    console.error('Error creating professional:', error);
    return NextResponse.json(
      { success: false, error: 'Falha ao cadastrar profissional' },
      { status: 500, headers: corsHeaders }
    );
  }
}
