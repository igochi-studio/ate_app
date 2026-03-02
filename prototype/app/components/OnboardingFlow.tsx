"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GlobeIcon } from "@radix-ui/react-icons";

const spring = { type: "spring" as const, stiffness: 320, damping: 28, mass: 0.9 };

const pageVariants = {
  enter: { opacity: 0, y: 24, filter: "blur(4px)" },
  center: { opacity: 1, y: 0, filter: "blur(0px)" },
  exit: { opacity: 0, y: -24, filter: "blur(4px)" },
};

export default function OnboardingFlow({ onComplete }: { onComplete: () => void }) {
  const [step, setStep] = useState(0);
  const [username, setUsername] = useState("");

  return (
    <div className="min-h-screen bg-cream-light flex flex-col">
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
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ ...spring, delay: 0.1 }}
              className="w-20 h-20 bg-charcoal-dark rounded-[22px] flex items-center justify-center mb-10"
            >
              <span className="text-cream-light text-[26px] font-extrabold tracking-tighter">ate</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="text-[28px] text-charcoal-dark text-center leading-[1.15] font-[family-name:var(--font-instrument)]"
            >
              Never miss a table.
              <br />
              <span className="italic">Never forget a meal.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.5 }}
              className="text-[14px] text-charcoal/35 mt-4 text-center max-w-[260px] leading-relaxed font-medium"
            >
              See which restaurants near you have tables right now.
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
                className="w-full flex items-center justify-center gap-2.5 bg-charcoal-dark text-white font-semibold py-4 rounded-2xl text-[14px] tracking-[-0.01em]"
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
                className="w-full flex items-center justify-center gap-2.5 bg-white text-charcoal-dark font-semibold py-4 rounded-2xl text-[14px] tracking-[-0.01em] border border-charcoal/[0.06]"
              >
                <svg className="w-[18px] h-[18px]" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
                </svg>
                Continue with Apple
              </motion.button>
              <button
                onClick={() => setStep(1)}
                className="w-full text-center text-[13px] text-charcoal/25 font-medium py-2"
              >
                Sign up with Email
              </button>
            </motion.div>

            <p className="text-[12px] text-charcoal/15 mt-8 font-medium">
              Already have an account?{" "}
              <button onClick={() => setStep(1)} className="text-forest font-semibold">
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
              className="w-16 h-16 bg-sage/25 rounded-full flex items-center justify-center mb-8"
            >
              <GlobeIcon className="w-7 h-7 text-forest/60" />
            </motion.div>

            <h2 className="text-[24px] text-charcoal-dark text-center leading-tight font-[family-name:var(--font-instrument)]">
              Where are you <span className="italic">eating</span> tonight?
            </h2>
            <p className="text-[14px] text-charcoal/30 mt-3 text-center max-w-[260px] font-medium leading-relaxed">
              We need your location to find restaurants near you
            </p>

            <div className="w-full mt-10 space-y-3">
              <motion.button
                whileTap={{ scale: 0.98 }}
                transition={spring}
                onClick={() => setStep(2)}
                className="w-full bg-charcoal-dark text-white font-semibold py-4 rounded-2xl text-[14px]"
              >
                Allow Location
              </motion.button>
              <button
                onClick={() => setStep(2)}
                className="w-full text-center text-[13px] text-charcoal/20 font-medium py-2"
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
            <h2 className="text-[24px] text-charcoal-dark text-center leading-tight font-[family-name:var(--font-instrument)]">
              What should we <span className="italic">call</span> you?
            </h2>
            <p className="text-[14px] text-charcoal/30 mt-3 text-center font-medium">
              Pick a username for your profile
            </p>

            <div className="w-full mt-8">
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-charcoal/15 text-[14px] font-semibold">@</span>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ""))}
                  placeholder="your_name"
                  className="w-full bg-white rounded-2xl pl-9 pr-4 py-4 text-[14px] font-medium border border-charcoal/[0.06] focus:outline-none focus:ring-2 focus:ring-forest/10 placeholder:text-charcoal/12"
                  autoFocus
                />
              </div>
              {username.length > 0 && username.length < 3 && (
                <p className="text-[11px] text-terracotta/70 mt-2 ml-1 font-medium">At least 3 characters</p>
              )}
            </div>

            <motion.button
              whileTap={{ scale: 0.98 }}
              transition={spring}
              onClick={onComplete}
              disabled={username.length < 3}
              className="w-full bg-charcoal-dark text-white font-semibold py-4 rounded-2xl text-[14px] mt-6 disabled:opacity-15"
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
              width: i === step ? 24 : 6,
              backgroundColor: i === step ? "#1A1A18" : "#E8E6E2",
            }}
            transition={spring}
            className="h-[5px] rounded-full"
          />
        ))}
      </div>
    </div>
  );
}
