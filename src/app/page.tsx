"use client";

import { useState } from "react";
import { ResumeForm } from "@/app/components/resume/ResumeForm";
import { ResumePreview } from "@/app/components/resume/ResumePreview";
import { ResumeData } from "@/types/resume";
import { Nav } from "@/app/components/Nav";

export default function Home() {
  const [resumeData, setResumeData] = useState<ResumeData | null>(null);

  const handlePrint = () => {
    window.print();
  };

  return (
    <main className="min-h-screen bg-slate-50 font-sans text-slate-900">
      <Nav />
      <div className="max-w-7xl mx-auto space-y-6 p-4 md:p-8">
        <header className="text-center md:text-left print:hidden">
          <h1 className="text-4xl font-bold tracking-tight text-slate-900">Gerador de Currículo</h1>
          <p className="text-slate-500 mt-2">Crie seu currículo profissional rapidamente preenchendo o formulário abaixo.</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          <section className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 md:p-8 print:hidden">
            <h2 className="text-2xl font-semibold mb-6">Seus Dados</h2>
            <ResumeForm onDataChange={setResumeData} />
          </section>

          <section className="sticky top-8 print:static">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-0 md:p-0 min-h-[800px] print:border-none print:shadow-none">
              <div className="p-6 md:p-8 pb-0 flex justify-between items-center print:hidden border-b border-slate-100 mb-6">
                <h2 className="text-2xl font-semibold">Visualização</h2>
                <button
                  onClick={handlePrint}
                  className="text-sm bg-slate-900 text-white px-4 py-2 rounded-md hover:bg-slate-800 transition-colors"
                >
                  Imprimir/PDF
                </button>
              </div>
              {resumeData ? (
                <div className="overflow-hidden bg-white h-full print:m-0">
                  <ResumePreview data={resumeData} />
                </div>
              ) : (
                <div className="h-[600px] flex items-center justify-center text-slate-400 border-2 border-dashed border-slate-200 rounded-lg m-6 p-12 text-center print:hidden">
                  Preencha o formulário ao lado para visualizar seu currículo aqui.
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}