"use client";

import { motion } from "framer-motion";
import { HeartIcon, HeartFilledIcon, ClockIcon } from "@radix-ui/react-icons";
import type { Restaurant } from "../data/restaurants";

export default function RestaurantCard({
  restaurant,
  isFavourite,
  onToggleFavourite,
  onSelect,
  compact = false,
}: {
  restaurant: Restaurant;
  isFavourite: boolean;
  onToggleFavourite: (id: string) => void;
  onSelect: (restaurant: Restaurant) => void;
  compact?: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 12 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onSelect(restaurant)}
      className={`bg-white rounded-2xl overflow-hidden shadow-sm border border-light-grey/50 cursor-pointer ${
        compact ? "" : "mb-3"
      }`}
    >
      <div className="relative">
        <img
          src={restaurant.photo}
          alt={restaurant.name}
          className={`w-full object-cover ${compact ? "h-28" : "h-36"}`}
        />
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavourite(restaurant.id);
          }}
          className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center"
        >
          {isFavourite ? (
            <HeartFilledIcon className="w-4 h-4 text-terracotta" />
          ) : (
            <HeartIcon className="w-4 h-4 text-charcoal/60" />
          )}
        </button>
        {restaurant.available ? (
          <div className="absolute bottom-2.5 left-2.5 flex items-center gap-1.5 bg-forest/90 backdrop-blur-sm text-white text-xs font-medium px-2.5 py-1 rounded-full">
            <div className="w-1.5 h-1.5 bg-green-300 rounded-full" />
            Available
          </div>
        ) : (
          <div className="absolute bottom-2.5 left-2.5 flex items-center gap-1.5 bg-charcoal/70 backdrop-blur-sm text-white text-xs font-medium px-2.5 py-1 rounded-full">
            <ClockIcon className="w-3 h-3" />
            {restaurant.nextAvailable}
          </div>
        )}
      </div>
      <div className="p-3.5">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h3 className="font-semibold text-[15px] text-charcoal-dark truncate">
              {restaurant.name}
            </h3>
            <p className="text-xs text-charcoal/60 mt-0.5">
              {restaurant.cuisine} · {restaurant.priceRange} · 🚲 {restaurant.cyclingMinutes} min
            </p>
          </div>
          <div className="flex items-center gap-1 shrink-0 bg-cream rounded-lg px-2 py-1">
            <span className="text-mustard text-xs">★</span>
            <span className="text-xs font-medium text-charcoal-dark">{restaurant.rating}</span>
          </div>
        </div>

        {restaurant.available && restaurant.timeSlots.length > 0 && (
          <div className="mt-3 flex items-center gap-1.5 flex-wrap">
            {restaurant.timeSlots.map((time) => (
              <span
                key={time}
                className="text-xs font-medium bg-sage/30 text-forest px-2.5 py-1.5 rounded-lg"
              >
                {time}
              </span>
            ))}
            {restaurant.spotsLeft && restaurant.spotsLeft <= 3 && (
              <span className="text-xs font-medium text-terracotta ml-auto">
                🔥 {restaurant.spotsLeft} left
              </span>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}
