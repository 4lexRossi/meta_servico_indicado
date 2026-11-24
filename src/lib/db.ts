import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
  DynamoDBDocumentClient,
  ScanCommand,
  GetCommand,
  PutCommand,
  UpdateCommand,
} from '@aws-sdk/lib-dynamodb';
import { Professional } from '@/data/types';

// =============================================================================
// 1. AWS DynamoDB Client Setup
// =============================================================================

const region = process.env.APP_REGION || 'sa-east-1';
const accessKeyId = process.env.APP_ACCESS_KEY_ID || '';
const secretAccessKey = process.env.APP_SECRET_ACCESS_KEY || '';
const TABLE_NAME = process.env.APP_DYNAMODB_TABLE_NAME || 'ServicoIndicado_Professionals';

// Determine if valid AWS credentials are provided
const hasAwsCredentials = Boolean(
  accessKeyId &&
  accessKeyId.trim() !== '' &&
  secretAccessKey &&
  secretAccessKey.trim() !== ''
);

let docClient: DynamoDBDocumentClient | null = null;

if (hasAwsCredentials) {
  try {
    const rawClient = new DynamoDBClient({
      region,
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
    });

    docClient = DynamoDBDocumentClient.from(rawClient, {
      marshallOptions: {
        removeUndefinedValues: true,
      },
    });
  } catch (err) {
    console.warn('⚠️ Falha ao inicializar o cliente DynamoDB. Usando fallback em memória:', err);
    docClient = null;
  }
}

// In-Memory fallback store (used when AWS credentials are not yet configured)
let inMemoryDb: Professional[] = [];

// =============================================================================
// 2. Data Access Operations
// =============================================================================

/**
 * Fetch all professionals or filter by pillar, subcategory, region, or search
 */
export async function getProfessionals(filters?: {
  pillar?: string;
  subcategory?: string;
  region?: string;
  search?: string;
}): Promise<Professional[]> {
  let list: Professional[] = [];

  // Try fetching from AWS DynamoDB if configured
  if (docClient) {
    try {
      const command = new ScanCommand({
        TableName: TABLE_NAME,
      });
      const response = await docClient.send(command);
      list = (response.Items as Professional[]) || [];
    } catch (err) {
      console.warn('⚠️ Erro ao efetuar consulta. Usando dados locais como contingência:', err);
      list = [...inMemoryDb];
    }
  } else {
    // Development fallback
    list = [...inMemoryDb];
  }

  // Apply filters
  if (!filters) return list;

  if (filters.pillar) {
    list = list.filter(p => p.category === filters.pillar);
  }

  if (filters.subcategory) {
    list = list.filter(p => p.subcategory === filters.subcategory);
  }

  if (filters.region && filters.region !== 'Todas as Regiões') {
    list = list.filter(p => p.regions && p.regions.includes(filters.region!));
  }

  if (filters.search) {
    const q = filters.search.toLowerCase().trim();
    list = list.filter(p => {
      const matchName = p.name?.toLowerCase().includes(q);
      const matchHeadline = p.headline?.toLowerCase().includes(q);
      const matchBio = p.bio?.toLowerCase().includes(q);
      const matchTags = p.tags?.some(t => t.toLowerCase().includes(q));
      const matchSub = p.subcategory?.toLowerCase().includes(q);
      return matchName || matchHeadline || matchBio || matchTags || matchSub;
    });
  }

  return list;
}

/**
 * Get single professional by primary key (id)
 */
export async function getProfessionalById(id: string): Promise<Professional | null> {
  if (docClient) {
    try {
      const command = new GetCommand({
        TableName: TABLE_NAME,
        Key: { id },
      });
      const response = await docClient.send(command);
      if (response.Item) {
        return response.Item as Professional;
      }
    } catch (err) {
      console.warn(`⚠️ Erro ao buscar profissional com ID ${id}:`, err);
    }
  }

  const found = inMemoryDb.find(p => p.id === id);
  return found || null;
}

/**
 * Create a new professional in DynamoDB
 */
