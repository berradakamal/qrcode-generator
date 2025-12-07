'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapPin } from 'lucide-react';
import type { ScanEvent } from '@/types/realtime';

const AppleIcon = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current text-gray-500 dark:text-gray-400">
    <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
  </svg>
);

const AndroidIcon = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current text-green-500">
    <path d="M17.6 9.48l1.84-3.18c.16-.31.04-.69-.26-.85-.29-.15-.65-.06-.83.22l-1.88 3.24a11.463 11.463 0 00-4.47-.93c-1.6 0-3.11.33-4.47.93L5.65 5.67c-.19-.29-.54-.37-.83-.22-.3.16-.42.54-.26.85l1.84 3.18C4.25 10.79 2.5 13.33 2.5 16.25h19c0-2.92-1.75-5.46-3.9-6.77zM7 14.75c-.69 0-1.25-.56-1.25-1.25s.56-1.25 1.25-1.25 1.25.56 1.25 1.25-.56 1.25-1.25 1.25zm10 0c-.69 0-1.25-.56-1.25-1.25s.56-1.25 1.25-1.25 1.25.56 1.25 1.25-.56 1.25-1.25 1.25z" />
  </svg>
);

interface ScanEventCardProps {
  event: ScanEvent;
}

export const ScanEventCard: React.FC<ScanEventCardProps> = ({ event }) => {
  const [timeAgo, setTimeAgo] = useState('Just now');

  useEffect(() => {
    const updateTime = () => {
      const seconds = Math.floor((Date.now() - event.timestamp) / 1000);
      if (seconds < 5) setTimeAgo('Just now');
      else if (seconds < 60) setTimeAgo(`${seconds}s ago`);
      else setTimeAgo(`${Math.floor(seconds / 60)}m ago`);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, [event.timestamp]);

  return (
    <motion.div
      initial={{ opacity: 0, x: 400, scale: 0.8 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 100, scale: 0.9 }}
      transition={{ type: 'spring', damping: 25, stiffness: 300 }}
      layout
      className="bg-card/95 backdrop-blur-md border border-border rounded-xl p-3 shadow-2xl w-[340px] hover:bg-card transition-colors"
    >
      <div className="flex items-start gap-3">
        {/* Avatar with ping */}
        <div className="relative flex-shrink-0">
          <div className="absolute inset-0 bg-blue-500 rounded-full animate-ping opacity-30" />
          <img
            src={event.avatar}
            alt="User"
            className="relative w-10 h-10 rounded-full bg-muted border-2 border-white dark:border-slate-700 shadow-lg"
          />
        </div>

        {/* Main content */}
        <div className="flex-1 min-w-0">
          {/* Location row */}
          <div className="flex items-center gap-1.5 mb-1">
            <MapPin className="w-3 h-3 text-blue-400 flex-shrink-0" />
            <span className="font-semibold text-sm truncate">
              {event.city}, {event.country}
            </span>
          </div>

          {/* URL */}
          <div className="text-xs text-blue-400 truncate font-mono mb-1.5">
            {event.url}
          </div>

          {/* Bottom row: QR type + device + time */}
          <div className="flex items-center gap-2">
            <span className="text-[10px] bg-purple-500/15 text-purple-400 px-2 py-0.5 rounded-full font-medium">
              {event.qrTypeLabel}
            </span>
            <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
              {event.device === 'ios' ? <AppleIcon /> : <AndroidIcon />}
              <span className="truncate max-w-[80px]">{event.deviceName}</span>
            </div>
          </div>
        </div>

        {/* Time ago */}
        <div className="flex-shrink-0 text-[10px] text-muted-foreground font-medium">
          {timeAgo}
        </div>
      </div>
    </motion.div>
  );
};
