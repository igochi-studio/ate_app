"use client";

import { motion } from "framer-motion";
import {
  PersonIcon,
  CalendarIcon,
  BellIcon,
  GlobeIcon,
  ExitIcon,
  GearIcon,
  ChevronRightIcon,
  CheckIcon,
} from "@radix-ui/react-icons";

const spring = { type: "spring" as const, stiffness: 380, damping: 30, mass: 0.8 };

export default function ProfileView({
  favouriteCount,
  eventCount,
}: {
  favouriteCount: number;
  eventCount: number;
}) {
  return (
    <div className="h-full flex flex-col pt-[env(safe-area-inset-top)] bg-ate-white">
      <div className="px-5 pt-6 pb-3">
        <h1 className="font-editorial text-[28px] font-extrabold text-ate-ink tracking-[-0.02em] leading-none">
          Profile
        </h1>
      </div>

      <div className="flex-1 overflow-y-auto px-5 pb-24">
        {/* Avatar + username */}
        <div className="flex items-center gap-4 mt-2 mb-7">
          <div className="w-14 h-14 rounded-full bg-ate-red/10 flex items-center justify-center">
            <PersonIcon className="w-6 h-6 text-ate-red" />
          </div>
          <div>
            <h2 className="font-editorial text-[17px] font-extrabold text-ate-ink tracking-[-0.01em]">@foodie_amsterdam</h2>
            <p className="text-[12px] text-ate-muted font-semibold mt-0.5">Amsterdam, NL</p>
          </div>
        </div>

        {/* Stats */}
        <div className="flex gap-3 mb-7">
          {[
            { value: favouriteCount, label: "Saved", color: "text-ate-red" },
            { value: eventCount, label: "Events", color: "text-ate-coral" },
            { value: 2, label: "Traditions", color: "text-ate-ink" },
          ].map((stat) => (
            <div key={stat.label} className="flex-1 bg-ate-grey rounded-2xl py-4 text-center">
              <p className={`font-editorial text-[24px] font-extrabold ${stat.color} tracking-[-0.02em]`}>{stat.value}</p>
              <p className="text-[9px] font-editorial font-bold text-ate-muted uppercase tracking-[0.15em] mt-0.5">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Settings */}
        <div className="space-y-0.5">
          <SettingRow
            icon={<CalendarIcon className="w-4 h-4" />}
            label="Google Calendar"
            detail="Connected"
            connected
          />
          <SettingRow
            icon={<BellIcon className="w-4 h-4" />}
            label="Notifications"
            detail="Push + Email"
          />
          <SettingRow
            icon={<GlobeIcon className="w-4 h-4" />}
            label="Default Location"
            detail="Amsterdam"
          />
          <SettingRow
            icon={<GearIcon className="w-4 h-4" />}
            label="Language"
            detail="English"
          />
        </div>

        {/* Account */}
        <div className="mt-6 space-y-0.5">
          <SettingRow
            icon={<PersonIcon className="w-4 h-4" />}
            label="Edit Username"
          />
          <motion.button
            whileTap={{ scale: 0.98 }}
            transition={spring}
            className="w-full flex items-center gap-3 px-1 py-3.5"
          >
            <div className="w-8 h-8 rounded-xl bg-ate-red/[0.06] flex items-center justify-center">
              <ExitIcon className="w-4 h-4 text-ate-red/60" />
            </div>
            <span className="text-[14px] font-bold text-ate-red/70">Sign Out</span>
          </motion.button>
        </div>

        <p className="text-center text-[10px] text-ate-muted/40 mt-8 font-editorial font-bold tracking-widest uppercase">ate v1.0</p>
      </div>
    </div>
  );
}

function SettingRow({
  icon,
  label,
  detail,
  connected,
}: {
  icon: React.ReactNode;
  label: string;
  detail?: string;
  connected?: boolean;
}) {
  return (
    <motion.button
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
      className="w-full flex items-center gap-3 px-1 py-3.5 border-b border-ate-ink/[0.04]"
    >
      <div className="w-8 h-8 rounded-xl bg-ate-grey flex items-center justify-center text-ate-muted">
        {icon}
      </div>
      <span className="text-[14px] font-editorial font-bold text-ate-ink flex-1 text-left">{label}</span>
      {detail && (
        <span className="flex items-center gap-1 text-[12px] text-ate-muted font-semibold">
          {detail}
          {connected && <CheckIcon className="w-3 h-3 text-ate-green" />}
        </span>
      )}
      <ChevronRightIcon className="w-4 h-4 text-ate-muted/30" />
    </motion.button>
  );
}
