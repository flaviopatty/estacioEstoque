import React, { useState, useEffect } from 'react';
import { InventoryItem } from '../types';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Modal from '../components/ui/Modal';
import Badge from '../components/ui/Badge';
import { supabase } from '../lib/supabase';

const Products: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [products, setProducts] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

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
        .select('id, name, category, unit, quantity, min_stock, expiration_date, status, updated_at')
        .order('name');

      if (error) throw error;

      const mappedProducts: InventoryItem[] = (data || []).map((p: any) => ({
        id: p.id,
        name: p.name,
        category: p.category,
        unit: p.unit,
        quantity: parseFloat(p.quantity),
        minStock: parseFloat(p.min_stock),
        expirationDate: p.expiration_date,
        status: p.status, // We will recalculate UI status based on logic below
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

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Timeout: O servidor demorou muito para responder')), 15000)
    );

    try {
      const saveData = async () => {
        const productData = {
          name: newName,
          category: newCategory,
          unit: newUnit,
          quantity: parseFloat(newQuantity),
          min_stock: parseFloat(newMinStock),
          expiration_date: newExpirationDate || null,
          status: 'ativo'
        };

        if (editingId) {
          const { error } = await supabase
            .from('products')
            .update(productData)
            .eq('id', editingId);
          if (error) throw error;
        } else {
          const { error } = await supabase
            .from('products')
            .insert([productData]);
          if (error) throw error;
        }
      };

      await Promise.race([saveData(), timeoutPromise]);

      setShowModal(false);
      resetForm();
      fetchProducts();
      alert(editingId ? 'Produto atualizado!' : 'Produto cadastrado!');
    } catch (error: any) {
      console.error('Error saving product:', error);
      let errorMessage = error.message || 'Erro desconhecido';
      if (error.name === 'AbortError' || error.message.includes('Timeout')) {
        errorMessage = 'A conexão está instável. Tente novamente.';
      }
      alert('Erro ao salvar: ' + errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (product: InventoryItem) => {
    setEditingId(product.id);
    setNewName(product.name);
    setNewCategory(product.category);
    setNewUnit(product.unit);
    setNewQuantity(product.quantity.toString());
    setNewMinStock(product.minStock.toString());
    setNewExpirationDate(product.expirationDate || '');
    setShowModal(true);
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Tem certeza que deseja excluir "${name}"?`)) return;

    try {
      const { error } = await supabase.from('products').delete().eq('id', id);
      if (error) throw error;
      fetchProducts();
    } catch (error: any) {
      alert('Erro ao excluir: ' + error.message);
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setNewName('');
    setNewCategory('');
    setNewUnit('Unidade');
    setNewQuantity('0');
    setNewMinStock('0');
    setNewExpirationDate('');
  };

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getUnitIcon = (unit: string) => {
    switch (unit) {
      case 'Quilo': return 'scale';
      case 'Litro': return 'opacity';
      case 'Unidade': return 'inventory_2';
      default: return 'help_outline';
    }
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return 'N/A';
    const [year, month, day] = dateStr.split('-');
    return `${day}/${month}/${year}`;
  };

  const getStatus = (product: InventoryItem) => {
    if (product.quantity <= 0) return { label: 'Sem Estoque', variant: 'error' as const };
    if (product.quantity <= product.minStock) return { label: 'Crítico', variant: 'warning' as const };
    return { label: 'Normal', variant: 'success' as const };
  };

  return (
    <div className="p-8">
      {/* Header Section */}
      <div className="flex justify-between items-start mb-10">
        <div>
          <h1 className="text-white text-4xl font-black tracking-tight mb-2">Produtos</h1>
          <p className="text-[#9e9eb7] text-lg">Gerencie o cadastro de produtos</p>
        </div>
        <Button
          onClick={() => { resetForm(); setShowModal(true); }}
          leftIcon={<span className="material-symbols-outlined">add</span>}
        >
          Novo Produto
        </Button>
      </div>

      {/* Search Bar */}
      <div className="mb-8">
        <Input
          placeholder="Buscar produtos..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          icon="search"
        />
      </div>

      {/* Products Table */}
      <div className="bg-surface-dark border border-border-dark rounded-2xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-[#1c1c2e] text-[#9e9eb7] text-xs font-bold uppercase tracking-wider border-b border-border-dark">
                <th className="px-6 py-5">Produto</th>
                <th className="px-6 py-5">Categoria</th>
                <th className="px-6 py-5">Unidade</th>
                <th className="px-6 py-5">Validade</th>
                <th className="px-6 py-5 text-center">Estoque</th>
                <th className="px-6 py-5 text-center">Status</th>
                <th className="px-6 py-5 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-dark">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center gap-2 opacity-50">
                      <span className="material-symbols-outlined text-4xl animate-spin">refresh</span>
                      <p className="text-lg font-bold">Carregando catálogo...</p>
                    </div>
                  </td>
                </tr>
              ) : filteredProducts.map((product) => {
                const status = getStatus(product);
                return (
                  <tr key={product.id} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="px-6 py-6 text-white font-bold text-lg">{product.name}</td>
                    <td className="px-6 py-6 text-[#9e9eb7] font-medium">{product.category}</td>
                    <td className="px-6 py-6">
                      <div className="flex items-center gap-2 text-[#9e9eb7]">
                        <span className="material-symbols-outlined text-sm">{getUnitIcon(product.unit)}</span>
                        <span className="text-sm font-medium">{product.unit}</span>
                      </div>
                    </td>
                    <td className="px-6 py-6">
                      <div className="flex flex-col">
                        <span className="text-white text-sm font-medium">{formatDate(product.expirationDate)}</span>
                        {product.expirationDate && new Date(product.expirationDate) < new Date() && (
                          <span className="text-red-500 text-[10px] font-bold uppercase">Vencido</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-6 text-center">
                      <span className={`font-black text-lg ${product.quantity <= product.minStock ? 'text-orange-500' : 'text-white'}`}>
                        {product.quantity.toFixed(product.unit === 'Unidade' ? 0 : 2)}
                      </span>
                    </td>
                    <td className="px-6 py-6 text-center">
                      <Badge variant={status.variant}>
                        {status.label}
                      </Badge>
                    </td>
                    <td className="px-6 py-6 text-right">
                      <div className="flex justify-end gap-3 opacity-60 group-hover:opacity-100 transition-opacity">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(product)}
                          className="hover:text-primary transition-colors"
                        >
                          <span className="material-symbols-outlined text-[20px]">edit</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(product.id, product.name)}
                          className="hover:text-red-500 transition-colors"
                        >
                          <span className="material-symbols-outlined text-[20px]">delete</span>
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {!loading && filteredProducts.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center gap-2 opacity-20">
                      <span className="material-symbols-outlined text-6xl">inventory_2</span>
                      <p className="text-xl font-bold">Nenhum produto encontrado</p>
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
        title={editingId ? "Editar Produto" : "Novo Produto"}
        icon={editingId ? "edit" : "add_box"}
        maxWidth="lg"
      >
        <form className="space-y-5" onSubmit={handleSaveProduct}>
          <Input
            label="Nome do Produto"
            required
            placeholder="Ex: Arroz Agulhinha"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            disabled={submitting}
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Categoria"
              required
              placeholder="Ex: Alimentação"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              disabled={submitting}
            />
            <Input
              label="Data de Validade"
              type="date"
              value={newExpirationDate}
              onChange={(e) => setNewExpirationDate(e.target.value)}
              disabled={submitting}
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-[#9e9eb7] uppercase tracking-widest block">Unidade de Medida</label>
            <div className="relative">
              <select
                value={newUnit}
                onChange={(e) => setNewUnit(e.target.value)}
                disabled={submitting}
                className="w-full bg-[#1c1c2e] border border-border-dark rounded-2xl px-4 py-4 text-white focus:ring-2 focus:ring-primary outline-none appearance-none cursor-pointer"
              >
                <option value="Unidade">Unidade</option>
                <option value="Litro">Litro</option>
                <option value="Quilo">Quilo</option>
              </select>
              <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[#9e9eb7]">expand_more</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Estoque Atual"
              required
              type="number"
              placeholder="0.00"
              step="0.01"
              value={newQuantity}
              onChange={(e) => setNewQuantity(e.target.value)}
              disabled={submitting}
            />
            <Input
              label="Estoque Mínimo"
              required
              type="number"
              placeholder="0.00"
              step="0.01"
              value={newMinStock}
              onChange={(e) => setNewMinStock(e.target.value)}
              disabled={submitting}
            />
          </div>

          <div className="pt-4 flex gap-3">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => setShowModal(false)}
              type="button"
              disabled={submitting}
            >
              Cancelar
            </Button>
            <Button
              className="flex-1"
              type="submit"
              disabled={submitting}
            >
              {submitting ? 'Salvando...' : (editingId ? 'Salvar Alterações' : 'Salvar Produto')}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Products;
