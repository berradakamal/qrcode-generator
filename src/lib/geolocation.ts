import type { GeolocationResult } from "@/types/scan";

const CACHE = new Map<string, GeolocationResult>();

const PRIVATE_IP_REGEX =
  /^(127\.|10\.|192\.168\.|172\.(1[6-9]|2[0-9]|3[0-1])\.|::1|fc00:|fe80:|localhost)/;

export async function getGeolocationFromIP(
  ip: string
): Promise<GeolocationResult | null> {
  if (PRIVATE_IP_REGEX.test(ip)) {
    return null;
  }

  if (CACHE.has(ip)) {
    return CACHE.get(ip)!;
  }

  try {
    const response = await fetch(
      `https://ip-api.com/json/${ip}?fields=lat,lon,city,country,status`
    );

    if (!response.ok) {
      return null;
    }

    const data = await response.json();

    if (data.status === "fail") {
      return null;
    }

    const result: GeolocationResult = {
      latitude: data.lat,
      longitude: data.lon,
      city: data.city,
      country: data.country,
    };

    CACHE.set(ip, result);
    return result;
  } catch {
    return null;
  }
}

export function generateDiceBearAvatar(seed: string): string {
  return `https://api.dicebear.com/9.x/thumbs/svg?seed=${encodeURIComponent(seed)}&backgroundColor=0a0a0a&size=64`;
}
