import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { LogOut, User, Search, Bell, HelpCircle } from 'lucide-react';

const Header: React.FC = () => {
  const { user, signOut } = useAuth();

  return (
    <header className="h-20 border-b border-border-dark flex items-center justify-between px-8 bg-background-dark/80 sticky top-0 z-50 backdrop-blur-xl">
      <div className="flex items-center gap-4 flex-1">
        <Search className="w-5 h-5 text-[#9e9eb7]" />
        <input
          className="bg-transparent border-none text-sm text-white focus:ring-0 w-full max-w-md placeholder:text-[#9e9eb7] font-medium"
          placeholder="Buscar no sistema..."
          type="text"
        />
      </div>
      <div className="flex items-center gap-6">
        <div className="relative p-2 text-[#9e9eb7] hover:text-white cursor-pointer transition-all hover:bg-white/5 rounded-xl">
          <span className="material-symbols-outlined">notifications</span>
          <div className="absolute top-2.5 right-2.5 size-2 bg-accent rounded-full border-2 border-background-dark"></div>
        </div>

        <div className="h-8 w-px bg-border-dark" />

        <div className="flex items-center gap-3 pl-2 group">
          <div className="flex flex-col items-end">
            <span className="text-sm font-bold text-white leading-tight">{user?.email?.split('@')[0]}</span>
            <span className="text-[10px] font-bold text-primary uppercase tracking-wider">{user?.role || 'Administrador'}</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300">
            <User className="w-5 h-5" />
          </div>
          <button
            onClick={() => signOut()}
            className="p-2 text-[#9e9eb7] hover:text-red-400 cursor-pointer transition-all hover:bg-red-500/10 rounded-xl ml-2"
            title="Sair"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
