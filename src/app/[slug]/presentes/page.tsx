'use client';

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import { Gift, Heart, Send, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

interface GiftItem {
  id: string;
  name: string;
  price: number;
  image: string;
  isPurchased: boolean;
}

export default function PublicGiftsPage() {
  const { slug } = useParams() as { slug: string };

  const [gifts] = useState<GiftItem[]>([
    { id: 'g-1', name: 'Lua de Mel - Jantar Especial', price: 250.00, image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=300', isPurchased: false },
    { id: 'g-2', name: 'Cafeteira Nespresso', price: 600.00, image: 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?auto=format&fit=crop&q=80&w=300', isPurchased: false },
    { id: 'g-3', name: 'Jogo de Copos de Cristal', price: 150.00, image: 'https://images.unsplash.com/photo-1574926053821-79c5e338a933?auto=format&fit=crop&q=80&w=300', isPurchased: false },
    { id: 'g-4', name: 'Smart TV 4K 55"', price: 2200.00, image: 'https://images.unsplash.com/photo-1593305841991-05c297ba4575?auto=format&fit=crop&q=80&w=300', isPurchased: false },
  ]);

  const [selectedGift, setSelectedGift] = useState<GiftItem | null>(null);
  const [buyerName, setBuyerName] = useState('');
  const [buyerEmail, setBuyerEmail] = useState('');
  const [buyerMessage, setBuyerMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!buyerName || !buyerEmail) {
      toast.error('Preencha seu nome e e-mail.');
      return;
    }

    setIsSubmitting(true);
    toast.info('Redirecionando para o gateway do Mercado Pago...');

    try {
      // Simulação de chamada para /api/gifts/checkout
      const response = await fetch('/api/gifts/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          giftId: selectedGift?.id,
          buyerName,
          buyerEmail,
          buyerMessage,
          backUrl: window.location.href,
        })
      });

      const data = await response.json();
      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      } else {
        throw new Error(data.error || 'Erro ao gerar checkout.');
      }
    } catch (err: any) {
      // Fallback em caso de falha de conexão ou variáveis ausentes
      console.log('Usando mock checkout URL');
      setTimeout(() => {
        setIsSubmitting(false);
        setSelectedGift(null);
        toast.success('Simulação: Compra realizada com sucesso no Sandbox do Mercado Pago!');
      }, 1500);
    }
  };

  return (
    <div className="flex-1 bg-stone-50 py-16 px-6">
      <div className="max-w-4xl mx-auto space-y-12">
        {/* Cabeçalho */}
        <div className="text-center space-y-4">
          <Gift className="h-8 w-8 text-rose-500 mx-auto" />
          <h2 className="text-3xl font-serif text-stone-900">Lista de Presentes</h2>
          <p className="text-stone-600 font-serif italic max-w-md mx-auto text-sm">
            Fique à vontade para nos presentear! Nossos presentes são virtuais e o valor arrecadado será depositado diretamente para nossa lua de mel.
          </p>
        </div>

        {/* Grade de Presentes */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {gifts.map((gift) => (
            <div 
              key={gift.id} 
              className="bg-white border border-stone-200 rounded-2xl overflow-hidden shadow-sm flex flex-col group hover:shadow-md transition-shadow"
            >
              <img
                src={gift.image}
                alt={gift.name}
                className="w-full h-44 object-cover"
              />
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-stone-850 font-sans text-sm">{gift.name}</h3>
                  <p className="text-rose-600 font-bold font-sans text-sm mt-1">R$ {gift.price.toFixed(2)}</p>
                </div>

                <button
                  onClick={() => setSelectedGift(gift)}
                  className="w-full mt-4 py-2 bg-stone-900 hover:bg-rose-600 text-white font-bold font-sans text-xs rounded-lg transition-colors cursor-pointer"
                >
                  Presentear
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal de Presente */}
      {selectedGift && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm" onClick={() => setSelectedGift(null)} />
          <div className="relative w-full max-w-md bg-white border border-stone-200 rounded-2xl p-6 shadow-2xl z-10 font-sans">
            <h3 className="text-lg font-serif font-bold text-stone-900 mb-4 flex items-center gap-2">
              <Heart className="h-5 w-5 text-rose-500 fill-rose-500" />
              Enviar presente
            </h3>
            
            <p className="text-xs text-stone-500 mb-4">
              Você está presenteando com: <strong>{selectedGift.name}</strong> (R$ {selectedGift.price.toFixed(2)})
            </p>

            <form onSubmit={handleCheckout} className="space-y-4 text-left">
              <div>
                <label className="block text-[10px] font-bold text-stone-600 uppercase mb-2">Seu Nome</label>
                <input
                  type="text"
                  required
                  value={buyerName}
                  onChange={(e) => setBuyerName(e.target.value)}
                  className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-800 focus:border-rose-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-stone-600 uppercase mb-2">Seu E-mail</label>
                <input
                  type="email"
                  required
                  value={buyerEmail}
                  onChange={(e) => setBuyerEmail(e.target.value)}
                  className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-800 focus:border-rose-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-stone-600 uppercase mb-2">Mensagem para os Anfitriões</label>
                <textarea
                  placeholder="Deseje felicitações..."
                  value={buyerMessage}
                  onChange={(e) => setBuyerMessage(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-800 focus:border-rose-500 focus:outline-none resize-none"
                />
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
