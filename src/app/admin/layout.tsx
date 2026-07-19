'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  ShieldAlert, 
  Users, 
  Calendar, 
  DollarSign, 
  Gift, 
  ArrowLeft,
  Sparkles,
  Ticket,
  AlertTriangle
} from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const menuItems = [
    { name: 'Geral & Pagamentos', href: '/admin', icon: DollarSign },
    { name: 'Moderação / Denúncias', href: '/admin/denuncias', icon: AlertTriangle },
    { name: 'Cupons de Desconto', href: '/admin/cupons', icon: Ticket },
  ];

  return (
    <div className="flex h-screen bg-slate-950 text-slate-100 overflow-hidden font-sans">
      {/* Sidebar Administrativo */}
      <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col">
        {/* Logo */}
        <div className="p-6 border-b border-slate-800 flex items-center gap-3">
          <div className="p-2 bg-rose-600 rounded-lg text-white shadow-lg">
            <ShieldAlert className="h-6 w-6" />
          </div>
          <div>
            <h1 className="font-extrabold text-md text-slate-100 leading-none">
              Painel Admin
            </h1>
            <span className="text-[10px] text-rose-400 font-bold uppercase tracking-wider">Celebrar360</span>
          </div>
        </div>

        {/* Links */}
        <nav className="flex-1 px-4 py-6 space-y-1.5">
          {menuItems.map((item) => {
            const active = pathname === item.href;
            return (
              <Link key={item.href} href={item.href} className="block">
                <span className={`flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-xs transition-all ${
                  active 
                    ? 'text-rose-400 bg-rose-500/10' 
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                }`}>
                  <item.icon className="h-4.5 w-4.5" />
                  {item.name}
                </span>
              </Link>
            );
          })}
        </nav>

        {/* Retornar ao Dashboard */}
        <div className="p-4 border-t border-slate-800">
          <Link href="/dashboard">
            <span className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-slate-805 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-slate-100 text-xs font-bold cursor-pointer transition-colors">
              <ArrowLeft className="h-4 w-4" />
              Voltar ao Dashboard
            </span>
          </Link>
        </div>
      </aside>

      {/* Main Panel Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto p-8 bg-slate-950">
          {children}
        </main>
      </div>
    </div>
  );
}
