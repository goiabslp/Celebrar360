'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { Calendar, MapPin, Clock, Heart } from 'lucide-react';
import { motion } from 'framer-motion';

export default function PublicEventHome() {
  const { slug } = useParams() as { slug: string };

  return (
    <div className="flex-1 flex flex-col bg-white">
      {/* Hero Banner */}
      <section 
        className="py-32 px-6 text-center text-white relative bg-cover bg-center flex flex-col justify-center items-center"
        style={{ 
          backgroundImage: 'linear-gradient(rgba(0,0,0,0.45), rgba(0,0,0,0.65)), url("https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=1200")' 
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-4"
        >
          <span className="text-xs uppercase font-sans font-bold tracking-widest text-rose-300">Salvem a Data</span>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight font-serif">Lucas & Julia</h1>
          <div className="w-12 h-[1px] bg-rose-300 mx-auto my-6" />
          <p className="text-lg md:text-xl text-stone-200 max-w-lg font-serif italic">
            "Para sempre é muito tempo, mas eu não me importaria de passar ao seu lado."
          </p>
        </motion.div>
      </section>

      {/* Mensagem principal */}
      <section className="py-20 px-6 max-w-2xl mx-auto text-center space-y-6">
        <Heart className="h-8 w-8 text-rose-500 mx-auto fill-rose-500" />
        <h2 className="text-3xl font-serif text-stone-900">Sejam Bem-vindos!</h2>
        <p className="text-stone-600 leading-relaxed font-serif text-md">
          Criamos este site para compartilhar com vocês todos os detalhes da celebração do nosso casamento. 
          Aqui vocês encontrarão o local da cerimônia, nossa lista de presentes virtuais e o formulário para confirmação de presença (RSVP).
        </p>
        <p className="text-stone-600 leading-relaxed font-serif text-md">
          A presença de cada um de vocês é fundamental para tornar este dia inesquecível. Nos vemos em breve!
        </p>
      </section>

      {/* Detalhes do Evento */}
      <section className="py-16 bg-stone-50 border-t border-b border-stone-200">
        <div className="max-w-4xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          
          <div className="p-6 bg-white border border-stone-200 rounded-2xl shadow-sm space-y-3">
            <Calendar className="h-6 w-6 text-rose-500 mx-auto" />
            <h3 className="font-bold text-sm uppercase tracking-wider text-stone-850 font-sans">Data</h3>
            <p className="text-stone-600 text-sm font-serif">Sábado, 10 de Outubro de 2026</p>
          </div>

          <div className="p-6 bg-white border border-stone-200 rounded-2xl shadow-sm space-y-3">
            <Clock className="h-6 w-6 text-rose-500 mx-auto" />
            <h3 className="font-bold text-sm uppercase tracking-wider text-stone-850 font-sans">Horário</h3>
            <p className="text-stone-600 text-sm font-serif">Às 16h00 (Recomendamos chegar 30min antes)</p>
          </div>

          <div className="p-6 bg-white border border-stone-200 rounded-2xl shadow-sm space-y-3">
            <MapPin className="h-6 w-6 text-rose-500 mx-auto" />
            <h3 className="font-bold text-sm uppercase tracking-wider text-stone-850 font-sans">Local</h3>
            <p className="text-stone-600 text-sm font-serif">Espaço Província, Nova Lima - MG</p>
          </div>

        </div>
      </section>

      {/* Mapa */}
      <section className="py-20 px-6 max-w-4xl mx-auto w-full text-center space-y-6">
        <h3 className="text-2xl font-serif text-stone-900">Como Chegar</h3>
        <p className="text-stone-500 text-xs font-sans">Espaço Província — R. das Flores, 100 - Jardim Secreto, Nova Lima - MG</p>
        
        {/* Google Map Mock */}
        <div className="w-full h-80 bg-stone-100 rounded-2xl border border-stone-250 flex items-center justify-center text-xs text-stone-400 font-sans shadow-inner">
          [ Mapa do Google Maps Incorporado ]
        </div>
      </section>
    </div>
  );
}
