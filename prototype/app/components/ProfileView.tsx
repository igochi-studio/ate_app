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
    <div className="h-full flex flex-col pt-[env(safe-area-inset-top)]">
      <div className="px-5 pt-5 pb-3">
        <h1 className="text-[22px] font-normal text-charcoal-dark font-[family-name:var(--font-instrument)]">
          Profile
        </h1>
      </div>

      <div className="flex-1 overflow-y-auto px-5 pb-24">
        {/* Avatar + username */}
        <div className="flex items-center gap-4 mt-2 mb-7">
          <div className="w-14 h-14 rounded-full bg-forest/[0.08] flex items-center justify-center">
            <PersonIcon className="w-6 h-6 text-forest/60" />
          </div>
          <div>
            <h2 className="text-[17px] font-bold text-charcoal-dark tracking-tight">@foodie_amsterdam</h2>
            <p className="text-[12px] text-charcoal/25 font-medium mt-0.5">Amsterdam, NL</p>
          </div>
        </div>

        {/* Stats */}
        <div className="flex gap-3 mb-7">
          {[
            { value: favouriteCount, label: "Saved", color: "text-forest" },
            { value: eventCount, label: "Events", color: "text-terracotta" },
            { value: 2, label: "Traditions", color: "text-mustard" },
          ].map((stat) => (
            <div key={stat.label} className="flex-1 bg-charcoal/[0.02] rounded-2xl py-4 text-center">
              <p className={`text-[22px] font-extrabold ${stat.color} tracking-tight`}>{stat.value}</p>
              <p className="text-[10px] text-charcoal/25 font-semibold tracking-wide uppercase mt-0.5">{stat.label}</p>
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
            <div className="w-8 h-8 rounded-xl bg-burgundy/[0.06] flex items-center justify-center">
              <ExitIcon className="w-4 h-4 text-burgundy/60" />
            </div>
            <span className="text-[14px] font-medium text-burgundy/70">Sign Out</span>
          </motion.button>
        </div>

        <p className="text-center text-[10px] text-charcoal/10 mt-8 font-medium tracking-wider">ate v1.0</p>
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
      className="w-full flex items-center gap-3 px-1 py-3.5 border-b border-charcoal/[0.03]"
    >
      <div className="w-8 h-8 rounded-xl bg-charcoal/[0.03] flex items-center justify-center text-charcoal/30">
        {icon}
      </div>
      <span className="text-[14px] font-medium text-charcoal-dark flex-1 text-left">{label}</span>
      {detail && (
        <span className="flex items-center gap-1 text-[12px] text-charcoal/25 font-medium">
          {detail}
          {connected && <CheckIcon className="w-3 h-3 text-forest" />}
        </span>
      )}
      <ChevronRightIcon className="w-4 h-4 text-charcoal/12" />
    </motion.button>
  );
}
