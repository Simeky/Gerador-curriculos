"use client";

import {
  Suspense,
  useEffect,
  useState,
} from 'react';

import {
  ArrowLeft,
  Mail,
  Phone,
  Printer,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  FaGithub,
  FaLinkedin,
} from 'react-icons/fa';

import { ResumeData } from '@/app/sistema/curriculos/gerador/validacao';
import Nav from '@/components/nav/page';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

function DetalhesCurriculoContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get('id') ?? '';
  
  const [curriculo, setCurriculo] = useState<ResumeData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCurriculo = async () => {
      if (!id) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`/api/curriculo?id=${encodeURIComponent(id)}`);
        const data = await response.json();

        if (!response.ok || !data.sucesso) {
          console.error('Currículo não encontrado ou erro:', data);
          setCurriculo(null);
          return;
        }

        setCurriculo(data.curriculo);
      } catch (error) {
        console.error('Erro ao buscar currículo:', error);
        setCurriculo(null);
      } finally {
        setLoading(false);
      }
    };

    fetchCurriculo();
  }, [id]);

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Nav />
        <div className="max-w-7xl mx-auto p-4 md:p-8">
          <p className="text-center text-slate-500">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!curriculo) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Nav />
        <div className="max-w-7xl mx-auto p-4 md:p-8">
          <p className="text-center text-slate-600 mb-6">Currículo não encontrado.</p>
          <div className="text-center">
            <Link href="/curriculos/visualizar">
              <Button>Voltar para Lista</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const { fullName, jobTitle, email, phone, github, linkedin, summary, experience, education } = curriculo;

  return (
    <div className="min-h-screen bg-slate-50">
      <Nav />
      
      <div className="max-w-5xl mx-auto p-4 md:p-8">
        <div className="mb-6 flex justify-between items-center print:hidden">
          <Link href="/curriculos/visualizar" className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-semibold transition-colors">
            <ArrowLeft className="w-4 h-4" /> Voltar
          </Link>
          <Button
            onClick={handlePrint}
            variant="default"
            className="flex items-center gap-2"
          >
            <Printer className="w-4 h-4" /> Imprimir/PDF
          </Button>
        </div>

        <Card id="resume-container" className="print:shadow-none print:border-none p-8 md:p-10">
          <header className="flex flex-col md:flex-row items-center md:items-start gap-6 border-b border-slate-200 pb-6 mb-6">
            <div className="w-24 h-24 relative rounded-full overflow-hidden bg-slate-100 shrink-0 border border-slate-200">
              <Image 
                src={`https://ui-avatars.com/api/?name=${encodeURIComponent(fullName || 'Usuário')}&background=0D8ABC&color=fff&size=256`} 
                alt="Foto de perfil" 
                fill 
                className="object-cover"
              />
            </div>
            
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl font-bold text-slate-900 mb-1">{fullName}</h1>
              <p className="text-xl text-indigo-600 font-medium mb-4">{jobTitle}</p>
              
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-6 gap-y-2 text-sm text-slate-600">
                {email && (
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-slate-400" />
                    <span>{email}</span>
                  </div>
                )}
                {phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-slate-400" />
                    <span>{phone}</span>
                  </div>
                )}
                {linkedin && (
                  <div className="flex items-center gap-2">
                    <FaLinkedin className="w-4 h-4 text-slate-400" />
                    <a href={linkedin} target="_blank" rel="noreferrer" className="hover:text-indigo-600">{linkedin.replace('https://', '')}</a>
                  </div>
                )}
                {github && (
                  <div className="flex items-center gap-2">
                    <FaGithub className="w-4 h-4 text-slate-400" />
                    <a href={github} target="_blank" rel="noreferrer" className="hover:text-indigo-600">{github.replace('https://', '')}</a>
                  </div>
                )}
              </div>
            </div>
          </header>

          {summary && (
            <section className="mb-8">
              <h2 className="text-lg font-bold text-slate-900 uppercase tracking-wider mb-3 border-b-2 border-indigo-600 inline-block pb-1">
                Resumo Profissional
              </h2>
              <p className="text-slate-700 leading-relaxed whitespace-pre-line wrap-break-word">
                {summary}
              </p>
            </section>
          )}

          <section className="mb-8">
            <h2 className="text-lg font-bold text-slate-900 uppercase tracking-wider mb-4 border-b-2 border-indigo-600 inline-block pb-1">
              Experiência Profissional
            </h2>
            {experience && experience.length > 0 ? (
              experience.map((exp, index) => (
                <div key={index} className="mb-6">
                  <h3 className="font-semibold text-slate-900">{exp.position} na {exp.company}</h3>
                  <p className="text-slate-600 text-sm">{exp.startDate} até {exp.endDate || 'Presente'}</p>
                  <p className="text-slate-700 mt-2 whitespace-pre-line">{exp.description}</p>
                </div>
              ))
            ) : (
              <div className="text-slate-500 italic text-sm">
                Nenhuma experiência adicionada.
              </div>
            )}
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 uppercase tracking-wider mb-4 border-b-2 border-indigo-600 inline-block pb-1">
              Formação Acadêmica
            </h2>
            {education && education.length > 0 ? (
              education.map((edu, index) => (
                <div key={index} className="mb-4">
                  <h3 className="font-semibold text-slate-900">{edu.degree}</h3>
                  <p className="text-slate-600">{edu.institution}</p>
                  <p className="text-slate-600 text-sm">{edu.year}</p>
                </div>
              ))
            ) : (
              <div className="text-slate-500 italic text-sm">
                Nenhuma formação adicionada.
              </div>
            )}
          </section>
        </Card>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          body * {
            visibility: hidden;
          }
          #resume-container, #resume-container * {
            visibility: visible;
          }
          #resume-container {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            padding: 0;
            margin: 0;
          }
        }
      `}} />
    </div>
  );
}

export default function DetalhesCurriculoPage() {
  return (
    <Suspense>
      <DetalhesCurriculoContent />
    </Suspense>
  );
}