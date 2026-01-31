import React, { useState, useEffect } from 'react';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { Loader2, TrendingUp, TrendingDown, History, CheckCircle, PlusCircle, MinusCircle, ChevronDown } from 'lucide-react';

const InventoryMovement: React.FC = () => {
  const { user } = useAuth();
  const [type, setType] = useState<'in' | 'out'>('in');
  const [products, setProducts] = useState<any[]>([]);
  const [movements, setMovements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Form states
  const [selectedProductId, setSelectedProductId] = useState('');
  const [quantity, setQuantity] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [description, setDescription] = useState('');

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch products for select
      const { data: productsData, error: productsError } = await supabase
        .from('products')
        .select('id, name, unit')
        .order('name');
      if (productsError) throw productsError;
      setProducts(productsData || []);

      // Fetch recent movements
      const { data: movementsData, error: movementsError } = await supabase
        .from('movements')
        .select(`
                    id,
                    quantity,
                    type,
                    created_at,
                    description,
                    products (name, unit)
                `)
        .order('created_at', { ascending: false })
        .limit(10);
      if (movementsError) throw movementsError;
      setMovements(movementsData || []);
    } catch (error: any) {
      console.error('Error fetching inventory data:', error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleMovement = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProductId || !quantity) return;

    setSubmitting(true);
    try {
      const qty = parseFloat(quantity);
      const movementQty = type === 'out' ? -qty : qty;

      // 1. Get current product quantity
      const { data: product, error: fetchError } = await supabase
        .from('products')
        .select('quantity')
        .eq('id', selectedProductId)
        .single();

      if (fetchError) throw fetchError;

      const newTotal = parseFloat(product.quantity) + movementQty;
      if (newTotal < 0) {
        throw new Error('Estoque insuficiente para esta saída.');
      }

      // 2. Insert movement
      const { error: moveError } = await supabase
        .from('movements')
        .insert([{
          product_id: selectedProductId,
          quantity: qty,
          type: type,
          description: description,
          responsible_id: user?.id
        }]);

      if (moveError) throw moveError;

      // 3. Update product quantity
      const { error: updateError } = await supabase
        .from('products')
        .update({ quantity: newTotal })
        .eq('id', selectedProductId);

      if (updateError) throw updateError;

      // Reset form and refresh
      setSelectedProductId('');
      setQuantity('');
      setDescription('');
      fetchData();
      alert('Movimentação realizada com sucesso!');
    } catch (error: any) {
      alert('Erro na movimentação: ' + error.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="mb-10 text-center md:text-left">
        <h2 className="text-white text-5xl font-black leading-tight tracking-tight uppercase tracking-[0.1em]">Movimentação</h2>
        <p className="text-[#9e9eb7] text-lg font-medium mt-2">Controle rigoroso de entradas e saídas do armazém.</p>
      </div>

      <div className="bg-surface-dark rounded-[2.5rem] shadow-2xl border border-border-dark overflow-hidden mb-12 backdrop-blur-3xl bg-opacity-70">
        <div className="h-2 w-full bg-gradient-to-r from-primary via-accent to-primary"></div>

        <div className="px-8 pt-10 pb-4">
          <div className="flex h-16 items-center justify-center rounded-2xl bg-black/30 p-1.5 border border-white/5">
            <button
              onClick={() => setType('in')}
              className={`flex h-full grow items-center justify-center gap-3 rounded-xl text-sm font-black transition-all duration-500 uppercase tracking-widest ${type === 'in' ? 'bg-primary text-white shadow-xl shadow-primary/20' : 'text-[#9e9eb7] hover:text-white'}`}
            >
              <PlusCircle className="w-5 h-5" />
              Entrada
            </button>
            <button
              onClick={() => setType('out')}
              className={`flex h-full grow items-center justify-center gap-3 rounded-xl text-sm font-black transition-all duration-500 uppercase tracking-widest ${type === 'out' ? 'bg-primary text-white shadow-xl shadow-primary/20' : 'text-[#9e9eb7] hover:text-white'}`}
            >
              <MinusCircle className="w-5 h-5" />
              Saída
            </button>
          </div>
        </div>

        <form className="p-10 space-y-8" onSubmit={handleMovement}>
          <div className="space-y-3">
            <label className="text-[10px] font-black text-white uppercase tracking-[0.2em] opacity-50 ml-1">Selecionar Produto</label>
            <div className="relative group">
              <select
                required
                value={selectedProductId}
                onChange={e => setSelectedProductId(e.target.value)}
                className="w-full h-16 rounded-2xl bg-black/20 border border-white/10 text-white px-6 focus:ring-2 focus:ring-primary focus:border-transparent outline-none appearance-none cursor-pointer group-hover:border-primary/50 transition-all font-bold"
              >
                <option value="" disabled>Localizar item no catálogo...</option>
                {products.map(p => (
                  <option key={p.id} value={p.id}>{p.name} ({p.unit})</option>
                ))}
              </select>
              <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 text-[#9e9eb7] pointer-events-none w-5 h-5" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-3">
              <label className="text-[10px] font-black text-white uppercase tracking-[0.2em] opacity-50 ml-1">Quantidade</label>
              <Input
                required
                type="number"
                step="0.01"
                placeholder="0.00"
                value={quantity}
                onChange={e => setQuantity(e.target.value)}
                className="h-16 text-xl font-bold bg-black/20 rounded-2xl"
              />
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-black text-white uppercase tracking-[0.2em] opacity-50 ml-1">Data do Evento</label>
              <Input
                type="date"
                value={date}
                onChange={e => setDate(e.target.value)}
                className="h-16 font-bold bg-black/20 rounded-2xl"
              />
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-black text-white uppercase tracking-[0.2em] opacity-50 ml-1">Notas de Auditoria</label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="w-full min-h-[120px] rounded-2xl bg-black/20 border border-white/10 text-white p-6 focus:ring-2 focus:ring-primary outline-none resize-none transition-all placeholder:text-[#4a4a6a]"
              placeholder="Descreva o motivo ou destino desta movimentação..."
            />
          </div>

          <Button
            type="submit"
            disabled={submitting || loading}
            className="w-full h-16 text-lg font-black uppercase tracking-[0.2em] shadow-2xl shadow-primary/30 hover:scale-[1.01] active:scale-[0.99] transition-all"
            leftIcon={submitting ? <Loader2 className="w-6 h-6 animate-spin" /> : <CheckCircle className="w-6 h-6" />}
          >
            {submitting ? 'Processando...' : 'Confirmar Transação'}
          </Button>
        </form>
      </div>

      <div className="space-y-6">
        <div className="flex items-center justify-between px-2">
          <h3 className="text-2xl font-black flex items-center gap-3 text-white uppercase tracking-wider">
            <History className="w-6 h-6 text-primary" />
            Histórico Recente
          </h3>
          <button className="text-[10px] text-primary font-black uppercase tracking-[0.2em] hover:text-white transition-colors">Relatório Completo</button>
        </div>

        <div className="grid gap-4">
          {loading ? (
            <div className="flex justify-center p-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : movements.map((move) => (
            <div key={move.id} className="group flex items-center justify-between p-6 bg-surface-dark/40 rounded-3xl border border-border-dark hover:border-primary/50 transition-all hover:translate-x-1 duration-300">
              <div className="flex items-center gap-5">
                <div className={`p-4 rounded-2xl ${move.type === 'in' ? 'bg-green-500/10 text-green-500 shadow-inner' : 'bg-red-500/10 text-red-500 shadow-inner'}`}>
                  {move.type === 'in' ? <TrendingUp className="w-6 h-6" /> : <TrendingDown className="w-6 h-6" />}
                </div>
                <div className="space-y-1">
                  <p className="font-black text-xl text-white tracking-tight">{move.products?.name}</p>
                  <p className="text-[10px] font-bold text-[#9e9eb7] uppercase tracking-widest">
                    {new Date(move.created_at).toLocaleString()} • {move.description || 'Sem descrição'}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className={`font-black text-2xl tracking-tighter ${move.type === 'in' ? 'text-green-500' : 'text-red-500'}`}>
                  {move.type === 'in' ? '+' : '-'}{move.quantity}
                  <span className="text-xs ml-1 uppercase">{move.products?.unit}</span>
                </p>
                <p className="text-[10px] uppercase tracking-widest font-black opacity-40">
                  {move.type === 'in' ? 'Entrada Registrada' : 'Saída Confirmada'}
                </p>
              </div>
            </div>
          ))}
          {!loading && movements.length === 0 && (
            <div className="text-center py-12 opacity-30">
              <History className="w-12 h-12 mx-auto mb-3" />
              <p className="font-bold uppercase tracking-[0.2em]">Nenhuma movimentação</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InventoryMovement;
