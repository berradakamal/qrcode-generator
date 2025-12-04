"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart3, Zap } from 'lucide-react';
import { QR_TYPES } from './data/qr-types';
import { PhoneScreen } from './phone-screens/PhoneScreen';

export const QRTypesSection = () => {
  const [activePreviewId, setActivePreviewId] = useState('smartstore');
  const activeTypeData = QR_TYPES.find(t => t.id === activePreviewId) || QR_TYPES[0];

  return (
    <section id="types" className="py-24 bg-slate-50 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 mb-6 tracking-tight" style={{ fontFamily: 'var(--font-space-grotesk)' }}>Explore 21 Ways to Connect</h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Hover over any card to see the live mobile experience. No clicking required.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-16 items-start">

          <div className="w-full lg:w-1/2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-[750px] overflow-y-auto pr-2 pb-20 custom-scrollbar scroll-smooth">
              {QR_TYPES.map((type) => (
                <div
                  key={type.id}
                  onMouseEnter={() => setActivePreviewId(type.id)}
                  className={`p-6 rounded-2xl border transition-all duration-300 cursor-pointer group ${
                    activePreviewId === type.id
                      ? 'bg-white border-blue-500 shadow-xl scale-[1.02] ring-1 ring-blue-500 z-10'
                      : 'bg-white border-slate-200 hover:border-blue-300 hover:shadow-md'
                  }`}
                >
                  <div className="flex items-center gap-4 mb-3">
                    <div className={`w-10 h-10 rounded-xl ${type.bg} ${type.color} flex items-center justify-center`}>
                      {type.icon}
                    </div>
                    <h3 className={`font-bold text-lg ${activePreviewId === type.id ? 'text-blue-600' : 'text-slate-900'}`}>{type.title}</h3>
                  </div>
                  <p className="text-sm text-slate-500 leading-relaxed mb-3">{type.desc}</p>
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">
                    <Zap className="w-3 h-3" /> {type.feat}
                  </div>
                </div>
              ))}
              <div className="h-20 w-full col-span-full"></div>
            </div>
          </div>

          <div className="hidden lg:flex w-1/2 sticky top-28 h-[800px] items-start justify-center">
            <div className="relative">
              <AnimatePresence mode='wait'>
                <motion.div
                  key={activePreviewId + 'kpi'}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="absolute top-20 -left-20 bg-white p-4 rounded-xl shadow-xl border border-slate-100 z-10 max-w-[180px]"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <BarChart3 className="w-4 h-4 text-green-500" />
                    <span className="text-xs font-bold text-slate-400 uppercase">Top KPI</span>
                  </div>
                  <div className="font-bold text-slate-900">{activeTypeData.kpi}</div>
                </motion.div>
              </AnimatePresence>

              <div className="relative w-[320px] h-[680px] bg-slate-900 rounded-[3.5rem] shadow-2xl border-8 border-slate-900 overflow-hidden ring-1 ring-slate-900/5 select-none transform transition-transform duration-500">
                <PhoneScreen type={activePreviewId} title={activeTypeData.title} />
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-6 bg-slate-900 rounded-b-2xl z-20"></div>
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-1/3 h-1 bg-white/20 rounded-full z-20"></div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
