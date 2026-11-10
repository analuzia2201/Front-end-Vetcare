import { useState } from "react";
import "./RecoverPasswordPage.css";

export default function RecoverPasswordPage() {
  const [email, setEmail] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setErro("");
    setMensagem("");

    if (!email.trim()) {
      setErro("Informe seu e-mail.");
      return;
    }

    const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailValido.test(email)) {
      setErro("Digite um endereço de e-mail válido.");
      return;
    }

    setCarregando(true);

    try {
      const resposta = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      if (!resposta.ok) {
        throw new Error("Não foi possível processar a solicitação.");
      }

      setMensagem(
        "Se o e-mail estiver cadastrado, você receberá as instruções para redefinir sua senha."
      );

      setEmail("");
    } catch {
      setErro("Ocorreu um erro. Tente novamente mais tarde.");
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div className="recuperacao-container">
      <div className="recuperacao-card">

        <div className="icone-container">
          <span>🔒</span>
        </div>

        <h1>Esqueceu sua senha?</h1>

        <p className="descricao">
          Não se preocupe! Informe o e-mail cadastrado
          e enviaremos as instruções para redefinir sua senha.
        </p>

        <form onSubmit={handleSubmit}>
          <label htmlFor="email">E-mail cadastrado</label>

          <input
            id="email"
            type="email"
            placeholder="exemplo@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
          />

          {erro && <p className="mensagem erro">{erro}</p>}

          {mensagem && (
            <p className="mensagem sucesso">{mensagem}</p>
          )}

          <button type="submit" disabled={carregando}>
            {carregando
              ? "Enviando..."
              : "Recuperar senha"}
          </button>
        </form>

        <a href="/login" className="voltar">
          ← Voltar para o login
        </a>

      </div>
    </div>
  );
}
