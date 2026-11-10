import { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import './index.css';

interface Pet {
  id?: string;
  name: string;
  species: string;
  breed?: string;
  sex?: string;
}

interface Guardian {
  id: string;
  name: string;
  cpf: string;
  phone: string;
  email?: string;
  pets?: Pet[];
}

interface PatientsListPageProps {
  onNavigate: (page: string) => void;
}

export default function PatientsListPage({ onNavigate }: PatientsListPageProps) {
  const [guardians, setGuardians] = useState<Guardian[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [guardianToDelete, setGuardianToDelete] = useState<Guardian | null>(null);
  const [editingGuardian, setEditingGuardian] = useState<Guardian | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const baseUrl = import.meta.env.VITE_API_URL || 'https://vetcare-zcak.onrender.com';
      const token = localStorage.getItem('token');

      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      // 1. Busca os tutores (Guardians)
      const resGuardians = await fetch(`${baseUrl}/guardians`, { headers });

      if (resGuardians.status === 401 || resGuardians.status === 403) {
        localStorage.removeItem('token');
        onNavigate('login');
        return;
      }

      if (resGuardians.ok) {
        const guardiansData = await resGuardians.json();
        const rawGuardians = Array.isArray(guardiansData) 
          ? guardiansData 
          : guardiansData.guardians || guardiansData.data || [];

        // 2. Tenta buscar todos os pets cadastrados na rota /pets do NestJS
        let allPets: any[] = [];
        try {
          const resPets = await fetch(`${baseUrl}/pets`, { headers });
          if (resPets.ok) {
            const petsData = await resPets.json();
            allPets = Array.isArray(petsData) ? petsData : petsData.pets || petsData.data || [];
          }
        } catch (e) {
          console.log('Não foi possível buscar a rota /pets separadamente.');
        }

        // 3. Associa os pets aos tutores correspondentes
        const formattedList: Guardian[] = rawGuardians.map((item: any, idx: number) => {
          const guardianId = String(item.id || idx + 1);

          // Procura pets que venham embutidos ou que tenham o guardianId/tutorId correspondente
          const embeddedPets = item.pets || item.pet ? (Array.isArray(item.pets) ? item.pets : [item.pet]) : [];
          const matchedPets = allPets.filter((p: any) => 
            String(p.guardianId || p.tutorId || p.guardian?.id) === guardianId
          );

          const combinedRawPets = embeddedPets.length > 0 ? embeddedPets : matchedPets;

          const petsFormatted: Pet[] = combinedRawPets.map((p: any, pIdx: number) => ({
            id: p.id || `pet-${pIdx}`,
            name: p.name || p.nome || 'Pet sem nome',
            species: p.species || p.especie || 'Canina',
            breed: p.breed || p.raca || 'Sem raça definida',
            sex: (() => {
              const rawSex = p.sex || p.gender || p.sexo || 'Fêmea';
              if (String(rawSex).toUpperCase() === 'MALE' || String(rawSex).toUpperCase() === 'MACHO') return 'Macho';
              return 'Fêmea';
            })(),
          }));

          return {
            id: guardianId,
            name: item.name || item.nome || 'Sem Nome',
            cpf: item.cpf || 'Não informado',
            phone: item.phone || item.telefone || 'Não informado',
            email: item.email || 'Não informado',
            pets: petsFormatted,
          };
        });

        setGuardians(formattedList);
      }
    } catch (error) {
      console.error('Erro ao buscar dados:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!guardianToDelete) return;

    try {
      const baseUrl = import.meta.env.VITE_API_URL || 'https://vetcare-zcak.onrender.com';
      const token = localStorage.getItem('token');
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      await fetch(`${baseUrl}/guardians/${guardianToDelete.id}`, {
        method: 'DELETE',
        headers,
      });
    } catch (error) {
      console.error('Erro ao deletar:', error);
    } finally {
      setGuardians((prev) => prev.filter((g) => g.id !== guardianToDelete.id));
      alert('Registro removido com sucesso!');
      setGuardianToDelete(null);
    }
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingGuardian) return;

    try {
      const baseUrl = import.meta.env.VITE_API_URL || 'https://vetcare-zcak.onrender.com';
      const token = localStorage.getItem('token');
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      await fetch(`${baseUrl}/guardians/${editingGuardian.id}`, {
        method: 'PATCH',
        headers,
        body: JSON.stringify({
          name: editingGuardian.name,
          cpf: editingGuardian.cpf,
          phone: editingGuardian.phone,
          email: editingGuardian.email,
        }),
      });

      setGuardians((prev) =>
        prev.map((g) => (g.id === editingGuardian.id ? editingGuardian : g))
      );
      alert('Dados atualizados com sucesso!');
    } catch (error) {
      console.error('Erro ao editar:', error);
    } finally {
      setEditingGuardian(null);
    }
  };

  const handleAddPetToEditingGuardian = () => {
    if (!editingGuardian) return;
    setEditingGuardian({
      ...editingGuardian,
      pets: [
        ...(editingGuardian.pets || []),
        { name: '', species: 'Canina', breed: '', sex: 'Fêmea' },
      ],
    });
  };

  const handlePetChange = (index: number, field: keyof Pet, value: string) => {
    if (!editingGuardian || !editingGuardian.pets) return;
    const updatedPets = [...editingGuardian.pets];
    updatedPets[index] = { ...updatedPets[index], [field]: value };
    setEditingGuardian({ ...editingGuardian, pets: updatedPets });
  };

  const handleRemovePetFromEditingGuardian = (index: number) => {
    if (!editingGuardian || !editingGuardian.pets) return;
    setEditingGuardian({
      ...editingGuardian,
      pets: editingGuardian.pets.filter((_, i) => i !== index),
    });
  };

  const filteredGuardians = guardians.filter(
    (g) =>
      g.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      g.cpf.includes(searchTerm) ||
      (g.pets && g.pets.some((p) => p.name.toLowerCase().includes(searchTerm.toLowerCase())))
  );

  return (
    <div className="flex h-screen bg-[#F4F6F5] font-sans text-gray-700 overflow-hidden">
      <Sidebar activePage="lista" onNavigate={onNavigate} />

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

          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
            {isLoading ? (
              <div className="p-12 text-center text-xs text-gray-400">Carregando registros...</div>
            ) : filteredGuardians.length === 0 ? (
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
                    {filteredGuardians.map((guardian) => (
                      <tr key={guardian.id} className="hover:bg-gray-50/60 transition-colors">
                        <td className="py-4 px-6 font-bold text-gray-800">
                          {guardian.name}
                          <div className="text-[0.68rem] text-gray-400 font-normal">CPF: {guardian.cpf}</div>
                        </td>
                        <td className="py-4 px-6">
                          <div>{guardian.phone}</div>
                          <div className="text-[0.68rem] text-gray-400">{guardian.email || 'Não informado'}</div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex flex-wrap gap-1">
                            {guardian.pets && guardian.pets.length > 0 ? (
                              guardian.pets.map((p, idx) => (
                                <span
                                  key={idx}
                                  className="bg-[#E8F5F1] text-[#0E5C47] font-semibold px-2.5 py-1 rounded-lg text-xs"
                                >
                                  {p.name} ({p.sex})
                                </span>
                              ))
                            ) : (
                              <span className="text-gray-400 italic">Sem pet vinculado</span>
                            )}
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          {guardian.pets && guardian.pets.length > 0 ? (
                            <div className="space-y-1">
                              {guardian.pets.map((p, idx) => (
                                <div key={idx} className="text-xs">
                                  <span className="font-semibold text-gray-800">{p.species}</span>
                                  {p.breed && <span className="text-gray-400"> · {p.breed}</span>}
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
                            onClick={() => setEditingGuardian(guardian)}
                            className="p-2 text-gray-400 hover:text-[#0E5C47] hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer"
                            title="Editar tutor"
                          >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
                            </svg>
                          </button>

                          <button
                            type="button"
                            onClick={() => setGuardianToDelete(guardian)}
                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                            title="Deletar registro"
                          >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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

      {/* MODAL DE EDIÇÃO */}
      {editingGuardian && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <form
            onSubmit={handleSaveEdit}
            className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-gray-100 max-h-[90vh] overflow-y-auto space-y-5"
          >
            <div className="flex justify-between items-center border-b border-gray-100 pb-3">
              <h3 className="text-base font-bold text-gray-800">
                Editar Cadastro de {editingGuardian.name}
              </h3>
              <button
                type="button"
                onClick={() => setEditingGuardian(null)}
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
                    value={editingGuardian.name}
                    onChange={(e) => setEditingGuardian({ ...editingGuardian, name: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#0E5C47]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[0.7rem] font-semibold text-gray-600 mb-1">CPF</label>
                  <input
                    type="text"
                    value={editingGuardian.cpf}
                    onChange={(e) => setEditingGuardian({ ...editingGuardian, cpf: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#0E5C47]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[0.7rem] font-semibold text-gray-600 mb-1">Telefone</label>
                  <input
                    type="text"
                    value={editingGuardian.phone}
                    onChange={(e) => setEditingGuardian({ ...editingGuardian, phone: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#0E5C47]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[0.7rem] font-semibold text-gray-600 mb-1">E-mail</label>
                  <input
                    type="email"
                    value={editingGuardian.email || ''}
                    onChange={(e) => setEditingGuardian({ ...editingGuardian, email: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#0E5C47]"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-[#0E5C47] uppercase tracking-wider">
                  Pets Vinculados ({editingGuardian.pets?.length || 0})
                </h4>
                <button
                  type="button"
                  onClick={handleAddPetToEditingGuardian}
                  className="text-xs font-bold text-[#0E5C47] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  + Adicionar outro pet
                </button>
              </div>

              {editingGuardian.pets && editingGuardian.pets.map((pet, idx) => (
                <div
                  key={idx}
                  className="bg-gray-50 p-3 rounded-2xl border border-gray-200 relative space-y-2"
                >
                  <div className="flex justify-between items-center">
                    <span className="text-[0.7rem] font-bold text-gray-500">Pet {idx + 1}</span>
                    {editingGuardian.pets && editingGuardian.pets.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemovePetFromEditingGuardian(idx)}
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
                        value={pet.name}
                        onChange={(e) => handlePetChange(idx, 'name', e.target.value)}
                        className="w-full border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs bg-white focus:outline-none focus:border-[#0E5C47]"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-[0.65rem] text-gray-500 mb-1">Espécie</label>
                      <input
                        type="text"
                        value={pet.species}
                        onChange={(e) => handlePetChange(idx, 'species', e.target.value)}
                        className="w-full border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs bg-white focus:outline-none focus:border-[#0E5C47]"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-[0.65rem] text-gray-500 mb-1">Raça</label>
                      <input
                        type="text"
                        value={pet.breed || ''}
                        onChange={(e) => handlePetChange(idx, 'breed', e.target.value)}
                        className="w-full border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs bg-white focus:outline-none focus:border-[#0E5C47]"
                      />
                    </div>
                    <div>
                      <label className="block text-[0.65rem] text-gray-500 mb-1">Sexo</label>
                      <select
                        value={pet.sex || 'Fêmea'}
                        onChange={(e) => handlePetChange(idx, 'sex', e.target.value)}
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
                onClick={() => setEditingGuardian(null)}
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

      {/* MODAL EXCLUSÃO */}
      {guardianToDelete && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-gray-100 text-center space-y-4">
            <h3 className="text-base font-bold text-gray-800">Excluir registro?</h3>
            <p className="text-xs text-gray-500">
              Deseja apagar o tutor {guardianToDelete.name} e seus pets?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setGuardianToDelete(null)}
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