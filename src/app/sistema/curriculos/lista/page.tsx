"use client";

import {
  useEffect,
  useState,
} from 'react';

import { Trash2 } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

import Nav from '@/components/nav/page';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface Curriculo {
  id: string;
  fullName: string;
  jobTitle: string;
  summary: string;
  timestamp: string;
}

export default function ListaCurriculos() {
  const [curriculos, setCurriculos] = useState<Curriculo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    requestAnimationFrame(() => {
      const curriculosSalvos = JSON.parse(localStorage.getItem('curriculosSalvos') || '[]');
      setCurriculos(curriculosSalvos);
      setLoading(false);
    });
  }, []);

  const handleDelete = (id: string) => {
    const confirmDelete = window.confirm('Tem certeza que deseja deletar este currículo?');
    if (!confirmDelete) return;

    const curriculosSalvos = JSON.parse(localStorage.getItem('curriculosSalvos') || '[]');
    const atualizado = curriculosSalvos.filter((c: Curriculo) => c.id !== id);
    localStorage.setItem('curriculosSalvos', JSON.stringify(atualizado));
    setCurriculos(atualizado);
    toast.success('Currículo deletado com sucesso');
  };

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleDateString('pt-BR');
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

  return (
    <div className="min-h-screen bg-slate-50">
      <Nav />
      <div className="max-w-7xl mx-auto p-4 md:p-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Lista de Currículos</h1>
          <p className="text-slate-600">Visualize e gerencie todos os seus currículos salvos</p>
        </div>

        {curriculos.length === 0 ? (
          <Card className="p-12 text-center">
            <p className="text-slate-600 text-lg mb-6">Nenhum currículo salvo ainda.</p>
            <Link href="/curriculos/gerador">
              <Button>Criar Primeiro Currículo</Button>
            </Link>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {curriculos.map((curriculo) => (
              <Card key={curriculo.id} className="relative group hover:shadow-lg hover:border-indigo-300 transition-all p-6 h-full">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-slate-900 mb-1">{curriculo.fullName}</h3>
                    <p className="text-indigo-600 font-medium text-sm">{curriculo.jobTitle}</p>
                  </div>
                  <button
                    onClick={() => handleDelete(curriculo.id)}
                    className="text-red-500 hover:text-red-700 transition-colors p-2 relative z-20"
                    aria-label={`Deletar currículo de ${curriculo.fullName}`}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
                <p className="text-slate-600 text-sm line-clamp-3 mb-4">
                  {curriculo.summary}
                </p>
                <div className="text-xs text-slate-400">
                  Salvo em {formatDate(curriculo.timestamp)}
                </div>
                <Link href={`/curriculos/visualizar/${curriculo.id}`} className="absolute inset-0 z-10 group-hover:scale-105 transition-transform" aria-label={`Visualizar currículo de ${curriculo.fullName}`} />
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}