export async function createProfessional(data: Partial<Professional>): Promise<Professional> {
  const newPro: Professional = {
    id: `pro-${Date.now()}`,
    name: data.name || 'Novo Prestador',
    headline: data.headline || 'Profissional Qualificado',
    category: data.category || 'reparos',
    subcategory: data.subcategory || 'encanamento',
    rating: 5.0,
    reviewsCount: 1,
    regions: data.regions && data.regions.length > 0 ? data.regions : ['Zona Sul'],
    avatar: data.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80',
    phone: data.phone?.replace(/\D/g, '') || '11999998888',
    priceEstimate: data.priceEstimate || 'Orçamento sem compromisso',
    experienceYears: data.experienceYears || 5,
    tags: data.tags && data.tags.length > 0 ? data.tags : ['Profissional Verificado'],
    bio: data.bio || 'Prestador de serviços cadastrado na rede do Serviço Indicado.',
    verified: true,
    badges: data.badges || (data.emailVerified ? ['Cadastro Verificado', 'Novo Indicado', 'E-mail Verificado'] : ['Cadastro Verificado', 'Novo Indicado']),
    email: data.email,
    emailVerified: data.emailVerified || false,
    emailVerificationToken: data.emailVerificationToken,
    emailVerificationExpires: data.emailVerificationExpires,
    passwordHash: data.passwordHash,
    portfolio: data.portfolio || [],
    reviews: [
      { name: 'Equipe Serviço Indicado', stars: 5, text: 'Profissional recém-cadastrado na rede de indicações verificadas.' }
    ],
  };

  if (docClient) {
    try {
      const command = new PutCommand({
        TableName: TABLE_NAME,
        Item: newPro,
      });
      await docClient.send(command);
      console.log(`[DynamoDB] Profissional ${newPro.name} salvo com sucesso na tabela ${TABLE_NAME}.`);
    } catch (err) {
      console.error('⚠️ Falha ao salvar:', err);
    }
  }

  // Always update in-memory cache as well
  inMemoryDb.unshift(newPro);
  return newPro;
}

/**
 * Update an existing professional's profile fields (partial update)
 */
export async function updateProfessional(
  id: string,
  patch: Partial<Professional>
): Promise<Professional | null> {
  // Find in memory first (always kept in sync)
  const idx = inMemoryDb.findIndex((p) => p.id === id);
  if (idx === -1) return null;

  const updated: Professional = { ...inMemoryDb[idx], ...patch, id };
  inMemoryDb[idx] = updated;

  if (docClient) {
    try {
      // Build a DynamoDB UpdateExpression from the patch keys
      const fields = Object.keys(patch).filter((k) => k !== 'id');
      if (fields.length > 0) {
        const UpdateExpression =
          'SET ' + fields.map((f) => `#${f} = :${f}`).join(', ');
        const ExpressionAttributeNames = Object.fromEntries(
          fields.map((f) => [`#${f}`, f])
        );
        const ExpressionAttributeValues = Object.fromEntries(
          fields.map((f) => [`:${f}`, (patch as Record<string, unknown>)[f]])
        );

        await docClient.send(
          new UpdateCommand({
            TableName: TABLE_NAME,
            Key: { id },
            UpdateExpression,
            ExpressionAttributeNames,
            ExpressionAttributeValues,
          })
        );
        console.log(`[DynamoDB] Profissional ${id} atualizado com sucesso.`);
      }
    } catch (err) {
      console.error('⚠️ Falha ao atualizar:', err);
    }
  }

  return updated;
}

/**
 * Find professional by phone number
 */
export async function getProfessionalByPhone(phone: string): Promise<Professional | null> {
  const cleanPhone = phone.replace(/\D/g, '');
  if (!cleanPhone) return null;

  // Check in-memory list first
  const foundInMemory = inMemoryDb.find(p => {
    const pPhone = p.phone.replace(/\D/g, '');
    return pPhone === cleanPhone || pPhone.endsWith(cleanPhone) || cleanPhone.endsWith(pPhone);
  });
  if (foundInMemory) return foundInMemory;

  // If docClient is active, scan all pros
  if (docClient) {
    try {
      const allPros = await getProfessionals();
      const match = allPros.find(p => {
        const pPhone = p.phone.replace(/\D/g, '');
        return pPhone === cleanPhone || pPhone.endsWith(cleanPhone) || cleanPhone.endsWith(pPhone);
      });
      if (match) return match;
    } catch (err) {
      console.warn('⚠️ Erro ao buscar profissional por telefone:', err);
    }
  }

  return null;
}

