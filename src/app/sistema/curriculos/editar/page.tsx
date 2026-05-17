"use client";

import {
  useEffect,
  useState,
} from 'react';

import {
  ArrowLeft,
  Printer,
  Save,
} from 'lucide-react';
import Link from 'next/link';
import {
  useRouter,
  useSearchParams,
} from 'next/navigation';
import { toast } from 'sonner';

import { ResumeData } from '@/app/sistema/curriculos/gerador/validacao';
import FormCurriculo from '@/components/FormCurriculo/page';
import Nav from '@/components/nav/page';
import PreviewCurriculo from '@/components/PreviewCurriculo/page';
import RealTimeSuggestions from '@/components/RealTimeSuggestions/page';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export default function EditarCurriculo() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get('id');

  const [resumeData, setResumeData] = useState<ResumeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchCurriculo = async () => {
      if (!id) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`/api/curriculo?id=${encodeURIComponent(id)}`);

        if (!response.ok) {
          throw new Error('Currículo não encontrado');
        }

        const data = await response.json();
        setResumeData(data.curriculo);
      } catch (error) {
        console.error('Erro ao carregar currículo:', error);
        toast.error('Não foi possível carregar o currículo para edição.');
        router.push('/curriculos/visualizar');
      } finally {
        setLoading(false);
      }
    };

    fetchCurriculo();
  }, [id, router]);

  const handleSave = async (data?: ResumeData) => {
    if (!id) {
      toast.error('ID do currículo não encontrado.');
      return;
    }

    const bodyData = data ?? resumeData;
    if (!bodyData) {
      toast.error('Nenhum currículo para salvar.');
      return;
    }

    setSaving(true);
    try {
      const response = await fetch(`/api/curriculo?id=${encodeURIComponent(id)}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bodyData),
      });

      const result = await response.json();

      if (!response.ok || !result.sucesso) {
        throw new Error(result.erro || 'Erro ao salvar currículo');
      }

      toast.success('Currículo atualizado com sucesso!');
      router.push('/curriculos/visualizar');
    } catch (error) {
      console.error('Erro ao salvar currículo:', error);
      toast.error('Não foi possível salvar o currículo.');
    } finally {
      setSaving(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Nav />
        <div className="max-w-7xl mx-auto p-4 md:p-8">
          <p className="text-center text-slate-500">Carregando currículo...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 font-sans text-slate-900">
      <Nav />
      <div className="max-w-7xl mx-auto space-y-6 p-4 md:p-8">
        <div className="flex items-center justify-between print:hidden">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <Link href="/curriculos/visualizar">
                <Button variant="outline" size="icon" className="h-8 w-8">
                  <ArrowLeft size={16} />
                </Button>
              </Link>
              <h1 className="text-4xl font-bold tracking-tight text-slate-900">Editar Currículo</h1>
            </div>
            <p className="text-slate-500">Atualize as informações do seu currículo</p>
          </div>
          <Button
            onClick={() => handleSave()}
            disabled={saving}
            className="flex items-center gap-2"
          >
            <Save size={18} />
            {saving ? 'Salvando...' : 'Salvar'}
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          <Card className="p-6 md:p-8 print:hidden">
            <h2 className="text-2xl font-semibold mb-6">Seus Dados</h2>
            {resumeData && (
              <FormCurriculo
                onDataChange={setResumeData}
                onSave={handleSave}
                initialData={resumeData}
              />
            )}
          </Card>

          <section className="sticky top-8 print:static space-y-4">
            <RealTimeSuggestions resumeData={resumeData} />

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
                  Carregando visualização...
                </div>
              )}
            </Card>
          </section>
        </div>
      </div>
    </main>
  );
}
