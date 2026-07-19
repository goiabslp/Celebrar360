'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Search, 
  Calendar, 
  MapPin, 
  Eye, 
  Settings, 
  Edit3, 
  Users, 
  Gift, 
  Image as ImageIcon,
  Sparkles,
  ArrowRight,
  ChevronRight,
  CheckCircle2,
  X
} from 'lucide-react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';

// Schema do formulário de criação de evento
const eventSchema = z.object({
  title: z.string().min(3, 'O título deve ter pelo menos 3 caracteres'),
  date: z.string().min(1, 'A data do evento é obrigatória'),
  eventType: z.string().min(1, 'Escolha o tipo de evento'),
  theme: z.string().min(1, 'Escolha um tema visual inicial'),
  locationName: z.string().min(2, 'Nome do local é obrigatório'),
  locationAddress: z.string().min(5, 'Endereço completo é obrigatório'),
  useAI: z.boolean(),
  aiPrompt: z.string().max(200).optional(),
});

type EventFormValues = z.infer<typeof eventSchema>;

interface EventData {
  id: string;
  title: string;
  date: string;
  slug: string;
  eventType: string;
  locationName: string;
  status: 'draft' | 'published';
  guestsCount: number;
  giftsCount: number;
}

export default function EventsPage() {
  const [events, setEvents] = useState<EventData[]>([
    {
      id: 'event-1',
      title: 'Casamento Lucas & Julia',
      date: '2026-10-10T16:00:00.000Z',
      slug: 'lucas-e-julia',
      eventType: 'Casamento',
      locationName: 'Espaço Província, Nova Lima - MG',
      status: 'published',
      guestsCount: 148,
      giftsCount: 24,
    },
    {
      id: 'event-2',
      title: 'Níver de 30 anos Leo',
      date: '2026-11-20T21:00:00.000Z',
      slug: 'niver-leo-30',
      eventType: 'Aniversário',
      locationName: 'Ponto M, São Paulo - SP',
      status: 'draft',
      guestsCount: 12,
      giftsCount: 5,
    },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);

  const { register, handleSubmit, formState: { errors }, watch, setValue } = useForm<EventFormValues>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      useAI: false,
    }
  });

  const watchUseAI = watch('useAI');

  const filteredEvents = events.filter(event => 
    event.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const onSubmit = async (data: EventFormValues) => {
    setIsGeneratingAI(true);
    toast.info('Criando evento e gerando blocos padrão...');

    // Simulação de chamada de IA caso useAI esteja ativo
    if (data.useAI) {
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast.success('Textos inteligentes gerados via OpenAI!');
    } else {
      await new Promise(resolve => setTimeout(resolve, 800));
    }

    const newEvent: EventData = {
      id: `event-${Date.now()}`,
      title: data.title,
      date: new Date(data.date).toISOString(),
      slug: data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''),
      eventType: data.eventType,
      locationName: data.locationName,
      status: 'draft',
      guestsCount: 0,
      giftsCount: 0,
    };

    setEvents([newEvent, ...events]);
    setIsGeneratingAI(false);
    setIsModalOpen(false);
    setStep(1);
    toast.success('Evento criado com sucesso! Configure as páginas e publique.');
  };

  const handleNextStep = () => {
    if (step === 1) {
      setStep(2);
    }
  };

  return (
    <div className="space-y-8">
      {/* Cabeçalho */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-slate-50 to-indigo-200 bg-clip-text text-transparent">
            Meus Eventos
          </h2>
          <p className="text-slate-400 mt-1">
            Gerencie seus eventos, edite páginas, acompanhe convidados e presentes.
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold shadow-lg shadow-indigo-500/20 text-sm flex items-center gap-2 cursor-pointer transition-all self-start md:self-auto"
        >
          <Plus className="h-4 w-4" />
          Novo Evento
        </button>
      </div>

      {/* Busca */}
      <div className="relative max-w-md">
        <Search className="absolute left-4 top-3.5 h-5 w-5 text-slate-500" />
        <input
          type="text"
          placeholder="Buscar evento pelo título..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-12 pr-4 py-3 bg-slate-900/60 border border-slate-800 rounded-xl focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all text-slate-200 text-sm"
        />
      </div>

      {/* Lista de Eventos */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {filteredEvents.map((event) => (
          <motion.div
            key={event.id}
            layoutId={event.id}
            className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 backdrop-blur-xl hover:border-slate-700 transition-all group relative overflow-hidden"
          >
            {/* Status badge */}
            <div className="absolute top-6 right-6">
              <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                event.status === 'published' 
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                  : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
              }`}>
                {event.status === 'published' ? 'Publicado' : 'Rascunho'}
              </span>
            </div>

            <div>
              <span className="text-xs text-indigo-400 font-bold tracking-widest uppercase">{event.eventType}</span>
              <h3 className="text-xl font-bold text-slate-100 mt-1.5 group-hover:text-indigo-400 transition-colors">
                {event.title}
              </h3>
              
              <div className="flex flex-col gap-2 mt-4 text-xs text-slate-400">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-slate-500" />
                  <span>{new Date(event.date).toLocaleDateString('pt-BR', { dateStyle: 'long' })}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-slate-500" />
                  <span className="truncate">{event.locationName}</span>
                </div>
              </div>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-3 gap-4 border-t border-b border-slate-800 py-4 my-5 text-center bg-slate-950/20 rounded-xl">
              <div>
                <p className="text-xs text-slate-500">Convidados</p>
                <p className="text-sm font-bold text-slate-200 mt-0.5">{event.guestsCount}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Presentes</p>
                <p className="text-sm font-bold text-slate-200 mt-0.5">{event.giftsCount}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Acessos</p>
                <p className="text-sm font-bold text-slate-200 mt-0.5">{(event.guestsCount * 3) + 12}</p>
              </div>
            </div>

            {/* Abas e Rotas Físicas (URL) */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center text-xs">
              <Link href={`/dashboard/eventos/${event.id}/editor`} className="flex flex-col items-center gap-1.5 p-2 rounded-lg bg-slate-900 border border-slate-850 hover:border-slate-700 hover:bg-slate-800/30 text-slate-300">
                <Edit3 className="h-4 w-4 text-indigo-400" />
                <span>Editar Site</span>
              </Link>
              <Link href={`/dashboard/eventos/${event.id}/convidados`} className="flex flex-col items-center gap-1.5 p-2 rounded-lg bg-slate-900 border border-slate-850 hover:border-slate-700 hover:bg-slate-800/30 text-slate-300">
                <Users className="h-4 w-4 text-emerald-400" />
                <span>Convidados</span>
              </Link>
              <Link href={`/dashboard/eventos/${event.id}/presentes`} className="flex flex-col items-center gap-1.5 p-2 rounded-lg bg-slate-900 border border-slate-850 hover:border-slate-700 hover:bg-slate-800/30 text-slate-300">
                <Gift className="h-4 w-4 text-amber-400" />
                <span>Presentes</span>
              </Link>
              <Link href={`/dashboard/eventos/${event.id}/galeria`} className="flex flex-col items-center gap-1.5 p-2 rounded-lg bg-slate-900 border border-slate-850 hover:border-slate-700 hover:bg-slate-800/30 text-slate-300">
                <ImageIcon className="h-4 w-4 text-pink-400" />
                <span>Galeria</span>
              </Link>
              <Link href={`/dashboard/eventos/${event.id}/ia-assistant`} className="flex flex-col items-center gap-1.5 p-2 rounded-lg bg-slate-900 border border-slate-850 hover:border-slate-700 hover:bg-slate-800/30 text-slate-300">
                <Sparkles className="h-4 w-4 text-purple-400" />
                <span>Assistente IA</span>
              </Link>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Modal - Criação de Evento (Wizard) */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            
            <motion.div
              initial={{ scale: 0.95, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: 20, opacity: 0 }}
              className="relative w-full max-w-xl rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl z-10 overflow-hidden"
            >
              <button 
                onClick={() => setIsModalOpen(false)}
                className="absolute top-4 right-4 text-slate-500 hover:text-slate-200 p-1 rounded-lg hover:bg-slate-800"
              >
                <X className="h-5 w-5" />
              </button>

              <h3 className="text-xl font-bold text-slate-100 flex items-center gap-2 pb-4 border-b border-slate-800 mb-6">
                <Sparkles className="h-5 w-5 text-indigo-400" />
                Criar Novo Evento — Passo {step} de 2
              </h3>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                {step === 1 && (
                  <motion.div 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-4"
                  >
                    <div>
                      <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Título do Evento</label>
                      <input
                        type="text"
                        placeholder="Ex: Casamento Arthur & Beatrice"
                        {...register('title')}
                        className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl focus:border-indigo-500 focus:outline-none text-sm text-slate-200"
                      />
                      {errors.title && <p className="text-xs text-rose-500 mt-1">{errors.title.message}</p>}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Data do Evento</label>
                        <input
                          type="datetime-local"
                          {...register('date')}
                          className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl focus:border-indigo-500 focus:outline-none text-sm text-slate-200"
                        />
                        {errors.date && <p className="text-xs text-rose-500 mt-1">{errors.date.message}</p>}
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Tipo</label>
                        <select
                          {...register('eventType')}
                          className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl focus:border-indigo-500 focus:outline-none text-sm text-slate-200"
                        >
                          <option value="">Selecione...</option>
                          <option value="Casamento">Casamento</option>
                          <option value="Aniversário">Aniversário</option>
                          <option value="Formatura">Formatura</option>
                          <option value="Corporativo">Corporativo</option>
                          <option value="Outro">Outro</option>
                        </select>
                        {errors.eventType && <p className="text-xs text-rose-500 mt-1">{errors.eventType.message}</p>}
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Tema/Estilo Inicial</label>
                      <select
                        {...register('theme')}
                        className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl focus:border-indigo-500 focus:outline-none text-sm text-slate-200"
                      >
                        <option value="">Selecione...</option>
                        <option value="modern">Moderno e Minimalista</option>
                        <option value="classic">Clássico e Elegante</option>
                        <option value="rustic">Rústico e Acolhedor</option>
                        <option value="colorful">Vibrante e Festivo</option>
                      </select>
                      {errors.theme && <p className="text-xs text-rose-500 mt-1">{errors.theme.message}</p>}
                    </div>

                    <button
                      type="button"
                      onClick={handleNextStep}
                      className="w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 font-semibold text-sm transition-colors mt-6 flex items-center justify-center gap-2 cursor-pointer"
                    >
                      Continuar
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </motion.div>
                )}

                {step === 2 && (
                  <motion.div 
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-4"
                  >
                    <div>
                      <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Nome do Local</label>
                      <input
                        type="text"
                        placeholder="Ex: Salão de Festas Imperial"
                        {...register('locationName')}
                        className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl focus:border-indigo-500 focus:outline-none text-sm text-slate-200"
                      />
                      {errors.locationName && <p className="text-xs text-rose-500 mt-1">{errors.locationName.message}</p>}
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Endereço Completo</label>
                      <input
                        type="text"
                        placeholder="Ex: Av. Contorno, 1234 - Bairro Alto, Belo Horizonte - MG"
                        {...register('locationAddress')}
                        className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl focus:border-indigo-500 focus:outline-none text-sm text-slate-200"
                      />
                      {errors.locationAddress && <p className="text-xs text-rose-500 mt-1">{errors.locationAddress.message}</p>}
                    </div>

                    <div className="flex items-center gap-3 p-4 bg-indigo-950/20 border border-indigo-900/30 rounded-xl">
                      <input
                        type="checkbox"
                        id="useAI"
                        {...register('useAI')}
                        className="h-4.5 w-4.5 text-indigo-600 border-slate-800 rounded focus:ring-indigo-500 focus:ring-offset-slate-900 bg-slate-950"
                      />
                      <label htmlFor="useAI" className="text-sm font-semibold text-slate-200 flex items-center gap-2 cursor-pointer">
                        <Sparkles className="h-4.5 w-4.5 text-indigo-400 animate-pulse" />
                        Escrever textos do site com Inteligência Artificial (OpenAI)
                      </label>
                    </div>

                    {watchUseAI && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="space-y-2"
                      >
                        <label className="block text-xs font-bold text-slate-400 uppercase">Instruções extras para a IA (Opcional)</label>
                        <textarea
                          placeholder="Ex: Destacar nossa história de 5 anos de namoro e focar em tons mais descontraídos."
                          {...register('aiPrompt')}
                          rows={2}
                          className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl focus:border-indigo-500 focus:outline-none text-sm text-slate-200 resize-none"
                        />
                      </motion.div>
                    )}

                    <div className="flex gap-4 mt-6">
                      <button
                        type="button"
                        onClick={() => setStep(1)}
                        className="flex-1 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 font-semibold text-sm transition-colors cursor-pointer"
                      >
                        Voltar
                      </button>
                      <button
                        type="submit"
                        disabled={isGeneratingAI}
                        className="flex-1 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-700 disabled:opacity-50 text-white font-semibold text-sm transition-colors flex items-center justify-center gap-2 cursor-pointer"
                      >
                        {isGeneratingAI ? 'Criando...' : 'Finalizar & Criar'}
                        <CheckCircle2 className="h-4.5 w-4.5" />
                      </button>
                    </div>
                  </motion.div>
                )}
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
