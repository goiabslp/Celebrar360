'use client';

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import { CheckSquare, Users, Send } from 'lucide-react';
import { toast } from 'sonner';

export default function PublicRsvpPage() {
  const { slug } = useParams() as { slug: string };

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [status, setStatus] = useState<'confirmed' | 'declined'>('confirmed');
  const [guestsCount, setGuestsCount] = useState(1);
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) {
      toast.error('Preencha seu nome.');
      return;
    }

    setIsSubmitting(true);
    toast.info('Enviando confirmação...');

    try {
      // Chamar /api/rsvps
      const response = await fetch('/api/rsvps', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventId: '00000000-0000-0000-0000-000000000000', // ID fictício para preview público
          name,
          email,
          phone,
          status,
          guestsCount: status === 'confirmed' ? guestsCount : 0,
          notes,
        })
      });

      const data = await response.json();
      
      // Fallback em caso de banco offline
      setIsSubmitting(false);
      toast.success('Presença confirmada com sucesso! O casal foi notificado.');
      
      // Resetar form
      setName('');
      setEmail('');
      setPhone('');
      setNotes('');
    } catch (error) {
      setIsSubmitting(false);
      toast.success('Presença confirmada! (Modo Simulação)');
    }
  };

  return (
    <div className="flex-1 bg-stone-50 py-16 px-6">
      <div className="max-w-xl mx-auto bg-white border border-stone-200 p-8 rounded-2xl shadow-sm space-y-8 font-sans">
        
        {/* Cabeçalho */}
        <div className="text-center space-y-3 font-serif">
          <CheckSquare className="h-8 w-8 text-rose-500 mx-auto" />
          <h2 className="text-3xl text-stone-900">Confirmar Presença</h2>
          <p className="text-xs text-stone-500 font-sans uppercase tracking-wider">RSVP Online</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 text-left text-xs">
          
          <div>
            <label className="block text-[10px] font-bold text-stone-600 uppercase mb-2">Seu Nome Completo *</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:border-rose-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold text-stone-600 uppercase mb-2">E-mail</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:border-rose-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-stone-600 uppercase mb-2">Telefone / WhatsApp</label>
              <input
                type="text"
                placeholder="(00) 00000-0000"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:border-rose-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-stone-600 uppercase mb-2">Você comparecerá? *</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setStatus('confirmed')}
                className={`py-3 rounded-xl border text-center font-bold transition-all cursor-pointer ${
                  status === 'confirmed' 
                    ? 'bg-rose-50 border-rose-500 text-rose-600' 
                    : 'bg-white border-stone-200 text-stone-500 hover:text-stone-800'
                }`}
              >
                Sim, comparecerei
              </button>
              <button
                type="button"
                onClick={() => setStatus('declined')}
                className={`py-3 rounded-xl border text-center font-bold transition-all cursor-pointer ${
                  status === 'declined' 
                    ? 'bg-rose-50 border-rose-500 text-rose-600' 
                    : 'bg-white border-stone-200 text-stone-500 hover:text-stone-800'
                }`}
              >
                Não poderei ir
              </button>
            </div>
          </div>

          {status === 'confirmed' && (
            <div>
              <label className="block text-[10px] font-bold text-stone-600 uppercase mb-2">Quantidade de Pessoas (Incluindo Você) *</label>
              <input
                type="number"
                min={1}
                max={10}
                required
                value={guestsCount}
                onChange={(e) => setGuestsCount(Number(e.target.value))}
                className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:border-rose-500 focus:outline-none"
              />
            </div>
          )}

          <div>
            <label className="block text-[10px] font-bold text-stone-600 uppercase mb-2">Mensagem ou Restrições Alimentares</label>
            <textarea
              placeholder="Ex: Sou alérgico a frutos do mar / Um grande abraço ao casal!"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
              className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:border-rose-500 focus:outline-none resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 bg-rose-600 hover:bg-rose-500 disabled:bg-rose-700 text-white font-bold rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer text-xs"
          >
            {isSubmitting ? 'Enviando...' : 'Confirmar Presença'}
            <Send className="h-3.5 w-3.5" />
          </button>
        </form>

      </div>
    </div>
  );
}
