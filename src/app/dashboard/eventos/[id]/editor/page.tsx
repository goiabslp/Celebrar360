'use client';

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  Save, 
  Eye, 
  EyeOff, 
  Layers, 
  Settings2, 
  Plus, 
  Trash2, 
  Copy, 
  ChevronUp, 
  ChevronDown,
  Sparkles,
  MapPin,
  Calendar,
  Gift,
  FileText,
  ChevronRight,
  Smartphone,
  Monitor,
  Laptop,
  Shirt,
  Camera
} from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

interface BlockData {
  id: string;
  type: 'hero' | 'text' | 'map' | 'rsvp_form' | 'gift_list' | 'gallery' | 'dress_code';
  title: string;
  isHidden: boolean;
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
  const [activeTheme, setActiveTheme] = useState<'classic' | 'rustic' | 'modern' | 'vibrante'>('classic');

  // Páginas do evento com os novos blocos da Instrução 06
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
          isHidden: false,
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
          isHidden: false,
          content: {
            title: 'Nossa História',
            body: 'Nos conhecemos na faculdade e, desde então, dividimos sonhos, aventuras e muito amor. Agora, damos o passo mais importante das nossas vidas.',
          }
        },
        {
          id: 'b-dress',
          type: 'dress_code',
          title: 'Dress Code / Vestimenta',
          isHidden: false,
          content: {
            title: 'Código de Vestimenta',
            description: 'Esporte Fino / Passeio Completo. Pedimos que evitem tons de branco e bege para uso exclusivo da noiva.',
          }
        },
        {
          id: 'b-3',
          type: 'map',
          title: 'Localização',
          isHidden: false,
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
          isHidden: false,
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
          isHidden: false,
          content: {
            title: 'Confirme sua Presença',
            description: 'Por favor, preencha o formulário para confirmar se você e seus acompanhantes comparecerão.',
          }
        }
      ]
    },
    {
      id: 'p-4',
      title: 'Álbum de Fotos',
      slug: 'galeria',
      blocks: [
        {
          id: 'b-6',
          type: 'gallery',
          title: 'Galeria do Pós-Evento',
          isHidden: false,
          content: {
            title: 'Álbum Coletivo',
            description: 'Compartilhe suas fotos registradas no dia do nosso casamento diretamente na galeria.',
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

  // Mapeamento visual estético do tema (INSTRUÇÃO 07)
  const themeStyles = {
    classic: { bg: 'bg-white', font: 'font-serif text-amber-950', accent: 'text-amber-700 bg-amber-50 border-amber-250', btn: 'bg-amber-800 hover:bg-amber-900 text-white rounded-md font-serif' },
    rustic: { bg: 'bg-[#faf6f0]', font: 'font-mono text-emerald-950', accent: 'text-emerald-700 bg-emerald-50 border-emerald-250', btn: 'bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-mono' },
    modern: { bg: 'bg-zinc-50', font: 'font-sans text-black', accent: 'text-zinc-800 bg-zinc-150 border-zinc-300', btn: 'bg-black hover:bg-zinc-900 text-white rounded-none font-sans font-bold' },
    vibrante: { bg: 'bg-pink-50/20', font: 'font-sans text-pink-950', accent: 'text-pink-600 bg-pink-50 border-pink-200', btn: 'bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white rounded-full font-bold' },
  };

  const handleBlockContentChange = (field: string, value: any) => {
    setPages(prevPages => {
      const newPages = JSON.parse(JSON.stringify(prevPages));
      const page = newPages[activePageIdx];
      const blockIdx = page.blocks.findIndex((b: BlockData) => b.id === selectedBlockId);
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

  // Reordenação de Blocos (Instrução 06)
  const moveBlock = (index: number, direction: 'up' | 'down') => {
    setPages(prevPages => {
      const newPages = JSON.parse(JSON.stringify(prevPages));
      const page = newPages[activePageIdx];
      const targetIndex = direction === 'up' ? index - 1 : index + 1;
      
      if (targetIndex >= 0 && targetIndex < page.blocks.length) {
        const temp = page.blocks[index];
        page.blocks[index] = page.blocks[targetIndex];
        page.blocks[targetIndex] = temp;
      }
      return newPages;
    });
    toast.info('Ordem dos blocos atualizada!');
  };

  // Duplicar Bloco (Instrução 06)
  const duplicateBlock = (index: number) => {
    setPages(prevPages => {
      const newPages = JSON.parse(JSON.stringify(prevPages));
      const page = newPages[activePageIdx];
      const blockToDuplicate = page.blocks[index];
      
      const newBlock: BlockData = {
        ...JSON.parse(JSON.stringify(blockToDuplicate)),
        id: `b-${Date.now()}`,
        title: `${blockToDuplicate.title} (Cópia)`
      };
      
      page.blocks.splice(index + 1, 0, newBlock);
      return newPages;
    });
    toast.success('Bloco duplicado com sucesso!');
  };

  // Ocultar/Exibir Bloco (Instrução 06)
  const toggleHideBlock = (index: number) => {
    setPages(prevPages => {
      const newPages = JSON.parse(JSON.stringify(prevPages));
      const page = newPages[activePageIdx];
      page.blocks[index].isHidden = !page.blocks[index].isHidden;
      return newPages;
    });
    toast.info('Visibilidade do bloco alterada!');
  };

  // Excluir Bloco (Instrução 06)
  const deleteBlock = (index: number) => {
    setPages(prevPages => {
      const newPages = JSON.parse(JSON.stringify(prevPages));
      const page = newPages[activePageIdx];
      page.blocks.splice(index, 1);
      return newPages;
    });
    setSelectedBlockId(null);
    toast.success('Bloco excluído da página.');
  };

  const handleAddBlock = (type: BlockData['type']) => {
    const newBlock: BlockData = {
      id: `b-${Date.now()}`,
      type,
      title: `Nova Seção ${type.toUpperCase()}`,
      isHidden: false,
      content: {
        title: 'Título da Seção',
        body: 'Preencha com o seu texto aqui.',
        description: 'Descrição de exemplo.',
        address: 'Endereço de exemplo.',
      }
    };
    
    setPages(prevPages => {
      const newPages = JSON.parse(JSON.stringify(prevPages));
      newPages[activePageIdx].blocks.push(newBlock);
      return newPages;
    });
    setSelectedBlockId(newBlock.id);
    toast.success('Bloco adicionado à página!');
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
            <h2 className="text-sm font-bold text-slate-100">Canva-like Editor</h2>
            <p className="text-xs text-slate-500">Editando Casamento Lucas & Julia</p>
          </div>
        </div>

        {/* Sistema de Temas Dinâmicos (Instrução 07) */}
        <div className="hidden lg:flex items-center gap-2 p-1.5 bg-slate-950 border border-slate-800 rounded-xl">
          <span className="text-[10px] font-bold text-slate-400 px-2 uppercase">Tema:</span>
          {(['classic', 'rustic', 'modern', 'vibrante'] as const).map((theme) => (
            <button
              key={theme}
              onClick={() => {
                setActiveTheme(theme);
                toast.success(`Tema alterado para ${theme.toUpperCase()} (dados preservados!)`);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all ${
                activeTheme === theme 
                  ? 'bg-indigo-600 text-white' 
                  : 'text-slate-450 hover:text-slate-200'
              }`}
            >
              {theme}
            </button>
          ))}
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
        {/* Painel Esquerdo: Páginas e Estrutura de Blocos (Canva-style) */}
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

          {/* Estrutura de Blocos na Página Ativa com Ações Canva-like (Instrução 06) */}
          <div className="p-4 flex-1 flex flex-col">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-1.5">
              <Layers className="h-3.5 w-3.5" />
              Estrutura de Seções
            </h3>

            <div className="space-y-2 flex-1">
              {activePage.blocks.map((block, idx) => (
                <div
                  key={block.id}
                  onClick={() => setSelectedBlockId(block.id)}
                  className={`p-3 rounded-xl border text-left cursor-pointer transition-all flex flex-col gap-2.5 ${
                    selectedBlockId === block.id 
                      ? 'border-indigo-500 bg-slate-850' 
                      : 'border-slate-800 hover:border-slate-700 bg-slate-900/50'
                  } ${block.isHidden ? 'opacity-55' : ''}`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-semibold text-slate-200">{block.title}</p>
                      <span className="text-[10px] text-slate-500 uppercase tracking-wider">{block.type}</span>
                    </div>
                    {block.isHidden && <EyeOff className="h-3.5 w-3.5 text-rose-400" />}
                  </div>

                  {/* Ações Rápidas por Bloco (Reordenar, Duplicar, Ocultar, Excluir) */}
                  <div className="flex gap-1 pt-1.5 border-t border-slate-800/60 justify-end">
                    <button
                      onClick={(e) => { e.stopPropagation(); moveBlock(idx, 'up'); }}
                      disabled={idx === 0}
                      className="p-1.5 rounded hover:bg-slate-800 text-slate-400 hover:text-slate-100 disabled:opacity-30"
                    >
                      <ChevronUp className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); moveBlock(idx, 'down'); }}
                      disabled={idx === activePage.blocks.length - 1}
                      className="p-1.5 rounded hover:bg-slate-800 text-slate-400 hover:text-slate-100 disabled:opacity-30"
                    >
                      <ChevronDown className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); duplicateBlock(idx); }}
                      className="p-1.5 rounded hover:bg-slate-800 text-slate-400 hover:text-slate-100"
                    >
                      <Copy className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); toggleHideBlock(idx); }}
                      className="p-1.5 rounded hover:bg-slate-800 text-slate-400 hover:text-slate-100"
                    >
                      {block.isHidden ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); deleteBlock(idx); }}
                      className="p-1.5 rounded hover:bg-slate-800 text-slate-400 hover:text-rose-500"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Adicionar Seção */}
            <div className="mt-4 pt-4 border-t border-slate-800 space-y-2">
              <p className="text-[10px] font-bold text-slate-500 uppercase">Adicionar Nova Seção</p>
              <div className="grid grid-cols-2 gap-1.5">
                <button onClick={() => handleAddBlock('text')} className="p-2 bg-slate-950 border border-slate-800 rounded-lg text-[10px] font-semibold text-slate-400 hover:text-slate-200 hover:border-slate-700">
                  + Texto
                </button>
                <button onClick={() => handleAddBlock('dress_code')} className="p-2 bg-slate-950 border border-slate-800 rounded-lg text-[10px] font-semibold text-slate-400 hover:text-slate-200 hover:border-slate-700">
                  + Dress Code
                </button>
              </div>
            </div>
          </div>
        </aside>

        {/* Preview Central com Temas (Instrução 07) */}
        <section className="flex-1 bg-slate-950 flex items-center justify-center p-6 border-r border-slate-800 overflow-y-auto">
          <div className={`h-full w-full max-w-5xl transition-all duration-500 border border-slate-800 rounded-2xl overflow-y-auto ${
            devicePreview === 'mobile' ? 'max-w-[375px] h-[667px]' : devicePreview === 'tablet' ? 'max-w-[768px] h-[1024px]' : 'w-full h-full'
          } ${themeStyles[activeTheme].bg}`}>
            
            <div className={`w-full ${themeStyles[activeTheme].font}`}>
              {activePage.blocks.map((block) => {
                if (block.isHidden) {
                  return (
                    <div key={block.id} className="p-4 bg-rose-500/5 border-y border-dashed border-rose-500/20 text-center text-rose-400 text-[10px] font-bold flex items-center justify-center gap-1.5">
                      <EyeOff className="h-3.5 w-3.5" />
                      <span>{block.title} (Seção Ocultada do Público)</span>
                    </div>
                  );
                }
                
                return (
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
                        <h1 className="text-4xl font-extrabold tracking-tight">{block.content.title}</h1>
                        <p className="text-md text-slate-200 max-w-md mx-auto mt-4">{block.content.subtitle}</p>
                      </div>
                    )}

                    {/* Bloco Render: Text */}
                    {block.type === 'text' && (
                      <div className="py-16 px-8 max-w-xl mx-auto text-center">
                        <h2 className="text-2xl font-bold">{block.content.title}</h2>
                        <p className="mt-4 text-sm leading-relaxed opacity-80">{block.content.body}</p>
                      </div>
                    )}

                    {/* Bloco Render: Dress Code (Instrução 06) */}
                    {block.type === 'dress_code' && (
                      <div className={`py-12 px-8 text-center max-w-md mx-auto my-6 border rounded-2xl p-6 ${themeStyles[activeTheme].accent}`}>
                        <Shirt className="h-7 w-7 mx-auto mb-3" />
                        <h3 className="text-md font-bold">{block.content.title}</h3>
                        <p className="text-xs mt-2 leading-relaxed opacity-90">{block.content.description}</p>
                      </div>
                    )}

                    {/* Bloco Render: Map */}
                    {block.type === 'map' && (
                      <div className="py-12 px-8 text-center border-t border-slate-100 bg-white/20">
                        <h3 className="text-lg font-bold">{block.content.title}</h3>
                        <p className="text-xs opacity-75 mt-1 flex items-center justify-center gap-1">
                          <MapPin className="h-3.5 w-3.5 text-indigo-650" />
                          {block.content.address}
                        </p>
                        <div className="h-40 bg-black/5 rounded-xl mt-4 flex items-center justify-center text-xs text-slate-400">
                          [ Google Maps ]
                        </div>
                      </div>
                    )}

                    {/* Bloco Render: RSVP */}
                    {block.type === 'rsvp_form' && (
                      <div className="py-16 px-8 text-center">
                        <h3 className="text-xl font-bold">{block.content.title}</h3>
                        <p className="text-xs opacity-75 mt-1">{block.content.description}</p>
                        <div className="max-w-xs mx-auto mt-6 p-4 bg-white/40 border border-slate-205 rounded-xl space-y-3">
                          <input type="text" placeholder="Seu nome" disabled className="w-full text-xs p-2.5 border border-slate-200 rounded" />
                          <button disabled className={`w-full text-xs p-2.5 font-bold ${themeStyles[activeTheme].btn}`}>Confirmar</button>
                        </div>
                      </div>
                    )}

                    {/* Bloco Render: Gifts */}
                    {block.type === 'gift_list' && (
                      <div className="py-16 px-8 text-center">
                        <h3 className="text-xl font-bold">{block.content.title}</h3>
                        <p className="text-xs opacity-75 mt-1">{block.content.description}</p>
                        <div className="grid grid-cols-2 gap-4 mt-8 max-w-md mx-auto">
                          <div className="bg-white border border-slate-200 rounded-xl p-3 text-left">
                            <h4 className="text-xs font-bold text-slate-800">Lua de Mel - Jantar</h4>
                            <button className={`w-full mt-2.5 py-1.5 text-[10px] font-bold ${themeStyles[activeTheme].btn}`}>Presentear</button>
                          </div>
                          <div className="bg-white border border-slate-200 rounded-xl p-3 text-left">
                            <h4 className="text-xs font-bold text-slate-800">Cafeteira Nespresso</h4>
                            <button className={`w-full mt-2.5 py-1.5 text-[10px] font-bold ${themeStyles[activeTheme].btn}`}>Presentear</button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Painel Direito: Configurações do Bloco */}
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

              {selectedBlock.content.description !== undefined && (
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-2">Descrição Curta</label>
                  <textarea
                    value={selectedBlock.content.description}
                    onChange={(e) => handleBlockContentChange('description', e.target.value)}
                    rows={4}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg focus:border-indigo-500 focus:outline-none text-xs text-slate-200 resize-none"
                  />
                </div>
              )}

              {selectedBlock.content.body !== undefined && (
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-2">Texto da Seção</label>
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
