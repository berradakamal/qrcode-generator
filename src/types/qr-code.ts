import type { QRTemplate } from './qr-template';
import type { QRContentData } from './qr-content';

export type QRCodeType =
  | 'smartstore'
  | 'menu'
  | 'vcard'
  | 'wifi'
  | 'secret'
  | 'mp3'
  | 'images'
  | 'video'
  | 'apps'
  | 'social'
  | 'event'
  | 'whatsapp'
  | 'business'
  | 'coupon'
  | 'feedback'
  | 'zapier'
  | 'n8n';

export type QRCodeStatus = 'active' | 'paused' | 'archived';

export interface QRCodeAnalytics {
  totalScans: number;
  uniqueScans: number;
  lastScanAt: Date | null;
}

export interface QRCodeDocument {
  id: string;
  userId: string;
  type: QRCodeType;
  name: string;
  shortCode: string;
  status: QRCodeStatus;
  styling: QRTemplate;
  content: QRContentData;
  analytics: QRCodeAnalytics;
  createdAt: Date;
  updatedAt: Date;
}

export interface ScanEvent {
  id: string;
  qrCodeId: string;
  timestamp: Date;
  userAgent: string;
  device: 'mobile' | 'tablet' | 'desktop';
  os: string;
  browser: string;
  location?: {
    country: string;
    city: string;
    latitude: number;
    longitude: number;
  };
  sessionId: string;
  isUnique: boolean;
  referrer?: string;
}

export const QR_TYPE_LABELS: Record<QRCodeType, string> = {
  smartstore: 'Smart Store',
  menu: 'Menu',
  vcard: 'vCard Plus',
  wifi: 'Wi-Fi',
  secret: 'Secret',
  mp3: 'MP3 Player',
  images: 'Gallery',
  video: 'Video',
  apps: 'App Store',
  social: 'Social Bio',
  event: 'Event',
  whatsapp: 'WhatsApp',
  business: 'Business',
  coupon: 'Coupon',
  feedback: 'Feedback',
  zapier: 'Zapier Webhook',
  n8n: 'n8n Webhook',
};

export const QR_TYPE_REDIRECT_BEHAVIOR: Record<QRCodeType, 'direct' | 'landing'> = {
  smartstore: 'landing',
  menu: 'landing',
  vcard: 'landing',
  wifi: 'landing',
  secret: 'landing',
  mp3: 'landing',
  images: 'landing',
  video: 'landing',
  apps: 'direct',
  social: 'landing',
  event: 'landing',
  whatsapp: 'direct',
  business: 'landing',
  coupon: 'landing',
  feedback: 'landing',
  zapier: 'direct',
  n8n: 'direct',
};
