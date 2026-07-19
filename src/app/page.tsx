'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  Sparkles, 
  Heart, 
  ArrowRight, 
  Gift, 
  CheckSquare, 
  Camera, 
  Smartphone,
  Globe
} from 'lucide-react';

export default function Home() {
  return (
    <div className="bg-slate-950 text-slate-100 min-h-screen flex flex-col font-sans overflow-x-hidden selection:bg-indigo-650 selection:text-white">
      {/* Header */}
      <header className="px-6 py-5 max-w-7xl mx-auto w-full flex justify-between items-center z-10">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-indigo-650 rounded-xl text-white shadow-lg shadow-indigo-500/30">
            <Sparkles className="h-5 w-5" />
          </div>
          <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
            Celebrar360
          </span>
        </div>

        <Link href="/dashboard">
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 hover:text-white font-semibold text-xs transition-all cursor-pointer"
          >
            Acessar Dashboard
          </motion.button>
        </Link>
      </header>

      {/* Hero Section */}
      <section className="flex-1 flex flex-col justify-center items-center px-6 py-20 md:py-32 text-center max-w-4xl mx-auto space-y-8 relative">
        <div className="absolute inset-0 -z-10 flex items-center justify-center">
          <div className="w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-3xl" />
          <div className="w-[300px] h-[300px] bg-purple-500/10 rounded-full blur-3xl translate-x-24" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-950/40 border border-indigo-550/20 text-indigo-400 text-xs font-semibold"
        >
          <Sparkles className="h-3.5 w-3.5" />
          Criação de Sites com Inteligência Artificial
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl md:text-6xl font-black tracking-tight leading-none text-slate-50"
        >
          O site perfeito para o seu evento,{' '}
          <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            sem escrever código
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-slate-400 text-md md:text-lg max-w-2xl leading-relaxed"
        >
          Plataforma SaaS completa para casamentos, aniversários e comemorações. 
          Gere textos por IA, gerencie RSVPs, configure lista de presentes e converta tudo em dinheiro.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <Link href="/dashboard">
            <motion.button 
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-indigo-650 hover:bg-indigo-550 text-white font-bold text-sm shadow-xl shadow-indigo-600/30 flex items-center justify-center gap-2 cursor-pointer transition-all"
            >
              Criar Meu Evento Grátis
              <ArrowRight className="h-4.5 w-4.5" />
            </motion.button>
          </Link>
        </motion.div>
      </section>

      {/* Grid de Recursos */}
      <section className="py-20 px-6 max-w-7xl mx-auto w-full border-t border-slate-900">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          <div className="p-6 bg-slate-900/30 border border-slate-900 rounded-2xl space-y-4">
            <div className="p-3 bg-indigo-600/10 text-indigo-400 rounded-xl w-fit">
              <Smartphone className="h-6 w-6" />
            </div>
            <h3 className="font-bold text-slate-100">Construtor No-Code</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Arraste seções, edite textos em tempo real e crie páginas prontas para celular, tablet e desktop.
            </p>
          </div>

          <div className="p-6 bg-slate-900/30 border border-slate-900 rounded-2xl space-y-4">
            <div className="p-3 bg-emerald-600/10 text-emerald-400 rounded-xl w-fit">
              <Gift className="h-6 w-6" />
            </div>
            <h3 className="font-bold text-slate-100">Presentes em Dinheiro</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Adicione presentes fictícios ou cotas. Seus convidados pagam pelo Mercado Pago e você saca o dinheiro.
            </p>
          </div>

          <div className="p-6 bg-slate-900/30 border border-slate-900 rounded-2xl space-y-4">
            <div className="p-3 bg-amber-600/10 text-amber-400 rounded-xl w-fit">
              <CheckSquare className="h-6 w-6" />
            </div>
            <h3 className="font-bold text-slate-100">RSVP Integrado</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Controle a lista de confirmados em tempo real, receba e-mails transacionais e baixe relatórios.
            </p>
          </div>

          <div className="p-6 bg-slate-900/30 border border-slate-900 rounded-2xl space-y-4">
            <div className="p-3 bg-pink-600/10 text-pink-400 rounded-xl w-fit">
              <Camera className="h-6 w-6" />
            </div>
            <h3 className="font-bold text-slate-100">Galeria Pós-Evento</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Permita que seus convidados façam o upload de fotos tiradas no dia do evento e monte um lindo mural.
            </p>
          </div>

        </div>
      </section>
    </div>
  );
}
