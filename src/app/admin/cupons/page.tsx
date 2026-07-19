'use client';

import React, { useState } from 'react';
import { Ticket, Plus, Trash2, CheckCircle2, Key } from 'lucide-react';
import { toast } from 'sonner';

interface Coupon {
  id: string;
  code: string;
  discountPercent: number;
  expiresAt: string;
  status: 'active' | 'expired';
}

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([
    { id: 'c-1', code: 'CELEBRAR30', discountPercent: 30, expiresAt: '2026-12-31', status: 'active' },
    { id: 'c-2', code: 'NOIVAS50', discountPercent: 50, expiresAt: '2026-08-30', status: 'active' },
    { id: 'c-3', code: 'EXPIRED10', discountPercent: 10, expiresAt: '2026-01-01', status: 'expired' },
  ]);

  const [newCode, setNewCode] = useState('');
  const [newDiscount, setNewDiscount] = useState('');
  const [newExpiry, setNewExpiry] = useState('');

  const handleCreateCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCode || !newDiscount || !newExpiry) {
      toast.error('Preencha todos os campos obrigatórios.');
      return;
    }

    const discount = parseInt(newDiscount);
    if (isNaN(discount) || discount < 1 || discount > 100) {
      toast.error('O desconto deve ser entre 1% e 100%.');
      return;
    }

    const newCoupon: Coupon = {
      id: `c-${Date.now()}`,
      code: newCode.toUpperCase().replace(/\s+/g, ''),
      discountPercent: discount,
      expiresAt: newExpiry,
      status: new Date(newExpiry) > new Date() ? 'active' : 'expired',
    };

    setCoupons([newCoupon, ...coupons]);
    setNewCode('');
    setNewDiscount('');
    setNewExpiry('');
    toast.success('Cupom de desconto criado e ativado com sucesso!');
  };

  const handleDelete = (id: string) => {
    setCoupons(coupons.filter(c => c.id !== id));
    toast.success('Cupom removido.');
  };

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Cabeçalho */}
      <div>
        <h2 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-slate-50 to-rose-200 bg-clip-text text-transparent flex items-center gap-2">
          <Ticket className="h-7 w-7 text-rose-500" />
          Cupons de Desconto
        </h2>
        <p className="text-slate-400 mt-1">Crie e gerencie códigos promocionais de desconto para contratação dos planos.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        
        {/* Formulário de Criação */}
        <div className="md:col-span-5 p-6 bg-slate-900/40 border border-slate-800 rounded-2xl h-fit">
          <h3 className="font-bold text-sm text-slate-100 mb-4 flex items-center gap-2">
            <Plus className="h-4.5 w-4.5 text-rose-455" />
            Novo Código Promocional
          </h3>

          <form onSubmit={handleCreateCoupon} className="space-y-4 text-xs">
            <div>
              <label className="block text-[10px] font-bold text-slate-450 uppercase mb-2">Código do Cupom</label>
              <input
                type="text"
                required
                placeholder="Ex: FESTA20"
                value={newCode}
                onChange={(e) => setNewCode(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:border-rose-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-450 uppercase mb-2">Porcentagem de Desconto (%)</label>
              <input
                type="number"
                min={1}
                max={100}
                required
                placeholder="Ex: 20"
                value={newDiscount}
                onChange={(e) => setNewDiscount(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:border-rose-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-450 uppercase mb-2">Data de Expiração</label>
              <input
                type="date"
                required
                value={newExpiry}
                onChange={(e) => setNewExpiry(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:border-rose-500 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white font-bold rounded-xl transition-all cursor-pointer shadow-lg shadow-rose-500/20"
            >
              Criar Cupom
            </button>
          </form>
        </div>

        {/* Lista de Cupons */}
        <div className="md:col-span-7 space-y-4">
          <h3 className="font-bold text-sm text-slate-100">Códigos Ativos</h3>
          
          <div className="space-y-3">
            {coupons.map((c) => (
              <div key={c.id} className="p-4 bg-slate-900/60 border border-slate-850 rounded-xl hover:border-slate-800 transition-colors flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-rose-500/10 text-rose-400 rounded-lg">
                    <Ticket className="h-4.5 w-4.5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-slate-200 tracking-wider">{c.code}</h4>
                    <p className="text-[10px] text-slate-500 mt-0.5">Expiração: {c.expiresAt}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <span className="text-sm font-black text-rose-455">-{c.discountPercent}%</span>
                    <p className={`text-[8px] font-bold uppercase tracking-wider mt-0.5 ${
                      c.status === 'active' ? 'text-emerald-400' : 'text-slate-500'
                    }`}>{c.status}</p>
                  </div>
                  <button
                    onClick={() => handleDelete(c.id)}
                    className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition-colors cursor-pointer"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
