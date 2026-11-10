import { useState, useEffect } from 'react';
import LoginPage from './LoginPage';
import PatientsListPage from './PatientsListPage';
import RegisterPage from './RegisterPage';
import UserRegisterPage from './UserRegisterPage';
import RecoverPasswordPage from "./RecoverPasswordPage";

export default function App() {
  const [currentPage, setCurrentPage] = useState<string>('login');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setCurrentPage('lista');
    } else {
      setCurrentPage('login');
    }
  }, []);

  const handleNavigate = (page: string) => {
    if (page === 'login') {
      localStorage.removeItem('token');
      setCurrentPage('login');
      return;
    }
    setCurrentPage(page);
  };

  return (
    <main className="w-full h-screen overflow-hidden">
      {currentPage === 'login' && (
        <LoginPage onNavigateToList={() => setCurrentPage('lista')} />
      )}

      {currentPage === 'lista' && (
        <PatientsListPage onNavigate={handleNavigate} />
      )}

      {currentPage === 'cadastro' && (
        <RegisterPage onNavigate={handleNavigate} />
      )}

      {currentPage === 'cadastrarUsuario' && (
        <UserRegisterPage onNavigate={handleNavigate} />
      )}
    </main>
  );
}
