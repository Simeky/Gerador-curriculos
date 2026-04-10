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
          <Link href="/" className="flex items-center space-x-2 hover:text-slate-300 transition-colors">
            <FaHome />
            <span>Home</span>
          </Link>
          <Link href="/curriculos/cadastro" className="flex items-center space-x-2 hover:text-slate-300 transition-colors">
            <FaPlus />
            <span>Cadastro</span>
          </Link>
          <Link href="/curriculos/visualizar/:id" className="flex items-center space-x-2 hover:text-slate-300 transition-colors">
            <FaEye />
            <span>Detalhes</span>
          </Link>
          <Link href="/curriculos/visualizar" className="flex items-center space-x-2 hover:text-slate-300 transition-colors">
            <FaList />
            <span>Lista de Currículos</span>
          </Link>
        </div>
      </div>
    </nav>
  );
}