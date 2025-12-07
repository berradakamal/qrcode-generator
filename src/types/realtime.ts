import type { QRCodeType } from './qr-code';

export interface ScanEvent {
  id: string;
  lat: number;
  lng: number;
  city: string;
  country: string;
  avatar: string;
  url: string;
  qrType: QRCodeType;
  qrTypeLabel: string;
  device: 'ios' | 'android';
  deviceName: string;
  timestamp: number;
  color: string;
}

export interface LocationData {
  lat: number;
  lng: number;
  city: string;
  country: string;
}

export interface DeviceData {
  name: string;
  os: 'ios' | 'android';
}

export const LOCATIONS: LocationData[] = [
  { lat: 48.8566, lng: 2.3522, city: 'Paris', country: 'France' },
  { lat: 43.2965, lng: 5.3698, city: 'Marseille', country: 'France' },
  { lat: 45.764, lng: 4.8357, city: 'Lyon', country: 'France' },
  { lat: 43.6047, lng: 1.4442, city: 'Toulouse', country: 'France' },
  { lat: 43.7102, lng: 7.262, city: 'Nice', country: 'France' },
  { lat: 47.2184, lng: -1.5536, city: 'Nantes', country: 'France' },
  { lat: 44.8378, lng: -0.5792, city: 'Bordeaux', country: 'France' },
  { lat: 48.5734, lng: 7.7521, city: 'Strasbourg', country: 'France' },
  { lat: 50.6292, lng: 3.0573, city: 'Lille', country: 'France' },
  { lat: 47.3221, lng: 5.0415, city: 'Dijon', country: 'France' },
  { lat: 48.1173, lng: -1.6778, city: 'Rennes', country: 'France' },
  { lat: 43.6108, lng: 3.8767, city: 'Montpellier', country: 'France' },
];

export const DEVICES: DeviceData[] = [
  { name: 'iPhone 15 Pro', os: 'ios' },
  { name: 'iPhone 14', os: 'ios' },
  { name: 'iPhone 13', os: 'ios' },
  { name: 'iPhone SE', os: 'ios' },
  { name: 'Samsung Galaxy S24', os: 'android' },
  { name: 'Samsung Galaxy S23', os: 'android' },
  { name: 'Google Pixel 8', os: 'android' },
  { name: 'Google Pixel 7', os: 'android' },
  { name: 'OnePlus 12', os: 'android' },
  { name: 'Xiaomi 14', os: 'android' },
];

export const AVATARS = [
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Milo',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Luna',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Max',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Sophie',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Oliver',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Emma',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Liam',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Ava',
];

export const COLORS = ['#ef4444', '#a855f7', '#f97316', '#10b981', '#3b82f6', '#ec4899', '#06b6d4'];

export const DEMO_URLS = [
  'https://myrestaurant.com/menu',
  'https://shop.example.com/sale',
  'https://event.tickets/concert',
  'https://realestate.co/listing/123',
  'https://wifi.connect/guest',
  'https://portfolio.dev/work',
  'https://cafe.menu/drinks',
  'https://business.card/john-doe',
  'https://feedback.app/survey',
  'https://coupon.deal/50off',
  'https://social.bio/creator',
  'https://gallery.pics/wedding',
  'https://podcast.fm/episodes',
  'https://store.app/download',
  'https://event.rsvp/party2024',
];

export const QR_TYPES_FOR_DEMO: QRCodeType[] = [
  'menu',
  'wifi',
  'vcard',
  'event',
  'business',
  'social',
  'coupon',
  'feedback',
  'smartstore',
  'images',
];

export const TIMING = {
  MAX_VISIBLE_CARDS: 5,
  EVENT_GENERATION_MIN: 1000,
  EVENT_GENERATION_MAX: 15000,
  EVENT_CLEANUP_INTERVAL: 1000,
  EVENT_LIFETIME_MS: 30000,
} as const;
