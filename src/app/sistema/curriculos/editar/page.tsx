import { Suspense } from 'react';

import EditarCurriculoClient from './EditarCurriculoClient';

export default function EditarCurriculoPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-50">
        <div className="max-w-7xl mx-auto p-4 md:p-8">
          <p className="text-center text-slate-500">Carregando editor...</p>
        </div>
      </div>
    }>
      <EditarCurriculoClient />
    </Suspense>
  );
}
