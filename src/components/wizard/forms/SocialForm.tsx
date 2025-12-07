'use client';

import { Share2, Plus, Trash2, GripVertical } from 'lucide-react';
import type { QRContentData, SocialContent, SocialLink } from '@/types/qr-content';

interface SocialFormProps {
  content: QRContentData;
  onChange: <T extends QRContentData>(updates: Partial<T>) => void;
}

const SOCIAL_PLATFORMS = [
  { value: 'instagram', label: 'Instagram', placeholder: 'https://instagram.com/username' },
  { value: 'tiktok', label: 'TikTok', placeholder: 'https://tiktok.com/@username' },
  { value: 'youtube', label: 'YouTube', placeholder: 'https://youtube.com/@channel' },
  { value: 'twitter', label: 'Twitter / X', placeholder: 'https://twitter.com/username' },
  { value: 'linkedin', label: 'LinkedIn', placeholder: 'https://linkedin.com/in/username' },
  { value: 'facebook', label: 'Facebook', placeholder: 'https://facebook.com/page' },
  { value: 'github', label: 'GitHub', placeholder: 'https://github.com/username' },
  { value: 'spotify', label: 'Spotify', placeholder: 'https://open.spotify.com/artist/...' },
  { value: 'website', label: 'Website', placeholder: 'https://example.com' },
  { value: 'email', label: 'Email', placeholder: 'mailto:email@example.com' },
  { value: 'phone', label: 'Phone', placeholder: 'tel:+1234567890' },
  { value: 'other', label: 'Other', placeholder: 'https://' },
];

export function SocialForm({ content, onChange }: SocialFormProps) {
  const social = content as SocialContent;

  const handleChange = (updates: Partial<SocialContent>) => {
    onChange<SocialContent>(updates);
  };

  const addLink = () => {
    const newLink: SocialLink = {
      id: Date.now().toString(),
      platform: 'instagram',
      url: '',
      label: '',
      order: social.links.length,
    };
    handleChange({ links: [...social.links, newLink] });
  };

  const updateLink = (id: string, updates: Partial<SocialLink>) => {
    handleChange({
      links: social.links.map((link) =>
        link.id === id ? { ...link, ...updates } : link
      ),
    });
  };

  const removeLink = (id: string) => {
    handleChange({ links: social.links.filter((link) => link.id !== id) });
  };

  const moveLink = (index: number, direction: 'up' | 'down') => {
    const newLinks = [...social.links];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= newLinks.length) return;
    [newLinks[index], newLinks[newIndex]] = [newLinks[newIndex], newLinks[index]];
    handleChange({ links: newLinks.map((link, i) => ({ ...link, order: i })) });
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="inline-flex p-3 rounded-xl bg-orange-50 dark:bg-orange-950 mb-4">
          <Share2 className="w-8 h-8 text-orange-500" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Social Bio Page
        </h2>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Create a link-in-bio style page with all your profiles
        </p>
      </div>

      <div className="max-w-lg mx-auto space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Display Name *
          </label>
          <input
            type="text"
            value={social.displayName}
            onChange={(e) => handleChange({ displayName: e.target.value })}
            placeholder="Your Name or Brand"
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Bio (Optional)
          </label>
          <textarea
            value={social.bio || ''}
            onChange={(e) => handleChange({ bio: e.target.value })}
            placeholder="A short description about you or your brand"
            rows={2}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Theme
          </label>
          <div className="flex gap-3">
            {(['light', 'dark', 'gradient'] as const).map((theme) => (
              <button
                key={theme}
                type="button"
                onClick={() => handleChange({ theme })}
                className={`
                  flex-1 py-2 px-4 rounded-lg border-2 capitalize font-medium transition-all
                  ${
                    social.theme === theme
                      ? 'border-blue-600 bg-blue-50 dark:bg-blue-950 text-blue-600'
                      : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-gray-300'
                  }
                `}
              >
                {theme}
              </button>
            ))}
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Links
            </label>
            <button
              type="button"
              onClick={addLink}
              className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700"
            >
              <Plus className="w-4 h-4" />
              Add Link
            </button>
          </div>

          <div className="space-y-3">
            {social.links.map((link, index) => {
              const platform = SOCIAL_PLATFORMS.find((p) => p.value === link.platform);
              return (
                <div
                  key={link.id}
                  className="flex gap-2 items-start p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700"
                >
                  <div className="flex flex-col gap-1 pt-2">
                    <button
                      type="button"
                      onClick={() => moveLink(index, 'up')}
                      disabled={index === 0}
                      className="text-gray-400 hover:text-gray-600 disabled:opacity-30"
                    >
                      <GripVertical className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex-1 space-y-2">
                    <select
                      value={link.platform}
                      onChange={(e) => updateLink(link.id, { platform: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
                    >
                      {SOCIAL_PLATFORMS.map((p) => (
                        <option key={p.value} value={p.value}>
                          {p.label}
                        </option>
                      ))}
                    </select>
                    <input
                      type="text"
                      value={link.label || ''}
                      onChange={(e) => updateLink(link.id, { label: e.target.value })}
                      placeholder="Button label (optional)"
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
                    />
                    <input
                      type="url"
                      value={link.url}
                      onChange={(e) => updateLink(link.id, { url: e.target.value })}
                      placeholder={platform?.placeholder || 'https://'}
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeLink(link.id)}
                    className="p-2 text-gray-400 hover:text-red-500"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              );
            })}

            {social.links.length === 0 && (
              <div className="text-center py-8 text-gray-500 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-lg">
                <p>No links added yet</p>
                <button
                  type="button"
                  onClick={addLink}
                  className="mt-2 text-blue-600 hover:text-blue-700 text-sm"
                >
                  Add your first link
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
