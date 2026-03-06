"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  HeartIcon,
  HeartFilledIcon,
  ChatBubbleIcon,
  StarFilledIcon,
  StarIcon,
  PlusIcon,
  Cross2Icon,
  DotsHorizontalIcon,
  Share1Icon,
  CameraIcon,
  RocketIcon,
  BadgeIcon,
} from "@radix-ui/react-icons";

const spring = { type: "spring" as const, stiffness: 380, damping: 30, mass: 0.8 };

const cardEntrance = {
  hidden: { opacity: 0, y: 20, scale: 0.97 },
  visible: (i: number) => ({
    opacity: 1, y: 0, scale: 1,
    transition: { ...spring, delay: i * 0.06 },
  }),
};

/* ─── Mock Data ─────────────────────────────────────────────── */

const crew = [
  { id: "1", name: "Lotte", initial: "L", color: "bg-ate-red", username: "@lotte_v" },
  { id: "2", name: "Daan", initial: "D", color: "bg-ate-coral", username: "@daan_k" },
  { id: "3", name: "Amara", initial: "A", color: "bg-[#7CB342]", username: "@amara_o" },
  { id: "4", name: "Sven", initial: "S", color: "bg-ate-ink", username: "@sven_b" },
];

const suggestedCrew = [
  { id: "5", name: "Mila R.", initial: "M", color: "bg-ate-coral", username: "@mila_ams", mutualCount: 3 },
  { id: "6", name: "Jip de W.", initial: "J", color: "bg-[#7CB342]", username: "@jip_food", mutualCount: 2 },
  { id: "7", name: "Noah T.", initial: "N", color: "bg-ate-ink", username: "@noah_eats", mutualCount: 4 },
];

const crewActivity = [
  {
    id: 1,
    user: { name: "Lotte V.", initial: "L", color: "bg-ate-red" },
    timestamp: "Just now",
    type: "dining" as const,
    restaurant: "Restaurant De Kas",
    photo: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&q=80",
    caption: "Birthday dinner was absolutely magical. The greenhouse setting at sunset is unreal.",
    rating: 5,
    likes: 8,
    comments: 3,
  },
  {
    id: 2,
    user: { name: "Daan K.", initial: "D", color: "bg-ate-coral" },
    timestamp: "2h ago",
    type: "dining" as const,
    restaurant: "Rijsel",
    photo: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&q=80",
    caption: "The roast chicken. That is all. Shared with the whole table and gone in 5 minutes flat.",
    rating: 4,
    likes: 12,
    comments: 5,
  },
  {
    id: 3,
    user: { name: "Amara O.", initial: "A", color: "bg-[#7CB342]" },
    timestamp: "5h ago",
    type: "event" as const,
    restaurant: "Mama Makan",
    photo: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&q=80",
    caption: "Rijsttafel with the family. 4th year in a row at Mama Makan for dad's birthday.",
    rating: 5,
    likes: 15,
    comments: 7,
  },
  {
    id: 4,
    user: { name: "Sven B.", initial: "S", color: "bg-ate-ink" },
    timestamp: "Yesterday",
    type: "dining" as const,
    restaurant: "Volt",
    photo: null,
    caption: "Natural wine flight was incredible. The orange wine from Georgia was a revelation. Sharing plates were solid but the drinks steal the show.",
    rating: 4,
    likes: 6,
    comments: 2,
  },
  {
    id: 5,
    user: { name: "Lotte V.", initial: "L", color: "bg-ate-red" },
    timestamp: "2 days ago",
    type: "dining" as const,
    restaurant: "Bar Parry",
    photo: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&q=80",
    caption: "Terrace szn is officially open. First aperol of the year.",
    rating: 4,
    likes: 22,
    comments: 8,
  },
];

const tickets = [
  {
    id: 1,
    restaurant: "Restaurant De Kas",
    deal: "15% off lunch menu",
    detail: "This week only",
    code: "ATE-KAS15",
    validUntil: "Mar 12",
  },
  {
    id: 2,
    restaurant: "Bar Parry",
    deal: "Happy hour wines 50% off",
    detail: "Before 18:00",
    code: "ATE-PARRY50",
    validUntil: "Mar 31",
  },
  {
    id: 3,
    restaurant: "Volt",
    deal: "3-course weeknight menu",
    detail: "Only EUR 35",
    code: "ATE-VOLT35",
    validUntil: "Apr 1",
  },
];

