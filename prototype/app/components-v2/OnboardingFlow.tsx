"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GlobeIcon } from "@radix-ui/react-icons";

const spring = { type: "spring" as const, stiffness: 320, damping: 28, mass: 0.9 };

const pageVariants = {
  enter: { opacity: 0, y: 24 },
  center: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -24 },
};

export default function OnboardingFlow({ onComplete }: { onComplete: () => void }) {
  const [step, setStep] = useState(0);
  const [username, setUsername] = useState("");

  return (
    <div className="min-h-screen bg-ate-white flex flex-col">
      <AnimatePresence mode="wait">
        {step === 0 && (
          <motion.div
            key="welcome"
            variants={pageVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="flex-1 flex flex-col items-center justify-center px-8"
          >
            {/* Editorial logo */}
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ ...spring, delay: 0.1 }}
              className="mb-12"
            >
              <div className="font-editorial text-[72px] font-extrabold tracking-[-0.06em] leading-[0.85] text-ate-ink">
                ate
              </div>
            </motion.div>

            {/* Editorial heading with mixed weights */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="text-center"
            >
              <h1 className="font-editorial text-[36px] font-extrabold text-ate-ink leading-[1.05] tracking-[-0.03em]">
                Never miss
                <br />
                a table.
              </h1>
              <p className="font-editorial text-[28px] font-bold text-ate-coral mt-1 leading-[1.1]">
                Never forget a meal.
              </p>
            </motion.div>

            {/* Thin editorial rule */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.4, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="w-12 h-[2px] bg-ate-red mt-8 mb-6"
            />

            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.5 }}
              className="text-[14px] text-ate-muted text-center max-w-[240px] leading-relaxed font-medium"
            >
              Real-time restaurant availability for the Netherlands.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55, duration: 0.5 }}
              className="w-full mt-12 space-y-3"
            >
              <motion.button
                whileTap={{ scale: 0.98 }}
                transition={spring}
                onClick={() => setStep(1)}
                className="w-full flex items-center justify-center gap-2.5 bg-ate-ink text-white font-semibold py-4 rounded-2xl text-[14px]"
              >
                <svg className="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                Continue with Google
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.98 }}
                transition={spring}
                onClick={() => setStep(1)}
                className="w-full flex items-center justify-center gap-2.5 bg-white text-ate-ink font-semibold py-4 rounded-2xl text-[14px] border-2 border-ate-ink/[0.08]"
              >
                <svg className="w-[18px] h-[18px]" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
                </svg>
                Continue with Apple
              </motion.button>
              <button
                onClick={() => setStep(1)}
                className="w-full text-center text-[13px] text-ate-muted font-medium py-2"
              >
                Sign up with Email
              </button>
            </motion.div>

            <p className="text-[12px] text-ate-muted/50 mt-8 font-medium">
              Already have an account?{" "}
              <button onClick={() => setStep(1)} className="text-ate-red font-semibold">
                Log in
              </button>
            </p>
          </motion.div>
        )}

        {step === 1 && (
          <motion.div
            key="location"
            variants={pageVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="flex-1 flex flex-col items-center justify-center px-8"
          >
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ ...spring, delay: 0.1 }}
              className="w-16 h-16 bg-ate-grey rounded-full flex items-center justify-center mb-8"
            >
              <GlobeIcon className="w-7 h-7 text-ate-ink/40" />
            </motion.div>

            <h2 className="font-editorial text-[28px] text-ate-ink text-center leading-[1.1] font-extrabold tracking-[-0.02em]">
              Where are you
            </h2>
            <p className="font-editorial text-[26px] font-bold text-ate-coral mt-0.5">
              eating tonight?
            </p>

            <div className="w-12 h-[2px] bg-ate-ink/10 mt-6 mb-4" />

            <p className="text-[14px] text-ate-muted text-center max-w-[260px] font-medium leading-relaxed">
              We need your location to find restaurants near you
            </p>

            <div className="w-full mt-10 space-y-3">
              <motion.button
                whileTap={{ scale: 0.98 }}
                transition={spring}
                onClick={() => setStep(2)}
                className="w-full bg-ate-ink text-white font-semibold py-4 rounded-2xl text-[14px]"
              >
                Allow Location
              </motion.button>
              <button
                onClick={() => setStep(2)}
                className="w-full text-center text-[13px] text-ate-muted font-medium py-2"
              >
                Skip for now
              </button>
            </div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            key="username"
            variants={pageVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="flex-1 flex flex-col items-center justify-center px-8"
          >
            <h2 className="font-editorial text-[28px] text-ate-ink text-center leading-[1.1] font-extrabold tracking-[-0.02em]">
              What should we
            </h2>
            <p className="font-editorial text-[26px] font-bold text-ate-coral mt-0.5">
              call you?
            </p>

            <div className="w-12 h-[2px] bg-ate-ink/10 mt-6 mb-4" />

            <p className="text-[14px] text-ate-muted text-center font-medium">
              Pick a username for your profile
            </p>

            <div className="w-full mt-8">
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-ate-muted text-[14px] font-semibold">@</span>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ""))}
                  placeholder="your_name"
                  className="w-full bg-ate-grey rounded-2xl pl-9 pr-4 py-4 text-[14px] font-semibold border-2 border-transparent focus:outline-none focus:border-ate-red/20 placeholder:text-ate-muted/40"
                  autoFocus
                />
              </div>
              {username.length > 0 && username.length < 3 && (
                <p className="text-[11px] text-ate-red font-semibold mt-2 ml-1">At least 3 characters</p>
              )}
            </div>

            <motion.button
              whileTap={{ scale: 0.98 }}
              transition={spring}
              onClick={onComplete}
              disabled={username.length < 3}
              className="w-full bg-ate-red text-white font-editorial font-bold py-4 rounded-2xl text-[15px] tracking-[-0.01em] mt-6 disabled:opacity-20 shadow-[0_4px_20px_rgba(255,68,56,0.25)]"
            >
              Let&apos;s go
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Progress dots */}
      <div className="flex justify-center gap-2 pb-10">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            animate={{
              width: i === step ? 28 : 6,
              backgroundColor: i === step ? "#FF4438" : "#E8E6E2",
            }}
            transition={spring}
            className="h-[4px] rounded-full"
          />
        ))}
      </div>
    </div>
  );
}
