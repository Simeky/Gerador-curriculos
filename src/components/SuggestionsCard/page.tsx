"use client";

import {
  AlertCircle,
  CheckCircle,
  Info,
  TrendingUp,
} from 'lucide-react';

import { Card } from '@/components/ui/card';
import {
  Suggestion,
  SuggestionSeverity,
} from '@/lib/SuggestionsService';

interface SuggestionsCardProps {
  suggestions: Suggestion[];
  compact?: boolean;
}

const severityConfig = {
  [SuggestionSeverity.CRITICAL]: {
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
    iconColor: 'text-red-600',
    icon: AlertCircle,
    label: 'Crítico',
  },
  [SuggestionSeverity.HIGH]: {
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-200',
    iconColor: 'text-orange-600',
    icon: AlertCircle,
    label: 'Alto',
  },
  [SuggestionSeverity.MEDIUM]: {
    bgColor: 'bg-yellow-50',
    borderColor: 'border-yellow-200',
    iconColor: 'text-yellow-600',
    icon: Info,
    label: 'Médio',
  },
  [SuggestionSeverity.LOW]: {
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    iconColor: 'text-blue-600',
    icon: CheckCircle,
    label: 'Baixo',
  },
};

export default function SuggestionsCard({ suggestions, compact = false }: SuggestionsCardProps) {
  if (!suggestions || suggestions.length === 0) {
    return (
      <Card className="p-6 border-green-200 bg-green-50">
        <div className="flex items-center gap-3">
          <CheckCircle className="text-green-600 shrink-0" size={24} />
          <div>
            <h3 className="font-semibold text-green-900">Currículo Excelente!</h3>
            <p className="text-sm text-green-800">Nenhuma sugestão de melhoria no momento.</p>
          </div>
        </div>
      </Card>
    );
  }

  const displaySuggestions = compact ? suggestions.slice(0, 3) : suggestions;
  const hasMore = compact && suggestions.length > 3;

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp size={20} className="text-slate-700" />
        <h3 className="font-semibold text-slate-900">
          Sugestões de Melhoria ({suggestions.length})
        </h3>
      </div>

      {displaySuggestions.map((suggestion) => {
        const config = severityConfig[suggestion.severity];
        const IconComponent = config.icon;

        return (
          <Card
            key={suggestion.id}
            className={`p-4 border-l-4 ${config.bgColor} border-l-red-500 ${
              suggestion.severity === SuggestionSeverity.HIGH && 'border-l-orange-500'
            } ${suggestion.severity === SuggestionSeverity.MEDIUM && 'border-l-yellow-500'} ${
              suggestion.severity === SuggestionSeverity.LOW && 'border-l-blue-500'
            }`}
          >
            <div className="flex gap-3">
              <IconComponent className={`${config.iconColor} shrink-0 mt-0.5`} size={18} />
              <div className="flex-1">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="font-semibold text-slate-900 text-sm">{suggestion.title}</h4>
                    <p className="text-xs text-slate-600 mt-1">{suggestion.description}</p>
                    <div className="mt-2">
                      <p className="text-xs font-medium text-slate-700">
                        💡 Ação: {suggestion.action}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`text-xs font-semibold px-2 py-1 rounded-full whitespace-nowrap shrink-0 ${
                      suggestion.severity === SuggestionSeverity.CRITICAL &&
                      'bg-red-200 text-red-800'
                    } ${
                      suggestion.severity === SuggestionSeverity.HIGH && 'bg-orange-200 text-orange-800'
                    } ${
                      suggestion.severity === SuggestionSeverity.MEDIUM &&
                      'bg-yellow-200 text-yellow-800'
                    } ${
                      suggestion.severity === SuggestionSeverity.LOW &&
                      'bg-blue-200 text-blue-800'
                    }`}
                  >
                    {config.label}
                  </span>
                </div>
              </div>
            </div>
          </Card>
        );
      })}

      {hasMore && (
        <div className="text-center pt-2">
          <p className="text-sm text-slate-600">
            +{suggestions.length - 3} sugestões adicionais. Clique para ver todas.
          </p>
        </div>
      )}
    </div>
  );
}
