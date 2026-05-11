"use client";

import {
  useEffect,
  useMemo,
  useState,
} from 'react';

import {
  Edit,
  Lightbulb,
  Search,
  Trash2,
} from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

import Nav from '@/components/nav/page';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Curriculo as CurriculoType } from '@/lib/CurriculoService';
import { analisarCurriculo } from '@/lib/SuggestionsService';

interface Curriculo {
  id: string;
  fullName: string;
  cpf: string;
  jobTitle: string;
  summary: string;
  email?: string;
  phone?: string;
  skills?: Array<{ skill: string }>;
  experience?: Array<{ company: string; position: string }>;
  education?: Array<{ institution: string; degree: string }>;
  createdAt: string;
}

export default function ListaCurriculos() {
  const [curriculos, setCurriculos] = useState<Curriculo[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'name' | 'job'>('all');

  useEffect(() => {
    const fetchCurriculos = async () => {
      try {
        const response = await fetch('/api/curriculo');
        const data = await response.json();

        if (!response.ok || !data.sucesso) {
          throw new Error(data.erro || 'Erro ao carregar currículos');
        }

        const curriculosProcessados = data.curriculos.map((curriculo: Curriculo) => ({
          ...curriculo,
          createdAt: curriculo.createdAt || curriculo.createdAt || '',
        }));

        setCurriculos(curriculosProcessados);
      } catch (error) {
        console.error('Erro ao carregar currículos:', error);
        toast.error('Não foi possível carregar os currículos.');
      } finally {
        setLoading(false);
      }
    };

    fetchCurriculos();
  }, []);

  // Filtrar currículos baseado no termo de busca
  const filteredCurriculos = useMemo(() => {
    if (!searchTerm.trim()) return curriculos;

    const searchLower = searchTerm.toLowerCase();

    return curriculos.filter(curriculo => {
      if (filterType === 'name') {
        return curriculo.fullName.toLowerCase().includes(searchLower);
      } else if (filterType === 'job') {
        return curriculo.jobTitle.toLowerCase().includes(searchLower);
      } else {
        return (
          curriculo.fullName.toLowerCase().includes(searchLower) ||
          curriculo.jobTitle.toLowerCase().includes(searchLower)
        );
      }
    });
  }, [curriculos, searchTerm, filterType]);

  const handleDelete = async (id: string) => {
    const confirmDelete = window.confirm('Tem certeza que deseja deletar este currículo?');
    if (!confirmDelete) return;

    try {
      const response = await fetch(`/api/curriculo?id=${encodeURIComponent(id)}`, {
        method: 'DELETE',
      });
      const result = await response.json();

      if (!response.ok || !result.sucesso) {
        throw new Error(result.erro || 'Erro ao excluir currículo');
      }

      const atualizado = curriculos.filter((c: Curriculo) => c.id !== id);
      setCurriculos(atualizado);
      toast.success('Currículo deletado com sucesso');
    } catch (error) {
      console.error('Erro ao excluir currículo:', error);
      toast.error('Não foi possível excluir o currículo.');
    }
  };

  const formatDate = (createdAt: string) => {
    return new Date(createdAt).toLocaleDateString('pt-BR');
  };

  const getSuggestionCount = (curriculo: Curriculo) => {
    const suggestions = analisarCurriculo(curriculo as CurriculoType);
    return suggestions.length;
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

        {/* Search and Filter */}
        <div className="mb-6 space-y-4">
          <div className="flex gap-3 flex-col md:flex-row">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 text-slate-400" size={18} />
              <Input
                placeholder="Buscar por nome ou cargo..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant={filterType === 'all' ? 'default' : 'outline'}
                onClick={() => setFilterType('all')}
                size="sm"
              >
                Todos
              </Button>
              <Button
                variant={filterType === 'name' ? 'default' : 'outline'}
                onClick={() => setFilterType('name')}
                size="sm"
              >
                Por Nome
              </Button>
              <Button
                variant={filterType === 'job' ? 'default' : 'outline'}
                onClick={() => setFilterType('job')}
                size="sm"
              >
                Por Cargo
              </Button>
            </div>
          </div>
          {searchTerm && (
            <p className="text-sm text-slate-600">
              Encontrados {filteredCurriculos.length} de {curriculos.length} currículos
            </p>
          )}
        </div>

        {filteredCurriculos.length === 0 ? (
          <Card className="p-12 text-center">
            {searchTerm ? (
              <>
                <p className="text-slate-600 text-lg mb-6">
                  Nenhum currículo encontrado com &quot;{searchTerm}&quot;.
                </p>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchTerm('');
                    setFilterType('all');
                  }}
                >
                  Limpar Busca
                </Button>
              </>
            ) : (
              <>
                <p className="text-slate-600 text-lg mb-6">Nenhum currículo salvo ainda.</p>
                <Link href="/curriculos/gerador">
                  <Button>Criar Primeiro Currículo</Button>
                </Link>
              </>
            )}
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCurriculos.map((curriculo) => {
              const suggestionCount = getSuggestionCount(curriculo);
              return (
                <Card
                  key={curriculo.id}
                  className="relative group hover:shadow-lg hover:border-indigo-300 transition-all p-6 h-full flex flex-col"
                >
                  {/* Header com título e ações */}
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-slate-900 mb-1">
                        {curriculo.fullName}
                      </h3>
                      <p className="text-indigo-600 font-medium text-sm">{curriculo.jobTitle}</p>
                    </div>
                    <div className="flex gap-2">
                      <Link href={`/curriculos/editar/${curriculo.id}`}>
                        <button
                          className="text-indigo-600 hover:text-indigo-700 transition-colors p-2"
                          aria-label={`Editar currículo de ${curriculo.fullName}`}
                        >
                          <Edit size={16} />
                        </button>
                      </Link>
                      <button
                        onClick={() => handleDelete(curriculo.id)}
                        className="text-red-500 hover:text-red-700 transition-colors p-2"
                        aria-label={`Deletar currículo de ${curriculo.fullName}`}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>

                  {/* Resumo */}
                  <p className="text-slate-600 text-sm line-clamp-2 mb-3 flex-1">
                    {curriculo.summary}
                  </p>

                  {/* Sugestões */}
                  {suggestionCount > 0 && (
                    <Link
                      href={`/curriculos/sugestoes/${curriculo.id}`}
                      className="mb-3 inline-flex items-center gap-2 text-xs font-medium text-amber-600 hover:text-amber-700 transition-colors"
                    >
                      <Lightbulb size={14} />
                      {suggestionCount} sugestão{suggestionCount > 1 ? 'ões' : ''}
                    </Link>
                  )}

                  {/* Data */}
                  <div className="text-xs text-slate-400 border-t border-slate-100 pt-3 mt-auto">
                    Salvo em {formatDate(curriculo.createdAt)}
                  </div>

                  {/* Link invisível para visualizar */}
                  <Link
                    href={`/curriculos/visualizar/${curriculo.id}`}
                    className="absolute inset-0 z-0 group-hover:scale-105 transition-transform"
                    aria-label={`Visualizar currículo de ${curriculo.fullName}`}
                  />
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}