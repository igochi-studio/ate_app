"use client";

import { useState } from "react";
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
} from "@radix-ui/react-icons";
import type { Event, Restaurant } from "../data/restaurants";

const spring = { type: "spring" as const, stiffness: 380, damping: 30, mass: 0.8 };

// Event type icons using Radix
const eventIcons: Record<string, React.ReactNode> = {
  birthday: <StarFilledIcon className="w-5 h-5" />,
  anniversary: <HeartIcon className="w-5 h-5" />,
  team: <PersonIcon className="w-5 h-5" />,
  celebration: <LightningBoltIcon className="w-5 h-5" />,
  date: <MoonIcon className="w-5 h-5" />,
  casual: <SunIcon className="w-5 h-5" />,
  tradition: <BookmarkIcon className="w-5 h-5" />,
  other: <CalendarIcon className="w-5 h-5" />,
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

// Map old emoji-based events to icon types
function getEventType(emoji: string): string {
  const map: Record<string, string> = {
    "🎂": "birthday",
    "🥂": "anniversary",
    "👥": "team",
    "🎉": "celebration",
    "💕": "date",
    "🌞": "casual",
    "🎄": "celebration",
    "🎓": "celebration",
  };
  return map[emoji] || "other";
}

function StarRating({ rating, onChange }: { rating: number; onChange?: (r: number) => void }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <button key={star} onClick={() => onChange?.(star)} className="p-0.5">
          {star <= rating ? (
            <StarFilledIcon className="w-4 h-4 text-terracotta" />
          ) : (
            <StarIcon className="w-4 h-4 text-charcoal/10" />
          )}
        </button>
      ))}
    </div>
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

  const handleSubmit = () => {
    onAddEvent({
      ...newEvent,
      id: String(Date.now()),
      photos: [],
      emoji: newEvent.eventType, // repurpose field for type
    });
    setShowAddForm(false);
    setNewEvent({
      name: "", date: "", restaurantId: "", notes: "",
      liked: "", disliked: "", ambience: "", personalRating: 0,
      wouldVisitAgain: "maybe", isTradition: false, eventType: "other",
    });
  };

  // Event detail view
  if (selectedEvent) {
    const eventType = getEventType(selectedEvent.emoji);
    return (
      <div className="h-full flex flex-col pt-[env(safe-area-inset-top)]">
        <div className="px-5 pt-5 pb-3 flex items-center gap-3">
          <motion.button
            whileTap={{ scale: 0.85 }}
            transition={spring}
            onClick={() => setSelectedEvent(null)}
            className="w-8 h-8 rounded-full bg-charcoal/[0.04] flex items-center justify-center"
          >
            <Cross2Icon className="w-4 h-4 text-charcoal/40" />
          </motion.button>
          <div className="flex-1 min-w-0">
            <h1 className="text-[18px] font-normal text-charcoal-dark font-[family-name:var(--font-instrument)] truncate">
              {selectedEvent.name}
            </h1>
            {selectedEvent.isTradition && (
              <p className="text-[11px] text-terracotta font-semibold flex items-center gap-1 mt-0.5">
                <CounterClockwiseClockIcon className="w-3 h-3" /> Yearly tradition
              </p>
            )}
          </div>
          <div className="w-10 h-10 rounded-full bg-sage/20 flex items-center justify-center text-forest">
            {eventIcons[eventType]}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-5 pb-24">
          <div className="mt-3 space-y-4">
            <div className="flex items-center gap-2 text-[13px] text-charcoal/40 font-medium">
              <CalendarIcon className="w-4 h-4" />
              {new Date(selectedEvent.date).toLocaleDateString("en-NL", {
                year: "numeric", month: "long", day: "numeric",
              })}
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
                selectedEvent.wouldVisitAgain === "yes"
                  ? "bg-forest/[0.06] text-forest"
                  : selectedEvent.wouldVisitAgain === "maybe"
                  ? "bg-mustard/10 text-mustard"
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

  return (
    <div className="h-full flex flex-col pt-[env(safe-area-inset-top)]">
      <div className="px-5 pt-5 pb-3 flex items-center justify-between">
        <h1 className="text-[22px] font-normal text-charcoal-dark font-[family-name:var(--font-instrument)]">
          Your Events
        </h1>
        <motion.button
          whileTap={{ scale: 0.94 }}
          transition={spring}
          onClick={() => setShowAddForm(true)}
          className="flex items-center gap-1.5 bg-charcoal-dark text-white text-[12px] font-semibold px-3.5 py-2 rounded-full tracking-wide"
        >
          <PlusIcon className="w-3.5 h-3.5" />
          New
        </motion.button>
      </div>

      <div className="flex-1 overflow-y-auto px-5 pb-24">
        {events.length === 0 && !showAddForm ? (
          <div className="text-center py-20">
            <div className="w-14 h-14 rounded-full bg-charcoal/[0.03] flex items-center justify-center mx-auto mb-4">
              <CalendarIcon className="w-6 h-6 text-charcoal/15" />
            </div>
            <p className="text-[15px] font-medium text-charcoal/40">
              Your first meal memory starts here
            </p>
            <p className="text-[12px] text-charcoal/20 mt-1">
              Tap &ldquo;New&rdquo; to log a meal
            </p>
          </div>
        ) : (
          <>
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
                    <motion.button whileTap={{ scale: 0.85 }} onClick={() => setShowAddForm(false)}>
                      <Cross2Icon className="w-4 h-4 text-charcoal/25" />
                    </motion.button>
                  </div>

                  <div className="space-y-4">
                    {/* Event type picker */}
                    <div>
                      <p className="text-[11px] font-bold text-charcoal/20 uppercase tracking-[0.08em] mb-2">Type</p>
                      <div className="flex flex-wrap gap-2">
                        {eventTypeOptions.map((opt) => (
                          <motion.button
                            key={opt.id}
                            whileTap={{ scale: 0.92 }}
                            transition={spring}
                            onClick={() => setNewEvent({ ...newEvent, eventType: opt.id })}
                            className={`flex items-center gap-1.5 text-[11px] font-semibold px-3 py-2 rounded-full transition-all duration-200 ${
                              newEvent.eventType === opt.id
                                ? "bg-forest text-white"
                                : "bg-charcoal/[0.03] text-charcoal/35"
                            }`}
                          >
                            <span className="w-3.5 h-3.5">{eventIcons[opt.id]}</span>
                            {opt.label}
                          </motion.button>
                        ))}
                      </div>
                    </div>

                    <input
                      type="text"
                      placeholder="Event name"
                      value={newEvent.name}
                      onChange={(e) => setNewEvent({ ...newEvent, name: e.target.value })}
                      className="w-full bg-charcoal/[0.02] rounded-xl px-4 py-3 text-[13px] font-medium border-0 focus:outline-none focus:ring-2 focus:ring-forest/10 placeholder:text-charcoal/20"
                    />
                    <input
                      type="date"
                      value={newEvent.date}
                      onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                      className="w-full bg-charcoal/[0.02] rounded-xl px-4 py-3 text-[13px] font-medium border-0 focus:outline-none focus:ring-2 focus:ring-forest/10"
                    />
                    <select
                      value={newEvent.restaurantId}
                      onChange={(e) => setNewEvent({ ...newEvent, restaurantId: e.target.value })}
                      className="w-full bg-charcoal/[0.02] rounded-xl px-4 py-3 text-[13px] font-medium border-0 focus:outline-none focus:ring-2 focus:ring-forest/10"
                    >
                      <option value="">Restaurant (optional)</option>
                      {restaurants.map((r) => (
                        <option key={r.id} value={r.id}>{r.name}</option>
                      ))}
                    </select>
                    <textarea
                      placeholder="What did you love?"
                      value={newEvent.liked}
                      onChange={(e) => setNewEvent({ ...newEvent, liked: e.target.value })}
                      className="w-full bg-charcoal/[0.02] rounded-xl px-4 py-3 text-[13px] font-medium border-0 focus:outline-none focus:ring-2 focus:ring-forest/10 resize-none h-16 placeholder:text-charcoal/20"
                    />
                    <textarea
                      placeholder="What could be better?"
                      value={newEvent.disliked}
                      onChange={(e) => setNewEvent({ ...newEvent, disliked: e.target.value })}
                      className="w-full bg-charcoal/[0.02] rounded-xl px-4 py-3 text-[13px] font-medium border-0 focus:outline-none focus:ring-2 focus:ring-forest/10 resize-none h-16 placeholder:text-charcoal/20"
                    />

                    <div>
                      <p className="text-[11px] font-bold text-charcoal/20 uppercase tracking-[0.08em] mb-1.5">Rating</p>
                      <StarRating
                        rating={newEvent.personalRating}
                        onChange={(r) => setNewEvent({ ...newEvent, personalRating: r })}
                      />
                    </div>

                    <div>
                      <p className="text-[11px] font-bold text-charcoal/20 uppercase tracking-[0.08em] mb-2">Visit again?</p>
                      <div className="flex gap-2">
                        {(["yes", "maybe", "no"] as const).map((opt) => (
                          <motion.button
                            key={opt}
                            whileTap={{ scale: 0.92 }}
                            transition={spring}
                            onClick={() => setNewEvent({ ...newEvent, wouldVisitAgain: opt })}
                            className={`flex items-center gap-1 text-[12px] font-semibold px-4 py-2 rounded-full capitalize transition-all duration-200 ${
                              newEvent.wouldVisitAgain === opt
                                ? opt === "yes" ? "bg-forest text-white"
                                  : opt === "maybe" ? "bg-mustard text-white"
                                  : "bg-burgundy text-white"
                                : "bg-charcoal/[0.03] text-charcoal/30"
                            }`}
                          >
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
                        <p className="text-[11px] text-charcoal/25 font-medium mt-0.5">
                          We&apos;ll remind you every year
                        </p>
                      </div>
                      <motion.button
                        whileTap={{ scale: 0.9 }}
                        transition={spring}
                        onClick={() => setNewEvent({ ...newEvent, isTradition: !newEvent.isTradition })}
                        className={`w-[44px] h-[26px] rounded-full transition-colors duration-300 relative ${
                          newEvent.isTradition ? "bg-forest" : "bg-charcoal/10"
                        }`}
                      >
                        <motion.div
                          animate={{ x: newEvent.isTradition ? 20 : 2 }}
                          transition={spring}
                          className="absolute top-[3px] w-5 h-5 bg-white rounded-full shadow-sm"
                        />
                      </motion.button>
                    </div>

                    <motion.button
                      whileTap={{ scale: 0.98 }}
                      transition={spring}
                      onClick={handleSubmit}
                      disabled={!newEvent.name || !newEvent.date}
                      className="w-full bg-charcoal-dark text-white font-semibold py-3.5 rounded-2xl text-[14px] disabled:opacity-25"
                    >
                      Save Event
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Upcoming */}
            {upcoming.length > 0 && (
              <div className="mb-6">
                <h3 className="text-[11px] font-bold text-charcoal/20 uppercase tracking-[0.08em] mb-3">
                  Upcoming
                </h3>
                {upcoming.map((event, i) => {
                  const eventType = getEventType(event.emoji);
                  return (
                    <motion.button
                      key={event.id}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ ...spring, delay: i * 0.05 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setSelectedEvent(event)}
                      className="w-full text-left flex items-center gap-3.5 py-3.5 border-b border-charcoal/[0.04] last:border-0"
                    >
                      <div className="w-10 h-10 rounded-full bg-sage/20 flex items-center justify-center text-forest shrink-0">
                        {eventIcons[eventType]}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-[14px] text-charcoal-dark truncate">{event.name}</h4>
                        <p className="text-[11px] text-charcoal/30 mt-0.5 font-medium">
                          {new Date(event.date).toLocaleDateString("en-NL", { month: "short", day: "numeric" })}
                          {event.restaurantId && ` · ${getRestaurant(event.restaurantId)?.name || ""}`}
                        </p>
                      </div>
                      {event.isTradition && (
                        <div className="flex items-center gap-1 text-[10px] font-semibold text-terracotta bg-terracotta/[0.06] px-2 py-1 rounded-full shrink-0">
                          <CounterClockwiseClockIcon className="w-2.5 h-2.5" />
                          Tradition
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
                <h3 className="text-[11px] font-bold text-charcoal/20 uppercase tracking-[0.08em] mb-3">
                  Past
                </h3>
                {past.map((event, i) => {
                  const eventType = getEventType(event.emoji);
                  return (
                    <motion.button
                      key={event.id}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ ...spring, delay: i * 0.05 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setSelectedEvent(event)}
                      className="w-full text-left flex items-center gap-3.5 py-3.5 border-b border-charcoal/[0.04] last:border-0"
                    >
                      <div className="w-10 h-10 rounded-full bg-charcoal/[0.03] flex items-center justify-center text-charcoal/25 shrink-0">
                        {eventIcons[eventType]}
                      </div>
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
