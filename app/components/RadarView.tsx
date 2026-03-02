"use client";

import { useState, useMemo, lazy, Suspense } from "react";
import { motion } from "framer-motion";
import {
  MagnifyingGlassIcon,
  HeartFilledIcon,
  MinusIcon,
  PlusIcon,
  ClockIcon,
} from "@radix-ui/react-icons";
import type { Restaurant } from "../data/restaurants";
import RestaurantCard from "./RestaurantCard";

const MapView = lazy(() => import("./MapView"));

// Apple-style spring config
const spring = { type: "spring" as const, stiffness: 380, damping: 30, mass: 0.8 };

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
  const [partySize, setPartySize] = useState(2);
  const [showList, setShowList] = useState(false);

  const filtered = useMemo(() => {
    if (showFavouritesOnly) {
      return restaurants.filter((r) => favouriteIds.includes(r.id));
    }
    return restaurants;
  }, [restaurants, favouriteIds, showFavouritesOnly]);

  const availableCount = filtered.filter((r) => r.available).length;
  const now = new Date();
  const timeStr = now.toLocaleTimeString("en-NL", { hour: "2-digit", minute: "2-digit", hour12: false });

  return (
    <div className="h-full flex flex-col">
      {/* Bump-style location bar */}
      <div className="relative z-20 bg-cream-light">
        <div className="flex items-center justify-between px-5 pt-[max(env(safe-area-inset-top),12px)] pb-1">
          <div className="flex items-center gap-2">
            <span className="text-[13px]">🇳🇱</span>
            <span className="text-[13px] font-semibold tracking-tight text-charcoal-dark">{timeStr}</span>
          </div>
          <div className="bg-forest rounded-full px-3 py-1">
            <span className="text-[11px] font-bold text-white tracking-wide">ATE</span>
          </div>
          <div className="flex items-center gap-1.5">
            <ClockIcon className="w-3.5 h-3.5 text-charcoal/40" />
            <span className="text-[13px] font-medium text-charcoal/50">
              {availableCount} open
            </span>
          </div>
        </div>
        <div className="px-5 pt-1 pb-3">
          <h1 className="text-[28px] font-extrabold tracking-tight text-charcoal-dark leading-none">
            Amsterdam, NL
          </h1>
        </div>
      </div>

      {/* Search + filters bar */}
      <div className="relative z-20 px-4 pb-3 bg-cream-light">
        <div className="flex items-center gap-2.5">
          <button
            onClick={onOpenSearch}
            className="flex-1 flex items-center gap-2.5 bg-white/80 backdrop-blur-sm rounded-full px-4 py-2.5 border border-charcoal/[0.06] shadow-[0_1px_3px_rgba(0,0,0,0.04)]"
          >
            <MagnifyingGlassIcon className="w-4 h-4 text-charcoal/30" />
            <span className="text-[13px] text-charcoal/30 font-medium">Find a restaurant...</span>
          </button>
          <motion.button
            whileTap={{ scale: 0.92 }}
            transition={spring}
            onClick={() => setShowFavouritesOnly(!showFavouritesOnly)}
            className={`h-10 w-10 rounded-full flex items-center justify-center transition-all duration-300 ${
              showFavouritesOnly
                ? "bg-terracotta text-white shadow-[0_2px_12px_rgba(194,122,62,0.3)]"
                : "bg-white/80 backdrop-blur-sm text-charcoal/30 border border-charcoal/[0.06]"
            }`}
          >
            <HeartFilledIcon className="w-4 h-4" />
          </motion.button>
          <div className="flex items-center bg-white/80 backdrop-blur-sm rounded-full border border-charcoal/[0.06] shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
            <motion.button
              whileTap={{ scale: 0.85 }}
              transition={spring}
              onClick={() => setPartySize(Math.max(1, partySize - 1))}
              className="px-2.5 py-2 text-charcoal/30"
            >
              <MinusIcon className="w-3 h-3" />
            </motion.button>
            <span className="text-[13px] font-semibold text-charcoal-dark px-0.5 tabular-nums">{partySize}</span>
            <motion.button
              whileTap={{ scale: 0.85 }}
              transition={spring}
              onClick={() => setPartySize(Math.min(12, partySize + 1))}
              className="px-2.5 py-2 text-charcoal/30"
            >
              <PlusIcon className="w-3 h-3" />
            </motion.button>
          </div>
        </div>
      </div>

      {/* Map */}
      <div className="flex-1 relative overflow-hidden">
        <Suspense
          fallback={
            <div className="w-full h-full bg-warm-beige/20 flex items-center justify-center">
              <div className="w-5 h-5 border-2 border-forest border-t-transparent rounded-full animate-spin" />
            </div>
          }
        >
          <MapView
            restaurants={filtered}
            favouriteIds={favouriteIds}
            showFavouritesOnly={showFavouritesOnly}
            onSelectRestaurant={onSelectRestaurant}
          />
        </Suspense>
      </div>

      {/* Bottom sheet */}
      <motion.div
        className="relative z-10 bg-cream-light rounded-t-[24px] -mt-5 shadow-[0_-4px_20px_rgba(0,0,0,0.04)]"
        animate={{ height: showList ? "55vh" : "auto" }}
        transition={{ ...spring, stiffness: 300 }}
      >
        <button
          onClick={() => setShowList(!showList)}
          className="w-full flex justify-center pt-3 pb-1"
        >
          <div className="w-8 h-[3px] bg-charcoal/10 rounded-full" />
        </button>
        <div className="px-5 pb-2 flex items-center justify-between">
          <p className="text-[12px] font-semibold tracking-wide text-charcoal/30 uppercase">
            {showList ? "Nearby" : `${availableCount} available`}
          </p>
          {!showList && (
            <p className="text-[11px] text-charcoal/20 font-medium">Pull up for list</p>
          )}
        </div>
        {showList && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.3 }}
            className="px-4 pb-24 overflow-y-auto max-h-[46vh]"
          >
            {filtered.map((r, i) => (
              <motion.div
                key={r.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ ...spring, delay: i * 0.04 }}
              >
                <RestaurantCard
                  restaurant={r}
                  isFavourite={favouriteIds.includes(r.id)}
                  onToggleFavourite={onToggleFavourite}
                  onSelect={onSelectRestaurant}
                />
              </motion.div>
            ))}
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
