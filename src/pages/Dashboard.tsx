import React from 'react';
import { INITIAL_MOVEMENTS } from '../config/constants';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';

const consumptionData = [
  { name: 'Alimentos', value: 85, avg: '125kg/dia' },
  { name: 'Escritório', value: 32, avg: '12un/dia' },
  { name: 'Higiene', value: 68, avg: '22L/dia' },
  { name: 'Papelaria', value: 45, avg: '18resmas/dia' },
];

const Dashboard: React.FC = () => {
  return (
    <div className="p-8">
      {/* Page Heading */}
      <div className="mb-8">
        <h2 className="text-white text-3xl font-black leading-tight tracking-tight">Dashboard de Controle de Estoque</h2>
        <p className="text-[#9e9eb7] text-base mt-1">Escola Municipal Estácio de Sá • Visão Geral do Sistema</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="flex flex-col gap-2 rounded-2xl p-6 border border-border-dark bg-[#1c1c2e]/50">
          <div className="flex items-center justify-between mb-2">
            <p className="text-[#9e9eb7] text-sm font-medium">Total de Itens</p>
            <span className="material-symbols-outlined text-primary fill-1">inventory</span>
          </div>
          <div className="flex items-end gap-2">
            <p className="text-white text-3xl font-bold leading-none">2,480</p>
            <p className="text-[#0bda68] text-xs font-bold mb-1">+4.2%</p>
          </div>
        </div>
        <div className="flex flex-col gap-2 rounded-2xl p-6 border border-accent/20 bg-accent/5">
          <div className="flex items-center justify-between mb-2">
            <p className="text-[#9e9eb7] text-sm font-medium">Itens em Baixa</p>
            <span className="material-symbols-outlined text-accent fill-1">warning</span>
          </div>
          <div className="flex items-end gap-2">
            <p className="text-accent text-3xl font-bold leading-none">18</p>
            <p className="text-accent/60 text-xs font-medium mb-1">Atenção</p>
          </div>
        </div>
        <div className="flex flex-col gap-2 rounded-2xl p-6 border border-border-dark bg-[#1c1c2e]/50">
          <div className="flex items-center justify-between mb-2">
            <p className="text-[#9e9eb7] text-sm font-medium">Validade Próxima</p>
            <span className="material-symbols-outlined text-white/40 fill-1">event_busy</span>
          </div>
          <div className="flex items-end gap-2">
            <p className="text-white text-3xl font-bold leading-none">07</p>
            <p className="text-white/40 text-xs font-medium mb-1">Próximos 30 dias</p>
          </div>
        </div>
      </div>

      {/* Main Tables Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Recent Inflows */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h3 className="text-white text-lg font-bold">Últimas Entradas</h3>
            <button className="text-accent text-xs font-bold uppercase tracking-wider hover:underline">Ver tudo</button>
          </div>
          <div className="overflow-hidden rounded-2xl border border-border-dark bg-[#1c1c2e]/30">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#1c1c2e] text-[10px] uppercase text-[#9e9eb7] font-bold">
                  <th className="px-4 py-3">Item</th>
                  <th className="px-4 py-3">Qtd</th>
                  <th className="px-4 py-3 text-right">Data</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {INITIAL_MOVEMENTS.filter(m => m.type === 'in').slice(0, 3).map(m => (
                  <tr key={m.id} className="border-t border-border-dark hover:bg-white/5 transition-colors">
                    <td className="px-4 py-4 text-white font-medium">{m.itemName}</td>
                    <td className="px-4 py-4 text-[#9e9eb7]">{m.quantity}</td>
                    <td className="px-4 py-4 text-[#9e9eb7] text-right">{m.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Outflows */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h3 className="text-white text-lg font-bold">Últimas Saídas</h3>
            <button className="text-accent text-xs font-bold uppercase tracking-wider hover:underline">Ver tudo</button>
          </div>
          <div className="overflow-hidden rounded-2xl border border-border-dark bg-[#1c1c2e]/30">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#1c1c2e] text-[10px] uppercase text-[#9e9eb7] font-bold">
                  <th className="px-4 py-3">Item</th>
                  <th className="px-4 py-3">Destino</th>
                  <th className="px-4 py-3 text-right">Qtd</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {INITIAL_MOVEMENTS.filter(m => m.type === 'out').slice(0, 3).map(m => (
                  <tr key={m.id} className="border-t border-border-dark hover:bg-white/5 transition-colors">
                    <td className="px-4 py-4 text-white font-medium">{m.itemName}</td>
                    <td className="px-4 py-4 text-[#9e9eb7]">{m.destination}</td>
                    <td className="px-4 py-4 text-right text-white">{m.quantity}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Analytics */}
      <div className="bg-[#1c1c2e]/50 rounded-2xl border border-border-dark p-6 mb-8 shadow-xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-white text-xl font-bold">Média de Consumo</h3>
            <p className="text-[#9e9eb7] text-sm">Métricas de uso diário por categoria</p>
          </div>
          <div className="flex gap-2">
            <div className="flex items-center gap-2 bg-[#1c1c2e] px-3 py-1.5 rounded-lg border border-border-dark">
              <span className="size-2 rounded-full bg-primary"></span>
              <span className="text-xs text-white">Consumo</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
          {consumptionData.map((item, idx) => (
            <div key={idx} className="flex flex-col gap-3">
              <div className="flex justify-between items-center text-sm">
                <span className="text-white font-medium">{item.name}</span>
                <span className="text-[#9e9eb7]">{item.value}% da cota</span>
              </div>
              <div className="h-2 w-full bg-[#111117] rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary transition-all duration-1000"
                  style={{ width: `${item.value}%` }}
                />
              </div>
              <div className="flex justify-between text-[10px] text-[#9e9eb7] font-bold uppercase transition-all">
                <span>Média: {item.avg}</span>
                {item.value > 80 && <span className="text-accent animate-pulse">Atenção Crítica</span>}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Alert Banner */}
      <div className="flex items-center gap-4 bg-accent text-background-dark p-4 rounded-2xl border-l-[12px] border-background-dark/20 shadow-lg transition-transform hover:scale-[1.01] duration-300">
        <span className="material-symbols-outlined text-3xl">notification_important</span>
        <div className="flex-1">
          <p className="font-bold text-sm">Alerta de Reposição Crítica</p>
          <p className="text-xs font-medium opacity-80">5 itens atingiram o estoque mínimo de segurança. Recomendamos abertura imediata de requisição de compra.</p>
        </div>
        <Button variant="secondary" size="sm" className="bg-background-dark text-accent hover:bg-background-dark/90 border-none px-4">
          Revisar Itens
        </Button>
      </div>
    </div>
  );
};

export default Dashboard;
