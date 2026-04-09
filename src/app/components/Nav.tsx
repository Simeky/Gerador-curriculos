import Link from 'next/link';
import { FaHome, FaPlus, FaList, FaEye } from 'react-icons/fa';

export function Nav() {
  return (
    <nav className="bg-slate-900 text-white p-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h1 className="text-xl font-bold">Sistema de Currículos</h1>
        </div>
        <div className="flex space-x-4">
          <Link href="/components/sistema/home" className="flex items-center space-x-2 hover:text-slate-300 transition-colors">
            <FaHome />
            <span>Home</span>
          </Link>
          <Link href="/components/sistema/paginas/Cadastro" className="flex items-center space-x-2 hover:text-slate-300 transition-colors">
            <FaPlus />
            <span>Cadastro</span>
          </Link>
          <Link href="/components/sistema/paginas/Detalhes" className="flex items-center space-x-2 hover:text-slate-300 transition-colors">
            <FaEye />
            <span>Detalhes</span>
          </Link>
          <Link href="/components/sistema/paginas/listaCurriculo" className="flex items-center space-x-2 hover:text-slate-300 transition-colors">
            <FaList />
            <span>Lista de Currículos</span>
          </Link>
          <Link href="/" className="flex items-center space-x-2 hover:text-slate-300 transition-colors">
            <span>Gerador</span>
          </Link>
        </div>
      </div>
    </nav>
  );
}