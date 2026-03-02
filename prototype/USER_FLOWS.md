# Ate — User Flow Chart
### All Screens & Edge Cases

---

## Master Flow Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                         APP LAUNCH                                  │
│                            │                                        │
│                     ┌──────┴──────┐                                 │
│                     │ First time? │                                  │
│                     └──────┬──────┘                                  │
│                    Yes/    \No                                       │
│                   /         \                                        │
│          ┌───────▼──┐    ┌──▼──────────┐                            │
│          │ ONBOARD  │    │ RESTAURANT  │                             │
│          │ FLOW     │    │ RADAR (MAP) │                             │
│          └───────┬──┘    └─────────────┘                            │
│                  │                                                   │
│                  ▼                                                   │
│          ┌─────────────────────────────────────────┐                │
│          │          MAIN APP (Tab Bar)              │                │
│          │                                          │                │
│          │  🗺️ Radar  🔍 Search  ➕ Event           │                │
│          │  ❤️ Favs   👤 Profile                   │                │
│          └─────────────────────────────────────────┘                │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 1. Onboarding Flow

```
SCREEN 1: Welcome
┌─────────────────────┐
│                     │
│     [ate logo]      │
│                     │
│  "Never miss a      │
│   table. Never      │
│   forget a meal."   │
│                     │
│  [Continue with     │
│   Google]           │
│  [Continue with     │
│   Apple]            │
│  [Sign up with      │
│   Email]            │
│                     │
│  Already have an    │
│  account? Log in    │
└─────────────────────┘
       │
       ▼
EDGE CASES:
├── Google auth fails → "Something went wrong. Try again or use email."
├── Apple auth fails → Same error handling
├── Email sign-up → Email + Password fields → Verification email → Verify → Continue
└── Already has account → Log In screen → Forgot password flow

       │ (auth successful)
       ▼

SCREEN 2: Location Permission
┌─────────────────────┐
│                     │
│   [Map illustration │
│    with pin]        │
│                     │
│  "Where are you     │
│   eating tonight?"  │
│                     │
│  We need your       │
│  location to find   │
│  restaurants nearby │
│                     │
│  [Allow Location]   │
│                     │
│  Skip for now →     │
└─────────────────────┘
       │
       ▼
EDGE CASES:
├── Permission granted → Extract location + timezone → Continue
├── Permission denied → "No worries" → Manual city selector → Continue
├── Permission "Ask next time" → Continue, re-prompt later
└── Location unavailable → Manual city selector fallback

       │
       ▼

SCREEN 3: Set Username
┌─────────────────────┐
│                     │
│  "What should we    │
│   call you?"        │
│                     │
│  [Username field]   │
│                     │
│  [Let's go →]       │
│                     │
└─────────────────────┘
       │
       ▼
EDGE CASES:
├── Username taken → "That one's taken. Try another?"
├── Username too short → "At least 3 characters"
├── Username has invalid chars → "Letters, numbers, and underscores only"
└── Empty field → Button disabled

       │ (valid username)
       ▼

→→→ RESTAURANT RADAR (Home) →→→
```

---

## 2. Restaurant Radar (Home Screen)

