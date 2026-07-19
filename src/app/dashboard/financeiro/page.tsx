'use client';

import React, { useState } from 'react';
import { 
  CreditCard, 
  Check, 
  HelpCircle, 
  Sparkles, 
  ArrowRight,
  TrendingUp,
  Award
} from 'lucide-react';
import { toast } from 'sonner';

export default function FinancialAndPlansPage() {
  const [currentPlan, setCurrentPlan] = useState<'free' | 'premium' | 'vip'>('free');
  const [isLoading, setIsLoading] = useState<string | null>(null);

  const handleSubscribe = (plan: 'premium' | 'vip') => {
    setIsLoading(plan);
    toast.info(`Iniciando assinatura do plano ${plan.toUpperCase()} via Mercado Pago...`);
    
    setTimeout(() => {
      setCurrentPlan(plan);
      setIsLoading(null);
      toast.success(`Assinatura ativada com sucesso! Você agora é membro ${plan.toUpperCase()}.`);
    }, 1500);
  };

  const plans = [
    {
      id: 'free',
      name: 'Gratuito',
      price: 'R$ 0',
      description: 'Ideal para experimentar os recursos básicos do site.',
      features: [
        'Até 100 convidados no RSVP',
        'Lista de presentes convertida em dinheiro',
        'Modelos de sites padrão',
        'Suporte por e-mail',
      ]
    },
    {
      id: 'premium',
      name: 'Premium',
      price: 'R$ 79,90',
      period: 'por evento',
      description: 'Perfeito para casamentos e grandes eventos.',
      features: [
        'Convidados ilimitados no RSVP',
        'Lista de presentes com taxa reduzida',
        'Galeria de fotos pós-evento com upload de convidados',
        'Editor de site avançado (sem logo do Celebrar360)',
        'Suporte prioritário via WhatsApp',
      ],
      popular: true,
    },
    {
      id: 'vip',
      name: 'VIP / Gold',
      price: 'R$ 149,90',
      period: 'por evento',
      description: 'Experiência suprema com domínio exclusivo.',
      features: [
        'Tudo do Premium',
        'Domínio personalizado grátis (.com ou .com.br)',
        'Consultoria de design inclusa',
        'Assistente de IA com OpenAI ilimitado',
        'Painel financeiro detalhado de presentes com saques instantâneos',
      ]
    }
  ];

  return (
    <div className="space-y-10">
      {/* Cabeçalho */}
      <div>
        <h2 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-slate-50 to-indigo-200 bg-clip-text text-transparent">
          Planos e Assinaturas
        </h2>
        <p className="text-slate-400 mt-1">Escolha o plano ideal para o tamanho do seu evento.</p>
      </div>

      {/* Plano Ativo */}
      <div className="p-6 bg-slate-900/40 border border-indigo-500/20 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 blur-3xl pointer-events-none" />
        <div className="flex items-center gap-4">
          <div className="p-3.5 bg-indigo-600/10 text-indigo-400 border border-indigo-500/20 rounded-xl">
            <Award className="h-6 w-6" />
          </div>
          <div>
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Seu plano atual</span>
            <h3 className="text-xl font-bold text-slate-100 mt-0.5 capitalize">{currentPlan}</h3>
          </div>
        </div>

        {currentPlan === 'free' && (
          <p className="text-xs text-slate-400 max-w-xs md:text-right">
            Faça o upgrade para remover os anúncios e ter convidados ilimitados no RSVP.
          </p>
        )}
      </div>

      {/* pricing cards */}
      <div id="planos" className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-4">
        {plans.map((plan) => {
          const isCurrent = currentPlan === plan.id;
          return (
            <div 
              key={plan.id} 
              className={`rounded-2xl border p-6 flex flex-col relative overflow-hidden ${
                plan.popular 
                  ? 'border-indigo-500 bg-slate-900/80 shadow-2xl shadow-indigo-500/10 scale-105 md:translate-y-[-10px]' 
                  : 'border-slate-800 bg-slate-900/40'
              }`}
            >
              {plan.popular && (
                <span className="absolute top-3 right-3 px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase bg-indigo-600 text-white tracking-widest">
                  Mais Escolhido
                </span>
              )}

              <h4 className="text-lg font-bold text-slate-100">{plan.name}</h4>
              <p className="text-xs text-slate-500 mt-1.5 min-h-[32px]">{plan.description}</p>
              
              <div className="my-6">
                <span className="text-3xl font-black text-slate-100">{plan.price}</span>
                {plan.period && <span className="text-xs text-slate-500 ml-1.5">{plan.period}</span>}
              </div>

              {/* Botão de Upgrade */}
              {isCurrent ? (
                <div className="w-full py-3 bg-slate-800 text-slate-400 text-xs font-bold rounded-xl text-center border border-slate-700">
                  Plano Ativo
                </div>
              ) : (
                <button
                  onClick={() => handleSubscribe(plan.id as any)}
                  disabled={isLoading !== null || plan.id === 'free'}
                  className={`w-full py-3 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                    plan.popular
                      ? 'bg-indigo-650 hover:bg-indigo-550 text-white shadow-lg shadow-indigo-500/20'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                  }`}
                >
                  {isLoading === plan.id ? 'Processando...' : 'Contratar'}
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              )}

              {/* Features List */}
              <ul className="space-y-3.5 mt-8 border-t border-slate-800 pt-6 text-xs text-slate-350">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-2.5">
                    <Check className="h-4 w-4 text-indigo-400 shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
}
