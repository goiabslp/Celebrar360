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
  X,
  FileSpreadsheet,
  Layers,
  Award
} from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

interface GiftItem {
  id: string;
  category_id: string | null;
  title: string;
  price: number;
  image_url: string;
  gift_type: 'unico' | 'cotas' | 'livre';
  total_value: number;
  collected_value: number;
  quota_value: number;
  total_quotas: number;
  sold_quotas: number;
  status: 'active' | 'inactive';
}

interface Category {
  id: string;
  name: string;
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

  const [categories, setCategories] = useState<Category[]>([
    { id: 'cat-1', name: 'Casa & Decoração' },
    { id: 'cat-2', name: 'Cozinha & Eletros' },
    { id: 'cat-3', name: 'Lua de Mel' },
  ]);

  const [gifts, setGifts] = useState<GiftItem[]>([
    { 
      id: 'g-1', 
      category_id: 'cat-3', 
      title: 'Lua de Mel - Jantar Especial', 
      price: 1000, 
      image_url: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=300', 
      gift_type: 'livre',
      total_value: 1000, 
      collected_value: 250, 
      quota_value: 0, 
      total_quotas: 0, 
      sold_quotas: 0,
      status: 'active' 
    },
    { 
      id: 'g-2', 
      category_id: 'cat-2', 
      title: 'Cafeteira Nespresso', 
      price: 600, 
      image_url: 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?auto=format&fit=crop&q=80&w=300', 
      gift_type: 'unico',
      total_value: 600, 
      collected_value: 600, 
      quota_value: 0, 
      total_quotas: 0, 
      sold_quotas: 0,
      status: 'inactive' 
    },
    { 
      id: 'g-3', 
      category_id: 'cat-1', 
      title: 'Geladeira Duplex Inox', 
      price: 5000, 
      image_url: 'https://images.unsplash.com/photo-1574926053821-79c5e338a933?auto=format&fit=crop&q=80&w=300', 
      gift_type: 'cotas',
      total_value: 5000, 
      collected_value: 3200, 
      quota_value: 100, 
      total_quotas: 50, 
      sold_quotas: 32,
      status: 'active' 
    },
  ]);

  const [transactions, setTransactions] = useState<GiftTransaction[]>([
    { id: 't-1', payerName: 'Mariana Castro', payerEmail: 'mari@exemplo.com', giftName: 'Lua de Mel - Jantar Especial', amount: 250.00, netAmount: 242.50, status: 'approved', date: '2026-07-19T20:10:00.000Z' },
    { id: 't-2', payerName: 'Roberto Gomes', payerEmail: 'roberto@exemplo.com', giftName: 'Cafeteira Nespresso', amount: 600.00, netAmount: 582.00, status: 'approved', date: '2026-07-18T15:30:00.000Z' },
    { id: 't-3', payerName: 'Cláudia Mendes', payerEmail: 'claudia@exemplo.com', giftName: 'Geladeira Duplex Inox (Cotas)', amount: 200.00, netAmount: 194.00, status: 'pending', date: '2026-07-19T19:45:00.000Z' },
  ]);

