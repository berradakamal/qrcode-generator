'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { RealtimeHeader } from '@/components/realtime/RealtimeHeader';
import { RealtimeGlobe } from '@/components/realtime/RealtimeGlobe';
import { ScanEventFeed } from '@/components/realtime/ScanEventFeed';
import { QR_TYPE_LABELS } from '@/types/qr-code';
import type { ScanEvent } from '@/types/realtime';
import {
  LOCATIONS,
  DEVICES,
  AVATARS,
  COLORS,
  DEMO_URLS,
  QR_TYPES_FOR_DEMO,
  TIMING,
} from '@/types/realtime';

const RealtimePage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [scanEvents, setScanEvents] = useState<ScanEvent[]>([]);
  const [activeUsers] = useState(() => Math.floor(Math.random() * 200) + 80);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    }
  }, [status, router]);

  const generateScanEvent = useCallback((): ScanEvent => {
    const location = LOCATIONS[Math.floor(Math.random() * LOCATIONS.length)];
    const device = DEVICES[Math.floor(Math.random() * DEVICES.length)];
    const avatar = AVATARS[Math.floor(Math.random() * AVATARS.length)];
    const url = DEMO_URLS[Math.floor(Math.random() * DEMO_URLS.length)];
    const color = COLORS[Math.floor(Math.random() * COLORS.length)];
    const qrType = QR_TYPES_FOR_DEMO[Math.floor(Math.random() * QR_TYPES_FOR_DEMO.length)];

    return {
      id: `event-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`,
      lat: location.lat,
      lng: location.lng,
      city: location.city,
      country: location.country,
      avatar,
      url,
      qrType,
      qrTypeLabel: QR_TYPE_LABELS[qrType],
      device: device.os,
      deviceName: device.name,
      timestamp: Date.now(),
      color,
    };
  }, []);

  useEffect(() => {
    const initialEvents = Array.from({ length: 2 }, () => generateScanEvent());
    setScanEvents(initialEvents);

    const scheduleNextEvent = () => {
      const randomDelay = Math.floor(
        Math.random() * (TIMING.EVENT_GENERATION_MAX - TIMING.EVENT_GENERATION_MIN) +
          TIMING.EVENT_GENERATION_MIN
      );

      return setTimeout(() => {
        setScanEvents((prev) => {
          const newEvent = generateScanEvent();
          const updated = [newEvent, ...prev];
          return updated.slice(0, TIMING.MAX_VISIBLE_CARDS);
        });
        timeoutRef.current = scheduleNextEvent();
      }, randomDelay);
    };

    const timeoutRef = { current: scheduleNextEvent() };

    return () => clearTimeout(timeoutRef.current);
  }, [generateScanEvent]);

  useEffect(() => {
    const cleanupInterval = setInterval(() => {
      setScanEvents((prev) => {
        const now = Date.now();
        return prev.filter((event) => now - event.timestamp < TIMING.EVENT_LIFETIME_MS);
      });
    }, TIMING.EVENT_CLEANUP_INTERVAL);

    return () => clearInterval(cleanupInterval);
  }, []);

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-muted-foreground text-sm">Loading realtime view...</p>
        </div>
      </div>
    );
  }

  if (status === 'unauthenticated') {
    return null;
  }

  return (
    <div className="flex flex-col h-screen bg-background text-foreground overflow-hidden">
      <RealtimeHeader
        activeUsers={activeUsers}
        userName={session?.user?.name}
        userImage={session?.user?.image}
      />

      {/* Full-screen globe */}
      <div className="flex-1 relative">
        <RealtimeGlobe events={scanEvents} />
      </div>

      {/* Floating toast notifications */}
      <ScanEventFeed events={scanEvents} />
    </div>
  );
};

export default RealtimePage;