```
┌─────────────────────────┐
│ 🔍    For 2 ▾   19:00 ▾ │  ← Top bar: search, party size, time
│─────────────────────────│
│                         │
│    [MAPBOX MAP]         │
│                         │
│    🟢 Available pin     │
│    ⚪ Unavailable pin   │
│    📍 User location     │
│                         │
│    [Favourites only     │
│     toggle]             │
│                         │
│─────────────────────────│
│ ▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔ │  ← Drag handle
│ 12 restaurants nearby   │
│ [Quick list preview]    │
│─────────────────────────│
│ 🗺️  🔍  ➕  ❤️  👤     │  ← Bottom tab bar
└─────────────────────────┘

INTERACTIONS:
│
├── Tap green pin → RESTAURANT PREVIEW (bottom sheet)
├── Tap grey pin → RESTAURANT PREVIEW (with "next available" info)
├── Tap 🔍 (top bar) → SEARCH & FILTERS (sheet)
├── Tap party size → Inline stepper to adjust
├── Tap time → Time picker
├── Toggle "Favourites only" → Map filters to show only favourites
├── Pinch/zoom map → Clusters expand/collapse
├── Drag bottom list up → List view of all restaurants
├── Tap bottom tab → Navigate to corresponding section
│
EDGE CASES:
├── No restaurants nearby → Empty state: "All booked nearby. Try a wider area."
├── Location stale → Banner: "Location last updated 5 min ago. Tap to refresh."
├── Data loading → Skeleton pins + shimmer on map
├── No internet → Cached data + "Offline — showing last known availability"
└── Too many pins → Auto-cluster at zoom level
```

---

## 3. Restaurant Preview (Bottom Sheet)

```
HALF SHEET (tap pin):
┌─────────────────────────┐
│ ▔▔▔▔▔▔▔▔                │  ← Drag handle
│                         │
│ [Photo]                 │
│ Restaurant De Kas       │
│ Modern European · €€€   │
│ 🚲 8 min · ⭐ 4.6       │
│                         │
│ Available tonight:      │
│ [18:30] [19:00] [20:30] │  ← Pill buttons
│ 🔥 2 spots left         │
│                         │
│ [❤️ Save] [📅 Event]    │
│                         │
└─────────────────────────┘
       │
       ├── Swipe up → FULL DETAIL
       ├── Tap time pill → Redirect to restaurant booking site
       ├── Tap ❤️ → Add to favourites (with optional event association)
       ├── Tap 📅 → Associate with event (event picker)
       └── Swipe down → Dismiss

FULL DETAIL (swipe up):
┌─────────────────────────┐
│ ←  Restaurant De Kas    │
│─────────────────────────│
│ [Full-width photo]      │
│                         │
│ Modern European · €€€   │
│ 🚲 8 min cycling        │
│ ⭐ 4.6 (Google) · 8.9   │
│   (TheFork)             │
│                         │
│ ── Vibe Check ───────── │
│ [Date night] [Cozy]     │
│ [Garden seating]        │
│                         │
│ ── Best Time to Visit ─ │
│ Tue–Thu evenings have   │
│ the most availability   │
│                         │
│ ── Available Tonight ── │
│ [18:30] [19:00] [20:30] │
│ 🔥 2 spots left         │
│                         │
│ ── Social ───────────── │
│ [@dekas] Instagram      │
│ [Website]               │
│                         │
│ ── Your Notes ───────── │  ← Only if saved as favourite
│ "Amazing truffle pasta" │
│                         │
│ [🔗 Book Now →]         │  ← Opens restaurant website
│                         │
└─────────────────────────┘

EDGE CASES:
├── Restaurant has no photo → Warm placeholder with initial
├── No availability → "Fully booked. Next available: Tomorrow 19:00" + [Notify me]
├── No social media → Section hidden
├── No vibe tags → Section hidden
├── Booking site unreachable → "Try visiting their website directly"
└── Restaurant removed from data → "This restaurant is no longer available"
```

---

## 4. Search & Filters

