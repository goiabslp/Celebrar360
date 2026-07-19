'use client';

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import { 
  ArrowLeft, 
  Upload, 
  Trash2, 
  CheckCircle2, 
  XCircle, 
  Image as ImageIcon,
  Eye,
  Filter
} from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

interface PhotoItem {
  id: string;
  url: string;
  sender: 'organizer' | 'guest';
  senderName: string;
  isApproved: boolean;
}

export default function GalleryManagementPage() {
  const { id } = useParams() as { id: string };

  const [photos, setPhotos] = useState<PhotoItem[]>([
    { id: 'p-1', url: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=600', sender: 'organizer', senderName: 'Guilherme (Você)', isApproved: true },
    { id: 'p-2', url: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&q=80&w=600', sender: 'guest', senderName: 'Roberta Silva', isApproved: true },
    { id: 'p-3', url: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&q=80&w=600', sender: 'guest', senderName: 'Marcos Souza', isApproved: false },
  ]);

  const [filter, setFilter] = useState<'all' | 'pending' | 'approved'>('all');

  const handleUpload = () => {
    toast.info('Selecionando imagens... (Upload integrado com Supabase Storage)');
    setTimeout(() => {
      const newPhoto: PhotoItem = {
        id: `p-${Date.now()}`,
        url: 'https://images.unsplash.com/photo-1519225495810-7512c696505a?auto=format&fit=crop&q=80&w=600',
        sender: 'organizer',
        senderName: 'Guilherme (Você)',
        isApproved: true,
      };
      setPhotos([newPhoto, ...photos]);
      toast.success('Imagem enviada com sucesso para o Supabase Storage!');
    }, 1500);
  };

  const handleApprove = (photoId: string) => {
    setPhotos(photos.map(p => p.id === photoId ? { ...p, isApproved: true } : p));
    toast.success('Foto aprovada para a galeria pública!');
  };

  const handleReject = (photoId: string) => {
    setPhotos(photos.filter(p => p.id !== photoId));
    toast.success('Foto recusada e removida.');
  };

  const filteredPhotos = photos.filter(p => {
    if (filter === 'pending') return !p.isApproved;
    if (filter === 'approved') return p.isApproved;
    return true;
  });

  return (
    <div className="space-y-8">
      {/* Cabeçalho */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/dashboard/eventos" className="p-2 rounded-lg hover:bg-slate-900 text-slate-400 hover:text-slate-100 border border-slate-800">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h2 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-slate-50 to-indigo-200 bg-clip-text text-transparent">
              Galeria de Fotos
            </h2>
            <p className="text-slate-400 mt-1">Aprove ou envie fotos do pós-evento para compor o álbum digital do site.</p>
          </div>
        </div>

        <button 
          onClick={handleUpload}
          className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-2 cursor-pointer transition-all shadow-lg shadow-indigo-500/20"
        >
          <Upload className="h-4 w-4" />
          Fazer Upload
        </button>
      </div>

      {/* Filtros */}
      <div className="flex gap-2 p-2 bg-slate-900/20 border border-slate-850 rounded-xl max-w-xs">
        {(['all', 'pending', 'approved'] as const).map((opt) => (
          <button
            key={opt}
            onClick={() => setFilter(opt)}
            className={`flex-1 py-1 px-3 rounded-lg text-xs font-semibold capitalize border transition-all ${
              filter === opt 
                ? 'bg-indigo-600/10 text-indigo-400 border-indigo-500/30' 
                : 'bg-slate-900 border-slate-850 text-slate-400 hover:text-slate-205'
            }`}
          >
            {opt === 'all' ? 'Todas' : opt === 'pending' ? 'Pendentes' : 'Aprovadas'}
          </button>
        ))}
      </div>

      {/* Grade de Fotos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredPhotos.map((photo) => (
          <div key={photo.id} className="relative group rounded-2xl overflow-hidden border border-slate-800 bg-slate-900/40">
            <img
              src={photo.url}
              alt="Foto do Evento"
              className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
            />
            
            {/* Status e Ações */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-4 flex flex-col justify-between">
              <div className="flex justify-between items-start">
                <span className={`inline-block px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider ${
                  photo.isApproved ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
                }`}>
                  {photo.isApproved ? 'Aprovada' : 'Aguardando Aprovação'}
                </span>
              </div>

              <div>
                <p className="text-[10px] text-slate-300">Enviada por:</p>
                <p className="text-xs font-bold text-slate-100">{photo.senderName}</p>

                <div className="flex gap-2 mt-3">
                  {!photo.isApproved && (
                    <button
                      onClick={() => handleApprove(photo.id)}
                      className="flex-1 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-bold flex items-center justify-center gap-1 cursor-pointer transition-colors"
                    >
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      Aprovar
                    </button>
                  )}
                  <button
                    onClick={() => handleReject(photo.id)}
                    className="p-1.5 rounded-lg bg-rose-600/20 hover:bg-rose-600 text-rose-400 hover:text-white border border-rose-500/35 transition-colors cursor-pointer"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
