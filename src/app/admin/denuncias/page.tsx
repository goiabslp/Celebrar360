'use client';

import React, { useState } from 'react';
import { 
  AlertTriangle, 
  Trash2, 
  CheckCircle2, 
  Eye, 
  AlertOctagon, 
  FileImage, 
  Globe 
} from 'lucide-react';
import { toast } from 'sonner';

interface ReportedPhoto {
  id: string;
  url: string;
  eventTitle: string;
  senderName: string;
  reason: string;
  date: string;
}

interface ReportedSite {
  id: string;
  slug: string;
  title: string;
  reason: string;
  ownerEmail: string;
}

export default function AdminModerationPage() {
  const [reportedPhotos, setReportedPhotos] = useState<ReportedPhoto[]>([
    { id: 'rp-1', url: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&q=80&w=300', eventTitle: 'Casamento Lucas & Julia', senderName: 'Convidado Anônimo', reason: 'Foto contendo publicidade inadequada.', date: '2026-07-19T18:30:00.000Z' },
    { id: 'rp-2', url: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=300', eventTitle: 'Níver Leo 30', senderName: 'Arthur Santos', reason: 'Foto de direitos autorais de terceiros.', date: '2026-07-18T10:15:00.000Z' },
  ]);

  const [reportedSites, setReportedSites] = useState<ReportedSite[]>([
    { id: 'rs-1', slug: 'evento-falso-123', title: 'Rifa Premiada Casamento Fake', reason: 'Fraude financeira utilizando lista de presentes falsa.', ownerEmail: 'estelionatario@exemplo.com' }
  ]);

  // Moderar Foto: Aprovando (ignora denúncia)
  const handleApprovePhoto = (id: string) => {
    setReportedPhotos(reportedPhotos.filter(p => p.id !== id));
    toast.success('Foto aprovada! Denúncia removida da lista.');
  };

  // Moderar Foto: Deletando (remover de forma definitiva)
  const handleDeletePhoto = (id: string) => {
    setReportedPhotos(reportedPhotos.filter(p => p.id !== id));
    toast.success('Foto excluída permanentemente do storage e banco de dados.');
  };

  // Bloquear Site Suspeito
  const handleBlockSite = (id: string) => {
    setReportedSites(reportedSites.filter(s => s.id !== id));
    toast.success('Site de evento bloqueado e suspenso do ar com sucesso!');
  };

  return (
    <div className="space-y-10">
      {/* Cabeçalho */}
      <div>
        <h2 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-slate-50 to-rose-200 bg-clip-text text-transparent flex items-center gap-2">
          <AlertTriangle className="h-7 w-7 text-rose-500" />
          Moderação & Denúncias
        </h2>
        <p className="text-slate-400 mt-1">Modere mídias e bloqueie eventos denunciados por violações de termos.</p>
      </div>

      {/* Seção 1: Fotos Denunciadas */}
      <div className="space-y-4">
        <h3 className="font-bold text-lg text-slate-200 flex items-center gap-2">
          <FileImage className="h-5 w-5 text-rose-400" />
          Fotos Denunciadas da Galeria Coletiva
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {reportedPhotos.map((photo) => (
            <div key={photo.id} className="p-4 bg-slate-900/40 border border-slate-800 rounded-2xl flex gap-4">
              <img
                src={photo.url}
                alt="Reported content"
                className="h-24 w-24 object-cover rounded-xl border border-slate-800 shrink-0"
              />
              <div className="flex-1 min-w-0 flex flex-col justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-200 truncate">{photo.eventTitle}</h4>
                  <p className="text-[10px] text-slate-500 mt-0.5">Enviada por: {photo.senderName}</p>
                  <p className="text-[10px] text-rose-400 font-semibold mt-2 border-l border-rose-500/30 pl-2">
                    Motivo: {photo.reason}
                  </p>
                </div>

                <div className="flex gap-2 mt-4">
                  <button
                    onClick={() => handleApprovePhoto(photo.id)}
                    className="flex-1 py-1.5 rounded-lg bg-emerald-600/10 hover:bg-emerald-600 border border-emerald-500/20 hover:border-transparent text-emerald-400 hover:text-white text-[10px] font-bold flex items-center justify-center gap-1 cursor-pointer transition-colors"
                  >
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    Manter Foto
                  </button>
                  <button
                    onClick={() => handleDeletePhoto(photo.id)}
                    className="p-1.5 rounded-lg bg-rose-600/10 hover:bg-rose-650 border border-rose-500/20 text-rose-400 hover:text-white transition-colors cursor-pointer"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
          {reportedPhotos.length === 0 && (
            <p className="text-xs text-slate-500 py-4">Nenhuma foto pendente de moderação.</p>
          )}
        </div>
      </div>

      {/* Seção 2: Sites Denunciados */}
      <div className="space-y-4 pt-4 border-t border-slate-800">
        <h3 className="font-bold text-lg text-slate-200 flex items-center gap-2">
          <Globe className="h-5 w-5 text-indigo-400" />
          Sites de Eventos Denunciados
        </h3>

        <div className="space-y-3">
          {reportedSites.map((site) => (
            <div key={site.id} className="p-4 bg-slate-900/60 border border-slate-850 rounded-xl hover:border-slate-800 transition-colors flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-slate-200">{site.title}</h4>
                <p className="text-[10px] text-slate-500 mt-0.5">Criador: {site.ownerEmail}</p>
                <p className="text-[10px] text-rose-450 font-medium mt-1">Alerta: {site.reason}</p>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => toast.info(`Acessando site do evento: celebrar360.com/${site.slug}`)}
                  className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                >
                  <Eye className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleBlockSite(site.id)}
                  className="px-3.5 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-[10px] font-bold flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <AlertOctagon className="h-4 w-4" />
                  Bloquear Evento
                </button>
              </div>
            </div>
          ))}
          {reportedSites.length === 0 && (
            <p className="text-xs text-slate-500 py-4">Nenhum site de evento denunciado.</p>
          )}
        </div>
      </div>
    </div>
  );
}
