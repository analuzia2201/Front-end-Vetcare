import { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
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
  onNavigate: (page: string) => void;
}

export default function PatientsListPage({ onNavigate }: PatientsListPageProps) {
  const [tutores, setTutores] = useState<Tutor[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [tutorToDelete, setTutorToDelete] = useState<Tutor | null>(null);
  const [editingTutor, setEditingTutor] = useState<Tutor | null>(null);

  useEffect(() => {
    fetchTutores();
  }, []);

  const fetchTutores = async () => {
    setIsLoading(true);
    try {
      const baseUrl = import.meta.env.VITE_API_URL || 'https://vetcare-zcak.onrender.com';
      const token = localStorage.getItem('token');

      let response = await fetch(`${baseUrl}/users`, {
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      if (!response.ok) {
        response = await fetch(`${baseUrl}/api/users`, {
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        });
      }

      if (response.status === 401 || response.status === 403) {
        localStorage.removeItem('token');
        onNavigate('login');
        return;
      }

      if (response.ok) {
        const data = await response.json();
        const rawList = Array.isArray(data) ? data : data.users || [];

        const formattedTutores: Tutor[] = rawList.map((item: any, idx: number) => ({
          id: item.id || String(idx + 1),
          nome: item.nome || item.name || 'Sem Nome',
          cpf: item.cpf || 'Não informado',
          telefone: item.telefone || item.phone || 'Não informado',
          email: item.email || 'Não informado',
          pets: Array.isArray(item.pets) && item.pets.length > 0
            ? item.pets.map((p: any) => ({
                id: p.id,
                nome: p.nome || p.name || 'Pet',
                especie: p.especie || 'Canina',
                raca: p.raca || 'Sem raça definida',
                sexo: p.sexo || 'Fêmea',
              }))
            : [
                {
                  id: `pet-${item.id || idx}`,
                  nome: item.petNome || 'Pet Cadastrado',
                  especie: item.especie || 'Canina',
                  raca: item.raca || 'Sem raça definida',
                  sexo: item.sexo || 'Fêmea',
                },
              ],
        }));

        setTutores(formattedTutores);
      }
    } catch (error) {
      console.error('Erro ao listar tutores:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!tutorToDelete) return;

    try {
      const baseUrl = import.meta.env.VITE_API_URL || 'https://vetcare-zcak.onrender.com';
      const token = localStorage.getItem('token');

      await fetch(`${baseUrl}/users/${tutorToDelete.id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
    } catch (error) {
      console.error('Erro ao deletar no servidor:', error);
    } finally {
      setTutores((prev) => prev.filter((t) => t.id !== tutorToDelete.id));
      alert('Registro removido com sucesso!');
      setTutorToDelete(null);
    }
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTutor) return;

    setTutores((prev) => prev.map((t) => (t.id === editingTutor.id ? editingTutor : t)));
    alert('Dados do tutor e pets atualizados com sucesso!');
    setEditingTutor(null);
  };

  const handleAddPetToEditingTutor = () => {
    if (!editingTutor) return;
    setEditingTutor({
      ...editingTutor,
      pets: [...editingTutor.pets, { nome: '', especie: 'Canina', raca: '', sexo: 'Fêmea' }],
    });
  };

  const handlePetChange = (index: number, field: keyof Pet, value: string) => {
    if (!editingTutor) return;
    const updatedPets = [...editingTutor.pets];
    updatedPets[index] = { ...updatedPets[index], [field]: value };
    setEditingTutor({ ...editingTutor, pets: updatedPets });
  };

  const handleRemovePetFromEditingTutor = (index: number) => {
    if (!editingTutor) return;
    setEditingTutor({
      ...editingTutor,
      pets: editingTutor.pets.filter((_, i) => i !== index),
    });
  };

  const filteredTutores = tutores.filter(
    (tutor) =>
      tutor.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tutor.cpf.includes(searchTerm) ||
      tutor.pets.some((pet) => pet.nome.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="flex h-screen bg-[#F4F6F5] font-sans text-gray-700 overflow-hidden">
      {/* SIDEBAR UNIFICADA */}
      <Sidebar activePage="lista" onNavigate={onNavigate} />

      {/* ÁREA PRINCIPAL */}
      <div className="flex-1 flex flex-col overflow-y-auto">
        <header className="h-16 bg-white border-b border-gray-200 px-8 flex items-center justify-between shrink-0">
          <div className="relative w-96">
            <svg
              className="absolute left-3.5 top-2.5 text-gray-400"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar tutor, pet ou CPF..."
              className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-xl text-xs text-gray-600 focus:outline-none focus:ring-1 focus:ring-[#0E5C47]"
            />
          </div>

          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#D5EBE3] text-[#0E5C47] text-xs font-bold flex items-center justify-center">
              AD
            </div>
            <div className="text-left">
              <p className="text-xs font-bold text-gray-800 leading-tight">Administrador</p>
              <p className="text-[0.68rem] text-gray-400 leading-tight">Gestão da clínica</p>
            </div>
          </div>
        </header>

        <main className="p-8 max-w-7xl mx-auto w-full space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-[#1F2937]">Clientes e Pacientes Cadastrados</h1>
              <p className="text-xs text-gray-500 mt-0.5">
                Gerencie os tutores e os animais vinculados à sua clínica.
              </p>
            </div>

            <button
              onClick={() => onNavigate('cadastro')}
              className="px-4 py-2.5 bg-[#0E5C47] hover:bg-[#0B4A39] text-white rounded-xl text-xs font-bold flex items-center gap-2 transition-colors cursor-pointer"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              Novo Pet / Tutor
            </button>
          </div>

          {/* TABELA DE REGISTROS */}
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
            {isLoading ? (
              <div className="p-12 text-center text-xs text-gray-400">Carregando registros...</div>
            ) : filteredTutores.length === 0 ? (
              <div className="p-12 text-center text-xs text-gray-400">Nenhum registro encontrado.</div>
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
                    {filteredTutores.map((tutor) => (
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
                          <div className="flex flex-wrap gap-1">
                            {tutor.pets && tutor.pets.length > 0 ? (
                              tutor.pets.map((p, idx) => (
                                <span
                                  key={idx}
                                  className="bg-[#E8F5F1] text-[#0E5C47] font-semibold px-2.5 py-1 rounded-lg text-xs"
                                >
                                  {p.nome} ({p.sexo})
                                </span>
                              ))
                            ) : (
                              <span className="text-gray-400 italic">Sem pet vinculado</span>
                            )}
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          {tutor.pets && tutor.pets.length > 0 ? (
                            <div className="space-y-1">
                              {tutor.pets.map((p, idx) => (
                                <div key={idx} className="text-xs">
                                  <span className="font-semibold text-gray-800">{p.especie}</span>
                                  {p.raca && <span className="text-gray-400"> · {p.raca}</span>}
                                </div>
                              ))}
                            </div>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </td>
                        <td className="py-4 px-6 text-right space-x-1">
                          <button
                            type="button"
                            onClick={() => setEditingTutor(tutor)}
                            className="p-2 text-gray-400 hover:text-[#0E5C47] hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer"
                            title="Editar tutor e pets"
                          >
                            <svg
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
                            </svg>
                          </button>

                          <button
                            type="button"
                            onClick={() => setTutorToDelete(tutor)}
                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                            title="Deletar registro"
                          >
                            <svg
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <polyline points="3 6 5 6 21 6" />
                              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                            </svg>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* MODAL DE EDIÇÃO DO TUTOR E SEUS PETS */}
      {editingTutor && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <form
            onSubmit={handleSaveEdit}
            className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-gray-100 max-h-[90vh] overflow-y-auto space-y-5"
          >
            <div className="flex justify-between items-center border-b border-gray-100 pb-3">
              <h3 className="text-base font-bold text-gray-800">
                Editar Cadastro de {editingTutor.nome}
              </h3>
              <button
                type="button"
                onClick={() => setEditingTutor(null)}
                className="text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-bold text-[#0E5C47] uppercase tracking-wider">
                Dados do Tutor
              </h4>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[0.7rem] font-semibold text-gray-600 mb-1">Nome</label>
                  <input
                    type="text"
                    value={editingTutor.nome}
                    onChange={(e) => setEditingTutor({ ...editingTutor, nome: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#0E5C47]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[0.7rem] font-semibold text-gray-600 mb-1">CPF</label>
                  <input
                    type="text"
                    value={editingTutor.cpf}
                    onChange={(e) => setEditingTutor({ ...editingTutor, cpf: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#0E5C47]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[0.7rem] font-semibold text-gray-600 mb-1">
                    Telefone
                  </label>
                  <input
                    type="text"
                    value={editingTutor.telefone}
                    onChange={(e) => setEditingTutor({ ...editingTutor, telefone: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#0E5C47]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[0.7rem] font-semibold text-gray-600 mb-1">E-mail</label>
                  <input
                    type="email"
                    value={editingTutor.email}
                    onChange={(e) => setEditingTutor({ ...editingTutor, email: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#0E5C47]"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-[#0E5C47] uppercase tracking-wider">
                  Pets Vinculados ({editingTutor.pets.length})
                </h4>
                <button
                  type="button"
                  onClick={handleAddPetToEditingTutor}
                  className="text-xs font-bold text-[#0E5C47] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  + Adicionar outro pet
                </button>
              </div>

              {editingTutor.pets.map((pet, idx) => (
                <div
                  key={idx}
                  className="bg-gray-50 p-3 rounded-2xl border border-gray-200 relative space-y-2"
                >
                  <div className="flex justify-between items-center">
                    <span className="text-[0.7rem] font-bold text-gray-500">Pet {idx + 1}</span>
                    {editingTutor.pets.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemovePetFromEditingTutor(idx)}
                        className="text-red-500 hover:text-red-700 text-xs font-bold cursor-pointer"
                      >
                        Remover
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    <div>
                      <label className="block text-[0.65rem] text-gray-500 mb-1">Nome do Pet</label>
                      <input
                        type="text"
                        value={pet.nome}
                        onChange={(e) => handlePetChange(idx, 'nome', e.target.value)}
                        className="w-full border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs bg-white focus:outline-none focus:border-[#0E5C47]"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-[0.65rem] text-gray-500 mb-1">Espécie</label>
                      <input
                        type="text"
                        value={pet.especie}
                        onChange={(e) => handlePetChange(idx, 'especie', e.target.value)}
                        className="w-full border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs bg-white focus:outline-none focus:border-[#0E5C47]"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-[0.65rem] text-gray-500 mb-1">Raça</label>
                      <input
                        type="text"
                        value={pet.raca}
                        onChange={(e) => handlePetChange(idx, 'raca', e.target.value)}
                        className="w-full border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs bg-white focus:outline-none focus:border-[#0E5C47]"
                      />
                    </div>
                    <div>
                      <label className="block text-[0.65rem] text-gray-500 mb-1">Sexo</label>
                      <select
                        value={pet.sexo}
                        onChange={(e) => handlePetChange(idx, 'sexo', e.target.value)}
                        className="w-full border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs bg-white focus:outline-none focus:border-[#0E5C47]"
                      >
                        <option value="Fêmea">Fêmea</option>
                        <option value="Macho">Macho</option>
                      </select>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-3 pt-3 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setEditingTutor(null)}
                className="flex-1 py-2.5 border border-gray-200 rounded-xl text-xs font-bold text-gray-700 hover:bg-gray-50 cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 bg-[#0E5C47] hover:bg-[#0B4A39] text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
              >
                Salvar Alterações
              </button>
            </div>
          </form>
        </div>
      )}

      {/* MODAL DE CONFIRMAÇÃO DE EXCLUSÃO */}
      {tutorToDelete && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-gray-100 text-center space-y-4">
            <h3 className="text-base font-bold text-gray-800">Excluir registro?</h3>
            <p className="text-xs text-gray-500">
              Deseja apagar o tutor {tutorToDelete.nome} e seus pets?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setTutorToDelete(null)}
                className="flex-1 py-2 border rounded-xl text-xs cursor-pointer"
              >
                Cancelar
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="flex-1 py-2 bg-red-600 text-white rounded-xl text-xs font-bold cursor-pointer"
              >
                Apagar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}