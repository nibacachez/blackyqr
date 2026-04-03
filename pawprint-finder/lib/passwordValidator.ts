export interface PasswordValidationResult {
  isValid: boolean;
  errors: string[];
  suggestions: string[];
}

export function validatePassword(password: string): PasswordValidationResult {
  const errors: string[] = [];
  const suggestions: string[] = [];

  if (password.length < 8) {
    errors.push('La contraseña debe tener al menos 8 caracteres');
    suggestions.push(`Agranda la contraseña a ${8 - password.length} caracteres más`);
  }

  if (!/[A-Z]/.test(password)) {
    errors.push('La contraseña debe incluir al menos una letra mayúscula');
    suggestions.push('Añade una letra mayúscula (A-Z)');
  }

  if (!/[a-z]/.test(password)) {
    errors.push('La contraseña debe incluir al menos una letra minúscula');
    suggestions.push('Añade una letra minúscula (a-z)');
  }

  if (!/[0-9]/.test(password)) {
    errors.push('La contraseña debe incluir al menos un número');
    suggestions.push('Añade un número (0-9)');
  }

  return {
    isValid: errors.length === 0,
    errors,
    suggestions: [...new Set(suggestions)], // Eliminar duplicados
  };
}
