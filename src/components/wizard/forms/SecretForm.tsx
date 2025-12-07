'use client';

import { Lock, Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import type { QRContentData, SecretContent } from '@/types/qr-content';

interface SecretFormProps {
  content: QRContentData;
  onChange: <T extends QRContentData>(updates: Partial<T>) => void;
}

export function SecretForm({ content, onChange }: SecretFormProps) {
  const [showPin, setShowPin] = useState(false);
  const secret = content as SecretContent;

  const handleChange = (updates: Partial<SecretContent>) => {
    onChange<SecretContent>(updates);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="inline-flex p-3 rounded-xl bg-slate-100 dark:bg-slate-800 mb-4">
          <Lock className="w-8 h-8 text-slate-700 dark:text-slate-300" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Secret Message</h2>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          PIN protected hidden content
        </p>
      </div>

      <div className="max-w-md mx-auto space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Secret Message *
          </label>
          <textarea
            value={secret.message}
            onChange={(e) => handleChange({ message: e.target.value })}
            placeholder="Your secret message..."
            rows={4}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white resize-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            PIN Code * (minimum 4 digits)
          </label>
          <div className="relative">
            <input
              type={showPin ? 'text' : 'password'}
              value={secret.pinCode}
              onChange={(e) => {
                const value = e.target.value.replace(/[^0-9]/g, '');
                handleChange({ pinCode: value });
              }}
              placeholder="1234"
              maxLength={8}
              className="w-full px-4 py-2 pr-10 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-mono tracking-widest"
            />
            <button
              type="button"
              onClick={() => setShowPin(!showPin)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            PIN Hint (Optional)
          </label>
          <input
            type="text"
            value={secret.pinHint || ''}
            onChange={(e) => handleChange({ pinHint: e.target.value })}
            placeholder="Hint for the PIN..."
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          />
        </div>
      </div>
    </div>
  );
}
