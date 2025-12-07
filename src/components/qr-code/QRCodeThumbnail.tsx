"use client";

import { useEffect, useRef, useState, useImperativeHandle, forwardRef } from 'react';
import type { QRTemplate } from '@/types/qr-template';
import type { QRCodeType } from '@/types/qr-code';
import type { QRContentData } from '@/types/qr-content';
import { generateQRData } from '@/lib/qr-encoder';

declare global {
  interface Window {
    QRCodeStyling: new (options: QRCodeStylingOptions) => QRCodeStylingInstance;
  }
}

interface QRCodeStylingOptions {
  width: number;
  height: number;
  type: string;
  data: string;
  image?: string;
  dotsOptions: { color: string; type: string };
  cornersSquareOptions: { type: string; color: string };
  cornersDotOptions: { type: string; color: string };
  backgroundOptions: { color: string };
  imageOptions: { crossOrigin: string; margin: number; imageSize: number; hideBackgroundDots: boolean };
}

interface QRCodeStylingInstance {
  append: (container: HTMLElement) => void;
  update: (options: Partial<QRCodeStylingOptions>) => void;
  download: (options: { name: string; extension: string }) => Promise<void>;
}

interface QRCodeThumbnailProps {
  type: QRCodeType;
  content: QRContentData;
  styling: QRTemplate;
  shortCode: string;
  name: string;
  size?: number;
}

export interface QRCodeThumbnailRef {
  download: (format?: string) => Promise<void>;
}

const DIRECT_ENCODE_TYPES: QRCodeType[] = ['wifi', 'vcard', 'whatsapp', 'apps', 'event'];

export const QRCodeThumbnail = forwardRef<QRCodeThumbnailRef, QRCodeThumbnailProps>(
  function QRCodeThumbnail({ type, content, styling, shortCode, name, size = 80 }, ref) {
    const containerRef = useRef<HTMLDivElement>(null);
    const qrInstanceRef = useRef<QRCodeStylingInstance | null>(null);
    const [scriptLoaded, setScriptLoaded] = useState(false);

    useImperativeHandle(ref, () => ({
      download: async (format = 'png') => {
        if (qrInstanceRef.current) {
          await qrInstanceRef.current.download({ name: name || 'qr-code', extension: format });
        }
      }
    }));

    useEffect(() => {
      let cancelled = false;

      const loadScript = () => {
        return new Promise<void>((resolve) => {
          if (typeof window !== 'undefined' && window.QRCodeStyling) {
            resolve();
            return;
          }

          const existingScript = document.querySelector('script[src*="qr-code-styling"]');
          if (existingScript) {
            const checkReady = setInterval(() => {
              if (window.QRCodeStyling) {
                clearInterval(checkReady);
                resolve();
              }
            }, 50);
            return;
          }

          const script = document.createElement('script');
          script.src = 'https://unpkg.com/qr-code-styling@1.5.0/lib/qr-code-styling.js';
          script.async = true;
          script.onload = () => resolve();
          document.body.appendChild(script);
        });
      };

      loadScript().then(() => {
        if (!cancelled) {
          setScriptLoaded(true);
        }
      });

      return () => {
        cancelled = true;
      };
    }, []);

    useEffect(() => {
      if (!scriptLoaded || !containerRef.current || !window.QRCodeStyling) return;

      const container = containerRef.current;

      const qrData = DIRECT_ENCODE_TYPES.includes(type)
        ? generateQRData(type, content)
        : `https://qrg.app/r/${shortCode}`;

      const qr = new window.QRCodeStyling({
        width: size * 4,
        height: size * 4,
        type: 'canvas',
        data: qrData,
        image: styling.logo?.dataUrl || undefined,
        dotsOptions: {
          color: styling.colors.dots,
          type: styling.patterns.dotStyle
        },
        cornersSquareOptions: {
          type: styling.patterns.cornerStyle,
          color: styling.colors.eyeFrame
        },
        cornersDotOptions: {
          type: styling.patterns.cornerDotStyle,
          color: styling.colors.eyeCenter
        },
        backgroundOptions: {
          color: styling.colors.background
        },
        imageOptions: {
          crossOrigin: "anonymous",
          margin: styling.logo?.margin || 10,
          imageSize: styling.logo?.scale || 0.4,
          hideBackgroundDots: true
        }
      });

      container.innerHTML = '';
      qr.append(container);
      qrInstanceRef.current = qr;

      return () => {
        container.innerHTML = '';
        qrInstanceRef.current = null;
      };
    }, [scriptLoaded, type, content, styling, shortCode, size]);

    const renderSize = size * 4;
    const scale = size / renderSize;

    return (
      <div
        className="rounded-lg bg-white border border-border overflow-hidden flex-shrink-0"
        style={{ width: size, height: size }}
      >
        <div
          ref={containerRef}
          style={{
            width: renderSize,
            height: renderSize,
            transform: `scale(${scale})`,
            transformOrigin: 'top left'
          }}
        />
      </div>
    );
  }
);
