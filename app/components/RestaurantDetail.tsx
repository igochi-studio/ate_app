"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  Cross2Icon,
  HeartIcon,
  HeartFilledIcon,
  ExternalLinkIcon,
  BellIcon,
  InstagramLogoIcon,
  ClockIcon,
  InfoCircledIcon,
} from "@radix-ui/react-icons";
import type { Restaurant } from "../data/restaurants";

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
  if (!restaurant) return null;

  return (
    <AnimatePresence>
      <motion.div
        key="overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-charcoal-dark/30 z-40"
      />
      <motion.div
        key="sheet"
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 28, stiffness: 300 }}
        className="fixed bottom-0 left-0 right-0 z-50 bg-cream-light rounded-t-3xl max-h-[90vh] overflow-y-auto"
      >
        <div className="sticky top-0 z-10 flex justify-center pt-3 pb-1 bg-cream-light rounded-t-3xl">
          <div className="w-10 h-1 bg-light-grey rounded-full" />
        </div>

        <div className="relative">
          <img
            src={restaurant.photo}
            alt={restaurant.name}
            className="w-full h-56 object-cover"
          />
          <button
            onClick={onClose}
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center"
          >
            <Cross2Icon className="w-4 h-4 text-charcoal-dark" />
          </button>
        </div>

        <div className="px-5 pb-32">
          <div className="flex items-start justify-between mt-4">
            <div>
              <h2 className="text-xl font-bold text-charcoal-dark font-[family-name:var(--font-fraunces)]">
                {restaurant.name}
              </h2>
              <p className="text-sm text-charcoal/60 mt-1">
                {restaurant.cuisine} · {restaurant.priceRange} · 🚲 {restaurant.cyclingMinutes} min
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => onToggleFavourite(restaurant.id)}
                className="w-10 h-10 rounded-full bg-white border border-light-grey flex items-center justify-center"
              >
                {isFavourite ? (
                  <HeartFilledIcon className="w-5 h-5 text-terracotta" />
                ) : (
                  <HeartIcon className="w-5 h-5 text-charcoal/40" />
                )}
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3 mt-3">
            <div className="flex items-center gap-1 bg-cream rounded-lg px-2.5 py-1.5">
              <span className="text-mustard text-sm">★</span>
              <span className="text-sm font-medium">{restaurant.rating}</span>
              <span className="text-xs text-charcoal/50">{restaurant.ratingSource}</span>
            </div>
            {restaurant.maxDuration && (
              <div className="flex items-center gap-1 text-xs text-charcoal/50">
                <InfoCircledIcon className="w-3.5 h-3.5" />
                {restaurant.maxDuration} min max
              </div>
            )}
          </div>

          <p className="text-sm text-charcoal/70 mt-4 leading-relaxed">
            {restaurant.description}
          </p>

          {/* Vibe Check */}
          <div className="mt-5">
            <h3 className="text-xs font-semibold text-charcoal/40 uppercase tracking-wider mb-2">
              Vibe Check
            </h3>
            <div className="flex flex-wrap gap-2">
              {restaurant.vibes.map((vibe) => (
                <span
                  key={vibe}
                  className="text-xs font-medium bg-blush/50 text-charcoal-dark px-3 py-1.5 rounded-full"
                >
                  {vibe}
                </span>
              ))}
            </div>
          </div>

          {/* Best Time */}
          <div className="mt-5">
            <h3 className="text-xs font-semibold text-charcoal/40 uppercase tracking-wider mb-2">
              Best Time to Visit
            </h3>
            <div className="flex items-center gap-2 bg-sage/20 rounded-xl px-4 py-3">
              <ClockIcon className="w-4 h-4 text-forest" />
              <span className="text-sm text-charcoal-dark">{restaurant.bestTime}</span>
            </div>
          </div>

          {/* Availability */}
          <div className="mt-5">
            <h3 className="text-xs font-semibold text-charcoal/40 uppercase tracking-wider mb-2">
              {restaurant.available ? "Available Tonight" : "Fully Booked"}
            </h3>
            {restaurant.available ? (
              <div className="flex flex-wrap gap-2">
                {restaurant.timeSlots.map((time) => (
                  <motion.button
                    key={time}
                    whileTap={{ scale: 0.95 }}
                    className="text-sm font-medium bg-forest text-white px-4 py-2.5 rounded-xl"
                  >
                    {time}
                  </motion.button>
                ))}
                {restaurant.spotsLeft && restaurant.spotsLeft <= 5 && (
                  <div className="flex items-center ml-auto">
                    <span className="text-sm font-medium text-terracotta">
                      🔥 {restaurant.spotsLeft} spots left
                    </span>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-warm-beige/30 rounded-xl px-4 py-3 flex items-center justify-between">
                <div>
                  <span className="text-sm text-charcoal-dark">
                    Next available: <span className="font-medium">{restaurant.nextAvailable}</span>
                  </span>
                </div>
                <button className="flex items-center gap-1.5 bg-cream text-forest text-sm font-medium px-3 py-2 rounded-xl border border-forest/20">
                  <BellIcon className="w-3.5 h-3.5" />
                  Notify me
                </button>
              </div>
            )}
          </div>

          {/* Social */}
          <div className="mt-5 flex items-center gap-3">
            <a
              href="#"
              className="flex items-center gap-2 text-sm text-charcoal/60 bg-white rounded-xl px-4 py-2.5 border border-light-grey"
            >
              <InstagramLogoIcon className="w-4 h-4" />
              {restaurant.instagram}
            </a>
          </div>

          {/* Book Now */}
          <motion.a
            href={restaurant.website}
            target="_blank"
            rel="noopener noreferrer"
            whileTap={{ scale: 0.98 }}
            className="mt-6 flex items-center justify-center gap-2 w-full bg-forest text-white font-semibold py-4 rounded-2xl text-base"
          >
            Book on their website
            <ExternalLinkIcon className="w-4 h-4" />
          </motion.a>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
