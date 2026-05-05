import * as yup from 'yup';

/**
 * Máscara para telefone brasileiro: (XX) XXXXX-XXXX
 * Aceita números com ou sem formatação
 */
export const mascaraTelefone = (value: string) => {
  if (!value) return value;
  
  // Remove tudo que não é número
  const numbers = value.replace(/\D/g, '');
  
  // Limita a 11 dígitos
  if (numbers.length > 11) {
    return numbers.slice(0, 11);
  }
  
  // Aplica a máscara conforme os dígitos são digitados
  if (numbers.length <= 2) {
    return numbers;
  } else if (numbers.length <= 6) {
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
  } else {
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7)}`;
  }
};

/**
 * Valida telefone brasileiro: (XX) XXXXX-XXXX ou apenas números
 * Deve ter 10 ou 11 dígitos
 */
export const validadorTelefone = yup
  .string()
  .required('Telefone é obrigatório')
  .test(
    'valid-phone',
    'Telefone deve ter 10 ou 11 dígitos válidos',
    (value) => {
      if (!value) return false;
      const numbers = value.replace(/\D/g, '');
      return numbers.length === 10 || numbers.length === 11;
    }
  );

/**
 * Valida email em formato correto
 * Aceita formatos padrão de email
 */
export const validadorEmail = yup
  .string()
  .required('E-mail é obrigatório')
  .email('E-mail deve estar em um formato válido (ex: usuario@dominio.com)')
  .test(
    'valid-email-format',
    'E-mail deve conter um domínio válido',
    (value) => {
      if (!value) return false;
      // Verifica se tem pelo menos um ponto depois do @
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(value);
    }
  );

/**
 * Máscara para CPF brasileiro: XXX.XXX.XXX-XX
 * Aceita números com ou sem formatação
 */
export const mascaraCPF = (value: string) => {
  if (!value) return value;
  
  // Remove tudo que não é número
  const numbers = value.replace(/\D/g, '');
  
  // Limita a 11 dígitos
  if (numbers.length > 11) {
    return numbers.slice(0, 11);
  }
  
  // Aplica a máscara conforme os dígitos são digitados
  if (numbers.length <= 3) {
    return numbers;
  } else if (numbers.length <= 6) {
    return `${numbers.slice(0, 3)}.${numbers.slice(3)}`;
  } else if (numbers.length <= 9) {
    return `${numbers.slice(0, 3)}.${numbers.slice(3, 6)}.${numbers.slice(6)}`;
  } else {
    return `${numbers.slice(0, 3)}.${numbers.slice(3, 6)}.${numbers.slice(6, 9)}-${numbers.slice(9)}`;
  }
};

/**
 * Valida CPF brasileiro: XXX.XXX.XXX-XX ou apenas números
 * Deve ter 11 dígitos e passar na validação de CPF
 */
export const validadorCPF = yup
  .string()
  .required('CPF é obrigatório')
  .test(
    'valid-cpf',
    'CPF deve ter 11 dígitos válidos',
    (value) => {
      if (!value) return false;
      const numbers = value.replace(/\D/g, '');
      if (numbers.length !== 11) return false;
      
      // Verifica se todos os dígitos são iguais (CPF inválido)
      if (/^(\d)\1{10}$/.test(numbers)) return false;
      
      // Validação do primeiro dígito verificador
      let sum = 0;
      let remainder;
      for (let i = 1; i <= 9; i++) {
        sum += parseInt(numbers.substring(i - 1, i)) * (11 - i);
      }
      remainder = (sum * 10) % 11;
      if (remainder === 10 || remainder === 11) remainder = 0;
      if (remainder !== parseInt(numbers.substring(9, 10))) return false;
      
      // Validação do segundo dígito verificador
      sum = 0;
      for (let i = 1; i <= 10; i++) {
        sum += parseInt(numbers.substring(i - 1, i)) * (12 - i);
      }
      remainder = (sum * 10) % 11;
      if (remainder === 10 || remainder === 11) remainder = 0;
      if (remainder !== parseInt(numbers.substring(10, 11))) return false;
      
      return true;
    }
  );
