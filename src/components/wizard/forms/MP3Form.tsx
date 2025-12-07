'use client';

import { Music } from 'lucide-react';
import type { QRContentData, MP3Content } from '@/types/qr-content';

interface MP3FormProps {
  content: QRContentData;
  onChange: <T extends QRContentData>(updates: Partial<T>) => void;
}

export function MP3Form({ content, onChange }: MP3FormProps) {
  const mp3 = content as MP3Content;

  const handleChange = (updates: Partial<MP3Content>) => {
    onChange<MP3Content>(updates);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="inline-flex p-3 rounded-xl bg-violet-50 dark:bg-violet-950 mb-4">
          <Music className="w-8 h-8 text-violet-500" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">MP3 Player</h2>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Share audio that plays directly in the browser
        </p>
      </div>

      <div className="max-w-md mx-auto space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Track Title *
          </label>
          <input
            type="text"
            value={mp3.title}
            onChange={(e) => handleChange({ title: e.target.value })}
            placeholder="My Track"
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Artist
          </label>
          <input
            type="text"
            value={mp3.artist || ''}
            onChange={(e) => handleChange({ artist: e.target.value })}
            placeholder="Artist Name"
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Audio URL *
          </label>
          <input
            type="url"
            value={mp3.audioUrl}
            onChange={(e) => handleChange({ audioUrl: e.target.value })}
            placeholder="https://example.com/audio.mp3"
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          />
          <p className="mt-1 text-xs text-gray-500">
            File upload coming soon. For now, paste a direct link to your audio file.
          </p>
        </div>
      </div>
    </div>
  );
}
