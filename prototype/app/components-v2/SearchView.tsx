"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  MagnifyingGlassIcon,
  Cross2Icon,
  MinusIcon,
  PlusIcon,
  MixerHorizontalIcon,
} from "@radix-ui/react-icons";
import type { Restaurant } from "../data/restaurants";
import { cuisineOptions, vibeOptions } from "../data/restaurants";
import RestaurantCard from "./RestaurantCard";

const spring = { type: "spring" as const, stiffness: 380, damping: 30, mass: 0.8 };

export default function SearchView({
  restaurants,
  favouriteIds,
  onToggleFavourite,
  onSelectRestaurant,
}: {
  restaurants: Restaurant[];
  favouriteIds: string[];
  onToggleFavourite: (id: string) => void;
  onSelectRestaurant: (r: Restaurant) => void;
}) {
  const [query, setQuery] = useState("");
  const [partySize, setPartySize] = useState(2);
  const [timeFilter, setTimeFilter] = useState<"now" | "tonight" | "any">("any");
  const [selectedCuisines, setSelectedCuisines] = useState<string[]>([]);
  const [selectedVibes, setSelectedVibes] = useState<string[]>([]);
  const [distance, setDistance] = useState(5);
  const [showFilters, setShowFilters] = useState(false);

  const toggleCuisine = (c: string) =>
    setSelectedCuisines((prev) => prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]);
  const toggleVibe = (v: string) =>
    setSelectedVibes((prev) => prev.includes(v) ? prev.filter((x) => x !== v) : [...prev, v]);

  const results = useMemo(() => {
    let filtered = restaurants;
    if (query) {
      const q = query.toLowerCase();
      filtered = filtered.filter((r) =>
        r.name.toLowerCase().includes(q) || r.cuisine.toLowerCase().includes(q)
      );
    }
    if (selectedCuisines.length > 0)
      filtered = filtered.filter((r) =>
        selectedCuisines.some((c) => r.cuisine.toLowerCase().includes(c.toLowerCase()))
      );
    if (selectedVibes.length > 0)
      filtered = filtered.filter((r) =>
        selectedVibes.some((v) => r.vibes.some((rv) => rv.toLowerCase().includes(v.toLowerCase())))
      );
    if (timeFilter === "now") filtered = filtered.filter((r) => r.available);
    filtered = filtered.filter((r) => r.cyclingMinutes <= distance * 2);
    return filtered;
  }, [restaurants, query, selectedCuisines, selectedVibes, timeFilter, distance]);

  const activeFilterCount = selectedCuisines.length + selectedVibes.length + (timeFilter !== "any" ? 1 : 0);

  return (
    <div className="h-full flex flex-col pt-[env(safe-area-inset-top)]">
      <div className="px-5 pt-5 pb-2">
        <h1 className="text-[22px] font-normal text-charcoal-dark font-[family-name:var(--font-instrument)] mb-3">
          Search
        </h1>
        <div className="flex items-center gap-2.5">
          <div className="flex-1 relative">
            <MagnifyingGlassIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal/20" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Name or cuisine..."
              className="w-full bg-charcoal/[0.03] rounded-full pl-10 pr-10 py-3 text-[13px] font-medium border-0 focus:outline-none focus:ring-2 focus:ring-forest/10 placeholder:text-charcoal/18"
            />
            {query && (
              <button onClick={() => setQuery("")} className="absolute right-3.5 top-1/2 -translate-y-1/2">
                <Cross2Icon className="w-3.5 h-3.5 text-charcoal/20" />
              </button>
            )}
          </div>
          <motion.button
            whileTap={{ scale: 0.9 }}
            transition={spring}
            onClick={() => setShowFilters(!showFilters)}
            className={`relative w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
              showFilters || activeFilterCount > 0
                ? "bg-charcoal-dark text-white"
                : "bg-charcoal/[0.03] text-charcoal/30"
            }`}
          >
            <MixerHorizontalIcon className="w-4 h-4" />
            {activeFilterCount > 0 && (
              <div className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-terracotta text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                {activeFilterCount}
              </div>
            )}
          </motion.button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-5 pb-24">
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="space-y-5 py-4 mb-4 border-b border-charcoal/[0.04]"
          >
            {/* Party size */}
            <div>
              <label className="text-[11px] font-bold text-charcoal/20 uppercase tracking-[0.08em]">Party size</label>
              <div className="flex items-center gap-3 mt-2">
                <div className="flex items-center bg-charcoal/[0.03] rounded-full">
                  <motion.button whileTap={{ scale: 0.85 }} onClick={() => setPartySize(Math.max(1, partySize - 1))} className="px-3 py-2 text-charcoal/25">
                    <MinusIcon className="w-3 h-3" />
                  </motion.button>
                  <span className="text-[14px] font-bold text-charcoal-dark px-1 min-w-[20px] text-center tabular-nums">{partySize}</span>
                  <motion.button whileTap={{ scale: 0.85 }} onClick={() => setPartySize(Math.min(12, partySize + 1))} className="px-3 py-2 text-charcoal/25">
                    <PlusIcon className="w-3 h-3" />
                  </motion.button>
                </div>
              </div>
            </div>

            {/* Time */}
            <div>
              <label className="text-[11px] font-bold text-charcoal/20 uppercase tracking-[0.08em]">When</label>
              <div className="flex gap-2 mt-2">
                {(["now", "tonight", "any"] as const).map((t) => (
                  <motion.button
                    key={t}
                    whileTap={{ scale: 0.94 }}
                    transition={spring}
                    onClick={() => setTimeFilter(t)}
                    className={`text-[12px] font-semibold px-4 py-2 rounded-full transition-all duration-200 ${
                      timeFilter === t ? "bg-charcoal-dark text-white" : "bg-charcoal/[0.03] text-charcoal/30"
                    }`}
                  >
                    {t === "now" ? "Now" : t === "tonight" ? "Tonight" : "Any time"}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Distance */}
            <div>
              <label className="text-[11px] font-bold text-charcoal/20 uppercase tracking-[0.08em]">
                Distance — <span className="text-charcoal/40">{distance} km</span>
              </label>
              <input
                type="range"
                min={1}
                max={10}
                value={distance}
                onChange={(e) => setDistance(Number(e.target.value))}
                className="w-full mt-2 accent-forest h-1"
              />
            </div>

            {/* Cuisine */}
            <div>
              <label className="text-[11px] font-bold text-charcoal/20 uppercase tracking-[0.08em]">Cuisine</label>
              <div className="flex flex-wrap gap-1.5 mt-2">
                {cuisineOptions.slice(0, 10).map((c) => (
                  <motion.button
                    key={c}
                    whileTap={{ scale: 0.92 }}
                    transition={spring}
                    onClick={() => toggleCuisine(c)}
                    className={`text-[11px] font-semibold px-3 py-1.5 rounded-full transition-all duration-200 ${
                      selectedCuisines.includes(c) ? "bg-forest text-white" : "bg-charcoal/[0.03] text-charcoal/30"
                    }`}
                  >
                    {c}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Vibe */}
            <div>
              <label className="text-[11px] font-bold text-charcoal/20 uppercase tracking-[0.08em]">Vibe</label>
              <div className="flex flex-wrap gap-1.5 mt-2">
                {vibeOptions.slice(0, 8).map((v) => (
                  <motion.button
                    key={v}
                    whileTap={{ scale: 0.92 }}
                    transition={spring}
                    onClick={() => toggleVibe(v)}
                    className={`text-[11px] font-semibold px-3 py-1.5 rounded-full transition-all duration-200 ${
                      selectedVibes.includes(v) ? "bg-blush text-charcoal-dark" : "bg-charcoal/[0.03] text-charcoal/30"
                    }`}
                  >
                    {v}
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Results */}
        <p className="text-[11px] font-bold text-charcoal/15 uppercase tracking-[0.08em] mb-3 mt-2">
          {results.length} result{results.length !== 1 ? "s" : ""}
        </p>
        {results.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-12 h-12 rounded-full bg-charcoal/[0.03] flex items-center justify-center mx-auto mb-3">
              <MagnifyingGlassIcon className="w-5 h-5 text-charcoal/12" />
            </div>
            <p className="text-[14px] text-charcoal/30 font-medium">No matches</p>
            <p className="text-[12px] text-charcoal/15 mt-1">Try fewer filters or a wider area</p>
          </div>
        ) : (
          results.map((r, i) => (
            <motion.div
              key={r.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...spring, delay: i * 0.03 }}
            >
              <RestaurantCard
                restaurant={r}
                isFavourite={favouriteIds.includes(r.id)}
                onToggleFavourite={onToggleFavourite}
                onSelect={onSelectRestaurant}
              />
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
