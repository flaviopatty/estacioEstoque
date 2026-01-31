
import React, { useState, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { INITIAL_PRODUCTS } from '../config/constants';
import { InventoryItem } from '../types';

// Dados simulados de consumo médio baseados nas categorias existentes
const MOCK_CONSUMPTION_DATA = [
  { category: 'Alimento', consumption: 145, unit: 'kg' },
  { category: 'Bebidas', consumption: 80, unit: 'L' },
  { category: 'Descartáveis', consumption: 250, unit: 'un' },
  { category: 'Limpeza', consumption: 65, unit: 'L' },
  { category: 'Papelaria', consumption: 120, unit: 'un' },
];

const Reports: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('Todas');

  // Extrair categorias únicas
  const categories = useMemo(() => {
    const cats = INITIAL_PRODUCTS.map(p => p.category);
    return ['Todas', ...Array.from(new Set(cats))];
  }, []);

  // Filtrar e ordenar por validade (mais próximas primeiro)
  const filteredProducts = useMemo(() => {
    let list = [...INITIAL_PRODUCTS];

    if (selectedCategory !== 'Todas') {
      list = list.filter(p => p.category === selectedCategory);
    }

    // Ordenação: 
    // 1. Quem tem data de validade vem antes de quem não tem
    // 2. Quem vence antes vem primeiro
    return list.sort((a, b) => {
      if (!a.expirationDate) return 1;
      if (!b.expirationDate) return -1;
      return new Date(a.expirationDate).getTime() - new Date(b.expirationDate).getTime();
    });
  }, [selectedCategory]);

  const getDaysRemaining = (dateStr?: string) => {
    if (!dateStr) return null;
    const diff = new Date(dateStr).getTime() - new Date().getTime();
    return Math.ceil(diff / (1000 * 3600 * 24));
  };

  const getExpirationStatus = (dateStr?: string) => {
    const days = getDaysRemaining(dateStr);
    if (days === null) return null;
    if (days < 0) return { label: 'Vencido', color: 'text-red-500', bg: 'bg-red-500/10', border: 'border-red-500/20' };
    if (days <= 30) return { label: `Vence em ${days} dias`, color: 'text-orange-500', bg: 'bg-orange-500/10', border: 'border-orange-500/20' };
    return { label: `Vence em ${days} dias`, color: 'text-green-500', bg: 'bg-green-500/10', border: 'border-green-500/20' };
  };

  const exportToCSV = () => {
    const headers = ['ID', 'Produto', 'Categoria', 'Estoque Atual', 'Unidade', 'Validade', 'Status'];
    const rows = filteredProducts.map(p => {
      const status = getExpirationStatus(p.expirationDate)?.label || 'N/A';
      return [
        p.id,
        `"${p.name}"`,
        `"${p.category}"`,
        p.quantity.toString(),
        p.unit,
        p.expirationDate || 'N/A',
        status
      ];
    });

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `relatorio_estoque_${selectedCategory.toLowerCase()}_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-end mb-10">
        <div>
          <h1 className="text-white text-4xl font-black tracking-tight mb-2">Relatório de Inventário</h1>
          <p className="text-[#9e9eb7] text-lg">Análise detalhada de estoque e controle de validades</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={exportToCSV}
            className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white font-bold px-6 py-3 rounded-xl transition-all shadow-lg shadow-primary/20"
          >
            <span className="material-symbols-outlined">download</span>
            Exportar CSV
          </button>
          <button
            onClick={() => window.print()}
            className="flex items-center gap-2 bg-[#292938] hover:bg-[#3d3d52] text-white font-bold px-6 py-3 rounded-xl transition-all border border-border-dark"
          >
            <span className="material-symbols-outlined">print</span>
            Imprimir Relatório
          </button>
        </div>
      </div>

      {/* Resumo de Alertas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="p-6 bg-red-500/5 border border-red-500/20 rounded-2xl">
          <p className="text-red-400 text-xs font-bold uppercase tracking-widest mb-1">Itens Vencidos</p>
          <h3 className="text-3xl font-black text-white">
            {INITIAL_PRODUCTS.filter(p => (getDaysRemaining(p.expirationDate) ?? 1) < 0).length}
          </h3>
        </div>
        <div className="p-6 bg-orange-500/5 border border-orange-500/20 rounded-2xl">
          <p className="text-orange-400 text-xs font-bold uppercase tracking-widest mb-1">Validade Próxima (30 dias)</p>
          <h3 className="text-3xl font-black text-white">
            {INITIAL_PRODUCTS.filter(p => {
              const days = getDaysRemaining(p.expirationDate);
              return days !== null && days >= 0 && days <= 30;
            }).length}
          </h3>
        </div>
        <div className="p-6 bg-primary/5 border border-primary/20 rounded-2xl">
          <p className="text-primary text-xs font-bold uppercase tracking-widest mb-1">Total de Itens em Estoque</p>
          <h3 className="text-3xl font-black text-white">
            {INITIAL_PRODUCTS.reduce((acc, curr) => acc + curr.quantity, 0).toFixed(0)}
          </h3>
        </div>
      </div>

      {/* Gráfico de Consumo por Categoria */}
      <div className="mb-8 bg-surface-dark border border-border-dark rounded-2xl p-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h3 className="text-white text-xl font-bold italic tracking-wide">Média de Consumo Mensal</h3>
            <p className="text-[#9e9eb7] text-sm">Distribuição de consumo por categoria de produto</p>
          </div>
          <div className="flex items-center gap-2 bg-primary/10 border border-primary/20 px-3 py-1.5 rounded-lg">
            <span className="material-symbols-outlined text-primary text-sm">bar_chart</span>
            <span className="text-xs font-bold text-primary uppercase">Métricas Ativas</span>
          </div>
        </div>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={MOCK_CONSUMPTION_DATA} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2d2d44" vertical={false} />
              <XAxis
                dataKey="category"
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#9e9eb7', fontSize: 12, fontWeight: 600 }}
                dy={10}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#9e9eb7', fontSize: 12 }}
              />
              <Tooltip
                cursor={{ fill: 'rgba(255, 255, 255, 0.05)' }}
                contentStyle={{
                  backgroundColor: '#1c1c2e',
                  border: '1px solid #2d2d44',
                  borderRadius: '12px',
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)'
                }}
                itemStyle={{ color: '#fff', fontSize: '14px', fontWeight: 'bold' }}
                labelStyle={{ color: '#9e9eb7', marginBottom: '4px', textTransform: 'uppercase', fontSize: '10px' }}
              />
              <Bar dataKey="consumption" radius={[6, 6, 0, 0]} barSize={40}>
                {MOCK_CONSUMPTION_DATA.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={index % 2 === 0 ? '#4e4ee4' : '#E3C54D'}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Filtros de Categoria */}
      <div className="mb-8 flex flex-wrap gap-2">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all border ${selectedCategory === cat
                ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20'
                : 'bg-surface-dark text-[#9e9eb7] border-border-dark hover:border-[#9e9eb7]'
              }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Tabela de Relatório */}
      <div className="bg-surface-dark border border-border-dark rounded-2xl overflow-hidden shadow-2xl">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-[#1c1c2e] text-[#9e9eb7] text-xs font-bold uppercase tracking-wider border-b border-border-dark">
              <th className="px-6 py-5">Produto</th>
              <th className="px-6 py-5">Categoria</th>
              <th className="px-6 py-5">Estoque Atual</th>
              <th className="px-6 py-5">Validade</th>
              <th className="px-6 py-5 text-right">Status de Validade</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-dark">
            {filteredProducts.map(product => {
              const status = getExpirationStatus(product.expirationDate);
              const daysRemaining = getDaysRemaining(product.expirationDate);
              const isUrgent = daysRemaining !== null && daysRemaining <= 30;

              return (
                <tr key={product.id} className={`transition-colors ${isUrgent ? 'bg-orange-500/[0.03]' : 'hover:bg-white/[0.01]'}`}>
                  <td className="px-6 py-6">
                    <div className="flex flex-col">
                      <span className="text-white font-bold text-lg">{product.name}</span>
                      <span className="text-[10px] text-[#9e9eb7] uppercase font-medium">{product.id}</span>
                    </div>
                  </td>
                  <td className="px-6 py-6">
                    <span className="text-[#9e9eb7] font-medium">{product.category}</span>
                  </td>
                  <td className="px-6 py-6">
                    <div className="flex items-center gap-2">
                      <span className={`text-xl font-black ${product.quantity <= product.minStock ? 'text-orange-500' : 'text-white'}`}>
                        {product.quantity}
                      </span>
                      <span className="text-xs text-[#9e9eb7] font-bold uppercase">{product.unit}s</span>
                    </div>
                  </td>
                  <td className="px-6 py-6">
                    <div className="flex flex-col">
                      <span className="text-white font-medium">
                        {product.expirationDate ? new Date(product.expirationDate).toLocaleDateString('pt-BR') : 'N/A'}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-6 text-right">
                    {status ? (
                      <span className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest border ${status.bg} ${status.color} ${status.border} shadow-sm inline-block`}>
                        {status.label}
                      </span>
                    ) : (
                      <span className="text-[#3d3d52] font-black uppercase tracking-widest text-[10px]">Indeterminado</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Reports;
