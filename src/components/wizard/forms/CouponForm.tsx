'use client';

import { Gift } from 'lucide-react';
import type { QRContentData, CouponContent } from '@/types/qr-content';

interface CouponFormProps {
  content: QRContentData;
  onChange: <T extends QRContentData>(updates: Partial<T>) => void;
}

export function CouponForm({ content, onChange }: CouponFormProps) {
  const coupon = content as CouponContent;

  const handleChange = (updates: Partial<CouponContent>) => {
    onChange<CouponContent>(updates);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="inline-flex p-3 rounded-xl bg-red-50 dark:bg-red-950 mb-4">
          <Gift className="w-8 h-8 text-red-500" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Coupon</h2>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Create a discount coupon with optional expiry
        </p>
      </div>

      <div className="max-w-md mx-auto space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Coupon Code *
          </label>
          <input
            type="text"
            value={coupon.code}
            onChange={(e) => handleChange({ code: e.target.value.toUpperCase() })}
            placeholder="SAVE20"
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-mono uppercase"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Discount Type
            </label>
            <select
              value={coupon.discountType}
              onChange={(e) => handleChange({ discountType: e.target.value as 'percentage' | 'fixed' })}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            >
              <option value="percentage">Percentage (%)</option>
              <option value="fixed">Fixed Amount ($)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Value
            </label>
            <input
              type="number"
              value={coupon.discountValue}
              onChange={(e) => handleChange({ discountValue: Number(e.target.value) })}
              min={0}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Description
          </label>
          <input
            type="text"
            value={coupon.description || ''}
            onChange={(e) => handleChange({ description: e.target.value })}
            placeholder="Get 20% off your next purchase"
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Expiry Date (Optional)
          </label>
          <input
            type="date"
            value={coupon.expiryDate?.slice(0, 10) || ''}
            onChange={(e) => handleChange({ expiryDate: e.target.value ? new Date(e.target.value).toISOString() : undefined })}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Terms & Conditions
          </label>
          <textarea
            value={coupon.terms || ''}
            onChange={(e) => handleChange({ terms: e.target.value })}
            placeholder="Cannot be combined with other offers..."
            rows={2}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white resize-none"
          />
        </div>
      </div>
    </div>
  );
}
