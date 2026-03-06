"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Cross2Icon,
  HeartIcon,
  HeartFilledIcon,
  ExternalLinkIcon,
  BellIcon,
  InstagramLogoIcon,
  ClockIcon,
  StarFilledIcon,
  TimerIcon,
  LightningBoltIcon,
} from "@radix-ui/react-icons";
import type { Restaurant } from "../data/restaurants";

const spring = { type: "spring" as const, stiffness: 320, damping: 28, mass: 0.9 };

const GUEST_OPTIONS = [1, 2, 3, 4, 5, 6];

function getRatingColor(rating: number): string {
  if (rating >= 4.5) return "bg-[#1B8A2A]";
  if (rating >= 4.0) return "bg-[#6BAD2E]";
  if (rating >= 3.5) return "bg-[#D4A017]";
  return "bg-ate-muted";
}

export default function RestaurantDetail({
  restaurant,
  isFavourite,
  onToggleFavourite,
  onClose,
}: {
  restaurant: Restaurant | null;
  isFavourite: boolean;
  onToggleFavourite: (id: string) => void;
  onClose: () => void;
}) {
  const [selectedGuests, setSelectedGuests] = useState(2);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);

  if (!restaurant) return null;

  return (
    <AnimatePresence>
      {/* Backdrop overlay */}
      <motion.div
        key="overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
        onClick={onClose}
        className="fixed inset-0 bg-ate-ink/30 backdrop-blur-[3px] z-40"
      />

      {/* Bottom sheet */}
      <motion.div
        key="sheet"
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ ...spring, stiffness: 280 }}
        className="fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-[28px] max-h-[92vh] overflow-y-auto overscroll-contain"
      >
        {/* Drag handle */}
        <div className="sticky top-0 z-10 flex justify-center pt-3 pb-1 bg-white rounded-t-[28px]">
          <div className="w-10 h-[3px] bg-ate-ink/10 rounded-full" />
        </div>

        {/* ---- PHOTO SECTION ---- */}
        <div className="relative w-full overflow-hidden">
          <img
            src={restaurant.photo}
            alt={restaurant.name}
            className="w-full h-[220px] object-cover"
          />

          {/* Gradient overlay for text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent pointer-events-none" />

          {/* Top-right: Close + Favourite */}
          <div className="absolute top-3 right-3 flex items-center gap-2">
            <motion.button
              whileTap={{ scale: 0.85 }}
              transition={spring}
              onClick={() => onToggleFavourite(restaurant.id)}
              className={`w-9 h-9 rounded-full backdrop-blur-md flex items-center justify-center ${
                isFavourite
                  ? "bg-white/90 text-ate-coral"
                  : "bg-ate-ink/40 text-white"
              }`}
            >
              {isFavourite ? (
                <HeartFilledIcon className="w-[17px] h-[17px]" />
              ) : (
                <HeartIcon className="w-[17px] h-[17px]" />
              )}
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.85 }}
              transition={spring}
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-ate-ink/40 backdrop-blur-md flex items-center justify-center"
            >
              <Cross2Icon className="w-3.5 h-3.5 text-white" />
            </motion.button>
          </div>

          {/* Bottom-left: Rating badge */}
          <div
            className={`absolute bottom-3 left-4 flex items-center gap-1.5 ${getRatingColor(
              restaurant.rating
            )} rounded-lg px-2.5 py-1.5`}
          >
            <StarFilledIcon className="w-3 h-3 text-white" />
            <span className="font-editorial font-bold text-[13px] text-white leading-none">
              {restaurant.rating}
            </span>
            <span className="text-[10px] text-white/70 font-medium leading-none">
              {restaurant.ratingSource}
            </span>
          </div>
        </div>

        {/* ---- CONTENT ---- */}
        <div className="px-5 pb-32">
          {/* Restaurant name + metadata */}
          <div className="mt-5">
            <h2 className="font-editorial text-[26px] font-extrabold text-ate-ink leading-tight tracking-[-0.02em]">
              {restaurant.name}
            </h2>
            <p className="text-[12px] text-ate-muted mt-1.5 font-medium tracking-wide">
              {restaurant.cuisine}
              <span className="mx-1.5 text-ate-muted/25">/</span>
              {restaurant.priceRange}
              <span className="mx-1.5 text-ate-muted/25">/</span>
              {restaurant.cyclingMinutes} min cycle
            </p>
          </div>

          {/* Offer banner */}
          {restaurant.hasOffer && restaurant.offerText && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, ...spring }}
              className="mt-4 flex items-center gap-2.5 bg-[#E8F5E9] rounded-xl px-4 py-3"
            >
              <div className="w-7 h-7 rounded-full bg-[#1B8A2A]/10 flex items-center justify-center shrink-0">
                <LightningBoltIcon className="w-3.5 h-3.5 text-[#1B8A2A]" />
              </div>
              <span className="text-[12px] font-semibold text-[#1B8A2A] leading-snug">
                {restaurant.offerText}
              </span>
            </motion.div>
          )}

          {/* Thin editorial rule */}
          <div className="h-[1px] bg-ate-ink/[0.06] my-5" />

          {/* Description with editorial accent line */}
          <div className="border-l-2 border-ate-red/30 pl-4">
            <p className="text-[13px] text-ate-ink/55 leading-[1.7] font-medium">
              {restaurant.description}
            </p>
          </div>

          {restaurant.maxDuration && (
            <div className="flex items-center gap-1.5 mt-3 text-[11px] text-ate-muted font-medium">
              <TimerIcon className="w-3 h-3" />
              {restaurant.maxDuration} min max duration
            </div>
          )}

          {/* ---- BOOK A TABLE ---- */}
          <div className="mt-7">
            <h3 className="font-editorial text-[18px] font-extrabold text-ate-ink tracking-[-0.01em]">
              {restaurant.available ? "Book a table" : "Currently unavailable"}
            </h3>

            {restaurant.available ? (
              <div className="mt-4">
                {/* Date / Time / Guests quick selector */}
                <div className="flex items-center gap-2 overflow-x-auto pb-1">
                  {/* Date chip */}
                  <div className="flex items-center gap-1.5 bg-ate-grey rounded-xl px-3.5 py-2.5 shrink-0">
                    <ClockIcon className="w-3.5 h-3.5 text-ate-muted" />
                    <span className="text-[12px] font-semibold text-ate-ink">
                      Today
                    </span>
                  </div>

                  {/* Guests selector */}
                  <div className="flex items-center gap-1 bg-ate-grey rounded-xl px-2 py-1.5 shrink-0">
                    {GUEST_OPTIONS.map((n) => (
                      <motion.button
                        key={n}
                        whileTap={{ scale: 0.9 }}
                        transition={spring}
                        onClick={() => setSelectedGuests(n)}
                        className={`w-7 h-7 rounded-lg text-[11px] font-bold flex items-center justify-center transition-colors ${
                          selectedGuests === n
                            ? "bg-ate-ink text-white"
                            : "text-ate-muted hover:text-ate-ink"
                        }`}
                      >
                        {n}
                      </motion.button>
                    ))}
                    <span className="text-[10px] text-ate-muted font-medium pl-1 pr-1">
                      guests
                    </span>
                  </div>
                </div>

                {/* Time slot grid */}
                <div className="grid grid-cols-4 gap-2 mt-4">
                  {restaurant.timeSlots.map((time) => (
                    <motion.button
                      key={time}
                      whileTap={{ scale: 0.94 }}
                      transition={spring}
                      onClick={() => setSelectedSlot(time)}
                      className={`text-[13px] font-semibold px-3 py-2.5 rounded-xl tabular-nums text-center transition-colors ${
                        selectedSlot === time
                          ? "bg-ate-red text-white shadow-[0_2px_12px_rgba(255,68,56,0.3)]"
                          : "bg-ate-ink text-white"
                      }`}
                    >
                      {time}
                    </motion.button>
                  ))}
                </div>

                {/* Spots remaining */}
                {restaurant.spotsLeft && restaurant.spotsLeft <= 5 && (
                  <div className="flex items-center gap-1.5 mt-3">
                    <TimerIcon className="w-3.5 h-3.5 text-ate-red" />
                    <span className="text-[11px] font-bold text-ate-red">
                      {restaurant.spotsLeft} spot{restaurant.spotsLeft > 1 ? "s" : ""} remaining
                    </span>
                  </div>
                )}
              </div>
            ) : (
              /* Notify me section */
              <div className="mt-4 bg-ate-grey rounded-2xl px-5 py-4">
                <div className="flex items-center gap-2.5">
                  <ClockIcon className="w-4 h-4 text-ate-muted shrink-0" />
                  <div>
                    <span className="text-[12px] text-ate-muted font-medium block">
                      Next available
                    </span>
                    <span className="text-[14px] text-ate-ink font-semibold">
                      {restaurant.nextAvailable}
                    </span>
                  </div>
                </div>
                <motion.button
                  whileTap={{ scale: 0.96 }}
                  transition={spring}
                  className="mt-3 w-full flex items-center justify-center gap-2 text-ate-red text-[12px] font-bold px-4 py-3 rounded-xl bg-ate-red/[0.07] transition-colors"
                >
                  <BellIcon className="w-4 h-4" />
                  Notify me when available
                </motion.button>
              </div>
            )}
          </div>

          {/* ---- VIBES ---- */}
          <div className="mt-7">
            <h3 className="text-[9px] font-editorial font-bold text-ate-muted uppercase tracking-[0.15em] mb-2.5">
              Vibe
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {restaurant.vibes.map((vibe) => (
                <span
                  key={vibe}
                  className="text-[11px] font-semibold bg-ate-grey text-ate-ink/50 px-3 py-1.5 rounded-full"
                >
                  {vibe}
                </span>
              ))}
            </div>
          </div>

          {/* ---- BEST TIME TO VISIT ---- */}
          <div className="mt-5">
            <h3 className="text-[9px] font-editorial font-bold text-ate-muted uppercase tracking-[0.15em] mb-2.5">
              Best time to visit
            </h3>
            <div className="flex items-center gap-2.5 bg-ate-grey rounded-xl px-4 py-3">
              <ClockIcon className="w-4 h-4 text-ate-ink/30" />
              <span className="text-[12px] text-ate-ink/50 font-medium">
                {restaurant.bestTime}
              </span>
            </div>
          </div>

          {/* ---- SOCIAL LINKS ---- */}
          <div className="mt-5 flex items-center gap-2.5">
            <a
              href="#"
              className="flex items-center gap-2 text-[11px] text-ate-muted font-medium bg-ate-grey rounded-xl px-3.5 py-2.5 transition-colors hover:bg-ate-ink/[0.06]"
            >
              <InstagramLogoIcon className="w-3.5 h-3.5" />
              {restaurant.instagram}
            </a>
            <a
              href={restaurant.website}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-[11px] text-ate-muted font-medium bg-ate-grey rounded-xl px-3.5 py-2.5 transition-colors hover:bg-ate-ink/[0.06]"
            >
              <ExternalLinkIcon className="w-3.5 h-3.5" />
              Website
            </a>
          </div>

          {/* ---- BIG CTA BUTTON ---- */}
          <motion.a
            href={restaurant.website}
            target="_blank"
            rel="noopener noreferrer"
            whileTap={{ scale: 0.98 }}
            transition={spring}
            className="mt-8 flex items-center justify-center gap-2.5 w-full bg-ate-red text-white font-editorial font-bold py-4 rounded-2xl text-[15px] tracking-[-0.01em] shadow-[0_4px_20px_rgba(255,68,56,0.25)]"
          >
            {restaurant.available
              ? selectedSlot
                ? `Reserve ${selectedSlot} for ${selectedGuests}`
                : "Book a table"
              : "View on their website"}
            <ExternalLinkIcon className="w-4 h-4 opacity-60" />
          </motion.a>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
