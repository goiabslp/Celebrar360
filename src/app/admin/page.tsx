'use client';

import React, { useState } from 'react';
import { 
  Users, 
  Calendar, 
  DollarSign, 
  CreditCard, 
  TrendingUp, 
  CheckCircle,
  AlertTriangle
} from 'lucide-react';
import { toast } from 'sonner';

export default function AdminOverviewPage() {
  const [users, setUsers] = useState([
    { id: 'u-1', name: 'Carlos Ramos', email: 'carlos@exemplo.com', plan: 'VIP', eventsCount: 3, status: 'ativo' },
    { id: 'u-2', name: 'Mariana Pires', email: 'mari@exemplo.com', plan: 'Premium', eventsCount: 1, status: 'ativo' },
    { id: 'u-3', name: 'Julio Cesar', email: 'julio@exemplo.com', plan: 'Gratuito', eventsCount: 0, status: 'suspenso' },
  ]);

  const stats = [
    { name: 'Total de Organizadores', value: '1.420', icon: Users, color: 'text-indigo-400 bg-indigo-500/10' },
    { name: 'Sites de Eventos Criados', value: '2.150', icon: Calendar, color: 'text-rose-400 bg-rose-500/10' },
    { name: 'Assinaturas Premium/VIP', value: 'R$ 48.900,00', icon: DollarSign, color: 'text-emerald-400 bg-emerald-500/10' },
    { name: 'Presentes Transacionados', value: 'R$ 380.500,00', icon: CreditCard, color: 'text-amber-400 bg-amber-500/10' },
  ];

  const handleToggleUserStatus = (userId: string) => {
    setUsers(users.map(u => {
      if (u.id === userId) {
        const newStatus = u.status === 'ativo' ? 'suspenso' : 'ativo';
        toast.success(`Usuário ${u.name} agora está ${newStatus.toUpperCase()}`);
        return { ...u, status: newStatus };
      }
      return u;
    }));
  };

  return (
    <div className="space-y-8">
      {/* Cabeçalho */}
      <div>
        <h2 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-slate-50 to-rose-200 bg-clip-text text-transparent">
          Analytics Geral & Usuários
        </h2>
        <p className="text-slate-400 mt-1">Visão corporativa do SaaS Celebrar360.</p>
      </div>

      {/* Grid de Métricas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <div key={idx} className="p-6 bg-slate-900/40 border border-slate-800 rounded-2xl relative overflow-hidden">
            <div className="flex justify-between items-center">
              <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">{stat.name}</span>
              <div className={`p-2 rounded-lg ${stat.color}`}>
                <stat.icon className="h-5 w-5" />
              </div>
            </div>
            <p className="text-2xl font-black text-slate-50 mt-4">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Tabela de Usuários */}
      <div className="space-y-4">
        <h3 className="font-bold text-lg text-slate-200">Gerenciamento de Contas</h3>
        
        <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/20">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-900/60 border-b border-slate-800 text-slate-400 font-bold uppercase tracking-wider">
                <th className="p-4">Organizador</th>
                <th className="p-4">E-mail</th>
                <th className="p-4 text-center">Plano</th>
                <th className="p-4 text-center">Nº Eventos</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-850">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-slate-900/30 transition-colors">
                  <td className="p-4 font-bold text-slate-200">{u.name}</td>
                  <td className="p-4 text-slate-400">{u.email}</td>
                  <td className="p-4 text-center">
                    <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      u.plan === 'VIP' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : 
                      u.plan === 'Premium' ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' : 
                      'bg-slate-800 text-slate-500'
                    }`}>
                      {u.plan}
                    </span>
                  </td>
                  <td className="p-4 text-center text-slate-300 font-semibold">{u.eventsCount}</td>
                  <td className="p-4">
                    <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                      u.status === 'ativo' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'
                    }`}>
                      {u.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => handleToggleUserStatus(u.id)}
                      className={`px-3 py-1.5 rounded-lg border text-[10px] font-bold transition-colors cursor-pointer ${
                        u.status === 'ativo' 
                          ? 'bg-rose-500/10 hover:bg-rose-500/20 border-rose-500/30 text-rose-400' 
                          : 'bg-emerald-500/10 hover:bg-emerald-500/20 border-emerald-500/30 text-emerald-400'
                      }`}
                    >
                      {u.status === 'ativo' ? 'Suspender' : 'Reativar'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
