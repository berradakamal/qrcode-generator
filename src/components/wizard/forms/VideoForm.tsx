'use client';

import { Video } from 'lucide-react';
import type { QRContentData, VideoContent } from '@/types/qr-content';

interface VideoFormProps {
  content: QRContentData;
  onChange: <T extends QRContentData>(updates: Partial<T>) => void;
}

export function VideoForm({ content, onChange }: VideoFormProps) {
  const video = content as VideoContent;

  const handleChange = (updates: Partial<VideoContent>) => {
    onChange<VideoContent>(updates);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="inline-flex p-3 rounded-xl bg-rose-50 dark:bg-rose-950 mb-4">
          <Video className="w-8 h-8 text-rose-500" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Video Player</h2>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Share videos without ads
        </p>
      </div>

      <div className="max-w-md mx-auto space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Video Title
          </label>
          <input
            type="text"
            value={video.title || ''}
            onChange={(e) => handleChange({ title: e.target.value })}
            placeholder="My Video"
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Video Source
          </label>
          <select
            value={video.videoSource}
            onChange={(e) => handleChange({ videoSource: e.target.value as 'upload' | 'youtube' | 'vimeo' })}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          >
            <option value="youtube">YouTube</option>
            <option value="vimeo">Vimeo</option>
            <option value="upload">Direct URL</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Video URL *
          </label>
          <input
            type="url"
            value={video.videoUrl}
            onChange={(e) => handleChange({ videoUrl: e.target.value })}
            placeholder={video.videoSource === 'youtube' ? 'https://youtube.com/watch?v=...' : 'https://vimeo.com/...'}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          />
        </div>

        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="autoplay"
            checked={video.autoplay}
            onChange={(e) => handleChange({ autoplay: e.target.checked })}
            className="w-4 h-4 rounded border-gray-300 text-blue-600"
          />
          <label htmlFor="autoplay" className="text-sm text-gray-700 dark:text-gray-300">
            Autoplay video
          </label>
        </div>
      </div>
    </div>
  );
}
