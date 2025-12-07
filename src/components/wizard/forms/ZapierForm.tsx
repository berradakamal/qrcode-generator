'use client';

import { useState } from 'react';
import { Zap, Plus, Trash2, Link2 } from 'lucide-react';
import type { QRContentData, ZapierContent, ZapierCustomField, WebhookMethod } from '@/types/qr-content';

interface ZapierFormProps {
  content: QRContentData;
  onChange: <T extends QRContentData>(updates: Partial<T>) => void;
}

export function ZapierForm({ content, onChange }: ZapierFormProps) {
  const zapier = content as ZapierContent;
  const [newFieldKey, setNewFieldKey] = useState('');
  const [newFieldValue, setNewFieldValue] = useState('');

  const handleChange = (updates: Partial<ZapierContent>) => {
    onChange<ZapierContent>(updates);
  };

  const addCustomField = () => {
    if (!newFieldKey.trim()) return;
    const newField: ZapierCustomField = {
      key: newFieldKey.trim(),
      value: newFieldValue.trim(),
    };
    handleChange({
      customFields: [...(zapier.customFields || []), newField],
    });
    setNewFieldKey('');
    setNewFieldValue('');
  };

  const removeCustomField = (index: number) => {
    const updated = [...(zapier.customFields || [])];
    updated.splice(index, 1);
    handleChange({ customFields: updated });
  };

  const updateCustomField = (index: number, field: 'key' | 'value', value: string) => {
    const updated = [...(zapier.customFields || [])];
    updated[index] = { ...updated[index], [field]: value };
    handleChange({ customFields: updated });
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="inline-flex p-3 rounded-xl bg-orange-50 dark:bg-orange-950 mb-4">
          <Zap className="w-8 h-8 text-orange-500" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Zapier Webhook
        </h2>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Trigger automations when someone scans your QR code
        </p>
      </div>

      <div className="max-w-md mx-auto space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Webhook URL *
          </label>
          <div className="flex gap-2">
            <select
              value={zapier.httpMethod || 'POST'}
              onChange={(e) => handleChange({ httpMethod: e.target.value as WebhookMethod })}
              className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm font-medium"
            >
              <option value="GET">GET</option>
              <option value="POST">POST</option>
              <option value="PUT">PUT</option>
              <option value="PATCH">PATCH</option>
              <option value="DELETE">DELETE</option>
            </select>
            <input
              type="url"
              value={zapier.webhookUrl}
              onChange={(e) => handleChange({ webhookUrl: e.target.value })}
              placeholder="https://hooks.zapier.com/hooks/catch/..."
              className="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>
          <p className="mt-1 text-xs text-gray-500">
            Find this in your Zapier webhook trigger configuration
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Redirect URL (Optional)
          </label>
          <div className="relative">
            <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="url"
              value={zapier.redirectUrl || ''}
              onChange={(e) => handleChange({ redirectUrl: e.target.value })}
              placeholder="https://yoursite.com/thank-you"
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>
          <p className="mt-1 text-xs text-gray-500">
            Users will be redirected here after the webhook fires
          </p>
        </div>

        <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Custom Fields (Optional)
          </label>
          <p className="text-xs text-gray-500 mb-4">
            Add custom key-value pairs to send with each scan
          </p>

          {(zapier.customFields || []).length > 0 && (
            <div className="space-y-2 mb-4">
              {zapier.customFields.map((field, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={field.key}
                    onChange={(e) => updateCustomField(index, 'key', e.target.value)}
                    placeholder="Key"
                    className="flex-1 px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  />
                  <input
                    type="text"
                    value={field.value}
                    onChange={(e) => updateCustomField(index, 'value', e.target.value)}
                    placeholder="Value"
                    className="flex-1 px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  />
                  <button
                    onClick={() => removeCustomField(index)}
                    className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-950 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="flex gap-2">
            <input
              type="text"
              value={newFieldKey}
              onChange={(e) => setNewFieldKey(e.target.value)}
              placeholder="Key"
              className="flex-1 px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            />
            <input
              type="text"
              value={newFieldValue}
              onChange={(e) => setNewFieldValue(e.target.value)}
              placeholder="Value"
              className="flex-1 px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            />
            <button
              onClick={addCustomField}
              disabled={!newFieldKey.trim()}
              className="p-2 text-orange-500 hover:bg-orange-50 dark:hover:bg-orange-950 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>

        {zapier.webhookUrl && (
          <div className="p-4 rounded-lg bg-orange-50 dark:bg-orange-950 border border-orange-200 dark:border-orange-800">
            <p className="text-sm text-orange-800 dark:text-orange-200 mb-2">
              <strong>Data sent on each scan:</strong>
            </p>
            <ul className="text-xs text-orange-700 dark:text-orange-300 space-y-1 font-mono">
              <li>• timestamp</li>
              <li>• device (mobile/tablet/desktop)</li>
              <li>• os, browser</li>
              <li>• location (country, city)</li>
              <li>• qrCodeId, shortCode</li>
              {(zapier.customFields || []).map((field, i) => (
                <li key={i}>• {field.key}: {field.value}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
