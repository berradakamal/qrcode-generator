"use client";

import dynamic from "next/dynamic";

export const LiveScanGlobe = dynamic(
  () => import("./live-scan-globe").then((mod) => mod.LiveScanGlobe),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full min-h-[400px] bg-background rounded-lg flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">
          Loading globe...
        </div>
      </div>
    ),
  }
);

export type { GeolocatedScan } from "@/types/scan";