```
SEARCH SCREEN:
┌─────────────────────────┐
│ ← Search                │
│─────────────────────────│
│ [🔍 Search restaurants] │
│                         │
│ Party size:  [- 2 +]   │
│                         │
│ When:                   │
│ [Now] [Tonight] [Pick]  │
│                         │
│ Location:               │
│ [📍 Current location ▾] │
│                         │
│ Cuisine:                │
│ [Dutch] [Indonesian]    │
│ [Italian] [Japanese]    │
│ [French] [Surinamese]   │
│ [Indian] [More ▾]       │
│                         │
│ Distance: ──●────── 2km │
│                         │
│ Price:                  │
│ [€] [€€] [€€€] [€€€€] │
│                         │
│ Vibe:                   │
│ [Date night] [Groups]   │
│ [Casual] [Fine dining]  │
│                         │
│ [Show 24 results]       │
│                         │
└─────────────────────────┘
       │
       ▼
RESULTS (list view):
┌─────────────────────────┐
│ ← 24 results   [Map ▾] │
│─────────────────────────│
│ ┌─────────────────────┐ │
│ │[Photo] Rest. Name   │ │
│ │Cuisine · €€ · 🚲5m  │ │
│ │[19:00] [20:00]      │ │
│ │⭐4.5 · 3 spots left │ │
│ └─────────────────────┘ │
│ ┌─────────────────────┐ │
│ │[Photo] Rest. Name   │ │
│ │...                   │ │
│ └─────────────────────┘ │
│         ...             │
└─────────────────────────┘

EDGE CASES:
├── No results → "No matches. Try fewer filters or a wider area." + [Clear filters]
├── Location typed manually → Geocode to coordinates → Search from that point
├── Party size > restaurant max → Restaurant excluded from results
├── Time slot "Now" but late night → "Most restaurants are closed. Showing late-night options."
└── Very wide radius (10km+) → Warning: "Showing results up to 10km away"
```

---

## 5. Favourites

```
FAVOURITES SCREEN:
┌─────────────────────────┐
│ Favourites              │
│─────────────────────────│
│ [Show on map]  toggle   │
│                         │
│ ┌─────────────────────┐ │
│ │[Photo] De Kas       │ │
│ │Modern European      │ │
│ │Last visited: Feb 14 │ │
│ │Your rating: ★★★★☆   │ │
│ │🟢 Available now      │ │
│ └─────────────────────┘ │
│ ┌─────────────────────┐ │
│ │[Photo] Rijsel       │ │
│ │Indonesian-Dutch     │ │
│ │Never visited        │ │
│ │⚪ Next: Sat 19:00    │ │
│ └─────────────────────┘ │
│         ...             │
│─────────────────────────│
│ 🗺️  🔍  ➕  ❤️  👤     │
└─────────────────────────┘

INTERACTIONS:
├── Tap card → Restaurant detail (with personal notes section)
├── Swipe left → Remove from favourites (with undo toast)
├── Toggle "Show on map" → Returns to Radar with only favourites visible
│
FAVOURITE DETAIL (extra sections):
├── Personal notes (editable)
├── Photos you've uploaded
├── What you ordered
├── Personal rating
├── "Would visit again?" toggle
├── Associated events
│
EDGE CASES:
├── No favourites → Empty state illustration: "Heart a restaurant to save it here"
├── Favourite restaurant closed permanently → Greyed out + "Permanently closed"
└── Favourite restaurant no longer in data → "We can't find current data for this restaurant"
```

---

## 6. Events (Marked Events)

