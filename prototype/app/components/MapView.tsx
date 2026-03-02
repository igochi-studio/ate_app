"use client";

import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { Restaurant } from "../data/restaurants";

interface MapViewProps {
  restaurants: Restaurant[];
  favouriteIds: string[];
  showFavouritesOnly: boolean;
  onSelectRestaurant: (r: Restaurant) => void;
}

export default function MapView({
  restaurants,
  favouriteIds,
  showFavouritesOnly,
  onSelectRestaurant,
}: MapViewProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);
  const [isReady, setIsReady] = useState(false);

  const filtered = showFavouritesOnly
    ? restaurants.filter((r) => favouriteIds.includes(r.id))
    : restaurants;

  // Initialize map
  useEffect(() => {
    if (!mapRef.current || mapInstance.current) return;

    const map = L.map(mapRef.current, {
      center: [52.3676, 4.9041],
      zoom: 14,
      zoomControl: false,
      attributionControl: false,
      minZoom: 11,
      maxZoom: 18,
    });

    // Warm-toned map tiles (Stadia smooth dark works well, or CartoDB Voyager for warm)
    L.tileLayer(
      "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png",
      { maxZoom: 19 }
    ).addTo(map);

    mapInstance.current = map;

    // Small delay for tiles to load
    setTimeout(() => setIsReady(true), 300);

    return () => {
      map.remove();
      mapInstance.current = null;
    };
  }, []);

  // Update markers when restaurants change
  useEffect(() => {
    const map = mapInstance.current;
    if (!map || !isReady) return;

    // Clear existing markers
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    // Add user location
    const userIcon = L.divIcon({
      className: "user-location-marker",
      html: `
        <div style="position:relative;width:16px;height:16px;">
          <div style="position:absolute;inset:-6px;background:rgba(45,95,45,0.12);border-radius:50%;animation:pulse 2s ease-in-out infinite;"></div>
          <div style="width:16px;height:16px;background:#2D5F2D;border-radius:50%;border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.2);"></div>
        </div>
        <style>@keyframes pulse{0%,100%{transform:scale(1);opacity:0.6}50%{transform:scale(2.2);opacity:0}}</style>
      `,
      iconSize: [16, 16],
      iconAnchor: [8, 8],
    });
    L.marker([52.3676, 4.9041], { icon: userIcon, interactive: false }).addTo(map);

    // Add restaurant markers as circular photo badges
    filtered.forEach((r, i) => {
      const isAvailable = r.available;
      const borderColor = isAvailable ? "#2D5F2D" : "#9A9A98";
      const spotsLabel = r.spotsLeft && r.spotsLeft <= 3
        ? `<div style="position:absolute;top:-4px;right:-4px;min-width:18px;height:18px;background:#C27A3E;color:white;font-size:10px;font-weight:700;border-radius:9px;display:flex;align-items:center;justify-content:center;padding:0 4px;border:2px solid white;font-family:var(--font-jakarta),system-ui,sans-serif;">${r.spotsLeft}</div>`
        : "";
      const availDot = isAvailable
        ? `<div style="position:absolute;bottom:-2px;right:-2px;width:12px;height:12px;background:#2D5F2D;border-radius:50%;border:2.5px solid white;"></div>`
        : "";

      const icon = L.divIcon({
        className: "restaurant-badge",
        html: `
          <div style="display:flex;flex-direction:column;align-items:center;cursor:pointer;animation:badgeIn 0.6s cubic-bezier(0.34,1.56,0.64,1) ${i * 0.06}s both;">
            <div style="position:relative;">
              <div style="width:52px;height:52px;border-radius:50%;overflow:hidden;border:3px solid ${borderColor};box-shadow:0 3px 12px rgba(0,0,0,0.15);background:${borderColor};">
                <img src="${r.photo}" style="width:100%;height:100%;object-fit:cover;" />
              </div>
              ${spotsLabel}
              ${availDot}
            </div>
            <div style="margin-top:3px;background:white;padding:2px 8px;border-radius:8px;box-shadow:0 1px 6px rgba(0,0,0,0.1);max-width:90px;">
              <span style="font-size:11px;font-weight:600;color:#1A1A18;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;display:block;font-family:var(--font-jakarta),system-ui,sans-serif;">${r.name.length > 12 ? r.name.slice(0, 12) + "…" : r.name}</span>
            </div>
          </div>
          <style>@keyframes badgeIn{0%{transform:scale(0) translateY(10px);opacity:0}100%{transform:scale(1) translateY(0);opacity:1}}</style>
        `,
        iconSize: [80, 80],
        iconAnchor: [40, 70],
      });

      const marker = L.marker([r.lat, r.lng], { icon }).addTo(map);
      marker.on("click", () => onSelectRestaurant(r));
      markersRef.current.push(marker);
    });
  }, [filtered, isReady, onSelectRestaurant]);

  return (
    <div ref={mapRef} className="w-full h-full" style={{ zIndex: 0 }} />
  );
}
