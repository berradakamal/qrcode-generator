export interface Scan {
  id: string;
  ip_address: string;
  qr_id: string;
  scanned_at: string;
  user_agent?: string;
}

export interface GeolocatedScan extends Scan {
  latitude: number;
  longitude: number;
  city?: string;
  country?: string;
  avatarUrl: string;
  expiresAt: number;
}

export interface GeolocationResult {
  latitude: number;
  longitude: number;
  city?: string;
  country?: string;
}
