/**
 * Phone mask and validation utilities for Brazilian phone numbers.
 * Target format: (00) 00000-0000 (11 digits: DDD + 9-digit mobile)
 */

/**
 * Strips all non-numeric characters and formats into (00) 00000-0000 mask.
 */
export function formatPhone(value: string | undefined | null): string {
  if (!value) return '';
  const digits = String(value).replace(/\D/g, '').slice(0, 11);

  if (digits.length === 0) return '';
  if (digits.length <= 2) {
    return `(${digits}`;
  }
  if (digits.length <= 7) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  }
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7, 11)}`;
}

/**
 * Validates whether the given phone number satisfies the Brazilian (00) 00000-0000 format.
 */
export function validatePhone(value: string | undefined | null): { isValid: boolean; error?: string } {
  if (!value) {
    return { isValid: false, error: 'O número de contato é obrigatório.' };
  }

  const digits = String(value).replace(/\D/g, '');

  if (digits.length === 0) {
    return { isValid: false, error: 'O número de contato é obrigatório.' };
  }

  if (digits.length < 9) {
    return { isValid: false, error: 'Número incompleto. Digite no formato (00) 00000-0000 com 10 a 11 dígitos.' };
  }

  if (digits.length > 11) {
    return { isValid: false, error: 'O número deve ter no máximo 11 dígitos com DDD.' };
  }

  // DDD check (must be a valid 2-digit Brazilian DDD between 11 and 99)
  const ddd = parseInt(digits.slice(0, 2), 10);
  if (isNaN(ddd) || ddd < 11 || ddd > 99) {
    return { isValid: false, error: 'DDD inválido. Informe um DDD brasileiro válido (ex: 11, 21, 31).' };
  }

  return { isValid: true };
}
