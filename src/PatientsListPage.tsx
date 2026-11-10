import { useState, useEffect } from 'react';
import './index.css';

interface Pet {
  id?: string;
  nome: string;
  especie: string;
  raca: string;
  sexo: string;
}

interface Tutor {
  id: string;
  nome: string;
  cpf: string;
  telefone: string;
  email: string;
  pets: Pet[];
}

interface PatientsListPageProps {
  onNavigateToRegister?: () => void;
}

export default function PatientsListPage({ onNavigateToRegister }: PatientsListPageProps) {
  // Lista inicial com dados de exemplo (será atualizada se o back-end responder)
  const [tutores, setTutores] = useState<Tutor[]>([
    {
      id: '1',
      nome: 'Marina Oliveira',
      cpf: '123.456.789-09',
      telefone: '(11) 99987-6543',
      email: 'marina.oliveira@email.com',
      pets: [{ id: '101', nome: 'Luna', especie: 'Canina', raca: 'Golden retriever', sexo: 'Fêmea' }]
    },
    {
      id: '2',
      nome: 'Carlos Eduardo',
      cpf: '987.654.321-11',
      telefone: '(71) 98877-1122',
      email: 'carlos.eduardo@email.com',
      pets: [{ id: '102', nome: 'Pipoca', especie: 'Ave', raca: 'Calopsita', sexo: 'Macho' }]
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [tutorToDelete, setTutorToDelete] = useState<Tutor | null>(null);

  // Busca a lista atualizada de tutores no Back-end ao carregar a página
  useEffect(() => {
    fetchTutores();
  }, []);

  const fetchTutores = async () => {
    setIsLoading(true);
    try {
      const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
      const token = localStorage.getItem('token');
      const response = await fetch(`${baseUrl}/tutores`, {
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        }
      });
      if (response.ok) {
        const data = await response.json();
        if (Array.isArray(data) && data.length > 0) {
          setTutores(data);
        }
      }
    } catch (error) {
      console.error('Erro ao conectar com o servidor para listar tutores:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Função para deletar um tutor/pet via API
  const handleDeleteConfirm = async () => {
    if (!tutorToDelete) return;

    try {
      const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
      const token = localStorage.getItem('token');

      const response = await fetch(`${baseUrl}/tutores/${tutorToDelete.id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        }
      });

      if (response.ok) {
        setTutores(prev => prev.filter(t => t.id !== tutorToDelete.id));
        alert('Registro excluído com sucesso!');
      } else {
        // Exclusão no estado local para testes de interface
        setTutores(prev => prev.filter(t => t.id !== tutorToDelete.id));
        alert('Registro removido da visualização.');
      }
    } catch (error) {
      console.error('Erro ao deletar:', error);
      setTutores(prev => prev.filter(t => t.id !== tutorToDelete.id));
      alert('Registro removido (modo de teste).');
    } finally {
      setTutorToDelete(null);
    }
  };

  // Filtro de busca local por Nome do Tutor, CPF ou Nome do Pet
  const filteredTutores = tutores.filter(tutor => 
    tutor.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tutor.cpf.includes(searchTerm) ||
    tutor.pets.some(pet => pet.nome.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="flex h-screen bg-[#F4F6F5] font-sans text-gray-700 overflow-hidden">
      
      {/* SIDEBAR */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col justify-between p-4 overflow-y-auto shrink-0">
        <div>
          <div className="flex items-center gap-2 mb-8 px-2">
            <div className="bg-[#0E5C47] text-white p-2 rounded-xl flex items-center justify-center">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2a3 3 0 0 0-3 3v1a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
                <path d="M18.5 6a2.5 2.5 0 0 0-2.5 2.5v1a2.5 2.5 0 0 0 5 0v-1A2.5 2.5 0 0 0 18.5 6Z" />
                <path d="M5.5 6A2.5 2.5 0 0 0 3 8.5v1a2.5 2.5 0 0 0 5 0v-1A2.5 2.5 0 0 0 5.5 6Z" />
                <path d="M12 11.5c-3 0-6.5 1.5-6.5 5.5S9 22 12 22s6.5-1 6.5-5S15 11.5 12 11.5Z" />
              </svg>
            </div>
            <span className="text-xl font-bold text-[#0E5C47]">VetCare</span>
          </div>

          <div className="text-[0.65rem] font-bold text-gray-400 tracking-wider mb-3 px-2 uppercase">
            Espaço da clínica
          </div>

          <nav className="space-y-1">
            <a href="#" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-500 hover:bg-gray-50">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/></svg>
              Visão geral
            </a>
            <a href="#" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-500 hover:bg-gray-50">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>
              Agenda
            </a>
            <a href="#" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold bg-[#E8F5F1] text-[#0E5C47]">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2a3 3 0 0 0-3 3v1a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M18.5 6a2.5 2.5 0 0 0-2.5 2.5v1a2.5 2.5 0 0 0 5 0v-1A2.5 2.5 0 0 0 18.5 6Z"/><path d="M5.5 6A2.5 2.5 0 0 0 3 8.5v1a2.5 2.5 0 0 0 5 0v-1A2.5 2.5 0 0 0 5.5 6Z"/><path d="M12 11.5c-3 0-6.5 1.5-6.5 5.5S9 22 12 22s6.5-1 6.5-5S15 11.5 12 11.5Z"/></svg>
              Tutores e pets
            </a>
            <a href="#" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-500 hover:bg-gray-50">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1"/><path d="M12 11v6M9 14h6"/></svg>
              Prontuários
            </a>
            <a href="#" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-500 hover:bg-gray-50">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M12 12h.01M2 10h20"/></svg>
              Financeiro
            </a>
            <a href="#" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-500 hover:bg-gray-50">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m7.5 4.27 9 5.15M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5M12 12v10"/></svg>
              Estoque
            </a>
            <a href="#" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-500 hover:bg-gray-50">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
              Relatórios
            </a>
          </nav>
        </div>

        <div className="space-y-4">
          <div className="bg-[#F0F8F5] p-3.5 rounded-2xl border border-[#D5EBE3]">
            <div className="w-7 h-7 bg-[#E0F2EC] rounded-lg flex items-center justify-center text-[#0E5C47] mb-2">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
            </div>
            <h4 className="text-xs font-bold text-gray-800 mb-1">Cuidamos de você também</h4>
            <p className="text-[0.72rem] text-gray-500 mb-2 leading-relaxed">Conte com nossa equipe sempre que precisar.</p>
            <a href="#" className="text-xs font-bold text-[#0E5C47] flex items-center gap-1 hover:underline">
              Falar com o suporte <span>↗</span>
            </a>
          </div>

          <a href="#" className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-gray-500 hover:bg-gray-50">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.38a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>
            Configurações
          </a>

          <div className="pt-2 border-t border-gray-100 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#E0F2EC] flex items-center justify-center text-[#0E5C47]">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"/><path d="M6 12h12M6 7h12M6 17h12"/></svg>
            </div>
            <div>
              <p className="text-xs font-bold text-gray-800">Clínica Bem Animal</p>
              <p className="text-[0.68rem] text-gray-400">Plano Profissional</p>
            </div>
          </div>
        </div>
      </aside>

      {/* ÁREA PRINCIPAL */}
      <div className="flex-1 flex flex-col overflow-y-auto">
        
        {/* HEADER */}
        <header className="h-16 bg-white border-b border-gray-200 px-8 flex items-center justify-between shrink-0">
          <div className="relative w-96">
            <svg className="absolute left-3.5 top-2.5 text-gray-400" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input 
              type="text" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar tutor, pet ou CPF..."
              className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-xl text-xs text-gray-600 focus:outline-none focus:ring-1 focus:ring-[#0E5C47]"
            />
          </div>

          <div className="flex items-center gap-4">
            <button type="button" className="relative text-gray-400 hover:text-gray-600">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>
              <span className="absolute top-0 right-0 w-2 h-2 bg-emerald-500 rounded-full"></span>
            </button>
            <div className="h-6 w-px bg-gray-200"></div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#D5EBE3] text-[#0E5C47] text-xs font-bold flex items-center justify-center">
                AC
              </div>
              <div className="text-left">
                <p className="text-xs font-bold text-gray-800 leading-tight">Dra. Ana Costa</p>
                <p className="text-[0.68rem] text-gray-400 leading-tight">Médica veterinária</p>
              </div>
              <svg className="text-gray-400" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m6 9 6 6 6-6"/></svg>
            </div>
          </div>
        </header>

        {/* CONTEÚDO PRINCIPAL */}
        <main className="p-8 max-w-7xl mx-auto w-full space-y-6">
          
          {/* Cabeçalho de Ações */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center text-xs text-gray-400 mb-1">
                <span>Tutores e pets <span className="mx-1">/</span> <strong className="text-gray-500 font-normal">Lista de cadastros</strong></span>
              </div>
              <h1 className="text-2xl font-bold text-[#1F2937]">Clientes e Pacientes Cadastrados</h1>
              <p className="text-xs text-gray-500 mt-0.5">Gerencie os tutores e os animais vinculados à sua clínica.</p>
            </div>

            {onNavigateToRegister && (
              <button
                onClick={onNavigateToRegister}
                className="px-4 py-2.5 bg-[#0E5C47] hover:bg-[#0B4A39] text-white rounded-xl text-xs font-bold flex items-center gap-2 transition-colors self-start sm:self-auto"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                Novo cadastro
              </button>
            )}
          </div>

          {/* Cards Resumo */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#E8F5F1] text-[#0E5C47] flex items-center justify-center font-bold text-lg">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              </div>
              <div>
                <p className="text-xs text-gray-400">Total de Tutores</p>
                <p className="text-xl font-bold text-gray-800">{filteredTutores.length}</p>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#E8F5F1] text-[#0E5C47] flex items-center justify-center font-bold text-lg">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2a3 3 0 0 0-3 3v1a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M18.5 6a2.5 2.5 0 0 0-2.5 2.5v1a2.5 2.5 0 0 0 5 0v-1A2.5 2.5 0 0 0 18.5 6Z"/><path d="M5.5 6A2.5 2.5 0 0 0 3 8.5v1a2.5 2.5 0 0 0 5 0v-1A2.5 2.5 0 0 0 5.5 6Z"/><path d="M12 11.5c-3 0-6.5 1.5-6.5 5.5S9 22 12 22s6.5-1 6.5-5S15 11.5 12 11.5Z"/></svg>
              </div>
              <div>
                <p className="text-xs text-gray-400">Total de Pacientes (Pets)</p>
                <p className="text-xl font-bold text-gray-800">
                  {filteredTutores.reduce((acc, t) => acc + (t.pets?.length || 0), 0)}
                </p>
              </div>
            </div>
          </div>

          {/* TABELA DE REGISTROS */}
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
            {isLoading ? (
              <div className="p-12 text-center text-xs text-gray-400">Carregando lista de cadastros...</div>
            ) : filteredTutores.length === 0 ? (
              <div className="p-12 text-center text-gray-400 text-xs">
                Nenhum tutor ou pet encontrado.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-100 text-[0.7rem] uppercase tracking-wider text-gray-400">
                      <th className="py-3.5 px-6 font-bold">Tutor</th>
                      <th className="py-3.5 px-6 font-bold">Contato</th>
                      <th className="py-3.5 px-6 font-bold">Pet(s)</th>
                      <th className="py-3.5 px-6 font-bold">Espécie / Raça</th>
                      <th className="py-3.5 px-6 font-bold text-right">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-xs text-gray-700">
                    {filteredTutores.map((tutor) => {
                      const firstPet = tutor.pets?.[0];
                      return (
                        <tr key={tutor.id} className="hover:bg-gray-50/60 transition-colors">
                          <td className="py-4 px-6 font-bold text-gray-800">
                            {tutor.nome}
                            <div className="text-[0.68rem] text-gray-400 font-normal">CPF: {tutor.cpf}</div>
                          </td>
                          <td className="py-4 px-6">
                            <div>{tutor.telefone}</div>
                            <div className="text-[0.68rem] text-gray-400">{tutor.email || 'Não informado'}</div>
                          </td>
                          <td className="py-4 px-6">
                            {tutor.pets && tutor.pets.length > 0 ? (
                              tutor.pets.map((p, idx) => (
                                <span key={idx} className="inline-block bg-[#E8F5F1] text-[#0E5C47] font-semibold px-2.5 py-1 rounded-lg text-xs mr-1 mb-1">
                                  {p.nome} ({p.sexo})
                                </span>
                              ))
                            ) : (
                              <span className="text-gray-400 italic">Sem pet vinculado</span>
                            )}
                          </td>
                          <td className="py-4 px-6">
                            {firstPet ? (
                              <div>
                                <span className="font-semibold text-gray-800">{firstPet.especie}</span>
                                {firstPet.raca && <span className="text-gray-400"> · {firstPet.raca}</span>}
                              </div>
                            ) : (
                              <span className="text-gray-400">-</span>
                            )}
                          </td>
                          <td className="py-4 px-6 text-right space-x-2">
                            {/* Botão Editar */}
                            <button
                              type="button"
                              onClick={() => alert(`Editar registro de ${tutor.nome}`)}
                              className="p-2 text-gray-400 hover:text-[#0E5C47] hover:bg-emerald-50 rounded-lg transition-colors"
                              title="Editar"
                            >
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/></svg>
                            </button>

                            {/* Botão Deletar / Apagar */}
                            <button
                              type="button"
                              onClick={() => setTutorToDelete(tutor)}
                              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Deletar"
                            >
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

        </main>
      </div>

      {/* MODAL DE CONFIRMAÇÃO DE EXCLUSÃO */}
      {tutorToDelete && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-gray-100 text-center space-y-4">
            <div className="w-12 h-12 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
            </div>
            <div>
              <h3 className="text-base font-bold text-gray-800">Excluir registro?</h3>
              <p className="text-xs text-gray-500 mt-1">
                Tem certeza que deseja apagar o tutor <strong>{tutorToDelete.nome}</strong> e seus pets vinculados? Esta ação não poderá ser desfeita.
              </p>
            </div>
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setTutorToDelete(null)}
                className="flex-1 py-2.5 border border-gray-200 rounded-xl text-xs font-bold text-gray-700 hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleDeleteConfirm}
                className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition-colors"
              >
                Sim, apagar
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}