```
EVENTS LIST:
┌─────────────────────────┐
│ Your Events             │
│─────────────────────────│
│ ── Upcoming ──────────  │
│ ┌─────────────────────┐ │
│ │ 🎂 Mom's Birthday   │ │
│ │ Mar 15 · De Kas     │ │
│ │ 🔁 Yearly tradition  │ │
│ └─────────────────────┘ │
│                         │
│ ── Past ────────────── │
│ ┌─────────────────────┐ │
│ │ 🥂 Anniversary '25  │ │
│ │ Feb 14 · Rijsel     │ │
│ │ [Photo thumbnails]  │ │
│ │ ★★★★★               │ │
│ └─────────────────────┘ │
│         ...             │
│─────────────────────────│
│ 🗺️  🔍  ➕  ❤️  👤     │
└─────────────────────────┘

       │
       ├── Tap ➕ (tab bar) → ADD NEW EVENT
       ├── Tap event card → EVENT DETAIL
       └── Tap tradition badge → MEMORY WALL

ADD NEW EVENT:
┌─────────────────────────┐
│ ← New Event             │
│─────────────────────────│
│ Event name:             │
│ [Mom's Birthday]        │
│                         │
│ Date:                   │
│ [March 15, 2026]        │
│                         │
│ Restaurant (optional):  │
│ [🔍 Search or pick      │
│  from favourites]       │
│                         │
│ Photos:                 │
│ [+ Add photos]          │
│                         │
│ Notes:                  │
│ [What I liked...]       │
│ [What I disliked...]    │
│ [Ambience notes...]     │
│                         │
│ Personal rating:        │
│ ☆☆☆☆☆                  │
│                         │
│ Would visit again?      │
│ [Yes] [Maybe] [No]      │
│                         │
│ Make it a tradition? 🔁 │
│ [Toggle: OFF]           │
│                         │
│ [Save Event]            │
└─────────────────────────┘

TRADITION FLOW (when toggle ON):
├── "We'll remind you every year!"
├── Set reminder: [7 days] [3 days] [1 day] before (multi-select)
├── Notification channels: [Push] [Email] (multi-select)
└── Confirmation: "Tradition saved! We'll remind you next year."

MEMORY WALL (for traditions):
┌─────────────────────────┐
│ ← Mom's Birthday        │
│   A tradition since '24 │
│─────────────────────────│
│                         │
│ ── 2026 ──────────────  │
│ [Photo grid]            │
│ De Kas · ★★★★★          │
│ "Best truffle pasta     │
│  she's ever had"        │
│                         │
│ ── 2025 ──────────────  │
│ [Photo grid]            │
│ Rijsel · ★★★★☆          │
│ "Great rijsttafel but   │
│  a bit loud"            │
│                         │
│ ── 2024 ──────────────  │
│ [Photo grid]            │
│ Ciel Bleu · ★★★★★       │
│ "The view was magical"  │
│                         │
└─────────────────────────┘

EDGE CASES:
├── No events → "Your first meal memory starts here" + [Add Event]
├── Event without restaurant → Shows event but no restaurant card
├── Tradition notification denied → "Enable notifications in settings to get reminders"
├── Photos fail to upload → "Photos couldn't be saved. Tap to retry."
├── Event date in past → Still saveable (logging past meals)
└── Restaurant from event no longer exists → Show restaurant name but greyed out
```

---

## 7. Unavailable / Fully Booked

```
UNAVAILABLE LIST:
┌─────────────────────────┐
│ Fully Booked Nearby     │
│─────────────────────────│
│ ┌─────────────────────┐ │
│ │[Photo] Ciel Bleu    │ │
│ │French Fine Dining    │ │
│ │Next: Tomorrow 19:30  │ │
│ │[🔔 Notify me]        │ │
│ └─────────────────────┘ │
│ ┌─────────────────────┐ │
│ │[Photo] &moshik      │ │
│ │Modern Israeli       │ │
│ │Next: Saturday 20:00 │ │
│ │[🔔 Notify me]        │ │
│ └─────────────────────┘ │
│         ...             │
└─────────────────────────┘

INTERACTIONS:
├── Tap card → Restaurant detail (with next available info)
├── Tap "Notify me" → Toggle on → "We'll ping you when a table opens"
│
EDGE CASES:
├── All restaurants available → "Everything's open! Check the Radar."
├── Notification already on → Show "🔔 Watching" badge
└── Slot opens → Push notification: "A table just opened at Ciel Bleu for 19:30!"
```

---

## 8. Profile

