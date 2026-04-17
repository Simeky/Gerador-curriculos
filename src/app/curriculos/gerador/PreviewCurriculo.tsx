"use client";

import Image from 'next/image';
import {
  FaEnvelope,
  FaGithub,
  FaLinkedin,
  FaPhone,
} from 'react-icons/fa';

import { ResumeData } from '@/types/resume';

interface PreviewCurriculoProps {
  data: ResumeData;
}

export function PreviewCurriculo({ data }: PreviewCurriculoProps) {
  const { fullName, jobTitle, email, phone, github, linkedin, summary } = data;

  return (
    <div className="bg-white p-8 md:p-10 font-sans text-slate-800" id="resume-preview">
      <header className="flex flex-col md:flex-row items-center md:items-start gap-6 border-b border-slate-200 pb-6 mb-6">
        <div className="w-24 h-24 relative rounded-full overflow-hidden bg-slate-100 flex-shrink-0 border border-slate-200">
          <Image 
            src={`https://ui-avatars.com/api/?name=${encodeURIComponent(fullName || 'Usuário')}&background=0D8ABC&color=fff&size=256`} 
            alt="Foto de perfil" 
            fill 
            className="object-cover"
          />
        </div>
        
        <div className="flex-1 text-center md:text-left">
          <h1 className="text-3xl font-bold text-slate-900 mb-1">{fullName || "Seu Nome Completo"}</h1>
          <p className="text-xl text-indigo-600 font-medium mb-4">{jobTitle || "Cargo ou situação atual"}</p>
          
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-6 gap-y-2 text-sm text-slate-600">
            {email && (
              <div className="flex items-center gap-2">
                <FaEnvelope className="text-slate-400" />
                <span>{email}</span>
              </div>
            )}
            {phone && (
              <div className="flex items-center gap-2">
                <FaPhone className="text-slate-400" />
                <span>{phone}</span>
              </div>
            )}
            {linkedin && (
              <div className="flex items-center gap-2">
                <FaLinkedin className="text-slate-400" />
                <a href={linkedin} target="_blank" rel="noreferrer" className="hover:text-indigo-600">{linkedin.replace('https://', '')}</a>
              </div>
            )}
            {github && (
              <div className="flex items-center gap-2">
                <FaGithub className="text-slate-400" />
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
          <p className="text-slate-700 leading-relaxed whitespace-pre-line break-words">
            {summary}
          </p>
        </section>
      )}

      <section className="mb-8">
        <h2 className="text-lg font-bold text-slate-900 uppercase tracking-wider mb-4 border-b-2 border-indigo-600 inline-block pb-1">
          Experiência Profissional
        </h2>
        {data.experience && data.experience.length > 0 ? (
          data.experience.map((exp, index) => (
            <div key={index} className="mb-6">
              <h3 className="font-semibold text-slate-900">{exp.position} na {exp.company}</h3>
              <p className="text-slate-600 text-sm">{exp.startDate} até {exp.endDate || 'Presente'}</p>
              <p className="text-slate-700 mt-2 whitespace-pre-line">{exp.description}</p>
            </div>
          ))
        ) : (
          <div className="text-slate-500 italic text-sm">
            A seção de experiências será exibida aqui conforme for adicionada.
          </div>
        )}
      </section>

      <section>
        <h2 className="text-lg font-bold text-slate-900 uppercase tracking-wider mb-4 border-b-2 border-indigo-600 inline-block pb-1">
          Formação Acadêmica
        </h2>
        {data.education && data.education.length > 0 ? (
          data.education.map((edu, index) => (
            <div key={index} className="mb-4">
              <h3 className="font-semibold text-slate-900">{edu.degree}</h3>
              <p className="text-slate-600">{edu.institution}</p>
              <p className="text-slate-600 text-sm">{edu.year}</p>
            </div>
          ))
        ) : (
          <div className="text-slate-500 italic text-sm">
            A seção de formação será exibida aqui conforme for adicionada.
          </div>
        )}
      </section>
      
      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          body * {
            visibility: hidden;
          }
          #resume-preview, #resume-preview * {
            visibility: visible;
          }
          #resume-preview {
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
