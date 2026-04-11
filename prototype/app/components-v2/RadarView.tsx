"use client";

import { useState, useMemo, lazy, Suspense, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MagnifyingGlassIcon,
  HeartFilledIcon,
  Cross2Icon,
  MixerHorizontalIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  LightningBoltIcon,
  StarFilledIcon,
  CheckIcon,
  CalendarIcon,
  ClockIcon,
  CrossCircledIcon,
} from "@radix-ui/react-icons";
import type { Restaurant } from "../data/restaurants";
import { cuisineOptions, vibeOptions } from "../data/restaurants";
import RestaurantCard from "./RestaurantCard";

const MapView = lazy(() => import("./MapView"));

const spring = { type: "spring" as const, stiffness: 380, damping: 30, mass: 0.8 };

/* ─── List Icon SVG ─── */
function ListIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  );
}

/* ─── Location Pin Icon ─── */
function LocationPinIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="10" r="3" />
      <path d="M12 2C7.58 2 4 5.58 4 10c0 5.25 8 12 8 12s8-6.75 8-12c0-4.42-3.58-8-8-8z" />
    </svg>
  );
}

function FilterChip({ active, onClick, icon, children }: {
  active: boolean; onClick: () => void; icon?: React.ReactNode; children: React.ReactNode;
}) {
  return (
    <motion.button whileTap={{ scale: 0.92 }} onClick={onClick}
      className={`flex items-center gap-1.5 text-[12px] font-semibold px-4 py-2.5 rounded-full shadow-[0_2px_12px_rgba(0,0,0,0.06)] transition-all whitespace-nowrap shrink-0 ${
        active ? "bg-ate-ink text-white" : "bg-white text-ate-ink border border-ate-ink/[0.08]"
      }`}>
      {icon}{children}
    </motion.button>
  );
}

/* ─── Custom Sort Picker ─── */
const SORT_OPTIONS: { value: SortMode; label: string }[] = [
  { value: "relevant", label: "Relevant" },
  { value: "distance", label: "Nearest" },
  { value: "rating", label: "Top rated" },
  { value: "name", label: "A-Z" },
];

