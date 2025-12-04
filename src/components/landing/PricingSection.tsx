"use client";

import { CheckCircle2 } from 'lucide-react';

export const PricingSection = () => {
  return (
    <section id="pricing" className="py-24 bg-slate-50 border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-4xl font-extrabold text-slate-900 mb-6" style={{ fontFamily: 'var(--font-space-grotesk)' }}>Fair Pricing Based on Success</h2>
        <p className="text-xl text-slate-600 mb-16 max-w-2xl mx-auto">
          We don&apos;t charge for features. We charge for scale.
          <br />All 21 QR types are included in the free plan.
        </p>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <div className="bg-white p-10 rounded-3xl shadow-xl border-2 border-green-400 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-green-400"></div>
            <div className="absolute top-6 right-6 bg-green-100 text-green-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">Perfect for Starters</div>

            <h3 className="text-2xl font-bold text-slate-900 text-left">Free Forever</h3>
            <div className="text-5xl font-extrabold text-slate-900 mt-4 mb-2 text-left">$0</div>
            <p className="text-slate-500 mb-8 font-medium text-left">No credit card required</p>

            <div className="space-y-4 mb-10 text-left">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-6 h-6 text-green-500 shrink-0" />
                <span className="text-lg font-medium">All 21 QR Types included</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-6 h-6 text-green-500 shrink-0" />
                <span className="text-lg font-medium">Up to <span className="font-bold text-slate-900">5,000 scans</span> / month</span>
              </div>
            </div>
            <button className="w-full py-4 rounded-xl bg-green-500 hover:bg-green-600 text-white font-bold text-lg transition-all shadow-lg shadow-green-500/30">
              Create Free Account
            </button>
          </div>

          <div className="bg-slate-900 p-10 rounded-3xl shadow-2xl border border-slate-800 relative text-white">
            <div className="absolute top-6 right-6 bg-blue-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">For High Volume</div>

            <h3 className="text-2xl font-bold text-white text-left">Professional</h3>
            <div className="text-5xl font-extrabold text-white mt-4 mb-2 text-left">$12<span className="text-xl text-slate-400 font-medium">/mo</span></div>
            <p className="text-slate-400 mb-8 font-medium text-left">Billed annually</p>

            <div className="space-y-4 mb-10 text-left">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-6 h-6 text-blue-400 shrink-0" />
                <span className="text-lg font-medium text-slate-200">Everything in Free</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-6 h-6 text-blue-400 shrink-0" />
                <span className="text-lg font-medium text-slate-200"><span className="font-bold text-white">Unlimited</span> Scans</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-6 h-6 text-blue-400 shrink-0" />
                <span className="text-lg font-medium text-slate-200">White Label (Custom Domain)</span>
              </div>
            </div>
            <button className="w-full py-4 rounded-xl bg-blue-600 hover:bg-blue-500 font-bold text-lg text-white transition-all shadow-lg shadow-blue-900/50">
              Upgrade to Pro
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
