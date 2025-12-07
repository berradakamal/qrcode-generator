'use client';

import { User, Plus, Trash2 } from 'lucide-react';
import type { QRContentData, VCardContent, SocialLink } from '@/types/qr-content';

interface VCardFormProps {
  content: QRContentData;
  onChange: <T extends QRContentData>(updates: Partial<T>) => void;
}

const SOCIAL_PLATFORMS = [
  'LinkedIn',
  'Twitter',
  'Instagram',
  'Facebook',
  'GitHub',
  'YouTube',
  'TikTok',
  'Website',
  'Other',
];

export function VCardForm({ content, onChange }: VCardFormProps) {
  const vcard = content as VCardContent;

  const handleChange = (updates: Partial<VCardContent>) => {
    onChange<VCardContent>(updates);
  };

  const addSocial = () => {
    const newSocial: SocialLink = {
      id: Date.now().toString(),
      platform: 'LinkedIn',
      url: '',
      order: vcard.socials.length,
    };
    handleChange({ socials: [...vcard.socials, newSocial] });
  };

  const updateSocial = (id: string, updates: Partial<SocialLink>) => {
    handleChange({
      socials: vcard.socials.map((s) =>
        s.id === id ? { ...s, ...updates } : s
      ),
    });
  };

  const removeSocial = (id: string) => {
    handleChange({ socials: vcard.socials.filter((s) => s.id !== id) });
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="inline-flex p-3 rounded-xl bg-indigo-50 dark:bg-indigo-950 mb-4">
          <User className="w-8 h-8 text-indigo-500" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Digital Business Card
        </h2>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Share your contact information with one scan
        </p>
      </div>

      <div className="max-w-lg mx-auto space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              First Name *
            </label>
            <input
              type="text"
              value={vcard.firstName}
              onChange={(e) => handleChange({ firstName: e.target.value })}
              placeholder="John"
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Last Name
            </label>
            <input
              type="text"
              value={vcard.lastName}
              onChange={(e) => handleChange({ lastName: e.target.value })}
              placeholder="Doe"
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Company
            </label>
            <input
              type="text"
              value={vcard.company || ''}
              onChange={(e) => handleChange({ company: e.target.value })}
              placeholder="Acme Inc."
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Job Title
            </label>
            <input
              type="text"
              value={vcard.title || ''}
              onChange={(e) => handleChange({ title: e.target.value })}
              placeholder="Software Engineer"
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Email
          </label>
          <input
            type="email"
            value={vcard.email || ''}
            onChange={(e) => handleChange({ email: e.target.value })}
            placeholder="john@example.com"
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Phone
          </label>
          <input
            type="tel"
            value={vcard.phone || ''}
            onChange={(e) => handleChange({ phone: e.target.value })}
            placeholder="+1 (555) 123-4567"
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Website
          </label>
          <input
            type="url"
            value={vcard.website || ''}
            onChange={(e) => handleChange({ website: e.target.value })}
            placeholder="https://example.com"
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Address
          </label>
          <textarea
            value={vcard.address || ''}
            onChange={(e) => handleChange({ address: e.target.value })}
            placeholder="123 Main St, City, State 12345"
            rows={2}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Social Links
            </label>
            <button
              type="button"
              onClick={addSocial}
              className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700"
            >
              <Plus className="w-4 h-4" />
              Add Link
            </button>
          </div>

          <div className="space-y-3">
            {vcard.socials.map((social) => (
              <div key={social.id} className="flex gap-2">
                <select
                  value={social.platform}
                  onChange={(e) =>
                    updateSocial(social.id, { platform: e.target.value })
                  }
                  className="w-32 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
                >
                  {SOCIAL_PLATFORMS.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
                <input
                  type="url"
                  value={social.url}
                  onChange={(e) =>
                    updateSocial(social.id, { url: e.target.value })
                  }
                  placeholder="https://"
                  className="flex-1 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
                />
                <button
                  type="button"
                  onClick={() => removeSocial(social.id)}
                  className="p-2 text-gray-400 hover:text-red-500"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
