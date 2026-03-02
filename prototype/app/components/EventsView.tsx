"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  PlusIcon,
  Cross2Icon,
  CalendarIcon,
  CounterClockwiseClockIcon,
  StarFilledIcon,
  StarIcon,
  HeartIcon,
  PersonIcon,
  LightningBoltIcon,
  SunIcon,
  MoonIcon,
  BookmarkIcon,
  CheckCircledIcon,
  CrossCircledIcon,
  QuestionMarkCircledIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ImageIcon,
  MagnifyingGlassIcon,
} from "@radix-ui/react-icons";
import type { Event, Restaurant } from "../data/restaurants";

const spring = { type: "spring" as const, stiffness: 380, damping: 30, mass: 0.8 };

function EventIcon({ type, className = "w-[14px] h-[14px]" }: { type: string; className?: string }) {
  const icons: Record<string, React.ReactNode> = {
    birthday: <StarFilledIcon className={className} />,
    anniversary: <HeartIcon className={className} />,
    team: <PersonIcon className={className} />,
    celebration: <LightningBoltIcon className={className} />,
    date: <MoonIcon className={className} />,
    casual: <SunIcon className={className} />,
    tradition: <BookmarkIcon className={className} />,
    other: <CalendarIcon className={className} />,
  };
  return <>{icons[type] || icons.other}</>;
}

const eventIcons: Record<string, React.ReactNode> = {
  birthday: <StarFilledIcon className="w-[18px] h-[18px]" />,
  anniversary: <HeartIcon className="w-[18px] h-[18px]" />,
  team: <PersonIcon className="w-[18px] h-[18px]" />,
  celebration: <LightningBoltIcon className="w-[18px] h-[18px]" />,
  date: <MoonIcon className="w-[18px] h-[18px]" />,
  casual: <SunIcon className="w-[18px] h-[18px]" />,
  tradition: <BookmarkIcon className="w-[18px] h-[18px]" />,
  other: <CalendarIcon className="w-[18px] h-[18px]" />,
};

const eventTypeOptions = [
  { id: "birthday", label: "Birthday" },
  { id: "anniversary", label: "Anniversary" },
  { id: "team", label: "Team" },
  { id: "celebration", label: "Celebration" },
  { id: "date", label: "Date night" },
  { id: "casual", label: "Casual" },
  { id: "tradition", label: "Tradition" },
  { id: "other", label: "Other" },
];

function getEventType(emoji: string): string {
  const map: Record<string, string> = {
    "🎂": "birthday", "🥂": "anniversary", "👥": "team", "🎉": "celebration",
    "💕": "date", "🌞": "casual", "🎄": "celebration", "🎓": "celebration",
    birthday: "birthday", anniversary: "anniversary", team: "team",
    celebration: "celebration", date: "date", casual: "casual",
    tradition: "tradition", other: "other",
  };
  return map[emoji] || "other";
}

function StarRating({ rating, onChange }: { rating: number; onChange?: (r: number) => void }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button key={star} onClick={() => onChange?.(star)} className="p-0.5">
          {star <= rating ? (
            <StarFilledIcon className="w-[18px] h-[18px] text-terracotta" />
          ) : (
            <StarIcon className="w-[18px] h-[18px] text-charcoal/10" />
          )}
        </button>
      ))}
    </div>
  );
}

// --- Custom Date Picker ---
const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const DAYS = ["Su","Mo","Tu","We","Th","Fr","Sa"];