/**
 * Find professional by email
 */
export async function getProfessionalByEmail(email: string): Promise<Professional | null> {
  const cleanEmail = email?.trim().toLowerCase();
  if (!cleanEmail) return null;

  // Check in-memory list first
  const foundInMemory = inMemoryDb.find(
    (p) => p.email && p.email.toLowerCase() === cleanEmail
  );
  if (foundInMemory) return foundInMemory;

  // If docClient is active, scan all pros
  if (docClient) {
    try {
      const allPros = await getProfessionals();
      const match = allPros.find(
        (p) => p.email && p.email.toLowerCase() === cleanEmail
      );
      if (match) return match;
    } catch (err) {
      console.warn('⚠️ Erro ao buscar profissional por email:', err);
    }
  }

  return null;
}

/**
 * Find professional by email, phone or ID
 */
export async function getProfessionalByEmailOrPhone(identifier: string): Promise<Professional | null> {
  const trimmed = identifier.trim();
  if (!trimmed) return null;

  const isEmail = trimmed.includes('@');
  const cleanPhone = trimmed.replace(/\D/g, '');

  const matchesPro = (p: Professional) => {
    if (p.id === trimmed) return true;
    if (isEmail && p.email && p.email.toLowerCase() === trimmed.toLowerCase()) return true;
    if (cleanPhone.length >= 8) {
      const pPhone = p.phone.replace(/\D/g, '');
      if (pPhone === cleanPhone || pPhone.endsWith(cleanPhone) || cleanPhone.endsWith(pPhone)) return true;
    }
    return false;
  };

  const foundInMemory = inMemoryDb.find(matchesPro);
  if (foundInMemory) return foundInMemory;

  if (docClient) {
    try {
      const allPros = await getProfessionals();
      const match = allPros.find(matchesPro);
      if (match) return match;
    } catch (err) {
      console.warn('⚠️ Erro ao buscar profissional por email/telefone:', err);
    }
  }

  return null;
}

/**
 * Find professional by email verification token
 */
export async function getProfessionalByVerificationToken(token: string): Promise<Professional | null> {
  const cleanToken = token?.trim();
  if (!cleanToken) return null;

  // Check in-memory list first
  const foundInMemory = inMemoryDb.find(p => p.emailVerificationToken === cleanToken);
  if (foundInMemory) return foundInMemory;

  // If docClient is active, scan all pros
  if (docClient) {
    try {
      const allPros = await getProfessionals();
      const match = allPros.find(p => p.emailVerificationToken === cleanToken);
      if (match) return match;
    } catch (err) {
      console.warn('⚠️ Erro ao buscar token de verificação:', err);
    }
  }

  return null;
}

/**
 * Verify a professional's email address by token
 */
export async function verifyProfessionalEmail(token: string): Promise<{ success: boolean; pro?: Professional; error?: string }> {
  const cleanToken = token?.trim();
  if (!cleanToken) {
    return { success: false, error: 'Token de verificação inválido ou ausente.' };
  }

  const pro = await getProfessionalByVerificationToken(cleanToken);
  if (!pro) {
    return { success: false, error: 'Link de verificação inválido ou expirado.' };
  }

  // Check expiration if set
  if (pro.emailVerificationExpires) {
    const expiresAt = new Date(pro.emailVerificationExpires).getTime();
    if (!isNaN(expiresAt) && expiresAt < Date.now()) {
      return { success: false, error: 'Este link de verificação expirou. Solicite um novo link no seu painel.' };
    }
  }

  const currentBadges = Array.isArray(pro.badges) ? pro.badges : [];
  const updatedBadges = currentBadges.includes('E-mail Verificado')
    ? currentBadges
    : [...currentBadges, 'E-mail Verificado'];

  const updated = await updateProfessional(pro.id, {
    emailVerified: true,
    emailVerificationToken: undefined,
    emailVerificationExpires: undefined,
    badges: updatedBadges,
  });

  return { success: true, pro: updated || undefined };
}

/**
 * Update verification token for an existing professional
 */
export async function setProfessionalVerificationToken(
  id: string,
  token: string,
  expires: string
): Promise<Professional | null> {
  return await updateProfessional(id, {
    emailVerified: false,
    emailVerificationToken: token,
    emailVerificationExpires: expires,
  });
}
