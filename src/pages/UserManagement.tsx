import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Loader2, UserPlus, Shield, User, Edit, Check, X, AlertCircle } from 'lucide-react';
import Modal from '../components/ui/Modal';

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isNewUserModalOpen, setIsNewUserModalOpen] = useState(false);
  const [updating, setUpdating] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

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

  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;

    setUpdating(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          role: selectedUser.role,
          status: selectedUser.status
        })
        .eq('id', selectedUser.id);

      if (error) throw error;
      await fetchUsers();
      setIsModalOpen(false);
    } catch (error: any) {
      alert('Erro ao atualizar usuário: ' + error.message);
    } finally {
      setUpdating(false);
    }
  };

  const pendingUsers = users.filter(u => u.status === 'pending');

  return (
    <div className="p-8">
      <div className="flex flex-wrap justify-between items-center gap-4 mb-12">
        <div>
          <h1 className="text-white text-5xl font-black tracking-tight uppercase tracking-[0.1em]">Gestão de Equipe</h1>
          <p className="text-[#9e9eb7] mt-2 text-lg font-medium">Controle de acessos e aprovação de novos operadores.</p>
        </div>
        <button
          onClick={() => setIsNewUserModalOpen(true)}
          className="flex items-center justify-center gap-3 rounded-2xl h-14 px-8 bg-primary hover:bg-primary/90 text-white text-sm font-black shadow-2xl shadow-primary/20 hover:scale-[1.02] transition-all uppercase tracking-widest"
        >
          <UserPlus className="w-5 h-5" />
          Novo Operador
        </button>
      </div>

      {pendingUsers.length > 0 && (
        <div className="mb-10 p-6 bg-orange-500/10 border border-orange-500/20 rounded-[2rem] flex items-center gap-6 animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="size-14 rounded-2xl bg-orange-500/20 flex items-center justify-center text-orange-500 shrink-0">
            <AlertCircle className="w-8 h-8" />
          </div>
          <div className="flex-1">
            <h3 className="text-white font-black text-xl">Aprovações Pendentes</h3>
            <p className="text-[#9e9eb7] text-sm">Existem {pendingUsers.length} usuário(s) aguardando acesso ao sistema.</p>
          </div>
          <div className="flex gap-2">
            <span className="px-4 py-2 bg-orange-500 text-white text-[10px] font-black uppercase rounded-xl">Revisão Necessária</span>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
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
                  <tr key={u.id} className={`hover:bg-white/[0.03] transition-all group ${u.status === 'pending' ? 'bg-orange-500/[0.02]' : ''}`}>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className={`size-12 rounded-2xl flex items-center justify-center font-black border text-lg shadow-lg ${u.status === 'pending' ? 'bg-orange-500/20 text-orange-500 border-orange-500/20' : 'bg-gradient-to-br from-primary/20 to-primary/5 text-primary border-primary/20'
                          }`}>
                          {u.name ? u.name.split(' ').map((n: any) => n[0]).join('').slice(0, 2).toUpperCase() : '?'}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-white font-black text-lg tracking-tight group-hover:text-primary transition-colors">{u.name || 'Sem nome'}</span>
                          <span className="text-xs text-primary font-bold opacity-80">{u.email}</span>
                          <span className="text-[10px] text-[#9e9eb7] font-bold opacity-40 uppercase tracking-tighter">Cadastrado em {new Date(u.created_at).toLocaleDateString('pt-BR')}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-center">
                      <span className="px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest bg-white/5 text-[#9e9eb7] border border-white/10">
                        {u.role || 'Servidor'}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <div className={`size-2 rounded-full shadow-[0_0_8px] ${u.status === 'active' ? 'bg-green-500 shadow-green-500/50' :
                          u.status === 'pending' ? 'bg-orange-500 shadow-orange-500/50' : 'bg-red-500 shadow-red-500/50'
                          }`}></div>
                        <span className={`text-[10px] font-black uppercase tracking-widest ${u.status === 'active' ? 'text-green-500' :
                          u.status === 'pending' ? 'text-orange-500' : 'text-red-500'
                          }`}>
                          {u.status === 'active' ? 'Ativo' : u.status === 'pending' ? 'Pendente' : 'Inativo'}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <button
                        onClick={() => {
                          setSelectedUser(u);
                          setIsModalOpen(true);
                        }}
                        className="p-3 bg-white/5 hover:bg-primary/20 border border-white/10 rounded-xl text-[#9e9eb7] hover:text-primary transition-all group/btn"
                      >
                        <Edit className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

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
                  Novos usuários começam como <span className="text-orange-500 font-bold">Pendentes</span> por segurança.
                </p>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-xs font-bold text-white">
                    <div className="size-1.5 rounded-full bg-primary animate-ping"></div>
                    Aprovação Manual Necessária
                  </div>
                  <div className="flex items-center gap-3 text-xs font-bold text-white">
                    <div className="size-1.5 rounded-full bg-primary shadow-[0_0_5px_var(--primary)]"></div>
                    Controle por Administrador
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit User Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Editar Privilégios do Usuário"
      >
        {selectedUser && (
          <form onSubmit={handleUpdateUser} className="space-y-6">
            <div className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/5 mb-6">
              <div className="size-12 rounded-xl bg-primary/20 flex items-center justify-center text-primary font-black">
                {selectedUser.name ? selectedUser.name[0].toUpperCase() : '?'}
              </div>
              <div>
                <h4 className="text-white font-bold">{selectedUser.name}</h4>
                <p className="text-xs text-[#9e9eb7]">{selectedUser.role} • {selectedUser.status}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-[#9e9eb7] uppercase tracking-widest">Nível de Acesso</label>
                <select
                  className="w-full bg-[#111117] border border-border-dark rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary text-white"
                  value={selectedUser.role}
                  onChange={(e) => setSelectedUser({ ...selectedUser, role: e.target.value })}
                >
                  <option value="Servidor">Servidor (Padrão)</option>
                  <option value="Administrador">Administrador</option>
                  <option value="Diretoria">Diretoria</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-[#9e9eb7] uppercase tracking-widest">Estado da Conta</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setSelectedUser({ ...selectedUser, status: 'active' })}
                    className={`flex items-center justify-center gap-2 py-3 rounded-xl border font-bold transition-all ${selectedUser.status === 'active' ? 'bg-green-500 border-green-500 text-white' : 'bg-white/5 border-white/10 text-[#9e9eb7]'
                      }`}
                  >
                    <Check className="w-4 h-4" /> Ativo
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedUser({ ...selectedUser, status: 'inactive' })}
                    className={`flex items-center justify-center gap-2 py-3 rounded-xl border font-bold transition-all ${selectedUser.status === 'inactive' ? 'bg-red-500 border-red-500 text-white' : 'bg-white/5 border-white/10 text-[#9e9eb7]'
                      }`}
                  >
                    <X className="w-4 h-4" /> Inativo
                  </button>
                </div>
                {selectedUser.status === 'pending' && (
                  <p className="text-[10px] text-orange-500 font-bold uppercase text-center mt-2">Aguardando Aprovação Original</p>
                )}
              </div>
            </div>

            <div className="pt-4 flex gap-3">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="flex-1 py-4 rounded-2xl bg-white/5 text-white font-bold hover:bg-white/10 transition-all"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={updating}
                className="flex-1 py-4 rounded-2xl bg-primary text-white font-bold hover:bg-primary/90 transition-all shadow-xl shadow-primary/20 disabled:opacity-50"
              >
                {updating ? 'Salvando...' : 'Confirmar'}
              </button>
            </div>
          </form>
        )}
      </Modal>

      {/* New User Instructions Modal */}
      <Modal
        isOpen={isNewUserModalOpen}
        onClose={() => setIsNewUserModalOpen(false)}
        title="Novo Operador"
      >
        <div className="space-y-6">
          <div className="p-6 bg-primary/10 border border-primary/20 rounded-3xl">
            <div className="flex items-center gap-4 mb-4">
              <div className="size-12 rounded-2xl bg-primary flex items-center justify-center text-white">
                <UserPlus className="w-6 h-6" />
              </div>
              <h4 className="text-white text-xl font-black">Como adicionar membros?</h4>
            </div>
            <p className="text-[#9e9eb7] text-sm leading-relaxed">
              Para garantir a segurança, novos membros devem se cadastrar por conta própria usando o link de cadastro na tela inicial.
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="size-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[#9e9eb7] font-black shrink-0">1</div>
              <p className="text-white text-sm font-medium">O novo operador acessa a tela de login e clica em <span className="text-primary font-bold">"Cadastrar"</span>.</p>
            </div>
            <div className="flex gap-4">
              <div className="size-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[#9e9eb7] font-black shrink-0">2</div>
              <p className="text-white text-sm font-medium">Após preencher os dados, a conta ficará como <span className="text-orange-500 font-bold">Pendente</span>.</p>
            </div>
            <div className="flex gap-4">
              <div className="size-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[#9e9eb7] font-black shrink-0">3</div>
              <p className="text-white text-sm font-medium">Você receberá uma notificação aqui nesta página para <span className="text-green-500 font-bold">Aprovar</span> o acesso.</p>
            </div>
          </div>

          <button
            onClick={() => setIsNewUserModalOpen(false)}
            className="w-full py-4 rounded-2xl bg-primary text-white font-bold hover:bg-primary/90 transition-all shadow-xl shadow-primary/20"
          >
            Entendi
          </button>
        </div>
      </Modal>
    </div>
  );
};
export default UserManagement;
