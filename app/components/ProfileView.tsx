"use client";

import { motion } from "framer-motion";
import {
  PersonIcon,
  CalendarIcon,
  BellIcon,
  GlobeIcon,
  ExitIcon,
  GearIcon,
} from "@radix-ui/react-icons";

export default function ProfileView({
  favouriteCount,
  eventCount,
}: {
  favouriteCount: number;
  eventCount: number;
}) {
  return (
    <div className="h-full flex flex-col pt-[env(safe-area-inset-top)]">
      <div className="px-4 pt-4 pb-2">
        <h1 className="text-xl font-bold text-charcoal-dark">Profile</h1>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-24">
        {/* Avatar + username */}
        <div className="flex items-center gap-4 mt-2 mb-6">
          <div className="w-16 h-16 rounded-full bg-sage/40 flex items-center justify-center">
            <PersonIcon className="w-7 h-7 text-forest" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-charcoal-dark">@foodie_amsterdam</h2>
            <p className="text-xs text-charcoal/40">Amsterdam, NL</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="bg-white rounded-2xl p-4 text-center border border-light-grey/50">
            <p className="text-2xl font-bold text-forest">{favouriteCount}</p>
            <p className="text-[10px] text-charcoal/40 font-medium mt-1">Saved</p>
          </div>
          <div className="bg-white rounded-2xl p-4 text-center border border-light-grey/50">
            <p className="text-2xl font-bold text-terracotta">{eventCount}</p>
            <p className="text-[10px] text-charcoal/40 font-medium mt-1">Events</p>
          </div>
          <div className="bg-white rounded-2xl p-4 text-center border border-light-grey/50">
            <p className="text-2xl font-bold text-mustard">2</p>
            <p className="text-[10px] text-charcoal/40 font-medium mt-1">Traditions</p>
          </div>
        </div>

        {/* Settings */}
        <div className="bg-white rounded-2xl border border-light-grey/50 overflow-hidden">
          <SettingRow
            icon={<CalendarIcon className="w-4.5 h-4.5" />}
            label="Google Calendar"
            detail="Connected"
            connected
          />
          <SettingRow
            icon={<BellIcon className="w-4.5 h-4.5" />}
            label="Notifications"
            detail="Push + Email"
          />
          <SettingRow
            icon={<GlobeIcon className="w-4.5 h-4.5" />}
            label="Default Location"
            detail="Amsterdam"
          />
          <SettingRow
            icon={<GearIcon className="w-4.5 h-4.5" />}
            label="Language"
            detail="English"
            last
          />
        </div>

        {/* Account */}
        <div className="bg-white rounded-2xl border border-light-grey/50 overflow-hidden mt-4">
          <SettingRow
            icon={<PersonIcon className="w-4.5 h-4.5" />}
            label="Edit Username"
            detail=""
          />
          <button className="w-full flex items-center gap-3 px-4 py-3.5">
            <div className="w-8 h-8 rounded-xl bg-burgundy/10 flex items-center justify-center">
              <ExitIcon className="w-4.5 h-4.5 text-burgundy" />
            </div>
            <span className="text-sm font-medium text-burgundy">Sign Out</span>
          </button>
        </div>

        <p className="text-center text-[10px] text-charcoal/20 mt-6">ate v1.0.0</p>
      </div>
    </div>
  );
}

function SettingRow({
  icon,
  label,
  detail,
  connected,
  last,
}: {
  icon: React.ReactNode;
  label: string;
  detail: string;
  connected?: boolean;
  last?: boolean;
}) {
  return (
    <button
      className={`w-full flex items-center gap-3 px-4 py-3.5 ${
        !last ? "border-b border-light-grey/30" : ""
      }`}
    >
      <div className="w-8 h-8 rounded-xl bg-sage/20 flex items-center justify-center text-forest">
        {icon}
      </div>
      <span className="text-sm font-medium text-charcoal-dark flex-1 text-left">{label}</span>
      <span className={`text-xs ${connected ? "text-forest font-medium" : "text-charcoal/40"}`}>
        {detail}
        {connected && " ✓"}
      </span>
    </button>
  );
}
