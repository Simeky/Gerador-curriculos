"use client";

import { useEffect } from 'react';

import {
  Briefcase,
  FileText,
  Mail,
  Phone,
  Plus,
  Save,
  Trash2,
  User,
} from 'lucide-react';
import {
  useFieldArray,
  useForm,
} from 'react-hook-form';
import {
  FaGithub,
  FaLinkedin,
} from 'react-icons/fa';
import { toast } from 'sonner';

import {
  ResumeData,
  resumeSchema,
} from '@/app/sistema/curriculos/gerador/validacao';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { yupResolver } from '@hookform/resolvers/yup';
import { InputMask } from '@react-input/mask';

interface FormCurriculoProps {
  onDataChange: (data: ResumeData) => void;
  onSave?: (data: ResumeData) => void;
}

export default function FormCurriculo({ onDataChange, onSave }: FormCurriculoProps) {
  const {
    register,
    watch,
    getValues,
    control,
    formState: { errors, isValid },
  } = useForm<ResumeData>({
    resolver: yupResolver(resumeSchema as never),
    mode: "onChange",
    defaultValues: {
      fullName: " ",
      jobTitle: "",
      email: "",
      phone: "",
      github: "",
      linkedin: "",
      summary: "",
      experience: [],
      education: []
    }
  });

  const { fields: experienceFields, append: appendExperience, remove: removeExperience } = useFieldArray({
    control,
    name: "experience",
  });

  const { fields: educationFields, append: appendEducation, remove: removeEducation } = useFieldArray({
    control,
    name: "education",
  });

  useEffect(() => {
    onDataChange(getValues() as ResumeData);
    
    const subscription = watch((value: { [x: string]: unknown; }) => {
      onDataChange(value as ResumeData);
    });
    
    return () => subscription.unsubscribe();
  }, [watch, getValues, onDataChange]);

  const handleSaveLayout = async () => {
    if (!isValid) {
      // Coletar todos os erros do formulário
      const erros: string[] = [];
      const fields = watch();
      
      if (fields.fullName === '' || fields.fullName === undefined) {
        erros.push('Nome completo');
      }
      if (fields.jobTitle === '' || fields.jobTitle === undefined) {
        erros.push('Cargo pretendido');
      }
      if (fields.email === '' || fields.email === undefined) {
        erros.push('E-mail');
      }
      if (fields.phone === '' || fields.phone === undefined) {
        erros.push('Telefone');
      }
      if (fields.summary === '' || fields.summary === undefined) {
        erros.push('Resumo profissional');
      } else if (typeof fields.summary === 'string' && fields.summary.length < 20) {
        erros.push('Resumo deve ter pelo menos 20 caracteres');
      }

      // Verificar erros específicos dos campos
      if (errors.fullName?.message) erros.push(`Nome: ${errors.fullName.message}`);
      if (errors.jobTitle?.message) erros.push(`Cargo: ${errors.jobTitle.message}`);
      if (errors.email?.message) erros.push(`E-mail: ${errors.email.message}`);
      if (errors.phone?.message) erros.push(`Telefone: ${errors.phone.message}`);
      if (errors.linkedin?.message) erros.push(`LinkedIn: ${errors.linkedin.message}`);
      if (errors.github?.message) erros.push(`GitHub: ${errors.github.message}`);
      if (errors.summary?.message) erros.push(`Resumo: ${errors.summary.message}`);

      // Verificar erros em experiências
      if (experienceFields.length > 0) {
        experienceFields.forEach((_, index) => {
          if (errors.experience?.[index]?.company) {
            erros.push(`Experiência ${index + 1} - Empresa: ${errors.experience[index].company.message}`);
          }
          if (errors.experience?.[index]?.position) {
            erros.push(`Experiência ${index + 1} - Cargo: ${errors.experience[index].position.message}`);
          }
          if (errors.experience?.[index]?.startDate) {
            erros.push(`Experiência ${index + 1} - Data início: ${errors.experience[index].startDate.message}`);
          }
          if (errors.experience?.[index]?.description) {
            erros.push(`Experiência ${index + 1} - Descrição: ${errors.experience[index].description.message}`);
          }
        });
      }

      // Verificar erros em formações
      if (educationFields.length > 0) {
        educationFields.forEach((_, index) => {
          if (errors.education?.[index]?.institution) {
            erros.push(`Formação ${index + 1} - Instituição: ${errors.education[index].institution.message}`);
          }
          if (errors.education?.[index]?.degree) {
            erros.push(`Formação ${index + 1} - Curso: ${errors.education[index].degree.message}`);
          }
          if (errors.education?.[index]?.year) {
            erros.push(`Formação ${index + 1} - Ano: ${errors.education[index].year.message}`);
          }
        });
      }

      // Mostrar toast com os erros específicos
      if (erros.length > 0) {
        toast.error(`Preencha os campos obrigatórios: ${erros.join(', ')}`, {
          duration: 5000,
        });
      } else {
        toast.error('Por favor, preencha todos os campos obrigatórios corretamente');
      }
      return;
    }

    const curriculoData = getValues();

    try {
      const response = await fetch('/api/curriculo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(curriculoData),
      });

      const result = await response.json();

      if (!response.ok || !result.sucesso) {
        throw new Error(result.erro || 'Erro ao salvar currículo no banco');
      }

      toast.success('Currículo salvo no banco com sucesso!', {
        position: 'bottom-right',
        duration: 3000,
      });

      if (onSave) {
        onSave(curriculoData);
      }
    } catch (error) {
      console.error('Erro ao salvar currículo no banco:', error);
      toast.error('Erro ao salvar no banco. Tente novamente.', {
        duration: 5000,
      });
    }
  };

  return (
    <form className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-slate-900 border-b pb-2">Informações Pessoais</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="fullName" className="flex items-center gap-2">
              <User className="text-slate-400 w-4 h-4" />
              Nome Completo *
            </Label>
            <Input id="fullName" placeholder="Ex: João Silva" {...register("fullName")} />
            {errors.fullName && <p className="text-sm text-red-500">{errors.fullName.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="jobTitle" className="flex items-center gap-2">
              <Briefcase className="text-slate-400 w-4 h-4" />
              Cargo Desejado *
            </Label>
            <Input id="jobTitle" placeholder="Ex: Desenvolvedor Front-end" {...register("jobTitle")} />
            {errors.jobTitle && <p className="text-sm text-red-500">{errors.jobTitle.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="flex items-center gap-2">
              <Mail className="text-slate-400 w-4 h-4" />
              E-mail *
            </Label>
            <Input id="email" type="email" placeholder="Ex: joao@email.com" {...register("email")} />
            {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
          </div>

          <div className="space-y-2 flex flex-col">
            <Label htmlFor="phone" className="flex items-center gap-2">
              <Phone className="text-slate-400 w-4 h-4" />
              Telefone *
            </Label>
            <InputMask 
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
              mask="(__) _____-____" 
              replacement={{ _: /\d/ }}
              {...register("phone")}
              id="phone" 
              placeholder="(00) 00000-0000" 
              type="tel"
            />
            {errors.phone && <p className="text-sm text-red-500">{errors.phone.message}</p>}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="linkedin" className="flex items-center gap-2">
              <FaLinkedin className="text-slate-400 w-4 h-4" />
              LinkedIn URL
            </Label>
            <Input id="linkedin" type="url" placeholder="https://linkedin.com/in/..." {...register("linkedin")} />
            {errors.linkedin && <p className="text-sm text-red-500">{errors.linkedin.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="github" className="flex items-center gap-2">
              <FaGithub className="text-slate-400 w-4 h-4" />
              GitHub URL
            </Label>
            <Input id="github" type="url" placeholder="https://github.com/..." {...register("github")} />
            {errors.github && <p className="text-sm text-red-500">{errors.github.message}</p>}
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium text-slate-900 border-b pb-2">Resumo Profissional</h3>
        <div className="space-y-2">
          <Label htmlFor="summary" className="flex items-center gap-2">
            <FileText className="text-slate-400 w-4 h-4" />
            Sobre você *
          </Label>
          <Textarea 
            id="summary" 
            placeholder="Descreva suas habilidades, objetivos e um breve resumo da sua carreira..." 
            className="min-h-30"
            {...register("summary")} 
          />
          {errors.summary && <p className="text-sm text-red-500">{errors.summary.message}</p>}
        </div>
      </div>
      
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-slate-900 border-b pb-2">Experiência Profissional</h3>
        {experienceFields.map((field, index) => (
          <div key={field.id} className="border border-slate-200 rounded-lg p-4 space-y-4">
            <div className="flex justify-between items-center">
              <h4 className="font-medium">Experiência {index + 1}</h4>
              <Button type="button" variant="ghost" size="sm" onClick={() => removeExperience(index)} className="text-red-600 hover:text-red-700 hover:bg-red-50">
                <Trash2 className="mr-2 w-4 h-4" /> Remover
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Empresa *</Label>
                <Input {...register(`experience.${index}.company`)} />
                {errors.experience?.[index]?.company && <p className="text-sm text-red-500">{errors.experience[index].company.message}</p>}
              </div>
              <div className="space-y-2">
                <Label>Cargo *</Label>
                <Input {...register(`experience.${index}.position`)} />
                {errors.experience?.[index]?.position && <p className="text-sm text-red-500">{errors.experience[index].position.message}</p>}
              </div>
              <div className="space-y-2">
                <Label>Data de Início *</Label>
                <Input type="month" {...register(`experience.${index}.startDate`)} />
                {errors.experience?.[index]?.startDate && <p className="text-sm text-red-500">{errors.experience[index].startDate.message}</p>}
              </div>
              <div className="space-y-2">
                <Label>Data de Fim</Label>
                <Input type="month" {...register(`experience.${index}.endDate`)} />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Descrição *</Label>
              <Textarea {...register(`experience.${index}.description`)} className="min-h-20" />
              {errors.experience?.[index]?.description && <p className="text-sm text-red-500">{errors.experience[index].description.message}</p>}
            </div>
          </div>
        ))}
        <Button type="button" variant="outline" onClick={() => appendExperience({ company: "", position: "", startDate: "", endDate: "", description: "" })}>
          <Plus className="mr-2 w-4 h-4" /> Adicionar Experiência
        </Button>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium text-slate-900 border-b pb-2">Formação Acadêmica</h3>
        {educationFields.map((field, index) => (
          <div key={field.id} className="border border-slate-200 rounded-lg p-4 space-y-4">
            <div className="flex justify-between items-center">
              <h4 className="font-medium">Formação {index + 1}</h4>
              <Button type="button" variant="ghost" size="sm" onClick={() => removeEducation(index)} className="text-red-600 hover:text-red-700 hover:bg-red-50">
                <Trash2 className="mr-2 w-4 h-4" /> Remover
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Instituição *</Label>
                <Input {...register(`education.${index}.institution`)} />
                {errors.education?.[index]?.institution && <p className="text-sm text-red-500">{errors.education[index].institution.message}</p>}
              </div>
              <div className="space-y-2">
                <Label>Grau/Curso *</Label>
                <Input {...register(`education.${index}.degree`)} />
                {errors.education?.[index]?.degree && <p className="text-sm text-red-500">{errors.education[index].degree.message}</p>}
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label>Ano de Conclusão *</Label>
                <Input type="number" {...register(`education.${index}.year`)} />
                {errors.education?.[index]?.year && <p className="text-sm text-red-500">{errors.education[index].year.message}</p>}
              </div>
            </div>
          </div>
        ))}
        <Button type="button" variant="outline" onClick={() => appendEducation({ institution: "", degree: "", year: "" })}>
          <Plus className="mr-2 w-4 h-4" /> Adicionar Formação
        </Button>
      </div>

      <div className="flex gap-4">
        <Button 
          type="button"
          onClick={handleSaveLayout}
          className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2"
        >
          <Save className="w-4 h-4" /> Salvar Layout
        </Button>
      </div>
    </form>
  );
}