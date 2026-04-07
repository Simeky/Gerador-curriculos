import * as yup from 'yup';

export const resumeSchema = yup.object({
  fullName: yup.string().required('Nome completo é obrigatório'),
  jobTitle: yup.string().required('Cargo pretendido é obrigatório'),
  email: yup.string().email('E-mail inválido').required('E-mail é obrigatório'),
  phone: yup.string().required('Telefone é obrigatório'),
  github: yup.string().url('URL do GitHub inválida').optional(),
  linkedin: yup.string().url('URL do LinkedIn inválida').optional(),
  summary: yup.string().required('Resumo é obrigatório').min(20, 'O resumo deve ter pelo menos 20 caracteres'),
  experience: yup.array().of(
    yup.object({
      company: yup.string().required('Empresa é obrigatória'),
      position: yup.string().required('Cargo é obrigatório'),
      startDate: yup.string().required('Data de início é obrigatória'),
      endDate: yup.string().optional(),
      description: yup.string().required('Descrição é obrigatória'),
    })
  ).optional(),
  education: yup.array().of(
    yup.object({
      institution: yup.string().required('Instituição é obrigatória'),
      degree: yup.string().required('Grau/Curso é obrigatório'),
      year: yup.string().required('Ano de conclusão é obrigatório'),
    })
  ).optional()
}).required();

export type ResumeData = yup.InferType<typeof resumeSchema>;