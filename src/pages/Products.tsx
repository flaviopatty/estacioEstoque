import React, { useState } from 'react';
import { INITIAL_PRODUCTS } from '../config/constants';
import { InventoryItem } from '../types';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Modal from '../components/ui/Modal';
import Badge from '../components/ui/Badge';

const Products: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [products] = useState<InventoryItem[]>(INITIAL_PRODUCTS);

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

  return (
    <div className="p-8">
      {/* Header Section */}
      <div className="flex justify-between items-start mb-10">
        <div>
          <h1 className="text-white text-4xl font-black tracking-tight mb-2">Produtos</h1>
          <p className="text-[#9e9eb7] text-lg">Gerencie o cadastro de produtos</p>
        </div>
        <Button
          onClick={() => setShowModal(true)}
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
              {filteredProducts.map((product) => (
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
                    <Badge variant={product.status === 'Crítico' ? 'error' : product.status === 'Alerta' ? 'warning' : 'success'}>
                      {product.status}
                    </Badge>
                  </td>
                  <td className="px-6 py-6 text-right">
                    <div className="flex justify-end gap-3 opacity-60 group-hover:opacity-100 transition-opacity">
                      <Button variant="ghost" size="icon">
                        <span className="material-symbols-outlined text-[20px]">edit</span>
                      </Button>
                      <Button variant="ghost" size="icon" className="text-green-500">
                        <span className="material-symbols-outlined text-[20px]">visibility</span>
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredProducts.length === 0 && (
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
        onClose={() => setShowModal(false)}
        title="Novo Produto"
        icon="add_box"
        maxWidth="lg"
      >
        <form className="space-y-5" onSubmit={(e) => { e.preventDefault(); setShowModal(false); }}>
          <Input
            label="Nome do Produto"
            required
            placeholder="Ex: Arroz Agulhinha"
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Categoria"
              required
              placeholder="Ex: Alimentação"
            />
            <Input
              label="Data de Validade"
              type="date"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-[#9e9eb7] uppercase tracking-widest block">Unidade de Medida</label>
            <div className="relative">
              <select className="w-full bg-[#1c1c2e] border border-border-dark rounded-2xl px-4 py-4 text-white focus:ring-2 focus:ring-primary outline-none appearance-none cursor-pointer">
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
            />
            <Input
              label="Estoque Mínimo"
              required
              type="number"
              placeholder="0.00"
              step="0.01"
            />
          </div>

          <div className="pt-4 flex gap-3">
            <Button variant="outline" className="flex-1" onClick={() => setShowModal(false)} type="button">
              Cancelar
            </Button>
            <Button className="flex-1" type="submit">
              Salvar Produto
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Products;
