"use client";

import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import Image from 'next/image';

export const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white/90 backdrop-blur-md shadow-sm border-b border-slate-200 py-3' : 'bg-transparent py-5'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3 cursor-pointer group">
            <Image
              src="/logo.png"
              alt="QRCode Generator Logo"
              width={48}
              height={48}
              className="group-hover:scale-105 transition-transform duration-300"
            />
            <span className="font-extrabold text-2xl tracking-tight text-slate-900" style={{ fontFamily: 'var(--font-space-grotesk)' }}>QRCode <span className="text-blue-600">Generator</span></span>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <a href="#types" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">QR Types</a>
            <a href="#analytics" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">Analytics</a>
            <a href="#pricing" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">Pricing</a>
            <button className="text-sm font-semibold text-slate-900 hover:text-blue-600 transition-colors">Log in</button>
            <button className="bg-slate-900 hover:bg-slate-800 text-white px-5 py-2.5 rounded-full text-sm font-bold transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 transform">
              Create Free QR
            </button>
          </div>

          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};