  // Modal Presentes
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newPrice, setNewPrice] = useState('');
  const [newImageUrl, setNewImageUrl] = useState('');
  const [newType, setNewType] = useState<'unico' | 'cotas' | 'livre'>('unico');
  const [newCategoryId, setNewCategoryId] = useState('');
  const [newQuotasCount, setNewQuotasCount] = useState('50');

  // Modal Categorias
  const [isCatOpen, setIsCatOpen] = useState(false);
  const [newCatName, setNewCatName] = useState('');

  const handleAddGift = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle) {
      toast.error('O título do presente é obrigatório.');
      return;
    }

    const priceVal = parseFloat(newPrice) || 0;
    const quotasCountVal = parseInt(newQuotasCount) || 1;

    const newItem: GiftItem = {
      id: `g-${Date.now()}`,
      category_id: newCategoryId || null,
      title: newTitle,
      price: priceVal,
      image_url: newImageUrl || 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&q=80&w=300',
      gift_type: newType,
      total_value: priceVal,
      collected_value: 0,
      quota_value: newType === 'cotas' ? parseFloat((priceVal / quotasCountVal).toFixed(2)) : 0,
      total_quotas: newType === 'cotas' ? quotasCountVal : 0,
      sold_quotas: 0,
      status: 'active',
    };

    setGifts([newItem, ...gifts]);
    setIsAddOpen(false);
    
    // Resetar
    setNewTitle('');
    setNewPrice('');
    setNewImageUrl('');
    setNewType('unico');
    setNewCategoryId('');
    toast.success('Presente adicionado ao catálogo do site!');
  };

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;

    const newCat: Category = {
      id: `cat-${Date.now()}`,
      name: newCatName,
    };

    setCategories([...categories, newCat]);
    setIsCatOpen(false);
    setNewCatName('');
    toast.success(`Categoria "${newCat.name}" criada com sucesso!`);
  };

  const handleDeleteGift = (giftId: string) => {
    setGifts(gifts.filter(g => g.id !== giftId));
    toast.success('Presente removido.');
  };

  // Estatísticas do Dashboard (INSTRUÇÃO 12)
  const totalCollected = transactions.reduce((acc, curr) => curr.status === 'approved' ? acc + curr.amount : acc, 0);
  const totalGifts = gifts.length;
  const soldGiftsCount = gifts.filter(g => g.gift_type === 'unico' && g.status === 'inactive').length;
  const pendingGiftsCount = gifts.filter(g => g.gift_type === 'unico' && g.status === 'active').length;

  return (
    <div className="space-y-8">
      {/* Cabeçalho */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link href="/dashboard/eventos" className="p-2 rounded-lg hover:bg-slate-900 text-slate-400 hover:text-slate-100 border border-slate-800">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h2 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-slate-50 to-indigo-200 bg-clip-text text-transparent">
              Carteira & Presentes
            </h2>
            <p className="text-slate-400 mt-1">Gerencie os presentes, crie categorias e acompanhe a carteira Mercado Pago.</p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button 
            onClick={() => setIsCatOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-850 hover:border-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-2 cursor-pointer transition-all"
          >
            <Layers className="h-4 w-4" />
            Nova Categoria
          </button>
          <button 
            onClick={() => setIsAddOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-2 cursor-pointer transition-all shadow-lg shadow-indigo-500/20"
          >
            <Plus className="h-4 w-4" />
            Adicionar Presente
          </button>
        </div>
      </div>

      {/* Visão Geral Financeira (INSTRUÇÃO 12) */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="p-5 bg-slate-900/40 border border-slate-800 rounded-2xl">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[10px] font-bold uppercase tracking-wider">Valor Arrecadado</span>
            <DollarSign className="h-4.5 w-4.5 text-indigo-400" />
          </div>
          <p className="text-xl font-black text-slate-50 mt-3">R$ {totalCollected.toFixed(2)}</p>
        </div>
        
        <div className="p-5 bg-slate-900/40 border border-slate-800 rounded-2xl">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[10px] font-bold uppercase tracking-wider">Únicos Vendidos</span>
            <CheckCircle2 className="h-4.5 w-4.5 text-emerald-450" />
          </div>
          <p className="text-xl font-black text-slate-50 mt-3">{soldGiftsCount} de {totalGifts} itens</p>
        </div>

        <div className="p-5 bg-slate-900/40 border border-slate-800 rounded-2xl">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[10px] font-bold uppercase tracking-wider">Únicos Pendentes</span>
            <Clock className="h-4.5 w-4.5 text-amber-400" />
          </div>
          <p className="text-xl font-black text-slate-50 mt-3">{pendingGiftsCount} itens</p>
        </div>

        <div className="p-5 bg-gradient-to-br from-slate-900 to-indigo-950/20 border border-indigo-500/20 rounded-2xl flex items-center justify-between">
          <div>
            <span className="text-[10px] text-indigo-400 font-bold uppercase tracking-wider block">Saldo Disponível</span>
            <span className="text-xl font-black text-slate-50 mt-1 block">R$ {(totalCollected * 0.97).toFixed(2)}</span>
          </div>
          <button 
            onClick={() => toast.success('Saque solicitado para sua conta cadastrada!')}
            className="p-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white shadow transition-colors"
          >
            <ArrowDownToLine className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Catálogo com Filtro por Categoria */}
        <div className="lg:col-span-7 space-y-4">
          <h3 className="font-bold text-lg text-slate-200 flex items-center gap-2">
            <Gift className="h-5 w-5 text-indigo-400" />
            Catálogo de Presentes
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {gifts.map((gift) => {
              const category = categories.find(c => c.id === gift.category_id);
              return (
                <div key={gift.id} className="p-4 bg-slate-900/40 border border-slate-800 rounded-2xl flex gap-4 items-center group relative">
                  <img
                    src={gift.image_url}
                    alt={gift.title}
                    className="h-16 w-16 object-cover rounded-xl border border-slate-800 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-slate-200 truncate">{gift.title}</h4>
                    <p className="text-[10px] text-indigo-400 font-bold mt-0.5">
                      R$ {gift.total_value.toFixed(2)} 
                      {gift.gift_type === 'cotas' && ` (${gift.total_quotas} cotas de R$ ${gift.quota_value})`}
                    </p>
                    <div className="flex gap-2 items-center mt-2.5">
                      <span className="inline-block px-1.5 py-0.5 rounded text-[8px] font-semibold bg-slate-800 text-slate-400">
                        {category ? category.name : 'Sem categoria'}
                      </span>
                      <span className={`inline-block px-1.5 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider ${
                        gift.status === 'inactive' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-slate-850 text-slate-500'
                      }`}>
                        {gift.status === 'inactive' ? 'Concluído' : 'Ativo'}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDeleteGift(gift.id)}
                    className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/25 border border-rose-500/20 text-rose-400 opacity-0 group-hover:opacity-100 transition-all cursor-pointer"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              );
            })}
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

      {/* Modal - Nova Categoria */}
      {isCatOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/85 backdrop-blur-sm" onClick={() => setIsCatOpen(false)} />
          <div className="relative w-full max-w-sm bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl z-10">
            <h3 className="text-lg font-bold text-slate-100 mb-4 flex items-center gap-2">
              <Layers className="h-5 w-5 text-indigo-400" />
              Nova Categoria
            </h3>
            
            <form onSubmit={handleAddCategory} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-2">Nome da Categoria</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Lua de Mel, Eletros, Decoração"
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div className="flex gap-3 mt-6">
                <button type="button" onClick={() => setIsCatOpen(false)} className="flex-1 py-2.5 rounded-xl bg-slate-850 hover:bg-slate-800 font-semibold text-xs text-slate-350 cursor-pointer">
                  Cancelar
                </button>
                <button type="submit" className="flex-1 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs cursor-pointer">
                  Criar Categoria
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal - Adicionar Presente com Tipos Zod (INSTRUÇÃO 12) */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/85 backdrop-blur-sm" onClick={() => setIsAddOpen(false)} />
          <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl z-10">
            <h3 className="text-lg font-bold text-slate-100 mb-4 flex items-center gap-2">
              <Gift className="h-5 w-5 text-indigo-400" />
              Adicionar Presente
            </h3>
            
            <form onSubmit={handleAddGift} className="space-y-4 text-xs">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-2">Nome do Presente *</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-2">Tipo de Presente *</label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value as any)}
                    className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:border-indigo-500 focus:outline-none"
                  >
                    <option value="unico">Tipo 1: Presente Único</option>
                    <option value="cotas">Tipo 2: Cotas</option>
                    <option value="livre">Tipo 3: Contribuição Livre</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-2">Categoria</label>
                  <select
                    value={newCategoryId}
                    onChange={(e) => setNewCategoryId(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:border-indigo-500 focus:outline-none"
                  >
                    <option value="">Nenhuma</option>
                    {categories.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {newType !== 'livre' && (
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-2">Valor Total (R$) *</label>
                  <input
                    type="number"
                    required
                    value={newPrice}
                    onChange={(e) => setNewPrice(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:border-indigo-500 focus:outline-none"
                  />
                </div>
              )}

              {newType === 'cotas' && (
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-2">Quantidade de Cotas *</label>
                  <input
                    type="number"
                    required
                    value={newQuotasCount}
                    onChange={(e) => setNewQuotasCount(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:border-indigo-500 focus:outline-none"
                  />
                </div>
              )}

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-2">URL da Foto (Opcional)</label>
                <input
                  type="text"
                  value={newImageUrl}
                  onChange={(e) => setNewImageUrl(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div className="flex gap-3 mt-6">
                <button type="button" onClick={() => setIsAddOpen(false)} className="flex-1 py-2.5 rounded-xl bg-slate-850 hover:bg-slate-800 font-semibold text-xs text-slate-350 cursor-pointer">
                  Cancelar
                </button>
                <button type="submit" className="flex-1 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs cursor-pointer">
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
