'use client';

import { Check, QrCode } from 'lucide-react';
import type { QRCodeType } from '@/types/qr-code';
import { QR_TYPE_LABELS } from '@/types/qr-code';

interface PreviewSaveProps {
  type: QRCodeType;
  name: string;
  onNameChange: (name: string) => void;
}

export function PreviewSave({ type, name, onNameChange }: PreviewSaveProps) {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="inline-flex p-3 rounded-xl bg-green-50 dark:bg-green-950 mb-4">
          <Check className="w-8 h-8 text-green-500" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Almost Done!
        </h2>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Give your QR code a name and create it
        </p>
      </div>

      <div className="max-w-md mx-auto space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            QR Code Name *
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => onNameChange(e.target.value)}
            placeholder="e.g., Office WiFi, My Business Card"
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <p className="mt-1 text-xs text-gray-500">
            This helps you identify the QR code in your dashboard
          </p>
        </div>

        <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
          <h3 className="font-medium text-gray-900 dark:text-white mb-3">
            Summary
          </h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Type</span>
              <span className="text-gray-900 dark:text-white font-medium">
                {QR_TYPE_LABELS[type]}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Redirects</span>
              <span className="text-gray-900 dark:text-white font-medium">
                Dynamic (editable)
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Analytics</span>
              <span className="text-gray-900 dark:text-white font-medium">
                Enabled
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 p-4 rounded-lg bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800">
          <QrCode className="w-5 h-5 text-blue-600 flex-shrink-0" />
          <p className="text-sm text-blue-800 dark:text-blue-200">
            Your QR code will be dynamic, meaning you can update where it points to anytime without reprinting.
          </p>
        </div>
      </div>
    </div>
  );
}
