'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar, 
  User, 
  CreditCard, 
  Settings, 
  DollarSign, 
  BarChart3, 
  Menu, 
  X, 
  Sparkles,
  LogOut,
  ChevronRight
} from 'lucide-react';

interface SidebarItem {
  name: string;
  href: string;
  icon: React.ComponentType<any>;
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const menuItems: SidebarItem[] = [
    { name: 'Início / Analytics', href: '/dashboard', icon: BarChart3 },
    { name: 'Meus Eventos', href: '/dashboard/eventos', icon: Calendar },
    { name: 'Financeiro', href: '/dashboard/financeiro', icon: DollarSign },
    { name: 'Meu Plano', href: '/dashboard/financeiro#planos', icon: CreditCard },
    { name: 'Perfil', href: '/dashboard/perfil', icon: User },
    { name: 'Configurações', href: '/dashboard/configuracoes', icon: Settings },
  ];

  const isActive = (href: string) => {
    if (href === '/dashboard') return pathname === '/dashboard';
    return pathname.startsWith(href);
  };

  return (
    <div className="flex h-screen bg-slate-950 text-slate-100 overflow-hidden font-sans">
      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-slate-900 border-r border-slate-800">
        {/* Logo */}
        <div className="p-6 border-b border-slate-800 flex items-center gap-3">
          <div className="p-2 bg-indigo-600 rounded-lg text-white shadow-lg shadow-indigo-500/30">
            <Sparkles className="h-6 w-6" />
          </div>
          <div>
            <h1 className="font-bold text-lg leading-tight bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Celebrar360
            </h1>
            <span className="text-xs text-slate-500 font-medium">SaaS de Eventos</span>
          </div>
        </div>

        {/* Navegação */}
        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
          {menuItems.map((item) => {
            const active = isActive(item.href);
            return (
              <Link key={item.href} href={item.href} className="block">
                <span className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 relative group font-medium text-sm ${
                  active 
                    ? 'text-indigo-400 bg-indigo-500/10' 
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/50'
                }`}>
                  {active && (
                    <motion.div 
                      layoutId="activeSidebar" 
                      className="absolute left-0 top-2 bottom-2 w-1 bg-indigo-500 rounded-r-lg" 
                    />
                  )}
                  <item.icon className={`h-5 w-5 transition-transform duration-300 group-hover:scale-110 ${active ? 'text-indigo-400' : 'text-slate-400 group-hover:text-slate-100'}`} />
                  {item.name}
                </span>
              </Link>
            );
          })}
        </nav>

        {/* Footer Sidebar / Usuário */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/50">
          <div className="flex items-center justify-between p-2 rounded-xl bg-slate-850">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center font-bold text-sm text-white">
                G
              </div>
              <div className="overflow-hidden">
                <p className="text-sm font-semibold truncate">Guilherme</p>
                <p className="text-xs text-slate-500 truncate">guilherme@exemplo.com</p>
              </div>
            </div>
            <button className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-rose-400 transition-colors">
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Sidebar - Mobile */}
      <AnimatePresence>
        {isMobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileOpen(false)}
              className="fixed inset-0 bg-black/85 z-40 md:hidden"
            />
            {/* Menu container */}
            <motion.aside 
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 bottom-0 left-0 w-72 bg-slate-900 border-r border-slate-800 z-50 p-6 flex flex-col md:hidden"
            >
              <div className="flex items-center justify-between pb-6 border-b border-slate-800 mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-indigo-600 rounded-lg text-white">
                    <Sparkles className="h-5 w-5" />
                  </div>
                  <h1 className="font-bold text-lg bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                    Celebrar360
                  </h1>
                </div>
                <button 
                  onClick={() => setIsMobileOpen(false)}
                  className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-slate-100"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <nav className="flex-1 space-y-2">
                {menuItems.map((item) => {
                  const active = isActive(item.href);
                  return (
                    <Link key={item.href} href={item.href} onClick={() => setIsMobileOpen(false)} className="block">
                      <span className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-all ${
                        active 
                          ? 'text-indigo-400 bg-indigo-500/10' 
                          : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800'
                      }`}>
                        <item.icon className="h-5 w-5" />
                        {item.name}
                      </span>
                    </Link>
                  );
                })}
              </nav>

              <div className="pt-6 border-t border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center font-bold text-white">
                    G
                  </div>
                  <div>
                    <p className="text-sm font-semibold">Guilherme</p>
                    <p className="text-xs text-slate-500">guilherme@exemplo.com</p>
                  </div>
                </div>
                <button className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-rose-400">
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header Mobile / Topbar */}
        <header className="flex md:hidden items-center justify-between px-6 py-4 bg-slate-900 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-1.5 bg-indigo-600 rounded-lg text-white">
              <Sparkles className="h-4 w-4" />
            </div>
            <span className="font-bold text-md">Celebrar360</span>
          </div>
          <button 
            onClick={() => setIsMobileOpen(true)}
            className="p-2 rounded-lg hover:bg-slate-855 border border-slate-800 text-slate-300"
          >
            <Menu className="h-5 w-5" />
          </button>
        </header>

        {/* Router View */}
        <main className="flex-1 overflow-y-auto bg-slate-950 p-6 md:p-10 relative">
          {children}
        </main>
      </div>
    </div>
  );
}
