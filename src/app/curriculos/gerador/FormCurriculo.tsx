"use client";

import { useEffect } from 'react';

import {
  useFieldArray,
  useForm,
} from 'react-hook-form';
import {
  FaBriefcase,
  FaEnvelope,
  FaFileAlt,
  FaGithub,
  FaLinkedin,
  FaPhone,
  FaPlus,
  FaSave,
  FaTrash,
  FaUser,
} from 'react-icons/fa';
import { toast } from 'sonner';

import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Textarea } from '@/app/components/ui/textarea';
import {
  ResumeData,
  resumeSchema,
} from '@/types/resume';
import { yupResolver } from '@hookform/resolvers/yup';
import { InputMask } from '@react-input/mask';

interface FormCurriculoProps {
  onDataChange: (data: ResumeData) => void;
  onSave?: (data: ResumeData) => void;
}

export function FormCurriculo({ onDataChange, onSave }: FormCurriculoProps) {
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
      fullName: "",
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

  const handleSaveLayout = () => {
    if (!isValid) {
      toast.error('Por favor, preencha todos os campos obrigatórios corretamente');
      return;
    }

    const curriculoData = getValues();
    
    // Salvar no localStorage
    const curriculosSalvos = JSON.parse(localStorage.getItem('curriculosSalvos') || '[]');
    const novoId = Date.now().toString();
    
    const novoLayout = {
      id: novoId,
      timestamp: new Date().toISOString(),
      ...curriculoData
    };
    
    curriculosSalvos.push(novoLayout);
    localStorage.setItem('curriculosSalvos', JSON.stringify(curriculosSalvos));
    
    toast.success('Layout salvo com sucesso!', {
      position: 'bottom-right',
      duration: 3000,
    });

    if (onSave) {
      onSave(curriculoData);
    }
  };

  return (
    <form className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-slate-900 border-b pb-2">Informações Pessoais</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="fullName" className="flex items-center gap-2">
              <FaUser className="text-slate-400" />
              Nome Completo *
            </Label>
            <Input id="fullName" placeholder="Ex: João Silva" {...register("fullName")} />
            {errors.fullName && <p className="text-sm text-red-500">{errors.fullName.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="jobTitle" className="flex items-center gap-2">
              <FaBriefcase className="text-slate-400" />
              Cargo Pretendido *
            </Label>
            <Input id="jobTitle" placeholder="Ex: Desenvolvedor Front-end" {...register("jobTitle")} />
            {errors.jobTitle && <p className="text-sm text-red-500">{errors.jobTitle.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="flex items-center gap-2">
              <FaEnvelope className="text-slate-400" />
              E-mail *
            </Label>
            <Input id="email" type="email" placeholder="Ex: joao@email.com" {...register("email")} />
            {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
          </div>

          <div className="space-y-2 flex flex-col">
            <Label htmlFor="phone" className="flex items-center gap-2">
              <FaPhone className="text-slate-400" />
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
              <FaLinkedin className="text-slate-400" />
              LinkedIn URL
            </Label>
            <Input id="linkedin" type="url" placeholder="https://linkedin.com/in/..." {...register("linkedin")} />
            {errors.linkedin && <p className="text-sm text-red-500">{errors.linkedin.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="github" className="flex items-center gap-2">
              <FaGithub className="text-slate-400" />
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
            <FaFileAlt className="text-slate-400" />
            Sobre você *
          </Label>
          <Textarea 
            id="summary" 
            placeholder="Descreva suas habilidades, objetivos e um breve resumo da sua carreira..." 
            className="min-h-[120px]"
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
              <Button type="button" variant="outline" size="sm" onClick={() => removeExperience(index)}>
                <FaTrash className="mr-2" /> Remover
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
              <Textarea {...register(`experience.${index}.description`)} className="min-h-[80px]" />
              {errors.experience?.[index]?.description && <p className="text-sm text-red-500">{errors.experience[index].description.message}</p>}
            </div>
          </div>
        ))}
        <Button type="button" variant="outline" onClick={() => appendExperience({ company: "", position: "", startDate: "", endDate: "", description: "" })}>
          <FaPlus className="mr-2" /> Adicionar Experiência
        </Button>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium text-slate-900 border-b pb-2">Formação Acadêmica</h3>
        {educationFields.map((field, index) => (
          <div key={field.id} className="border border-slate-200 rounded-lg p-4 space-y-4">
            <div className="flex justify-between items-center">
              <h4 className="font-medium">Formação {index + 1}</h4>
              <Button type="button" variant="outline" size="sm" onClick={() => removeEducation(index)}>
                <FaTrash className="mr-2" /> Remover
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
          <FaPlus className="mr-2" /> Adicionar Formação
        </Button>
      </div>

      <div className="flex gap-4">
        <Button 
          type="button"
          onClick={handleSaveLayout}
          className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2"
        >
          <FaSave /> Salvar Layout
        </Button>
      </div>
    </form>
  );
}
