'use client';

import { Utensils } from 'lucide-react';
import type { QRContentData, MenuContent } from '@/types/qr-content';

interface MenuFormProps {
  content: QRContentData;
  onChange: <T extends QRContentData>(updates: Partial<T>) => void;
}

export function MenuForm({ content, onChange }: MenuFormProps) {
  const menu = content as MenuContent;

  const handleChange = (updates: Partial<MenuContent>) => {
    onChange<MenuContent>(updates);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="inline-flex p-3 rounded-xl bg-amber-50 dark:bg-amber-950 mb-4">
          <Utensils className="w-8 h-8 text-amber-500" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Digital Menu
        </h2>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Create a beautiful digital menu for your restaurant
        </p>
      </div>

      <div className="max-w-md mx-auto space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Restaurant Name *
          </label>
          <input
            type="text"
            value={menu.restaurantName}
            onChange={(e) => handleChange({ restaurantName: e.target.value })}
            placeholder="Your Restaurant Name"
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Currency
          </label>
          <select
            value={menu.currency}
            onChange={(e) => handleChange({ currency: e.target.value })}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          >
            <option value="USD">USD ($)</option>
            <option value="EUR">EUR (€)</option>
            <option value="GBP">GBP (£)</option>
            <option value="CAD">CAD ($)</option>
            <option value="AUD">AUD ($)</option>
          </select>
        </div>

        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="allergens"
            checked={menu.showAllergens}
            onChange={(e) => handleChange({ showAllergens: e.target.checked })}
            className="w-4 h-4 rounded border-gray-300 text-blue-600"
          />
          <label htmlFor="allergens" className="text-sm text-gray-700 dark:text-gray-300">
            Show allergen information
          </label>
        </div>

        <div className="p-4 rounded-lg bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800">
          <p className="text-sm text-amber-800 dark:text-amber-200">
            Full menu editor coming soon. For now, the menu page will be created with the restaurant name.
          </p>
        </div>
      </div>
    </div>
  );
}
