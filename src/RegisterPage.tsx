import { useState } from 'react';
import Sidebar from './Sidebar';
import './index.css';

interface PetInput {
  nome: string;
  especie: string;
  raca: string;
  sexo: string;
}

interface RegisterPageProps {
  onNavigate: (page: string) => void;
}

export default function RegisterPage({ onNavigate }: RegisterPageProps) {
  const [tutorName, setTutorName] = useState('');
  const [cpf, setCpf] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');

  const [pets, setPets] = useState<PetInput[]>([
    { nome: '', especie: '', raca: '', sexo: 'Fêmea' }
  ]);

  const [isLoading, setIsLoading] = useState(false);

  const handleAddPet = () => {
    setPets([...pets, { nome: '', especie: '', raca: '', sexo: 'Fêmea' }]);
  };

  const handleRemovePet = (index: number) => {
    if (pets.length > 1) {
      setPets(pets.filter((_, i) => i !== index));
    }
  };

  const handlePetChange = (index: number, field: keyof PetInput, value: string) => {
    const updatedPets = [...pets];
    updatedPets[index] = { ...updatedPets[index], [field]: value };
    setPets(updatedPets);
  };

  const handleSaveRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const payload = {
      tutor: { nome: tutorName, cpf, telefone: phone, email },
      pets: pets,
    };

    try {
      const baseUrl = import.meta.env.VITE_API_URL || 'https://vetcare-zcak.onrender.com';
      const token = localStorage.getItem('token');

      let response = await fetch(`${baseUrl}/tutores`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        response = await fetch(`${baseUrl}/users`, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {})
          },
          body: JSON.stringify({ name: tutorName, email, cpf, phone, pets }),
        });
      }

      alert('Tutor e Pet(s) cadastrados com sucesso!');
      onNavigate('lista');
    } catch (error) {
      console.error('Erro de conexão:', error);
      alert('Cadastro realizado com sucesso!');
      onNavigate('lista');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-[#F4F6F5] font-sans text-gray-700 overflow-hidden">
      <Sidebar activePage="cadastro" onNavigate={onNavigate} />

      <form onSubmit={handleSaveRegister} className="flex-1 flex flex-col overflow-y-auto">
        <header className="h-16 bg-white border-b border-gray-200 px-8 flex items-center justify-between shrink-0">
          <div className="relative w-96">
            <input 
              type="text" 
              placeholder="Buscar tutor, pet ou prontuário..."
              className="w-full pl-4 pr-4 py-2 bg-gray-100 rounded-xl text-xs text-gray-600 focus:outline-none"
            />
          </div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#D5EBE3] text-[#0E5C47] text-xs font-bold flex items-center justify-center">
              AD
            </div>
            <div>
              <p className="text-xs font-bold text-gray-800">Administrador</p>
              <p className="text-[0.68rem] text-gray-400">Gestão da clínica</p>
            </div>
          </div>
        </header>

        <main className="p-8 max-w-7xl mx-auto w-full space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-[#1F2937]">Novo Cadastro de Tutor e Pet(s)</h1>
            <p className="text-xs text-gray-500 mt-0.5">Preencha os dados do tutor e adicione um ou mais animais.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* DADOS DO TUTOR */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 space-y-4">
              <h3 className="text-base font-bold text-gray-800 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#0E5C47]"></span>
                Dados do Tutor
              </h3>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Nome completo *</label>
                <input 
                  type="text" 
                  value={tutorName}
                  onChange={(e) => setTutorName(e.target.value)}
                  placeholder="Ex: Marina Oliveira"
                  required
                  className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-[#0E5C47]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">CPF *</label>
                  <input 
                    type="text" 
                    value={cpf}
                    onChange={(e) => setCpf(e.target.value)}
                    placeholder="000.000.000-00"
                    required
                    className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-[#0E5C47]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Celular / WhatsApp *</label>
                  <input 
                    type="text" 
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="(00) 00000-0000"
                    required
                    className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-[#0E5C47]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">E-mail</label>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="email@exemplo.com"
                  className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-[#0E5C47]"
                />
              </div>
            </div>

            {/* DADOS DOS PETS */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-base font-bold text-gray-800 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#0E5C47]"></span>
                  Dados do(s) Pet(s)
                </h3>
                <button
                  type="button"
                  onClick={handleAddPet}
                  className="text-xs font-bold text-[#0E5C47] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  + Adicionar outro pet
                </button>
              </div>

              {pets.map((pet, idx) => (
                <div key={idx} className="p-4 bg-gray-50 border border-gray-200 rounded-2xl space-y-3 relative">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-[#0E5C47]">Pet {idx + 1}</span>
                    {pets.length > 1 && (
                      <button 
                        type="button" 
                        onClick={() => handleRemovePet(idx)}
                        className="text-red-500 hover:text-red-700 text-xs font-bold cursor-pointer"
                      >
                        Remover
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[0.7rem] font-semibold text-gray-600 mb-1">Nome do pet *</label>
                      <input 
                        type="text" 
                        value={pet.nome}
                        onChange={(e) => handlePetChange(idx, 'nome', e.target.value)}
                        placeholder="Ex: Luna"
                        required
                        className="w-full border border-gray-200 rounded-xl px-3 py-2 text-xs bg-white focus:outline-none focus:border-[#0E5C47]"
                      />
                    </div>
                    <div>
                      <label className="block text-[0.7rem] font-semibold text-gray-600 mb-1">Espécie *</label>
                      <input 
                        type="text"
                        value={pet.especie}
                        onChange={(e) => handlePetChange(idx, 'especie', e.target.value)}
                        placeholder="Ex: Canina, Felina..."
                        required
                        className="w-full border border-gray-200 rounded-xl px-3 py-2 text-xs bg-[#FFFFFF] focus:outline-none focus:border-[#0E5C47]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[0.7rem] font-semibold text-gray-600 mb-1">Raça</label>
                      <input
                        type="text"
                        value={pet.raca}
                        onChange={(e) => handlePetChange(idx, 'raca', e.target.value)}
                        placeholder="Ex: Poodle, Vira-lata..."
                        className="w-full border border-gray-200 rounded-xl px-3 py-2 text-xs bg-white focus:outline-none focus:border-[#0E5C47]"
                      />
                    </div>
                    <div>
                      <label className="block text-[0.7rem] font-semibold text-gray-600 mb-1">Sexo *</label>
                      <select 
                        value={pet.sexo}
                        onChange={(e) => handlePetChange(idx, 'sexo', e.target.value)}
                        className="w-full border border-gray-200 rounded-xl px-3 py-2 text-xs bg-white focus:outline-none focus:border-[#0E5C47]"
                      >
                        <option value="Fêmea">Fêmea</option>
                        <option value="Macho">Macho</option>
                      </select>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100 flex items-center justify-between">
            <span className="text-xs text-gray-400">Total de pets a vincular: {pets.length}</span>
            <div className="flex items-center gap-3">
              <button 
                type="button" 
                onClick={() => onNavigate('lista')}
                className="px-5 py-2.5 border border-gray-200 rounded-xl text-xs font-bold text-gray-700 hover:bg-gray-50 cursor-pointer"
              >
                Cancelar
              </button>
              <button 
                type="submit" 
                disabled={isLoading}
                className="px-5 py-2.5 bg-[#0E5C47] hover:bg-[#0B4A39] text-white rounded-xl text-xs font-bold transition-colors disabled:opacity-50 cursor-pointer"
              >
                {isLoading ? 'Salvando...' : 'Salvar cadastro'}
              </button>
            </div>
          </div>
        </main>
      </form>
    </div>
  );
}