import React, { useState, useEffect } from 'react';
import { InventoryItem } from '../types';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Modal from '../components/ui/Modal';
import Badge from '../components/ui/Badge';
import { supabase } from '../lib/supabase';
import { Loader2, Plus, Search, Edit3, Eye, Scale, Droplets, Box, HelpCircle } from 'lucide-react';

const Products: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [products, setProducts] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Form states
  const [newName, setNewName] = useState('');
  const [newCategory, setNewCategory] = useState('');
  const [newUnit, setNewUnit] = useState('Unidade');
  const [newQuantity, setNewQuantity] = useState('0');
  const [newMinStock, setNewMinStock] = useState('0');
  const [newExpirationDate, setNewExpirationDate] = useState('');

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('name');

      if (error) throw error;

      // Map table names to frontend field names (snake_case to camelCase)
      const mappedProducts: InventoryItem[] = (data || []).map((p: any) => ({
        id: p.id,
        name: p.name,
        category: p.category,
        unit: p.unit,
        quantity: parseFloat(p.quantity),
        minStock: parseFloat(p.min_stock),
        expirationDate: p.expiration_date,
        status: p.status,
        lastUpdated: p.updated_at
      }));

      setProducts(mappedProducts);
    } catch (error: any) {
      console.error('Error fetching products:', error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    // Create a timeout promise
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Timeout: O servidor demorou muito para responder')), 15000)
    );

    try {
      // Wrap the Supabase call in a promise to make it raceable
      const insertData = async () => {
        const { error } = await supabase
          .from('products')
          .insert([{
            name: newName,
            category: newCategory,
            unit: newUnit,
            quantity: parseFloat(newQuantity),
            min_stock: parseFloat(newMinStock),
            expiration_date: newExpirationDate || null,
            status: 'ativo'
          }]);

        if (error) throw error;
        return true;
      };

      // Race the insert against the timeout
      await Promise.race([insertData(), timeoutPromise]);

      setShowModal(false);
      // Reset form
      setNewName('');
      setNewCategory('');
      setNewUnit('Unidade');
      setNewQuantity('0');
      setNewMinStock('0');
      setNewExpirationDate('');

      fetchProducts();
    } catch (error: any) {
      console.error('Error saving product:', error);

      let errorMessage = error.message || 'Erro desconhecido';

      // Handle AbortError or specific connection issues
      if (error.name === 'AbortError' || error.message.includes('signal is aborted')) {
        errorMessage = 'A conexão foi interrompida. Verifique sua internet e tente novamente.';
      } else if (error.message.includes('Timeout')) {
        errorMessage = 'O servidor demorou muito para responder. Tente novamente em instantes.';
      }

      alert('Erro ao salvar produto: ' + errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getUnitIcon = (unit: string) => {
    switch (unit) {
      case 'Quilo': return <Scale className="w-4 h-4" />;
      case 'Litro': return <Droplets className="w-4 h-4" />;
      case 'Unidade': return <Box className="w-4 h-4" />;
      default: return <HelpCircle className="w-4 h-4" />;
    }
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return 'N/A';
    const [year, month, day] = dateStr.split('-');
    return `${day}/${month}/${year}`;
  };

  return (
    <div className="p-8">
      {/* Header Section */}
      <div className="flex justify-between items-start mb-10">
        <div>
          <h1 className="text-white text-4xl font-black tracking-tight mb-2 uppercase tracking-[0.2em]">Produtos</h1>
          <p className="text-[#9e9eb7] text-lg font-medium">Gestão inteligente do catálogo escolar</p>
        </div>
        <Button
          onClick={() => setShowModal(true)}
          leftIcon={<Plus className="w-5 h-5" />}
          className="shadow-xl shadow-primary/20 hover:scale-[1.02] transition-transform"
        >
          Novo Produto
        </Button>
      </div>

      {/* Search Bar */}
      <div className="mb-8 relative max-w-2xl group">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#9e9eb7] group-focus-within:text-primary transition-colors">
          <Search className="w-5 h-5" />
        </div>
        <input
          placeholder="Filtrar por nome ou categoria..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-surface-dark/50 border border-border-dark rounded-2xl py-5 pl-12 pr-6 text-white placeholder:text-[#9e9eb7] focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-300 backdrop-blur-sm"
        />
      </div>

      {/* Products Table */}
      <div className="bg-surface-dark border border-border-dark rounded-3xl overflow-hidden shadow-2xl backdrop-blur-xl bg-opacity-80">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-primary/5 text-[#9e9eb7] text-[10px] font-black uppercase tracking-[0.2em] border-b border-border-dark">
                <th className="px-8 py-6">Produto</th>
                <th className="px-8 py-6">Categoria</th>
                <th className="px-8 py-6">Unidade</th>
                <th className="px-8 py-6">Validade</th>
                <th className="px-8 py-6 text-center">Estoque</th>
                <th className="px-8 py-6 text-center">Status</th>
                <th className="px-8 py-6 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-dark">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-8 py-20 text-center">
                    <div className="flex flex-col items-center gap-4 text-primary">
                      <Loader2 className="w-12 h-12 animate-spin" />
                      <p className="font-bold text-lg animate-pulse">Carregando catálogo...</p>
                    </div>
                  </td>
                </tr>
              ) : filteredProducts.map((product) => (
                <tr key={product.id} className="hover:bg-white/[0.03] transition-all group cursor-default">
                  <td className="px-8 py-8">
                    <div className="flex flex-col">
                      <span className="text-white font-black text-xl tracking-tight group-hover:text-primary transition-colors">{product.name}</span>
                      <span className="text-[10px] text-[#9e9eb7] font-bold uppercase tracking-widest mt-1">ID: #{product.id.slice(0, 8)}</span>
                    </div>
                  </td>
                  <td className="px-8 py-8">
                    <span className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-[#9e9eb7] text-sm font-bold uppercase tracking-wider">
                      {product.category}
                    </span>
                  </td>
                  <td className="px-8 py-8">
                    <div className="flex items-center gap-2 text-[#9e9eb7]">
                      <span className="p-2 bg-primary/10 rounded-lg text-primary">{getUnitIcon(product.unit)}</span>
                      <span className="text-sm font-bold">{product.unit}</span>
                    </div>
                  </td>
                  <td className="px-8 py-8">
                    <div className="flex flex-col">
                      <span className="text-white text-sm font-bold">{formatDate(product.expirationDate)}</span>
                      {product.expirationDate && new Date(product.expirationDate) < new Date() && (
                        <span className="text-red-500 text-[10px] font-black uppercase tracking-widest mt-1">EXPIRADO</span>
                      )}
                    </div>
                  </td>
                  <td className="px-8 py-8 text-center text-center">
                    <div className="inline-flex flex-col">
                      <span className={`font-black text-2xl tracking-tighter ${product.quantity <= product.minStock ? 'text-orange-500' : 'text-white'}`}>
                        {product.quantity.toFixed(product.unit === 'Unidade' ? 0 : 2)}
                      </span>
                      <span className="text-[10px] text-[#9e9eb7] font-black uppercase">Min: {product.minStock}</span>
                    </div>
                  </td>
                  <td className="px-8 py-8 text-center">
                    <Badge variant={product.quantity <= 0 ? 'error' : product.quantity <= product.minStock ? 'warning' : 'success'}>
                      {product.quantity <= 0 ? 'Sem Estoque' : product.quantity <= product.minStock ? 'Crítico' : 'Normal'}
                    </Badge>
                  </td>
                  <td className="px-8 py-8 text-right">
                    <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-3 bg-white/5 hover:bg-primary/20 border border-white/10 rounded-2xl text-[#9e9eb7] hover:text-primary transition-all duration-300">
                        <Edit3 className="w-5 h-5" />
                      </button>
                      <button className="p-3 bg-white/5 hover:bg-green-500/20 border border-white/10 rounded-2xl text-[#9e9eb7] hover:text-green-500 transition-all duration-300">
                        <Eye className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {!loading && filteredProducts.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-8 py-24 text-center">
                    <div className="flex flex-col items-center gap-4 opacity-40">
                      <Search className="w-16 h-16 text-[#9e9eb7]" />
                      <p className="text-2xl font-black text-white/50 uppercase tracking-widest">Nenhum resultado</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* New Product Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => !submitting && setShowModal(false)}
        title="Novo Produto no Catálogo"
        icon={<Box className="w-6 h-6" />}
        maxWidth="lg"
      >
        <form className="space-y-6 pt-4" onSubmit={handleAddProduct}>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-[#9e9eb7] uppercase tracking-[0.2em] ml-1">Nome do Item</label>
            <input
              required
              value={newName}
              onChange={e => setNewName(e.target.value)}
              placeholder="Ex: Resma Papel A4 Magic"
              disabled={submitting}
              className="w-full bg-background-dark/50 border border-border-dark rounded-2xl p-4 text-white placeholder:text-[#9e9eb7] focus:ring-2 focus:ring-primary outline-none transition-all"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-[#9e9eb7] uppercase tracking-[0.2em] ml-1">Categoria</label>
              <input
                required
                value={newCategory}
                onChange={e => setNewCategory(e.target.value)}
                placeholder="Ex: Escritório"
                disabled={submitting}
                className="w-full bg-background-dark/50 border border-border-dark rounded-2xl p-4 text-white placeholder:text-[#9e9eb7] focus:ring-2 focus:ring-primary outline-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-[#9e9eb7] uppercase tracking-[0.2em] ml-1">Expiração (Opcional)</label>
              <input
                type="date"
                value={newExpirationDate}
                onChange={e => setNewExpirationDate(e.target.value)}
                disabled={submitting}
                className="w-full bg-background-dark/50 border border-border-dark rounded-2xl p-4 text-white focus:ring-2 focus:ring-primary outline-none"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-[#9e9eb7] uppercase tracking-[0.2em] ml-1">Unidade</label>
            <select
              value={newUnit}
              onChange={e => setNewUnit(e.target.value)}
              disabled={submitting}
              className="w-full bg-background-dark/50 border border-border-dark rounded-2xl p-4 text-white focus:ring-2 focus:ring-primary outline-none cursor-pointer appearance-none"
            >
              <option value="Unidade">Unidade (UN)</option>
              <option value="Litro">Litro (LT)</option>
              <option value="Quilo">Quilo (KG)</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-[#9e9eb7] uppercase tracking-[0.2em] ml-1">Qtd. Inicial</label>
              <input
                required
                type="number"
                step="0.01"
                value={newQuantity}
                onChange={e => setNewQuantity(e.target.value)}
                disabled={submitting}
                className="w-full bg-background-dark/50 border border-border-dark rounded-2xl p-4 text-white focus:ring-2 focus:ring-primary outline-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-[#9e9eb7] uppercase tracking-[0.2em] ml-1">Estoque Crítico</label>
              <input
                required
                type="number"
                step="0.01"
                value={newMinStock}
                onChange={e => setNewMinStock(e.target.value)}
                disabled={submitting}
                className="w-full bg-background-dark/50 border border-border-dark rounded-2xl p-4 text-white focus:ring-2 focus:ring-primary outline-none"
              />
            </div>
          </div>

          <div className="pt-6 flex gap-4">
            <button
              type="button"
              onClick={() => setShowModal(false)}
              disabled={submitting}
              className="flex-1 py-4 border border-border-dark rounded-2xl text-[#9e9eb7] font-bold hover:bg-white/5 transition-all"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 py-4 bg-primary text-white font-black rounded-2xl shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            >
              {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Confirmar Cadastro'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Products;
