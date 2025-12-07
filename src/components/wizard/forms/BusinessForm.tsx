'use client';

import { MapPin, Plus, Trash2 } from 'lucide-react';
import type { QRContentData, BusinessContent, BusinessHours, SocialLink } from '@/types/qr-content';

interface BusinessFormProps {
  content: QRContentData;
  onChange: <T extends QRContentData>(updates: Partial<T>) => void;
}

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const SOCIAL_PLATFORMS = [
  'Facebook',
  'Instagram',
  'Twitter',
  'LinkedIn',
  'Yelp',
  'Google',
  'TripAdvisor',
  'Website',
];

export function BusinessForm({ content, onChange }: BusinessFormProps) {
  const business = content as BusinessContent;

  const handleChange = (updates: Partial<BusinessContent>) => {
    onChange<BusinessContent>(updates);
  };

  const updateHours = (day: string, updates: Partial<BusinessHours>) => {
    handleChange({
      hours: business.hours.map((h) =>
        h.day === day ? { ...h, ...updates } : h
      ),
    });
  };

  const addService = () => {
    handleChange({ services: [...business.services, ''] });
  };

  const updateService = (index: number, value: string) => {
    const newServices = [...business.services];
    newServices[index] = value;
    handleChange({ services: newServices });
  };

  const removeService = (index: number) => {
    handleChange({ services: business.services.filter((_, i) => i !== index) });
  };

  const addSocial = () => {
    const newSocial: SocialLink = {
      id: Date.now().toString(),
      platform: 'Facebook',
      url: '',
      order: business.socials.length,
    };
    handleChange({ socials: [...business.socials, newSocial] });
  };

  const updateSocial = (id: string, updates: Partial<SocialLink>) => {
    handleChange({
      socials: business.socials.map((s) =>
        s.id === id ? { ...s, ...updates } : s
      ),
    });
  };

  const removeSocial = (id: string) => {
    handleChange({ socials: business.socials.filter((s) => s.id !== id) });
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="inline-flex p-3 rounded-xl bg-blue-50 dark:bg-blue-950 mb-4">
          <MapPin className="w-8 h-8 text-blue-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Business Profile
        </h2>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Share your business info, hours, and location
        </p>
      </div>

      <div className="max-w-2xl mx-auto space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Business Name *
            </label>
            <input
              type="text"
              value={business.name}
              onChange={(e) => handleChange({ name: e.target.value })}
              placeholder="Your Business Name"
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Description
            </label>
            <textarea
              value={business.description || ''}
              onChange={(e) => handleChange({ description: e.target.value })}
              placeholder="Tell customers about your business..."
              rows={2}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Phone
            </label>
            <input
              type="tel"
              value={business.phone || ''}
              onChange={(e) => handleChange({ phone: e.target.value })}
              placeholder="+1 (555) 123-4567"
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Email
            </label>
            <input
              type="email"
              value={business.email || ''}
              onChange={(e) => handleChange({ email: e.target.value })}
              placeholder="contact@business.com"
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Website
            </label>
            <input
              type="url"
              value={business.website || ''}
              onChange={(e) => handleChange({ website: e.target.value })}
              placeholder="https://yourbusiness.com"
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Address
            </label>
            <input
              type="text"
              value={business.address || ''}
              onChange={(e) => handleChange({ address: e.target.value })}
              placeholder="123 Main St, City, State"
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Business Hours
          </label>
          <div className="space-y-2">
            {business.hours.map((hours) => (
              <div
                key={hours.day}
                className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50"
              >
                <span className="w-24 text-sm font-medium text-gray-700 dark:text-gray-300">
                  {hours.day}
                </span>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={!hours.isClosed}
                    onChange={(e) =>
                      updateHours(hours.day, { isClosed: !e.target.checked })
                    }
                    className="w-4 h-4 rounded border-gray-300 text-blue-600"
                  />
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Open
                  </span>
                </label>
                {!hours.isClosed && (
                  <>
                    <input
                      type="time"
                      value={hours.open}
                      onChange={(e) =>
                        updateHours(hours.day, { open: e.target.value })
                      }
                      className="px-2 py-1 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm"
                    />
                    <span className="text-gray-500">to</span>
                    <input
                      type="time"
                      value={hours.close}
                      onChange={(e) =>
                        updateHours(hours.day, { close: e.target.value })
                      }
                      className="px-2 py-1 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm"
                    />
                  </>
                )}
                {hours.isClosed && (
                  <span className="text-sm text-gray-500 italic">Closed</span>
                )}
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Services
            </label>
            <button
              type="button"
              onClick={addService}
              className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700"
            >
              <Plus className="w-4 h-4" />
              Add Service
            </button>
          </div>
          <div className="space-y-2">
            {business.services.map((service, index) => (
              <div key={index} className="flex gap-2">
                <input
                  type="text"
                  value={service}
                  onChange={(e) => updateService(index, e.target.value)}
                  placeholder="Service name"
                  className="flex-1 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
                />
                <button
                  type="button"
                  onClick={() => removeService(index)}
                  className="p-2 text-gray-400 hover:text-red-500"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
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
          <div className="space-y-2">
            {business.socials.map((social) => (
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
