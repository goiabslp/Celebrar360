'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  Save, 
  Eye, 
  Layers, 
  Settings2, 
  Plus, 
  Trash2, 
  MoveUp, 
  MoveDown,
  Sparkles,
  MapPin,
  Calendar,
  Gift,
  FileText,
  ChevronRight,
  Smartphone,
  Monitor,
  Laptop
} from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

interface BlockData {
  id: string;
  type: 'hero' | 'text' | 'map' | 'rsvp_form' | 'gift_list' | 'gallery';
  title: string;
  content: Record<string, any>;
}

interface PageData {
  id: string;
  title: string;
  slug: string;
  blocks: BlockData[];
}

export default function SiteEditorPage() {
  const { id } = useParams() as { id: string };
  const [devicePreview, setDevicePreview] = useState<'mobile' | 'tablet' | 'desktop'>('desktop');
  
  // Páginas do evento simulado
  const [pages, setPages] = useState<PageData[]>([
    {
      id: 'p-1',
      title: 'Início (Home)',
      slug: 'home',
      blocks: [
        {
          id: 'b-1',
          type: 'hero',
          title: 'Banner de Boas-vindas',
          content: {
            title: 'Lucas & Julia',
            subtitle: 'Sejam bem-vindos ao site do nosso casamento! Salvem a data: 10 de Outubro de 2026.',
            backgroundImage: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=1200',
          }
        },
        {
          id: 'b-2',
          type: 'text',
          title: 'História do Casal',
          content: {
            title: 'Nossa História',
            body: 'Nos conhecemos na faculdade e, desde então, dividimos sonhos, aventuras e muito amor. Agora, damos o passo mais importante das nossas vidas e ficaremos muito felizes em celebrar com cada um de vocês.',
          }
        },
        {
          id: 'b-3',
          type: 'map',
          title: 'Localização',
          content: {
            title: 'Cerimônia e Recepção',
            address: 'Espaço Província, Nova Lima - MG',
          }
        }
      ]
    },
    {
      id: 'p-2',
      title: 'Lista de Presentes',
      slug: 'presentes',
      blocks: [
        {
          id: 'b-4',
          type: 'gift_list',
          title: 'Mensagem e Presentes',
          content: {
            title: 'Nossa Lista de Presentes Virtuais',
            description: 'Escolha um presente fictício para nos ajudar em nossa nova jornada. O valor é transferido em dinheiro.',
          }
        }
      ]
    },
    {
      id: 'p-3',
      title: 'Confirmar RSVP',
      slug: 'rsvp',
      blocks: [
        {
          id: 'b-5',
          type: 'rsvp_form',
          title: 'Formulário RSVP',
          content: {
            title: 'Confirme sua Presença',
            description: 'Por favor, preencha o formulário para confirmar se você e seus acompanhantes comparecerão.',
          }
        }
      ]
    }
  ]);

  const [activePageIdx, setActivePageIdx] = useState(0);
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>('b-1');
  const [isSaving, setIsSaving] = useState(false);

  const activePage = pages[activePageIdx];
  const selectedBlock = activePage.blocks.find(b => b.id === selectedBlockId);

  // Manipular alteração de valores nos inputs do editor lateral
  const handleBlockContentChange = (field: string, value: any) => {
    setPages(prevPages => {
      const newPages = [...prevPages];
      const page = newPages[activePageIdx];
      const blockIdx = page.blocks.findIndex(b => b.id === selectedBlockId);
      if (blockIdx !== -1) {
        page.blocks[blockIdx].content[field] = value;
      }
      return newPages;
    });
  };

  const handleSave = () => {
    setIsSaving(true);
    toast.info('Salvando alterações do site...');
    setTimeout(() => {
      setIsSaving(false);
      toast.success('Site do evento salvo com sucesso!');
    }, 1000);
  };

  const handleAddBlock = (type: BlockData['type']) => {
    const newBlock: BlockData = {
      id: `b-${Date.now()}`,
      type,
      title: `Nova Seção ${type.toUpperCase()}`,
      content: {
        title: 'Título da Seção',
        body: 'Preencha com o seu texto aqui.',
        description: 'Descrição de exemplo.',
        address: 'Endereço de exemplo.',
      }
    };
    
    setPages(prevPages => {
      const newPages = [...prevPages];
      newPages[activePageIdx].blocks.push(newBlock);
      return newPages;
    });
    setSelectedBlockId(newEventId => newBlock.id);
    toast.success('Bloco adicionado à página!');
  };

  const handleDeleteBlock = (blockId: string) => {
    setPages(prevPages => {
      const newPages = [...prevPages];
      newPages[activePageIdx].blocks = newPages[activePageIdx].blocks.filter(b => b.id !== blockId);
      return newPages;
    });
    setSelectedBlockId(null);
    toast.info('Bloco removido.');
  };

  return (
    <div className="h-[calc(100vh-140px)] flex flex-col -m-6 md:-m-10">
      {/* Topbar do Editor */}
      <div className="flex items-center justify-between px-6 py-4 bg-slate-900 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <Link href="/dashboard/eventos" className="p-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-slate-100">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h2 className="text-sm font-bold text-slate-100">Construtor No-Code</h2>
            <p className="text-xs text-slate-500">Editando Casamento Lucas & Julia</p>
          </div>
        </div>

        {/* Alternador de Responsividade */}
        <div className="hidden sm:flex items-center gap-1.5 p-1 bg-slate-950 rounded-xl border border-slate-800">
          <button 
            onClick={() => setDevicePreview('desktop')}
            className={`p-2 rounded-lg ${devicePreview === 'desktop' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'}`}
          >
            <Monitor className="h-4 w-4" />
          </button>
          <button 
            onClick={() => setDevicePreview('tablet')}
            className={`p-2 rounded-lg ${devicePreview === 'tablet' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'}`}
          >
            <Laptop className="h-4 w-4" />
          </button>
          <button 
            onClick={() => setDevicePreview('mobile')}
            className={`p-2 rounded-lg ${devicePreview === 'mobile' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'}`}
          >
            <Smartphone className="h-4 w-4" />
          </button>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/lucas-e-julia" target="_blank">
            <button className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs flex items-center gap-2 cursor-pointer transition-all">
              <Eye className="h-3.5 w-3.5" />
              Visualizar
            </button>
          </Link>
          <button 
            onClick={handleSave}
            disabled={isSaving}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs flex items-center gap-2 cursor-pointer transition-all shadow-lg shadow-indigo-500/20"
          >
            <Save className="h-3.5 w-3.5" />
            {isSaving ? 'Salvando...' : 'Salvar Site'}
          </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Painel Esquerdo: Páginas e Estrutura de Blocos */}
        <aside className="w-80 border-r border-slate-800 bg-slate-900 flex flex-col overflow-y-auto">
          {/* Páginas */}
          <div className="p-4 border-b border-slate-800">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-1.5">
              <FileText className="h-3.5 w-3.5" />
              Páginas do Site
            </h3>
            <div className="space-y-1">
              {pages.map((p, idx) => (
                <button
                  key={p.id}
                  onClick={() => {
                    setActivePageIdx(idx);
                    setSelectedBlockId(p.blocks[0]?.id || null);
                  }}
                  className={`w-full text-left px-3.5 py-2.5 rounded-lg text-xs font-semibold flex items-center justify-between ${
                    idx === activePageIdx ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' : 'text-slate-400 hover:bg-slate-800'
                  }`}
                >
                  <span>{p.title}</span>
                  <ChevronRight className="h-3.5 w-3.5 opacity-65" />
                </button>
              ))}
            </div>
          </div>

          {/* Estrutura de Blocos na Página Ativa */}
          <div className="p-4 flex-1 flex flex-col">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-1.5">
              <Layers className="h-3.5 w-3.5" />
              Seções da Página
            </h3>

            <div className="space-y-2 flex-1">
              {activePage.blocks.map((block) => (
                <div
                  key={block.id}
                  onClick={() => setSelectedBlockId(block.id)}
                  className={`p-3 rounded-xl border text-left cursor-pointer transition-all flex items-center justify-between group ${
                    selectedBlockId === block.id 
                      ? 'border-indigo-500 bg-slate-850' 
                      : 'border-slate-800 hover:border-slate-700 bg-slate-900/50'
                  }`}
                >
                  <div>
                    <p className="text-xs font-semibold text-slate-200">{block.title}</p>
                    <span className="text-[10px] text-slate-500 uppercase tracking-wider">{block.type}</span>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteBlock(block.id);
                    }}
                    className="p-1 rounded text-slate-500 hover:text-rose-500 hover:bg-rose-500/10 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>

            {/* Adicionar Seção */}
            <div className="mt-4 pt-4 border-t border-slate-800 space-y-2">
              <p className="text-[10px] font-bold text-slate-500 uppercase">Adicionar Seção</p>
              <div className="grid grid-cols-2 gap-1.5">
                <button onClick={() => handleAddBlock('text')} className="p-2 bg-slate-950 border border-slate-800 rounded-lg text-[10px] font-semibold text-slate-400 hover:text-slate-200 hover:border-slate-700">
                  + Texto
                </button>
                <button onClick={() => handleAddBlock('map')} className="p-2 bg-slate-950 border border-slate-800 rounded-lg text-[10px] font-semibold text-slate-400 hover:text-slate-200 hover:border-slate-700">
                  + Mapa
                </button>
              </div>
            </div>
          </div>
        </aside>

        {/* Visualização de Visualizador / Preview Central */}
        <section className="flex-1 bg-slate-950 flex items-center justify-center p-6 border-r border-slate-800 overflow-y-auto">
          <div className={`h-full w-full max-w-5xl transition-all duration-500 border border-slate-800 rounded-2xl bg-white text-slate-900 overflow-y-auto ${
            devicePreview === 'mobile' ? 'max-w-[375px] h-[667px]' : devicePreview === 'tablet' ? 'max-w-[768px] h-[1024px]' : 'w-full h-full'
          }`}>
            {/* Visualização de Sites Simulado */}
            <div className="w-full">
              {activePage.blocks.map((block) => (
                <div 
                  key={block.id} 
                  className={`relative group border-2 ${
                    selectedBlockId === block.id ? 'border-indigo-500' : 'border-transparent hover:border-indigo-500/30'
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedBlockId(block.id);
                  }}
                >
                  {/* Bloco Render: Hero */}
                  {block.type === 'hero' && (
                    <div 
                      className="py-24 px-6 text-center text-white relative bg-cover bg-center"
                      style={{ backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.7)), url(${block.content.backgroundImage})` }}
                    >
                      <h1 className="text-4xl font-extrabold font-serif tracking-tight">{block.content.title}</h1>
                      <p className="text-md text-slate-200 max-w-md mx-auto mt-4">{block.content.subtitle}</p>
                    </div>
                  )}

                  {/* Bloco Render: Text */}
                  {block.type === 'text' && (
                    <div className="py-16 px-8 max-w-xl mx-auto text-center bg-stone-50">
                      <h2 className="text-2xl font-serif font-bold text-slate-900">{block.content.title}</h2>
                      <p className="mt-4 text-sm text-slate-600 leading-relaxed">{block.content.body}</p>
                    </div>
                  )}

                  {/* Bloco Render: Map */}
                  {block.type === 'map' && (
                    <div className="py-12 px-8 text-center bg-white border-t border-slate-100">
                      <h3 className="text-lg font-serif font-bold text-slate-800">{block.content.title}</h3>
                      <p className="text-xs text-slate-500 mt-1 flex items-center justify-center gap-1">
                        <MapPin className="h-3.5 w-3.5 text-indigo-600" />
                        {block.content.address}
                      </p>
                      <div className="h-48 bg-slate-100 rounded-xl mt-4 flex items-center justify-center text-xs text-slate-400">
                        [ Mapa do Google Maps Incorporado ]
                      </div>
                    </div>
                  )}

                  {/* Bloco Render: RSVP */}
                  {block.type === 'rsvp_form' && (
                    <div className="py-16 px-8 bg-indigo-50/50 text-center">
                      <h3 className="text-xl font-serif font-bold text-slate-850">{block.content.title}</h3>
                      <p className="text-xs text-slate-600 mt-1">{block.content.description}</p>
                      <div className="max-w-xs mx-auto mt-6 p-4 bg-white border border-slate-200 rounded-xl space-y-3">
                        <input type="text" placeholder="Seu nome" disabled className="w-full text-xs p-2.5 border border-slate-200 rounded" />
                        <button disabled className="w-full text-xs p-2.5 bg-indigo-600 text-white rounded font-bold">Confirmar</button>
                      </div>
                    </div>
                  )}

                  {/* Bloco Render: Gifts */}
                  {block.type === 'gift_list' && (
                    <div className="py-16 px-8 text-center bg-stone-50">
                      <h3 className="text-xl font-serif font-bold text-slate-850">{block.content.title}</h3>
                      <p className="text-xs text-slate-600 mt-1">{block.content.description}</p>
                      <div className="grid grid-cols-2 gap-4 mt-8 max-w-md mx-auto">
                        <div className="bg-white border border-slate-200 rounded-xl p-3 text-left">
                          <div className="h-28 bg-slate-100 rounded-lg flex items-center justify-center text-xs text-slate-400">[ Foto do Presente ]</div>
                          <h4 className="text-xs font-bold text-slate-800 mt-2">Lua de Mel - Jantar Especial</h4>
                          <p className="text-xs font-bold text-indigo-600 mt-1">R$ 250,00</p>
                        </div>
                        <div className="bg-white border border-slate-200 rounded-xl p-3 text-left">
                          <div className="h-28 bg-slate-100 rounded-lg flex items-center justify-center text-xs text-slate-400">[ Foto do Presente ]</div>
                          <h4 className="text-xs font-bold text-slate-800 mt-2">Cafeteira Nespresso</h4>
                          <p className="text-xs font-bold text-indigo-600 mt-1">R$ 600,00</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Painel Direito: Configurações do Bloco Selecionado */}
        <aside className="w-80 bg-slate-900 border-l border-slate-800 flex flex-col p-5 overflow-y-auto">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-1.5">
            <Settings2 className="h-3.5 w-3.5" />
            Configurar Seção
          </h3>

          {selectedBlock ? (
            <div className="space-y-4">
              <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl">
                <span className="text-[10px] text-indigo-400 font-bold uppercase tracking-wider">Tipo do Bloco</span>
                <p className="text-xs font-semibold text-slate-200 capitalize mt-0.5">{selectedBlock.type}</p>
              </div>

              {selectedBlock.content.title !== undefined && (
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-2">Título principal</label>
                  <input
                    type="text"
                    value={selectedBlock.content.title}
                    onChange={(e) => handleBlockContentChange('title', e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg focus:border-indigo-500 focus:outline-none text-xs text-slate-200"
                  />
                </div>
              )}

              {selectedBlock.content.subtitle !== undefined && (
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-2">Subtítulo / Descrição</label>
                  <textarea
                    value={selectedBlock.content.subtitle}
                    onChange={(e) => handleBlockContentChange('subtitle', e.target.value)}
                    rows={4}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg focus:border-indigo-500 focus:outline-none text-xs text-slate-200 resize-none"
                  />
                </div>
              )}

              {selectedBlock.content.body !== undefined && (
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-2">Texto do Bloco</label>
                  <textarea
                    value={selectedBlock.content.body}
                    onChange={(e) => handleBlockContentChange('body', e.target.value)}
                    rows={6}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg focus:border-indigo-500 focus:outline-none text-xs text-slate-200 resize-none"
                  />
                </div>
              )}

              {selectedBlock.content.backgroundImage !== undefined && (
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-2">URL da Imagem de Fundo</label>
                  <input
                    type="text"
                    value={selectedBlock.content.backgroundImage}
                    onChange={(e) => handleBlockContentChange('backgroundImage', e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg focus:border-indigo-500 focus:outline-none text-xs text-slate-200"
                  />
                </div>
              )}

              {selectedBlock.content.address !== undefined && (
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-2">Endereço do Local</label>
                  <input
                    type="text"
                    value={selectedBlock.content.address}
                    onChange={(e) => handleBlockContentChange('address', e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg focus:border-indigo-500 focus:outline-none text-xs text-slate-200"
                  />
                </div>
              )}
            </div>
          ) : (
            <div className="h-48 flex items-center justify-center text-center text-xs text-slate-500">
              Selecione uma seção na visualização para configurar.
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
