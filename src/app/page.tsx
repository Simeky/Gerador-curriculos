import Link from 'next/link';
import {
  FaCheck,
  FaRocket,
  FaSave,
  FaShare,
} from 'react-icons/fa';

import { Nav } from '@/app/components/nav/Nav';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800">
      <Nav />
      
      <section className="max-w-4xl mx-auto px-4 py-20 text-center text-white">
        <h1 className="text-5xl md:text-6xl font-bold mb-6">
          Gerador de <span className="text-indigo-400">Currículos</span>
        </h1>
        <p className="text-xl md:text-2xl text-slate-300 mb-8">
          Crie currículos profissionais de forma rápida e fácil. Sem complicações.
        </p>
        <Link href="/curriculos/gerador" className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors">
          Começar Agora
        </Link>
      </section>

      <section className="max-w-5xl mx-auto px-4 py-20">
        <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-16">
          Por que usar nosso sistema?
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="bg-slate-800 rounded-lg p-8 text-center hover:shadow-lg hover:shadow-indigo-500/50 transition-all">
            <div className="flex justify-center mb-4">
              <FaRocket className="text-indigo-400 text-4xl" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-3">Rápido e Fácil</h3>
            <p className="text-slate-400">
              Preencha um simples formulário e seu currículo estará pronto em minutos.
            </p>
          </div>

          <div className="bg-slate-800 rounded-lg p-8 text-center hover:shadow-lg hover:shadow-indigo-500/50 transition-all">
            <div className="flex justify-center mb-4">
              <FaCheck className="text-indigo-400 text-4xl" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-3">Validações Inteligentes</h3>
            <p className="text-slate-400">
              Campos validados automaticamente garantem currículos bem formatados.
            </p>
          </div>

          <div className="bg-slate-800 rounded-lg p-8 text-center hover:shadow-lg hover:shadow-indigo-500/50 transition-all">
            <div className="flex justify-center mb-4">
              <FaSave className="text-indigo-400 text-4xl" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-3">Salve Seus Layouts</h3>
            <p className="text-slate-400">
              Crie e salve múltiplos currículos para diferentes oportunidades.
            </p>
          </div>

          <div className="bg-slate-800 rounded-lg p-8 text-center hover:shadow-lg hover:shadow-indigo-500/50 transition-all">
            <div className="flex justify-center mb-4">
              <FaShare className="text-indigo-400 text-4xl" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-3">Imprima ou PDF</h3>
            <p className="text-slate-400">
              Exporte seu currículo como PDF ou imprima diretamente.
            </p>
          </div>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-4 py-20 text-center">
        <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 rounded-lg p-12 text-white">
          <h2 className="text-3xl font-bold mb-6">Pronto para começar?</h2>
          <p className="text-lg mb-8 text-indigo-100">
            Crie seu primeiro currículo agora e comece a se destacar no mercado.
          </p>
          <Link href="/curriculos/gerador" className="inline-block bg-white text-indigo-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-indigo-50 transition-colors">
            Gerar Currículo Agora
          </Link>
        </div>
      </section>

      <footer className="bg-slate-950 text-slate-400 py-8">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <p>&copy; 2026 Sistema de Currículos. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
}