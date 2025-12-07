"use client";

import { QrCode, Globe, FileText, Wifi, ArrowRight } from 'lucide-react';
import type { QRCodeType } from '@/types/qr-code';

interface OnboardingPromptProps {
  onCreateQR: (type?: QRCodeType) => void;
}

const quickStartOptions: Array<{
  icon: typeof Globe;
  title: string;
  description: string;
  color: string;
  type: QRCodeType;
}> = [
  {
    icon: Globe,
    title: 'Website Link',
    description: 'Link to any URL',
    color: 'text-blue-500 bg-blue-500/10',
    type: 'social'
  },
  {
    icon: FileText,
    title: 'PDF Menu',
    description: 'Share documents',
    color: 'text-purple-500 bg-purple-500/10',
    type: 'menu'
  },
  {
    icon: Wifi,
    title: 'WiFi Access',
    description: 'Share network credentials',
    color: 'text-emerald-500 bg-emerald-500/10',
    type: 'wifi'
  }
];

export function OnboardingPrompt({ onCreateQR }: OnboardingPromptProps) {
  return (
    <div className="flex-1 flex items-center justify-center p-8">
      <div className="max-w-2xl text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-blue-500/10 mb-6">
          <QrCode className="w-10 h-10 text-blue-500" />
        </div>

        <h2 className="text-3xl font-bold mb-3" style={{ fontFamily: 'var(--font-space-grotesk)' }}>
          Create your first QR code
        </h2>

        <p className="text-muted-foreground text-lg mb-8 max-w-md mx-auto">
          Generate beautiful, trackable QR codes in seconds. Start by choosing what you want to share.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {quickStartOptions.map((option) => (
            <button
              key={option.title}
              onClick={() => onCreateQR(option.type)}
              className="p-4 rounded-xl border border-border bg-card hover:bg-accent/50 transition-all text-left group"
            >
              <div className={`inline-flex p-2 rounded-lg ${option.color} mb-3`}>
                <option.icon className="w-5 h-5" />
              </div>
              <div className="font-semibold text-sm mb-1">{option.title}</div>
              <div className="text-xs text-muted-foreground">{option.description}</div>
            </button>
          ))}
        </div>

        <button
          onClick={() => onCreateQR()}
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-8 py-3 rounded-xl font-bold text-sm shadow-lg shadow-blue-600/20 transition-all hover:-translate-y-0.5"
        >
          Create QR Code
          <ArrowRight className="w-4 h-4" />
        </button>

        <p className="text-xs text-muted-foreground mt-6">
          Free plan includes up to 5,000 scans per month
        </p>
      </div>
    </div>
  );
}
