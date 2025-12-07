'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useTheme } from 'next-themes';
import type { ScanEvent } from '@/types/realtime';

interface GlobeInstance {
  pointOfView: (
    pov?: { lat?: number; lng?: number; altitude?: number },
    ms?: number
  ) => { lat: number; lng: number; altitude: number };
  controls: () => { autoRotate: boolean; autoRotateSpeed: number; enableZoom: boolean; enableRotate: boolean };
  htmlElementsData: (data: ScanEvent[]) => GlobeInstance;
  htmlLat: (fn: (d: ScanEvent) => number) => GlobeInstance;
  htmlLng: (fn: (d: ScanEvent) => number) => GlobeInstance;
  htmlElement: (fn: (d: ScanEvent) => HTMLElement) => GlobeInstance;
  globeImageUrl: (url: string) => GlobeInstance;
  bumpImageUrl: (url: string) => GlobeInstance;
  backgroundImageUrl: (url: string | null) => GlobeInstance;
  showAtmosphere: (show: boolean) => GlobeInstance;
  atmosphereColor: (color: string) => GlobeInstance;
  atmosphereAltitude: (altitude: number) => GlobeInstance;
  width: (w: number) => GlobeInstance;
  height: (h: number) => GlobeInstance;
  _destructor?: () => void;
}

const GLOBE_TEXTURES = {
  day: 'https://unpkg.com/three-globe/example/img/earth-blue-marble.jpg',
  night: 'https://unpkg.com/three-globe/example/img/earth-night.jpg',
  dayBackground: null,
  nightBackground: '//unpkg.com/three-globe/example/img/night-sky.png',
};

interface RealtimeGlobeProps {
  events: ScanEvent[];
  onEventClick?: (event: ScanEvent) => void;
}

