import { useEffect } from 'react';

import { useForm } from 'react-hook-form';
import { InputMask } from '@react-input/mask';

import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Textarea } from '@/app/components/ui/textarea';
import {
  ResumeData,
  resumeSchema,
} from '@/types/resume';
import { yupResolver } from '@hookform/resolvers/yup';

interface ResumeFormProps {
  onDataChange: (data: ResumeData) => void;
}

export function ResumeForm({ onDataChange }: ResumeFormProps) {
  const {
    register,
    watch,
    getValues,
    formState: { errors },
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

  useEffect(() => {
    onDataChange(getValues() as ResumeData);
    
    const subscription = watch((value) => {
      onDataChange(value as ResumeData);
    });
    
    return () => subscription.unsubscribe();
  }, [watch, getValues, onDataChange]);

  return (
    <form className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-slate-900 border-b pb-2">Informações Pessoais</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="fullName">Nome Completo *</Label>
            <Input id="fullName" placeholder="Ex: João Silva" {...register("fullName")} />
            {errors.fullName && <p className="text-sm text-red-500">{errors.fullName.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="jobTitle">Cargo Pretendido *</Label>
            <Input id="jobTitle" placeholder="Ex: Desenvolvedor Front-end" {...register("jobTitle")} />
            {errors.jobTitle && <p className="text-sm text-red-500">{errors.jobTitle.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">E-mail *</Label>
            <Input id="email" type="email" placeholder="Ex: joao@email.com" {...register("email")} />
            {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
          </div>

          <div className="space-y-2 flex flex-col">
            <Label htmlFor="phone">Telefone *</Label>
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
            <Label htmlFor="linkedin">LinkedIn URL</Label>
            <Input id="linkedin" type="url" placeholder="https://linkedin.com/in/..." {...register("linkedin")} />
            {errors.linkedin && <p className="text-sm text-red-500">{errors.linkedin.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="github">GitHub URL</Label>
            <Input id="github" type="url" placeholder="https://github.com/..." {...register("github")} />
            {errors.github && <p className="text-sm text-red-500">{errors.github.message}</p>}
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium text-slate-900 border-b pb-2">Resumo Profissional</h3>
        <div className="space-y-2">
          <Label htmlFor="summary">Sobre você *</Label>
          <Textarea 
            id="summary" 
            placeholder="Descreva suas habilidades, objetivos e um breve resumo da sua carreira..." 
            className="min-h-[120px]"
            {...register("summary")} 
          />
          {errors.summary && <p className="text-sm text-red-500">{errors.summary.message}</p>}
        </div>
      </div>
      
      <div className="pt-4">
        <Button type="button" className="w-full" onClick={() => window.print()}>
          Finalizar e Imprimir / Salvar PDF
        </Button>
      </div>
    </form>
  );
}