import { NextResponse } from 'next/server';
import { generateCaptchaChallenge } from '@/lib/captcha';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function GET() {
  const challenge = generateCaptchaChallenge();
  return NextResponse.json(
    {
      success: true,
      challenge: {
        question: challenge.question,
        token: challenge.token,
      },
    },
    { headers: corsHeaders }
  );
}