/* ─── Sub-components ────────────────────────────────────────── */

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <span key={star} className="text-ate-red">
          {star <= rating ? <StarFilledIcon className="w-3 h-3" /> : <StarIcon className="w-3 h-3 opacity-30" />}
        </span>
      ))}
    </div>
  );
}

/* Vintage ticket card with perforated edge */
function TicketCard({ ticket, index }: { ticket: (typeof tickets)[number]; index: number }) {
  const [claimed, setClaimed] = useState(false);
  const rotations = [-0.8, 0.5, -0.3];

  return (
    <motion.div
      custom={index}
      variants={cardEntrance}
      initial="hidden"
      animate="visible"
      whileTap={{ scale: 0.97, rotate: 0 }}
      style={{ rotate: rotations[index % 3] }}
      className="shrink-0 w-[260px] cursor-pointer"
    >
      <div className="relative bg-[#FFFBF5] rounded-xl overflow-hidden shadow-[0_2px_16px_rgba(0,0,0,0.06)]">
        {/* Grain overlay */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")" }} />

        {/* Top section */}
        <div className="px-4 pt-4 pb-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[8px] font-editorial font-bold text-ate-muted uppercase tracking-[0.2em]">ate presents</span>
            <span className="text-[8px] font-bold text-ate-muted uppercase tracking-[0.15em]">#{String(ticket.id).padStart(3, "0")}</span>
          </div>
          <h3 className="font-editorial text-[18px] font-extrabold text-ate-ink tracking-[-0.02em] leading-tight">
            {ticket.deal}
          </h3>
          <p className="text-[12px] text-ate-ink/50 font-semibold mt-1">{ticket.detail}</p>
        </div>

        {/* Perforated line */}
        <div className="relative mx-0 h-[1px]">
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-3 h-6 bg-white rounded-r-full" />
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-6 bg-white rounded-l-full" />
          <div className="mx-4 border-t border-dashed border-ate-ink/15" />
        </div>

        {/* Bottom section */}
        <div className="px-4 pt-3 pb-4 flex items-end justify-between">
          <div>
            <p className="text-[9px] font-editorial font-bold text-ate-muted uppercase tracking-[0.15em]">{ticket.restaurant}</p>
            <p className="text-[10px] text-ate-muted mt-0.5 font-medium">Valid until {ticket.validUntil}</p>
          </div>
          <motion.button whileTap={{ scale: 0.9 }} transition={spring} onClick={() => setClaimed(!claimed)}
            className={`px-3.5 py-1.5 rounded-lg text-[10px] font-editorial font-bold uppercase tracking-[0.1em] transition-colors ${
              claimed ? "bg-ate-ink text-white" : "bg-ate-red text-white"
            }`}>
            {claimed ? "Claimed" : "Claim"}
          </motion.button>
        </div>

        {/* Stamp watermark */}
        <div className="absolute top-3 right-3 w-10 h-10 rounded-full border-2 border-ate-red/10 flex items-center justify-center rotate-[-15deg]">
          <span className="text-[7px] font-editorial font-bold text-ate-red/15 uppercase">Valid</span>
        </div>
      </div>
    </motion.div>
  );
}

