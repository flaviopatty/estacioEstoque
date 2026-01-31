import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Loader2, UserPlus, Shield, User, Edit } from 'lucide-react';

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('name');

      if (error) throw error;
      setUsers(data || []);
    } catch (error: any) {
      console.error('Error fetching users:', error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="p-8">
      <div className="flex flex-wrap justify-between items-center gap-4 mb-12">
        <div>
          <h1 className="text-white text-5xl font-black tracking-tight uppercase tracking-[0.1em]">Configurações da Equipe</h1>
          <p className="text-[#9e9eb7] mt-2 text-lg font-medium">Controle de acessos e hierarquia da unidade.</p>
        </div>
        <button className="flex items-center justify-center gap-3 rounded-2xl h-14 px-8 bg-primary hover:bg-primary/90 text-white text-sm font-black shadow-2xl shadow-primary/20 hover:scale-[1.02] transition-all uppercase tracking-widest">
          <UserPlus className="w-5 h-5" />
          Novo Operador
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Table Section */}
        <div className="lg:col-span-2 space-y-6">
          <div className="overflow-hidden rounded-[2rem] border border-border-dark bg-surface-dark/50 shadow-2xl backdrop-blur-xl">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-primary/5 border-b border-border-dark">
                  <th className="px-8 py-6 text-[#9e9eb7] text-[10px] font-black uppercase tracking-[0.2em]">Identificação</th>
                  <th className="px-8 py-6 text-[#9e9eb7] text-[10px] font-black uppercase tracking-[0.2em text-center">Nível</th>
                  <th className="px-8 py-6 text-[#9e9eb7] text-[10px] font-black uppercase tracking-[0.2em text-center">Estado</th>
                  <th className="px-8 py-6 text-[#9e9eb7] text-[10px] font-black uppercase tracking-[0.2em] text-right">Controle</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-dark">
                {loading ? (
                  <tr>
                    <td colSpan={4} className="px-8 py-20 text-center">
                      <Loader2 className="w-10 h-10 animate-spin text-primary mx-auto mb-4" />
                      <p className="text-white font-bold animate-pulse uppercase tracking-widest">Sincronizando equipe...</p>
                    </td>
                  </tr>
                ) : users.map((u) => (
                  <tr key={u.id} className="hover:bg-white/[0.03] transition-all group">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="size-12 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center text-primary font-black border border-primary/20 text-lg shadow-lg">
                          {u.name ? u.name.split(' ').map((n: any) => n[0]).join('').slice(0, 2).toUpperCase() : '?'}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-white font-black text-lg tracking-tight group-hover:text-primary transition-colors">{u.name || 'Sem nome'}</span>
                          <span className="text-xs text-[#9e9eb7] font-bold opacity-60">ID: #{u.id.slice(0, 8)}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-center">
                      <span className="px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest bg-white/5 text-[#9e9eb7] border border-white/10 group-hover:border-primary/30 transition-all">
                        {u.role || 'Servidor'}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <div className={`size-2 rounded-full shadow-[0_0_8px] ${u.status === 'active' ? 'bg-green-500 shadow-green-500/50' : 'bg-red-500 shadow-red-500/50'}`}></div>
                        <span className={`text-[10px] font-black uppercase tracking-widest ${u.status === 'active' ? 'text-green-500' : 'text-red-500'}`}>{u.status}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <button className="p-3 bg-white/5 hover:bg-primary/20 border border-white/10 rounded-xl text-[#9e9eb7] hover:text-primary transition-all group/btn">
                        <Edit className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
                {!loading && users.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-8 py-20 text-center opacity-30">
                      <User className="w-16 h-16 mx-auto mb-4" />
                      <p className="font-black uppercase tracking-widest text-xl">Nenhum operador cadastrado</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Form Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-surface-dark/80 rounded-[2rem] border border-border-dark shadow-2xl overflow-hidden sticky top-8 backdrop-blur-3xl">
            <div className="p-8 border-b border-border-dark bg-primary/5">
              <h3 className="text-white text-2xl font-black flex items-center gap-3">
                <Shield className="w-6 h-6 text-primary" />
                Segurança
              </h3>
              <p className="text-[10px] text-[#9e9eb7] mt-1 uppercase tracking-[0.2em] font-black opacity-50">Auditoria & Privilégios</p>
            </div>
            <div className="p-8 space-y-8">
              <div className="p-6 bg-black/30 rounded-3xl border border-white/5 space-y-4">
                <p className="text-[#9e9eb7] text-sm leading-relaxed">
                  O gerenciamento de contas é feito através do portal <span className="text-primary font-bold">Supabase Auth</span> para garantir a máxima segurança dos dados.
                </p>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-xs font-bold text-white">
                    <div className="size-1.5 rounded-full bg-primary animate-ping"></div>
                    Criptografia de ponta-a-ponta
                  </div>
                  <div className="flex items-center gap-3 text-xs font-bold text-white">
                    <div className="size-1.5 rounded-full bg-primary shadow-[0_0_5px_var(--primary)]"></div>
                    Logs de auditoria 24/7
                  </div>
                </div>
              </div>

              <button className="w-full py-5 bg-white/5 border border-white/10 text-[#9e9eb7] font-black uppercase tracking-[0.2em] text-[10px] rounded-2xl hover:bg-white/10 transition-all">
                Ver Logs do Sistema
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserManagement;
