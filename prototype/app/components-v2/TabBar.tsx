"use client";

import { motion } from "framer-motion";
import {
  TargetIcon,
  PlusCircledIcon,
  PersonIcon,
  ChatBubbleIcon,
} from "@radix-ui/react-icons";

type Tab = "radar" | "community" | "event" | "favourites" | "profile";

const spring = { type: "spring" as const, stiffness: 500, damping: 32, mass: 0.8 };

function BoldHeartIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function TabBar({
  active,
  onNavigate,
}: {
  active: string;
  onNavigate: (tab: Tab) => void;
}) {
  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: "radar", label: "Map", icon: <TargetIcon className="w-[20px] h-[20px]" /> },
    { id: "community", label: "Community", icon: <ChatBubbleIcon className="w-[20px] h-[20px]" /> },
    { id: "event", label: "Events", icon: <PlusCircledIcon className="w-[20px] h-[20px]" /> },
    { id: "favourites", label: "Saved", icon: <BoldHeartIcon className="w-[20px] h-[20px]" /> },
    { id: "profile", label: "You", icon: <PersonIcon className="w-[20px] h-[20px]" /> },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-2xl border-t border-ate-ink/[0.06]">
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
                color: active === tab.id ? "#FF4438" : "rgba(13,13,13,0.3)",
              }}
              transition={{ duration: 0.2 }}
            >
              {tab.icon}
            </motion.div>
            <motion.span
              animate={{
                color: active === tab.id ? "#0D0D0D" : "rgba(13,13,13,0.3)",
                fontWeight: active === tab.id ? 700 : 600,
              }}
              transition={{ duration: 0.2 }}
              className="text-[10px] font-editorial tracking-wide uppercase"
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
