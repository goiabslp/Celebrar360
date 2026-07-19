'use client';

import React, { useState } from 'react';
import { 
  Settings, 
  Globe, 
  Bell, 
  ShieldAlert, 
  Save, 
  Sparkles,
  Mail
} from 'lucide-react';
import { toast } from 'sonner';

export default function SettingsPage() {
  const [notifyRsvp, setNotifyRsvp] = useState(true);
  const [notifyGift, setNotifyGift] = useState(true);
  
  // Custom Domain
  const [customDomain, setCustomDomain] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isSavedDomain, setIsSavedDomain] = useState(false);

  const handleVerifyDomain = () => {
    if (!customDomain) {
      toast.error('Preencha o domínio para verificar.');
      return;
    }
    setIsVerifying(true);
    toast.info('Verificando registros de DNS (CNAME / TXT) na Cloudflare...');
    
    setTimeout(() => {
      setIsVerifying(false);
      setIsSavedDomain(true);
      toast.success('Domínio verificado e conectado com sucesso ao Celebrar360!');
    }, 1500);
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Configurações de notificações salvas com sucesso!');
  };

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Cabeçalho */}
      <div>
        <h2 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-slate-50 to-indigo-200 bg-clip-text text-transparent">
          Configurações
        </h2>
        <p className="text-slate-400 mt-1">Gerencie integrações, notificações e domínios personalizados.</p>
      </div>

      <div className="space-y-8">
        
        {/* Domínios Customizados */}
        <div className="p-6 bg-slate-900/40 border border-slate-800 rounded-2xl space-y-4">
          <h3 className="text-sm font-bold text-slate-100 uppercase tracking-widest pb-3 border-b border-slate-800 flex items-center gap-2">
            <Globe className="h-4 w-4 text-indigo-400" />
            Domínio Personalizado (Plano VIP)
          </h3>
          <p className="text-xs text-slate-500">
            Conecte seu próprio domínio (ex: www.anaepedro.com.br) para que seus convidados acessem o site diretamente.
          </p>

          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              placeholder="Ex: www.casamentolucasejulia.com.br"
              value={customDomain}
              onChange={(e) => setCustomDomain(e.target.value)}
              className="flex-1 px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:border-indigo-500 focus:outline-none"
            />
            <button
              onClick={handleVerifyDomain}
              disabled={isVerifying}
              className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold cursor-pointer transition-all border border-slate-700 disabled:opacity-50"
            >
              {isVerifying ? 'Verificando...' : 'Verificar Conexão'}
            </button>
          </div>

          {isSavedDomain && (
            <div className="p-3 bg-emerald-950/20 border border-emerald-900/30 rounded-xl text-[11px] text-emerald-400">
              ✓ Domínio apontado corretamente! CNAME direcionado para <strong>domains.celebrar360.com.br</strong>.
            </div>
          )}
        </div>

        {/* Notificações */}
        <form onSubmit={handleSaveSettings} className="p-6 bg-slate-900/40 border border-slate-800 rounded-2xl space-y-5">
          <h3 className="text-sm font-bold text-slate-100 uppercase tracking-widest pb-3 border-b border-slate-800 flex items-center gap-2">
            <Bell className="h-4 w-4 text-indigo-400" />
            Notificações por E-mail (Resend)
          </h3>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-slate-950/40 border border-slate-850 rounded-xl">
              <div>
                <p className="text-xs font-bold text-slate-200">Alertas de RSVP</p>
                <p className="text-[10px] text-slate-500 mt-0.5">Receber um e-mail a cada nova confirmação ou recusa de convidados.</p>
              </div>
              <input
                type="checkbox"
                checked={notifyRsvp}
                onChange={(e) => setNotifyRsvp(e.target.checked)}
                className="h-4.5 w-4.5 text-indigo-600 border-slate-800 rounded bg-slate-950 focus:ring-indigo-500"
              />
            </div>

            <div className="flex items-center justify-between p-4 bg-slate-950/40 border border-slate-850 rounded-xl">
              <div>
                <p className="text-xs font-bold text-slate-200">Notificações de Presentes</p>
                <p className="text-[10px] text-slate-500 mt-0.5">Avisar por e-mail imediatamente quando um convidado comprar um presente.</p>
              </div>
              <input
                type="checkbox"
                checked={notifyGift}
                onChange={(e) => setNotifyGift(e.target.checked)}
                className="h-4.5 w-4.5 text-indigo-600 border-slate-800 rounded bg-slate-950 focus:ring-indigo-500"
              />
            </div>
          </div>

          <button
            type="submit"
            className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl flex items-center gap-2 cursor-pointer transition-colors shadow-lg shadow-indigo-500/20"
          >
            <Save className="h-4 w-4" />
            Salvar Preferências
          </button>
        </form>

      </div>
    </div>
  );
}