function CustomDatePicker({ value, onChange, onClose }: { value: string; onChange: (d: string) => void; onClose: () => void }) {
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
      initial={{ opacity: 0, y: 8, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 8, scale: 0.97 }}
      transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
      className="bg-white rounded-2xl p-4 shadow-[0_8px_32px_rgba(0,0,0,0.08)] border border-charcoal/[0.04]"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <motion.button whileTap={{ scale: 0.85 }} onClick={prevMonth} className="w-8 h-8 rounded-full bg-charcoal/[0.04] flex items-center justify-center">
          <ChevronLeftIcon className="w-4 h-4 text-charcoal/40" />
        </motion.button>
        <span className="text-[14px] font-semibold text-charcoal-dark">
          {MONTHS[viewMonth]} {viewYear}
        </span>
        <motion.button whileTap={{ scale: 0.85 }} onClick={nextMonth} className="w-8 h-8 rounded-full bg-charcoal/[0.04] flex items-center justify-center">
          <ChevronRightIcon className="w-4 h-4 text-charcoal/40" />
        </motion.button>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 gap-0 mb-1">
        {DAYS.map((d) => (
          <div key={d} className="text-center text-[10px] font-bold text-charcoal/20 uppercase tracking-wider py-1">{d}</div>
        ))}
      </div>

      {/* Day grid */}
      <div className="grid grid-cols-7 gap-0">
        {cells.map((day, i) => (
          <div key={i} className="flex items-center justify-center">
            {day ? (
              <motion.button
                whileTap={{ scale: 0.85 }}
                onClick={() => pick(day)}
                className={`w-9 h-9 rounded-full text-[13px] font-medium flex items-center justify-center transition-colors ${
                  isSelected(day)
                    ? "bg-charcoal-dark text-white"
                    : isToday(day)
                    ? "bg-forest/[0.08] text-forest font-semibold"
                    : "text-charcoal/60 hover:bg-charcoal/[0.03]"
                }`}
              >
                {day}
              </motion.button>
            ) : (
              <div className="w-9 h-9" />
            )}
          </div>
        ))}
      </div>
    </motion.div>
  );
}

// --- Custom Restaurant Selector ---
function RestaurantSelector({
  restaurants,
  value,
  onChange,
  onClose,
}: {
  restaurants: Restaurant[];
  value: string;
  onChange: (id: string) => void;
  onClose: () => void;
}) {
  const [search, setSearch] = useState("");
  const filtered = search
    ? restaurants.filter((r) => r.name.toLowerCase().includes(search.toLowerCase()) || r.cuisine.toLowerCase().includes(search.toLowerCase()))
    : restaurants;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 8, scale: 0.97 }}
      transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
      className="bg-white rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.08)] border border-charcoal/[0.04] overflow-hidden"
    >
      <div className="p-3 border-b border-charcoal/[0.04]">
        <div className="relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-charcoal/20" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search restaurants..."
            className="w-full bg-charcoal/[0.03] rounded-lg pl-8 pr-3 py-2 text-[12px] font-medium border-0 focus:outline-none placeholder:text-charcoal/18"
            autoFocus
          />
        </div>
      </div>
      <div className="max-h-[200px] overflow-y-auto">
        <button
          onClick={() => { onChange(""); onClose(); }}
          className={`w-full text-left px-4 py-2.5 text-[13px] font-medium border-b border-charcoal/[0.03] transition-colors ${
            !value ? "text-forest bg-forest/[0.03]" : "text-charcoal/35 hover:bg-charcoal/[0.02]"
          }`}
        >
          No restaurant
        </button>
        {filtered.map((r) => (
          <button
            key={r.id}
            onClick={() => { onChange(r.id); onClose(); }}
            className={`w-full text-left px-4 py-2.5 border-b border-charcoal/[0.03] transition-colors ${
              value === r.id ? "bg-forest/[0.03]" : "hover:bg-charcoal/[0.02]"
            }`}
          >
            <div className="flex items-center gap-2.5">
              <img src={r.photo} alt="" className="w-8 h-8 rounded-lg object-cover" />
              <div>
                <p className={`text-[13px] font-medium ${value === r.id ? "text-forest" : "text-charcoal-dark"}`}>{r.name}</p>
                <p className="text-[10px] text-charcoal/25 font-medium">{r.cuisine} · {r.priceRange}</p>
              </div>
            </div>
          </button>
        ))}
        {filtered.length === 0 && (
          <div className="px-4 py-6 text-center text-[12px] text-charcoal/20">No restaurants found</div>
        )}
      </div>
    </motion.div>
  );
}

