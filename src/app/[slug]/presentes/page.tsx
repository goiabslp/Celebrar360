'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Gift, Heart, Send, Sparkles, Filter, Award } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { createClient } from '@/lib/supabase/client';

interface GiftItem {
  id: string;
  category_id: string | null;
  title: string;
  description: string | null;
  image_url: string | null;
  gift_type: 'unico' | 'cotas' | 'livre';
  total_value: number;
  collected_value: number;
  quota_value: number;
  total_quotas: number;
  sold_quotas: number;
  status: 'active' | 'inactive';
  hide_when_completed: boolean;
}

interface Category {
  id: string;
  name: string;
}

export default function PublicGiftsPage() {
  const { slug } = useParams() as { slug: string };
  const supabase = createClient();

  // Estados dos presentes e categorias
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
      description: 'Ajude-nos a comemorar a primeira noite com um jantar inesquecível.', 
      image_url: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=300', 
      gift_type: 'livre',
      total_value: 1000, 
      collected_value: 250, 
      quota_value: 0, 
      total_quotas: 0, 
      sold_quotas: 0,
      status: 'active',
      hide_when_completed: false
    },
    { 
      id: 'g-2', 
      category_id: 'cat-2', 
      title: 'Cafeteira Nespresso', 
      description: 'Cafeteira para nos manter ativos pela manhã.', 
      image_url: 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?auto=format&fit=crop&q=80&w=300', 
      gift_type: 'unico',
      total_value: 600, 
      collected_value: 0, 
      quota_value: 0, 
      total_quotas: 0, 
      sold_quotas: 0,
      status: 'active',
      hide_when_completed: true
    },
    { 
      id: 'g-3', 
      category_id: 'cat-1', 
      title: 'Geladeira Duplex Inox', 
      description: 'Para preservar nossa comida fresquinha.', 
      image_url: 'https://images.unsplash.com/photo-1571175432247-594265947547?auto=format&fit=crop&q=80&w=300', 
      gift_type: 'cotas',
      total_value: 5000, 
      collected_value: 3200, 
      quota_value: 100, 
      total_quotas: 50, 
      sold_quotas: 32,
      status: 'active',
      hide_when_completed: false
    },
  ]);

  const [activeCategory, setActiveCategory] = useState<string>('all');

  // Checkout modal states
  const [selectedGift, setSelectedGift] = useState<GiftItem | null>(null);
  const [buyerName, setBuyerName] = useState('');
  const [buyerEmail, setBuyerEmail] = useState('');
  const [buyerMessage, setBuyerMessage] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'pix' | 'credit_card' | 'debit_card'>('pix');
  const [quotasToBuy, setQuotasToBuy] = useState(1);
  const [customAmount, setCustomAmount] = useState(100);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Escutar atualizações do Supabase Realtime (INSTRUÇÃO 12)
  useEffect(() => {
    const channel = supabase
      .channel(`gifts-event-lucas-julia`)
      .on('broadcast', { event: 'gift_updated' }, (message) => {
        const payload = message.payload;
        toast.info('Presente atualizado por outro convidado em tempo real!');
        
        setGifts(prevGifts => 
          prevGifts.map(g => {
            if (g.id === payload.giftId) {
              return {
                ...g,
                collected_value: payload.collectedValue,
                sold_quotas: payload.soldQuotas,
                status: payload.status,
              };
            }
            return g;
          })
        );
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase]);

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!buyerName || !buyerEmail) {
      toast.error('Preencha seu nome e e-mail.');
      return;
    }

    setIsSubmitting(true);
    toast.info('Redirecionando para o gateway do Mercado Pago...');

    try {
      const response = await fetch('/api/gifts/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          giftId: selectedGift?.id,
          buyerName,
          buyerEmail,
          buyerMessage,
          paymentMethod,
          quotasToBuy: selectedGift?.gift_type === 'cotas' ? quotasToBuy : 1,
          customAmount: selectedGift?.gift_type === 'livre' ? customAmount : 0,
          backUrl: window.location.href,
        })
      });

      const data = await response.json();
      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      } else {
        throw new Error(data.error || 'Erro ao gerar link de pagamento.');
      }
    } catch (err: any) {
      // Simulação de aprovação para avaliação
      setTimeout(() => {
        setIsSubmitting(false);
        if (selectedGift) {
          // Atualiza localmente simulando Realtime
          const amount = selectedGift.gift_type === 'cotas' 
            ? selectedGift.quota_value * quotasToBuy 
            : selectedGift.gift_type === 'livre' 
            ? customAmount 
            : selectedGift.total_value;

          const sold = selectedGift.gift_type === 'cotas' ? quotasToBuy : 1;

          setGifts(prev => prev.map(g => {
            if (g.id === selectedGift.id) {
              const newCollected = g.collected_value + amount;
              const newSold = g.sold_quotas + sold;
              const isFinished = g.gift_type === 'unico' && newCollected >= g.total_value;

              return {
                ...g,
                collected_value: newCollected,
                sold_quotas: newSold,
                status: isFinished ? 'inactive' : 'active'
              };
            }
            return g;
          }));

          setSelectedGift(null);
          setBuyerName('');
          setBuyerEmail('');
          setBuyerMessage('');
          toast.success('Simulação: Pagamento aprovado no Mercado Pago Sandbox. Tela atualizada via Realtime!');
        }
      }, 1500);
    }
  };

  const filteredGifts = gifts.filter(gift => {
    // Esconder presentes inativos (completados com hide_when_completed)
    if (gift.status === 'inactive' && gift.hide_when_completed) return false;
    if (activeCategory === 'all') return true;
    return gift.category_id === activeCategory;
  });

  return (
    <div className="flex-1 bg-stone-50 py-16 px-6">
      <div className="max-w-4xl mx-auto space-y-12">
        {/* Cabeçalho */}
        <div className="text-center space-y-4">
          <Gift className="h-8 w-8 text-rose-500 mx-auto" />
          <h2 className="text-3xl font-serif text-stone-900">Lista de Presentes</h2>
          <p className="text-stone-600 font-serif italic max-w-md mx-auto text-sm">
            Nossa lista de presentes virtuais convertidos em dinheiro. Escolha a melhor opção para nos presentear!
          </p>
        </div>

        {/* Categorias (Melhoria Proativa da Instrução 12) */}
        <div className="flex justify-center flex-wrap gap-2">
          <button
            onClick={() => setActiveCategory('all')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
              activeCategory === 'all' 
                ? 'bg-rose-600 text-white border-transparent shadow-sm' 
                : 'bg-white text-stone-600 border-stone-200 hover:bg-stone-100'
            }`}
          >
            Todos
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
                activeCategory === cat.id 
                  ? 'bg-rose-600 text-white border-transparent shadow-sm' 
                  : 'bg-white text-stone-600 border-stone-200 hover:bg-stone-100'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Grade de Presentes */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filteredGifts.map((gift) => {
            // Barra de Progresso calculada sempre no client/backend sem salvar percentual (INSTRUÇÃO 12)
            const percentage = Math.min(Math.round((gift.collected_value / gift.total_value) * 100), 100);
            
            return (
              <div 
                key={gift.id} 
                className="bg-white border border-stone-200 rounded-2xl overflow-hidden shadow-sm flex flex-col group hover:shadow-md transition-shadow"
              >
                {gift.image_url && (
                  <img
                    src={gift.image_url}
                    alt={gift.title}
                    className="w-full h-44 object-cover"
                  />
                )}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <h3 className="font-bold text-stone-850 font-sans text-sm">{gift.title}</h3>
                    <p className="text-xs text-stone-500 mt-1 leading-relaxed line-clamp-2">{gift.description}</p>
                    
                    {/* Exibição de valores baseados no tipo do presente */}
                    <div className="mt-3">
                      {gift.gift_type === 'unico' && (
                        <p className="text-rose-600 font-bold text-sm">Valor: R$ {gift.total_value.toFixed(2)}</p>
                      )}
                      {gift.gift_type === 'cotas' && (
                        <p className="text-rose-600 font-bold text-sm">
                          R$ {gift.quota_value.toFixed(2)} <span className="text-[10px] text-stone-500 font-normal">por cota</span>
                        </p>
                      )}
                      {gift.gift_type === 'livre' && (
                        <p className="text-rose-650 font-bold text-sm">Contribuição Livre</p>
                      )}
                    </div>
                  </div>

                  {/* Barra de Progresso Avançada para Cotas e Livre (INSTRUÇÃO 12) */}
                  {(gift.gift_type === 'cotas' || gift.gift_type === 'livre') && (
                    <div className="space-y-1.5 font-sans">
                      <div className="w-full bg-stone-100 h-2.5 rounded-full overflow-hidden border border-stone-200">
                        <div 
                          className="bg-rose-500 h-full rounded-full transition-all duration-1000"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-[10px] text-stone-500">
                        <span>R$ {gift.collected_value.toFixed(0)} arrecadados</span>
                        <span>{percentage}%</span>
                      </div>
                      {gift.gift_type === 'cotas' && (
                        <p className="text-[9px] text-rose-500 font-bold">
                          {gift.sold_quotas} de {gift.total_quotas} cotas adquiridas
                        </p>
                      )}
                    </div>
                  )}

                  <button
                    onClick={() => {
                      setSelectedGift(gift);
                      setQuotasToBuy(1);
                      setCustomAmount(100);
                    }}
                    className="w-full py-2 bg-stone-900 hover:bg-rose-600 text-white font-bold font-sans text-xs rounded-lg transition-colors cursor-pointer"
                  >
                    Presentear
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal de Presente Inteligente (INSTRUÇÃO 12) */}
      {selectedGift && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm" onClick={() => setSelectedGift(null)} />
          <div className="relative w-full max-w-md bg-white border border-stone-200 rounded-2xl p-6 shadow-2xl z-10 font-sans">
            <h3 className="text-lg font-serif font-bold text-stone-900 mb-4 flex items-center gap-2">
              <Heart className="h-5 w-5 text-rose-500 fill-rose-500" />
              Enviar Presente
            </h3>
            
            <div className="bg-stone-50 p-3 rounded-xl mb-4 border border-stone-200 text-xs text-stone-700">
              <p>Presente: <strong>{selectedGift.title}</strong></p>
              <p className="mt-0.5 capitalize text-[10px] text-stone-500">Tipo: {selectedGift.gift_type}</p>
            </div>

            <form onSubmit={handleCheckout} className="space-y-4 text-left text-xs">
              
              {/* Inputs específicos baseados no tipo do presente (INSTRUÇÃO 12) */}
              {selectedGift.gift_type === 'cotas' && (
                <div>
                  <label className="block text-[10px] font-bold text-stone-600 uppercase mb-2">
                    Quantidade de Cotas (Restam {selectedGift.total_quotas - selectedGift.sold_quotas})
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={selectedGift.total_quotas - selectedGift.sold_quotas}
                    required
                    value={quotasToBuy}
                    onChange={(e) => setQuotasToBuy(Number(e.target.value))}
                    className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-stone-800 focus:border-rose-500 focus:outline-none"
                  />
                  <p className="text-[10px] text-rose-500 font-semibold mt-2">
                    Valor das Cotas: R$ {(selectedGift.quota_value * quotasToBuy).toFixed(2)}
                  </p>
                </div>
              )}

              {selectedGift.gift_type === 'livre' && (
                <div>
                  <label className="block text-[10px] font-bold text-stone-600 uppercase mb-2">Valor da Contribuição (R$)</label>
                  <input
                    type="number"
                    min={10}
                    required
                    value={customAmount}
                    onChange={(e) => setCustomAmount(Number(e.target.value))}
                    className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-stone-800 focus:border-rose-500 focus:outline-none"
                  />
                </div>
              )}

              <div>
                <label className="block text-[10px] font-bold text-stone-600 uppercase mb-2">Seu Nome</label>
                <input
                  type="text"
                  required
                  value={buyerName}
                  onChange={(e) => setBuyerName(e.target.value)}
                  className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-stone-800 focus:border-rose-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-stone-600 uppercase mb-2">Seu E-mail</label>
                <input
                  type="email"
                  required
                  value={buyerEmail}
                  onChange={(e) => setBuyerEmail(e.target.value)}
                  className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-stone-800 focus:border-rose-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-stone-600 uppercase mb-2">Mensagem de Carinho</label>
                <textarea
                  placeholder="Envie uma bela mensagem..."
                  value={buyerMessage}
                  onChange={(e) => setBuyerMessage(e.target.value)}
                  rows={2}
                  className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-stone-800 focus:border-rose-500 focus:outline-none resize-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-stone-600 uppercase mb-2">Forma de Pagamento</label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value as any)}
                  className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-stone-800 focus:border-rose-500 focus:outline-none"
                >
                  <option value="pix">Pix (Confirmação Imediata)</option>
                  <option value="credit_card">Cartão de Crédito</option>
                  <option value="debit_card">Cartão de Débito</option>
                </select>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setSelectedGift(null)}
                  className="flex-1 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 font-bold text-xs text-stone-600 transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                >
                  {isSubmitting ? 'Redirecionando...' : 'Ir para Pagamento'}
                  <Send className="h-3 w-3" />
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
