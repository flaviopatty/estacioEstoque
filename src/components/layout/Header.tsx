import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="h-20 border-b border-border-dark flex items-center justify-between px-8 bg-background-dark/80 sticky top-0 z-50 backdrop-blur-xl">
      <div className="flex items-center gap-4 flex-1">
        <span className="material-symbols-outlined text-[#9e9eb7]">search</span>
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
        <div className="p-2 text-[#9e9eb7] hover:text-white cursor-pointer transition-all hover:bg-white/5 rounded-xl">
          <span className="material-symbols-outlined">help_outline</span>
        </div>
      </div>
    </header>
  );
};

export default Header;
