"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  getGeolocationFromIP,
  generateDiceBearAvatar,
} from "@/lib/geolocation";
import type { Scan, GeolocatedScan } from "@/types/scan";

const SCAN_TTL_MS = 30_000;

export function useRealtimeScans() {
  const [scans, setScans] = useState<GeolocatedScan[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const timeoutsRef = useRef<Map<string, NodeJS.Timeout>>(new Map());

  const removeScan = useCallback((id: string) => {
    setScans((prev) => prev.filter((scan) => scan.id !== id));
    const timeout = timeoutsRef.current.get(id);
    if (timeout) {
      clearTimeout(timeout);
      timeoutsRef.current.delete(id);
    }
  }, []);

  const addScan = useCallback(
    async (scan: Scan) => {
      const geo = await getGeolocationFromIP(scan.ip_address);

      if (!geo) {
        return;
      }

      const geolocatedScan: GeolocatedScan = {
        ...scan,
        ...geo,
        avatarUrl: generateDiceBearAvatar(scan.id),
        expiresAt: Date.now() + SCAN_TTL_MS,
      };

      setScans((prev) => {
        if (prev.some((s) => s.id === scan.id)) {
          return prev;
        }
        return [...prev, geolocatedScan];
      });

      const timeout = setTimeout(() => {
        removeScan(scan.id);
      }, SCAN_TTL_MS);

      timeoutsRef.current.set(scan.id, timeout);
    },
    [removeScan]
  );

  useEffect(() => {
    const supabase = createClient();

    const channel = supabase
      .channel("scans-realtime")
      .on<Scan>(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "scans",
        },
        (payload) => {
          addScan(payload.new);
        }
      )
      .subscribe((status) => {
        setIsConnected(status === "SUBSCRIBED");
      });

    return () => {
      timeoutsRef.current.forEach((timeout) => clearTimeout(timeout));
      timeoutsRef.current.clear();
      supabase.removeChannel(channel);
    };
  }, [addScan]);

  return { scans, isConnected };
}
