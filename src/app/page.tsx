"use client";

import { useState } from "react";
import { ResumeForm } from "@/app/components/resume/ResumeForm";
import { ResumePreview } from "@/app/components/resume/ResumePreview";
import { ResumeData } from "@/types/resume";

export default function Home() {
  const [resumeData, setResumeData] = useState<ResumeData | null>(null);

  const handlePrint = () => {
    window.print();
  };

  return (
    <main className="min-h-screen bg-slate-50 p-4 md:p-8 font-sans text-slate-900">
      <div className="max-w-7xl mx-auto space-y-6">
        <header className="text-center md:text-left print:hidden">
          <h1 className="text-4xl font-bold tracking-tight text-slate-900">Gerador de Currículo</h1>
          <p className="text-slate-500 mt-2">Crie seu currículo profissional rapidamente preenchendo o formulário abaixo.</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          <section className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 md:p-8 print:hidden">
            <h2 className="text-2xl font-semibold mb-6">Seus Dados</h2>
            <ResumeForm onDataChange={setResumeData} />
          </section>
        </div>
      </div>
    </main>
  );
}