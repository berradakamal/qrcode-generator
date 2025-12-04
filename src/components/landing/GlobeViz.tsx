"use client";

import { useEffect, useRef, useState, useCallback } from 'react';

interface ScanSession {
  id: string;
  lat: number;
  lng: number;
  city: string;
  country: string;
  color: string;
  avatar: string;
  startTime: number;
  url: string;
  device: string;
  browser: string;
  duration: number;
}

const DEMO_URLS = [
  'https://myrestaurant.com/menu',
  'https://shop.example.com/sale',
  'https://event.tickets/concert',
  'https://realestate.co/listing/123',
  'https://fitness.app/workout',
  'https://portfolio.dev/projects',
  'https://cafe.menu/drinks',
  'https://hotel.booking/rooms',
];

const DEVICES = ['iPhone 15 Pro', 'iPhone 14', 'Samsung Galaxy S24', 'Google Pixel 8', 'iPhone 13', 'Samsung Galaxy A54'];
const BROWSERS = ['Safari', 'Chrome', 'Samsung Internet', 'Firefox'];

const LOCATIONS = [
  { lat: 40.7128, lng: -74.0060, city: 'New York', country: 'USA' },
  { lat: 51.5074, lng: -0.1278, city: 'London', country: 'UK' },
  { lat: 48.8566, lng: 2.3522, city: 'Paris', country: 'France' },
  { lat: 35.6762, lng: 139.6503, city: 'Tokyo', country: 'Japan' },
  { lat: -33.8688, lng: 151.2093, city: 'Sydney', country: 'Australia' },
  { lat: 52.5200, lng: 13.4050, city: 'Berlin', country: 'Germany' },
  { lat: 55.7558, lng: 37.6173, city: 'Moscow', country: 'Russia' },
  { lat: 39.9042, lng: 116.4074, city: 'Beijing', country: 'China' },
  { lat: 19.4326, lng: -99.1332, city: 'Mexico City', country: 'Mexico' },
  { lat: -23.5505, lng: -46.6333, city: 'São Paulo', country: 'Brazil' },
  { lat: 1.3521, lng: 103.8198, city: 'Singapore', country: 'Singapore' },
  { lat: 25.2048, lng: 55.2708, city: 'Dubai', country: 'UAE' },
  { lat: 37.5665, lng: 126.9780, city: 'Seoul', country: 'South Korea' },
  { lat: 41.9028, lng: 12.4964, city: 'Rome', country: 'Italy' },
  { lat: 59.9139, lng: 10.7522, city: 'Oslo', country: 'Norway' },
];

const COLORS = ['#ef4444', '#a855f7', '#f97316', '#10b981', '#3b82f6', '#ec4899', '#8b5cf6', '#06b6d4', '#eab308', '#14b8a6'];

const AVATARS = [
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Milo',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Luna',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Oliver',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Sophie',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Max',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Emma',
];

