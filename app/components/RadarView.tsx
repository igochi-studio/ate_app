"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MagnifyingGlassIcon,
  HeartFilledIcon,
  MinusIcon,
  PlusIcon,
  Crosshair2Icon,
} from "@radix-ui/react-icons";
import type { Restaurant } from "../data/restaurants";
import RestaurantCard from "./RestaurantCard";

const MAP_CENTER = { lat: 52.3676, lng: 4.9041 }; // Amsterdam center

function latLngToXY(lat: number, lng: number, zoom: number) {
  const scale = Math.pow(2, zoom) * 80;
  const x = (lng - MAP_CENTER.lng) * scale;
  const y = -(lat - MAP_CENTER.lat) * scale * 1.5;
  return { x, y };
}

export default function RadarView({
  restaurants,
  favouriteIds,
  onToggleFavourite,
  onSelectRestaurant,
  onOpenSearch,
}: {
  restaurants: Restaurant[];
  favouriteIds: string[];
  onToggleFavourite: (id: string) => void;
  onSelectRestaurant: (r: Restaurant) => void;
  onOpenSearch: () => void;
}) {
  const [showFavouritesOnly, setShowFavouritesOnly] = useState(false);
  const [zoom, setZoom] = useState(3);
  const [partySize, setPartySize] = useState(2);
  const [showList, setShowList] = useState(false);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });

  const filtered = useMemo(() => {
    if (showFavouritesOnly) {
      return restaurants.filter((r) => favouriteIds.includes(r.id));
    }
    return restaurants;
  }, [restaurants, favouriteIds, showFavouritesOnly]);

  const availableCount = filtered.filter((r) => r.available).length;

  return (
    <div className="h-full flex flex-col">
      {/* Top bar */}
      <div className="relative z-20 px-4 pt-[env(safe-area-inset-top)] bg-cream-light/80 backdrop-blur-xl">
        <div className="flex items-center gap-3 py-3">
          <button
            onClick={onOpenSearch}
            className="flex-1 flex items-center gap-2.5 bg-white rounded-2xl px-4 py-3 border border-light-grey/50 shadow-sm"
          >
            <MagnifyingGlassIcon className="w-4 h-4 text-charcoal/40" />
            <span className="text-sm text-charcoal/40">Find a restaurant...</span>
          </button>
          <button
            onClick={() => setShowFavouritesOnly(!showFavouritesOnly)}
            className={`w-11 h-11 rounded-2xl flex items-center justify-center border transition-colors ${
              showFavouritesOnly
                ? "bg-terracotta/10 border-terracotta/30 text-terracotta"
                : "bg-white border-light-grey/50 text-charcoal/40"
            }`}
          >
            <HeartFilledIcon className="w-4.5 h-4.5" />
          </button>
        </div>
        <div className="flex items-center gap-2 pb-3">
          <div className="flex items-center bg-white rounded-xl border border-light-grey/50 shadow-sm">
            <button
              onClick={() => setPartySize(Math.max(1, partySize - 1))}
              className="px-2.5 py-1.5 text-charcoal/40"
            >
              <MinusIcon className="w-3.5 h-3.5" />
            </button>
            <span className="text-sm font-medium text-charcoal-dark px-1">For {partySize}</span>
            <button
              onClick={() => setPartySize(Math.min(12, partySize + 1))}
              className="px-2.5 py-1.5 text-charcoal/40"
            >
              <PlusIcon className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="text-xs text-charcoal/40 ml-auto">
            {availableCount} available nearby
          </div>
        </div>
      </div>

      {/* Map area */}
      <div className="flex-1 relative overflow-hidden bg-sage/15">
        {/* Map background pattern — simulated topographic feel */}
        <div className="absolute inset-0" style={{
          backgroundImage: `
            radial-gradient(circle at 30% 40%, rgba(197, 207, 192, 0.3) 0%, transparent 50%),
            radial-gradient(circle at 70% 60%, rgba(197, 207, 192, 0.2) 0%, transparent 40%),
            radial-gradient(circle at 50% 50%, rgba(197, 207, 192, 0.15) 0%, transparent 70%)
          `,
        }}>
          {/* Grid lines for map feel */}
          <svg className="absolute inset-0 w-full h-full opacity-[0.08]">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#4A4A48" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>

          {/* Streets / paths */}
          <svg className="absolute inset-0 w-full h-full opacity-[0.12]">
            <line x1="0" y1="50%" x2="100%" y2="50%" stroke="#4A4A48" strokeWidth="2" />
            <line x1="50%" y1="0" x2="50%" y2="100%" stroke="#4A4A48" strokeWidth="2" />
            <line x1="20%" y1="0" x2="80%" y2="100%" stroke="#4A4A48" strokeWidth="1" />
            <line x1="0" y1="30%" x2="100%" y2="70%" stroke="#4A4A48" strokeWidth="1" />
            <path d="M 0 80 Q 50% 60% 100% 85%" fill="none" stroke="#6B9BD2" strokeWidth="3" opacity="0.4" />
          </svg>
        </div>

        {/* Restaurant pins */}
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            className="relative"
            style={{ width: "100%", height: "100%" }}
            drag
            dragConstraints={{ left: -200, right: 200, top: -200, bottom: 200 }}
            onDragEnd={(_, info) => {
              setPanOffset({
                x: panOffset.x + info.offset.x,
                y: panOffset.y + info.offset.y,
              });
            }}
          >
            {filtered.map((r) => {
              const { x, y } = latLngToXY(r.lat, r.lng, zoom);
              return (
                <motion.button
                  key={r.id}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25, delay: Math.random() * 0.3 }}
                  whileTap={{ scale: 1.2 }}
                  onClick={() => onSelectRestaurant(r)}
                  className="absolute"
                  style={{
                    left: `calc(50% + ${x + panOffset.x}px)`,
                    top: `calc(50% + ${y + panOffset.y}px)`,
                    transform: "translate(-50%, -100%)",
                  }}
                >
                  <div className="flex flex-col items-center">
                    <div
                      className={`relative w-10 h-10 rounded-full flex items-center justify-center shadow-lg ${
                        r.available
                          ? "bg-forest text-white"
                          : "bg-charcoal/60 text-white/80"
                      }`}
                    >
                      <span className="text-[10px] font-bold">{r.priceRange}</span>
                      {r.available && r.spotsLeft && r.spotsLeft <= 3 && (
                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-terracotta text-white text-[8px] font-bold rounded-full flex items-center justify-center">
                          {r.spotsLeft}
                        </div>
                      )}
                    </div>
                    <div className="w-0 h-0 border-l-[5px] border-r-[5px] border-t-[6px] border-l-transparent border-r-transparent border-t-forest -mt-[1px]"
                      style={{ borderTopColor: r.available ? "#2D5F2D" : "rgba(74,74,72,0.6)" }}
                    />
                    <span className="mt-0.5 text-[9px] font-semibold text-charcoal-dark bg-white/80 backdrop-blur-sm px-1.5 py-0.5 rounded whitespace-nowrap max-w-[80px] truncate">
                      {r.name}
                    </span>
                  </div>
                </motion.button>
              );
            })}

            {/* User location dot */}
            <div
              className="absolute"
              style={{
                left: `calc(50% + ${panOffset.x}px)`,
                top: `calc(50% + ${panOffset.y}px)`,
                transform: "translate(-50%, -50%)",
              }}
            >
              <div className="relative">
                <div className="w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-lg" />
                <div className="absolute inset-0 w-4 h-4 bg-blue-500/30 rounded-full animate-ping" />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Zoom controls */}
        <div className="absolute right-4 bottom-28 flex flex-col gap-2 z-10">
          <button
            onClick={() => setZoom(Math.min(6, zoom + 0.5))}
            className="w-10 h-10 bg-white rounded-xl shadow-md flex items-center justify-center border border-light-grey/50"
          >
            <PlusIcon className="w-4 h-4 text-charcoal-dark" />
          </button>
          <button
            onClick={() => setZoom(Math.max(1, zoom - 0.5))}
            className="w-10 h-10 bg-white rounded-xl shadow-md flex items-center justify-center border border-light-grey/50"
          >
            <MinusIcon className="w-4 h-4 text-charcoal-dark" />
          </button>
          <button
            onClick={() => setPanOffset({ x: 0, y: 0 })}
            className="w-10 h-10 bg-white rounded-xl shadow-md flex items-center justify-center border border-light-grey/50"
          >
            <Crosshair2Icon className="w-4 h-4 text-charcoal-dark" />
          </button>
        </div>
      </div>

      {/* Bottom sheet - restaurant list peek */}
      <motion.div
        className="relative z-10 bg-cream-light rounded-t-3xl -mt-6 border-t border-light-grey/30"
        animate={{ height: showList ? "60vh" : "auto" }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
      >
        <button
          onClick={() => setShowList(!showList)}
          className="w-full flex justify-center pt-3 pb-2"
        >
          <div className="w-10 h-1 bg-light-grey rounded-full" />
        </button>
        <div className="px-4 pb-2">
          <p className="text-xs font-medium text-charcoal/40">
            {showList ? "Nearby restaurants" : `${availableCount} available · Drag up for list`}
          </p>
        </div>
        {showList && (
          <div className="px-4 pb-24 overflow-y-auto max-h-[50vh]">
            {filtered.map((r) => (
              <RestaurantCard
                key={r.id}
                restaurant={r}
                isFavourite={favouriteIds.includes(r.id)}
                onToggleFavourite={onToggleFavourite}
                onSelect={onSelectRestaurant}
              />
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}
