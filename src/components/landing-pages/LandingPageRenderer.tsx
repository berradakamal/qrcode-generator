'use client';

import type { QRCodeDocument } from '@/types/qr-code';
import { WiFiPage } from './pages/WiFiPage';
import { VCardPage } from './pages/VCardPage';
import { SocialPage } from './pages/SocialPage';
import { BusinessPage } from './pages/BusinessPage';
import { GenericPage } from './pages/GenericPage';

interface LandingPageRendererProps {
  qrCode: QRCodeDocument;
}

export function LandingPageRenderer({ qrCode }: LandingPageRendererProps) {
  switch (qrCode.type) {
    case 'wifi':
      return <WiFiPage qrCode={qrCode} />;
    case 'vcard':
      return <VCardPage qrCode={qrCode} />;
    case 'social':
      return <SocialPage qrCode={qrCode} />;
    case 'business':
      return <BusinessPage qrCode={qrCode} />;
    default:
      return <GenericPage qrCode={qrCode} />;
  }
}
