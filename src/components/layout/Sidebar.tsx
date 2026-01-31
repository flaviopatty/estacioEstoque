import React from 'react';
import { Page } from '../../types';
import { IMAGES } from '../../config/constants';
import { cn } from '../../utils/cn';

interface SidebarProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentPage, onNavigate }) => {
  const navItems = [
    { id: Page.DASHBOARD, label: 'Dashboard', icon: 'dashboard' },
    { id: Page.PRODUCTS, label: 'Produtos', icon: 'inventory_2' },
    { id: Page.INVENTORY, label: 'Movimentações', icon: 'sync_alt' },
    { id: Page.REPORTS, label: 'Relatórios', icon: 'analytics' },
    { id: Page.USERS, label: 'Usuários', icon: 'group' },
    { id: Page.SETTINGS, label: 'Configurações', icon: 'settings' },
  ];

  return (
    <aside className="w-64 flex flex-col bg-[#111117] border-r border-border-dark shrink-0">
      <div className="p-6 flex flex-col h-full justify-between">
        <div className="flex flex-col gap-8">
          <div className="flex items-center gap-4">
            <div
              className="bg-accent rounded-xl size-10 flex items-center justify-center text-background-dark font-bold text-xl bg-cover bg-center border-2 border-accent/20 shadow-lg shadow-accent/10"
              style={{ backgroundImage: `url("${IMAGES.SCHOOL_LOGO}")` }}
            />
            <div className="flex flex-col">
              <h1 className="text-white text-sm font-black leading-tight uppercase tracking-widest">Estácio de Sá</h1>
              <p className="text-[#9e9eb7] text-[10px] font-bold uppercase tracking-tighter opacity-70">Escola Municipal</p>
            </div>
          </div>

          <nav className="flex flex-col gap-1.5">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group",
                  currentPage === item.id
                    ? "bg-primary text-white shadow-xl shadow-primary/20"
                    : "text-[#9e9eb7] hover:bg-white/5 hover:text-white"
                )}
              >
                <span className={cn(
                  "material-symbols-outlined transition-colors",
                  currentPage === item.id ? "fill-1 text-accent" : "group-hover:text-primary"
                )}>
                  {item.icon}
                </span>
                <p className="text-sm font-bold tracking-wide">{item.label}</p>
              </button>
            ))}
          </nav>
        </div>

        <div className="flex flex-col gap-4">
          <button
            onClick={() => onNavigate(Page.PRODUCTS)}
            className="flex w-full items-center justify-center gap-2 rounded-xl h-12 px-4 bg-accent text-background-dark text-sm font-black transition-all active:scale-95 hover:bg-accent/90 shadow-lg shadow-accent/20"
          >
            <span className="material-symbols-outlined text-[20px]">add_box</span>
            <span>Novo Produto</span>
          </button>

          <div className="flex items-center gap-3 p-3 bg-white/5 rounded-2xl border border-white/5">
            <div
              className="size-9 rounded-full bg-primary flex items-center justify-center text-[10px] font-bold bg-cover bg-center border-2 border-primary/20"
              style={{ backgroundImage: `url("${IMAGES.ADMIN_AVATAR}")` }}
            />
            <div className="flex flex-col overflow-hidden">
              <p className="text-xs font-black truncate text-white">João Silva</p>
              <p className="text-[10px] text-[#9e9eb7] font-bold uppercase tracking-wider truncate">Admin</p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
