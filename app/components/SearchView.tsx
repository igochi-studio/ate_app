"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  MagnifyingGlassIcon,
  Cross2Icon,
  MinusIcon,
  PlusIcon,
} from "@radix-ui/react-icons";
import type { Restaurant } from "../data/restaurants";
import { cuisineOptions, vibeOptions } from "../data/restaurants";
import RestaurantCard from "./RestaurantCard";

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
  const [showFilters, setShowFilters] = useState(true);

  const toggleCuisine = (c: string) => {
    setSelectedCuisines((prev) =>
      prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]
    );
  };

  const toggleVibe = (v: string) => {
    setSelectedVibes((prev) =>
      prev.includes(v) ? prev.filter((x) => x !== v) : [...prev, v]
    );
  };

  const results = useMemo(() => {
    let filtered = restaurants;

    if (query) {
      const q = query.toLowerCase();
      filtered = filtered.filter(
        (r) =>
          r.name.toLowerCase().includes(q) ||
          r.cuisine.toLowerCase().includes(q)
      );
    }

    if (selectedCuisines.length > 0) {
      filtered = filtered.filter((r) =>
        selectedCuisines.some((c) => r.cuisine.toLowerCase().includes(c.toLowerCase()))
      );
    }

    if (selectedVibes.length > 0) {
      filtered = filtered.filter((r) =>
        selectedVibes.some((v) => r.vibes.some((rv) => rv.toLowerCase().includes(v.toLowerCase())))
      );
    }

    if (timeFilter === "now") {
      filtered = filtered.filter((r) => r.available);
    }

    filtered = filtered.filter((r) => r.cyclingMinutes <= distance * 2);

    return filtered;
  }, [restaurants, query, selectedCuisines, selectedVibes, timeFilter, distance]);

  return (
    <div className="h-full flex flex-col pt-[env(safe-area-inset-top)]">
      <div className="px-4 pt-4 pb-2">
        <h1 className="text-xl font-bold text-charcoal-dark mb-3">Search</h1>
        <div className="relative">
          <MagnifyingGlassIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal/40" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Restaurant name or cuisine..."
            className="w-full bg-white rounded-2xl pl-10 pr-10 py-3.5 text-sm border border-light-grey/50 shadow-sm focus:outline-none focus:border-forest/30 focus:ring-2 focus:ring-forest/10 placeholder:text-charcoal/30"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="absolute right-3.5 top-1/2 -translate-y-1/2"
            >
              <Cross2Icon className="w-4 h-4 text-charcoal/40" />
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-24">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="text-xs font-medium text-forest mb-3"
        >
          {showFilters ? "Hide filters" : "Show filters"}
        </button>

        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-4 mb-5"
          >
            {/* Party size */}
            <div>
              <label className="text-xs font-semibold text-charcoal/40 uppercase tracking-wider">
                Party size
              </label>
              <div className="flex items-center gap-3 mt-1.5">
                <div className="flex items-center bg-white rounded-xl border border-light-grey/50">
                  <button
                    onClick={() => setPartySize(Math.max(1, partySize - 1))}
                    className="px-3 py-2 text-charcoal/40"
                  >
                    <MinusIcon className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-sm font-semibold text-charcoal-dark px-2 min-w-[24px] text-center">
                    {partySize}
                  </span>
                  <button
                    onClick={() => setPartySize(Math.min(12, partySize + 1))}
                    className="px-3 py-2 text-charcoal/40"
                  >
                    <PlusIcon className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Time */}
            <div>
              <label className="text-xs font-semibold text-charcoal/40 uppercase tracking-wider">
                When
              </label>
              <div className="flex gap-2 mt-1.5">
                {(["now", "tonight", "any"] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setTimeFilter(t)}
                    className={`text-sm font-medium px-4 py-2 rounded-xl transition-colors ${
                      timeFilter === t
                        ? "bg-forest text-white"
                        : "bg-white text-charcoal/60 border border-light-grey/50"
                    }`}
                  >
                    {t === "now" ? "Now" : t === "tonight" ? "Tonight" : "Any time"}
                  </button>
                ))}
              </div>
            </div>

            {/* Distance */}
            <div>
              <label className="text-xs font-semibold text-charcoal/40 uppercase tracking-wider">
                Distance — {distance} km
              </label>
              <input
                type="range"
                min={1}
                max={10}
                value={distance}
                onChange={(e) => setDistance(Number(e.target.value))}
                className="w-full mt-2 accent-forest"
              />
            </div>

            {/* Cuisine */}
            <div>
              <label className="text-xs font-semibold text-charcoal/40 uppercase tracking-wider">
                Cuisine
              </label>
              <div className="flex flex-wrap gap-2 mt-1.5">
                {cuisineOptions.slice(0, 8).map((c) => (
                  <button
                    key={c}
                    onClick={() => toggleCuisine(c)}
                    className={`text-xs font-medium px-3 py-1.5 rounded-full transition-colors ${
                      selectedCuisines.includes(c)
                        ? "bg-forest text-white"
                        : "bg-white text-charcoal/60 border border-light-grey/50"
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            {/* Vibe */}
            <div>
              <label className="text-xs font-semibold text-charcoal/40 uppercase tracking-wider">
                Vibe
              </label>
              <div className="flex flex-wrap gap-2 mt-1.5">
                {vibeOptions.slice(0, 6).map((v) => (
                  <button
                    key={v}
                    onClick={() => toggleVibe(v)}
                    className={`text-xs font-medium px-3 py-1.5 rounded-full transition-colors ${
                      selectedVibes.includes(v)
                        ? "bg-blush text-charcoal-dark"
                        : "bg-white text-charcoal/60 border border-light-grey/50"
                    }`}
                  >
                    {v}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Results */}
        <div className="mt-2">
          <p className="text-xs text-charcoal/40 mb-3">
            {results.length} result{results.length !== 1 ? "s" : ""}
          </p>
          {results.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-4xl mb-3">🍽️</p>
              <p className="text-sm text-charcoal/50">No matches found</p>
              <p className="text-xs text-charcoal/30 mt-1">Try fewer filters or a wider area</p>
            </div>
          ) : (
            results.map((r) => (
              <RestaurantCard
                key={r.id}
                restaurant={r}
                isFavourite={favouriteIds.includes(r.id)}
                onToggleFavourite={onToggleFavourite}
                onSelect={onSelectRestaurant}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
