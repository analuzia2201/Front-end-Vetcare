import { useState } from 'react';

interface LoginPageProps {
  onNavigateToList: () => void;
}

export default function LoginPage({ onNavigateToList }: LoginPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');

    const baseUrl = import.meta.env.VITE_API_URL || 'https://vetcare-zcak.onrender.com';

    try {
      let response = await fetch(`${baseUrl}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password }),
      });

      if (!response.ok) {
        response = await fetch(`${baseUrl}/api/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: email.trim(), password }),
        });
      }

      if (!response.ok) {
        throw new Error('E-mail ou senha incorretos.');
      }

      const data = await response.json();
      const token = data.token || data.access_token || data.accessToken;

      if (!token) {
        throw new Error('O servidor não retornou um token de acesso válido.');
      }

      localStorage.setItem('token', token);
      onNavigateToList();
    } catch (error: any) {
      console.error('Erro no login:', error);
      setErrorMessage(error.message || 'Falha na conexão com o servidor.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full bg-[#135A46] font-sans flex items-center justify-center p-6 select-none overflow-hidden">
      {/* Cabeçalho Superior Esquerdo (Logo e Nome VetCare Aumentados) */}
      <div className="absolute top-8 left-10 flex items-center gap-4">
        <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white shadow-lg">
          <svg
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 2a3 3 0 0 0-3 3v1a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
            <path d="M18.5 6a2.5 2.5 0 0 0-2.5 2.5v1a2.5 2.5 0 0 0 5 0v-1A2.5 2.5 0 0 0 18.5 6Z" />
            <path d="M5.5 6A2.5 2.5 0 0 0 3 8.5v1a2.5 2.5 0 0 0 5 0v-1A2.5 2.5 0 0 0 5.5 6Z" />
            <path d="M12 11.5c-3 0-6.5 1.5-6.5 5.5S9 22 12 22s6.5-1 6.5-5S15 11.5 12 11.5Z" />
          </svg>
        </div>
        <span className="text-5xl font-bold text-white tracking-tight">VetCare</span>
      </div>

      {/* Cabeçalho Superior Direito (Ajuda) */}
      <div className="absolute top-8 right-10 text-xs text-[#8EBFA9]">
        Precisa de ajuda?{' '}
        <a href="#" className="hover:underline font-semibold text-[#BDE3D2]">
          Fale com a gente
        </a>
      </div>

      {/* Rodapé Inferior Esquerdo */}
      <div className="absolute bottom-8 left-10 text-xs text-[#8EBFA9]">
        Feito para quem cuida de vidas.
      </div>

      {/* Card de Login Centralizado */}
      <div className="w-full max-w-md bg-white rounded-[2rem] p-8 shadow-2xl space-y-6 relative z-10 border border-gray-100">
        <div>
          <div className="w-10 h-10 rounded-xl bg-[#E8F5F1] flex items-center justify-center text-[#135A46] mb-4">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-800">Painel de Acesso</h2>
          <p className="text-xs text-gray-400 mt-1">
            Entre com sua conta de funcionário ou administrador.
          </p>
        </div>

        {errorMessage && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-600 font-medium text-center">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">
              E-mail
            </label>
            <div className="relative flex items-center">
              <svg
                className="absolute left-3.5 text-gray-400"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="2" y="4" width="20" height="16" rx="2" />
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
              </svg>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@vetcare.com"
                required
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-xs text-gray-800 focus:outline-none focus:border-[#135A46] focus:ring-1 focus:ring-[#135A46]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">
              Senha
            </label>
            <div className="relative flex items-center">
              <svg
                className="absolute left-3.5 text-gray-400"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-xs text-gray-800 focus:outline-none focus:border-[#135A46] focus:ring-1 focus:ring-[#135A46]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-[#128A64] hover:bg-[#0E5C47] text-white font-bold rounded-xl text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {isLoading ? (
              'Autenticando...'
            ) : (
              <>
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
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
                <span>Entrar no Sistema</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}