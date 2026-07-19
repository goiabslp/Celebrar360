'use client';

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import { 
  ArrowLeft, 
  Gift, 
  Plus, 
  DollarSign, 
  CreditCard, 
  ArrowDownToLine, 
  CheckCircle2, 
  Clock, 
  Trash2, 
  Edit3,
  X,
  FileSpreadsheet
} from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

interface GiftItem {
  id: string;
  name: string;
  price: number;
  image: string;
  isPurchased: boolean;
}

interface GiftTransaction {
  id: string;
  payerName: string;
  payerEmail: string;
  giftName: string;
  amount: number;
  netAmount: number;
  status: 'approved' | 'pending' | 'rejected';
  date: string;
}

export default function GiftsManagementPage() {
  const { id } = useParams() as { id: string };

  const [gifts, setGifts] = useState<GiftItem[]>([
    { id: 'g-1', name: 'Lua de Mel - Jantar Especial', price: 250.00, image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=300', isPurchased: true },
    { id: 'g-2', name: 'Cafeteira Nespresso', price: 600.00, image: 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?auto=format&fit=crop&q=80&w=300', isPurchased: true },
    { id: 'g-3', name: 'Jogo de Copos de Cristal', price: 150.00, image: 'https://images.unsplash.com/photo-1574926053821-79c5e338a933?auto=format&fit=crop&q=80&w=300', isPurchased: false },
    { id: 'g-4', name: 'Smart TV 4K 55"', price: 2200.00, image: 'https://images.unsplash.com/photo-1593305841991-05c297ba4575?auto=format&fit=crop&q=80&w=300', isPurchased: false },
  ]);

  const [transactions, setTransactions] = useState<GiftTransaction[]>([
    { id: 't-1', payerName: 'Mariana Castro', payerEmail: 'mari@exemplo.com', giftName: 'Lua de Mel - Jantar Especial', amount: 250.00, netAmount: 242.50, status: 'approved', date: '2026-07-19T20:10:00.000Z' },
    { id: 't-2', payerName: 'Roberto Gomes', payerEmail: 'roberto@exemplo.com', giftName: 'Cafeteira Nespresso', amount: 600.00, netAmount: 582.00, status: 'approved', date: '2026-07-18T15:30:00.000Z' },
    { id: 't-3', payerName: 'Cláudia Mendes', payerEmail: 'claudia@exemplo.com', giftName: 'Jogo de Copos de Cristal', amount: 150.00, netAmount: 145.50, status: 'pending', date: '2026-07-19T19:45:00.000Z' },
  ]);

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [giftName, setGiftName] = useState('');
  const [giftPrice, setGiftPrice] = useState('');
  const [giftImage, setGiftImage] = useState('');

  const handleAddGift = (e: React.FormEvent) => {
    e.preventDefault();
    if (!giftName || !giftPrice) {
      toast.error('Preencha os campos obrigatórios.');
      return;
    }

    const price = parseFloat(giftPrice);
    if (isNaN(price) || price <= 0) {
      toast.error('Preço inválido.');
      return;
    }

    const newItem: GiftItem = {
      id: `g-${Date.now()}`,
      name: giftName,
      price: price,
      image: giftImage || 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&q=80&w=300',
      isPurchased: false,
    };

    setGifts([newItem, ...gifts]);
    setIsAddOpen(false);
    setGiftName('');
    setGiftPrice('');
    setGiftImage('');
    toast.success('Presente adicionado ao site com sucesso!');
  };

  const handleDeleteGift = (giftId: string) => {
    setGifts(gifts.filter(g => g.id !== giftId));
    toast.success('Presente removido.');
  };

  const handleWithdraw = () => {
    toast.success('Solicitação de saque enviada com sucesso! O valor estará disponível na sua conta cadastrada em até 2 dias úteis.');
  };

  // Cálculos financeiros
  const totalReceived = transactions.reduce((acc, curr) => curr.status === 'approved' ? acc + curr.amount : acc, 0);
  const totalNet = transactions.reduce((acc, curr) => curr.status === 'approved' ? acc + curr.netAmount : acc, 0);
  const feesPaid = parseFloat((totalReceived - totalNet).toFixed(2));

  return (
    <div className="space-y-8">
      {/* Cabeçalho */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/dashboard/eventos" className="p-2 rounded-lg hover:bg-slate-900 text-slate-400 hover:text-slate-100 border border-slate-800">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h2 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-slate-50 to-indigo-200 bg-clip-text text-transparent">
              Carteira & Lista de Presentes
            </h2>
            <p className="text-slate-400 mt-1">Gerencie os presentes e solicite saques dos valores recebidos.</p>
          </div>
        </div>

        <button 
          onClick={() => setIsAddOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-2 cursor-pointer transition-all shadow-lg shadow-indigo-500/20"
        >
          <Plus className="h-4 w-4" />
          Adicionar Presente
        </button>
      </div>

      {/* Visão Geral Financeira */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-slate-900/40 border border-slate-800 rounded-2xl relative overflow-hidden">
          <div className="flex items-center justify-between">
            <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Saldo Bruto</p>
            <div className="p-2 bg-indigo-600/10 text-indigo-400 rounded-lg">
              <DollarSign className="h-5 w-5" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-50 mt-4">R$ {totalReceived.toFixed(2)}</p>
          <p className="text-[10px] text-slate-500 mt-2">Valores brutos pagos por seus convidados.</p>
        </div>

        <div className="p-6 bg-slate-900/40 border border-slate-800 rounded-2xl relative overflow-hidden">
          <div className="flex items-center justify-between">
            <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Taxa da Plataforma (3%)</p>
            <div className="p-2 bg-rose-500/10 text-rose-400 rounded-lg">
              <CreditCard className="h-5 w-5" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-50 mt-4">R$ {feesPaid.toFixed(2)}</p>
          <p className="text-[10px] text-slate-500 mt-2">Taxa administrativa incluindo gateway Mercado Pago.</p>
        </div>

        <div className="p-6 bg-gradient-to-br from-slate-900 via-indigo-950/20 to-slate-900 border border-indigo-500/20 rounded-2xl relative overflow-hidden">
          <div className="flex items-center justify-between">
            <p className="text-xs text-indigo-400 font-bold uppercase tracking-wider">Saldo Líquido Disponível</p>
            <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-lg">
              <ArrowDownToLine className="h-5 w-5" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-50 mt-4">R$ {totalNet.toFixed(2)}</p>
          <button
            onClick={handleWithdraw}
            disabled={totalNet <= 0}
            className="w-full mt-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:hover:bg-indigo-600 text-white font-bold text-xs rounded-lg flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
          >
            <ArrowDownToLine className="h-3.5 w-3.5" />
            Resgatar Saldo (Transferência)
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Catálogo de Presentes */}
        <div className="lg:col-span-7 space-y-4">
          <h3 className="font-bold text-lg text-slate-200 flex items-center gap-2">
            <Gift className="h-5 w-5 text-indigo-400" />
            Presentes no Site
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {gifts.map((gift) => (
              <div key={gift.id} className="p-4 bg-slate-900/40 border border-slate-800 rounded-2xl flex gap-4 items-center group relative">
                <img
                  src={gift.image}
                  alt={gift.name}
                  className="h-16 w-16 object-cover rounded-xl border border-slate-800"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-bold text-slate-200 truncate">{gift.name}</h4>
                  <p className="text-xs font-black text-indigo-400 mt-1">R$ {gift.price.toFixed(2)}</p>
                  <span className={`inline-block px-1.5 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider mt-1.5 ${
                    gift.isPurchased ? 'bg-emerald-500/10 text-emerald-400' : 'bg-slate-850 text-slate-500'
                  }`}>
                    {gift.isPurchased ? 'Comprado' : 'Disponível'}
                  </span>
                </div>
                <button
                  onClick={() => handleDeleteGift(gift.id)}
                  className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/25 border border-rose-500/20 text-rose-400 opacity-0 group-hover:opacity-100 transition-all"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Histórico Financeiro */}
        <div className="lg:col-span-5 space-y-4">
          <h3 className="font-bold text-lg text-slate-200 flex items-center gap-2">
            <FileSpreadsheet className="h-5 w-5 text-amber-400" />
            Transações Recentes
          </h3>

          <div className="space-y-3 bg-slate-900/20 border border-slate-800 p-5 rounded-2xl max-h-[460px] overflow-y-auto">
            {transactions.map((tx) => (
              <div key={tx.id} className="p-3 bg-slate-900/60 border border-slate-850 rounded-xl hover:border-slate-800 transition-colors flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-200">{tx.payerName}</h4>
                  <p className="text-[10px] text-slate-500 truncate max-w-[180px] mt-0.5">{tx.giftName}</p>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-slate-100">R$ {tx.amount.toFixed(2)}</span>
                  <div className="mt-1 flex items-center justify-end gap-1">
                    {tx.status === 'approved' ? (
                      <CheckCircle2 className="h-3 w-3 text-emerald-400" />
                    ) : (
                      <Clock className="h-3 w-3 text-amber-400" />
                    )}
                    <span className={`text-[9px] font-semibold uppercase tracking-wider ${
                      tx.status === 'approved' ? 'text-emerald-400' : 'text-amber-400'
                    }`}>{tx.status}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal - Adicionar Presente */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/85 backdrop-blur-sm" onClick={() => setIsAddOpen(false)} />
          <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl z-10">
            <h3 className="text-lg font-bold text-slate-100 mb-4 flex items-center gap-2">
              <Gift className="h-5 w-5 text-indigo-400" />
              Adicionar Presente à Lista
            </h3>
            
            <form onSubmit={handleAddGift} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-2">Nome do Presente</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Cotas para passagens aéreas"
                  value={giftName}
                  onChange={(e) => setGiftName(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-2">Valor (R$)</label>
                <input
                  type="number"
                  required
                  placeholder="Ex: 500"
                  value={giftPrice}
                  onChange={(e) => setGiftPrice(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-2">URL da Imagem (Opcional)</label>
                <input
                  type="text"
                  placeholder="https://exemplo.com/imagem.jpg"
                  value={giftImage}
                  onChange={(e) => setGiftImage(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-850 hover:bg-slate-800 font-semibold text-xs transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-colors cursor-pointer"
                >
                  Salvar Presente
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
