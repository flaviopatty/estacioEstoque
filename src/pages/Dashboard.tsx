import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import { Loader2, Package, AlertTriangle, Calendar, TrendingUp, TrendingDown, ArrowRight, Zap } from 'lucide-react';

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState({
    totalItems: 0,
    criticalItems: 0,
    nearExpiration: 0,
    recentIn: [] as any[],
    recentOut: [] as any[],
  });
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    setLoading(true);

    // Timeout promise to prevent infinite loading
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Timeout de conexão')), 15000)
    );

    try {
      // Execute all requests in parallel with safety wrapper
      const loadData = async () => {
        const [productsParam, movementsInParam, movementsOutParam] = await Promise.all([
          supabase
            .from('products')
            .select('id, quantity, min_stock, expiration_date'),

          supabase
            .from('movements')
            .select('id, quantity, created_at, products(name, unit)')
            .eq('type', 'in')
            .order('created_at', { ascending: false })
            .limit(5),

          supabase
            .from('movements')
            .select('id, quantity, created_at, description, products(name, unit)')
            .eq('type', 'out')
            .order('created_at', { ascending: false })
            .limit(5)
        ]);

        return { productsParam, movementsInParam, movementsOutParam };
      };

      // Race against timeout
      const result = await Promise.race([loadData(), timeoutPromise]) as any;
      const { productsParam, movementsInParam, movementsOutParam } = result;

      // Handle Products Data
      const products = productsParam.data || [];
      if (productsParam.error) console.error('Error fetching products:', productsParam.error);

      const totalItems = products.length;
      const criticalItems = products.filter((p: any) => parseFloat(p.quantity) <= parseFloat(p.min_stock)).length;

      // Near expiration (next 30 days)
      const thirtyDaysFromNow = new Date();
      thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
      const nearExpiration = products.filter((p: any) =>
        p.expiration_date &&
        new Date(p.expiration_date) <= thirtyDaysFromNow &&
        new Date(p.expiration_date) >= new Date()
      ).length;

      // Handle Movements Data
      const recentIn = movementsInParam.data || [];
      if (movementsInParam.error) console.error('Error fetching inflows:', movementsInParam.error);

      const recentOut = movementsOutParam.data || [];
      if (movementsOutParam.error) console.error('Error fetching outflows:', movementsOutParam.error);

      setStats({
        totalItems,
        criticalItems,
        nearExpiration,
        recentIn,
        recentOut,
      });

    } catch (error: any) {
      console.error('Error fetching dashboard stats - Full Details:', error);
      // Even on error, we stop loading to allow the user to see the interface (potentially empty)
    } finally {
      if (loading) setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full min-h-[400px]">
        <div className="text-center space-y-4">
          <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto" />
          <p className="text-[#9e9eb7] font-black uppercase tracking-[0.2em] animate-pulse">Sincronizando Sistema...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-10">
      {/* Page Heading */}
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-white text-5xl font-black leading-tight tracking-tight uppercase tracking-[0.1em]">Visão Geral</h2>
          <p className="text-[#9e9eb7] text-lg font-medium mt-2">Métricas em tempo real • Escola Municipal Estácio de Sá</p>
        </div>
        <div className="hidden md:flex items-center gap-3 p-3 bg-primary/10 rounded-2xl border border-primary/20">
          <Zap className="w-5 h-5 text-primary animate-pulse" />
          <span className="text-xs font-black text-primary uppercase tracking-widest">Sincronizado via Supabase</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="group relative overflow-hidden flex flex-col gap-4 rounded-[2.5rem] p-8 border border-border-dark bg-surface-dark/50 backdrop-blur-xl transition-all hover:scale-[1.02] duration-500">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-[60px] -mr-16 -mt-16 group-hover:bg-primary/20 transition-colors" />
          <div className="flex items-center justify-between">
            <div className="p-4 bg-primary/10 rounded-2xl text-primary border border-primary/20">
              <Package className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em] px-3 py-1 bg-primary/10 rounded-full border border-primary/20">Ativo</span>
          </div>
          <div>
            <p className="text-[#9e9eb7] text-sm font-black uppercase tracking-[0.2em] opacity-60">Catálogo Total</p>
            <p className="text-white text-5xl font-black tracking-tighter mt-1">{stats.totalItems}</p>
          </div>
        </div>

        <div className="group relative overflow-hidden flex flex-col gap-4 rounded-[2.5rem] p-8 border border-orange-500/20 bg-orange-500/5 backdrop-blur-xl transition-all hover:scale-[1.02] duration-500">
          <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 rounded-full blur-[60px] -mr-16 -mt-16 group-hover:bg-orange-500/20 transition-colors" />
          <div className="flex items-center justify-between">
            <div className="p-4 bg-orange-500/10 rounded-2xl text-orange-500 border border-orange-500/20">
              <AlertTriangle className="w-6 h-6" />
            </div>
            {stats.criticalItems > 0 && <span className="text-[10px] font-black text-orange-500 uppercase tracking-[0.2em] px-3 py-1 bg-orange-500/10 rounded-full border border-orange-500/20 animate-pulse">Atenção</span>}
          </div>
          <div>
            <p className="text-[#9e9eb7] text-sm font-black uppercase tracking-[0.2em] opacity-60">Reposição Crítica</p>
            <p className="text-orange-500 text-5xl font-black tracking-tighter mt-1">{stats.criticalItems}</p>
          </div>
        </div>

        <div className="group relative overflow-hidden flex flex-col gap-4 rounded-[2.5rem] p-8 border border-white/10 bg-white/5 backdrop-blur-xl transition-all hover:scale-[1.02] duration-500">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-[60px] -mr-16 -mt-16 group-hover:bg-white/20 transition-colors" />
          <div className="flex items-center justify-between">
            <div className="p-4 bg-white/10 rounded-2xl text-white/60 border border-white/10">
              <Calendar className="w-6 h-6" />
            </div>
          </div>
          <div>
            <p className="text-[#9e9eb7] text-sm font-black uppercase tracking-[0.2em] opacity-60">Perto do Vencimento</p>
            <p className="text-white text-5xl font-black tracking-tighter mt-1">{stats.nearExpiration}</p>
          </div>
        </div>
      </div>

      {/* Tables Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="space-y-6">
          <div className="flex items-center justify-between px-4">
            <h3 className="text-white text-base font-black uppercase tracking-[0.2em] flex items-center gap-3">
              <TrendingUp className="w-5 h-5 text-green-500" />
              Novos Suprimentos
            </h3>
            <Button variant="ghost" className="text-[10px] font-black uppercase tracking-widest text-primary hover:text-white">Ver Histórico</Button>
          </div>
          <div className="overflow-hidden rounded-[2rem] border border-border-dark bg-surface-dark/40 backdrop-blur-2xl">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white/5 text-[10px] uppercase text-[#9e9eb7] font-black tracking-widest border-b border-white/5">
                  <th className="px-6 py-5">Item</th>
                  <th className="px-6 py-5">Qtd</th>
                  <th className="px-6 py-5 text-right">Data</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {stats.recentIn.map(m => (
                  <tr key={m.id} className="border-t border-white/5 hover:bg-white/[0.03] transition-colors group">
                    <td className="px-6 py-6 text-white font-black text-lg tracking-tight group-hover:text-primary transition-colors">{m.products?.name}</td>
                    <td className="px-6 py-6 font-black text-green-500">+{m.quantity} <span className="text-[10px] text-[#9e9eb7]">{m.products?.unit}</span></td>
                    <td className="px-6 py-6 text-[#9e9eb7] text-right font-bold">{new Date(m.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
                {stats.recentIn.length === 0 && (
                  <tr><td colSpan={3} className="px-6 py-12 text-center text-[#9e9eb7] font-bold uppercase tracking-widest opacity-30">Nenhuma entrada</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex items-center justify-between px-4">
            <h3 className="text-white text-base font-black uppercase tracking-[0.2em] flex items-center gap-3">
              <TrendingDown className="w-5 h-5 text-red-500" />
              Fluxo de Saída
            </h3>
            <Button variant="ghost" className="text-[10px] font-black uppercase tracking-widest text-primary hover:text-white">Ver Histórico</Button>
          </div>
          <div className="overflow-hidden rounded-[2rem] border border-border-dark bg-surface-dark/40 backdrop-blur-2xl">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white/5 text-[10px] uppercase text-[#9e9eb7] font-black tracking-widest border-b border-white/5">
                  <th className="px-6 py-5">Item</th>
                  <th className="px-6 py-5">Finalidade</th>
                  <th className="px-6 py-5 text-right">Qtd</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {stats.recentOut.map(m => (
                  <tr key={m.id} className="border-t border-white/5 hover:bg-white/[0.03] transition-colors group">
                    <td className="px-6 py-6 text-white font-black text-lg tracking-tight group-hover:text-primary transition-colors">{m.products?.name}</td>
                    <td className="px-6 py-6 text-[#9e9eb7] font-bold italic">{m.description || 'Não informada'}</td>
                    <td className="px-6 py-6 text-right font-black text-red-500">-{m.quantity}</td>
                  </tr>
                ))}
                {stats.recentOut.length === 0 && (
                  <tr><td colSpan={3} className="px-6 py-12 text-center text-[#9e9eb7] font-bold uppercase tracking-widest opacity-30">Nenhuma saída</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Alert Banner */}
      {stats.criticalItems > 0 && (
        <div className="group relative flex items-center gap-6 bg-orange-500 text-background-dark p-8 rounded-[2rem] shadow-2xl transition-all hover:scale-[1.01] duration-500 overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="p-4 bg-background-dark/20 rounded-2xl">
            <AlertTriangle className="w-10 h-10 animate-pulse text-background-dark" />
          </div>
          <div className="flex-1 space-y-1">
            <p className="font-black text-2xl uppercase tracking-tighter">ALERTA DE REPOSIÇÃO CRÍTICA</p>
            <p className="font-bold text-sm tracking-tight opacity-80 uppercase tracking-widest italic">{stats.criticalItems} itens atingiram o nível de segurança. Recomendamos abertura imediata de requisição.</p>
          </div>
          <Button variant="secondary" className="bg-background-dark text-orange-500 font-black uppercase tracking-widest px-8 h-14 rounded-2xl border-none hover:shadow-xl shadow-black/20">
            Inspecionar
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
