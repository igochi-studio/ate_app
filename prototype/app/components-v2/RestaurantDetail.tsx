"use client";

import { useState, useRef, useCallback, useEffect } from "react";
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
  ChevronRightIcon,
  ChevronLeftIcon,
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

/* ---- Phone SVG icon ---- */
function PhoneIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 15 15"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M4.73 1.08a.75.75 0 0 0-1.26-.2L2.2 2.15a2.25 2.25 0 0 0-.46 2.38A18.97 18.97 0 0 0 5.7 9.3a18.97 18.97 0 0 0 4.77 3.96 2.25 2.25 0 0 0 2.38-.46l1.27-1.27a.75.75 0 0 0-.2-1.26l-2.5-1a.75.75 0 0 0-.72.13l-1.09.87a.15.15 0 0 1-.17.01 14.5 14.5 0 0 1-3.9-3.9.15.15 0 0 1 .01-.17l.87-1.09a.75.75 0 0 0 .13-.72l-1-2.5Z"
        fill="currentColor"
      />
    </svg>
  );
}

/* ---- Directions / map SVG icon ---- */
function DirectionsIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 15 15"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M7.5 1a.5.5 0 0 1 .354.146l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708l6-6A.5.5 0 0 1 7.5 1ZM7 5.5a.5.5 0 0 1 .5-.5H9a1 1 0 0 1 1 1v2.5a.5.5 0 0 1-1 0V6H7.5a.5.5 0 0 1-.5-.5Z"
        fill="currentColor"
        fillRule="evenodd"
        clipRule="evenodd"
      />
    </svg>
  );
}

