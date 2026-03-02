"use client";

import { motion } from "framer-motion";
import {
  GlobeIcon,
  MagnifyingGlassIcon,
  PlusCircledIcon,
  HeartIcon,
  PersonIcon,
} from "@radix-ui/react-icons";

type Tab = "radar" | "search" | "event" | "favourites" | "profile";

export default function TabBar({
  active,
  onNavigate,
}: {
  active: Tab;
  onNavigate: (tab: Tab) => void;
}) {
  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: "radar", label: "Radar", icon: <GlobeIcon className="w-5 h-5" /> },
    { id: "search", label: "Search", icon: <MagnifyingGlassIcon className="w-5 h-5" /> },
    { id: "event", label: "Event", icon: <PlusCircledIcon className="w-5 h-5" /> },
    { id: "favourites", label: "Favs", icon: <HeartIcon className="w-5 h-5" /> },
    { id: "profile", label: "Profile", icon: <PersonIcon className="w-5 h-5" /> },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-cream-light/90 backdrop-blur-xl border-t border-light-grey">
      <div className="max-w-md mx-auto flex items-center justify-around px-2 pb-[env(safe-area-inset-bottom)] pt-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onNavigate(tab.id)}
            className="relative flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-colors"
          >
            <div
              className={`transition-colors duration-200 ${
                active === tab.id ? "text-forest" : "text-charcoal/50"
              }`}
            >
              {tab.icon}
            </div>
            <span
              className={`text-[10px] font-medium transition-colors duration-200 ${
                active === tab.id ? "text-forest" : "text-charcoal/50"
              }`}
            >
              {tab.label}
            </span>
            {active === tab.id && (
              <motion.div
                layoutId="tab-indicator"
                className="absolute -top-0.5 left-1/2 -translate-x-1/2 w-5 h-0.5 bg-forest rounded-full"
                transition={{ type: "spring", stiffness: 500, damping: 35 }}
              />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
