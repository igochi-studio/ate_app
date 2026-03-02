"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  PlusIcon,
  Cross2Icon,
  CalendarIcon,
  LoopIcon,
  StarFilledIcon,
  StarIcon,
} from "@radix-ui/react-icons";
import type { Event, Restaurant } from "../data/restaurants";

function StarRating({ rating, onChange }: { rating: number; onChange?: (r: number) => void }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          onClick={() => onChange?.(star)}
          className="p-0.5"
        >
          {star <= rating ? (
            <StarFilledIcon className="w-5 h-5 text-mustard" />
          ) : (
            <StarIcon className="w-5 h-5 text-light-grey" />
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
    emoji: "🎉",
  });

  const upcoming = events.filter((e) => new Date(e.date) >= new Date());
  const past = events.filter((e) => new Date(e.date) < new Date());

  const getRestaurant = (id: string | null) =>
    restaurants.find((r) => r.id === id);

  const handleSubmit = () => {
    onAddEvent({
      ...newEvent,
      id: String(Date.now()),
      photos: [],
    });
    setShowAddForm(false);
    setNewEvent({
      name: "",
      date: "",
      restaurantId: "",
      notes: "",
      liked: "",
      disliked: "",
      ambience: "",
      personalRating: 0,
      wouldVisitAgain: "maybe",
      isTradition: false,
      emoji: "🎉",
    });
  };

  const emojiOptions = ["🎂", "🥂", "👥", "🎉", "💕", "🎄", "🌞", "🎓"];

  // Memory wall for a tradition event
  if (selectedEvent) {
    return (
      <div className="h-full flex flex-col pt-[env(safe-area-inset-top)]">
        <div className="px-4 pt-4 pb-2 flex items-center gap-3">
          <button onClick={() => setSelectedEvent(null)} className="text-forest">
            <Cross2Icon className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-lg font-bold text-charcoal-dark">
              {selectedEvent.emoji} {selectedEvent.name}
            </h1>
            {selectedEvent.isTradition && (
              <p className="text-xs text-terracotta font-medium flex items-center gap-1">
                <LoopIcon className="w-3 h-3" /> Yearly tradition
              </p>
            )}
          </div>
        </div>
        <div className="flex-1 overflow-y-auto px-4 pb-24">
          <div className="mt-4 bg-white rounded-2xl p-4 border border-light-grey/50">
            <div className="flex items-center gap-2 text-sm text-charcoal/50 mb-3">
              <CalendarIcon className="w-4 h-4" />
              {new Date(selectedEvent.date).toLocaleDateString("en-NL", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </div>
            {selectedEvent.restaurantId && (
              <div className="mb-3">
                <p className="text-xs font-semibold text-charcoal/40 uppercase tracking-wider mb-1">
                  Restaurant
                </p>
                <p className="text-sm font-medium text-charcoal-dark">
                  {getRestaurant(selectedEvent.restaurantId)?.name || "Unknown"}
                </p>
              </div>
            )}
            <div className="mb-3">
              <StarRating rating={selectedEvent.personalRating} />
            </div>
            {selectedEvent.liked && (
              <div className="mb-3">
                <p className="text-xs font-semibold text-charcoal/40 uppercase tracking-wider mb-1">
                  Loved
                </p>
                <p className="text-sm text-charcoal/70">{selectedEvent.liked}</p>
              </div>
            )}
            {selectedEvent.disliked && (
              <div className="mb-3">
                <p className="text-xs font-semibold text-charcoal/40 uppercase tracking-wider mb-1">
                  Could improve
                </p>
                <p className="text-sm text-charcoal/70">{selectedEvent.disliked}</p>
              </div>
            )}
            {selectedEvent.ambience && (
              <div className="mb-3">
                <p className="text-xs font-semibold text-charcoal/40 uppercase tracking-wider mb-1">
                  Ambience
                </p>
                <p className="text-sm text-charcoal/70">{selectedEvent.ambience}</p>
              </div>
            )}
            {selectedEvent.notes && (
              <div className="mb-3">
                <p className="text-xs font-semibold text-charcoal/40 uppercase tracking-wider mb-1">
                  Notes
                </p>
                <p className="text-sm text-charcoal/70">{selectedEvent.notes}</p>
              </div>
            )}
            <div className="flex items-center gap-2 mt-3 pt-3 border-t border-light-grey/50">
              <span className="text-xs text-charcoal/40">Would visit again:</span>
              <span
                className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                  selectedEvent.wouldVisitAgain === "yes"
                    ? "bg-forest/10 text-forest"
                    : selectedEvent.wouldVisitAgain === "maybe"
                    ? "bg-mustard/10 text-mustard"
                    : "bg-burgundy/10 text-burgundy"
                }`}
              >
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
      <div className="px-4 pt-4 pb-2 flex items-center justify-between">
        <h1 className="text-xl font-bold text-charcoal-dark">Your Events</h1>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowAddForm(true)}
          className="flex items-center gap-1.5 bg-forest text-white text-sm font-medium px-3.5 py-2 rounded-xl"
        >
          <PlusIcon className="w-4 h-4" />
          New Event
        </motion.button>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-24">
        {events.length === 0 && !showAddForm ? (
          <div className="text-center py-16">
            <p className="text-5xl mb-4">🍽️</p>
            <p className="text-base font-medium text-charcoal/60">
              Your first meal memory starts here
            </p>
            <p className="text-sm text-charcoal/30 mt-1">
              Tap &ldquo;New Event&rdquo; to log a meal
            </p>
          </div>
        ) : (
          <>
            {/* Add form */}
            <AnimatePresence>
              {showAddForm && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="bg-white rounded-2xl p-4 border border-light-grey/50 mb-4"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-charcoal-dark">New Event</h3>
                    <button onClick={() => setShowAddForm(false)}>
                      <Cross2Icon className="w-4 h-4 text-charcoal/40" />
                    </button>
                  </div>

                  <div className="space-y-3">
                    {/* Emoji picker */}
                    <div className="flex gap-2">
                      {emojiOptions.map((e) => (
                        <button
                          key={e}
                          onClick={() => setNewEvent({ ...newEvent, emoji: e })}
                          className={`text-xl w-9 h-9 rounded-xl flex items-center justify-center ${
                            newEvent.emoji === e ? "bg-sage/30 ring-2 ring-forest/30" : "bg-cream"
                          }`}
                        >
                          {e}
                        </button>
                      ))}
                    </div>

                    <input
                      type="text"
                      placeholder="Event name (e.g., Mom's Birthday)"
                      value={newEvent.name}
                      onChange={(e) => setNewEvent({ ...newEvent, name: e.target.value })}
                      className="w-full bg-cream-light rounded-xl px-3.5 py-3 text-sm border border-light-grey/50 focus:outline-none focus:border-forest/30"
                    />
                    <input
                      type="date"
                      value={newEvent.date}
                      onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                      className="w-full bg-cream-light rounded-xl px-3.5 py-3 text-sm border border-light-grey/50 focus:outline-none focus:border-forest/30"
                    />
                    <select
                      value={newEvent.restaurantId}
                      onChange={(e) => setNewEvent({ ...newEvent, restaurantId: e.target.value })}
                      className="w-full bg-cream-light rounded-xl px-3.5 py-3 text-sm border border-light-grey/50 focus:outline-none focus:border-forest/30"
                    >
                      <option value="">Restaurant (optional)</option>
                      {restaurants.map((r) => (
                        <option key={r.id} value={r.id}>
                          {r.name}
                        </option>
                      ))}
                    </select>
                    <textarea
                      placeholder="What did you like?"
                      value={newEvent.liked}
                      onChange={(e) => setNewEvent({ ...newEvent, liked: e.target.value })}
                      className="w-full bg-cream-light rounded-xl px-3.5 py-3 text-sm border border-light-grey/50 focus:outline-none focus:border-forest/30 resize-none h-16"
                    />
                    <textarea
                      placeholder="What could be better?"
                      value={newEvent.disliked}
                      onChange={(e) => setNewEvent({ ...newEvent, disliked: e.target.value })}
                      className="w-full bg-cream-light rounded-xl px-3.5 py-3 text-sm border border-light-grey/50 focus:outline-none focus:border-forest/30 resize-none h-16"
                    />
                    <textarea
                      placeholder="Ambience notes..."
                      value={newEvent.ambience}
                      onChange={(e) => setNewEvent({ ...newEvent, ambience: e.target.value })}
                      className="w-full bg-cream-light rounded-xl px-3.5 py-3 text-sm border border-light-grey/50 focus:outline-none focus:border-forest/30 resize-none h-16"
                    />
                    <div>
                      <p className="text-xs font-medium text-charcoal/40 mb-1">Your rating</p>
                      <StarRating
                        rating={newEvent.personalRating}
                        onChange={(r) => setNewEvent({ ...newEvent, personalRating: r })}
                      />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-charcoal/40 mb-1.5">Visit again?</p>
                      <div className="flex gap-2">
                        {(["yes", "maybe", "no"] as const).map((opt) => (
                          <button
                            key={opt}
                            onClick={() => setNewEvent({ ...newEvent, wouldVisitAgain: opt })}
                            className={`text-sm font-medium px-4 py-2 rounded-xl capitalize transition-colors ${
                              newEvent.wouldVisitAgain === opt
                                ? opt === "yes"
                                  ? "bg-forest text-white"
                                  : opt === "maybe"
                                  ? "bg-mustard text-white"
                                  : "bg-burgundy text-white"
                                : "bg-cream text-charcoal/50 border border-light-grey/50"
                            }`}
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center justify-between bg-blush/20 rounded-xl px-4 py-3">
                      <div>
                        <p className="text-sm font-medium text-charcoal-dark">Make it a tradition?</p>
                        <p className="text-xs text-charcoal/40">
                          We&apos;ll remind you every year
                        </p>
                      </div>
                      <button
                        onClick={() => setNewEvent({ ...newEvent, isTradition: !newEvent.isTradition })}
                        className={`w-12 h-7 rounded-full transition-colors relative ${
                          newEvent.isTradition ? "bg-forest" : "bg-light-grey"
                        }`}
                      >
                        <motion.div
                          animate={{ x: newEvent.isTradition ? 22 : 2 }}
                          transition={{ type: "spring", stiffness: 500, damping: 30 }}
                          className="absolute top-1 w-5 h-5 bg-white rounded-full shadow-sm"
                        />
                      </button>
                    </div>
                    <motion.button
                      whileTap={{ scale: 0.98 }}
                      onClick={handleSubmit}
                      disabled={!newEvent.name || !newEvent.date}
                      className="w-full bg-forest text-white font-semibold py-3.5 rounded-2xl text-sm disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      Save Event
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Upcoming */}
            {upcoming.length > 0 && (
              <div className="mb-5">
                <h3 className="text-xs font-semibold text-charcoal/40 uppercase tracking-wider mb-2">
                  Upcoming
                </h3>
                {upcoming.map((event) => (
                  <motion.button
                    key={event.id}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedEvent(event)}
                    className="w-full text-left bg-white rounded-2xl p-4 border border-light-grey/50 mb-2"
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">{event.emoji}</span>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-sm text-charcoal-dark">{event.name}</h4>
                        <p className="text-xs text-charcoal/50 mt-0.5">
                          {new Date(event.date).toLocaleDateString("en-NL", {
                            month: "short",
                            day: "numeric",
                          })}
                          {event.restaurantId &&
                            ` · ${getRestaurant(event.restaurantId)?.name || ""}`}
                        </p>
                        {event.isTradition && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-medium text-terracotta bg-terracotta/10 px-2 py-0.5 rounded-full mt-1.5">
                            <LoopIcon className="w-2.5 h-2.5" /> Tradition
                          </span>
                        )}
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>
            )}

            {/* Past */}
            {past.length > 0 && (
              <div>
                <h3 className="text-xs font-semibold text-charcoal/40 uppercase tracking-wider mb-2">
                  Past Events
                </h3>
                {past.map((event) => (
                  <motion.button
                    key={event.id}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedEvent(event)}
                    className="w-full text-left bg-white rounded-2xl p-4 border border-light-grey/50 mb-2"
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">{event.emoji}</span>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-sm text-charcoal-dark">{event.name}</h4>
                        <p className="text-xs text-charcoal/50 mt-0.5">
                          {new Date(event.date).toLocaleDateString("en-NL", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                          {event.restaurantId &&
                            ` · ${getRestaurant(event.restaurantId)?.name || ""}`}
                        </p>
                        <div className="flex items-center gap-2 mt-1.5">
                          <StarRating rating={event.personalRating} />
                          {event.isTradition && (
                            <span className="inline-flex items-center gap-1 text-[10px] font-medium text-terracotta bg-terracotta/10 px-2 py-0.5 rounded-full">
                              <LoopIcon className="w-2.5 h-2.5" /> Tradition
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
