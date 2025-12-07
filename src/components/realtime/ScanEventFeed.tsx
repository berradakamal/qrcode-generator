'use client';

import React from 'react';
import { AnimatePresence } from 'framer-motion';
import { ScanEventCard } from './ScanEventCard';
import type { ScanEvent } from '@/types/realtime';

interface ScanEventFeedProps {
  events: ScanEvent[];
}

export const ScanEventFeed: React.FC<ScanEventFeedProps> = ({ events }) => {
  return (
    <div className="fixed right-6 top-24 z-50 flex flex-col gap-3 pointer-events-none">
      <AnimatePresence mode="popLayout">
        {events.map((event) => (
          <div key={event.id} className="pointer-events-auto">
            <ScanEventCard event={event} />
          </div>
        ))}
      </AnimatePresence>
    </div>
  );
};
