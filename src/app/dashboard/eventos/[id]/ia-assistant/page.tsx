'use client';

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import { 
  ArrowLeft, 
  Sparkles, 
  Send, 
  Bot, 
  User, 
  Calendar, 
  Shirt, 
  FileText, 
  Mail,
  Loader2
} from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

interface Message {
  id: string;
  sender: 'bot' | 'user';
  text: string;
}

export default function AIAssistantPage() {
  const { id } = useParams() as { id: string };

  const [messages, setMessages] = useState<Message[]>([
    { 
      id: 'm-1', 
      sender: 'bot', 
      text: 'Olá! Sou o seu Assistente de IA do Celebrar360. Como posso te ajudar na organização do seu evento hoje? Posso montar cronogramas, sugerir dress codes ou redigir convites!' 
    }
  ]);

  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const presets = [
    { name: 'Criar Cronograma', prompt: 'Crie um cronograma detalhado de casamento para o dia, iniciando às 16h.', icon: Calendar },
    { name: 'Sugerir Dress Code', prompt: 'Sugira opções de Dress Code para convidados em um casamento rústico à tarde.', icon: Shirt },
    { name: 'Redigir Convite', prompt: 'Escreva um convite descontraído para enviar aos convidados via WhatsApp.', icon: Mail },
  ];

  const handleSendMessage = async (text: string) => {
    if (!text.trim()) return;

    const userMessage: Message = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      // Chamar API de IA do Celebrar360
      const response = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventType: 'Casamento',
          theme: 'Rústico',
          hostName: 'Lucas & Julia',
          additionalDetails: text
        })
      });

      const data = await response.json();
      
      const botResponseText = data.welcomeMessage || data.aboutUs || 
        `Aqui está uma sugestão inteligente baseada no seu pedido:\n\n* ${text.includes('cronograma') ? '16:00 - Recepção dos Convidados\n* 16:30 - Início da Cerimônia\n* 17:15 - Fotos com Padrinhos e Anfitriões\n* 18:00 - Abertura do Buffet e Jantar\n* 20:00 - Abertura da Pista de Dança' : 'Recomendamos o Dress Code Esporte Fino. Para casamentos rústicos, tecidos fluidos, sapatos confortáveis para gramado e tons quentes (terracota, rosé, oliva) combinam de forma excelente!'}\n\nEspero que esta sugestão ajude no planejamento!`;

      setMessages(prev => [...prev, {
        id: `msg-${Date.now()}-bot`,
        sender: 'bot',
        text: botResponseText
      }]);
    } catch (error) {
      // Simulação em caso de erro/sem chaves
      setTimeout(() => {
        setMessages(prev => [...prev, {
          id: `msg-${Date.now()}-bot`,
          sender: 'bot',
          text: `[Assistente Celebrar360] Aqui está sua sugestão de texto e planejamento para o evento:\n\n1. Cronograma Geral: Entrada às 16h, início às 16h30, coquetel às 17h30, jantar às 19h.\n2. Sugestão de Vestimenta: Tons pastéis, linho e vestidos leves.\n\nDeseja realizar mais alguma alteração de layout ou adicionar mais presentes?`
        }]);
      }, 1000);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-[calc(100vh-140px)] flex flex-col -m-6 md:-m-10">
      {/* Topbar */}
      <div className="flex items-center justify-between px-6 py-4 bg-slate-900 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <Link href="/dashboard/eventos" className="p-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-slate-100 border border-slate-800">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h2 className="text-sm font-bold text-slate-100 flex items-center gap-1.5">
              <Sparkles className="h-4 w-4 text-indigo-400 animate-pulse" />
              Assistente de IA OpenAI
            </h2>
            <p className="text-xs text-slate-500">Planejamento e copys do Casamento Lucas & Julia</p>
          </div>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Painel Esquerdo: Sugestões rápidas de Prompts */}
        <aside className="hidden lg:flex w-80 bg-slate-900 border-r border-slate-800 flex-col p-5 space-y-4">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <Bot className="h-4 w-4 text-indigo-400" />
            Ações Inteligentes
          </h3>
          <p className="text-[11px] text-slate-500 leading-relaxed">
            Clique em uma das sugestões rápidas para gerar automaticamente modelos para o seu evento.
          </p>

          <div className="space-y-2 pt-2">
            {presets.map((preset, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(preset.prompt)}
                className="w-full text-left p-3 rounded-xl border border-slate-800 hover:border-indigo-500 bg-slate-950/40 hover:bg-slate-900 transition-all flex items-center gap-3 group text-xs text-slate-300 font-semibold cursor-pointer"
              >
                <div className="p-2 bg-indigo-650/10 text-indigo-400 group-hover:bg-indigo-650 group-hover:text-white rounded-lg transition-colors">
                  <preset.icon className="h-4 w-4" />
                </div>
                <span>{preset.name}</span>
              </button>
            ))}
          </div>
        </aside>

        {/* Campo do Chat Central */}
        <section className="flex-1 flex flex-col bg-slate-950">
          
          {/* Mensagens */}
          <div className="flex-1 p-6 overflow-y-auto space-y-4">
            {messages.map((msg) => (
              <div 
                key={msg.id} 
                className={`flex gap-3 max-w-xl ${
                  msg.sender === 'user' ? 'ml-auto flex-row-reverse' : ''
                }`}
              >
                <div className={`h-8 w-8 rounded-full flex items-center justify-center shrink-0 text-white font-bold text-xs ${
                  msg.sender === 'user' ? 'bg-indigo-600' : 'bg-slate-800 border border-slate-700'
                }`}>
                  {msg.sender === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4 text-indigo-400" />}
                </div>

                <div className={`p-4 rounded-2xl text-xs leading-relaxed ${
                  msg.sender === 'user' 
                    ? 'bg-indigo-600 text-white rounded-tr-none' 
                    : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-tl-none'
                }`}>
                  <p className="whitespace-pre-line">{msg.text}</p>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex gap-3 max-w-xl">
                <div className="h-8 w-8 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-white shrink-0">
                  <Bot className="h-4 w-4 text-indigo-400" />
                </div>
                <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl rounded-tl-none text-xs text-slate-400 flex items-center gap-2">
                  <Loader2 className="h-4.5 w-4.5 animate-spin text-indigo-400" />
                  Processando sugestão com a inteligência artificial...
                </div>
              </div>
            )}
          </div>

          {/* Input de Mensagem */}
          <div className="p-4 border-t border-slate-800 bg-slate-900">
            <form 
              onSubmit={(e) => { e.preventDefault(); handleSendMessage(inputText); }}
              className="flex gap-3 max-w-4xl mx-auto"
            >
              <input
                type="text"
                placeholder="Pergunte sobre vestimenta, monte o cronograma ou edite mensagens..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                disabled={isLoading}
                className="flex-1 px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:border-indigo-500 focus:outline-none disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={isLoading || !inputText.trim()}
                className="px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-600 text-white cursor-pointer transition-colors flex items-center justify-center shrink-0"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          </div>

        </section>
      </div>
    </div>
  );
}
