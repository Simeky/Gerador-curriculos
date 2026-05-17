"use client";

import {
  useEffect,
  useState,
} from 'react';

import { Lightbulb } from 'lucide-react';

import { ResumeData } from '@/app/sistema/curriculos/gerador/validacao';
import SuggestionsModal from '@/components/SuggestionsModal/page';
import {
  analisarCurriculo,
  calculateCompletenessScore,
  Suggestion,
} from '@/lib/SuggestionsService';

interface RealTimeSuggestionsProps {
  resumeData: ResumeData | null;
}

export default function RealTimeSuggestions({ resumeData }: RealTimeSuggestionsProps) {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [score, setScore] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (!resumeData) return;

    const analyzed = analisarCurriculo(resumeData as any);
    setSuggestions(analyzed);
    setScore(calculateCompletenessScore(resumeData as any));
  }, [resumeData]);

  if (!resumeData || suggestions.length === 0) {
    return null;
  }

  return (
    <>
      <style>{`
        @keyframes pulse-lamp {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
        .animate-pulse-lamp {
          animation: pulse-lamp 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}</style>

      <button
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-8 right-8 w-16 h-16 rounded-full bg-white shadow-lg border-2 border-amber-300 hover:shadow-xl transition-all hover:scale-110 flex items-center justify-center z-30 group"
        aria-label="Abrir sugestões"
      >
        <Lightbulb
          className="animate-pulse-lamp text-amber-500"
          size={32}
          strokeWidth={1.5}
        />
        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full h-6 w-6 flex items-center justify-center group-hover:scale-110 transition-transform">
          {suggestions.length}
        </span>
      </button>

      <SuggestionsModal
        suggestions={suggestions}
        score={score}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}
