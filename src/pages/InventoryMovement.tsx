import React, { useState } from 'react';
import { INITIAL_MOVEMENTS } from '../config/constants';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

const InventoryMovement: React.FC = () => {
  const [type, setType] = useState<'in' | 'out'>('in');

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <h2 className="text-white text-4xl font-black leading-tight tracking-tight">Entradas e Saídas de Estoque</h2>
        <p className="text-[#9e9eb7] text-base font-normal">Gerencie a movimentação de itens da escola com eficiência.</p>
      </div>

      <div className="bg-card-dark rounded-xl shadow-2xl border border-border-dark overflow-hidden mb-8">
        <div className="h-1.5 w-full bg-accent"></div>

        <div className="px-6 pt-8 pb-4">
          <div className="flex h-14 items-center justify-center rounded-xl bg-[#292938] p-1.5">
            <button
              onClick={() => setType('in')}
              className={`flex h-full grow items-center justify-center gap-2 rounded-lg text-sm font-semibold transition-all ${type === 'in' ? 'bg-background-dark text-primary shadow-lg' : 'text-[#9e9eb7] hover:text-white'}`}
            >
              <span className="material-symbols-outlined text-[18px]">add_circle</span>
              Entrada de Estoque
            </button>
            <button
              onClick={() => setType('out')}
              className={`flex h-full grow items-center justify-center gap-2 rounded-lg text-sm font-semibold transition-all ${type === 'out' ? 'bg-background-dark text-primary shadow-lg' : 'text-[#9e9eb7] hover:text-white'}`}
            >
              <span className="material-symbols-outlined text-[18px]">remove_circle</span>
              Saída de Estoque
            </button>
          </div>
        </div>

        <form className="p-6 space-y-6">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-white uppercase tracking-widest text-xs opacity-60">Produto</label>
            <div className="relative">
              <select className="w-full h-14 rounded-2xl bg-[#1c1c2e] border border-border-dark text-white px-4 focus:ring-2 focus:ring-primary focus:border-transparent outline-none appearance-none cursor-pointer">
                <option disabled defaultValue="selected">Selecione o produto no catálogo...</option>
                <option>Resma de Papel A4 (75g)</option>
                <option>Caneta Esferográfica Azul (Unidade)</option>
                <option>Caderno Brochura 96 fls</option>
                <option>Lápis de Cor (Caixa c/ 12)</option>
              </select>
              <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-[#9e9eb7] pointer-events-none">expand_more</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Quantidade"
              type="number"
              placeholder="Ex: 50"
              rightIcon={<span className="text-xs text-[#9e9eb7] font-medium pr-4">unidades</span>}
            />
            <Input
              label="Data da Movimentação"
              type="date"
              defaultValue="2023-10-27"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-white uppercase tracking-widest text-xs opacity-60">Responsável</label>
            <div className="relative">
              <select className="w-full h-14 rounded-2xl bg-[#1c1c2e] border border-border-dark text-white px-4 focus:ring-2 focus:ring-primary focus:border-transparent outline-none appearance-none cursor-pointer">
                <option>Ana Paula Costa (Almoxarifado)</option>
                <option>Roberto Silveira (Direção)</option>
              </select>
              <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-[#9e9eb7] pointer-events-none">expand_more</span>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-white uppercase tracking-widest text-xs opacity-60">Observações (Opcional)</label>
            <textarea
              className="w-full min-h-[100px] rounded-2xl bg-[#1c1c2e] border border-border-dark text-white p-4 focus:ring-2 focus:ring-primary outline-none resize-none"
              placeholder="Ex: Material para a feira de ciências..."
            />
          </div>

          <Button
            className="w-full"
            leftIcon={<span className="material-symbols-outlined">check_circle</span>}
          >
            Confirmar Movimentação
          </Button>
        </form>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">history</span>
            Últimas Movimentações
          </h3>
          <button className="text-sm text-primary font-medium hover:underline">Ver Histórico Completo</button>
        </div>

        <div className="grid gap-3">
          {INITIAL_MOVEMENTS.slice(0, 3).map((move) => (
            <div key={move.id} className="flex items-center justify-between p-4 bg-card-dark rounded-xl border border-border-dark hover:border-primary/50 transition-all">
              <div className="flex items-center gap-4">
                <div className={`p-2 rounded-lg ${move.type === 'in' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                  <span className="material-symbols-outlined">
                    {move.type === 'in' ? 'trending_up' : 'trending_down'}
                  </span>
                </div>
                <div>
                  <p className="font-bold text-sm text-white">{move.itemName}</p>
                  <p className="text-xs text-[#9e9eb7]">{move.date} • {move.responsible}</p>
                </div>
              </div>
              <div className="text-right">
                <p className={`font-bold ${move.type === 'in' ? 'text-green-500' : 'text-red-500'}`}>
                  {move.type === 'in' ? '+' : '-'}{move.quantity.split(' ')[0]}
                </p>
                <p className="text-[10px] uppercase tracking-wider font-bold text-[#9e9eb7]">
                  {move.type === 'in' ? 'Entrada' : 'Saída'}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default InventoryMovement;
