"use client";

import { useState } from 'react';

import { Printer } from 'lucide-react';

import { ResumeData } from '@/app/sistema/curriculos/gerador/validacao';
import FormCurriculo from '@/components/FormCurriculo/page';
import Nav from '@/components/nav/page';
import PreviewCurriculo from '@/components/PreviewCurriculo/page';
import RealTimeSuggestions from '@/components/RealTimeSuggestions/page';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export default function Gerador() {
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
          <Card className="p-6 md:p-8 print:hidden">
            <h2 className="text-2xl font-semibold mb-6">Seus Dados</h2>
            <FormCurriculo onDataChange={setResumeData} />
          </Card>

          <section className="lg:col-span-1 sticky top-8 print:static">
            <Card className="p-0 md:p-0 min-h-200 print:border-none print:shadow-none">
              <div className="p-6 md:p-8 pb-0 flex justify-between items-center print:hidden border-b border-slate-100 mb-6">
                <h2 className="text-2xl font-semibold">Visualização</h2>
                <Button
                  onClick={handlePrint}
                  variant="default"
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <Printer className="w-4 h-4" /> Imprimir/PDF
                </Button>
              </div>
              {resumeData ? (
                <div className="overflow-hidden bg-white h-full print:m-0">
                  <PreviewCurriculo data={resumeData} />
                </div>
              ) : (
                <div className="h-150 flex items-center justify-center text-slate-400 border-2 border-dashed border-slate-200 rounded-lg m-6 p-12 text-center print:hidden">
                  Preencha o formulário ao lado para visualizar seu currículo aqui.
                </div>
              )}
            </Card>
          </section>
        </div>

        {/* Componente de sugestões (botão flutuante) */}
        <RealTimeSuggestions resumeData={resumeData} />
      </div>
    </main>
  );
}