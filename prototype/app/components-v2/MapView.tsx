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

    L.tileLayer(
      "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png",
      { maxZoom: 19 }
    ).addTo(map);

    mapInstance.current = map;

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
        <div style="position:relative;width:18px;height:18px;">
          <div style="position:absolute;inset:-8px;background:rgba(232,116,97,0.18);border-radius:50%;animation:pulse 2s ease-in-out infinite;will-change:transform,opacity;"></div>
          <div style="width:18px;height:18px;background:#E87461;border-radius:50%;border:3px solid white;box-shadow:0 2px 10px rgba(232,116,97,0.4);"></div>
        </div>
        <style>@keyframes pulse{0%,100%{transform:scale(1);opacity:0.6}50%{transform:scale(2.5);opacity:0}}</style>
      `,
      iconSize: [18, 18],
      iconAnchor: [9, 9],
    });
    L.marker([52.3676, 4.9041], { icon: userIcon, interactive: false }).addTo(map);

    // Add restaurant markers — photo + rating badge, clear available/full distinction
    filtered.forEach((r, i) => {
      const isAvailable = r.available;
      const truncName = r.name.length > 13 ? r.name.slice(0, 13) + "\u2026" : r.name;
      const ratingBg = r.rating >= 4.5 ? "#00C853" : r.rating >= 4.0 ? "#7CB342" : r.rating >= 3.5 ? "#E8B84D" : "#9E9E9C";

      // Available: vibrant photo, colored rating badge, white border
      // Full: greyscale photo, "FULL" overlay, muted rating, dashed border
      const imgFilter = isAvailable ? "none" : "grayscale(1) opacity(0.5)";
      const borderStyle = isAvailable ? "2.5px solid #FFFFFF" : "2px dashed #C8C8C6";
      const shadowStyle = isAvailable ? "0 3px 14px rgba(0,0,0,0.18)" : "0 2px 8px rgba(0,0,0,0.08)";
      const nameColor = isAvailable ? "#0D0D0D" : "#9E9E9C";
      const badgeBg = isAvailable ? ratingBg : "#C8C8C6";

      const fullOverlay = isAvailable ? "" : `
        <div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,0.35);border-radius:12px;">
          <span style="font-size:8px;font-weight:800;color:white;letter-spacing:0.12em;font-family:'General Sans',system-ui,sans-serif;text-transform:uppercase;">Full</span>
        </div>`;

      const icon = L.divIcon({
        className: "restaurant-badge",
        html: `
          <div style="display:flex;flex-direction:column;align-items:center;cursor:pointer;animation:badgeIn 0.4s cubic-bezier(0.22,1,0.36,1) ${i * 0.04}s both;will-change:transform,opacity;">
            <div style="position:relative;">
              <div style="width:52px;height:52px;border-radius:14px;overflow:hidden;border:${borderStyle};box-shadow:${shadowStyle};background:#E8E6E2;">
                <img src="${r.photo}" style="width:100%;height:100%;object-fit:cover;filter:${imgFilter};" />
                ${fullOverlay}
              </div>
              <div style="position:absolute;bottom:-5px;left:50%;transform:translateX(-50%);background:${badgeBg};padding:1px 6px;border-radius:4px;border:2px solid white;box-shadow:0 1px 4px rgba(0,0,0,0.12);">
                <span style="font-size:10px;font-weight:700;color:white;font-family:'General Sans',system-ui,sans-serif;">${r.rating}</span>
              </div>
            </div>
            <div style="margin-top:6px;max-width:100px;text-align:center;">
              <span style="font-size:10px;font-weight:600;color:${nameColor};white-space:nowrap;overflow:hidden;text-overflow:ellipsis;display:block;font-family:'General Sans',system-ui,sans-serif;letter-spacing:-0.01em;text-shadow:0 0 8px white,0 0 8px white,0 0 8px white;">${truncName}</span>
            </div>
          </div>
          <style>@keyframes badgeIn{0%{transform:scale(0.8) translateY(6px);opacity:0}100%{transform:scale(1) translateY(0);opacity:1}}</style>
        `,
        iconSize: [80, 80],
        iconAnchor: [40, 65],
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
