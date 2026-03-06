"use client";

import { motion } from "framer-motion";
import {
  TargetIcon,
  PlusCircledIcon,
  HeartIcon,
  PersonIcon,
  ChatBubbleIcon,
} from "@radix-ui/react-icons";

type Tab = "radar" | "community" | "event" | "favourites" | "profile";

const spring = { type: "spring" as const, stiffness: 500, damping: 32, mass: 0.8 };

export default function TabBar({
  active,
  onNavigate,
}: {
  active: string;
  onNavigate: (tab: Tab) => void;
}) {
  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: "radar", label: "Radar", icon: <TargetIcon className="w-[18px] h-[18px]" /> },
    { id: "community", label: "Community", icon: <ChatBubbleIcon className="w-[18px] h-[18px]" /> },
    { id: "event", label: "Events", icon: <PlusCircledIcon className="w-[18px] h-[18px]" /> },
    { id: "favourites", label: "Saved", icon: <HeartIcon className="w-[18px] h-[18px]" /> },
    { id: "profile", label: "You", icon: <PersonIcon className="w-[18px] h-[18px]" /> },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-2xl border-t border-ate-ink/[0.05]">
      <div className="max-w-md mx-auto flex items-center justify-around px-2 pb-[max(env(safe-area-inset-bottom),8px)] pt-2">
        {tabs.map((tab) => (
          <motion.button
            key={tab.id}
            whileTap={{ scale: 0.82 }}
            transition={spring}
            onClick={() => onNavigate(tab.id)}
            className="relative flex flex-col items-center gap-[3px] px-3 py-1"
          >
            <motion.div
              animate={{
                color: active === tab.id ? "#FF4438" : "rgba(13,13,13,0.2)",
              }}
              transition={{ duration: 0.2 }}
            >
              {tab.icon}
            </motion.div>
            <motion.span
              animate={{
                color: active === tab.id ? "#0D0D0D" : "rgba(13,13,13,0.25)",
                fontWeight: active === tab.id ? 700 : 500,
              }}
              transition={{ duration: 0.2 }}
              className="text-[9px] font-editorial tracking-wide uppercase"
            >
              {tab.label}
            </motion.span>
            {active === tab.id && (
              <motion.div
                layoutId="tab-indicator"
                className="absolute -top-2 left-1/2 -translate-x-1/2 w-5 h-[3px] bg-ate-red rounded-full"
                transition={spring}
              />
            )}
          </motion.button>
        ))}
      </div>
    </div>
  );
}
