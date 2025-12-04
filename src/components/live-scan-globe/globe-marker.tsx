"use client";

import { useMemo, useState, useEffect } from "react";
import { Entity, BillboardGraphics } from "resium";
import { Cartesian3, Color, NearFarScalar } from "cesium";
import type { GeolocatedScan } from "@/types/scan";

interface GlobeMarkerProps {
  scan: GeolocatedScan;
}

export function GlobeMarker({ scan }: GlobeMarkerProps) {
  const [opacity, setOpacity] = useState(0);
  const [scale, setScale] = useState(0.3);

  const position = useMemo(
    () => Cartesian3.fromDegrees(scan.longitude, scan.latitude, 0),
    [scan.latitude, scan.longitude]
  );

  const timeRemaining = scan.expiresAt - Date.now();
  const fadeStartTime = 5000;

  useEffect(() => {
    const enterAnimation = requestAnimationFrame(() => {
      setOpacity(1);
      setScale(1);
    });

    let fadeTimeout: NodeJS.Timeout | undefined;
    let fadeInterval: NodeJS.Timeout | undefined;

    if (timeRemaining > fadeStartTime) {
      fadeTimeout = setTimeout(() => {
        fadeInterval = setInterval(() => {
          setOpacity((prev) => {
            const newOpacity = Math.max(0, prev - 0.02);
            if (newOpacity <= 0 && fadeInterval) {
              clearInterval(fadeInterval);
            }
            return newOpacity;
          });
        }, 100);
      }, timeRemaining - fadeStartTime);
    }

    return () => {
      cancelAnimationFrame(enterAnimation);
      if (fadeTimeout) clearTimeout(fadeTimeout);
      if (fadeInterval) clearInterval(fadeInterval);
    };
  }, [timeRemaining]);

  return (
    <Entity position={position} name={scan.city || scan.country || "Unknown"}>
      <BillboardGraphics
        image={scan.avatarUrl}
        scale={scale * 0.6}
        color={Color.WHITE.withAlpha(opacity)}
        scaleByDistance={new NearFarScalar(1.5e2, 2.0, 1.5e7, 0.5)}
        translucencyByDistance={new NearFarScalar(1.5e6, 1.0, 1.5e7, 0.2)}
      />
    </Entity>
  );
}
