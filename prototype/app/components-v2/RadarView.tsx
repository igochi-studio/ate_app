"use client";

import { useState, useMemo, lazy, Suspense, useRef, useCallback } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform, useAnimation, PanInfo } from "framer-motion";
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
} from "@radix-ui/react-icons";
import type { Restaurant } from "../data/restaurants";
import { cuisineOptions, vibeOptions } from "../data/restaurants";
import RestaurantCard from "./RestaurantCard";

const MapView = lazy(() => import("./MapView"));

const spring = { type: "spring" as const, stiffness: 380, damping: 30, mass: 0.8 };

function FilterChip({ active, onClick, icon, children }: {
  active: boolean; onClick: () => void; icon?: React.ReactNode; children: React.ReactNode;
}) {
  return (
    <motion.button whileTap={{ scale: 0.92 }} onClick={onClick}
      className={`flex items-center gap-1.5 text-[12px] font-semibold px-4 py-2 rounded-full shadow-[0_2px_12px_rgba(0,0,0,0.06)] transition-all whitespace-nowrap shrink-0 ${
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
const SHORT_MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
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
    <motion.div
      initial={{ opacity: 0, y: 6, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 6, scale: 0.96 }}
      transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
      className="bg-white rounded-2xl p-4 shadow-[0_8px_32px_rgba(0,0,0,0.12)] border border-ate-ink/[0.05]"
    >
      <div className="flex items-center justify-between mb-3">
        <motion.button whileTap={{ scale: 0.85 }} onClick={prevMonth} className="w-7 h-7 rounded-full bg-ate-grey flex items-center justify-center">
          <ChevronLeftIcon className="w-3.5 h-3.5 text-ate-ink/50" />
        </motion.button>
        <span className="text-[13px] font-editorial font-bold text-ate-ink">{MONTHS[viewMonth]} {viewYear}</span>
        <motion.button whileTap={{ scale: 0.85 }} onClick={nextMonth} className="w-7 h-7 rounded-full bg-ate-grey flex items-center justify-center">
          <ChevronRightIcon className="w-3.5 h-3.5 text-ate-ink/50" />
        </motion.button>
      </div>
      <div className="grid grid-cols-7 gap-0 mb-1">
        {DAY_LABELS.map((d) => (
          <div key={d} className="text-center text-[9px] font-bold text-ate-muted uppercase tracking-wider py-1">{d}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-0">
        {cells.map((day, i) => (
          <div key={i} className="flex items-center justify-center">
            {day ? (
              <motion.button whileTap={{ scale: 0.85 }} onClick={() => pick(day)}
                className={`w-8 h-8 rounded-full text-[12px] font-semibold flex items-center justify-center transition-colors ${
                  isSelected(day) ? "bg-ate-ink text-white"
                    : isToday(day) ? "bg-ate-red/10 text-ate-red font-bold"
                    : "text-ate-ink/50 hover:bg-ate-grey"
                }`}>{day}</motion.button>
            ) : <div className="w-8 h-8" />}
          </div>
        ))}
      </div>
    </motion.div>
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
    <motion.div
      initial={{ opacity: 0, y: 6, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 6, scale: 0.96 }}
      transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
      className="bg-white rounded-2xl p-4 shadow-[0_8px_32px_rgba(0,0,0,0.12)] border border-ate-ink/[0.05]"
    >
      <p className="text-[9px] font-editorial font-bold text-ate-muted uppercase tracking-[0.15em] mb-3">Select time</p>
      <div className="flex gap-3 mb-3">
        {/* Hour wheel */}
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
        {/* Minute wheel */}
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
    </motion.div>
  );
}

type SortMode = "relevant" | "distance" | "rating" | "name";

/* ─── Snap points (from bottom of screen) ─── */
const SNAP_COLLAPSED = 72;
const SNAP_PEEK = 220;
const SNAP_EXPANDED_VH = 0.78;

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
  const [query, setQuery] = useState("");
  const [location, setLocation] = useState("Amsterdam");
  const [date, setDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [time, setTime] = useState(() =>
    new Date().toLocaleTimeString("en-NL", { hour: "2-digit", minute: "2-digit", hour12: false })
  );
  const [guests, setGuests] = useState(2);
  const [showAllRestaurants, setShowAllRestaurants] = useState(false);
  const [showFavouritesOnly, setShowFavouritesOnly] = useState(false);
  const [showDealsOnly, setShowDealsOnly] = useState(false);
  const [minRating, setMinRating] = useState(0);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [selectedCuisines, setSelectedCuisines] = useState<string[]>([]);
  const [selectedVibes, setSelectedVibes] = useState<string[]>([]);
  const [distance, setDistance] = useState(10);
  const [sortMode, setSortMode] = useState<SortMode>("relevant");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  // Sheet drag state
  const sheetControls = useAnimation();
  const sheetY = useMotionValue(0);
  const currentSnap = useRef<"collapsed" | "peek" | "expanded">("peek");

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
  }, [restaurants, query, showFavouritesOnly, showDealsOnly, minRating, favouriteIds, selectedCuisines, selectedVibes, distance]);

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
  const activeFilterCount = selectedCuisines.length + selectedVibes.length + (showFavouritesOnly ? 1 : 0) + (distance < 10 ? 1 : 0);

  const getSnapY = useCallback((snap: "collapsed" | "peek" | "expanded") => {
    const vh = typeof window !== "undefined" ? window.innerHeight : 800;
    switch (snap) {
      case "collapsed": return vh - SNAP_COLLAPSED;
      case "peek": return vh - SNAP_PEEK;
      case "expanded": return vh * (1 - SNAP_EXPANDED_VH);
    }
  }, []);

  const snapTo = useCallback((snap: "collapsed" | "peek" | "expanded") => {
    currentSnap.current = snap;
    sheetControls.start({
      y: getSnapY(snap),
      transition: { type: "spring", stiffness: 400, damping: 40, mass: 0.8 },
    });
  }, [sheetControls, getSnapY]);

  const handleDragEnd = useCallback((_: unknown, info: PanInfo) => {
    const velocity = info.velocity.y;
    const currentY = sheetY.get();

    if (Math.abs(velocity) > 400) {
      if (velocity > 0) {
        if (currentSnap.current === "expanded") snapTo("peek");
        else snapTo("collapsed");
      } else {
        if (currentSnap.current === "collapsed") snapTo("peek");
        else snapTo("expanded");
      }
      return;
    }

    const distances = [
      { snap: "collapsed" as const, d: Math.abs(currentY - getSnapY("collapsed")) },
      { snap: "peek" as const, d: Math.abs(currentY - getSnapY("peek")) },
      { snap: "expanded" as const, d: Math.abs(currentY - getSnapY("expanded")) },
    ];
    distances.sort((a, b) => a.d - b.d);
    snapTo(distances[0].snap);
  }, [sheetY, getSnapY, snapTo]);

  const sheetRadius = useTransform(sheetY, [getSnapY("expanded"), getSnapY("peek")], [12, 28]);

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

      {/* FLOATING SEARCH BAR */}
      <div className="absolute top-0 left-0 right-0 z-30 pt-[max(env(safe-area-inset-top),12px)] px-4">
        <AnimatePresence mode="wait">
          {!searchOpen ? (
            <motion.div
              key="search-collapsed"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <button
                onClick={() => setSearchOpen(true)}
                className="w-full flex items-center gap-3 bg-white rounded-2xl px-5 py-3.5 shadow-[0_4px_24px_rgba(0,0,0,0.1)]"
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
          ) : (
            <motion.div
              key="search-expanded"
              initial={{ opacity: 0, scale: 0.98, y: -5 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98, y: -5 }}
              transition={{ ...spring, stiffness: 400 }}
              className="bg-white rounded-3xl shadow-[0_8px_40px_rgba(0,0,0,0.15)] overflow-hidden"
            >
              <div className="flex items-center justify-between px-5 pt-4 pb-2">
                <h2 className="font-editorial text-[20px] font-extrabold text-ate-ink tracking-[-0.02em]">
                  Find your table
                </h2>
                <motion.button
                  whileTap={{ scale: 0.85 }}
                  onClick={() => { setSearchOpen(false); setShowDatePicker(false); setShowTimePicker(false); }}
                  className="w-8 h-8 rounded-full bg-ate-grey flex items-center justify-center"
                >
                  <Cross2Icon className="w-4 h-4 text-ate-ink" />
                </motion.button>
              </div>

              {/* Search input */}
              <div className="px-5 pb-3">
                <div className="relative">
                  <MagnifyingGlassIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ate-muted" />
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Restaurant name or cuisine..."
                    className="w-full bg-ate-grey rounded-xl pl-10 pr-10 py-3 text-[13px] font-medium border-0 focus:outline-none focus:ring-2 focus:ring-ate-ink/10 placeholder:text-ate-muted/50"
                    autoFocus
                  />
                  {query && (
                    <button onClick={() => setQuery("")} className="absolute right-3.5 top-1/2 -translate-y-1/2">
                      <Cross2Icon className="w-3.5 h-3.5 text-ate-muted" />
                    </button>
                  )}
                </div>
              </div>

              {/* Filter grid */}
              <div className="px-5 pb-3 grid grid-cols-2 gap-2.5">
                <div className="bg-ate-grey rounded-xl px-3.5 py-2.5">
                  <label className="text-[9px] font-editorial font-bold text-ate-muted uppercase tracking-[0.15em]">Location</label>
                  <input type="text" value={location} onChange={(e) => setLocation(e.target.value)}
                    className="block w-full bg-transparent text-[13px] font-semibold text-ate-ink border-0 p-0 mt-0.5 focus:outline-none" />
                </div>

                {/* Custom date field */}
                <div className="bg-ate-grey rounded-xl px-3.5 py-2.5 relative">
                  <label className="text-[9px] font-editorial font-bold text-ate-muted uppercase tracking-[0.15em]">Date</label>
                  <button onClick={() => { setShowDatePicker(!showDatePicker); setShowTimePicker(false); }}
                    className="flex items-center gap-1.5 mt-0.5 w-full text-left">
                    <CalendarIcon className="w-3 h-3 text-ate-muted" />
                    <span className="text-[13px] font-semibold text-ate-ink">{dateDisplay}</span>
                  </button>
                  <AnimatePresence>
                    {showDatePicker && (
                      <div className="absolute left-0 right-0 top-[calc(100%+6px)] z-50" style={{ width: "calc(200% + 10px)" }}>
                        <DatePicker value={date} onChange={setDate} onClose={() => setShowDatePicker(false)} />
                      </div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Custom time field */}
                <div className="bg-ate-grey rounded-xl px-3.5 py-2.5 relative">
                  <label className="text-[9px] font-editorial font-bold text-ate-muted uppercase tracking-[0.15em]">Time</label>
                  <button onClick={() => { setShowTimePicker(!showTimePicker); setShowDatePicker(false); }}
                    className="flex items-center gap-1.5 mt-0.5 w-full text-left">
                    <ClockIcon className="w-3 h-3 text-ate-muted" />
                    <span className="text-[13px] font-semibold text-ate-ink">{time}</span>
                  </button>
                  <AnimatePresence>
                    {showTimePicker && (
                      <div className="absolute left-0 right-0 top-[calc(100%+6px)] z-50">
                        <TimePicker value={time} onChange={setTime} onClose={() => setShowTimePicker(false)} />
                      </div>
                    )}
                  </AnimatePresence>
                </div>

                <div className="bg-ate-grey rounded-xl px-3.5 py-2.5">
                  <label className="text-[9px] font-editorial font-bold text-ate-muted uppercase tracking-[0.15em]">Guests</label>
                  <div className="flex items-center gap-2 mt-0.5">
                    <motion.button whileTap={{ scale: 0.8 }} onClick={() => setGuests(Math.max(1, guests - 1))}
                      className="w-6 h-6 rounded-full bg-ate-ink text-white flex items-center justify-center text-[13px] font-bold">-</motion.button>
                    <span className="text-[13px] font-semibold text-ate-ink min-w-[20px] text-center tabular-nums">{guests}</span>
                    <motion.button whileTap={{ scale: 0.8 }} onClick={() => setGuests(Math.min(12, guests + 1))}
                      className="w-6 h-6 rounded-full bg-ate-ink text-white flex items-center justify-center text-[13px] font-bold">+</motion.button>
                  </div>
                </div>
              </div>

              {/* Advanced toggle */}
              <div className="px-5 pb-2">
                <button onClick={() => setShowAdvanced(!showAdvanced)}
                  className="flex items-center gap-1.5 text-[11px] font-editorial font-bold text-ate-muted uppercase tracking-[0.1em]">
                  <MixerHorizontalIcon className="w-3.5 h-3.5" />
                  More filters
                  {showAdvanced ? <ChevronUpIcon className="w-3 h-3" /> : <ChevronDownIcon className="w-3 h-3" />}
                </button>
              </div>

              <AnimatePresence>
                {showAdvanced && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                    className="overflow-hidden">
                    <div className="px-5 pb-3 space-y-4">
                      <div>
                        <label className="text-[9px] font-editorial font-bold text-ate-muted uppercase tracking-[0.15em]">
                          Distance — {distance} km
                        </label>
                        <input type="range" min={1} max={10} value={distance} onChange={(e) => setDistance(Number(e.target.value))} className="w-full mt-2" />
                      </div>
                      <div>
                        <label className="text-[9px] font-editorial font-bold text-ate-muted uppercase tracking-[0.15em]">Cuisine</label>
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          {cuisineOptions.slice(0, 10).map((c) => (
                            <motion.button key={c} whileTap={{ scale: 0.92 }} onClick={() => toggleCuisine(c)}
                              className={`text-[11px] font-semibold px-3 py-1.5 rounded-full transition-all ${
                                selectedCuisines.includes(c) ? "bg-ate-ink text-white" : "bg-ate-grey text-ate-muted"
                              }`}>{c}</motion.button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <label className="text-[9px] font-editorial font-bold text-ate-muted uppercase tracking-[0.15em]">Vibe</label>
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          {vibeOptions.slice(0, 8).map((v) => (
                            <motion.button key={v} whileTap={{ scale: 0.92 }} onClick={() => toggleVibe(v)}
                              className={`text-[11px] font-semibold px-3 py-1.5 rounded-full transition-all ${
                                selectedVibes.includes(v) ? "bg-ate-coral text-white" : "bg-ate-grey text-ate-muted"
                              }`}>{v}</motion.button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="px-5 pb-5 pt-1">
                <motion.button whileTap={{ scale: 0.97 }} transition={spring}
                  onClick={() => { setSearchOpen(false); setShowDatePicker(false); setShowTimePicker(false); }}
                  className="w-full bg-ate-red text-white font-editorial font-bold text-[14px] py-3.5 rounded-2xl tracking-[-0.01em] shadow-[0_4px_16px_rgba(255,68,56,0.3)]">
                  Search · {filtered.length} result{filtered.length !== 1 ? "s" : ""}
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Horizontal filter chips */}
        {!searchOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}
            className="flex gap-2 mt-3 overflow-x-auto no-scrollbar">
            <FilterChip active={!showAllRestaurants} onClick={() => setShowAllRestaurants(!showAllRestaurants)}>
              {showAllRestaurants ? "All" : "Open now"}
            </FilterChip>
            <FilterChip active={minRating >= 4} onClick={() => setMinRating(minRating >= 4 ? 0 : 4)}
              icon={<StarFilledIcon className="w-2.5 h-2.5" />}>
              Rating 4.0+
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

      {/* DRAGGABLE BOTTOM SHEET */}
      {!searchOpen && (
        <motion.div
          className="absolute left-0 right-0 z-20 bg-white shadow-[0_-4px_30px_rgba(0,0,0,0.12)] will-change-transform"
          style={{
            y: sheetY,
            borderTopLeftRadius: sheetRadius,
            borderTopRightRadius: sheetRadius,
            height: "100vh",
            top: 0,
            touchAction: "none",
          }}
          initial={{ y: getSnapY("peek") }}
          animate={sheetControls}
          drag="y"
          dragConstraints={{
            top: getSnapY("expanded"),
            bottom: getSnapY("collapsed"),
          }}
          dragElastic={0.1}
          dragMomentum={false}
          onDragEnd={handleDragEnd}
        >
          <div
            className="flex justify-center pt-2.5 pb-2 cursor-grab active:cursor-grabbing"
            onDoubleClick={() => snapTo(currentSnap.current === "expanded" ? "peek" : "expanded")}
          >
            <div className="w-9 h-[4px] bg-ate-ink/[0.12] rounded-full" />
          </div>

          <div className="px-5 pb-3 flex items-end justify-between">
            <div className="flex items-baseline gap-2">
              <span className="font-editorial text-[36px] font-extrabold text-ate-ink leading-none tracking-[-0.03em]">
                {availableCount}
              </span>
              <div>
                <p className="text-[12px] font-editorial font-bold text-ate-muted uppercase tracking-[0.1em]">
                  {showAllRestaurants ? "Restaurants" : "Available"}
                </p>
                <p className="text-[10px] text-ate-muted/60 font-medium">{location}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <SortPicker value={sortMode} onChange={setSortMode} />
              <motion.button whileTap={{ scale: 0.85 }}
                onClick={() => snapTo(currentSnap.current === "expanded" ? "peek" : "expanded")}
                className="w-8 h-8 rounded-full bg-ate-grey flex items-center justify-center">
                <motion.div
                  animate={{ rotate: currentSnap.current === "expanded" ? 180 : 0 }}
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                >
                  <ChevronUpIcon className="w-4 h-4 text-ate-ink" />
                </motion.div>
              </motion.button>
            </div>
          </div>

          <div className="mx-5 h-[1px] bg-ate-ink/[0.06] mb-2" />

          <div className="px-4 overflow-y-auto pb-24" style={{ height: "calc(100vh - 120px)" }}>
            {sorted.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-[14px] font-editorial font-bold text-ate-ink/25">No restaurants found</p>
                <p className="text-[12px] text-ate-muted mt-1">Try adjusting your filters</p>
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
    </div>
  );
}
