import { useState } from 'react';
import LoginPage from './LoginPage';
import RegisterPage from './RegisterPage';
import PatientsListPage from './PatientsListPage';

export default function App() {
  const [currentPage, setCurrentPage] = useState<'login' | 'cadastro' | 'lista'>('lista');

  return (
    <div>
      {/* Selector Flutuante no Topo para Testar as Páginas */}
      <div className="fixed top-3 right-3 z-50 bg-black/80 backdrop-blur-md text-white p-1.5 rounded-xl text-xs flex gap-1 shadow-lg border border-white/20">
        <button 
          onClick={() => setCurrentPage('login')}
          className={`px-3 py-1.5 rounded-lg font-medium transition-all ${currentPage === 'login' ? 'bg-[#0E5C47] text-white font-bold' : 'text-gray-300 hover:text-white'}`}
        >
          Login
        </button>
        <button 
          onClick={() => setCurrentPage('cadastro')}
          className={`px-3 py-1.5 rounded-lg font-medium transition-all ${currentPage === 'cadastro' ? 'bg-[#0E5C47] text-white font-bold' : 'text-gray-300 hover:text-white'}`}
        >
          Novo Cadastro
        </button>
        <button 
          onClick={() => setCurrentPage('lista')}
          className={`px-3 py-1.5 rounded-lg font-medium transition-all ${currentPage === 'lista' ? 'bg-[#0E5C47] text-white font-bold' : 'text-gray-300 hover:text-white'}`}
        >
          Lista de Pacientes
        </button>
      </div>

      {/* Renderização da Tela Ativa */}
      {currentPage === 'login' && (
        <LoginPage onNavigateToRegister={() => setCurrentPage('cadastro')} />
      )}
      {currentPage === 'cadastro' && (
        <RegisterPage />
      )}
      {currentPage === 'lista' && (
        <PatientsListPage onNavigateToRegister={() => setCurrentPage('cadastro')} />
      )}
    </div>
  );
}