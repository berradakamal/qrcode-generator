'use client';

import { Calendar } from 'lucide-react';
import type { QRContentData, EventContent } from '@/types/qr-content';

interface EventFormProps {
  content: QRContentData;
  onChange: <T extends QRContentData>(updates: Partial<T>) => void;
}

export function EventForm({ content, onChange }: EventFormProps) {
  const event = content as EventContent;

  const handleChange = (updates: Partial<EventContent>) => {
    onChange<EventContent>(updates);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="inline-flex p-3 rounded-xl bg-teal-50 dark:bg-teal-950 mb-4">
          <Calendar className="w-8 h-8 text-teal-500" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Event</h2>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Share event details with RSVP and calendar integration
        </p>
      </div>

      <div className="max-w-md mx-auto space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Event Title *
          </label>
          <input
            type="text"
            value={event.title}
            onChange={(e) => handleChange({ title: e.target.value })}
            placeholder="My Event"
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Description
          </label>
          <textarea
            value={event.description || ''}
            onChange={(e) => handleChange({ description: e.target.value })}
            placeholder="Event details..."
            rows={3}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white resize-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Start Date & Time *
          </label>
          <input
            type="datetime-local"
            value={event.startDate.slice(0, 16)}
            onChange={(e) => handleChange({ startDate: new Date(e.target.value).toISOString() })}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Location Name *
          </label>
          <input
            type="text"
            value={event.location.name}
            onChange={(e) => handleChange({ location: { ...event.location, name: e.target.value } })}
            placeholder="Venue name"
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Address
          </label>
          <input
            type="text"
            value={event.location.address || ''}
            onChange={(e) => handleChange({ location: { ...event.location, address: e.target.value } })}
            placeholder="123 Main St, City"
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          />
        </div>

        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="rsvp"
            checked={event.enableRsvp}
            onChange={(e) => handleChange({ enableRsvp: e.target.checked })}
            className="w-4 h-4 rounded border-gray-300 text-blue-600"
          />
          <label htmlFor="rsvp" className="text-sm text-gray-700 dark:text-gray-300">
            Enable RSVP
          </label>
        </div>
      </div>
    </div>
  );
}
