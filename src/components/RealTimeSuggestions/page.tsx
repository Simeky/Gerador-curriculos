"use client";

import {
  useEffect,
  useState,
} from 'react';

import {
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Lightbulb,
  TrendingUp,
} from 'lucide-react';

import { ResumeData } from '@/app/sistema/curriculos/gerador/validacao';
import SuggestionsCard from '@/components/SuggestionsCard/page';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  analisarCurriculo,
  calculateCompletenessScore,
  Suggestion,
  SuggestionSeverity,
} from '@/lib/SuggestionsService';

interface RealTimeSuggestionsProps {
  resumeData: ResumeData | null;
}

export default function RealTimeSuggestions({ resumeData }: RealTimeSuggestionsProps) {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [score, setScore] = useState(0);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    if (!resumeData) return;

    const analyzed = analisarCurriculo(resumeData as any);
    setSuggestions(analyzed);
    setScore(calculateCompletenessScore(resumeData as any));
  }, [resumeData]);

  if (!resumeData || suggestions.length === 0) {
    return null;
  }

  const criticalCount = suggestions.filter(s => s.severity === SuggestionSeverity.CRITICAL).length;
  const highCount = suggestions.filter(s => s.severity === SuggestionSeverity.HIGH).length;
  const totalCount = suggestions.length;

  return (
    <div className="space-y-4 mb-6">
      <Card className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Lightbulb className="text-blue-600" size={24} />
            <div>
              <p className="font-bold text-slate-900">Qualidade do Currículo: {score}%</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs font-medium bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                  {totalCount} sugestões
                </span>
                {criticalCount > 0 && (
                  <span className="text-xs font-medium bg-red-100 text-red-700 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <AlertCircle size={10} /> {criticalCount} críticas
                  </span>
                )}
                {highCount > 0 && (
                  <span className="text-xs font-medium bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <TrendingUp size={10} /> {highCount} importantes
                  </span>
                )}
              </div>
            </div>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-2 whitespace-nowrap bg-white hover:bg-slate-50"
          >
            {isDropdownOpen ? (
              <>Ocultar Sugestões <ChevronUp size={16} /></>
            ) : (
              <>Ver Sugestões <ChevronDown size={16} /></>
            )}
          </Button>
        </div>
      </Card>

      {isDropdownOpen && (
        <div className="animate-in slide-in-from-top-2 fade-in duration-200">
          <SuggestionsCard suggestions={suggestions} />
        </div>
      )}
    </div>
  );
}
