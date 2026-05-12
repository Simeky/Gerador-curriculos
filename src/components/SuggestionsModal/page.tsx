"use client";

import {
  AlertCircle,
  CheckCircle,
  Info,
  X,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Suggestion,
  SuggestionSeverity,
} from '@/lib/SuggestionsService';

interface SuggestionsModalProps {
  suggestions: Suggestion[];
  score: number;
  isOpen: boolean;
  onClose: () => void;
}

const severityConfig = {
  [SuggestionSeverity.CRITICAL]: {
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
    borderLeftColor: 'border-l-red-500',
    iconColor: 'text-red-600',
    badgeBg: 'bg-red-100',
    badgeText: 'text-red-800',
    icon: AlertCircle,
    label: 'Crítico',
  },
  [SuggestionSeverity.HIGH]: {
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-200',
    borderLeftColor: 'border-l-orange-500',
    iconColor: 'text-orange-600',
    badgeBg: 'bg-orange-100',
    badgeText: 'text-orange-800',
    icon: AlertCircle,
    label: 'Alto',
  },
  [SuggestionSeverity.MEDIUM]: {
    bgColor: 'bg-yellow-50',
    borderColor: 'border-yellow-200',
    borderLeftColor: 'border-l-yellow-500',
    iconColor: 'text-yellow-600',
    badgeBg: 'bg-yellow-100',
    badgeText: 'text-yellow-800',
    icon: Info,
    label: 'Médio',
  },
  [SuggestionSeverity.LOW]: {
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    borderLeftColor: 'border-l-blue-500',
    iconColor: 'text-blue-600',
    badgeBg: 'bg-blue-100',
    badgeText: 'text-blue-800',
    icon: CheckCircle,
    label: 'Baixo',
  },
};

export default function SuggestionsModal({
  suggestions,
  score,
  isOpen,
  onClose,
}: SuggestionsModalProps) {
  if (!isOpen) return null;

  const criticalCount = suggestions.filter(
    s => s.severity === SuggestionSeverity.CRITICAL,
  ).length;
  const highCount = suggestions.filter(
    s => s.severity === SuggestionSeverity.HIGH,
  ).length;

  return (
    <>
      {/* Overlay de fundo */}
      <div
        className="fixed inset-0 bg-black/50 z-40 transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed right-0 top-0 h-full w-full sm:w-96 bg-white shadow-2xl z-50 overflow-y-auto animate-in slide-in-from-right-full duration-300">
        {/* Header */}
        <div className="sticky top-0 bg-linear-to-r from-indigo-50 to-blue-50 border-b border-indigo-200 p-6 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Sugestões de Melhoria</h2>
            <p className="text-sm text-slate-600 mt-1">
              Qualidade: <span className="font-semibold text-indigo-600">{score}%</span>
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1"
            aria-label="Fechar"
          >
            <X size={24} />
          </button>
        </div>

        {/* Conteúdo */}
        <div className="p-6 space-y-4">
          {/* Resumo de Severidade */}
          <div className="grid grid-cols-2 gap-3 pb-4 border-b border-slate-200">
            <div className="text-center">
              <p className="text-2xl font-bold text-red-600">{criticalCount}</p>
              <p className="text-xs text-slate-600">Crítica{criticalCount !== 1 ? 's' : ''}</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-orange-600">{highCount}</p>
              <p className="text-xs text-slate-600">Importante{highCount !== 1 ? 's' : ''}</p>
            </div>
          </div>

          {/* Lista de Sugestões */}
          <div className="space-y-3">
            {suggestions.map(suggestion => {
              const config = severityConfig[suggestion.severity];
              const IconComponent = config.icon;

              return (
                <div
                  key={suggestion.id}
                  className={`p-4 rounded-lg border-l-4 ${config.bgColor} ${config.borderLeftColor} ${config.borderColor} border`}
                >
                  <div className="flex gap-3">
                    <IconComponent
                      className={`${config.iconColor} shrink-0 mt-0.5`}
                      size={18}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h4 className="font-semibold text-slate-900 text-sm">
                          {suggestion.title}
                        </h4>
                        <span
                          className={`text-xs font-semibold px-2 py-0.5 rounded-full whitespace-nowrap shrink-0 ${config.badgeBg} ${config.badgeText}`}
                        >
                          {config.label}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 mb-2">{suggestion.description}</p>
                      <p className="text-xs font-medium text-slate-700">
                        💡 {suggestion.action}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Footer */}
          <div className="pt-4 border-t border-slate-200">
            <Button
              onClick={onClose}
              variant="outline"
              className="w-full"
            >
              Fechar
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
