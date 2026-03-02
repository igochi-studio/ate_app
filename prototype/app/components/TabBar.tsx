"use client";

import { motion } from "framer-motion";
import {
  TargetIcon,
  MagnifyingGlassIcon,
  PlusCircledIcon,
  HeartIcon,
  PersonIcon,
} from "@radix-ui/react-icons";

type Tab = "radar" | "search" | "event" | "favourites" | "profile";

const spring = { type: "spring" as const, stiffness: 500, damping: 32, mass: 0.8 };

export default function TabBar({
  active,
  onNavigate,
}: {
  active: Tab;
  onNavigate: (tab: Tab) => void;
}) {
  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: "radar", label: "Radar", icon: <TargetIcon className="w-[18px] h-[18px]" /> },
    { id: "search", label: "Search", icon: <MagnifyingGlassIcon className="w-[18px] h-[18px]" /> },
    { id: "event", label: "Events", icon: <PlusCircledIcon className="w-[18px] h-[18px]" /> },
    { id: "favourites", label: "Saved", icon: <HeartIcon className="w-[18px] h-[18px]" /> },
    { id: "profile", label: "You", icon: <PersonIcon className="w-[18px] h-[18px]" /> },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-cream-light/85 backdrop-blur-2xl border-t border-charcoal/[0.04]">
      <div className="max-w-md mx-auto flex items-center justify-around px-3 pb-[max(env(safe-area-inset-bottom),8px)] pt-2">
        {tabs.map((tab) => (
          <motion.button
            key={tab.id}
            whileTap={{ scale: 0.85 }}
            transition={spring}
            onClick={() => onNavigate(tab.id)}
            className="relative flex flex-col items-center gap-[3px] px-4 py-1"
          >
            <motion.div
              animate={{
                color: active === tab.id ? "#1A1A18" : "rgba(74,74,72,0.22)",
              }}
              transition={{ duration: 0.25 }}
            >
              {tab.icon}
            </motion.div>
            <motion.span
              animate={{
                color: active === tab.id ? "#1A1A18" : "rgba(74,74,72,0.22)",
                fontWeight: active === tab.id ? 700 : 500,
              }}
              transition={{ duration: 0.25 }}
              className="text-[10px] tracking-wide"
            >
              {tab.label}
            </motion.span>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
