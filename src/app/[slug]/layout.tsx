'use client';

import React from 'react';
import Link from 'next/link';
import { useParams, usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { Heart, Calendar, MapPin, Gift, CheckSquare, Image as ImageIcon } from 'lucide-react';

export default function PublicEventLayout({ children }: { children: React.ReactNode }) {
  const { slug } = useParams() as { slug: string };
  const pathname = usePathname();

  const navItems = [
    { name: 'Início', href: `/${slug}`, icon: Heart },
    { name: 'Presentes', href: `/${slug}/presentes`, icon: Gift },
    { name: 'RSVP', href: `/${slug}/rsvp`, icon: CheckSquare },
    { name: 'Galeria', href: `/${slug}/galeria`, icon: ImageIcon },
  ];

  const isActive = (href: string) => {
    return pathname === href;
  };

  return (
    <div className="min-h-screen bg-stone-50 text-stone-850 flex flex-col font-serif antialiased">
      {/* Menu / Header */}
      <header className="sticky top-0 bg-white/80 backdrop-blur-md border-b border-stone-200 z-50">
        <div className="max-w-4xl mx-auto px-6 py-4 flex flex-col sm:flex-row justify-between items-center gap-4">
          <Link href={`/${slug}`} className="flex items-center gap-2 text-stone-900 group">
            <Heart className="h-5 w-5 text-rose-500 fill-rose-500 group-hover:scale-110 transition-transform" />
            <span className="font-bold text-lg tracking-wide uppercase">Lucas & Julia</span>
          </Link>

          <nav className="flex gap-1.5 bg-stone-100 p-1 rounded-xl">
            {navItems.map((item) => {
              const active = isActive(item.href);
              return (
                <Link key={item.href} href={item.href}>
                  <span className={`px-4 py-2 rounded-lg text-xs font-sans font-bold transition-all flex items-center gap-1.5 ${
                    active 
                      ? 'bg-white text-rose-600 shadow-sm' 
                      : 'text-stone-500 hover:text-stone-800'
                  }`}>
                    <item.icon className="h-3.5 w-3.5" />
                    {item.name}
                  </span>
                </Link>
              );
            })}
          </nav>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col">
        {children}
      </main>

      {/* Footer */}
      <footer className="py-12 bg-stone-900 text-stone-400 text-center font-sans text-xs border-t border-stone-800">
        <div className="max-w-4xl mx-auto px-6 space-y-3">
          <p className="font-bold text-stone-300">Lucas & Julia — 10 de Outubro de 2026</p>
          <p>© {new Date().getFullYear()} Celebrar360. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
}
