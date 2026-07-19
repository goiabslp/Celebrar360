'use client';

import React, { useState } from 'react';
import { 
  User, 
  Mail, 
  Phone, 
  Lock, 
  DollarSign, 
  CheckCircle2, 
  Save 
} from 'lucide-react';
import { toast } from 'sonner';

export default function ProfilePage() {
  const [name, setName] = useState('Guilherme Ramos');
  const [email, setEmail] = useState('guilherme@exemplo.com');
  const [phone, setPhone] = useState('(11) 98888-7777');
  
  // Dados Bancários para Saque dos Presentes
  const [bank, setBank] = useState('341 - Itaú Unibanco S.A.');
  const [agency, setAgency] = useState('1234');
  const [account, setAccount] = useState('56789-0');
  const [pix, setPix] = useState('guilherme@exemplo.com');

  const [isSaving, setIsSaving] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      toast.success('Perfil e chaves de resgate atualizados com sucesso!');
    }, 1000);
  };

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Cabeçalho */}
      <div>
        <h2 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-slate-50 to-indigo-200 bg-clip-text text-transparent">
          Meu Perfil
        </h2>
        <p className="text-slate-400 mt-1">Gerencie suas informações pessoais e credenciais bancárias para recebimento.</p>
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        
        {/* Dados Básicos */}
        <div className="p-6 bg-slate-900/40 border border-slate-800 rounded-2xl space-y-4">
          <h3 className="text-sm font-bold text-slate-100 uppercase tracking-widest pb-3 border-b border-slate-800 flex items-center gap-2">
            <User className="h-4 w-4 text-indigo-400" />
            Dados Cadastrais
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase mb-2">Nome Completo</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:border-indigo-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase mb-2">E-mail de Cadastro</label>
              <input
                type="email"
                disabled
                value={email}
                className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-450 focus:border-indigo-500 focus:outline-none opacity-60"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase mb-2">Telefone</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:border-indigo-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Chaves de Recebimento (Mercado Pago / Banco) */}
        <div className="p-6 bg-slate-900/40 border border-slate-800 rounded-2xl space-y-4">
          <h3 className="text-sm font-bold text-slate-100 uppercase tracking-widest pb-3 border-b border-slate-800 flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-emerald-400" />
            Chaves Bancárias para Resgate
          </h3>
          <p className="text-xs text-slate-500">
            Defina a conta onde os presentes dos convidados serão creditados após a solicitação de resgate.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase mb-2">Instituição Bancária</label>
              <select
                value={bank}
                onChange={(e) => setBank(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:border-indigo-500 focus:outline-none"
              >
                <option value="341 - Itaú Unibanco S.A.">341 - Itaú Unibanco S.A.</option>
                <option value="237 - Banco Bradesco S.A.">237 - Banco Bradesco S.A.</option>
                <option value="033 - Banco Santander (Brasil) S.A.">033 - Banco Santander (Brasil) S.A.</option>
                <option value="104 - Caixa Econômica Federal">104 - Caixa Econômica Federal</option>
                <option value="260 - Nu Pagamentos S.A. (Nubank)">260 - Nu Pagamentos S.A. (Nubank)</option>
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase mb-2">Chave Pix</label>
              <input
                type="text"
                placeholder="CPF, E-mail ou Telefone"
                value={pix}
                onChange={(e) => setPix(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:border-indigo-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase mb-2">Agência</label>
              <input
                type="text"
                value={agency}
                onChange={(e) => setAgency(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:border-indigo-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase mb-2">Número da Conta (com dígito)</label>
              <input
                type="text"
                value={account}
                onChange={(e) => setAccount(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:border-indigo-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Ação de salvar */}
        <button
          type="submit"
          disabled={isSaving}
          className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-700 disabled:opacity-50 text-white font-bold text-xs rounded-xl flex items-center gap-2 cursor-pointer transition-colors shadow-lg shadow-indigo-500/20"
        >
          <Save className="h-4 w-4" />
          {isSaving ? 'Salvando...' : 'Salvar Alterações'}
        </button>

      </form>
    </div>
  );
}
