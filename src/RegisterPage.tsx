import { useState } from 'react';
import './index.css';

export default function RegisterPage() {
  // Dados do Tutor limpos
  const [tutorName, setTutorName] = useState('');
  const [cpf, setCpf] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [cep, setCep] = useState('');
  const [cityUf, setCityUf] = useState('');
  const [address, setAddress] = useState('');
  const [allowReminders, setAllowReminders] = useState(false);

  // Dados do Pet limpos
  const [petName, setPetName] = useState('');
  const [species, setSpecies] = useState('Canina');
  const [breed, setBreed] = useState('');
  const [gender, setGender] = useState('Fêmea');
  const [birthDate, setBirthDate] = useState('');
  const [weight, setWeight] = useState('');
  const [neutered, setNeutered] = useState('Castrada');
  const [coatColor, setCoatColor] = useState('');
  const [microchip, setMicrochip] = useState('');

  const [isLoading, setIsLoading] = useState(false);

  const handleSaveRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const payload = {
      tutor: {
        nome: tutorName,
        cpf,
        telefone: phone,
        email,
        cep,
        cidadeUf: cityUf,
        endereco: address,
        autorizaLembretes: allowReminders,
      },
      pet: {
        nome: petName,
        especie: species,
        raca: breed,
        sexo: gender,
        dataNascimento: birthDate,
        peso: weight,
        castracao: neutered,
        pelagem: coatColor,
        microchip,
      },
    };

    try {
      const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
      const token = localStorage.getItem('token');

      const response = await fetch(`${baseUrl}/tutores`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        alert('Tutor e Pet cadastrados com sucesso!');
        // Limpa os campos após salvar com sucesso
        setTutorName('');
        setCpf('');
        setPhone('');
        setEmail('');
        setCep('');
        setCityUf('');
        setAddress('');
        setAllowReminders(false);
        setPetName('');
        setBreed('');
        setBirthDate('');
        setWeight('');
        setCoatColor('');
        setMicrochip('');
      } else {
        const errorData = await response.json();
        alert(errorData.message || 'Erro ao cadastrar tutor e pet.');
      }
    } catch (error) {
      console.error('Erro de conexão:', error);
      alert('Não foi possível se comunicar com o servidor do back-end.');
    } finally {
      setIsLoading(false);
    }
  };

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
      <form onSubmit={handleSaveRegister} className="flex-1 flex flex-col overflow-y-auto">
        
        {/* HEADER */}
        <header className="h-16 bg-white border-b border-gray-200 px-8 flex items-center justify-between shrink-0">
          <div className="relative w-96">
            <svg className="absolute left-3.5 top-2.5 text-gray-400" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input 
              type="text" 
              placeholder="Buscar tutor, pet ou prontuário..."
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

        {/* CONTEÚDO */}
        <main className="p-8 max-w-7xl mx-auto w-full space-y-6">
          
          <div>
            <div className="flex justify-between items-center text-xs text-gray-400 mb-1">
              <span>Tutores e pets <span className="mx-1">/</span> <strong className="text-gray-500 font-normal">Novo cadastro</strong></span>
              <span>Novo cadastro</span>
            </div>
            <h1 className="text-2xl font-bold text-[#1F2937]">Um novo vínculo de cuidado</h1>
            <p className="text-xs text-gray-500 mt-0.5">Cadastre o tutor e seu pet para manter tudo conectado, desde o primeiro dia.</p>
          </div>

          <div className="bg-[#E8F5F1] border border-[#D1EBE2] rounded-2xl p-3.5 flex items-center justify-between text-xs text-[#0E5C47]">
            <div className="flex items-center gap-2.5">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
              <span>O pet ficará vinculado ao tutor informado abaixo. Os campos com <strong>*</strong> são obrigatórios.</span>
            </div>
            <svg className="text-[#0E5C47] cursor-pointer" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* DADOS DO TUTOR */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-9 h-9 rounded-xl bg-[#E8F5F1] text-[#0E5C47] flex items-center justify-center">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-gray-800">Dados do Tutor</h3>
                    <p className="text-xs text-gray-400">Quem compartilha a vida com esse pet.</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">Nome completo *</label>
                    <input 
                      type="text" 
                      value={tutorName}
                      onChange={(e) => setTutorName(e.target.value)}
                      placeholder="Ex: Marina Oliveira"
                      required
                      className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-gray-800 focus:outline-none focus:border-[#0E5C47]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1.5">CPF *</label>
                      <input 
                        type="text" 
                        value={cpf}
                        onChange={(e) => setCpf(e.target.value)}
                        placeholder="000.000.000-00"
                        required
                        className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-gray-800 focus:outline-none focus:border-[#0E5C47]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1.5">Celular / WhatsApp *</label>
                      <input 
                        type="text" 
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="(00) 00000-0000"
                        required
                        className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-gray-800 focus:outline-none focus:border-[#0E5C47]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">E-mail</label>
                    <input 
                      type="email" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="email@exemplo.com"
                      className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-gray-800 focus:outline-none focus:border-[#0E5C47]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1.5">CEP</label>
                      <input 
                        type="text" 
                        value={cep}
                        onChange={(e) => setCep(e.target.value)}
                        placeholder="00000-000"
                        className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-gray-800 focus:outline-none focus:border-[#0E5C47]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1.5">Cidade / UF</label>
                      <input 
                        type="text" 
                        value={cityUf}
                        onChange={(e) => setCityUf(e.target.value)}
                        placeholder="Cidade / UF"
                        className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-gray-800 focus:outline-none focus:border-[#0E5C47]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">Endereço e número</label>
                    <input 
                      type="text" 
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="Rua, número e complemento"
                      className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-gray-800 focus:outline-none focus:border-[#0E5C47]"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-6 mt-4">
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={allowReminders}
                    onChange={(e) => setAllowReminders(e.target.checked)}
                    className="w-4 h-4 rounded text-[#0E5C47] focus:ring-[#0E5C47] accent-[#0E5C47]" 
                  />
                  <span className="text-xs text-gray-500 font-medium">Tutor autoriza lembretes de consultas e vacinas.</span>
                </label>
              </div>
            </div>

            {/* DADOS DO PET */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-9 h-9 rounded-xl bg-[#E8F5F1] text-[#0E5C47] flex items-center justify-center">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2a3 3 0 0 0-3 3v1a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M18.5 6a2.5 2.5 0 0 0-2.5 2.5v1a2.5 2.5 0 0 0 5 0v-1A2.5 2.5 0 0 0 18.5 6Z"/><path d="M5.5 6A2.5 2.5 0 0 0 3 8.5v1a2.5 2.5 0 0 0 5 0v-1A2.5 2.5 0 0 0 5.5 6Z"/><path d="M12 11.5c-3 0-6.5 1.5-6.5 5.5S9 22 12 22s6.5-1 6.5-5S15 11.5 12 11.5Z"/></svg>
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-gray-800">Dados do Pet</h3>
                    <p className="text-xs text-gray-400">Cada detalhe ajuda a cuidar melhor.</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1.5">Nome do pet *</label>
                      <input 
                        type="text" 
                        value={petName}
                        onChange={(e) => setPetName(e.target.value)}
                        placeholder="Ex: Luna"
                        required
                        className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-gray-800 focus:outline-none focus:border-[#0E5C47]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1.5">Espécie *</label>
                      <select 
                        value={species}
                        onChange={(e) => setSpecies(e.target.value)}
                        required
                        className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-gray-800 focus:outline-none focus:border-[#0E5C47] bg-white"
                      >
                        <option value="Canina">Canina</option>
                        <option value="Felina">Felina</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1.5">Raça</label>
                      <input
                        type="text"
                        value={breed}
                        onChange={(e) => setBreed(e.target.value)}
                        placeholder="Ex: Golden retriever"
                        className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-gray-800 focus:outline-none focus:border-[#0E5C47]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1.5">Sexo *</label>
                      <select 
                        value={gender}
                        onChange={(e) => setGender(e.target.value)}
                        required
                        className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-gray-800 focus:outline-none focus:border-[#0E5C47] bg-white"
                      >
                        <option value="Fêmea">Fêmea</option>
                        <option value="Macho">Macho</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1.5">Data de nascimento</label>
                      <div className="relative">
                        <input 
                          type="text" 
                          value={birthDate}
                          onChange={(e) => setBirthDate(e.target.value)}
                          placeholder="DD/MM/AAAA"
                          className="w-full border border-gray-200 rounded-xl pl-9 pr-3.5 py-2.5 text-xs text-gray-800 focus:outline-none focus:border-[#0E5C47]"
                        />
                        <svg className="absolute left-3 top-3 text-gray-400" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1.5">Peso atual</label>
                      <input 
                        type="text" 
                        value={weight}
                        onChange={(e) => setWeight(e.target.value)}
                        placeholder="Ex: 10 kg"
                        className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-gray-800 focus:outline-none focus:border-[#0E5C47]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1.5">Castração</label>
                      <select 
                        value={neutered}
                        onChange={(e) => setNeutered(e.target.value)}
                        className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-gray-800 focus:outline-none focus:border-[#0E5C47] bg-white"
                      >
                        <option value="Castrada">Castrada</option>
                        <option value="Não castrada">Não castrada</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1.5">Pelagem / cor</label>
                      <input 
                        type="text" 
                        value={coatColor}
                        onChange={(e) => setCoatColor(e.target.value)}
                        placeholder="Ex: Dourada"
                        className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-gray-800 focus:outline-none focus:border-[#0E5C47]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">Microchip (opcional)</label>
                    <input 
                      type="text" 
                      value={microchip}
                      onChange={(e) => setMicrochip(e.target.value)}
                      placeholder="Código do microchip"
                      className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-gray-800 focus:outline-none focus:border-[#0E5C47]"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-6 mt-4 flex items-center gap-2 text-[0.72rem] text-gray-400">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                <span>O número do prontuário será gerado ao salvar.</span>
              </div>
            </div>

          </div>

          {/* BARRA INFERIOR */}
          <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
              </div>
              <div>
                <p className="text-xs font-bold text-gray-700">Os dados estão em boas mãos.</p>
                <p className="text-[0.68rem] text-gray-400">Informações protegidas e utilizadas apenas no cuidado clínico.</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button 
                type="button" 
                className="px-5 py-2.5 border border-gray-200 rounded-xl text-xs font-bold text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button 
                type="submit" 
                disabled={isLoading}
                className="px-5 py-2.5 bg-[#0E5C47] hover:bg-[#0B4A39] text-white rounded-xl text-xs font-bold flex items-center gap-2 transition-colors disabled:opacity-50"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>
                {isLoading ? 'Salvando...' : 'Salvar cadastro'}
              </button>
            </div>
          </div>

        </main>
      </form>

    </div>
  );
}