export default function EventsView({
  events,
  restaurants,
  onAddEvent,
}: {
  events: Event[];
  restaurants: Restaurant[];
  onAddEvent: (event: Event) => void;
}) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showRestaurantPicker, setShowRestaurantPicker] = useState(false);
  const [photoPreviewUrls, setPhotoPreviewUrls] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [newEvent, setNewEvent] = useState({
    name: "",
    date: "",
    restaurantId: "",
    notes: "",
    liked: "",
    disliked: "",
    ambience: "",
    personalRating: 0,
    wouldVisitAgain: "maybe" as "yes" | "maybe" | "no",
    isTradition: false,
    eventType: "other",
  });

  const upcoming = events.filter((e) => new Date(e.date) >= new Date());
  const past = events.filter((e) => new Date(e.date) < new Date());
  const getRestaurant = (id: string | null) => restaurants.find((r) => r.id === id);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const urls = Array.from(files).map((f) => URL.createObjectURL(f));
    setPhotoPreviewUrls((prev) => [...prev, ...urls]);
  };

  const removePhoto = (index: number) => {
    setPhotoPreviewUrls((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    onAddEvent({
      ...newEvent,
      id: String(Date.now()),
      photos: photoPreviewUrls,
      emoji: newEvent.eventType,
    });
    setShowAddForm(false);
    setPhotoPreviewUrls([]);
    setNewEvent({
      name: "", date: "", restaurantId: "", notes: "",
      liked: "", disliked: "", ambience: "", personalRating: 0,
      wouldVisitAgain: "maybe", isTradition: false, eventType: "other",
    });
  };

  const formatDateDisplay = (dateStr: string) => {
    if (!dateStr) return null;
    const d = new Date(dateStr + "T00:00:00");
    return d.toLocaleDateString("en-NL", { weekday: "short", day: "numeric", month: "short", year: "numeric" });
  };

  // --- Event detail view ---
  if (selectedEvent) {
    const eventType = getEventType(selectedEvent.emoji);
    return (
      <div className="h-full flex flex-col pt-[env(safe-area-inset-top)]">
        <div className="px-5 pt-5 pb-3 flex items-center gap-3">
          <motion.button whileTap={{ scale: 0.85 }} transition={spring} onClick={() => setSelectedEvent(null)}
            className="w-8 h-8 rounded-full bg-charcoal/[0.04] flex items-center justify-center">
            <Cross2Icon className="w-4 h-4 text-charcoal/40" />
          </motion.button>
          <div className="flex-1 min-w-0">
            <h1 className="text-[18px] font-normal text-charcoal-dark font-[family-name:var(--font-instrument)] truncate">{selectedEvent.name}</h1>
            {selectedEvent.isTradition && (
              <p className="text-[11px] text-terracotta font-semibold flex items-center gap-1 mt-0.5">
                <CounterClockwiseClockIcon className="w-3 h-3" /> Yearly tradition
              </p>
            )}
          </div>
          <div className="w-10 h-10 rounded-full bg-sage/20 flex items-center justify-center text-forest">{eventIcons[eventType]}</div>
        </div>
        <div className="flex-1 overflow-y-auto px-5 pb-24">
          <div className="mt-3 space-y-4">
            <div className="flex items-center gap-2 text-[13px] text-charcoal/40 font-medium">
              <CalendarIcon className="w-4 h-4" />
              {new Date(selectedEvent.date).toLocaleDateString("en-NL", { year: "numeric", month: "long", day: "numeric" })}
            </div>
            {selectedEvent.restaurantId && (
              <div>
                <p className="text-[11px] font-bold text-charcoal/20 uppercase tracking-[0.08em] mb-1">Restaurant</p>
                <p className="text-[14px] font-medium text-charcoal-dark font-[family-name:var(--font-instrument)]">
                  {getRestaurant(selectedEvent.restaurantId)?.name || "Unknown"}
                </p>
              </div>
            )}
            <StarRating rating={selectedEvent.personalRating} />
            {selectedEvent.photos && selectedEvent.photos.length > 0 && (
              <div>
                <p className="text-[11px] font-bold text-charcoal/20 uppercase tracking-[0.08em] mb-2">Photos</p>
                <div className="flex gap-2 overflow-x-auto">
                  {selectedEvent.photos.map((url, i) => (
                    <img key={i} src={url} alt="" className="w-20 h-20 rounded-xl object-cover shrink-0" />
                  ))}
                </div>
              </div>
            )}
            {selectedEvent.liked && (
              <div>
                <p className="text-[11px] font-bold text-charcoal/20 uppercase tracking-[0.08em] mb-1">Loved</p>
                <p className="text-[13px] text-charcoal/50 leading-relaxed">{selectedEvent.liked}</p>
              </div>
            )}
            {selectedEvent.disliked && (
              <div>
                <p className="text-[11px] font-bold text-charcoal/20 uppercase tracking-[0.08em] mb-1">Could improve</p>
                <p className="text-[13px] text-charcoal/50 leading-relaxed">{selectedEvent.disliked}</p>
              </div>
            )}
            {selectedEvent.ambience && (
              <div>
                <p className="text-[11px] font-bold text-charcoal/20 uppercase tracking-[0.08em] mb-1">Ambience</p>
                <p className="text-[13px] text-charcoal/50 leading-relaxed">{selectedEvent.ambience}</p>
              </div>
            )}
            {selectedEvent.notes && (
              <div>
                <p className="text-[11px] font-bold text-charcoal/20 uppercase tracking-[0.08em] mb-1">Notes</p>
                <p className="text-[13px] text-charcoal/50 leading-relaxed">{selectedEvent.notes}</p>
              </div>
            )}
            <div className="flex items-center gap-2.5 pt-2 border-t border-charcoal/[0.04]">
              <span className="text-[11px] text-charcoal/25 font-medium">Visit again</span>
              <span className={`flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-full ${
                selectedEvent.wouldVisitAgain === "yes" ? "bg-forest/[0.06] text-forest"
                  : selectedEvent.wouldVisitAgain === "maybe" ? "bg-mustard/10 text-mustard"
                  : "bg-burgundy/[0.06] text-burgundy"
              }`}>
                {selectedEvent.wouldVisitAgain === "yes" && <CheckCircledIcon className="w-3 h-3" />}
                {selectedEvent.wouldVisitAgain === "maybe" && <QuestionMarkCircledIcon className="w-3 h-3" />}
                {selectedEvent.wouldVisitAgain === "no" && <CrossCircledIcon className="w-3 h-3" />}
                {selectedEvent.wouldVisitAgain}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- Main events list ---
  return (
    <div className="h-full flex flex-col pt-[env(safe-area-inset-top)]">
      <div className="px-5 pt-5 pb-3 flex items-center justify-between">
        <h1 className="text-[22px] font-normal text-charcoal-dark font-[family-name:var(--font-instrument)]">Your Events</h1>
        <motion.button whileTap={{ scale: 0.94 }} transition={spring} onClick={() => setShowAddForm(true)}
          className="flex items-center gap-1.5 bg-charcoal-dark text-white text-[12px] font-semibold px-3.5 py-2 rounded-full tracking-wide">
          <PlusIcon className="w-3.5 h-3.5" /> New
        </motion.button>
      </div>

      <div className="flex-1 overflow-y-auto px-5 pb-24">
        {events.length === 0 && !showAddForm ? (
          <div className="text-center py-20">
            <div className="w-14 h-14 rounded-full bg-charcoal/[0.03] flex items-center justify-center mx-auto mb-4">
              <CalendarIcon className="w-6 h-6 text-charcoal/15" />
            </div>
            <p className="text-[15px] font-medium text-charcoal/40">Your first meal memory starts here</p>
            <p className="text-[12px] text-charcoal/20 mt-1">Tap &ldquo;New&rdquo; to log a meal</p>
          </div>
        ) : (
          <>
            {/* --- Add Event Form --- */}
            <AnimatePresence>
              {showAddForm && (
                <motion.div
                  initial={{ opacity: 0, y: 16, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -16, scale: 0.98 }}
                  transition={{ ...spring, stiffness: 300 }}
                  className="bg-white rounded-2xl p-5 mb-5 shadow-[0_2px_16px_rgba(0,0,0,0.04)]"
                >
                  <div className="flex items-center justify-between mb-5">
                    <h3 className="font-semibold text-[15px] text-charcoal-dark">New Event</h3>
                    <motion.button whileTap={{ scale: 0.85 }} onClick={() => { setShowAddForm(false); setShowDatePicker(false); setShowRestaurantPicker(false); }}>
                      <Cross2Icon className="w-4 h-4 text-charcoal/25" />
                    </motion.button>
                  </div>

                  <div className="space-y-4">
                    {/* Type */}
                    <div>
                      <p className="text-[11px] font-bold text-charcoal/20 uppercase tracking-[0.08em] mb-2.5">Type</p>
                      <div className="flex flex-wrap gap-[6px]">
                        {eventTypeOptions.map((opt) => (
                          <motion.button key={opt.id} whileTap={{ scale: 0.94 }} transition={spring}
                            onClick={() => setNewEvent({ ...newEvent, eventType: opt.id })}
                            className={`inline-flex items-center gap-[6px] text-[12px] font-semibold pl-2.5 pr-3 py-[7px] rounded-full transition-all duration-200 ${
                              newEvent.eventType === opt.id ? "bg-charcoal-dark text-white" : "bg-charcoal/[0.05] text-charcoal/45"
                            }`}>
                            <EventIcon type={opt.id} />
                            {opt.label}
                          </motion.button>
                        ))}
                      </div>
                    </div>

                    {/* Event name */}
                    <input type="text" placeholder="Event name" value={newEvent.name}
                      onChange={(e) => setNewEvent({ ...newEvent, name: e.target.value })}
                      className="w-full bg-charcoal/[0.02] rounded-xl px-4 py-3 text-[13px] font-medium border-0 focus:outline-none focus:ring-2 focus:ring-forest/10 placeholder:text-charcoal/20" />

                    {/* Custom date picker */}
                    <div className="relative">
                      <motion.button whileTap={{ scale: 0.98 }} transition={spring}
                        onClick={() => { setShowDatePicker(!showDatePicker); setShowRestaurantPicker(false); }}
                        className="w-full flex items-center gap-2.5 bg-charcoal/[0.02] rounded-xl px-4 py-3 text-left">
                        <CalendarIcon className="w-4 h-4 text-charcoal/25" />
                        <span className={`text-[13px] font-medium ${newEvent.date ? "text-charcoal-dark" : "text-charcoal/20"}`}>
                          {newEvent.date ? formatDateDisplay(newEvent.date) : "Pick a date"}
                        </span>
                      </motion.button>
                      <AnimatePresence>
                        {showDatePicker && (
                          <div className="absolute left-0 right-0 top-[calc(100%+6px)] z-30">
                            <CustomDatePicker
                              value={newEvent.date}
                              onChange={(d) => setNewEvent({ ...newEvent, date: d })}
                              onClose={() => setShowDatePicker(false)}
                            />
                          </div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Custom restaurant picker */}
                    <div className="relative">
                      <motion.button whileTap={{ scale: 0.98 }} transition={spring}
                        onClick={() => { setShowRestaurantPicker(!showRestaurantPicker); setShowDatePicker(false); }}
                        className="w-full flex items-center gap-2.5 bg-charcoal/[0.02] rounded-xl px-4 py-3 text-left">
                        {newEvent.restaurantId ? (
                          <>
                            <img src={getRestaurant(newEvent.restaurantId)?.photo} alt="" className="w-6 h-6 rounded-md object-cover" />
                            <span className="text-[13px] font-medium text-charcoal-dark">
                              {getRestaurant(newEvent.restaurantId)?.name}
                            </span>
                          </>
                        ) : (
                          <>
                            <MagnifyingGlassIcon className="w-4 h-4 text-charcoal/25" />
                            <span className="text-[13px] font-medium text-charcoal/20">Restaurant (optional)</span>
                          </>
                        )}
                      </motion.button>
                      <AnimatePresence>
                        {showRestaurantPicker && (
                          <div className="absolute left-0 right-0 top-[calc(100%+6px)] z-30">
                            <RestaurantSelector
                              restaurants={restaurants}
                              value={newEvent.restaurantId}
                              onChange={(id) => setNewEvent({ ...newEvent, restaurantId: id })}
                              onClose={() => setShowRestaurantPicker(false)}
                            />
                          </div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Photos */}
                    <div>
                      <p className="text-[11px] font-bold text-charcoal/20 uppercase tracking-[0.08em] mb-2">Photos</p>
                      <div className="flex gap-2 flex-wrap">
                        {photoPreviewUrls.map((url, i) => (
                          <div key={i} className="relative w-16 h-16 rounded-xl overflow-hidden group">
                            <img src={url} alt="" className="w-full h-full object-cover" />
                            <motion.button
                              whileTap={{ scale: 0.8 }}
                              onClick={() => removePhoto(i)}
                              className="absolute top-1 right-1 w-5 h-5 rounded-full bg-charcoal-dark/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <Cross2Icon className="w-2.5 h-2.5 text-white" />
                            </motion.button>
                          </div>
                        ))}
                        <motion.button
                          whileTap={{ scale: 0.92 }}
                          transition={spring}
                          onClick={() => fileInputRef.current?.click()}
                          className="w-16 h-16 rounded-xl border-2 border-dashed border-charcoal/[0.08] flex flex-col items-center justify-center gap-1 text-charcoal/20 hover:border-charcoal/15 transition-colors"
                        >
                          <ImageIcon className="w-5 h-5" />
                          <span className="text-[8px] font-bold uppercase tracking-wider">Add</span>
                        </motion.button>
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={handlePhotoUpload}
                          className="hidden"
                        />
                      </div>
                    </div>

                    {/* Notes */}
                    <textarea placeholder="What did you love?" value={newEvent.liked}
                      onChange={(e) => setNewEvent({ ...newEvent, liked: e.target.value })}
                      className="w-full bg-charcoal/[0.02] rounded-xl px-4 py-3 text-[13px] font-medium border-0 focus:outline-none focus:ring-2 focus:ring-forest/10 resize-none h-16 placeholder:text-charcoal/20" />
                    <textarea placeholder="What could be better?" value={newEvent.disliked}
                      onChange={(e) => setNewEvent({ ...newEvent, disliked: e.target.value })}
                      className="w-full bg-charcoal/[0.02] rounded-xl px-4 py-3 text-[13px] font-medium border-0 focus:outline-none focus:ring-2 focus:ring-forest/10 resize-none h-16 placeholder:text-charcoal/20" />
                    <textarea placeholder="Ambience notes..." value={newEvent.ambience}
                      onChange={(e) => setNewEvent({ ...newEvent, ambience: e.target.value })}
                      className="w-full bg-charcoal/[0.02] rounded-xl px-4 py-3 text-[13px] font-medium border-0 focus:outline-none focus:ring-2 focus:ring-forest/10 resize-none h-16 placeholder:text-charcoal/20" />

                    {/* Rating */}
                    <div>
                      <p className="text-[11px] font-bold text-charcoal/20 uppercase tracking-[0.08em] mb-1.5">Rating</p>
                      <StarRating rating={newEvent.personalRating} onChange={(r) => setNewEvent({ ...newEvent, personalRating: r })} />
                    </div>

                    {/* Visit again */}
                    <div>
                      <p className="text-[11px] font-bold text-charcoal/20 uppercase tracking-[0.08em] mb-2">Visit again?</p>
                      <div className="flex gap-2">
                        {(["yes", "maybe", "no"] as const).map((opt) => (
                          <motion.button key={opt} whileTap={{ scale: 0.92 }} transition={spring}
                            onClick={() => setNewEvent({ ...newEvent, wouldVisitAgain: opt })}
                            className={`flex items-center gap-1 text-[12px] font-semibold px-4 py-2 rounded-full capitalize transition-all duration-200 ${
                              newEvent.wouldVisitAgain === opt
                                ? opt === "yes" ? "bg-forest text-white" : opt === "maybe" ? "bg-mustard text-white" : "bg-burgundy text-white"
                                : "bg-charcoal/[0.03] text-charcoal/30"
                            }`}>
                            {opt === "yes" && <CheckCircledIcon className="w-3 h-3" />}
                            {opt === "maybe" && <QuestionMarkCircledIcon className="w-3 h-3" />}
                            {opt === "no" && <CrossCircledIcon className="w-3 h-3" />}
                            {opt}
                          </motion.button>
                        ))}
                      </div>
                    </div>

                    {/* Tradition toggle */}
                    <div className="flex items-center justify-between bg-sage/10 rounded-xl px-4 py-3.5">
                      <div>
                        <p className="text-[13px] font-semibold text-charcoal-dark">Make it a tradition?</p>
                        <p className="text-[11px] text-charcoal/25 font-medium mt-0.5">We&apos;ll remind you every year</p>
                      </div>
                      <motion.button whileTap={{ scale: 0.9 }} transition={spring}
                        onClick={() => setNewEvent({ ...newEvent, isTradition: !newEvent.isTradition })}
                        className={`w-[44px] h-[26px] rounded-full transition-colors duration-300 relative ${newEvent.isTradition ? "bg-forest" : "bg-charcoal/10"}`}>
                        <motion.div animate={{ x: newEvent.isTradition ? 20 : 2 }} transition={spring}
                          className="absolute top-[3px] w-5 h-5 bg-white rounded-full shadow-sm" />
                      </motion.button>
                    </div>

                    {/* Submit */}
                    <motion.button whileTap={{ scale: 0.98 }} transition={spring} onClick={handleSubmit}
                      disabled={!newEvent.name || !newEvent.date}
                      className="w-full bg-charcoal-dark text-white font-semibold py-3.5 rounded-2xl text-[14px] disabled:opacity-25">
                      Save Event
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Upcoming */}
            {upcoming.length > 0 && (
              <div className="mb-6">
                <h3 className="text-[11px] font-bold text-charcoal/20 uppercase tracking-[0.08em] mb-3">Upcoming</h3>
                {upcoming.map((event, i) => {
                  const eventType = getEventType(event.emoji);
                  return (
                    <motion.button key={event.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                      transition={{ ...spring, delay: i * 0.05 }} whileTap={{ scale: 0.98 }}
                      onClick={() => setSelectedEvent(event)}
                      className="w-full text-left flex items-center gap-3.5 py-3.5 border-b border-charcoal/[0.04] last:border-0">
                      <div className="w-10 h-10 rounded-full bg-sage/20 flex items-center justify-center text-forest shrink-0">{eventIcons[eventType]}</div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-[14px] text-charcoal-dark truncate">{event.name}</h4>
                        <p className="text-[11px] text-charcoal/30 mt-0.5 font-medium">
                          {new Date(event.date).toLocaleDateString("en-NL", { month: "short", day: "numeric" })}
                          {event.restaurantId && ` · ${getRestaurant(event.restaurantId)?.name || ""}`}
                        </p>
                      </div>
                      {event.isTradition && (
                        <div className="flex items-center gap-1 text-[10px] font-semibold text-terracotta bg-terracotta/[0.06] px-2 py-1 rounded-full shrink-0">
                          <CounterClockwiseClockIcon className="w-2.5 h-2.5" /> Tradition
                        </div>
                      )}
                    </motion.button>
                  );
                })}
              </div>
            )}

            {/* Past */}
            {past.length > 0 && (
              <div>
                <h3 className="text-[11px] font-bold text-charcoal/20 uppercase tracking-[0.08em] mb-3">Past</h3>
                {past.map((event, i) => {
                  const eventType = getEventType(event.emoji);
                  return (
                    <motion.button key={event.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                      transition={{ ...spring, delay: i * 0.05 }} whileTap={{ scale: 0.98 }}
                      onClick={() => setSelectedEvent(event)}
                      className="w-full text-left flex items-center gap-3.5 py-3.5 border-b border-charcoal/[0.04] last:border-0">
                      <div className="w-10 h-10 rounded-full bg-charcoal/[0.03] flex items-center justify-center text-charcoal/25 shrink-0">{eventIcons[eventType]}</div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-[14px] text-charcoal-dark truncate">{event.name}</h4>
                        <p className="text-[11px] text-charcoal/25 mt-0.5 font-medium">
                          {new Date(event.date).toLocaleDateString("en-NL", { month: "short", day: "numeric", year: "numeric" })}
                          {event.restaurantId && ` · ${getRestaurant(event.restaurantId)?.name || ""}`}
                        </p>
                        <div className="mt-1.5 flex items-center gap-2">
                          <StarRating rating={event.personalRating} />
                          {event.isTradition && (
                            <div className="flex items-center gap-1 text-[10px] font-semibold text-terracotta bg-terracotta/[0.06] px-2 py-1 rounded-full">
                              <CounterClockwiseClockIcon className="w-2.5 h-2.5" />
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