function SortPicker({ value, onChange }: { value: SortMode; onChange: (v: SortMode) => void }) {
  const [open, setOpen] = useState(false);
  const current = SORT_OPTIONS.find((o) => o.value === value)!;

  return (
    <div className="relative">
      <motion.button whileTap={{ scale: 0.92 }} onClick={() => setOpen(!open)}
        className="flex items-center gap-1 text-[11px] font-editorial font-bold text-ate-ink bg-ate-grey rounded-full px-3 py-1.5 uppercase tracking-[0.05em]">
        {current.label}
        <ChevronDownIcon className="w-3 h-3 text-ate-muted" />
      </motion.button>
      <AnimatePresence>
        {open && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: -4, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -4, scale: 0.95 }}
              transition={{ duration: 0.15, ease: [0.22, 1, 0.36, 1] }}
              className="absolute right-0 top-[calc(100%+6px)] z-50 bg-white rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.12)] border border-ate-ink/[0.05] overflow-hidden min-w-[140px]"
            >
              {SORT_OPTIONS.map((opt) => (
                <button key={opt.value}
                  onClick={() => { onChange(opt.value); setOpen(false); }}
                  className={`w-full flex items-center justify-between gap-3 px-4 py-2.5 text-[12px] font-semibold transition-colors ${
                    value === opt.value ? "text-ate-ink bg-ate-grey/60" : "text-ate-muted hover:bg-ate-grey/30"
                  }`}>
                  <span className="uppercase tracking-[0.05em]">{opt.label}</span>
                  {value === opt.value && <CheckIcon className="w-3.5 h-3.5 text-ate-ink" />}
                </button>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─── Custom Date Picker ─── */
const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const DAY_LABELS = ["Su","Mo","Tu","We","Th","Fr","Sa"];

function DatePicker({ value, onChange, onClose }: { value: string; onChange: (d: string) => void; onClose: () => void }) {
  const today = new Date();
  const selected = value ? new Date(value + "T00:00:00") : null;
  const [viewYear, setViewYear] = useState(selected?.getFullYear() ?? today.getFullYear());
  const [viewMonth, setViewMonth] = useState(selected?.getMonth() ?? today.getMonth());

  const firstDay = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const cells: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(viewYear - 1); }
    else setViewMonth(viewMonth - 1);
  };
  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(viewYear + 1); }
    else setViewMonth(viewMonth + 1);
  };
  const pick = (day: number) => {
    const m = String(viewMonth + 1).padStart(2, "0");
    const d = String(day).padStart(2, "0");
    onChange(`${viewYear}-${m}-${d}`);
    onClose();
  };
  const isSelected = (day: number) =>
    selected && selected.getFullYear() === viewYear && selected.getMonth() === viewMonth && selected.getDate() === day;
  const isToday = (day: number) =>
    today.getFullYear() === viewYear && today.getMonth() === viewMonth && today.getDate() === day;

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <motion.button whileTap={{ scale: 0.85 }} onClick={prevMonth} className="w-8 h-8 rounded-full bg-ate-grey flex items-center justify-center">
          <ChevronLeftIcon className="w-4 h-4 text-ate-ink/50" />
        </motion.button>
        <span className="text-[15px] font-editorial font-bold text-ate-ink">{MONTHS[viewMonth]} {viewYear}</span>
        <motion.button whileTap={{ scale: 0.85 }} onClick={nextMonth} className="w-8 h-8 rounded-full bg-ate-grey flex items-center justify-center">
          <ChevronRightIcon className="w-4 h-4 text-ate-ink/50" />
        </motion.button>
      </div>
      <div className="grid grid-cols-7 gap-0 mb-1">
        {DAY_LABELS.map((d) => (
          <div key={d} className="text-center text-[10px] font-bold text-ate-muted uppercase tracking-wider py-1.5">{d}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-y-0.5">
        {cells.map((day, i) => (
          <div key={i} className="flex items-center justify-center">
            {day ? (
              <motion.button whileTap={{ scale: 0.85 }} onClick={() => pick(day)}
                className={`w-10 h-10 rounded-full text-[14px] font-semibold flex items-center justify-center transition-colors ${
                  isSelected(day) ? "bg-ate-ink text-white"
                    : isToday(day) ? "bg-ate-red/10 text-ate-red font-bold"
                    : "text-ate-ink/50 active:bg-ate-grey"
                }`}>{day}</motion.button>
            ) : <div className="w-10 h-10" />}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Custom Time Picker ─── */
function TimePicker({ value, onChange, onClose }: { value: string; onChange: (t: string) => void; onClose: () => void }) {
  const [h, m] = value.split(":").map(Number);
  const [hour, setHour] = useState(h);
  const [minute, setMinute] = useState(Math.floor(m / 15) * 15);

  const hours = Array.from({ length: 24 }, (_, i) => i);
  const minutes = [0, 15, 30, 45];

  const confirm = () => {
    onChange(`${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`);
    onClose();
  };

  return (
    <div>
      <p className="text-[9px] font-editorial font-bold text-ate-muted uppercase tracking-[0.15em] mb-3">Select time</p>
      <div className="flex gap-3 mb-3">
        <div className="flex-1">
          <p className="text-[9px] font-bold text-ate-muted uppercase tracking-wider mb-1.5 text-center">Hour</p>
          <div className="h-[120px] overflow-y-auto no-scrollbar rounded-xl bg-ate-grey/50">
            {hours.map((hr) => (
              <button key={hr} onClick={() => setHour(hr)}
                className={`w-full py-1.5 text-center text-[13px] font-semibold transition-colors rounded-lg ${
                  hour === hr ? "bg-ate-ink text-white" : "text-ate-ink/40 hover:bg-ate-grey"
                }`}>
                {String(hr).padStart(2, "0")}
              </button>
            ))}
          </div>
        </div>
        <div className="flex-1">
          <p className="text-[9px] font-bold text-ate-muted uppercase tracking-wider mb-1.5 text-center">Min</p>
          <div className="rounded-xl bg-ate-grey/50">
            {minutes.map((min) => (
              <button key={min} onClick={() => setMinute(min)}
                className={`w-full py-2 text-center text-[13px] font-semibold transition-colors rounded-lg ${
                  minute === min ? "bg-ate-ink text-white" : "text-ate-ink/40 hover:bg-ate-grey"
                }`}>
                {String(min).padStart(2, "0")}
              </button>
            ))}
          </div>
        </div>
      </div>
      <motion.button whileTap={{ scale: 0.96 }} onClick={confirm}
        className="w-full bg-ate-ink text-white text-[12px] font-bold py-2.5 rounded-xl">
        Set {String(hour).padStart(2, "0")}:{String(minute).padStart(2, "0")}
      </motion.button>
    </div>
  );
}

type SortMode = "relevant" | "distance" | "rating" | "name";

/* ─── Location suggestions ─── */
const LOCATION_SUGGESTIONS = [
  { label: "Current location", icon: "gps" },
  { label: "Amsterdam", icon: "pin" },
  { label: "Amsterdam Centrum", icon: "pin" },
  { label: "Amsterdam Zuid", icon: "pin" },
  { label: "Amsterdam West", icon: "pin" },
  { label: "Amsterdam Oost", icon: "pin" },
  { label: "De Pijp", icon: "pin" },
  { label: "Jordaan", icon: "pin" },
  { label: "Oud-West", icon: "pin" },
];

export default function RadarView({
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
  const [searchOpen, setSearchOpen] = useState(false);
  const [listOpen, setListOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [location, setLocation] = useState("Current location");
  const [showPetFriendlyOnly, setShowPetFriendlyOnly] = useState(false);
  const [date, setDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [time, setTime] = useState(() =>
    new Date().toLocaleTimeString("en-NL", { hour: "2-digit", minute: "2-digit", hour12: false })
  );
  const [guests, setGuests] = useState(2);
  const [showAllRestaurants, setShowAllRestaurants] = useState(false);
  const [showFavouritesOnly, setShowFavouritesOnly] = useState(false);
  const [showDealsOnly, setShowDealsOnly] = useState(false);
  const [showMichelinOnly, setShowMichelinOnly] = useState(false);
  const [showNewOnly, setShowNewOnly] = useState(false);
  const [minRating, setMinRating] = useState(0);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [selectedCuisines, setSelectedCuisines] = useState<string[]>([]);
  const [selectedVibes, setSelectedVibes] = useState<string[]>([]);
  const [distance, setDistance] = useState(10);
  const [sortMode, setSortMode] = useState<SortMode>("relevant");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [showLocationSuggestions, setShowLocationSuggestions] = useState(false);
  const [showRestaurantSuggestions, setShowRestaurantSuggestions] = useState(false);
  const locationInputRef = useRef<HTMLInputElement>(null);
  const queryInputRef = useRef<HTMLInputElement>(null);

  const toggleCuisine = (c: string) =>
    setSelectedCuisines((prev) => prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]);
  const toggleVibe = (v: string) =>
    setSelectedVibes((prev) => prev.includes(v) ? prev.filter((x) => x !== v) : [...prev, v]);

  const baseFiltered = useMemo(() => {
    let result = restaurants;
    if (query) {
      const q = query.toLowerCase();
      result = result.filter((r) =>
        r.name.toLowerCase().includes(q) || r.cuisine.toLowerCase().includes(q)
      );
    }
    if (showFavouritesOnly) result = result.filter((r) => favouriteIds.includes(r.id));
    if (showDealsOnly) result = result.filter((r) => r.hasOffer);
    if (showMichelinOnly) result = result.filter((r) => r.hasMichelinStar);
    if (showNewOnly) result = result.filter((r) => r.isNew);
    if (showPetFriendlyOnly) result = result.filter((r) => r.dogFriendly);
    if (minRating > 0) result = result.filter((r) => r.rating >= minRating);
    if (selectedCuisines.length > 0)
      result = result.filter((r) =>
        selectedCuisines.some((c) => r.cuisine.toLowerCase().includes(c.toLowerCase()))
      );
    if (selectedVibes.length > 0)
      result = result.filter((r) =>
        selectedVibes.some((v) => r.vibes.some((rv) => rv.toLowerCase().includes(v.toLowerCase())))
      );
    result = result.filter((r) => r.cyclingMinutes <= distance * 2);
    return result;
  }, [restaurants, query, showFavouritesOnly, showDealsOnly, showMichelinOnly, showNewOnly, showPetFriendlyOnly, minRating, favouriteIds, selectedCuisines, selectedVibes, distance]);

  const filtered = useMemo(() => {
    if (!showAllRestaurants) return baseFiltered.filter((r) => r.available);
    return baseFiltered;
  }, [baseFiltered, showAllRestaurants]);

  const sorted = useMemo(() => {
    const arr = [...filtered];
    switch (sortMode) {
      case "distance": return arr.sort((a, b) => a.cyclingMinutes - b.cyclingMinutes);
      case "rating": return arr.sort((a, b) => b.rating - a.rating);
      case "name": return arr.sort((a, b) => a.name.localeCompare(b.name));
      default: return arr;
    }
  }, [filtered, sortMode]);

  const availableCount = filtered.filter((r) => r.available).length;
  const activeFilterCount = selectedCuisines.length + selectedVibes.length + (showFavouritesOnly ? 1 : 0) + (distance < 10 ? 1 : 0) + (showMichelinOnly ? 1 : 0) + (showNewOnly ? 1 : 0);

  // Restaurant name autocomplete
  const restaurantSuggestions = useMemo(() => {
    if (!query || query.length < 1) return [];
    const q = query.toLowerCase();
    return restaurants.filter((r) =>
      r.name.toLowerCase().includes(q) || r.cuisine.toLowerCase().includes(q)
    ).slice(0, 5);
  }, [query, restaurants]);

  // Location autocomplete
  const locationSuggestions = useMemo(() => {
    if (!location) return LOCATION_SUGGESTIONS;
    const q = location.toLowerCase();
    return LOCATION_SUGGESTIONS.filter((s) => s.label.toLowerCase().includes(q));
  }, [location]);

  const handleSearch = () => {
    setSearchOpen(false);
    setShowDatePicker(false);
    setShowTimePicker(false);
    setShowLocationSuggestions(false);
    setShowRestaurantSuggestions(false);
    setListOpen(true);
  };

  // Format helpers
  const dateDisplay = (() => {
    if (!date) return "Pick date";
    const d = new Date(date + "T00:00:00");
    return d.toLocaleDateString("en-NL", { day: "numeric", month: "short" });
  })();

  return (
    <div className="h-full relative overflow-hidden bg-ate-white">
      {/* FULL SCREEN MAP */}
      <div className="absolute inset-0">
        <Suspense
          fallback={
            <div className="w-full h-full bg-ate-grey flex items-center justify-center">
              <div className="w-5 h-5 border-2 border-ate-ink border-t-transparent rounded-full animate-spin" />
            </div>
          }
        >
          <MapView
            restaurants={showAllRestaurants ? baseFiltered : filtered}
            favouriteIds={favouriteIds}
            showFavouritesOnly={showFavouritesOnly}
            onSelectRestaurant={onSelectRestaurant}
          />
        </Suspense>
      </div>

      {/* FLOATING SEARCH BAR — pill-shaped, white */}
      {!listOpen && (
        <div className="absolute top-0 left-0 right-0 z-30 pt-[max(env(safe-area-inset-top),12px)] px-4">
          <AnimatePresence mode="wait">
            {!searchOpen && (
              <motion.div
                key="search-collapsed"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <button
                  onClick={() => setSearchOpen(true)}
                  className="w-full flex items-center gap-3 bg-white rounded-full px-5 py-3.5 shadow-[0_4px_24px_rgba(0,0,0,0.1)]"
                >
                  <MagnifyingGlassIcon className="w-5 h-5 text-ate-ink" />
                  <div className="flex-1 text-left">
                    <p className="text-[14px] font-editorial font-bold text-ate-ink tracking-[-0.01em]">
                      {query || "Find a restaurant"}
                    </p>
                    <p className="text-[11px] text-ate-muted font-medium mt-0.5 tracking-wide">
                      {location} · {dateDisplay} · {time} · {guests} guest{guests !== 1 ? "s" : ""}
                    </p>
                  </div>
                  {activeFilterCount > 0 && (
                    <div className="w-6 h-6 bg-ate-red text-white text-[11px] font-bold rounded-full flex items-center justify-center font-editorial">
                      {activeFilterCount}
                    </div>
                  )}
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Horizontal filter chips */}
          {!searchOpen && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}
              className="flex gap-2 mt-2.5 overflow-x-auto no-scrollbar pb-1">
              <FilterChip active={!showAllRestaurants} onClick={() => setShowAllRestaurants(!showAllRestaurants)}>
                {showAllRestaurants ? "All" : "Open now"}
              </FilterChip>
              <FilterChip active={minRating >= 4} onClick={() => setMinRating(minRating >= 4 ? 0 : 4)}
                icon={<StarFilledIcon className="w-2.5 h-2.5" />}>
                Rating 4.0+
              </FilterChip>
              <FilterChip active={showMichelinOnly} onClick={() => setShowMichelinOnly(!showMichelinOnly)}>
                ⭐ Michelin
              </FilterChip>
              <FilterChip active={showNewOnly} onClick={() => setShowNewOnly(!showNewOnly)}>
                New
              </FilterChip>
              <FilterChip active={selectedCuisines.includes("Halal")} onClick={() => toggleCuisine("Halal")}>
                Halal
              </FilterChip>
              <FilterChip active={showPetFriendlyOnly} onClick={() => setShowPetFriendlyOnly(!showPetFriendlyOnly)}>
                Pet friendly
              </FilterChip>
              <FilterChip active={showDealsOnly} onClick={() => setShowDealsOnly(!showDealsOnly)}
                icon={<LightningBoltIcon className="w-2.5 h-2.5" />}>
                Offers
              </FilterChip>
              <FilterChip active={showFavouritesOnly} onClick={() => setShowFavouritesOnly(!showFavouritesOnly)}
                icon={<HeartFilledIcon className="w-2.5 h-2.5" />}>
                Saved
              </FilterChip>
              <FilterChip active={distance < 5} onClick={() => setDistance(distance < 5 ? 10 : 3)}>
                Nearby
              </FilterChip>
            </motion.div>
          )}
        </div>
      )}

      {/* FLOATING LIST BUTTON + COUNT — bottom of map */}
      {!searchOpen && !listOpen && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, ...spring }}
          className="absolute bottom-24 left-1/2 -translate-x-1/2 z-30"
        >
          <motion.button
            whileTap={{ scale: 0.92 }}
            transition={spring}
            onClick={() => setListOpen(true)}
            className="flex items-center gap-2.5 bg-white text-ate-ink px-5 py-3.5 rounded-full shadow-[0_4px_24px_rgba(0,0,0,0.12)]"
          >
            <ListIcon className="w-5 h-5" />
            <span className="font-editorial font-bold text-[14px]">
              {availableCount} {showAllRestaurants ? "restaurants" : "available"}
            </span>
          </motion.button>
        </motion.div>
      )}

      {/* ═══════ FULL-SCREEN SEARCH OVERLAY ═══════ */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            key="search-fullscreen"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ ...spring, stiffness: 400 }}
            className="fixed inset-0 z-[55] bg-white overflow-y-auto"
          >
            {/* Header */}
            <div className="sticky top-0 z-10 bg-white pt-[max(env(safe-area-inset-top),12px)]">
              <div className="flex items-center justify-between px-5 pt-3 pb-3">
                <h2 className="font-editorial text-[24px] font-extrabold text-ate-ink tracking-[-0.02em]">
                  Find your table
                </h2>
                <motion.button
                  whileTap={{ scale: 0.85 }}
                  onClick={() => { setSearchOpen(false); setShowDatePicker(false); setShowTimePicker(false); setShowLocationSuggestions(false); setShowRestaurantSuggestions(false); }}
                  className="w-9 h-9 rounded-full bg-ate-grey flex items-center justify-center"
                >
                  <Cross2Icon className="w-4.5 h-4.5 text-ate-ink" />
                </motion.button>
              </div>
            </div>

            <div className="px-5 pb-40">
              {/* Search input with autocomplete */}
              <div className="relative mb-4">
                <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-ate-muted" />
                <input
                  ref={queryInputRef}
                  type="text"
                  value={query}
                  onChange={(e) => { setQuery(e.target.value); setShowRestaurantSuggestions(true); setShowLocationSuggestions(false); }}
                  onFocus={() => { setShowRestaurantSuggestions(true); setShowLocationSuggestions(false); }}
                  placeholder="Restaurant name or cuisine..."
                  className="w-full bg-ate-grey rounded-2xl pl-12 pr-12 py-4 text-[15px] font-medium border-0 focus:outline-none focus:ring-2 focus:ring-ate-ink/10 placeholder:text-ate-muted/50"
                  autoFocus
                />
                {query && (
                  <button onClick={() => { setQuery(""); setShowRestaurantSuggestions(false); }} className="absolute right-4 top-1/2 -translate-y-1/2">
                    <CrossCircledIcon className="w-4 h-4 text-ate-muted" />
                  </button>
                )}

                {/* Restaurant autocomplete dropdown */}
                <AnimatePresence>
                  {showRestaurantSuggestions && restaurantSuggestions.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      className="absolute left-0 right-0 top-[calc(100%+4px)] z-20 bg-white rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.12)] border border-ate-ink/[0.05] overflow-hidden"
                    >
                      {restaurantSuggestions.map((r) => (
                        <button
                          key={r.id}
                          onClick={() => { setQuery(r.name); setShowRestaurantSuggestions(false); }}
                          className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-ate-grey/50 transition-colors"
                        >
                          <img src={r.photo} alt="" className="w-10 h-10 rounded-lg object-cover" />
                          <div>
                            <p className="text-[13px] font-semibold text-ate-ink">{r.name}</p>
                            <p className="text-[11px] text-ate-muted">{r.cuisine} · {r.priceRange}</p>
                          </div>
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Filter grid — bigger */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                {/* Location with autocomplete */}
                <div className="relative">
                  <div className="bg-ate-grey rounded-2xl px-4 py-3.5">
                    <label className="text-[10px] font-editorial font-bold text-ate-muted uppercase tracking-[0.15em]">Location</label>
                    <div className="flex items-center gap-2 mt-1">
                      <LocationPinIcon className="w-4 h-4 text-ate-muted shrink-0" />
                      <input
                        ref={locationInputRef}
                        type="text"
                        value={location}
                        onChange={(e) => { setLocation(e.target.value); setShowLocationSuggestions(true); setShowRestaurantSuggestions(false); }}
                        onFocus={() => { setShowLocationSuggestions(true); setShowRestaurantSuggestions(false); }}
                        className="block w-full bg-transparent text-[14px] font-semibold text-ate-ink border-0 p-0 focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Location autocomplete dropdown */}
                  <AnimatePresence>
                    {showLocationSuggestions && (
                      <motion.div
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -4 }}
                        className="absolute left-0 right-0 top-[calc(100%+4px)] z-20 bg-white rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.12)] border border-ate-ink/[0.05] overflow-hidden"
                      >
                        {locationSuggestions.map((s) => (
                          <button
                            key={s.label}
                            onClick={() => { setLocation(s.label); setShowLocationSuggestions(false); }}
                            className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-ate-grey/50 transition-colors"
                          >
                            {s.icon === "gps" ? (
                              <div className="w-8 h-8 rounded-full bg-ate-red/10 flex items-center justify-center">
                                <svg className="w-4 h-4 text-ate-red" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                  <circle cx="12" cy="12" r="3" />
                                  <path d="M12 2v4m0 12v4m10-10h-4M6 12H2" />
                                </svg>
                              </div>
                            ) : (
                              <div className="w-8 h-8 rounded-full bg-ate-grey flex items-center justify-center">
                                <LocationPinIcon className="w-4 h-4 text-ate-muted" />
                              </div>
                            )}
                            <span className={`text-[13px] font-semibold ${s.icon === "gps" ? "text-ate-red" : "text-ate-ink"}`}>
                              {s.label}
                            </span>
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Date field */}
                <div className="bg-ate-grey rounded-2xl px-4 py-3.5">
                  <label className="text-[10px] font-editorial font-bold text-ate-muted uppercase tracking-[0.15em]">Date</label>
                  <button onClick={() => { setShowDatePicker(!showDatePicker); setShowTimePicker(false); setShowLocationSuggestions(false); setShowRestaurantSuggestions(false); }}
                    className="flex items-center gap-2 mt-1 w-full text-left">
                    <CalendarIcon className="w-4 h-4 text-ate-muted" />
                    <span className="text-[14px] font-semibold text-ate-ink">{dateDisplay}</span>
                  </button>
                </div>

                {/* Time field */}
                <div className="bg-ate-grey rounded-2xl px-4 py-3.5">
                  <label className="text-[10px] font-editorial font-bold text-ate-muted uppercase tracking-[0.15em]">Time</label>
                  <button onClick={() => { setShowTimePicker(!showTimePicker); setShowDatePicker(false); setShowLocationSuggestions(false); setShowRestaurantSuggestions(false); }}
                    className="flex items-center gap-2 mt-1 w-full text-left">
                    <ClockIcon className="w-4 h-4 text-ate-muted" />
                    <span className="text-[14px] font-semibold text-ate-ink">{time}</span>
                  </button>
                </div>

                {/* Guests */}
                <div className="bg-ate-grey rounded-2xl px-4 py-3.5">
                  <label className="text-[10px] font-editorial font-bold text-ate-muted uppercase tracking-[0.15em]">Guests</label>
                  <div className="flex items-center gap-3 mt-1">
                    <motion.button whileTap={{ scale: 0.8 }} onClick={() => setGuests(Math.max(1, guests - 1))}
                      className="w-8 h-8 rounded-full bg-ate-ink text-white flex items-center justify-center text-[15px] font-bold">-</motion.button>
                    <span className="text-[15px] font-bold text-ate-ink min-w-[24px] text-center tabular-nums">{guests}</span>
                    <motion.button whileTap={{ scale: 0.8 }} onClick={() => setGuests(Math.min(12, guests + 1))}
                      className="w-8 h-8 rounded-full bg-ate-ink text-white flex items-center justify-center text-[15px] font-bold">+</motion.button>
                  </div>
                </div>
              </div>

              {/* Inline Date/Time pickers */}
              <AnimatePresence>
                {showDatePicker && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                    className="overflow-hidden mb-4"
                  >
                    <div className="bg-ate-grey/50 rounded-2xl p-4">
                      <DatePicker value={date} onChange={setDate} onClose={() => setShowDatePicker(false)} />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <AnimatePresence>
                {showTimePicker && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                    className="overflow-hidden mb-4"
                  >
                    <div className="bg-ate-grey/50 rounded-2xl p-4">
                      <TimePicker value={time} onChange={setTime} onClose={() => setShowTimePicker(false)} />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Advanced filters toggle */}
              <button onClick={() => { setShowAdvanced(!showAdvanced); setShowLocationSuggestions(false); setShowRestaurantSuggestions(false); }}
                className="flex items-center gap-2 text-[12px] font-editorial font-bold text-ate-muted uppercase tracking-[0.1em] mb-3">
                <MixerHorizontalIcon className="w-4 h-4" />
                More filters
                {showAdvanced ? <ChevronUpIcon className="w-3.5 h-3.5" /> : <ChevronDownIcon className="w-3.5 h-3.5" />}
              </button>

              <AnimatePresence>
                {showAdvanced && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                    className="overflow-hidden">
                    <div className="space-y-5 pb-4">
                      {/* Distance slider — bigger */}
                      <div>
                        <label className="text-[10px] font-editorial font-bold text-ate-muted uppercase tracking-[0.15em]">
                          Distance — {distance} km
                        </label>
                        <input
                          type="range"
                          min={1}
                          max={10}
                          value={distance}
                          onChange={(e) => setDistance(Number(e.target.value))}
                          className="w-full mt-3 h-2 accent-ate-red"
                          style={{ height: "8px" }}
                        />
                      </div>

                      {/* Cuisine — bigger chips */}
                      <div>
                        <label className="text-[10px] font-editorial font-bold text-ate-muted uppercase tracking-[0.15em]">Cuisine</label>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {cuisineOptions.map((c) => (
                            <motion.button key={c} whileTap={{ scale: 0.92 }} onClick={() => toggleCuisine(c)}
                              className={`text-[12px] font-semibold px-4 py-2 rounded-full transition-all ${
                                selectedCuisines.includes(c) ? "bg-ate-ink text-white" : "bg-ate-grey text-ate-muted"
                              }`}>{c}</motion.button>
                          ))}
                        </div>
                      </div>

                      {/* Vibe — bigger chips */}
                      <div>
                        <label className="text-[10px] font-editorial font-bold text-ate-muted uppercase tracking-[0.15em]">Vibe</label>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {vibeOptions.map((v) => (
                            <motion.button key={v} whileTap={{ scale: 0.92 }} onClick={() => toggleVibe(v)}
                              className={`text-[12px] font-semibold px-4 py-2 rounded-full transition-all ${
                                selectedVibes.includes(v) ? "bg-ate-coral text-white" : "bg-ate-grey text-ate-muted"
                              }`}>{v}</motion.button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Sticky search button at bottom */}
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-ate-ink/[0.05] px-5 py-4 pb-[max(env(safe-area-inset-bottom),16px)] z-10">
              <motion.button whileTap={{ scale: 0.97 }} transition={spring}
                onClick={handleSearch}
                className="w-full bg-ate-red text-white font-editorial font-bold text-[16px] py-4 rounded-2xl tracking-[-0.01em] shadow-[0_4px_16px_rgba(255,68,56,0.3)]">
                Search · {filtered.length} result{filtered.length !== 1 ? "s" : ""}
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══════ FULL-SCREEN LIST VIEW ═══════ */}
      <AnimatePresence>
        {listOpen && !searchOpen && (
          <motion.div
            key="list-fullscreen"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 35, mass: 0.9 }}
            className="fixed inset-0 z-40 bg-white"
          >
            {/* List header */}
            <div className="sticky top-0 z-10 bg-white pt-[max(env(safe-area-inset-top),12px)]">
              <div className="px-5 pt-3 pb-3 flex items-center justify-between">
                <div className="flex items-baseline gap-2">
                  <span className="font-editorial text-[36px] font-extrabold text-ate-ink leading-none tracking-[-0.03em]">
                    {availableCount}
                  </span>
                  <p className="text-[12px] font-editorial font-bold text-ate-muted uppercase tracking-[0.1em]">
                    {showAllRestaurants ? "Restaurants" : "Available"}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <SortPicker value={sortMode} onChange={setSortMode} />
                  <motion.button whileTap={{ scale: 0.85 }}
                    onClick={() => setListOpen(false)}
                    className="w-9 h-9 rounded-full bg-ate-grey flex items-center justify-center">
                    <Cross2Icon className="w-4 h-4 text-ate-ink" />
                  </motion.button>
                </div>
              </div>

              {/* Filter chips in list view */}
              <div className="flex gap-2 px-5 pb-3 overflow-x-auto no-scrollbar">
                <FilterChip active={!showAllRestaurants} onClick={() => setShowAllRestaurants(!showAllRestaurants)}>
                  {showAllRestaurants ? "All" : "Open now"}
                </FilterChip>
                <FilterChip active={showMichelinOnly} onClick={() => setShowMichelinOnly(!showMichelinOnly)}>
                  ⭐ Michelin
                </FilterChip>
                <FilterChip active={showNewOnly} onClick={() => setShowNewOnly(!showNewOnly)}>
                  New
                </FilterChip>
                <FilterChip active={minRating >= 4} onClick={() => setMinRating(minRating >= 4 ? 0 : 4)}
                  icon={<StarFilledIcon className="w-2.5 h-2.5" />}>
                  4.0+
                </FilterChip>
                <FilterChip active={selectedCuisines.includes("Halal")} onClick={() => toggleCuisine("Halal")}>
                  Halal
                </FilterChip>
                <FilterChip active={showPetFriendlyOnly} onClick={() => setShowPetFriendlyOnly(!showPetFriendlyOnly)}>
                  Pet friendly
                </FilterChip>
              </div>

              <div className="mx-5 h-[1px] bg-ate-ink/[0.06]" />
            </div>

            {/* Restaurant cards */}
            <div className="px-4 pt-2 overflow-y-auto pb-24" style={{ height: "calc(100vh - 160px)" }}>
              {sorted.length === 0 ? (
                <div className="text-center py-16">
                  <p className="text-[16px] font-editorial font-bold text-ate-ink/25">No restaurants found</p>
                  <p className="text-[13px] text-ate-muted mt-1.5">Try adjusting your filters</p>
                </div>
              ) : (
                sorted.map((r, i) => (
                  <motion.div key={r.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ ...spring, delay: i * 0.04 }}>
                    <RestaurantCard restaurant={r} isFavourite={favouriteIds.includes(r.id)}
                      onToggleFavourite={onToggleFavourite} onSelect={onSelectRestaurant} />
                  </motion.div>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* DATE PICKER MODAL — only when NOT in full-screen search */}
      <AnimatePresence>
        {showDatePicker && !searchOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowDatePicker(false)}
              className="fixed inset-0 bg-ate-ink/20 backdrop-blur-[2px] z-[60]" />
            <motion.div
              initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 400, damping: 40 }}
              className="fixed bottom-0 left-0 right-0 z-[61] bg-white rounded-t-[28px] px-5 pb-10 pt-3"
            >
              <div className="flex justify-center mb-3"><div className="w-9 h-[4px] bg-ate-ink/10 rounded-full" /></div>
              <DatePicker value={date} onChange={setDate} onClose={() => setShowDatePicker(false)} />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* TIME PICKER MODAL — only when NOT in full-screen search */}
      <AnimatePresence>
        {showTimePicker && !searchOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowTimePicker(false)}
              className="fixed inset-0 bg-ate-ink/20 backdrop-blur-[2px] z-[60]" />
            <motion.div
              initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 400, damping: 40 }}
              className="fixed bottom-0 left-0 right-0 z-[61] bg-white rounded-t-[28px] px-5 pb-10 pt-3"
            >
              <div className="flex justify-center mb-3"><div className="w-9 h-[4px] bg-ate-ink/10 rounded-full" /></div>
              <TimePicker value={time} onChange={setTime} onClose={() => setShowTimePicker(false)} />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
