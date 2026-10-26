import { NextResponse } from 'next/server';
import { CATEGORIES_DATA, REGIONS_LIST } from '@/data/categories';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function GET() {
  return NextResponse.json(
    {
      success: true,
      data: {
        categories: Object.values(CATEGORIES_DATA),
        regions: REGIONS_LIST,
      },
    },
    { headers: corsHeaders }
  );
}
