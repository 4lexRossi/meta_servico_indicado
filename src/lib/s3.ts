import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const region = process.env.AWS_S3_REGION || process.env.AWS_REGION || 'sa-east-1';
const accessKeyId = process.env.AWS_ACCESS_KEY_ID || '';
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY || '';
const BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME || 'servico-indicado-assets';

const hasCredentials = Boolean(
  accessKeyId && accessKeyId.trim() !== '' &&
  secretAccessKey && secretAccessKey.trim() !== ''
);

let s3Client: S3Client | null = null;

if (hasCredentials) {
  try {
    s3Client = new S3Client({
      region,
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
    });
  } catch (err) {
    console.warn('⚠️ Falha ao inicializar cliente S3:', err);
  }
}

/**
 * Upload an image buffer directly to AWS S3 Standard
 */
export async function uploadImageToS3(
  fileBuffer: Buffer,
  fileName: string,
  contentType: string = 'image/jpeg'
): Promise<string> {
  const sanitizedName = fileName.replace(/[^a-zA-Z0-9.-]/g, '_');
  const key = `uploads/${Date.now()}-${sanitizedName}`;

  if (s3Client) {
    try {
      const command = new PutObjectCommand({
        Bucket: BUCKET_NAME,
        Key: key,
        Body: fileBuffer,
        ContentType: contentType,
        // StorageClass defaults to STANDARD in AWS S3
        StorageClass: 'STANDARD',
      });

      await s3Client.send(command);

      const s3Url = `https://${BUCKET_NAME}.s3.${region}.amazonaws.com/${key}`;
      console.log(`[S3 Standard] Imagem enviada com sucesso: ${s3Url}`);
      return s3Url;
    } catch (err) {
      console.error('⚠️ Erro ao fazer upload para o S3:', err);
      throw err;
    }
  }

  // Fallback for development if AWS S3 credentials are not yet set
  console.log('[S3 Fallback] Credenciais AWS S3 não informadas. Gerando URL mock local.');
  return `https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=600&q=80`;
}

/**
 * Generate a Pre-signed URL for direct browser-to-S3 upload (high performance)
 */
export async function createPresignedUploadUrl(
  fileName: string,
  contentType: string = 'image/jpeg'
): Promise<{ uploadUrl: string; fileUrl: string }> {
  const sanitizedName = fileName.replace(/[^a-zA-Z0-9.-]/g, '_');
  const key = `uploads/${Date.now()}-${sanitizedName}`;
  const fileUrl = `https://${BUCKET_NAME}.s3.${region}.amazonaws.com/${key}`;

  if (!s3Client) {
    return {
      uploadUrl: '',
      fileUrl: `https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=600&q=80`,
    };
  }

  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
    ContentType: contentType,
    StorageClass: 'STANDARD',
  });

  // URL valid for 5 minutes
  const uploadUrl = await getSignedUrl(s3Client, command, { expiresIn: 300 });

  return { uploadUrl, fileUrl };
}
