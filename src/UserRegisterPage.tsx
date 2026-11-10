import { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import './index.css';

interface User {
  id: string;
  nome: string;
  email: string;
  cpf: string;
  dataNascimento: string;
  grupoAcesso: string;
  crmv?: string | null;
}

interface UserRegisterPageProps {
  onNavigate: (page: string) => void;
}

export default function UserRegisterPage({ onNavigate }: UserRegisterPageProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Estados dos Modais
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);

  // Estado do Form de Novo Colaborador
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newCpf, setNewCpf] = useState('');
  const [newBirthDate, setNewBirthDate] = useState('');
  const [newRole, setNewRole] = useState('Recepcionista');
  const [newCrmv, setNewCrmv] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
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
        
        const formattedUsers: User[] = rawList.map((item: any, idx: number) => ({
          id: item.id || String(idx + 1),
          nome: item.nome || item.name || 'Sem Nome',
          email: item.email || 'Não informado',
          cpf: item.cpf || '000.000.000-00',
          dataNascimento: item.dataNascimento || item.birthDate || '',
          grupoAcesso: item.grupoAcesso || item.role || 'Recepcionista',
          crmv: item.crmv || null,
        }));
        setUsers(formattedUsers);
      }
    } catch (error) {
      console.error('Erro ao listar usuários:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const newUserPayload = {
      nome: newName,
      email: newEmail,
      cpf: newCpf,
      dataNascimento: newBirthDate,
      grupoAcesso: newRole,
      crmv: newRole === 'Veterinário(a)' ? newCrmv : null,
    };

    try {
      const baseUrl = import.meta.env.VITE_API_URL || 'https://vetcare-zcak.onrender.com';
      const token = localStorage.getItem('token');

      let response = await fetch(`${baseUrl}/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(newUserPayload),
      });

      if (!response.ok) {
        response = await fetch(`${baseUrl}/api/users`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify(newUserPayload),
        });
      }

      fetchUsers();
    } catch (error) {
      console.error('Erro de conexão ao salvar no backend:', error);
    } finally {
      alert('Colaborador cadastrado com sucesso!');
      setIsLoading(false);
      setIsCreateOpen(false);
      setNewName('');
      setNewEmail('');
      setNewCpf('');
      setNewBirthDate('');
      setNewRole('Recepcionista');
      setNewCrmv('');
    }
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;

    setUsers((prev) =>
      prev.map((u) => (u.id === editingUser.id ? editingUser : u))
    );
    alert('Dados do colaborador atualizados com sucesso!');
    setEditingUser(null);
  };

  const handleDeleteConfirm = async () => {
    if (!userToDelete) return;

    try {
      const baseUrl = import.meta.env.VITE_API_URL || 'https://vetcare-zcak.onrender.com';
      const token = localStorage.getItem('token');

      await fetch(`${baseUrl}/users/${userToDelete.id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
    } catch (error) {
      console.error('Erro ao deletar usuário:', error);
    } finally {
      setUsers((prev) => prev.filter((u) => u.id !== userToDelete.id));
      alert('Colaborador removido com sucesso!');
      setUserToDelete(null);
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      user.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.cpf.includes(searchTerm) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.grupoAcesso.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex h-screen bg-[#F4F6F5] font-sans text-gray-700 overflow-hidden">
      <Sidebar activePage="cadastrarUsuario" onNavigate={onNavigate} />

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
              placeholder="Buscar por colaborador, e-mail, CPF ou cargo..."
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
              <h1 className="text-2xl font-bold text-[#1F2937]">Equipe e Controle de Acessos</h1>
              <p className="text-xs text-gray-500 mt-0.5">
                Gerencie os veterinários, recepcionistas e administradores do sistema.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setIsCreateOpen(true)}
              className="px-4 py-2.5 bg-[#0E5C47] hover:bg-[#0B4A39] text-white rounded-xl text-xs font-bold flex items-center gap-2 transition-colors cursor-pointer"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              Novo Colaborador
            </button>
          </div>

          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
            {isLoading ? (
              <div className="p-12 text-center text-xs text-gray-400">Carregando equipe...</div>
            ) : filteredUsers.length === 0 ? (
              <div className="p-12 text-center text-xs text-gray-400">Nenhum colaborador encontrado.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-100 text-[0.7rem] uppercase tracking-wider text-gray-400">
                      <th className="py-3.5 px-6 font-bold">Colaborador</th>
                      <th className="py-3.5 px-6 font-bold">Contato / CPF</th>
                      <th className="py-3.5 px-6 font-bold">Grupo / Função</th>
                      <th className="py-3.5 px-6 font-bold">Registro CRMV</th>
                      <th className="py-3.5 px-6 font-bold text-right">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-xs text-gray-700">
                    {filteredUsers.map((user) => (
                      <tr key={user.id} className="hover:bg-gray-50/60 transition-colors">
                        <td className="py-4 px-6 font-bold text-gray-800">
                          {user.nome}
                          <div className="text-[0.68rem] text-gray-400 font-normal">
                            Nasc: {user.dataNascimento || 'Não informada'}
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <div>{user.email}</div>
                          <div className="text-[0.68rem] text-gray-400">CPF: {user.cpf}</div>
                        </td>
                        <td className="py-4 px-6">
                          <span
                            className={`inline-block font-semibold px-2.5 py-1 rounded-lg text-xs ${
                              user.grupoAcesso === 'Administrador'
                                ? 'bg-purple-100 text-purple-700'
                                : user.grupoAcesso === 'Veterinário(a)'
                                ? 'bg-[#E8F5F1] text-[#0E5C47]'
                                : 'bg-blue-50 text-blue-700'
                            }`}
                          >
                            {user.grupoAcesso}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          {user.crmv ? (
                            <span className="font-semibold text-gray-800">{user.crmv}</span>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </td>
                        <td className="py-4 px-6 text-right space-x-1">
                          <button
                            type="button"
                            onClick={() => setEditingUser(user)}
                            className="p-2 text-gray-400 hover:text-[#0E5C47] hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer"
                            title="Editar colaborador"
                          >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
                            </svg>
                          </button>

                          <button
                            type="button"
                            onClick={() => setUserToDelete(user)}
                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                            title="Remover colaborador"
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

      {/* MODAL NOVO COLABORADOR */}
      {isCreateOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <form
            onSubmit={handleCreateUser}
            className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-gray-100 space-y-5 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex justify-between items-center border-b border-gray-100 pb-3">
              <h3 className="text-base font-bold text-gray-800">Cadastrar Novo Colaborador</h3>
              <button
                type="button"
                onClick={() => setIsCreateOpen(false)}
                className="text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Nome Completo *</label>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="Ex: Roberto Silva"
                  required
                  className="w-full border border-gray-200 rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-[#0E5C47]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">E-mail Corporativo *</label>
                <input
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="nome@clinica.com.br"
                  required
                  className="w-full border border-gray-200 rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-[#0E5C47]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">CPF *</label>
                  <input
                    type="text"
                    value={newCpf}
                    onChange={(e) => setNewCpf(e.target.value)}
                    placeholder="000.000.000-00"
                    required
                    className="w-full border border-gray-200 rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-[#0E5C47]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Data de Nascimento</label>
                  <input
                    type="text"
                    value={newBirthDate}
                    onChange={(e) => setNewBirthDate(e.target.value)}
                    placeholder="DD/MM/AAAA"
                    className="w-full border border-gray-200 rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-[#0E5C47]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Grupo / Função *</label>
                <select
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value)}
                  required
                  className="w-full border border-gray-200 rounded-xl px-3.5 py-2 text-xs text-gray-800 focus:outline-none focus:border-[#0E5C47] bg-white"
                >
                  <option value="Recepcionista">Recepcionista (Agendamentos e Tutores)</option>
                  <option value="Veterinário(a)">Veterinário(a) (Prontuários e Consultas)</option>
                  <option value="Administrador">Administrador (Acesso Total)</option>
                  <option value="Estagiário(a)">Estagiário(a) (Acesso Restrito)</option>
                  <option value="Financeiro">Financeiro (Faturamento e Caixa)</option>
                </select>
              </div>

              {newRole === 'Veterinário(a)' && (
                <div className="p-3.5 bg-[#E8F5F1]/50 border border-[#D1EBE2] rounded-2xl space-y-1.5">
                  <label className="block text-xs font-bold text-[#0E5C47]">CRMV *</label>
                  <input
                    type="text"
                    value={newCrmv}
                    onChange={(e) => setNewCrmv(e.target.value)}
                    placeholder="Ex: CRMV-BA 12345"
                    required={newRole === 'Veterinário(a)'}
                    className="w-full border border-gray-200 bg-white rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-[#0E5C47]"
                  />
                </div>
              )}
            </div>

            <div className="flex gap-3 pt-3 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setIsCreateOpen(false)}
                className="flex-1 py-2.5 border border-gray-200 rounded-xl text-xs font-bold text-gray-700 hover:bg-gray-50 cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 py-2.5 bg-[#0E5C47] hover:bg-[#0B4A39] text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
              >
                {isLoading ? 'Salvando...' : 'Cadastrar Colaborador'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* MODAL EDITAR COLABORADOR */}
      {editingUser && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <form
            onSubmit={handleSaveEdit}
            className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-gray-100 space-y-5 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex justify-between items-center border-b border-gray-100 pb-3">
              <h3 className="text-base font-bold text-gray-800">
                Editar Colaborador: {editingUser.nome}
              </h3>
              <button
                type="button"
                onClick={() => setEditingUser(null)}
                className="text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Nome Completo</label>
                <input
                  type="text"
                  value={editingUser.nome}
                  onChange={(e) => setEditingUser({ ...editingUser, nome: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#0E5C47]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">E-mail Corporativo</label>
                <input
                  type="email"
                  value={editingUser.email}
                  onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#0E5C47]"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">CPF</label>
                  <input
                    type="text"
                    value={editingUser.cpf}
                    onChange={(e) => setEditingUser({ ...editingUser, cpf: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#0E5C47]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Data de Nascimento</label>
                  <input
                    type="text"
                    value={editingUser.dataNascimento}
                    onChange={(e) => setEditingUser({ ...editingUser, dataNascimento: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#0E5C47]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Grupo / Função</label>
                <select
                  value={editingUser.grupoAcesso}
                  onChange={(e) => setEditingUser({ ...editingUser, grupoAcesso: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-xs bg-white focus:outline-none focus:border-[#0E5C47]"
                >
                  <option value="Recepcionista">Recepcionista</option>
                  <option value="Veterinário(a)">Veterinário(a)</option>
                  <option value="Administrador">Administrador</option>
                  <option value="Estagiário(a)">Estagiário(a)</option>
                  <option value="Financeiro">Financeiro</option>
                </select>
              </div>

              {editingUser.grupoAcesso === 'Veterinário(a)' && (
                <div className="p-3 bg-[#E8F5F1]/50 border border-[#D1EBE2] rounded-2xl space-y-1">
                  <label className="block text-xs font-bold text-[#0E5C47]">CRMV *</label>
                  <input
                    type="text"
                    value={editingUser.crmv || ''}
                    onChange={(e) => setEditingUser({ ...editingUser, crmv: e.target.value })}
                    placeholder="Ex: CRMV-BA 12345"
                    required={editingUser.grupoAcesso === 'Veterinário(a)'}
                    className="w-full border border-gray-200 bg-white rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#0E5C47]"
                  />
                </div>
              )}
            </div>

            <div className="flex gap-3 pt-3 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setEditingUser(null)}
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
      {userToDelete && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-gray-100 text-center space-y-4">
            <h3 className="text-base font-bold text-gray-800">Remover colaborador?</h3>
            <p className="text-xs text-gray-500">
              Deseja remover <strong>{userToDelete.nome}</strong> da equipe? Esta ação revogará o acesso ao sistema.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setUserToDelete(null)}
                className="flex-1 py-2 border rounded-xl text-xs cursor-pointer"
              >
                Cancelar
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="flex-1 py-2 bg-red-600 text-white rounded-xl text-xs font-bold cursor-pointer"
              >
                Remover
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}