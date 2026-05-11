import { Curriculo } from './CurriculoService';

export enum SuggestionSeverity {
  CRITICAL = 'critical',
  HIGH = 'high',
  MEDIUM = 'medium',
  LOW = 'low',
}

export interface Suggestion {
  id: string;
  title: string;
  description: string;
  severity: SuggestionSeverity;
  action: string;
  section: string;
}

/**
 * Valida email em formato correto
 */
function isValidEmail(email: string): boolean {
  if (!email) return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Valida telefone brasileiro
 */
function isValidPhone(phone: string): boolean {
  if (!phone) return false;
  const numbers = phone.replace(/\D/g, '');
  return numbers.length === 10 || numbers.length === 11;
}

/**
 * Calcula similaridade entre strings (compatibilidade entre cargo desejado e habilidades)
 */
function calculateSimilarity(str1: string, str2: string): number {
  const s1 = str1.toLowerCase().trim();
  const s2 = str2.toLowerCase().trim();
  
  if (s1 === s2) return 1;
  
  // Palavras-chave relacionadas a tecnologia/profissão
  const keywords1 = s1.split(/\s+/);
  const keywords2 = s2.split(/\s+/);
  
  const matches = keywords1.filter(k => keywords2.some(k2 => k === k2)).length;
  const maxLen = Math.max(keywords1.length, keywords2.length);
  
  return matches / maxLen;
}

/**
 * Analisa um currículo e retorna sugestões de melhoria ordenadas por prioridade
 */
export function analisarCurriculo(curriculo: Curriculo): Suggestion[] {
  const suggestions: Suggestion[] = [];

  // 1. Verificar resumo profissional
  if (!curriculo.summary || curriculo.summary.trim().length < 50) {
    suggestions.push({
      id: 'short_summary',
      title: 'Resumo Profissional Muito Curto',
      description: 'Seu resumo profissional tem menos de 50 caracteres. Um bom resumo deve ter entre 150-300 caracteres para destacar seus pontos fortes.',
      severity: SuggestionSeverity.CRITICAL,
      action: 'Expanda seu resumo profissional com informações sobre sua experiência, objetivos e especialidades',
      section: 'Resumo Profissional',
    });
  }

  // 2. Verificar experiências profissionais
  if (!curriculo.experience || curriculo.experience.length === 0) {
    suggestions.push({
      id: 'no_experience',
      title: 'Ausência de Experiências Profissionais',
      description: 'Nenhuma experiência profissional foi cadastrada. Adicione suas experiências para fortalecer seu currículo.',
      severity: SuggestionSeverity.CRITICAL,
      action: 'Adicione pelo menos 2-3 experiências profissionais relevantes com descrições detalhadas',
      section: 'Experiência Profissional',
    });
  }

  // 3. Verificar formação acadêmica
  if (!curriculo.education || curriculo.education.length === 0) {
    suggestions.push({
      id: 'no_education',
      title: 'Ausência de Formação Acadêmica',
      description: 'Nenhuma formação acadêmica foi cadastrada. Adicione suas formações para completar o perfil.',
      severity: SuggestionSeverity.CRITICAL,
      action: 'Adicione sua formação acadêmica (escolaridade, cursos, certificações)',
      section: 'Formação Acadêmica',
    });
  }

  // 4. Verificar habilidades
  if (!curriculo.skills || curriculo.skills.length < 5) {
    const skillCount = curriculo.skills?.length || 0;
    suggestions.push({
      id: 'few_skills',
      title: 'Poucas Habilidades Cadastradas',
      description: `Você tem apenas ${skillCount} habilidade(s) cadastrada(s). O ideal é ter entre 5-10 habilidades relevantes.`,
      severity: skillCount === 0 ? SuggestionSeverity.CRITICAL : SuggestionSeverity.HIGH,
      action: `Adicione mais habilidades relevantes para sua área (você tem ${skillCount}, ideal é 5-10)`,
      section: 'Habilidades',
    });
  }

  // 5. Verificar email inválido
  if (!isValidEmail(curriculo.email)) {
    suggestions.push({
      id: 'invalid_email',
      title: 'E-mail Inválido',
      description: `O email "${curriculo.email}" não está em um formato válido. Use o formato: usuario@dominio.com`,
      severity: SuggestionSeverity.CRITICAL,
      action: 'Corrija o e-mail para um formato válido (ex: seu.email@dominio.com)',
      section: 'Contato',
    });
  }

  // 6. Verificar telefone inválido
  if (!isValidPhone(curriculo.phone)) {
    suggestions.push({
      id: 'invalid_phone',
      title: 'Telefone Inválido',
      description: `O telefone "${curriculo.phone}" não está em um formato válido. Use o formato brasileiro: (XX) XXXXX-XXXX ou (XX) XXXX-XXXX`,
      severity: SuggestionSeverity.CRITICAL,
      action: 'Corrija o telefone para um formato válido brasileiro',
      section: 'Contato',
    });
  }

  // 7. Verificar compatibilidade entre cargo desejado e habilidades
  if (curriculo.jobTitle && curriculo.skills && curriculo.skills.length > 0) {
    const skillsStr = curriculo.skills.map(s => s.skill).join(' ');
    const similarity = calculateSimilarity(curriculo.jobTitle, skillsStr);
    
    if (similarity < 0.3) {
      suggestions.push({
        id: 'incompatible_job_skills',
        title: 'Cargo Desejado Incompatível com Habilidades',
        description: `As habilidades cadastradas parecem desalinhadas com o cargo "${curriculo.jobTitle}". Revise se as habilidades são adequadas.`,
        severity: SuggestionSeverity.MEDIUM,
        action: `Verifique se as habilidades são compatíveis com o cargo "${curriculo.jobTitle}" ou considere ajustar uma delas`,
        section: 'Alinhamento Profissional',
      });
    }
  }

  // 8. Verificar se tem links de contato (GitHub/LinkedIn)
  if (!curriculo.linkedin && !curriculo.github) {
    suggestions.push({
      id: 'no_contact_links',
      title: 'Sem Links de Contato Profissional',
      description: 'Você não adicionou links de GitHub ou LinkedIn. Esses links aumentam a visibilidade profissional.',
      severity: SuggestionSeverity.LOW,
      action: 'Adicione links de GitHub ou LinkedIn para complementar seu perfil',
      section: 'Contato',
    });
  }

  // 9. Verificar se tem foto de perfil
  if (!curriculo.profileImage) {
    suggestions.push({
      id: 'no_profile_image',
      title: 'Sem Foto de Perfil',
      description: 'Uma foto de perfil profissional aumenta a credibilidade e memorabilidade do seu currículo.',
      severity: SuggestionSeverity.LOW,
      action: 'Adicione uma foto profissional ao seu perfil',
      section: 'Foto de Perfil',
    });
  }

  // Ordenar por severidade (CRITICAL > HIGH > MEDIUM > LOW)
  const severityOrder = {
    [SuggestionSeverity.CRITICAL]: 0,
    [SuggestionSeverity.HIGH]: 1,
    [SuggestionSeverity.MEDIUM]: 2,
    [SuggestionSeverity.LOW]: 3,
  };

  suggestions.sort((a, b) => severityOrder[a.severity] - severityOrder[b.severity]);

  return suggestions;
}

/**
 * Retorna sugestões filtradas por severidade
 */
export function getFiltredSuggestions(
  curriculo: Curriculo,
  severity?: SuggestionSeverity
): Suggestion[] {
  const allSuggestions = analisarCurriculo(curriculo);
  
  if (!severity) {
    return allSuggestions;
  }
  
  return allSuggestions.filter(s => s.severity === severity);
}

/**
 * Calcula score de completude do currículo (0-100)
 */
export function calculateCompletenessScore(curriculo: Curriculo): number {
  let score = 0;
  const maxPoints = 10;

  // 1. Informações básicas (20 pontos)
  if (curriculo.fullName && curriculo.fullName.trim()) score += 2;
  if (curriculo.email && isValidEmail(curriculo.email)) score += 2;
  if (curriculo.phone && isValidPhone(curriculo.phone)) score += 2;
  if (curriculo.jobTitle && curriculo.jobTitle.trim()) score += 2;
  if (curriculo.summary && curriculo.summary.trim().length >= 50) score += 2;

  // 2. Experiência (30 pontos)
  if (curriculo.experience && curriculo.experience.length > 0) {
    score += 1.5;
  }
  if (curriculo.experience && curriculo.experience.length >= 2) {
    score += 1.5;
  }
  if (curriculo.experience && curriculo.experience.length >= 3) {
    score += 1;
  }

  // 3. Educação (20 pontos)
  if (curriculo.education && curriculo.education.length > 0) {
    score += 2;
  }

  // 4. Habilidades (20 pontos)
  if (curriculo.skills && curriculo.skills.length > 0) {
    score += 1;
  }
  if (curriculo.skills && curriculo.skills.length >= 5) {
    score += 1;
  }
  if (curriculo.skills && curriculo.skills.length >= 10) {
    score += 1;
  }

  // 5. Links profissionais (10 pontos)
  if (curriculo.linkedin || curriculo.github) score += 1;

  // 6. Foto de perfil (10 pontos)
  if (curriculo.profileImage) score += 1;

  // Normalizar para 0-100
  const percentage = Math.round((score / maxPoints) * 100);
  return Math.min(percentage, 100);
}

/**
 * Retorna recomendações de prioridade (o que fazer primeiro para melhorar o currículo)
 */
export function getPriorityRecommendations(curriculo: Curriculo): string[] {
  const suggestions = analisarCurriculo(curriculo);
  const criticalSuggestions = suggestions.filter(s => s.severity === SuggestionSeverity.CRITICAL);
  
  return criticalSuggestions.map(s => s.action);
}
