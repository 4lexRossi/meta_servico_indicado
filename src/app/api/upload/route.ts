import { NextRequest, NextResponse } from 'next/server';
import { uploadImageToS3, createPresignedUploadUrl } from '@/lib/s3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

// GET: Generate Pre-signed URL for direct frontend/mobile upload to S3
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const fileName = searchParams.get('fileName') || 'foto.jpg';
    const contentType = searchParams.get('contentType') || 'image/jpeg';

    const presigned = await createPresignedUploadUrl(fileName, contentType);

    return NextResponse.json(
      { success: true, data: presigned },
      { headers: corsHeaders }
    );
  } catch (error) {
    console.error('Error generating presigned url:', error);
    return NextResponse.json(
      { success: false, error: 'Falha ao gerar URL de upload' },
      { status: 500, headers: corsHeaders }
    );
  }
}

// POST: Direct multipart form data upload
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'Nenhum arquivo enviado' },
        { status: 400, headers: corsHeaders }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const s3Url = await uploadImageToS3(buffer, file.name, file.type || 'image/jpeg');

    return NextResponse.json(
      {
        success: true,
        message: 'Upload realizado com sucesso no S3 Standard!',
        url: s3Url,
      },
      { status: 201, headers: corsHeaders }
    );
  } catch (error) {
    console.error('Error uploading file to S3:', error);
    return NextResponse.json(
      { success: false, error: 'Erro ao processar upload para o S3' },
      { status: 500, headers: corsHeaders }
    );
  }
}
