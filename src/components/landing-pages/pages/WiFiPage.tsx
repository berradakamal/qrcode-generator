'use client';

import { useState } from 'react';
import { Wifi, Copy, Check, Eye, EyeOff } from 'lucide-react';
import type { QRCodeDocument } from '@/types/qr-code';
import type { WiFiContent } from '@/types/qr-content';

interface WiFiPageProps {
  qrCode: QRCodeDocument;
}

export function WiFiPage({ qrCode }: WiFiPageProps) {
  const [copied, setCopied] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const content = qrCode.content as WiFiContent;

  const copyPassword = async () => {
    await navigator.clipboard.writeText(content.password);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-cyan-50 to-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-cyan-500 p-6 text-center">
            <div className="inline-flex p-4 rounded-full bg-white/20 mb-4">
              <Wifi className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white">Connect to Wi-Fi</h1>
          </div>

          <div className="p-6 space-y-4">
            <div className="p-4 rounded-xl bg-gray-50">
              <p className="text-sm text-gray-500 mb-1">Network Name</p>
              <p className="text-lg font-semibold text-gray-900">{content.ssid}</p>
            </div>

            {content.password && (
              <div className="p-4 rounded-xl bg-gray-50">
                <p className="text-sm text-gray-500 mb-1">Password</p>
                <div className="flex items-center justify-between">
                  <p className="text-lg font-mono text-gray-900">
                    {showPassword ? content.password : '••••••••'}
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setShowPassword(!showPassword)}
                      className="p-2 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5 text-gray-500" />
                      ) : (
                        <Eye className="w-5 h-5 text-gray-500" />
                      )}
                    </button>
                    <button
                      onClick={copyPassword}
                      className="p-2 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      {copied ? (
                        <Check className="w-5 h-5 text-green-500" />
                      ) : (
                        <Copy className="w-5 h-5 text-gray-500" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}

            <div className="p-4 rounded-xl bg-gray-50">
              <p className="text-sm text-gray-500 mb-1">Security</p>
              <p className="text-lg font-semibold text-gray-900">
                {content.securityType === 'nopass' ? 'Open Network' : content.securityType}
              </p>
            </div>

            {content.isHidden && (
              <p className="text-sm text-amber-600 text-center">
                This is a hidden network. You may need to manually add it.
              </p>
            )}

            <div className="pt-4">
              <p className="text-xs text-center text-gray-400">
                Go to Settings → Wi-Fi on your device to connect
              </p>
            </div>
          </div>
        </div>

        <p className="text-center text-xs text-gray-400 mt-4">
          Powered by QRG
        </p>
      </div>
    </div>
  );
}
