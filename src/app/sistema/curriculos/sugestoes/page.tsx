import { Suspense } from 'react';

import SugestoesCurriculoClient from './SugestoesCurriculoClient';

export default function SugestoesCurriculoPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-50">
          <div className="max-w-4xl mx-auto p-4 md:p-8">
            <p className="text-center text-slate-500">Carregando sugestões...</p>
          </div>
        </div>
      }
    >
      <SugestoesCurriculoClient />
    </Suspense>
  );
}
