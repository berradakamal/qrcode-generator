'use client';

import { MessageSquare } from 'lucide-react';
import type { QRContentData, FeedbackContent } from '@/types/qr-content';

interface FeedbackFormProps {
  content: QRContentData;
  onChange: <T extends QRContentData>(updates: Partial<T>) => void;
}

export function FeedbackForm({ content, onChange }: FeedbackFormProps) {
  const feedback = content as FeedbackContent;

  const handleChange = (updates: Partial<FeedbackContent>) => {
    onChange<FeedbackContent>(updates);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="inline-flex p-3 rounded-xl bg-yellow-50 dark:bg-yellow-950 mb-4">
          <MessageSquare className="w-8 h-8 text-yellow-500" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Feedback Form</h2>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Collect ratings and reviews from your customers
        </p>
      </div>

      <div className="max-w-md mx-auto space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Form Title *
          </label>
          <input
            type="text"
            value={feedback.title}
            onChange={(e) => handleChange({ title: e.target.value })}
            placeholder="How was your experience?"
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Description
          </label>
          <textarea
            value={feedback.description || ''}
            onChange={(e) => handleChange({ description: e.target.value })}
            placeholder="We'd love to hear your feedback..."
            rows={2}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white resize-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Thank You Message
          </label>
          <input
            type="text"
            value={feedback.thankYouMessage}
            onChange={(e) => handleChange({ thankYouMessage: e.target.value })}
            placeholder="Thank you for your feedback!"
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          />
        </div>

        <div className="p-4 rounded-lg bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-800">
          <p className="text-sm text-yellow-800 dark:text-yellow-200">
            Question editor coming soon. A default rating question will be included.
          </p>
        </div>
      </div>
    </div>
  );
}
