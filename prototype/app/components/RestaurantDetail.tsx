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
  StarFilledIcon,
  TimerIcon,
} from "@radix-ui/react-icons";
import type { Restaurant } from "../data/restaurants";

const spring = { type: "spring" as const, stiffness: 320, damping: 28, mass: 0.9 };

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
        transition={{ duration: 0.25 }}
        onClick={onClose}
        className="fixed inset-0 bg-charcoal-dark/20 backdrop-blur-[2px] z-40"
      />
      <motion.div
        key="sheet"
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ ...spring, stiffness: 280 }}
        className="fixed bottom-0 left-0 right-0 z-50 bg-cream-light rounded-t-[28px] max-h-[92vh] overflow-y-auto overscroll-contain"
      >
        {/* Handle */}
        <div className="sticky top-0 z-10 flex justify-center pt-3 pb-1 bg-cream-light rounded-t-[28px]">
          <div className="w-8 h-[3px] bg-charcoal/10 rounded-full" />
        </div>

        {/* Hero image */}
        <div className="relative mx-4 rounded-2xl overflow-hidden">
          <img
            src={restaurant.photo}
            alt={restaurant.name}
            className="w-full h-52 object-cover"
          />
          <motion.button
            whileTap={{ scale: 0.85 }}
            transition={spring}
            onClick={onClose}
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-charcoal-dark/40 backdrop-blur-md flex items-center justify-center"
          >
            <Cross2Icon className="w-3.5 h-3.5 text-white" />
          </motion.button>
        </div>

        <div className="px-5 pb-32">
          {/* Header */}
          <div className="flex items-start justify-between mt-5 gap-3">
            <div className="min-w-0">
              <h2 className="text-[24px] font-normal text-charcoal-dark leading-tight font-[family-name:var(--font-instrument)]">
                {restaurant.name}
              </h2>
              <p className="text-[13px] text-charcoal/40 mt-1 font-medium">
                {restaurant.cuisine}
                <span className="mx-1.5 text-charcoal/12">·</span>
                {restaurant.priceRange}
                <span className="mx-1.5 text-charcoal/12">·</span>
                {restaurant.cyclingMinutes} min cycle
              </p>
            </div>
            <motion.button
              whileTap={{ scale: 0.85 }}
              transition={spring}
              onClick={() => onToggleFavourite(restaurant.id)}
              className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                isFavourite
                  ? "bg-terracotta/10 text-terracotta"
                  : "bg-charcoal/[0.04] text-charcoal/20"
              }`}
            >
              {isFavourite ? (
                <HeartFilledIcon className="w-[18px] h-[18px]" />
              ) : (
                <HeartIcon className="w-[18px] h-[18px]" />
              )}
            </motion.button>
          </div>

          {/* Rating + duration */}
          <div className="flex items-center gap-3 mt-3">
            <div className="flex items-center gap-1.5 text-[13px]">
              <StarFilledIcon className="w-3.5 h-3.5 text-mustard" />
              <span className="font-semibold text-charcoal-dark">{restaurant.rating}</span>
              <span className="text-charcoal/25 font-medium">{restaurant.ratingSource}</span>
            </div>
            {restaurant.maxDuration && (
              <>
                <span className="text-charcoal/10">|</span>
                <div className="flex items-center gap-1 text-[12px] text-charcoal/30 font-medium">
                  <TimerIcon className="w-3 h-3" />
                  {restaurant.maxDuration} min max
                </div>
              </>
            )}
          </div>

          {/* Description */}
          <p className="text-[14px] text-charcoal/50 mt-4 leading-[1.6] font-[420]">
            {restaurant.description}
          </p>

          {/* Vibe */}
          <div className="mt-6">
            <h3 className="text-[11px] font-bold text-charcoal/25 uppercase tracking-[0.08em] mb-2.5">
              Vibe
            </h3>
            <div className="flex flex-wrap gap-2">
              {restaurant.vibes.map((vibe) => (
                <span
                  key={vibe}
                  className="text-[12px] font-medium bg-charcoal/[0.04] text-charcoal/50 px-3 py-1.5 rounded-full"
                >
                  {vibe}
                </span>
              ))}
            </div>
          </div>

          {/* Best Time */}
          <div className="mt-5">
            <h3 className="text-[11px] font-bold text-charcoal/25 uppercase tracking-[0.08em] mb-2.5">
              Best time to visit
            </h3>
            <div className="flex items-center gap-2.5 bg-sage/15 rounded-xl px-4 py-3">
              <ClockIcon className="w-4 h-4 text-forest/60" />
              <span className="text-[13px] text-charcoal/60 font-medium">{restaurant.bestTime}</span>
            </div>
          </div>

          {/* Availability */}
          <div className="mt-5">
            <h3 className="text-[11px] font-bold text-charcoal/25 uppercase tracking-[0.08em] mb-2.5">
              {restaurant.available ? "Available tonight" : "Fully booked"}
            </h3>
            {restaurant.available ? (
              <div>
                <div className="flex flex-wrap gap-2">
                  {restaurant.timeSlots.map((time) => (
                    <motion.button
                      key={time}
                      whileTap={{ scale: 0.94 }}
                      transition={spring}
                      className="text-[13px] font-semibold bg-forest text-white px-5 py-2.5 rounded-xl tracking-wide"
                    >
                      {time}
                    </motion.button>
                  ))}
                </div>
                {restaurant.spotsLeft && restaurant.spotsLeft <= 5 && (
                  <div className="flex items-center gap-1.5 mt-3">
                    <TimerIcon className="w-3.5 h-3.5 text-terracotta" />
                    <span className="text-[12px] font-semibold text-terracotta">
                      {restaurant.spotsLeft} spots remaining
                    </span>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-charcoal/[0.03] rounded-xl px-4 py-3.5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ClockIcon className="w-4 h-4 text-charcoal/25" />
                  <span className="text-[13px] text-charcoal/50 font-medium">
                    Next: <span className="text-charcoal-dark font-semibold">{restaurant.nextAvailable}</span>
                  </span>
                </div>
                <motion.button
                  whileTap={{ scale: 0.94 }}
                  transition={spring}
                  className="flex items-center gap-1.5 text-forest text-[12px] font-semibold px-3.5 py-2 rounded-lg bg-forest/[0.06]"
                >
                  <BellIcon className="w-3.5 h-3.5" />
                  Notify me
                </motion.button>
              </div>
            )}
          </div>

          {/* Social */}
          <div className="mt-5 flex items-center gap-2.5">
            <a
              href="#"
              className="flex items-center gap-2 text-[12px] text-charcoal/35 font-medium bg-charcoal/[0.03] rounded-lg px-3.5 py-2.5"
            >
              <InstagramLogoIcon className="w-3.5 h-3.5" />
              {restaurant.instagram}
            </a>
          </div>

          {/* CTA */}
          <motion.a
            href={restaurant.website}
            target="_blank"
            rel="noopener noreferrer"
            whileTap={{ scale: 0.98 }}
            transition={spring}
            className="mt-7 flex items-center justify-center gap-2.5 w-full bg-charcoal-dark text-white font-semibold py-4 rounded-2xl text-[15px] tracking-[-0.01em]"
          >
            Book on their website
            <ExternalLinkIcon className="w-4 h-4 opacity-50" />
          </motion.a>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
