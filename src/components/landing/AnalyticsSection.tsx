"use client";

import { useState, useEffect } from 'react';
import { Activity, Globe, MapPin, Cpu, ArrowRight } from 'lucide-react';
import { GlobeViz } from './GlobeViz';

const TOP_LOCATIONS = [
  { city: 'London, UK', scans: '12.5k', pct: 85, color: 'bg-orange-500' },
  { city: 'New York, USA', scans: '8.2k', pct: 60, color: 'bg-blue-500' },
  { city: 'Berlin, DE', scans: '5.1k', pct: 45, color: 'bg-purple-500' },
  { city: 'Tokyo, JP', scans: '3.8k', pct: 30, color: 'bg-emerald-500' },
  { city: 'Paris, FR', scans: '2.2k', pct: 15, color: 'bg-pink-500' },
];

export const AnalyticsSection = () => {
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setAnimated(true), 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section id="analytics" className="py-24 bg-slate-900 text-white relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-600/20 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-500/30 text-blue-300 text-xs font-bold uppercase tracking-wider mb-4">
              <Activity className="w-4 h-4" /> Live Insights
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight" style={{ fontFamily: 'var(--font-space-grotesk)' }}>Analytics that drive growth</h2>
            <p className="text-slate-400 mt-4 text-lg max-w-xl">
              See exactly who is scanning, where they are, and what devices they use.
            </p>
          </div>
          <button className="bg-white text-slate-900 px-6 py-3 rounded-xl font-bold hover:bg-blue-50 transition-colors flex items-center gap-2">
            View Demo Dashboard <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          <div className="lg:col-span-8 bg-slate-950 border border-slate-700 rounded-3xl relative overflow-hidden">
            <div className="absolute top-6 left-6 z-20">
              <h3 className="font-bold text-lg flex items-center gap-2"><Globe className="w-5 h-5 text-blue-400" /> Live Scan Activity</h3>
              <div className="flex gap-2 mt-2">
                <span className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-xs font-bold flex items-center gap-1"><div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div> 124 Active Now</span>
              </div>
            </div>

            <GlobeViz />

          </div>

          <div className="lg:col-span-4 bg-slate-800/50 backdrop-blur-md border border-slate-700 p-8 rounded-3xl">
            <h3 className="font-bold text-lg mb-6 flex items-center gap-2"><MapPin className="w-5 h-5 text-orange-400" /> Top Locations</h3>
            <div className="space-y-6">
              {TOP_LOCATIONS.map((loc, i) => (
                <div key={i} className="group">
                  <div className="flex justify-between text-sm font-medium mb-2">
                    <span className="text-slate-200">{loc.city}</span>
                    <span className="text-slate-400">{loc.scans}</span>
                  </div>
                  <div className="w-full bg-slate-700 h-1.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${loc.color} rounded-full transition-all duration-1000 ease-out`}
                      style={{
                        width: animated ? `${loc.pct}%` : '0%',
                        transitionDelay: `${i * 100}ms`
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-12 bg-slate-800/50 backdrop-blur-md border border-slate-700 p-8 rounded-3xl">
            <div className="flex flex-col md:flex-row justify-between md:items-center mb-8 gap-4">
              <h3 className="font-bold text-lg flex items-center gap-2"><Cpu className="w-5 h-5 text-indigo-400" /> Device Stats</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="p-6 bg-slate-800 rounded-2xl border border-slate-700">
                <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">OS</h4>
                <div className="flex items-center justify-center h-32 gap-8">
                  <div className="text-center">
                    <div className="text-4xl font-extrabold text-white">72%</div>
                    <div className="text-xs text-slate-400 mt-1 uppercase tracking-wider">iOS</div>
                  </div>
                  <div className="h-16 w-px bg-slate-600"></div>
                  <div className="text-center">
                    <div className="text-4xl font-extrabold text-white">28%</div>
                    <div className="text-xs text-slate-400 mt-1 uppercase tracking-wider">Android</div>
                  </div>
                </div>
              </div>

              <div className="p-6 bg-slate-800 rounded-2xl border border-slate-700">
                <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Engagement</h4>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-slate-400 text-sm">Avg. Scan Time</span>
                  <span className="font-bold text-xl">45s</span>
                </div>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-slate-400 text-sm">Conversion Rate</span>
                  <span className="font-bold text-xl text-green-400">12.5%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 text-sm">Returning Visitors</span>
                  <span className="font-bold text-xl">8.2%</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
