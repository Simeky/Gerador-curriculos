"use client";

import {
  useEffect,
  useState,
} from 'react';

import {
  ArrowLeft,
  Lightbulb,
} from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { toast } from 'sonner';

import Nav from '@/components/nav/page';
import SuggestionsCard from '@/components/SuggestionsCard/page';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import type { Curriculo } from '@/lib/CurriculoService';
import {
  analisarCurriculo,
  calculateCompletenessScore,
  Suggestion,
} from '@/lib/SuggestionsService';

export default function SuggestoesCurriculo() {
  const searchParams = useSearchParams();
  const id = searchParams.get('id') as string;

  const [curriculo, setCurriculo] = useState<Curriculo | null>(null);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [completenessScore, setCompletenessScore] = useState(0);
  const [loading, setLoading] = useState(true);

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
        const curr = data.curriculo as Curriculo;
        
        setCurriculo(curr);
        setSuggestions(analisarCurriculo(curr));
        setCompletenessScore(calculateCompletenessScore(curr));
      } catch (error) {
        console.error('Erro ao carregar currículo:', error);
        toast.error('Não foi possível carregar as sugestões do currículo.');
      } finally {
        setLoading(false);
      }
    };

    fetchCurriculo();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Nav />
        <div className="max-w-4xl mx-auto p-4 md:p-8">
          <p className="text-center text-slate-500">Carregando sugestões...</p>
        </div>
      </div>
    );
  }

  if (!curriculo) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Nav />
        <div className="max-w-4xl mx-auto p-4 md:p-8">
          <Card className="p-12 text-center">
            <p className="text-slate-600 text-lg mb-6">Currículo não encontrado.</p>
            <Link href="/curriculos/visualizar">
              <Button>Voltar à Lista</Button>
            </Link>
          </Card>
        </div>
      </div>
    );
  }

  const criticalSuggestions = suggestions.filter(s => s.severity === 'critical');
  const otherSuggestions = suggestions.filter(s => s.severity !== 'critical');

  return (
    <div className="min-h-screen bg-slate-50">
      <Nav />
      <div className="max-w-4xl mx-auto p-4 md:p-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/curriculos/visualizar">
            <Button variant="outline" size="sm" className="mb-4 gap-2">
              <ArrowLeft size={16} />
              Voltar
            </Button>
          </Link>
          
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold text-slate-900 mb-2">
                Sugestões de Melhoria
              </h1>
              <p className="text-slate-600">
                Currículo de: <span className="font-semibold">{curriculo.fullName}</span>
              </p>
            </div>
            
            <Card className="p-6 bg-linear-to-br from-indigo-50 to-indigo-100 border-indigo-200 min-w-max">
              <div className="text-center">
                <Lightbulb className="mx-auto mb-2 text-indigo-600" size={24} />
                <div className="text-3xl font-bold text-indigo-900">{completenessScore}%</div>
                <div className="text-sm text-indigo-700 mt-1">Completude</div>
              </div>
            </Card>
          </div>
        </div>

        <div className="space-y-8">
          {criticalSuggestions.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold text-red-900 mb-4 flex items-center gap-2">
                <span className="text-red-600">⚠️</span>
                Problemas Críticos ({criticalSuggestions.length})
              </h2>
              <SuggestionsCard suggestions={criticalSuggestions} />
            </div>
          )}

          {otherSuggestions.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">
                Outras Sugestões ({otherSuggestions.length})
              </h2>
              <SuggestionsCard suggestions={otherSuggestions} />
            </div>
          )}

          {suggestions.length === 0 && (
            <Card className="p-12 bg-green-50 border-green-200 text-center">
              <div className="flex justify-center mb-4">
                <Lightbulb className="text-green-600" size={48} />
              </div>
              <h2 className="text-2xl font-bold text-green-900 mb-2">Excelente Currículo!</h2>
              <p className="text-green-800">
                Seu currículo está otimizado. Não há sugestões de melhoria no momento.
              </p>
            </Card>
          )}
        </div>

        <div className="mt-12 flex gap-4 justify-center">
          <Link href={`/curriculos/editar?id=${id}`}>
            <Button size="lg" className="gap-2">
              ✏️ Editar Currículo
            </Button>
          </Link>
          <Link href={`/curriculos/visualizar/${id}`}>
            <Button variant="outline" size="lg" className="gap-2">
              👁️ Visualizar
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