export const GlobeViz = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const globeRef = useRef<any>(null);
  const [sessions, setSessions] = useState<ScanSession[]>([]);
  const [isGlobeReady, setIsGlobeReady] = useState(false);
  const [selectedSession, setSelectedSession] = useState<ScanSession | null>(null);

  const generateRandomSession = useCallback((): ScanSession => {
    const location = LOCATIONS[Math.floor(Math.random() * LOCATIONS.length)];
    const color = COLORS[Math.floor(Math.random() * COLORS.length)];
    const avatar = AVATARS[Math.floor(Math.random() * AVATARS.length)];
    const device = DEVICES[Math.floor(Math.random() * DEVICES.length)];
    const browser = BROWSERS[Math.floor(Math.random() * BROWSERS.length)];
    const url = DEMO_URLS[Math.floor(Math.random() * DEMO_URLS.length)];
    return {
      id: `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      ...location,
      color,
      avatar,
      startTime: Date.now(),
      url,
      device,
      browser,
      duration: Math.floor(Math.random() * 120) + 10,
    };
  }, []);

  const handleZoom = (direction: 'in' | 'out') => {
    if (!globeRef.current) return;
    const pov = globeRef.current.pointOfView();
    const newAltitude = direction === 'in'
      ? Math.max(1.2, pov.altitude - 0.3)
      : Math.min(4, pov.altitude + 0.3);
    globeRef.current.pointOfView({ ...pov, altitude: newAltitude }, 300);
  };

  useEffect(() => {
    if (!containerRef.current) return;

    let globe: any;
    let destroyed = false;

    const initGlobe = async () => {
      try {
        const GlobeModule = await import('globe.gl');
        const Globe = GlobeModule.default;

        if (destroyed || !containerRef.current) return;

        globe = new Globe(containerRef.current)
          .globeImageUrl('https://unpkg.com/three-globe/example/img/earth-night.jpg')
          .bumpImageUrl('https://unpkg.com/three-globe/example/img/earth-topology.png')
          .backgroundImageUrl('//unpkg.com/three-globe/example/img/night-sky.png')
          .showAtmosphere(true)
          .atmosphereColor('rgba(100, 180, 255, 0.3)')
          .atmosphereAltitude(0.2)
          .pointOfView({ lat: 20, lng: 0, altitude: 2.2 });

        globe.controls().autoRotate = true;
        globe.controls().autoRotateSpeed = 0.5;
        globe.controls().enableZoom = false;

        globeRef.current = globe;

        const handleResize = () => {
          if (containerRef.current && globe) {
            const { width, height } = containerRef.current.getBoundingClientRect();
            globe.width(width).height(height);
          }
        };

        window.addEventListener('resize', handleResize);
        handleResize();

        setIsGlobeReady(true);

        return () => {
          window.removeEventListener('resize', handleResize);
        };
      } catch (error) {
        console.error('Failed to initialize globe:', error);
      }
    };

    initGlobe();

    return () => {
      destroyed = true;
      if (globeRef.current) {
        globeRef.current._destructor?.();
        globeRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!isGlobeReady || !globeRef.current) return;

    const initialSessions = Array.from({ length: 5 }, () => generateRandomSession());
    setSessions(initialSessions);

    const addInterval = setInterval(() => {
      setSessions(prev => {
        const newSession = generateRandomSession();
        const updated = [...prev, newSession];
        if (updated.length > 15) {
          return updated.slice(-15);
        }
        return updated;
      });
    }, 3000);

    const removeInterval = setInterval(() => {
      setSessions(prev => {
        const now = Date.now();
        return prev.filter(session => now - session.startTime < 30000);
      });
    }, 1000);

    return () => {
      clearInterval(addInterval);
      clearInterval(removeInterval);
    };
  }, [isGlobeReady, generateRandomSession]);

  useEffect(() => {
    if (!globeRef.current || !isGlobeReady) return;

    globeRef.current
      .htmlElementsData(sessions)
      .htmlLat((d: ScanSession) => d.lat)
      .htmlLng((d: ScanSession) => d.lng)
      .htmlElement((d: ScanSession) => {
        const el = document.createElement('div');
        el.className = 'globe-marker';
        el.innerHTML = `
          <div class="marker-container" data-session-id="${d.id}">
            <div class="qr-frame">
              <div class="qr-corner qr-corner-tl"></div>
              <div class="qr-corner qr-corner-tr"></div>
              <div class="qr-corner qr-corner-bl"></div>
              <div class="qr-corner qr-corner-br"></div>
              <img src="${d.avatar}" class="marker-avatar" alt="User" />
            </div>
          </div>
        `;
        el.addEventListener('click', (e) => {
          e.stopPropagation();
          setSelectedSession(d);
          if (globeRef.current) {
            globeRef.current.controls().autoRotate = false;
          }
        });
        return el;
      });
  }, [sessions, isGlobeReady]);

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="globe-container">
      <div ref={containerRef} className="globe-canvas" />

      <div className="zoom-controls">
        <button onClick={() => handleZoom('in')} className="zoom-btn">+</button>
        <button onClick={() => handleZoom('out')} className="zoom-btn">−</button>
      </div>

      {selectedSession && (
        <div className="session-popup" onClick={() => {
          setSelectedSession(null);
          if (globeRef.current) {
            globeRef.current.controls().autoRotate = true;
          }
        }}>
          <div className="session-card" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={() => {
              setSelectedSession(null);
              if (globeRef.current) {
                globeRef.current.controls().autoRotate = true;
              }
            }}>×</button>
            <div className="session-header">
              <img src={selectedSession.avatar} alt="User" className="session-avatar" />
              <div>
                <div className="session-location">{selectedSession.city}, {selectedSession.country}</div>
                <div className="session-time">{formatTime(selectedSession.startTime)}</div>
              </div>
            </div>
            <div className="session-details">
              <div className="detail-row">
                <span className="detail-label">Scanned URL</span>
                <span className="detail-value url">{selectedSession.url}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Device</span>
                <span className="detail-value">{selectedSession.device}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Browser</span>
                <span className="detail-value">{selectedSession.browser}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Time</span>
                <span className="detail-value">{formatTime(selectedSession.startTime)} ({Intl.DateTimeFormat().resolvedOptions().timeZone})</span>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .globe-container {
          width: 100%;
          height: 500px;
          position: relative;
          overflow: hidden;
          background: radial-gradient(ellipse at center, #0a1929 0%, #000511 100%);
        }

        .globe-canvas {
          width: 100%;
          height: 100%;
          position: relative;
          z-index: 2;
        }

        .zoom-controls {
          position: absolute;
          bottom: 20px;
          right: 20px;
          display: flex;
          flex-direction: column;
          gap: 8px;
          z-index: 10;
        }

        .zoom-btn {
          width: 36px;
          height: 36px;
          border-radius: 8px;
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          color: white;
          font-size: 20px;
          font-weight: bold;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .zoom-btn:hover {
          background: rgba(255, 255, 255, 0.2);
        }

        .session-popup {
          position: absolute;
          inset: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 20;
        }

        .session-card {
          background: #1e293b;
          border: 1px solid #334155;
          border-radius: 16px;
          padding: 20px;
          min-width: 280px;
          position: relative;
        }

        .close-btn {
          position: absolute;
          top: 12px;
          right: 12px;
          width: 24px;
          height: 24px;
          border: none;
          background: transparent;
          color: #94a3b8;
          font-size: 20px;
          cursor: pointer;
        }

        .close-btn:hover {
          color: white;
        }

        .session-header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 16px;
          padding-bottom: 16px;
          border-bottom: 1px solid #334155;
        }

        .session-avatar {
          width: 48px;
          height: 48px;
          border-radius: 8px;
          background: white;
        }

        .session-location {
          font-weight: 600;
          color: white;
          font-size: 14px;
        }

        .session-time {
          color: #94a3b8;
          font-size: 12px;
          margin-top: 2px;
        }

        .session-details {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .detail-row {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .detail-label {
          font-size: 11px;
          color: #64748b;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .detail-value {
          font-size: 13px;
          color: #e2e8f0;
        }

        .detail-value.url {
          color: #60a5fa;
          word-break: break-all;
        }
      `}</style>

      <style jsx global>{`
        .globe-marker {
          pointer-events: auto;
          cursor: pointer;
        }

        .marker-container {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: transform 0.2s;
        }

        .marker-container:hover {
          transform: scale(1.1);
        }

        .qr-frame {
          position: relative;
          width: 36px;
          height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .qr-corner {
          position: absolute;
          width: 10px;
          height: 10px;
          border-color: #ffffff;
          border-style: solid;
          border-width: 2px;
        }

        .qr-corner-tl {
          top: 0;
          left: 0;
          border-right: none;
          border-bottom: none;
          border-top-left-radius: 3px;
        }

        .qr-corner-tr {
          top: 0;
          right: 0;
          border-left: none;
          border-bottom: none;
          border-top-right-radius: 3px;
        }

        .qr-corner-bl {
          bottom: 0;
          left: 0;
          border-right: none;
          border-top: none;
          border-bottom-left-radius: 3px;
        }

        .qr-corner-br {
          bottom: 0;
          right: 0;
          border-left: none;
          border-top: none;
          border-bottom-right-radius: 3px;
        }

        .marker-avatar {
          width: 26px;
          height: 26px;
          border-radius: 3px;
          background: #ffffff;
          position: relative;
          z-index: 3;
        }
      `}</style>
    </div>
  );
};
