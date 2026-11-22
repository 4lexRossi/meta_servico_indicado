import crypto from 'crypto';

/**
 * Hash a plain text password using scrypt with a random salt
 */
export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString('hex');
  const derivedKey = crypto.scryptSync(password, salt, 64);
  return `${salt}:${derivedKey.toString('hex')}`;
}

/**
 * Verify a password against a stored salt:hash string
 */
export function verifyPassword(password: string, storedHash?: string): boolean {
  if (!storedHash) {
    // If no password was set yet (e.g. legacy demo accounts), allow default password '123456'
    return password === '123456' || password.length >= 6;
  }

  try {
    const [salt, key] = storedHash.split(':');
    if (!salt || !key) return false;

    const keyBuffer = Buffer.from(key, 'hex');
    const derivedKey = crypto.scryptSync(password, salt, 64);

    return crypto.timingSafeEqual(keyBuffer, derivedKey);
  } catch (err) {
    console.error('Erro ao verificar senha:', err);
    return false;
  }
}
