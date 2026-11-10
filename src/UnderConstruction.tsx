import Sidebar from './Sidebar';

interface UnderConstructionProps {
  pageName: string;
  onNavigate: (page: string) => void;
}

export default function UnderConstruction({ pageName, onNavigate }: UnderConstructionProps) {
  return (
    <div className="flex h-screen bg-[#F4F6F5] font-sans text-gray-700 overflow-hidden">
      <Sidebar activePage={pageName} onNavigate={onNavigate} />

      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-4">
        <div className="w-16 h-16 bg-[#E8F5F1] text-[#0E5C47] rounded-2xl flex items-center justify-center shadow-sm">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-gray-800">Página em Construção</h1>
        <p className="text-xs text-gray-500 max-w-sm">
          A secção que tentaste aceder ainda está a ser desenvolvida pela equipa. Em breve teremos novidades aqui!
        </p>
        <button
          onClick={() => onNavigate('lista')}
          className="px-4 py-2 bg-[#0E5C47] text-white rounded-xl text-xs font-bold hover:bg-[#0B4A39] transition-colors cursor-pointer"
        >
          Voltar para Tutores e Pets
        </button>
      </div>
    </div>
  );
}