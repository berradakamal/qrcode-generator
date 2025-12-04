"use client";

import { useEffect, useRef, useState } from "react";
import { Viewer } from "resium";
import { Ion, Color, Cartesian3, SceneMode } from "cesium";
import "cesium/Build/Cesium/Widgets/widgets.css";
import "./globe-styles.css";
import { useRealtimeScans } from "@/hooks/use-realtime-scans";
import { GlobeMarker } from "./globe-marker";
import { cn } from "@/lib/utils";

Ion.defaultAccessToken = process.env.NEXT_PUBLIC_CESIUM_ION_TOKEN || "";

if (typeof window !== "undefined") {
  (window as unknown as { CESIUM_BASE_URL: string }).CESIUM_BASE_URL =
    "/_next/static/cesium";
}

interface LiveScanGlobeProps {
  className?: string;
  showConnectionStatus?: boolean;
}

export function LiveScanGlobe({
  className,
  showConnectionStatus = true,
}: LiveScanGlobeProps) {
  const { scans, isConnected } = useRealtimeScans();
  const viewerRef = useRef<Cesium.Viewer | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (!viewerRef.current) return;

    const viewer = viewerRef.current;
    const scene = viewer.scene;
    const globe = scene.globe;

    globe.baseColor = Color.fromCssColorString("#0a0a0a");
    globe.showGroundAtmosphere = false;
    globe.enableLighting = false;
    globe.depthTestAgainstTerrain = false;

    scene.backgroundColor = Color.TRANSPARENT;
    scene.skyBox.show = false;
    scene.sun.show = false;
    scene.moon.show = false;
    scene.skyAtmosphere.show = false;

    viewer.imageryLayers.removeAll();

    const controller = scene.screenSpaceCameraController;
    controller.minimumZoomDistance = 1_500_000;
    controller.maximumZoomDistance = 50_000_000;

    viewer.camera.setView({
      destination: Cartesian3.fromDegrees(0, 20, 25_000_000),
    });

    setIsReady(true);
  }, []);

  return (
    <div
      className={cn(
        "relative w-full h-full min-h-[400px] bg-background rounded-lg overflow-hidden",
        className
      )}
    >
      <Viewer
        ref={(ref) => {
          if (ref?.cesiumElement) {
            viewerRef.current = ref.cesiumElement;
          }
        }}
        full
        timeline={false}
        animation={false}
        baseLayerPicker={false}
        geocoder={false}
        homeButton={false}
        infoBox={false}
        sceneModePicker={false}
        selectionIndicator={false}
        navigationHelpButton={false}
        fullscreenButton={false}
        vrButton={false}
        sceneMode={SceneMode.SCENE3D}
        requestRenderMode
        maximumRenderTimeChange={Infinity}
      >
        {isReady &&
          scans.map((scan) => <GlobeMarker key={scan.id} scan={scan} />)}
      </Viewer>

      {showConnectionStatus && (
        <div className="absolute bottom-4 left-4 flex items-center gap-2 text-xs text-muted-foreground">
          <span
            className={cn(
              "h-2 w-2 rounded-full",
              isConnected ? "bg-green-500 animate-pulse" : "bg-red-500"
            )}
          />
          <span>{isConnected ? "Live" : "Connecting..."}</span>
        </div>
      )}

      {showConnectionStatus && (
        <div className="absolute bottom-4 right-4 text-xs text-muted-foreground">
          {scans.length} active {scans.length === 1 ? "scan" : "scans"}
        </div>
      )}
    </div>
  );
}
