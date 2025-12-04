"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Download } from 'lucide-react';

export const HeroSection = () => {
  const [qrText, setQrText] = useState('https://mysite.com');
  const qrColor = '000000';
  const qrBgColor = 'ffffff';

  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(qrText)}&color=${qrColor}&bgcolor=${qrBgColor}&margin=10`;

  return (
    <section className="pt-32 pb-20 lg:pt-48 lg:pb-32 bg-[radial-gradient(ellipse_at_top_left,var(--tw-gradient-stops))] from-blue-50 via-white to-indigo-50 overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-12 lg:gap-20 items-center relative z-10">
        <div className="space-y-8 text-center lg:text-left">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-100 border border-green-200 text-green-800 text-sm font-bold shadow-sm cursor-default"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-600"></span>
            </span>
            Updated with Smart Store & Secret Types
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl lg:text-7xl font-extrabold tracking-tight text-slate-900 leading-[1.1]"
            style={{ fontFamily: 'var(--font-space-grotesk)' }}
          >
            QRCode Generator <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Data-Driven & Free.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed"
          >
            Track scans, retention, and conversions. Create Websites, Menus, Stores, and Hidden Messages. Free up to 5k scans.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 pt-4 justify-center lg:justify-start"
          >
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-full font-bold text-lg transition-all shadow-xl shadow-blue-600/25 flex items-center justify-center gap-2 group hover:-translate-y-1">
              Start Creating <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="relative mx-auto w-full max-w-md lg:max-w-full"
        >
          <div className="absolute inset-0 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-3xl transform rotate-3 blur-sm opacity-20 scale-105"></div>
          <div className="bg-white rounded-2xl shadow-2xl p-6 md:p-8 border border-slate-100 relative overflow-hidden backdrop-blur-xl">
            <div className="space-y-6">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Content</label>
                <input
                  type="text"
                  value={qrText}
                  onChange={(e) => setQrText(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all font-medium text-slate-700"
                  placeholder="https://your-website.com"
                />
              </div>
              <div className="bg-slate-50/50 rounded-2xl p-8 flex flex-col items-center justify-center border border-slate-100 relative">
                <img src={qrImageUrl} alt="QR Preview" className="w-40 h-40 rounded-lg mix-blend-multiply transition-opacity duration-300" />
                <p className="mt-4 text-xs font-medium text-slate-400 flex items-center gap-1"><Download className="w-3 h-3" /> 100% Free Download</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