function ActivityCard({ post, index }: { post: (typeof crewActivity)[number]; index: number }) {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likes);

  return (
    <motion.div
      custom={index}
      variants={cardEntrance}
      initial="hidden"
      animate="visible"
      className="mb-6"
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-3">
        <motion.div whileHover={{ scale: 1.08 }} className={`w-10 h-10 rounded-full ${post.user.color} flex items-center justify-center`}>
          <span className="text-white text-[14px] font-editorial font-bold">{post.user.initial}</span>
        </motion.div>
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline gap-2">
            <span className="font-editorial text-[14px] font-bold text-ate-ink">{post.user.name}</span>
            <span className="text-[10px] text-ate-muted/60 font-medium">{post.timestamp}</span>
          </div>
          <span className="text-[11px] text-ate-muted font-semibold">at {post.restaurant}</span>
        </div>
        <button className="p-1"><DotsHorizontalIcon className="w-4 h-4 text-ate-muted/40" /></button>
      </div>

      {/* Photo */}
      {post.photo && (
        <motion.div
          whileTap={{ scale: 0.985 }}
          className="relative rounded-2xl overflow-hidden mb-3"
        >
          <img src={post.photo} alt="" className="w-full h-[280px] object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
          <div className="absolute bottom-3 left-3">
            <StarRating rating={post.rating} />
          </div>
          {post.type === "event" && (
            <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-ate-ink text-[9px] font-editorial font-bold uppercase tracking-[0.12em] px-2.5 py-1 rounded-full">
              Tradition
            </div>
          )}
        </motion.div>
      )}

      {/* Text-only card */}
      {!post.photo && (
        <div className="bg-[#FFFBF5] rounded-2xl p-4 mb-3 relative overflow-hidden">
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
            style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")" }} />
          <StarRating rating={post.rating} />
          <p className="text-[14px] text-ate-ink/80 leading-[1.6] font-medium mt-2">{post.caption}</p>
        </div>
      )}

      {/* Caption */}
      {post.photo && (
        <p className="text-[13px] text-ate-ink/75 leading-[1.55] font-medium mb-2.5">{post.caption}</p>
      )}

      {/* Actions */}
      <div className="flex items-center gap-5">
        <button onClick={() => { setLiked(!liked); setLikeCount(liked ? likeCount - 1 : likeCount + 1); }} className="flex items-center gap-1.5">
          <motion.div whileTap={{ scale: 1.4 }} transition={{ ...spring, stiffness: 600 }}>
            {liked ? <HeartFilledIcon className="w-[18px] h-[18px] text-ate-red" /> : <HeartIcon className="w-[18px] h-[18px] text-ate-muted/40" />}
          </motion.div>
          <span className={`text-[12px] font-semibold ${liked ? "text-ate-red" : "text-ate-muted/60"}`}>{likeCount}</span>
        </button>
        <button className="flex items-center gap-1.5">
          <ChatBubbleIcon className="w-[18px] h-[18px] text-ate-muted/40" />
          <span className="text-[12px] font-semibold text-ate-muted/60">{post.comments}</span>
        </button>
        <button className="ml-auto">
          <Share1Icon className="w-[18px] h-[18px] text-ate-muted/40" />
        </button>
      </div>
    </motion.div>
  );
}

/* ─── Main Component ────────────────────────────────────────── */

