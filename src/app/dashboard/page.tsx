'use client';

import React from 'react';
import { motion, Variants } from 'framer-motion';
import { 
  Users, 
  Calendar, 
  DollarSign, 
  TrendingUp, 
  Clock, 
  ArrowRight,
  Gift,
  CheckCircle2
} from 'lucide-react';
import Link from 'next/link';

export default function DashboardHome() {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants: Variants = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 100 } }
  };

  // Mock data para exibição rica de Analytics no Dashboard
  const stats = [
    { name: 'Meus Eventos', value: '2', change: '+1 este mês', icon: Calendar, color: 'from-blue-500 to-indigo-500' },
    { name: 'Confirmados (RSVP)', value: '148', change: '84% de presença', icon: Users, color: 'from-emerald-500 to-teal-500' },
    { name: 'Arrecadado Presentes', value: 'R$ 8.450,00', change: '+R$ 1.200,00 hoje', icon: DollarSign, color: 'from-amber-500 to-orange-500' },
    { name: 'Visualizações do Site', value: '1.240', change: '+28% semana passada', icon: TrendingUp, color: 'from-pink-500 to-rose-500' },
  ];

  const recentRsvps = [
    { id: '1', name: 'Ana Souza & Família', status: 'confirmado', guests: 3, time: 'há 10 min', event: 'Casamento Lucas & Julia' },
    { id: '2', name: 'Carlos Eduardo', status: 'confirmado', guests: 1, time: 'há 45 min', event: 'Níver de 30 anos Leo' },
    { id: '3', name: 'Mariana Lima', status: 'recusado', guests: 0, time: 'há 2 horas', event: 'Casamento Lucas & Julia' },
  ];

  const transactions = [
    { id: 'tx-1', payer: 'Mariana Castro', gift: 'Cotinha Lua de Mel - Jantar Especial', value: 'R$ 250,00', status: 'aprovado' },
    { id: 'tx-2', payer: 'Roberto Gomes', gift: 'Cafeteira Nespresso', value: 'R$ 600,00', status: 'aprovado' },
    { id: 'tx-3', payer: 'Cláudia Mendes', gift: 'Jogo de Copos de Cristal', value: 'R$ 150,00', status: 'pendente' },
  ];

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-8"
    >
      {/* Boas-vindas */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-slate-50 to-indigo-200 bg-clip-text text-transparent">
            Olá, Guilherme
          </h2>
          <p className="text-slate-400 mt-1">
            Aqui está a visão geral e o analytics dos seus eventos ativos.
          </p>
        </div>
        <Link href="/dashboard/eventos">
          <motion.button 
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            className="px-5 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold shadow-lg shadow-indigo-500/20 text-sm flex items-center gap-2 cursor-pointer transition-all"
          >
            Criar Novo Evento
            <ArrowRight className="h-4 w-4" />
          </motion.button>
        </Link>
      </div>

      {/* Cards de Métricas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <motion.div
            key={idx}
            variants={itemVariants}
            className="relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur-xl group hover:border-slate-700 transition-all duration-300"
          >
            <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${stat.color} opacity-5 blur-2xl group-hover:opacity-10 transition-opacity`} />
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-400 font-medium">{stat.name}</span>
              <div className={`p-2.5 rounded-xl bg-gradient-to-br ${stat.color} text-white shadow-lg`}>
                <stat.icon className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-4">
              <span className="text-2xl font-bold tracking-tight text-slate-50">{stat.value}</span>
              <div className="flex items-center gap-1.5 mt-2 text-xs font-semibold text-slate-500">
                <Clock className="h-3.5 w-3.5" />
                <span>{stat.change}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Grade Principal (RSVPs e Financeiro) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Confirmações de Presença Recentes */}
        <motion.div 
          variants={itemVariants}
          className="lg:col-span-6 rounded-2xl border border-slate-800 bg-slate-900/40 p-6 backdrop-blur-xl"
        >
          <div className="flex items-center justify-between pb-6 border-b border-slate-800">
            <div>
              <h3 className="font-bold text-lg text-slate-100 flex items-center gap-2">
                <Users className="h-5 w-5 text-indigo-400" />
                Presenças Recentes (RSVPs)
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">Últimas confirmações preenchidas pelos convidados</p>
            </div>
          </div>

          <div className="mt-6 space-y-4">
            {recentRsvps.map((rsvp) => (
              <div key={rsvp.id} className="flex items-center justify-between p-4 rounded-xl bg-slate-900/60 border border-slate-850 hover:border-slate-800 transition-colors">
                <div className="flex items-center gap-3">
                  <div className={`h-2 w-2 rounded-full ${rsvp.status === 'confirmado' ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                  <div>
                    <h4 className="text-sm font-semibold text-slate-100">{rsvp.name}</h4>
                    <p className="text-xs text-slate-500 mt-0.5">{rsvp.event}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                    rsvp.status === 'confirmado' 
                      ? 'bg-emerald-500/10 text-emerald-400' 
                      : 'bg-rose-500/10 text-rose-400'
                  }`}>
                    {rsvp.status === 'confirmado' ? `Vou (+${rsvp.guests - 1})` : 'Não vou'}
                  </span>
                  <p className="text-[10px] text-slate-600 mt-1">{rsvp.time}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Últimas Transações e Presentes */}
        <motion.div 
          variants={itemVariants}
          className="lg:col-span-6 rounded-2xl border border-slate-800 bg-slate-900/40 p-6 backdrop-blur-xl"
        >
          <div className="flex items-center justify-between pb-6 border-b border-slate-800">
            <div>
              <h3 className="font-bold text-lg text-slate-100 flex items-center gap-2">
                <Gift className="h-5 w-5 text-amber-400" />
                Presentes Recebidos
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">Arrecadação financeira de presentes virtuais</p>
            </div>
          </div>

          <div className="mt-6 space-y-4">
            {transactions.map((tx) => (
              <div key={tx.id} className="flex items-center justify-between p-4 rounded-xl bg-slate-900/60 border border-slate-850 hover:border-slate-800 transition-colors">
                <div>
                  <h4 className="text-sm font-semibold text-slate-100">{tx.payer}</h4>
                  <p className="text-xs text-slate-500 mt-0.5 truncate max-w-[200px] md:max-w-xs">{tx.gift}</p>
                </div>
                <div className="text-right">
                  <span className="text-sm font-bold text-slate-100">{tx.value}</span>
                  <div className="mt-1 flex items-center justify-end gap-1">
                    <CheckCircle2 className={`h-3 w-3 ${tx.status === 'aprovado' ? 'text-emerald-400' : 'text-amber-400'}`} />
                    <span className={`text-[10px] font-medium capitalize ${
                      tx.status === 'aprovado' ? 'text-emerald-400' : 'text-amber-400'
                    }`}>{tx.status}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

      </div>
    </motion.div>
  );
}
