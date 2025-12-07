'use client';

import { Image as ImageIcon } from 'lucide-react';
import type { QRContentData, ImagesContent } from '@/types/qr-content';

interface ImagesFormProps {
  content: QRContentData;
  onChange: <T extends QRContentData>(updates: Partial<T>) => void;
}

export function ImagesForm({ content, onChange }: ImagesFormProps) {
  const images = content as ImagesContent;

  const handleChange = (updates: Partial<ImagesContent>) => {
    onChange<ImagesContent>(updates);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="inline-flex p-3 rounded-xl bg-pink-50 dark:bg-pink-950 mb-4">
          <ImageIcon className="w-8 h-8 text-pink-500" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Image Gallery</h2>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Create a photo gallery or slideshow
        </p>
      </div>

      <div className="max-w-md mx-auto space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Gallery Title
          </label>
          <input
            type="text"
            value={images.title || ''}
            onChange={(e) => handleChange({ title: e.target.value })}
            placeholder="My Photo Gallery"
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Display Mode
          </label>
          <select
            value={images.displayMode}
            onChange={(e) => handleChange({ displayMode: e.target.value as 'grid' | 'slideshow' | 'carousel' })}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          >
            <option value="grid">Grid</option>
            <option value="slideshow">Slideshow</option>
            <option value="carousel">Carousel</option>
          </select>
        </div>

        <div className="p-4 rounded-lg bg-pink-50 dark:bg-pink-950 border border-pink-200 dark:border-pink-800">
          <p className="text-sm text-pink-800 dark:text-pink-200">
            Image upload coming soon. Gallery will be created with the title and display mode.
          </p>
        </div>
      </div>
    </div>
  );
}
