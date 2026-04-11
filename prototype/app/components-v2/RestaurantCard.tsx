"use client";

import { useRef, useState, useCallback } from "react";
import { motion } from "framer-motion";
import {
  HeartIcon,
  HeartFilledIcon,
  ClockIcon,
  TimerIcon,
  LightningBoltIcon,
  StarFilledIcon,
} from "@radix-ui/react-icons";
import type { Restaurant } from "../data/restaurants";

const spring = { type: "spring" as const, stiffness: 400, damping: 28, mass: 0.8 };

function ratingColor(rating: number): string {
  if (rating >= 4.5) return "bg-[#00C853]";
  if (rating >= 4.0) return "bg-[#7CB342]";
  if (rating >= 3.5) return "bg-[#FFB300]";
  return "bg-ate-muted";
}

export default function RestaurantCard({
  restaurant,
  isFavourite,
  onToggleFavourite,
  onSelect,
}: {
  restaurant: Restaurant;
  isFavourite: boolean;
  onToggleFavourite: (id: string) => void;
  onSelect: (restaurant: Restaurant) => void;
}) {
  const r = restaurant;
  const photos = r.photos && r.photos.length > 0 ? r.photos : [r.photo];
  const [activePhoto, setActivePhoto] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const swipedRef = useRef(false);
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);

  const handleScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const index = Math.round(el.scrollLeft / el.clientWidth);
    setActivePhoto(index);
  }, []);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    swipedRef.current = false;
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!touchStartRef.current) return;
    const dx = Math.abs(e.touches[0].clientX - touchStartRef.current.x);
    const dy = Math.abs(e.touches[0].clientY - touchStartRef.current.y);
    if (dx > 8 || dy > 8) {
      swipedRef.current = true;
    }
  }, []);

  const handleCardClick = useCallback(() => {
    if (!swipedRef.current) {
      onSelect(r);
    }
  }, [onSelect, r]);

  return (
    <motion.div
      whileTap={{ scale: 0.975 }}
      transition={spring}
      onClick={handleCardClick}
      className="w-full mb-4 group cursor-pointer"
      role="button"
      tabIndex={0}
    >
      <div className="rounded-2xl transition-shadow hover:shadow-md">
        {/* Hero Photo Carousel */}
        <div className="relative w-full h-[280px] overflow-hidden">
          <div
            ref={scrollRef}
            onScroll={handleScroll}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            className="flex w-full h-full overflow-x-auto snap-x snap-mandatory no-scrollbar"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none", WebkitOverflowScrolling: "touch" }}
          >
            {photos.map((photo, i) => (
              <img
                key={i}
                src={photo}
                alt={`${r.name} ${i + 1}`}
                className="w-full h-full object-cover flex-shrink-0 snap-center"
                draggable={false}
              />
            ))}
          </div>

          {/* Dot indicators */}
          {photos.length > 1 && (
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-10">
              {photos.map((_, i) => (
                <span
                  key={i}
                  className={`block rounded-full transition-all duration-200 ${
                    i === activePhoto
                      ? "w-1.5 h-1.5 bg-white"
                      : "w-1 h-1 bg-white/50"
                  }`}
                />
              ))}
            </div>
          )}

          {/* Gradient overlay for readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none" />

          {/* TRENDING badge — top-left */}
          {r.rating >= 4.6 && (
            <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm px-2 py-[2px] rounded-md">
              <span className="text-[9px] font-bold uppercase tracking-[0.08em] text-ate-ink">
                Trending
              </span>
            </div>
          )}

          {/* Favourite heart — top-right */}
          <motion.button
            whileTap={{ scale: 0.8 }}
            transition={spring}
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavourite(r.id);
            }}
            className="absolute top-2 right-2 w-7 h-7 flex items-center justify-center rounded-full bg-white/80 backdrop-blur-sm"
          >
            {isFavourite ? (
              <HeartFilledIcon className="w-3.5 h-3.5 text-ate-coral" />
            ) : (
              <HeartIcon className="w-3.5 h-3.5 text-ate-ink/50" />
            )}
          </motion.button>

          {/* Rating badge — bottom-left */}
          <div
            className={`absolute bottom-2 left-2 flex items-center gap-1 px-2 py-[3px] rounded-md ${ratingColor(r.rating)}`}
          >
            <StarFilledIcon className="w-2.5 h-2.5 text-white" />
            <span className="text-[11px] font-bold text-white leading-none">
              {r.rating}
            </span>
          </div>
        </div>

        {/* Content below photo */}
        <div className="px-1 pt-2.5 pb-1">
          {/* Restaurant name */}
          <h3 className="font-editorial font-bold text-[16px] text-ate-ink leading-tight tracking-[-0.01em] truncate">
            {r.name}
          </h3>

          {/* Metadata line */}
          <p className="text-[12px] text-ate-muted mt-1 font-medium">
            {r.cuisine}
            <span className="mx-1.5 text-ate-muted/30">/</span>
            {r.priceRange}
            <span className="mx-1.5 text-ate-muted/30">/</span>
            {r.cyclingMinutes} min
          </p>

          {/* Offer badge */}
          {r.hasOffer && r.offerText && (
            <div className="mt-2 inline-flex items-center gap-1 bg-ate-green/10 text-ate-green px-2 py-[3px] rounded-md">
              <LightningBoltIcon className="w-3 h-3" />
              <span className="text-[11px] font-bold">{r.offerText}</span>
            </div>
          )}

          {/* Time slots / availability */}
          <div className="mt-2 flex items-center gap-1.5 flex-wrap">
            {r.available && r.timeSlots.length > 0 ? (
              <>
                {r.timeSlots.slice(0, 4).map((time) => (
                  <span
                    key={time}
                    className="text-[10px] font-semibold bg-ate-ink/[0.04] text-ate-ink px-2 py-[3px] rounded-md tabular-nums"
                  >
                    {time}
                  </span>
                ))}
                {r.spotsLeft && r.spotsLeft <= 3 && (
                  <span className="flex items-center gap-1 text-[10px] font-bold text-ate-red ml-auto">
                    <TimerIcon className="w-2.5 h-2.5" />
                    {r.spotsLeft} left
                  </span>
                )}
              </>
            ) : (
              <span className="flex items-center gap-1 text-[11px] font-medium text-ate-muted">
                <ClockIcon className="w-3 h-3" />
                Next: {r.nextAvailable}
              </span>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
