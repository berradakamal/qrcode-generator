'use client';

import { useState } from 'react';
import { Workflow, Plus, Trash2, Link2 } from 'lucide-react';
import type { QRContentData, N8nContent, ZapierCustomField, WebhookMethod } from '@/types/qr-content';

interface N8nFormProps {
  content: QRContentData;
  onChange: <T extends QRContentData>(updates: Partial<T>) => void;
}

export function N8nForm({ content, onChange }: N8nFormProps) {
  const n8n = content as N8nContent;
  const [newFieldKey, setNewFieldKey] = useState('');
  const [newFieldValue, setNewFieldValue] = useState('');

  const handleChange = (updates: Partial<N8nContent>) => {
    onChange<N8nContent>(updates);
  };

  const addCustomField = () => {
    if (!newFieldKey.trim()) return;
    const newField: ZapierCustomField = {
      key: newFieldKey.trim(),
      value: newFieldValue.trim(),
    };
    handleChange({
      customFields: [...(n8n.customFields || []), newField],
    });
    setNewFieldKey('');
    setNewFieldValue('');
  };

  const removeCustomField = (index: number) => {
    const updated = [...(n8n.customFields || [])];
    updated.splice(index, 1);
    handleChange({ customFields: updated });
  };

  const updateCustomField = (index: number, field: 'key' | 'value', value: string) => {
    const updated = [...(n8n.customFields || [])];
    updated[index] = { ...updated[index], [field]: value };
    handleChange({ customFields: updated });
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="inline-flex p-3 rounded-xl bg-red-50 dark:bg-red-950 mb-4">
          <Workflow className="w-8 h-8 text-red-500" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          n8n Webhook
        </h2>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Trigger n8n workflows when someone scans your QR code
        </p>
      </div>

      <div className="max-w-md mx-auto space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Webhook URL *
          </label>
          <div className="flex gap-2">
            <select
              value={n8n.httpMethod || 'POST'}
              onChange={(e) => handleChange({ httpMethod: e.target.value as WebhookMethod })}
              className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm font-medium"
            >
              <option value="GET">GET</option>
              <option value="POST">POST</option>
              <option value="PUT">PUT</option>
              <option value="PATCH">PATCH</option>
              <option value="DELETE">DELETE</option>
            </select>
            <input
              type="url"
              value={n8n.webhookUrl}
              onChange={(e) => handleChange({ webhookUrl: e.target.value })}
              placeholder="http://localhost:5678/webhook-test/..."
              className="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
          </div>
          <p className="mt-1 text-xs text-gray-500">
            Find this in your n8n webhook trigger node
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
              value={n8n.redirectUrl || ''}
              onChange={(e) => handleChange({ redirectUrl: e.target.value })}
              placeholder="https://yoursite.com/thank-you"
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
          </div>
          <p className="mt-1 text-xs text-gray-500">
            Users will be redirected here after the webhook fires
          </p>
        </div>

        <div className="pt-6 mt-6 border-t border-gray-200 dark:border-gray-700">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Custom Fields (Optional)
          </label>
          <p className="text-xs text-gray-500 mb-4">
            Add custom key-value pairs to send with each scan
          </p>

          {(n8n.customFields || []).length > 0 && (
            <div className="space-y-2 mb-4">
              {n8n.customFields.map((field, index) => (
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
              className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-950 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>

        {n8n.webhookUrl && (
          <div className="p-4 mb-6 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
              <strong>Data sent on each scan:</strong>
            </p>
            <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1 font-mono">
              <li>• timestamp</li>
              <li>• device (mobile/tablet/desktop)</li>
              <li>• os, browser</li>
              <li>• location (country, city)</li>
              <li>• qrCodeId, shortCode</li>
              {(n8n.customFields || []).map((field, i) => (
                <li key={i}>• {field.key}: {field.value}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