export default function CommunityView() {
  const [showInvite, setShowInvite] = useState(false);
  const [addedIds, setAddedIds] = useState<string[]>([]);

  return (
    <div className="h-full flex flex-col pt-[env(safe-area-inset-top)] bg-ate-white relative">
      {/* Subtle grain overlay */}
      <div className="fixed inset-0 pointer-events-none z-[1] opacity-[0.018]"
        style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")" }} />

      {/* Header */}
      <div className="px-5 pt-6 pb-1 flex items-center justify-between relative z-[2]">
        <div>
          <h1 className="font-editorial text-[28px] font-extrabold text-ate-ink tracking-[-0.02em] leading-none">
            The Table
          </h1>
          <p className="text-[11px] text-ate-muted font-medium mt-1">Your crew of food critics</p>
        </div>
        <motion.button whileTap={{ scale: 0.9 }} transition={spring}
          onClick={() => setShowInvite(true)}
          className="flex items-center gap-1.5 bg-ate-ink text-white text-[11px] font-bold px-3.5 py-2 rounded-full">
          <PlusIcon className="w-3 h-3" /> Invite
        </motion.button>
      </div>

      <div className="flex-1 overflow-y-auto pb-32 relative z-[2]">
        {/* Crew strip */}
        <div className="px-5 pt-4 pb-3">
          <div className="flex gap-4 overflow-x-auto no-scrollbar">
            <motion.div whileTap={{ scale: 0.92 }} className="flex flex-col items-center gap-1.5 shrink-0 cursor-pointer">
              <div className="w-[56px] h-[56px] rounded-full bg-ate-grey flex items-center justify-center border-2 border-dashed border-ate-ink/10">
                <CameraIcon className="w-5 h-5 text-ate-muted/50" />
              </div>
              <span className="text-[10px] font-semibold text-ate-muted">Post</span>
            </motion.div>
            {crew.map((person, i) => (
              <motion.div
                key={person.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ ...spring, delay: i * 0.06 }}
                className="flex flex-col items-center gap-1.5 shrink-0 cursor-pointer"
              >
                <div className="relative">
                  <div className={`w-[56px] h-[56px] rounded-full ${person.color} flex items-center justify-center`}>
                    <span className="text-white text-[20px] font-editorial font-bold">{person.initial}</span>
                  </div>
                  {/* Activity indicator dot */}
                  <div className="absolute -bottom-0.5 right-0 w-4 h-4 bg-ate-green rounded-full border-[2.5px] border-white" />
                </div>
                <span className="text-[10px] font-semibold text-ate-ink">{person.name}</span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Tickets section */}
        <div className="px-5 mt-2 mb-5">
          <div className="flex items-center gap-1.5 mb-3">
            <BadgeIcon className="w-3.5 h-3.5 text-ate-red/60" />
            <p className="text-[9px] font-editorial font-bold text-ate-ink/40 uppercase tracking-[0.2em]">Exclusive Offers</p>
          </div>
          <div className="flex gap-3 overflow-x-auto no-scrollbar -mx-1 px-1 pb-2">
            {tickets.map((ticket, i) => (
              <TicketCard key={ticket.id} ticket={ticket} index={i} />
            ))}
          </div>
        </div>

        <div className="mx-5 h-[1px] bg-ate-ink/[0.04] mb-5" />

        {/* Activity feed */}
        <div className="px-5">
          <p className="text-[9px] font-editorial font-bold text-ate-ink/40 uppercase tracking-[0.2em] mb-4">From The Table</p>
          {crewActivity.map((post, i) => (
            <ActivityCard key={post.id} post={post} index={i} />
          ))}
        </div>
      </div>

      {/* Invite modal */}
      <AnimatePresence>
        {showInvite && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowInvite(false)}
              className="fixed inset-0 bg-ate-ink/30 backdrop-blur-[3px] z-40"
            />
            <motion.div
              initial={{ y: "100%", scale: 0.95 }}
              animate={{ y: 0, scale: 1 }}
              exit={{ y: "100%", scale: 0.95 }}
              transition={{ ...spring, stiffness: 260 }}
              className="fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-[28px] max-h-[70vh] overflow-y-auto"
            >
              <div className="sticky top-0 z-10 flex justify-center pt-3 pb-1 bg-white rounded-t-[28px]">
                <div className="w-10 h-[3px] bg-ate-ink/10 rounded-full" />
              </div>
              <div className="px-5 pb-10">
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <h2 className="font-editorial text-[20px] font-extrabold text-ate-ink tracking-[-0.02em]">Invite to The Table</h2>
                    <p className="text-[11px] text-ate-muted font-medium mt-0.5">Add your food critics crew</p>
                  </div>
                  <motion.button whileTap={{ scale: 0.85 }} onClick={() => setShowInvite(false)}>
                    <Cross2Icon className="w-5 h-5 text-ate-muted" />
                  </motion.button>
                </div>

                <p className="text-[9px] font-editorial font-bold text-ate-muted uppercase tracking-[0.15em] mb-2.5">At The Table ({crew.length})</p>
                <div className="space-y-0.5 mb-6">
                  {crew.map((f) => (
                    <div key={f.id} className="flex items-center gap-3 py-2.5">
                      <div className={`w-9 h-9 rounded-full ${f.color} flex items-center justify-center`}>
                        <span className="text-white text-[13px] font-editorial font-bold">{f.initial}</span>
                      </div>
                      <div className="flex-1">
                        <p className="text-[13px] font-bold text-ate-ink">{f.name}</p>
                        <p className="text-[11px] text-ate-muted font-medium">{f.username}</p>
                      </div>
                      <span className="text-[10px] text-ate-green font-bold uppercase tracking-wide">Crew</span>
                    </div>
                  ))}
                </div>

                <p className="text-[9px] font-editorial font-bold text-ate-muted uppercase tracking-[0.15em] mb-2.5">People you may know</p>
                <div className="space-y-0.5">
                  {suggestedCrew.map((f, i) => (
                    <motion.div
                      key={f.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ ...spring, delay: i * 0.06 }}
                      className="flex items-center gap-3 py-2.5"
                    >
                      <div className={`w-9 h-9 rounded-full ${f.color} flex items-center justify-center`}>
                        <span className="text-white text-[13px] font-editorial font-bold">{f.initial}</span>
                      </div>
                      <div className="flex-1">
                        <p className="text-[13px] font-bold text-ate-ink">{f.name}</p>
                        <p className="text-[11px] text-ate-muted font-medium">{f.username} · {f.mutualCount} mutual</p>
                      </div>
                      <motion.button whileTap={{ scale: 0.9 }} transition={spring}
                        onClick={() => setAddedIds((prev) => prev.includes(f.id) ? prev.filter((x) => x !== f.id) : [...prev, f.id])}
                        className={`text-[11px] font-bold px-3.5 py-1.5 rounded-full transition-all ${
                          addedIds.includes(f.id) ? "bg-ate-green/10 text-ate-green" : "bg-ate-red text-white"
                        }`}>
                        {addedIds.includes(f.id) ? "Invited" : "Invite"}
                      </motion.button>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
