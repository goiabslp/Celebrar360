'use client';

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import { 
  Users, 
  Search, 
  CheckCircle2, 
  XCircle, 
  HelpCircle,
  Plus,
  Trash2,
  Download,
  Mail,
  PhoneCall,
  ArrowLeft,
  Sparkles
} from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

interface Guest {
  id: string;
  name: string;
  email: string;
  phone: string;
  guestsCount: number;
  status: 'confirmed' | 'declined' | 'pending';
  notes: string;
}

export default function GuestListPage() {
  const { id } = useParams() as { id: string };

  const [guests, setGuests] = useState<Guest[]>([
    { id: 'g-1', name: 'Ana Souza', email: 'anasouza@exemplo.com', phone: '(11) 98888-7777', guestsCount: 3, status: 'confirmed', notes: 'Restrição alimentar: vegetariana.' },
    { id: 'g-2', name: 'Carlos Eduardo', email: 'carlosedu@exemplo.com', phone: '(31) 97777-6666', guestsCount: 1, status: 'confirmed', notes: 'Chegará um pouco atrasado.' },
    { id: 'g-3', name: 'Mariana Lima', email: 'mari@exemplo.com', phone: '(21) 96666-5555', guestsCount: 0, status: 'declined', notes: 'Infelizmente estarei viajando.' },
    { id: 'g-4', name: 'Rodrigo Pires', email: 'rodrigo@exemplo.com', phone: '(11) 95555-4444', guestsCount: 2, status: 'pending', notes: '' },
  ]);

  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [isAddOpen, setIsAddOpen] = useState(false);

  // Campos do novo convidado
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newGuestsCount, setNewGuestsCount] = useState(1);
  const [newStatus, setNewStatus] = useState<'confirmed' | 'declined' | 'pending'>('pending');

  const filteredGuests = guests.filter(g => {
    const matchesSearch = g.name.toLowerCase().includes(search.toLowerCase()) || 
                          g.email.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = filterStatus === 'all' || g.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleAddGuest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName) {
      toast.error('O nome do convidado é obrigatório.');
      return;
    }

    const newGuest: Guest = {
      id: `g-${Date.now()}`,
      name: newName,
      email: newEmail,
      phone: newPhone,
      guestsCount: newGuestsCount,
      status: newStatus,
      notes: '',
    };

    setGuests([newGuest, ...guests]);
    setIsAddOpen(false);
    
    setNewName('');
    setNewEmail('');
    setNewPhone('');
    setNewGuestsCount(1);
    setNewStatus('pending');

    toast.success('Convidado adicionado à lista com sucesso!');
  };

  const handleDelete = (guestId: string) => {
    setGuests(guests.filter(g => g.id !== guestId));
    toast.success('Convidado removido da lista.');
  };

  // Estatísticas
  const totalConfirmed = guests.reduce((acc, curr) => curr.status === 'confirmed' ? acc + curr.guestsCount : acc, 0);
  const totalDeclined = guests.filter(g => g.status === 'declined').length;
  const totalPending = guests.filter(g => g.status === 'pending').length;

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
              Lista de Convidados & RSVP
            </h2>
            <p className="text-slate-400 mt-1">Gerencie a presença e envie mensagens para os convidados.</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={() => toast.info('Exportando lista de convidados em CSV...')}
            className="px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-850 hover:border-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-2 cursor-pointer transition-all"
          >
            <Download className="h-4 w-4" />
            Exportar CSV
          </button>
          <button 
            onClick={() => setIsAddOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-2 cursor-pointer transition-all shadow-lg shadow-indigo-500/20"
          >
            <Plus className="h-4 w-4" />
            Adicionar Convidado
          </button>
        </div>
      </div>

      {/* Estatísticas de RSVP */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="p-5 bg-slate-900/40 border border-slate-800 rounded-2xl flex items-center gap-4">
          <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl">
            <CheckCircle2 className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Presenças Confirmadas</p>
            <p className="text-2xl font-black text-slate-50 mt-1">{totalConfirmed} pessoas</p>
          </div>
        </div>
        <div className="p-5 bg-slate-900/40 border border-slate-800 rounded-2xl flex items-center gap-4">
          <div className="p-3 bg-rose-500/10 text-rose-400 rounded-xl">
            <XCircle className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Recusaram Convite</p>
            <p className="text-2xl font-black text-slate-50 mt-1">{totalDeclined} convidados</p>
          </div>
        </div>
        <div className="p-5 bg-slate-900/40 border border-slate-800 rounded-2xl flex items-center gap-4">
          <div className="p-3 bg-amber-500/10 text-amber-400 rounded-xl">
            <HelpCircle className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Aguardando RSVP</p>
            <p className="text-2xl font-black text-slate-50 mt-1">{totalPending} convidados</p>
          </div>
        </div>
      </div>

      {/* Filtros e Pesquisa */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-slate-900/20 p-4 border border-slate-850 rounded-2xl">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
          <input
            type="text"
            placeholder="Buscar por nome ou e-mail..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl focus:border-indigo-500 focus:outline-none text-xs text-slate-200"
          />
        </div>

        <div className="flex gap-2 w-full sm:w-auto">
          {['all', 'confirmed', 'declined', 'pending'].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`flex-1 sm:flex-initial px-3.5 py-1.5 rounded-lg text-xs font-semibold capitalize border transition-all ${
                filterStatus === status 
                  ? 'bg-indigo-600/10 text-indigo-400 border-indigo-500/30' 
                  : 'bg-slate-900 border-slate-850 text-slate-400 hover:text-slate-200'
              }`}
            >
              {status === 'all' ? 'Todos' : status === 'confirmed' ? 'Confirmados' : status === 'declined' ? 'Recusados' : 'Pendente'}
            </button>
          ))}
        </div>
      </div>

      {/* Tabela de Convidados */}
      <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/20">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-900/60 border-b border-slate-800 text-slate-400 font-bold uppercase tracking-wider">
              <th className="p-4">Nome</th>
              <th className="p-4">Contato</th>
              <th className="p-4 text-center">Acompanhantes</th>
              <th className="p-4">Status</th>
              <th className="p-4">Observações</th>
              <th className="p-4 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-850">
            {filteredGuests.map((guest) => (
              <tr key={guest.id} className="hover:bg-slate-900/30 transition-colors">
                <td className="p-4 font-bold text-slate-200">{guest.name}</td>
                <td className="p-4 text-slate-400 space-y-1">
                  <div className="flex items-center gap-1.5">
                    <Mail className="h-3 w-3 text-slate-500" />
                    <span>{guest.email || 'Nenhum'}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <PhoneCall className="h-3 w-3 text-slate-500" />
                    <span>{guest.phone || 'Nenhum'}</span>
                  </div>
                </td>
                <td className="p-4 text-center font-semibold text-slate-300">{guest.guestsCount}</td>
                <td className="p-4">
                  <span className={`inline-block px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                    guest.status === 'confirmed' 
                      ? 'bg-emerald-500/10 text-emerald-400' 
                      : guest.status === 'declined' 
                      ? 'bg-rose-500/10 text-rose-400' 
                      : 'bg-amber-500/10 text-amber-400'
                  }`}>
                    {guest.status === 'confirmed' ? 'Confirmado' : guest.status === 'declined' ? 'Recusado' : 'Pendente'}
                  </span>
                </td>
                <td className="p-4 text-slate-400 italic max-w-xs truncate">{guest.notes || 'Nenhuma'}</td>
                <td className="p-4 text-right">
                  <button
                    onClick={() => handleDelete(guest.id)}
                    className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/25 border border-rose-500/20 text-rose-400 transition-colors"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal - Adicionar Convidado */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/85 backdrop-blur-sm" onClick={() => setIsAddOpen(false)} />
          <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl z-10">
            <h3 className="text-lg font-bold text-slate-100 mb-4 flex items-center gap-2">
              <Users className="h-5 w-5 text-indigo-400" />
              Adicionar Convidado Manualmente
            </h3>
            
            <form onSubmit={handleAddGuest} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-2">Nome Completo</label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-2">E-mail</label>
                <input
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-2">Telefone</label>
                  <input
                    type="text"
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:border-indigo-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-2">Acompanhantes</label>
                  <input
                    type="number"
                    min={1}
                    value={newGuestsCount}
                    onChange={(e) => setNewGuestsCount(Number(e.target.value))}
                    className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:border-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-2">Status Inicial</label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value as any)}
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:border-indigo-500 focus:outline-none"
                >
                  <option value="pending">Pendente (Aguardando)</option>
                  <option value="confirmed">Confirmado (Comparecerá)</option>
                  <option value="declined">Recusado (Não comparecerá)</option>
                </select>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-850 hover:bg-slate-800 font-semibold text-xs transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-colors cursor-pointer"
                >
                  Salvar Convidado
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
