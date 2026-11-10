import { useState, useEffect } from 'react';
import LoginPage from './LoginPage';
import PatientsListPage from './PatientsListPage';
import RegisterPage from './RegisterPage';
import UserRegisterPage from './UserRegisterPage';
import UnderConstruction from './UnderConstruction';

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

  // Páginas funcionais do sistema
  if (currentPage === 'login') {
    return <LoginPage onNavigateToList={() => setCurrentPage('lista')} />;
  }
  if (currentPage === 'lista') {
    return <PatientsListPage onNavigate={handleNavigate} />;
  }
  if (currentPage === 'cadastro') {
    return <RegisterPage onNavigate={handleNavigate} />;
  }
  if (currentPage === 'cadastrarUsuario') {
    return <UserRegisterPage onNavigate={handleNavigate} />;
  }

  // Para qualquer outra página do menu que ainda esteja em desenvolvimento
  return <UnderConstruction pageName={currentPage} onNavigate={handleNavigate} />;
}