```
PROFILE SCREEN:
┌─────────────────────────┐
│ Profile                 │
│─────────────────────────│
│ [Avatar]                │
│ @username               │
│                         │
│ ── Stats ─────────────  │
│ 12 restaurants saved    │
│ 4 events logged         │
│ 2 traditions            │
│                         │
│ ── Settings ──────────  │
│ [📅 Google Calendar]    │
│   Connected ✓           │
│ [🔔 Notifications]      │
│   Push + Email          │
│ [📍 Default Location]   │
│   Amsterdam             │
│ [🌍 Language]           │
│   English               │
│ [🎨 App Theme]          │
│   Auto                  │
│                         │
│ ── Account ───────────  │
│ [Edit Username]         │
│ [Sign Out]              │
│ [Delete Account]        │
│                         │
└─────────────────────────┘

GOOGLE CALENDAR FLOW:
├── Tap "Google Calendar" → OAuth2 consent screen
├── Permission granted → Scans for events
├── Events found → "We found 3 upcoming events. Want to see suggestions?"
├── Events shown as suggestions → User can confirm/dismiss each
│
EDGE CASES:
├── Calendar permission revoked → "Calendar disconnected. Tap to reconnect."
├── No calendar events → "No upcoming events found. Add events manually."
├── Delete account → Confirmation: "This will delete all your data. Are you sure?"
│   └── Second confirmation → Delete → Return to Welcome screen
└── Sign out → Confirmation → Return to Welcome screen
```

---

## 9. Navigation Map (All Screens)

```
AUTHENTICATION
├── Welcome (Sign Up / Log In)
├── Google OAuth
├── Apple OAuth
├── Email Sign Up (email + password + verification)
├── Email Log In
├── Forgot Password
├── Location Permission
└── Set Username

MAIN APP (Tab Bar)
├── 🗺️ Restaurant Radar (Map)
│   ├── Restaurant Preview (Bottom Sheet - Half)
│   ├── Restaurant Detail (Bottom Sheet - Full)
│   │   ├── → External: Restaurant Booking Website
│   │   ├── → Save to Favourites
│   │   └── → Associate with Event
│   ├── Quick Filters (Party Size, Time)
│   └── Favourites-Only Filter
│
├── 🔍 Search
│   ├── Search Filters
│   ├── Search Results (List)
│   └── → Restaurant Detail
│
├── ➕ Add Event
│   ├── New Event Form
│   ├── Restaurant Picker (from favourites or search)
│   ├── Photo Upload
│   ├── Tradition Setup
│   └── → Event Saved Confirmation
│
├── ❤️ Favourites
│   ├── Favourites List
│   ├── Favourite Detail (with personal notes)
│   │   ├── Edit Notes
│   │   ├── Add Photos
│   │   └── → Restaurant Detail
│   └── → Show on Map (returns to Radar)
│
└── 👤 Profile
    ├── Edit Username
    ├── Google Calendar Connect
    ├── Calendar Event Suggestions
    ├── Notification Settings
    ├── Location Settings
    ├── Sign Out (→ Welcome)
    └── Delete Account (→ Welcome)

OVERLAY SCREENS (Accessible from multiple places)
├── Unavailable Restaurants List
├── Notification Permission Request
├── Memory Wall (from Events)
├── Tradition Reminder (push notification → deep link to Event)
└── Calendar Suggestion (push notification → deep link to Search)

NOTIFICATION DEEP LINKS
├── "Table opened at X" → Restaurant Detail
├── "Tradition reminder" → Event Detail + Search
├── "Calendar event" → Search (pre-filled with date)
└── "Favourite restaurant available" → Restaurant Detail
```

---

## 10. Screen Count Summary

| Category | Screens | Notes |
|---|---|---|
| Auth / Onboarding | 6 | Welcome, OAuth, Email signup, Verify, Location, Username |
| Restaurant Radar | 3 | Map, Preview sheet, Full detail |
| Search | 2 | Filters, Results list |
| Favourites | 2 | List, Detail with notes |
| Events | 4 | List, Add new, Detail, Memory wall |
| Unavailable | 1 | List with notify toggles |
| Profile | 4 | Main, Calendar connect, Notifications, Edit username |
| **Total** | **22** | Core screens for MVP prototype |

---

*Next: See the working prototype at the deployed Vercel URL.*
