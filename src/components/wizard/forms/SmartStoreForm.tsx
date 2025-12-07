'use client';

import { ShoppingBag } from 'lucide-react';
import type { QRContentData, SmartStoreContent } from '@/types/qr-content';

interface SmartStoreFormProps {
  content: QRContentData;
  onChange: <T extends QRContentData>(updates: Partial<T>) => void;
}

export function SmartStoreForm({ content, onChange }: SmartStoreFormProps) {
  const store = content as SmartStoreContent;

  const handleChange = (updates: Partial<SmartStoreContent>) => {
    onChange<SmartStoreContent>(updates);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="inline-flex p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950 mb-4">
          <ShoppingBag className="w-8 h-8 text-emerald-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Smart Store</h2>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Link to a Shopify product with buy button
        </p>
      </div>

      <div className="max-w-md mx-auto space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Product URL *
          </label>
          <input
            type="url"
            value={store.productUrl}
            onChange={(e) => handleChange({ productUrl: e.target.value })}
            placeholder="https://yourstore.myshopify.com/products/..."
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Shopify Domain (Optional)
          </label>
          <input
            type="text"
            value={store.shopifyDomain || ''}
            onChange={(e) => handleChange({ shopifyDomain: e.target.value })}
            placeholder="yourstore.myshopify.com"
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Button Text
          </label>
          <input
            type="text"
            value={store.buyButtonConfig.buttonText}
            onChange={(e) => handleChange({ buyButtonConfig: { ...store.buyButtonConfig, buttonText: e.target.value } })}
            placeholder="Add to Cart"
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Button Color
          </label>
          <div className="flex gap-2">
            <input
              type="color"
              value={store.buyButtonConfig.buttonColor}
              onChange={(e) => handleChange({ buyButtonConfig: { ...store.buyButtonConfig, buttonColor: e.target.value } })}
              className="w-12 h-10 rounded border border-gray-300 cursor-pointer"
            />
            <input
              type="text"
              value={store.buyButtonConfig.buttonColor}
              onChange={(e) => handleChange({ buyButtonConfig: { ...store.buyButtonConfig, buttonColor: e.target.value } })}
              className="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-mono"
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="showPrice"
            checked={store.buyButtonConfig.showPrice}
            onChange={(e) => handleChange({ buyButtonConfig: { ...store.buyButtonConfig, showPrice: e.target.checked } })}
            className="w-4 h-4 rounded border-gray-300 text-blue-600"
          />
          <label htmlFor="showPrice" className="text-sm text-gray-700 dark:text-gray-300">
            Show price on landing page
          </label>
        </div>
      </div>
    </div>
  );
}
