'use client';

import { QrCode } from 'lucide-react';
import type { QRCodeDocument } from '@/types/qr-code';
import { QR_TYPE_LABELS } from '@/types/qr-code';

interface GenericPageProps {
  qrCode: QRCodeDocument;
}

export function GenericPage({ qrCode }: GenericPageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center p-4">
      <div className="w-full max-w-md text-center">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="inline-flex p-4 rounded-full bg-blue-50 mb-6">
            <QrCode className="w-10 h-10 text-blue-500" />
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-2">{qrCode.name}</h1>
          <p className="text-gray-500 mb-6">
            {QR_TYPE_LABELS[qrCode.type]} QR Code
          </p>

          <div className="p-4 rounded-xl bg-gray-50 text-left">
            <p className="text-sm text-gray-500 mb-2">Content Preview</p>
            <pre className="text-xs text-gray-700 overflow-auto max-h-48">
              {JSON.stringify(qrCode.content, null, 2)}
            </pre>
          </div>

          <p className="text-xs text-gray-400 mt-6">
            Full landing page for this type coming soon
          </p>
        </div>

        <p className="text-center text-xs text-gray-400 mt-4">
          Powered by QRG
        </p>
      </div>
    </div>
  );
}
