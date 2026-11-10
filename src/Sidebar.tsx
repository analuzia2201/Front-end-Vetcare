import React from 'react';

export type PageKey =
  | 'dashboard'
  | 'agenda'
  | 'lista'
  | 'cadastro'
  | 'prontuarios'
  | 'receitas'
  | 'evolucao'
  | 'exames'
  | 'guia'
  | 'internacao'
  | 'cirurgias'
  | 'financeiro'
  | 'estoque'
  | 'cadastrarUsuario'
  | 'login';

interface SidebarProps {
  activePage: PageKey | string;
  onNavigate: (page: PageKey | string) => void;
}

export default function Sidebar({ activePage, onNavigate }: SidebarProps) {
  const handleLogout = () => {
    localStorage.removeItem('token');
    onNavigate('login');
  };

  const navClass = (key: PageKey) =>
    `w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs transition-colors cursor-pointer text-left ${
      activePage === key
        ? 'bg-[#E8F5F1] text-[#0E5C47] font-bold'
        : 'text-gray-600 hover:bg-gray-50 hover:text-[#0E5C47] font-medium'
    }`;

  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col justify-between p-4 overflow-y-auto shrink-0 h-screen select-none">
      <div className="space-y-5">
        {/* LOGO VETCARE */}
        <div
          onClick={() => onNavigate('lista')}
          className="flex items-center gap-2.5 px-2 cursor-pointer"
        >
          <div className="bg-[#0E5C47] text-white p-2 rounded-xl flex items-center justify-center shadow-sm">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2a3 3 0 0 0-3 3v1a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
              <path d="M18.5 6a2.5 2.5 0 0 0-2.5 2.5v1a2.5 2.5 0 0 0 5 0v-1A2.5 2.5 0 0 0 18.5 6Z" />
              <path d="M5.5 6A2.5 2.5 0 0 0 3 8.5v1a2.5 2.5 0 0 0 5 0v-1A2.5 2.5 0 0 0 5.5 6Z" />
              <path d="M12 11.5c-3 0-6.5 1.5-6.5 5.5S9 22 12 22s6.5-1 6.5-5S15 11.5 12 11.5Z" />
            </svg>
          </div>
          <span className="text-xl font-bold text-[#0E5C47] tracking-tight">VetCare</span>
        </div>

        <nav className="space-y-4">
          {/* GRUPO 1: PRINCIPAL */}
          <div>
            <div className="text-[0.62rem] font-bold text-gray-400 tracking-wider uppercase px-3 mb-1.5">
              Principal
            </div>
            <div className="space-y-0.5">
              <button type="button" onClick={() => onNavigate('dashboard')} className={navClass('dashboard')}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/></svg>
                Visão Geral
              </button>
              <button type="button" onClick={() => onNavigate('agenda')} className={navClass('agenda')}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/><line x1="12" y1="14" x2="12" y2="18"/><line x1="10" y1="16" x2="14" y2="16"/></svg>
                Marcar Consulta
              </button>
              <button type="button" onClick={() => onNavigate('lista')} className={navClass('lista')}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                Tutores e Pets
              </button>
            </div>
          </div>

          {/* GRUPO 2: ATENDIMENTO CLÍNICO */}
          <div>
            <div className="text-[0.62rem] font-bold text-gray-400 tracking-wider uppercase px-3 mb-1.5">
              Atendimento Clínico
            </div>
            <div className="space-y-0.5">
              <button type="button" onClick={() => onNavigate('prontuarios')} className={navClass('prontuarios')}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
                Prontuário / Atendimento
              </button>
              <button type="button" onClick={() => onNavigate('receitas')} className={navClass('receitas')}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1"/><path d="m9 14 2 2 4-4"/></svg>
                Prescrições e Receituário
              </button>
              <button type="button" onClick={() => onNavigate('evolucao')} className={navClass('evolucao')}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
                Histórico de Evolução
              </button>
              <button type="button" onClick={() => onNavigate('exames')} className={navClass('exames')}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><path d="M8 15h8M8 11h8"/></svg>
                Resultados de Exames
              </button>
              <button type="button" onClick={() => onNavigate('guia')} className={navClass('guia')}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
                Guia Médica
              </button>
            </div>
          </div>

          {/* GRUPO 3: INTERNAÇÃO E CIRURGIAS */}
          <div>
            <div className="text-[0.62rem] font-bold text-gray-400 tracking-wider uppercase px-3 mb-1.5">
              Internação & Cirurgias
            </div>
            <div className="space-y-0.5">
              <button type="button" onClick={() => onNavigate('internacao')} className={navClass('internacao')}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 4v16M2 8h18a2 2 0 0 1 2 2v10M2 17h20M6 8v9"/></svg>
                Mapa de Internação
              </button>
              <button type="button" onClick={() => onNavigate('cirurgias')} className={navClass('cirurgias')}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m18 15-6-6-6 6M12 9v12M5 3h14"/></svg>
                Bloco Cirúrgico
              </button>
            </div>
          </div>

          {/* GRUPO 4: GESTÃO & ADMINISTRAÇÃO */}
          <div>
            <div className="text-[0.62rem] font-bold text-gray-400 tracking-wider uppercase px-3 mb-1.5">
              Gestão & Operação
            </div>
            <div className="space-y-0.5">
              <button type="button" onClick={() => onNavigate('financeiro')} className={navClass('financeiro')}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                Financeiro
              </button>
              <button type="button" onClick={() => onNavigate('estoque')} className={navClass('estoque')}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m7.5 4.27 9 5.15M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5M12 12v10"/></svg>
                Estoque de Produtos
              </button>
              <button type="button" onClick={() => onNavigate('cadastrarUsuario')} className={navClass('cadastrarUsuario')}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                Equipe & Acessos
              </button>
            </div>
          </div>
        </nav>
      </div>

      {/* RODAPÉ E BOTÃO SAIR */}
      <div className="pt-4 border-t border-gray-100 space-y-3">
        <div className="bg-[#F0F8F5] p-3 rounded-2xl border border-[#D5EBE3]">
          <h4 className="text-[0.72rem] font-bold text-gray-800 mb-0.5">Clínica Bem Animal</h4>
          <p className="text-[0.65rem] text-gray-500">Sistema VetCare v1.0</p>
        </div>

        <button
          type="button"
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-gray-50 hover:bg-red-50 text-gray-600 hover:text-red-600 rounded-xl text-xs font-bold transition-colors cursor-pointer"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
          Sair do Sistema
        </button>
      </div>
    </aside>
  );
}