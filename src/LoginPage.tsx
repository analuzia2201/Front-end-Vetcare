import { useState } from 'react';
import './index.css';

interface LoginPageProps {
  onNavigateToRegister?: () => void;
}

export default function LoginPage({ onNavigateToRegister }: LoginPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
      const response = await fetch(`${baseUrl}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        alert('Login realizado com sucesso!');
        if (data.token) {
          localStorage.setItem('token', data.token);
        }
        // Executa a navegação automática para o cadastro após o login
        if (onNavigateToRegister) {
          onNavigateToRegister();
        }
      } else {
        alert(data.message || 'E-mail ou senha incorretos.');
      }
    } catch (error) {
      console.error('Erro de conexão:', error);
      alert('Não foi possível conectar ao servidor do back-end.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full bg-[#154E41] flex items-center justify-center font-sans overflow-hidden">
      
      {/* Logo VetCare */}
      <div className="absolute top-12 left-12 z-0">
        <div className="flex items-center gap-4">
          <div className="bg-[#2D6456] p-3 rounded-2xl flex items-center justify-center">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2a3 3 0 0 0-3 3v1a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
              <path d="M18.5 6a2.5 2.5 0 0 0-2.5 2.5v1a2.5 2.5 0 0 0 5 0v-1A2.5 2.5 0 0 0 18.5 6Z" />
              <path d="M5.5 6A2.5 2.5 0 0 0 3 8.5v1a2.5 2.5 0 0 0 5 0v-1A2.5 2.5 0 0 0 5.5 6Z" />
              <path d="M12 11.5c-3 0-6.5 1.5-6.5 5.5S9 22 12 22s6.5-1 6.5-5S15 11.5 12 11.5Z" />
            </svg>
          </div>
          <h1 className="text-white text-[2.75rem] font-bold tracking-wide">VetCare</h1>
        </div>
      </div>

      {/* Ajuda */}
      <div className="absolute top-12 right-12 text-[#7CAFA1] text-sm">
        Precisa de ajuda? <a href="#" className="text-[#3CA481] hover:underline">Fale com a gente</a>
      </div>

      {/* Rodapé */}
      <div className="absolute bottom-12 left-12 text-[#7CAFA1] text-xs">
        Feito para quem cuida de vidas.
      </div>

      {/* Indicadores */}
      <div className="absolute bottom-12 right-12 flex items-center gap-2">
        <div className="w-6 h-1 bg-white rounded-full"></div>
        <div className="w-1 h-1 bg-[#5A8D7E] rounded-full"></div>
        <div className="w-1 h-1 bg-[#5A8D7E] rounded-full"></div>
      </div>

      {/* Card do Formulário */}
      <div className="bg-white rounded-3xl w-full max-w-sm p-7 shadow-2xl z-10">
        <div className="bg-[#E7F3EF] w-10 h-10 rounded-xl flex items-center justify-center mb-4">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1D8964" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
          </svg>
        </div>

        <h2 className="text-[#20332D] text-xl font-bold mb-1.5">Que bom ter você aqui.</h2>
        <p className="text-[#889792] text-xs leading-relaxed mb-5">
          Entre na sua conta e continue cuidando de quem faz a vida mais feliz.
        </p>

        <form onSubmit={handleLogin}>
          {/* E-mail */}
          <div className="mb-4">
            <label className="block text-[#3B4D47] text-xs font-bold mb-1.5">E-mail</label>
            <div className="relative flex items-center">
              <div className="absolute left-3.5 text-[#9BA8A4]">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="20" height="16" x="2" y="4" rx="2" />
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                </svg>
              </div>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu.email@exemplo.com"
                required
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-gray-200 text-xs text-[#3B4D47] font-medium focus:border-[#1D8964] focus:ring-1 focus:ring-[#1D8964] outline-none"
              />
            </div>
          </div>

          {/* Senha */}
          <div className="mb-4">
            <label className="block text-[#3B4D47] text-xs font-bold mb-1.5">Senha</label>
            <div className="relative flex items-center">
              <div className="absolute left-3.5 text-[#9BA8A4]">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
              </div>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full pl-10 pr-9 py-2.5 rounded-xl border border-gray-200 text-base tracking-widest text-[#3B4D47] font-medium focus:border-[#1D8964] focus:ring-1 focus:ring-[#1D8964] outline-none"
              />
            </div>
          </div>

          <div className="flex items-center justify-between mb-5">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" className="w-3.5 h-3.5 rounded border-gray-300 text-[#1D8964] focus:ring-[#1D8964] accent-[#1D8964] cursor-pointer" />
              <span className="text-[#889792] text-[0.72rem] font-medium">Lembrar de mim</span>
            </label>
            <a href="#" className="text-[#1D8964] text-[0.72rem] font-bold hover:underline">Esqueci minha senha</a>
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-[#1A8963] hover:bg-[#157152] text-white py-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14" />
              <path d="m12 5 7 7-7 7" />
            </svg>
            {isLoading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        <div className="mt-4 flex items-center justify-center gap-1 text-[#9BA8A4]">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            <path d="m9 12 2 2 4-4" />
          </svg>
          <span className="text-[0.62rem] font-medium">Seus dados e pacientes estão protegidos.</span>
        </div>
      </div>
    </div>
  );
}