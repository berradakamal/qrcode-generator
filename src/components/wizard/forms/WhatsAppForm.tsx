'use client';

import { MessageCircle } from 'lucide-react';
import type { QRContentData, WhatsAppContent } from '@/types/qr-content';

interface WhatsAppFormProps {
  content: QRContentData;
  onChange: <T extends QRContentData>(updates: Partial<T>) => void;
}

export function WhatsAppForm({ content, onChange }: WhatsAppFormProps) {
  const whatsapp = content as WhatsAppContent;

  const handleChange = (updates: Partial<WhatsAppContent>) => {
    onChange<WhatsAppContent>(updates);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="inline-flex p-3 rounded-xl bg-green-50 dark:bg-green-950 mb-4">
          <MessageCircle className="w-8 h-8 text-green-500" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          WhatsApp Chat
        </h2>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Start a conversation with a pre-filled message
        </p>
      </div>

      <div className="max-w-md mx-auto space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Phone Number *
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
              +
            </span>
            <input
              type="tel"
              value={whatsapp.phoneNumber}
              onChange={(e) => {
                const value = e.target.value.replace(/[^0-9]/g, '');
                handleChange({ phoneNumber: value });
              }}
              placeholder="1234567890"
              className="w-full pl-8 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <p className="mt-1 text-xs text-gray-500">
            Include country code without + (e.g., 14155552671 for US)
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Pre-filled Message (Optional)
          </label>
          <textarea
            value={whatsapp.prefilledMessage || ''}
            onChange={(e) => handleChange({ prefilledMessage: e.target.value })}
            placeholder="Hi! I scanned your QR code and wanted to reach out..."
            rows={4}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          />
          <p className="mt-1 text-xs text-gray-500">
            This message will be pre-filled when users open WhatsApp
          </p>
        </div>

        {whatsapp.phoneNumber && (
          <div className="p-4 rounded-lg bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800">
            <p className="text-sm text-green-800 dark:text-green-200">
              <strong>Preview:</strong> Users will be redirected to chat with{' '}
              <span className="font-mono">+{whatsapp.phoneNumber}</span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
