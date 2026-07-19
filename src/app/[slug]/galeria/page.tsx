'use client';

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import { Camera, Image as ImageIcon, Plus, Upload, X } from 'lucide-react';
import { toast } from 'sonner';

interface Photo {
  id: string;
  url: string;
  senderName: string;
}

export default function PublicGalleryPage() {
  const { slug } = useParams() as { slug: string };

  const [photos, setPhotos] = useState<Photo[]>([
    { id: '1', url: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=600', senderName: 'Guilherme Ramos' },
    { id: '2', url: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&q=80&w=600', senderName: 'Roberta Silva' },
  ]);

  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [guestName, setGuestName] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleUploadPhoto = (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestName || !photoUrl) {
      toast.error('Preencha todos os campos obrigatórios.');
      return;
    }

    setIsSubmitting(true);
    toast.info('Fazendo upload da imagem para o Supabase Storage...');

    setTimeout(() => {
      const newPhoto: Photo = {
        id: `p-${Date.now()}`,
        url: photoUrl,
        senderName: guestName,
      };

      // Simular envio
      setIsSubmitting(false);
      setIsUploadOpen(false);
      setGuestName('');
      setPhotoUrl('');
      
      toast.success('Sua foto foi enviada para aprovação do casal e logo aparecerá na galeria!');
    }, 1500);
  };

  return (
    <div className="flex-1 bg-stone-50 py-16 px-6">
      <div className="max-w-4xl mx-auto space-y-12">
        {/* Cabeçalho */}
        <div className="text-center space-y-4">
          <Camera className="h-8 w-8 text-rose-500 mx-auto" />
          <h2 className="text-3xl font-serif text-stone-900">Álbum Coletivo</h2>
          <p className="text-stone-600 font-serif italic max-w-md mx-auto text-sm">
            Compartilhe seus cliques conosco! Faça o upload de fotos tiradas durante a festa e eternize esse momento.
          </p>

          <button
            onClick={() => setIsUploadOpen(true)}
            className="mt-6 px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-sans text-xs font-bold flex items-center gap-2 cursor-pointer transition-colors mx-auto shadow-md"
          >
            <Plus className="h-4 w-4" />
            Enviar Foto
          </button>
        </div>

        {/* Grade de Fotos */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {photos.map((photo) => (
            <div 
              key={photo.id} 
              className="bg-white border border-stone-250 rounded-2xl overflow-hidden shadow-sm flex flex-col group relative"
            >
              <img
                src={photo.url}
                alt="Foto compartilhada"
                className="w-full h-64 object-cover"
              />
              <div className="p-3 bg-white border-t border-stone-100 flex items-center justify-between text-[11px] font-sans text-stone-500">
                <span>Enviado por:</span>
                <span className="font-bold text-stone-700">{photo.senderName}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal - Enviar Foto */}
      {isUploadOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm" onClick={() => setIsUploadOpen(false)} />
          <div className="relative w-full max-w-md bg-white border border-stone-200 rounded-2xl p-6 shadow-2xl z-10 font-sans">
            <button 
              onClick={() => setIsUploadOpen(false)}
              className="absolute top-4 right-4 text-stone-400 hover:text-stone-600"
            >
              <X className="h-5 w-5" />
            </button>

            <h3 className="text-lg font-serif font-bold text-stone-900 mb-4 flex items-center gap-2">
              <Camera className="h-5 w-5 text-rose-500" />
              Compartilhar Foto
            </h3>

            <form onSubmit={handleUploadPhoto} className="space-y-4 text-left text-xs">
              <div>
                <label className="block text-[10px] font-bold text-stone-600 uppercase mb-2">Seu Nome *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Roberta Silva"
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-stone-800 focus:border-rose-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-stone-600 uppercase mb-2">Link da Foto (ou selecione arquivo) *</label>
                <input
                  type="text"
                  required
                  placeholder="URL da Imagem ou Caminho do arquivo"
                  value={photoUrl}
                  onChange={(e) => setPhotoUrl(e.target.value)}
                  className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-stone-800 focus:border-rose-500 focus:outline-none"
                />
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setIsUploadOpen(false)}
                  className="flex-1 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 font-bold text-xs text-stone-600 transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                >
                  {isSubmitting ? 'Enviando...' : 'Fazer Upload'}
                  <Upload className="h-3.5 w-3.5" />
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