/* ---- Menu SVG icon ---- */
function MenuIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 15 15"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M2 3.5a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1h-10a.5.5 0 0 1-.5-.5Zm0 4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1h-10a.5.5 0 0 1-.5-.5Zm.5 3.5a.5.5 0 0 0 0 1h10a.5.5 0 0 0 0-1h-10Z"
        fill="currentColor"
        fillRule="evenodd"
        clipRule="evenodd"
      />
    </svg>
  );
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
  const [activePhoto, setActivePhoto] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [notifyToast, setNotifyToast] = useState<string | null>(null);
  const galleryRef = useRef<HTMLDivElement>(null);

  const photos =
    restaurant && restaurant.photos && restaurant.photos.length > 0
      ? restaurant.photos
      : restaurant
      ? [restaurant.photo]
      : [];

  /* ---- Gallery scroll tracking ---- */
  const handleGalleryScroll = useCallback(() => {
    const el = galleryRef.current;
    if (!el) return;
    const index = Math.round(el.scrollLeft / el.clientWidth);
    setActivePhoto(index);
  }, []);

  /* ---- Lightbox navigation ---- */
  const lightboxPrev = useCallback(() => {
    setLightboxIndex((i) => (i > 0 ? i - 1 : photos.length - 1));
  }, [photos.length]);

  const lightboxNext = useCallback(() => {
    setLightboxIndex((i) => (i < photos.length - 1 ? i + 1 : 0));
  }, [photos.length]);

  /* ---- Lightbox keyboard nav ---- */
  useEffect(() => {
    if (!lightboxOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") lightboxPrev();
      else if (e.key === "ArrowRight") lightboxNext();
      else if (e.key === "Escape") setLightboxOpen(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [lightboxOpen, lightboxPrev, lightboxNext]);

  /* ---- Notify toast auto-dismiss ---- */
  useEffect(() => {
    if (!notifyToast) return;
    const t = setTimeout(() => setNotifyToast(null), 2000);
    return () => clearTimeout(t);
  }, [notifyToast]);

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

        {/* ---- PHOTO GALLERY ---- */}
        <div className="relative w-full overflow-hidden">
          <div
            ref={galleryRef}
            onScroll={handleGalleryScroll}
            onClick={() => {
              setLightboxIndex(activePhoto);
              setLightboxOpen(true);
            }}
            className="flex w-full overflow-x-auto snap-x snap-mandatory scrollbar-hide cursor-pointer"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {photos.map((src, i) => (
              <img
                key={i}
                src={src}
                alt={`${restaurant.name} photo ${i + 1}`}
                className="w-full h-[220px] object-cover flex-shrink-0 snap-center"
              />
            ))}
          </div>

          {/* Gradient overlay for text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent pointer-events-none" />

          {/* Dot indicators */}
          {photos.length > 1 && (
            <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex items-center gap-1.5 pointer-events-none">
              {photos.map((_, i) => (
                <div
                  key={i}
                  className={`rounded-full transition-all duration-200 ${
                    i === activePhoto
                      ? "w-2 h-2 bg-white"
                      : "w-1.5 h-1.5 bg-white/50"
                  }`}
                />
              ))}
            </div>
          )}

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

          {/* Bottom-left: Rating badge + Michelin star */}
          <div className="absolute bottom-3 left-4 flex items-center gap-2">
            <div
              className={`flex items-center gap-1.5 ${getRatingColor(
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

            {restaurant.hasMichelinStar && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, ...spring }}
                className="flex items-center gap-1 bg-white/90 backdrop-blur-md rounded-lg px-2 py-1.5"
              >
                <span className="text-[12px] leading-none">⭐</span>
                <span className="font-editorial font-bold text-[11px] text-ate-ink leading-none">
                  Michelin
                </span>
              </motion.div>
            )}
          </div>
        </div>

        {/* ---- CONTENT ---- */}
        <div className="px-5 pb-32">
          {/* Restaurant name + metadata */}
          <div className="mt-5">
            <h2 className="font-editorial text-[26px] font-extrabold text-ate-ink leading-tight tracking-[-0.02em]">
              {restaurant.name}
            </h2>
            <div className="flex items-center gap-2 mt-1.5 flex-wrap">
              <p className="text-[12px] text-ate-muted font-medium tracking-wide">
                {restaurant.cuisine}
                <span className="mx-1.5 text-ate-muted/25">/</span>
                {restaurant.priceRange}
                <span className="mx-1.5 text-ate-muted/25">/</span>
                {restaurant.cyclingMinutes} min cycle
              </p>

              {/* Dog-friendly badge */}
              {restaurant.dogFriendly && (
                <span className="inline-flex items-center gap-1 bg-ate-grey text-ate-ink/50 text-[10px] font-semibold px-2 py-1 rounded-full">
                  <span className="text-[11px] leading-none">🐕</span>
                  Dog-friendly
                </span>
              )}
            </div>
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

                {/* Time slot grid — available + unavailable */}
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

                  {/* Unavailable slots with notify bell */}
                  {restaurant.unavailableSlots.map((time) => (
                    <motion.button
                      key={`unavail-${time}`}
                      whileTap={{ scale: 0.94 }}
                      transition={spring}
                      onClick={() => setNotifyToast(time)}
                      className="relative text-[13px] font-semibold px-3 py-2.5 rounded-xl tabular-nums text-center bg-ate-ink/[0.06] text-ate-muted/60 cursor-pointer"
                    >
                      <span>{time}</span>
                      <BellIcon className="absolute top-1 right-1.5 w-2.5 h-2.5 text-ate-muted/40" />
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
          <div className="mt-5 flex items-center gap-2 flex-wrap">
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

            {/* Phone link */}
            <a
              href={`tel:${restaurant.phone}`}
              className="flex items-center gap-2 text-[11px] text-ate-muted font-medium bg-ate-grey rounded-xl px-3.5 py-2.5 transition-colors hover:bg-ate-ink/[0.06]"
            >
              <PhoneIcon className="w-3.5 h-3.5" />
              Call
            </a>

            {/* Menu link */}
            {restaurant.menuUrl && (
              <a
                href={restaurant.menuUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-[11px] text-ate-muted font-medium bg-ate-grey rounded-xl px-3.5 py-2.5 transition-colors hover:bg-ate-ink/[0.06]"
              >
                <MenuIcon className="w-3.5 h-3.5" />
                View menu
              </a>
            )}

            {/* Get directions */}
            <a
              href={`https://www.google.com/maps/dir/?api=1&destination=${restaurant.lat},${restaurant.lng}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-[11px] text-ate-muted font-medium bg-ate-grey rounded-xl px-3.5 py-2.5 transition-colors hover:bg-ate-ink/[0.06]"
            >
              <DirectionsIcon className="w-3.5 h-3.5" />
              Get directions
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
            {restaurant.available && !selectedSlot ? (
              <ChevronRightIcon className="w-4 h-4 opacity-70" />
            ) : (
              <ExternalLinkIcon className="w-4 h-4 opacity-60" />
            )}
          </motion.a>
        </div>
      </motion.div>

      {/* ---- NOTIFY TOAST ---- */}
      <AnimatePresence>
        {notifyToast && (
          <motion.div
            key="notify-toast"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={spring}
            className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[60] bg-ate-ink text-white text-[13px] font-semibold px-5 py-3 rounded-2xl shadow-xl flex items-center gap-2"
          >
            <BellIcon className="w-4 h-4 text-ate-mustard" />
            We&apos;ll notify you when {notifyToast} opens up!
          </motion.div>
        )}
      </AnimatePresence>

      {/* ---- FULLSCREEN LIGHTBOX ---- */}
      <AnimatePresence>
        {lightboxOpen && (
          <motion.div
            key="lightbox"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[70] bg-black flex items-center justify-center"
            onClick={() => setLightboxOpen(false)}
          >
            {/* Close button */}
            <motion.button
              whileTap={{ scale: 0.85 }}
              transition={spring}
              onClick={() => setLightboxOpen(false)}
              className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center"
            >
              <Cross2Icon className="w-5 h-5 text-white" />
            </motion.button>

            {/* Photo counter */}
            <div className="absolute top-5 left-1/2 -translate-x-1/2 text-white/60 text-[13px] font-medium tabular-nums">
              {lightboxIndex + 1} / {photos.length}
            </div>

            {/* Nav arrows */}
            {photos.length > 1 && (
              <>
                <motion.button
                  whileTap={{ scale: 0.85 }}
                  transition={spring}
                  onClick={(e) => {
                    e.stopPropagation();
                    lightboxPrev();
                  }}
                  className="absolute left-3 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center"
                >
                  <ChevronLeftIcon className="w-5 h-5 text-white" />
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.85 }}
                  transition={spring}
                  onClick={(e) => {
                    e.stopPropagation();
                    lightboxNext();
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center"
                >
                  <ChevronRightIcon className="w-5 h-5 text-white" />
                </motion.button>
              </>
            )}

            {/* Image */}
            <AnimatePresence mode="wait">
              <motion.img
                key={lightboxIndex}
                src={photos[lightboxIndex]}
                alt={`${restaurant.name} photo ${lightboxIndex + 1}`}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="max-w-full max-h-full object-contain px-4"
                onClick={(e) => e.stopPropagation()}
              />
            </AnimatePresence>

            {/* Dot indicators */}
            {photos.length > 1 && (
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2">
                {photos.map((_, i) => (
                  <div
                    key={i}
                    className={`rounded-full transition-all duration-200 ${
                      i === lightboxIndex
                        ? "w-2 h-2 bg-white"
                        : "w-1.5 h-1.5 bg-white/40"
                    }`}
                  />
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </AnimatePresence>
  );
}
