
import React from 'react';
import { INITIAL_USERS } from '../config/constants';

const UserManagement: React.FC = () => {
  return (
    <div className="p-8">
      <div className="flex flex-wrap justify-between items-center gap-4 mb-8">
        <div>
          <h1 className="text-white text-4xl font-black tracking-tight">Administração de Usuários</h1>
          <p className="text-[#9e9eb7] mt-1">Gerencie os acessos e permissões dos servidores da unidade escolar.</p>
        </div>
        <button className="flex items-center justify-center gap-2 rounded-lg h-12 px-6 bg-primary hover:bg-primary/90 text-white text-sm font-bold shadow-lg shadow-primary/20">
          <span className="material-symbols-outlined">person_add</span>
          Adicionar Novo Usuário
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Table Section */}
        <div className="lg:col-span-2 space-y-4">
          <div className="overflow-hidden rounded-xl border border-border-dark bg-surface-dark shadow-xl">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-surface-dark/80 border-b border-border-dark">
                  <th className="px-6 py-4 text-white text-xs font-bold uppercase tracking-wider">Usuário</th>
                  <th className="px-6 py-4 text-white text-xs font-bold uppercase tracking-wider">Cargo</th>
                  <th className="px-6 py-4 text-white text-xs font-bold uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-[#9e9eb7] text-xs font-bold uppercase tracking-wider text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-dark">
                {INITIAL_USERS.map((user) => (
                  <tr key={user.id} className="hover:bg-white/5 transition-colors group">
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="size-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                          {user.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-white font-semibold">{user.name}</span>
                          <span className="text-xs text-[#9e9eb7]">{user.email}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${user.role === 'Administrador' ? 'bg-primary/10 text-primary border border-primary/20' : 'bg-white/10 text-[#9e9eb7] border border-white/10'
                        }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <div className={`flex items-center gap-1.5 ${user.status === 'active' ? 'text-green-500' : 'text-red-500'}`}>
                        <div className={`size-2 rounded-full ${user.status === 'active' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                        <span className="text-sm font-medium capitalize">{user.status}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <button className="text-[#9e9eb7] hover:text-white font-bold text-xs uppercase tracking-widest transition-colors">Editar</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Form Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-surface-dark rounded-xl border border-border-dark shadow-2xl overflow-hidden sticky top-8">
            <div className="p-6 border-b border-border-dark bg-primary/5">
              <h3 className="text-white text-xl font-bold">Permissões</h3>
              <p className="text-xs text-[#9e9eb7] mt-1 uppercase tracking-widest font-semibold italic">Novo Cadastro ou Edição</p>
            </div>
            <form className="p-6 space-y-6">
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#9e9eb7] uppercase">Nome Completo</label>
                  <input className="w-full bg-background-dark border-border-dark rounded-lg text-white focus:ring-primary text-sm h-11" placeholder="Ex: Roberto Alencar" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#9e9eb7] uppercase">E-mail</label>
                  <input className="w-full bg-background-dark border-border-dark rounded-lg text-white focus:ring-primary text-sm h-11" placeholder="email@escola.gov.br" />
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t border-border-dark">
                <h4 className="text-xs font-bold text-primary uppercase tracking-widest flex items-center gap-2">
                  <span className="material-symbols-outlined text-lg">admin_panel_settings</span>
                  Módulos
                </h4>

                {[
                  { label: 'Entrada de Estoque', desc: 'Registrar remessas', checked: true },
                  { label: 'Saída de Estoque', desc: 'Baixar itens', checked: false },
                  { label: 'Acesso a Relatórios', desc: 'Visualizar métricas', checked: true },
                ].map((toggle, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-background-dark border border-border-dark/50">
                    <div className="flex flex-col">
                      <span className="text-white text-sm font-semibold">{toggle.label}</span>
                      <span className="text-[10px] text-[#9e9eb7]">{toggle.desc}</span>
                    </div>
                    <label className="inline-flex relative items-center cursor-pointer">
                      <input type="checkbox" defaultChecked={toggle.checked} className="sr-only peer" />
                      <div className="w-10 h-5 bg-[#3d3d52] rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                  </div>
                ))}
              </div>

              <div className="pt-4 flex flex-col gap-3">
                <button className="w-full py-3 bg-primary text-white font-bold rounded-lg shadow-lg shadow-primary/20">Salvar</button>
                <button className="w-full py-3 bg-transparent text-[#9e9eb7] hover:text-white border border-border-dark rounded-lg">Cancelar</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserManagement;
