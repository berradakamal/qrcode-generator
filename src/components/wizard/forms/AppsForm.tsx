'use client';

import { Box } from 'lucide-react';
import type { QRContentData, AppsContent } from '@/types/qr-content';

interface AppsFormProps {
  content: QRContentData;
  onChange: <T extends QRContentData>(updates: Partial<T>) => void;
}

export function AppsForm({ content, onChange }: AppsFormProps) {
  const apps = content as AppsContent;

  const handleChange = (updates: Partial<AppsContent>) => {
    onChange<AppsContent>(updates);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="inline-flex p-3 rounded-xl bg-purple-50 dark:bg-purple-950 mb-4">
          <Box className="w-8 h-8 text-purple-500" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">App Store Links</h2>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Smart redirect to iOS or Android app store
        </p>
      </div>

      <div className="max-w-md mx-auto space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            App Name *
          </label>
          <input
            type="text"
            value={apps.appName}
            onChange={(e) => handleChange({ appName: e.target.value })}
            placeholder="My App"
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            iOS App Store URL
          </label>
          <input
            type="url"
            value={apps.iosUrl || ''}
            onChange={(e) => handleChange({ iosUrl: e.target.value })}
            placeholder="https://apps.apple.com/app/..."
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Google Play Store URL
          </label>
          <input
            type="url"
            value={apps.androidUrl || ''}
            onChange={(e) => handleChange({ androidUrl: e.target.value })}
            placeholder="https://play.google.com/store/apps/..."
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Fallback URL (for desktop)
          </label>
          <input
            type="url"
            value={apps.fallbackUrl || ''}
            onChange={(e) => handleChange({ fallbackUrl: e.target.value })}
            placeholder="https://yourapp.com"
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          />
        </div>

        <p className="text-xs text-gray-500">
          At least one of iOS or Android URL is required. Users will be redirected based on their device.
        </p>
      </div>
    </div>
  );
}