export const RealtimeGlobe: React.FC<RealtimeGlobeProps> = ({ events, onEventClick }) => {
  const { resolvedTheme } = useTheme();
  const containerRef = useRef<HTMLDivElement>(null);
  const globeRef = useRef<GlobeInstance | null>(null);
  const [isGlobeReady, setIsGlobeReady] = useState(false);
  const [mounted, setMounted] = useState(false);
  const lastEventRef = useRef<string | null>(null);
  const spinTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted ? resolvedTheme === 'dark' : true;

  const handleZoom = useCallback((direction: 'in' | 'out') => {
    if (!globeRef.current) return;
    const pov = globeRef.current.pointOfView();
    const newAltitude =
      direction === 'in'
        ? Math.max(1.2, pov.altitude - 0.3)
        : Math.min(4, pov.altitude + 0.3);
    globeRef.current.pointOfView({ ...pov, altitude: newAltitude }, 300);
  }, []);

  useEffect(() => {
    if (!containerRef.current) return;
    let globe: GlobeInstance | null = null;
    let destroyed = false;

    const initGlobe = async () => {
      try {
        const GlobeModule = await import('globe.gl');
        const Globe = GlobeModule.default;

        if (destroyed || !containerRef.current) return;

        globe = new (Globe as unknown as new (container: HTMLElement) => GlobeInstance)(containerRef.current)
          .globeImageUrl(isDark ? GLOBE_TEXTURES.night : GLOBE_TEXTURES.day)
          .bumpImageUrl('https://unpkg.com/three-globe/example/img/earth-topology.png')
          .backgroundImageUrl(isDark ? GLOBE_TEXTURES.nightBackground : GLOBE_TEXTURES.dayBackground)
          .showAtmosphere(true)
          .atmosphereColor('rgba(100, 180, 255, 0.3)')
          .atmosphereAltitude(0.25)
          .width(containerRef.current.clientWidth)
          .height(containerRef.current.clientHeight);

        globe.pointOfView({ lat: 46.6, lng: 2.5, altitude: 2.0 });
        globe.controls().autoRotate = false;
        globe.controls().autoRotateSpeed = 0.3;
        globe.controls().enableZoom = false;

        globeRef.current = globe;

        const resizeObserver = new ResizeObserver(() => {
          if (containerRef.current && globe) {
            const { clientWidth, clientHeight } = containerRef.current;
            globe.width(clientWidth).height(clientHeight);
          }
        });
        resizeObserver.observe(containerRef.current);

        setIsGlobeReady(true);

        return () => {
          resizeObserver.disconnect();
        };
      } catch (error) {
        console.error('Globe init error:', error);
      }
    };

    initGlobe();

    return () => {
      destroyed = true;
      if (globeRef.current?._destructor) {
        globeRef.current._destructor();
      }
    };
  }, [isDark]);

  useEffect(() => {
    if (!isGlobeReady || !globeRef.current || !mounted) return;

    globeRef.current
      .globeImageUrl(isDark ? GLOBE_TEXTURES.night : GLOBE_TEXTURES.day)
      .backgroundImageUrl(isDark ? GLOBE_TEXTURES.nightBackground : GLOBE_TEXTURES.dayBackground);
  }, [isDark, isGlobeReady, mounted]);

  useEffect(() => {
    if (!globeRef.current || !isGlobeReady) return;

    globeRef.current
      .htmlElementsData(events)
      .htmlLat((d) => d.lat)
      .htmlLng((d) => d.lng)
      .htmlElement((d) => {
        const el = document.createElement('div');
        el.className = 'globe-marker';
        el.innerHTML = `
          <div class="marker-container group relative">
            <div class="absolute inset-0 bg-blue-500 rounded-full animate-ping opacity-20"></div>
            <div class="relative z-10 w-10 h-10 rounded-full border-2 border-white shadow-[0_0_20px_rgba(59,130,246,0.5)] overflow-hidden bg-slate-900 transition-transform hover:scale-125 cursor-pointer">
              <img src="${d.avatar}" class="w-full h-full object-cover" alt="User" />
            </div>
            <div class="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-900/95 text-white text-xs font-bold px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none border border-slate-700 shadow-xl">
              <div>${d.city}, ${d.country}</div>
              <div class="text-[10px] text-blue-400 font-normal mt-0.5">${d.qrTypeLabel}</div>
            </div>
          </div>
        `;
        el.addEventListener('click', (e) => {
          e.stopPropagation();
          onEventClick?.(d);
        });
        return el;
      });
  }, [events, isGlobeReady, onEventClick]);

  useEffect(() => {
    if (!globeRef.current || !isGlobeReady) return;

    if (spinTimeoutRef.current) {
      clearTimeout(spinTimeoutRef.current);
    }

    globeRef.current.controls().autoRotate = false;

    if (events.length === 0) {
      spinTimeoutRef.current = setTimeout(() => {
        if (globeRef.current) {
          globeRef.current.controls().autoRotate = true;
          globeRef.current.controls().autoRotateSpeed = 0.3;
        }
      }, 30000);
      return;
    }

    const latestEvent = events[0];
    if (latestEvent && latestEvent.id !== lastEventRef.current) {
      lastEventRef.current = latestEvent.id;

      globeRef.current.pointOfView(
        { lat: latestEvent.lat, lng: latestEvent.lng, altitude: 2.0 },
        1500
      );
    }

    spinTimeoutRef.current = setTimeout(() => {
      if (globeRef.current) {
        globeRef.current.controls().autoRotate = true;
        globeRef.current.controls().autoRotateSpeed = 0.3;
      }
    }, 30000);

    return () => {
      if (spinTimeoutRef.current) {
        clearTimeout(spinTimeoutRef.current);
      }
    };
  }, [events, isGlobeReady]);

  return (
    <div className="w-full h-full relative">
      <div ref={containerRef} className="w-full h-full" />

      <div className="absolute bottom-6 right-6 flex flex-col gap-2 z-20">
        <button
          onClick={() => handleZoom('in')}
          className="w-10 h-10 flex items-center justify-center bg-card/80 backdrop-blur text-foreground rounded-xl border border-border hover:bg-accent transition-colors text-lg font-medium"
        >
          +
        </button>
        <button
          onClick={() => handleZoom('out')}
          className="w-10 h-10 flex items-center justify-center bg-card/80 backdrop-blur text-foreground rounded-xl border border-border hover:bg-accent transition-colors text-lg font-medium"
        >
          −
        </button>
      </div>

      <div className="absolute bottom-6 left-6 bg-card/80 backdrop-blur-md border border-border p-4 rounded-xl max-w-[220px] pointer-events-none z-20">
        <div className="text-xs text-muted-foreground uppercase font-bold mb-1">
          Live Activity
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-sm font-bold">{events.length} active scan{events.length !== 1 ? 's' : ''}</span>
        </div>
        <div className="text-[10px] text-muted-foreground mt-1">
          Globe rotates to latest scan
        </div>
      </div>
    </div>
  );
};
