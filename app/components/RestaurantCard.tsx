"use client";

import { motion } from "framer-motion";
import {
  HeartIcon,
  HeartFilledIcon,
  ClockIcon,
  TimerIcon,
} from "@radix-ui/react-icons";
import type { Restaurant } from "../data/restaurants";

const spring = { type: "spring" as const, stiffness: 400, damping: 28, mass: 0.8 };

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
  return (
    <motion.button
      whileTap={{ scale: 0.975 }}
      transition={spring}
      onClick={() => onSelect(restaurant)}
      className="w-full text-left mb-3 group"
    >
      <div className="flex gap-3.5 items-start">
        {/* Photo */}
        <div className="relative w-[72px] h-[72px] rounded-2xl overflow-hidden shrink-0">
          <img
            src={restaurant.photo}
            alt={restaurant.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          {/* Availability indicator */}
          <div
            className={`absolute top-1.5 left-1.5 w-2 h-2 rounded-full ${
              restaurant.available
                ? "bg-forest shadow-[0_0_0_2px_rgba(255,255,255,0.9)]"
                : "bg-charcoal/40 shadow-[0_0_0_2px_rgba(255,255,255,0.9)]"
            }`}
          />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 py-0.5">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h3 className="font-bold text-[15px] text-charcoal-dark leading-tight tracking-[-0.01em] truncate font-[family-name:var(--font-instrument)]">
                {restaurant.name}
              </h3>
              <p className="text-[12px] text-charcoal/40 mt-0.5 font-medium">
                {restaurant.cuisine}
                <span className="mx-1 text-charcoal/15">·</span>
                {restaurant.priceRange}
                <span className="mx-1 text-charcoal/15">·</span>
                {restaurant.cyclingMinutes} min
              </p>
            </div>
            <motion.button
              whileTap={{ scale: 0.8 }}
              transition={spring}
              onClick={(e) => {
                e.stopPropagation();
                onToggleFavourite(restaurant.id);
              }}
              className="mt-0.5 shrink-0"
            >
              {isFavourite ? (
                <HeartFilledIcon className="w-4 h-4 text-terracotta" />
              ) : (
                <HeartIcon className="w-4 h-4 text-charcoal/15" />
              )}
            </motion.button>
          </div>

          {/* Time slots or next available */}
          <div className="mt-2 flex items-center gap-1.5 flex-wrap">
            {restaurant.available && restaurant.timeSlots.length > 0 ? (
              <>
                {restaurant.timeSlots.slice(0, 4).map((time) => (
                  <span
                    key={time}
                    className="text-[11px] font-semibold bg-forest/[0.06] text-forest px-2 py-1 rounded-md tracking-wide"
                  >
                    {time}
                  </span>
                ))}
                {restaurant.spotsLeft && restaurant.spotsLeft <= 3 && (
                  <span className="flex items-center gap-1 text-[11px] font-semibold text-terracotta ml-auto">
                    <TimerIcon className="w-3 h-3" />
                    {restaurant.spotsLeft} left
                  </span>
                )}
              </>
            ) : (
              <span className="flex items-center gap-1 text-[11px] font-medium text-charcoal/30">
                <ClockIcon className="w-3 h-3" />
                Next: {restaurant.nextAvailable}
              </span>
            )}
          </div>
        </div>
      </div>
    </motion.button>
  );
}
