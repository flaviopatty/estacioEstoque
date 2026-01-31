
import React from 'react';
import { IMAGES } from '../config/constants';

const ProfileSettings: React.FC = () => {
<<<<<<< HEAD
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState<ProfileData>({ name: '', role: '' });
  const [email, setEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  useEffect(() => {
    if (user) {
      setEmail(user.email || '');
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    if (!user) return;

    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Timeout')), 15000)
    );

    try {
      const loadData = async () => {
        const { data, error } = await supabase
          .from('profiles')
          .select('name, role')
          .eq('id', user.id)
          .single();

        if (error) throw error;
        return data;
      };

      const data = await Promise.race([loadData(), timeoutPromise]) as any;
      if (data) setProfile({ name: data.name || '', role: data.role || 'Servidor' });
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    setMessage(null);

    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Timeout: O servidor demorou muito para responder')), 15000)
    );

    try {
      const updateData = async () => {
        const { error } = await supabase
          .from('profiles')
          .update({ name: profile.name })
          .eq('id', user.id);

        if (error) throw error;
      };

      await Promise.race([updateData(), timeoutPromise]);
      setMessage({ type: 'success', text: 'Perfil atualizado com sucesso!' });
    } catch (error: any) {
      let errorMessage = error.message || 'Erro ao atualizar perfil.';
      if (error.name === 'AbortError' || error.message.includes('Timeout')) {
        errorMessage = 'A conexão está instável. Tente novamente.';
      }
      setMessage({ type: 'error', text: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setMessage({ type: 'error', text: 'As senhas não coincidem.' });
      return;
    }

    setLoading(true);
    setMessage(null);

    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Timeout: O servidor demorou muito para responder')), 15000)
    );

    try {
      const updateData = async () => {
        const { error } = await supabase.auth.updateUser({ password: newPassword });
        if (error) throw error;
      };

      await Promise.race([updateData(), timeoutPromise]);

      setMessage({ type: 'success', text: 'Senha atualizada com sucesso!' });
      setNewPassword('');
      setConfirmPassword('');
      setCurrentPassword('');
    } catch (error: any) {
      let errorMessage = error.message || 'Erro ao atualizar senha.';
      if (error.name === 'AbortError' || error.message.includes('Timeout')) {
        errorMessage = 'A conexão está instável. Tente novamente.';
      }
      setMessage({ type: 'error', text: errorMessage });
    } finally {
      setLoading(false);
    }
  };

=======
>>>>>>> parent of 920ceda (feat: implement user profile settings page allowing users to view and update personal information and change their password.)
  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="mb-8">
        <h2 className="text-white text-4xl font-black leading-tight tracking-tight">Configurações do Perfil</h2>
        <p className="text-[#9e9eb7] text-base">Gerencie seus dados e segurança da conta.</p>
      </div>

      <div className="bg-card-dark rounded-xl p-8 mb-8 border border-border-dark shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-accent/10 rounded-bl-full"></div>
        <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
          <div className="relative group cursor-pointer">
            <div
              className="size-32 rounded-full ring-4 ring-primary/30 shadow-2xl bg-cover bg-center"
              style={{ backgroundImage: `url("${IMAGES.ADMIN_AVATAR}")` }}
            />
            <button className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
              <span className="material-symbols-outlined text-white text-3xl">photo_camera</span>
            </button>
          </div>
          <div className="flex-1 text-center md:text-left">
            <h3 className="text-2xl font-bold mb-1">João Silva</h3>
            <p className="text-[#9e9eb7] mb-4">Administrador de Almoxarifado • Matrícula: 2024.12.001</p>
            <div className="flex flex-wrap justify-center md:justify-start gap-3">
              <button className="bg-primary hover:bg-primary/80 text-white px-5 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-all">
                <span className="material-symbols-outlined text-base">upload</span>
                Alterar Foto
              </button>
              <button className="bg-border-dark hover:bg-white/10 text-white px-5 py-2 rounded-lg text-sm font-bold transition-all border border-white/5">
                Remover Foto
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-card-dark rounded-xl border border-border-dark overflow-hidden">
            <div className="px-6 py-4 border-b border-border-dark bg-white/5">
              <h2 className="text-lg font-bold flex items-center gap-2">
                <span className="material-symbols-outlined text-accent fill-1">person</span>
                Informações Pessoais
              </h2>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-[#9e9eb7] uppercase">Nome Completo</label>
                <input className="w-full bg-[#111117] border border-border-dark rounded-lg px-4 py-2.5 outline-none focus:ring-1 focus:ring-primary text-white" defaultValue="João Silva" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-[#9e9eb7] uppercase">E-mail</label>
                <input className="w-full bg-[#111117] border border-border-dark rounded-lg px-4 py-2.5 outline-none focus:ring-1 focus:ring-primary text-white" defaultValue="joao.silva@prefeitura.edu.br" />
              </div>
            </div>
          </div>

          <div className="bg-card-dark rounded-xl border border-border-dark overflow-hidden">
            <div className="px-6 py-4 border-b border-border-dark bg-white/5">
              <h2 className="text-lg font-bold flex items-center gap-2">
                <span className="material-symbols-outlined text-accent fill-1">security</span>
                Segurança
              </h2>
            </div>
            <div className="p-6 space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-[#9e9eb7] uppercase">Senha Atual</label>
                <input className="w-full bg-[#111117] border border-border-dark rounded-lg px-4 py-2.5 outline-none focus:ring-1 focus:ring-primary text-white" type="password" placeholder="••••••••" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-[#9e9eb7] uppercase">Nova Senha</label>
                  <input className="w-full bg-[#111117] border border-border-dark rounded-lg px-4 py-2.5 outline-none focus:ring-1 focus:ring-primary text-white" type="password" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-[#9e9eb7] uppercase">Confirmar Senha</label>
                  <input className="w-full bg-[#111117] border border-border-dark rounded-lg px-4 py-2.5 outline-none focus:ring-1 focus:ring-primary text-white" type="password" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-1 space-y-6">
          <div className="bg-card-dark rounded-xl border border-border-dark p-6">
            <h3 className="font-bold mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">history</span>
              Atividade Recente
            </h3>
            <div className="space-y-4">
              {[
                { label: 'Login realizado', time: 'Hoje às 08:45', color: 'bg-green-500' },
                { label: 'Inventário atualizado', time: 'Ontem às 16:20', color: 'bg-primary' },
                { label: 'Relatório gerado', time: '15 Set às 10:12', color: 'bg-[#9e9eb7]' },
              ].map((act, i) => (
                <div key={i} className="flex gap-3">
                  <div className={`size-2 rounded-full ${act.color} mt-1.5 shrink-0`} />
                  <div>
                    <p className="text-sm font-medium text-white">{act.label}</p>
                    <p className="text-[11px] text-[#9e9eb7]">{act.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-br from-primary/20 to-accent/10 rounded-xl border border-primary/20 p-6">
            <div className="flex items-center gap-3 mb-3">
              <span className="material-symbols-outlined text-accent text-3xl fill-1">verified_user</span>
              <h3 className="font-bold text-lg">Proteção 2FA</h3>
            </div>
            <p className="text-sm text-[#9e9eb7] leading-relaxed mb-4">Aumente a segurança da sua conta ativando a autenticação em duas etapas.</p>
            <span className="px-2 py-1 bg-green-500/20 text-green-400 text-[10px] font-bold rounded uppercase">Ativado</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSettings;
