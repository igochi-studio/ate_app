# Ate — Design Document
### Real-time Restaurant Availability for the Netherlands
**Version 1.0 | March 2026**

---

## 1. What is Ate?

Ate is a mobile-first application that shows you which restaurants near you have tables available *right now*. It scrapes publicly available reservation data across the Netherlands and presents it on a live map — your **Restaurant Radar**.

The name "ate" is a past tense of "eat" — simple, memorable, lowercase, human. The brand is warm, earthy, and intentional. Not another corporate reservation tool.

**One-liner:** *"Never miss a table. Never forget a meal."*

### The Problem

1. **Fragmented availability** — Restaurant availability is scattered across TheFork, OpenTable, Resy, Google, and individual restaurant websites. There's no single view of "what's open right now near me."
2. **Last-minute dining is stressful** — You're hungry, you're with friends, and you're calling five restaurants. Three don't answer. Two are booked.
3. **Important meals get forgotten** — Your mom's birthday dinner, your anniversary spot, that restaurant you loved last summer — they slip through the cracks until it's too late to book.

### The Solution

Ate aggregates real-time availability from public reservation APIs and displays it on a map. You see what's open, filter by your needs, tap to learn more, and get redirected to the restaurant's own booking system. Ate doesn't handle bookings — it handles *discovery and memory*.

---

## 2. Core Functionality

### 2.1 Data Pipeline (What We Scrape)

Ate's backend continuously scrapes publicly available data from reservation platforms:

| Data Point | Source | Purpose |
|---|---|---|
| **Reservation availability API responses** | TheFork, OpenTable, Resy, Google Reserve | Real-time table availability |
| **Structured time slots** | API responses | Display available booking windows |
| **Party size logic** | API responses | Filter by group size (2, 4, 6+) |
| **Availability counts** | API responses | Scarcity indicators ("3 spots left") |
| **Restaurant IDs + metadata** | API responses + enrichment | Restaurant profiles, cuisine, location |
| **Date-based storage** | Internal pipeline | Historical patterns, "best time to visit" |

### 2.2 How Data Translates to UX

| Data Field | UI Element | User Experience |
|---|---|---|
| `displayTime` | Time button pills | Tap to see available slots |
| `status` | Available / Unavailable badge | Green dot = open, Grey = full |
| `spotsOpen` | Scarcity indicator | "3 left" creates gentle urgency |
| `partySize` | Filter control | "Table for 4" adjusts all results |
| `maxDuration` | Info tooltip | "90 min max" shown on restaurant card |
| `waitlistAutoNotify` | Notification toggle | "Notify me when a table opens" |
| `time` | Sorting & grouping | Group by "Now", "Tonight", "This week" |

---

## 3. Target Audience

### Primary: The Forgetful Foodie (25–40, Netherlands)

- Lives in Amsterdam, Rotterdam, Utrecht, The Hague, Eindhoven
- Loves dining out but doesn't plan ahead
- Has missed important dinners because "it was fully booked"
- Uses iPhone/Android daily, comfortable with apps
- Values authenticity — hates dark patterns and corporate UX
- Cycles everywhere — proximity by bike matters more than by car

### Secondary: The Event Planner

- Organizes group dinners, birthdays, team outings
- Needs to coordinate party sizes and preferences
- Wants to remember "where we went last year"
- Would use the events/memory feature heavily

### Cultural Context: Dutch Dining Habits

- **Gezelligheid** (coziness/togetherness) is central — dining is social, relaxed, long
- **Directness** — Dutch users want clarity, no hidden information, no dark patterns
- **Price-conscious** — "doe maar gewoon" culture; show value clearly
- **Peak dining**: Friday & Saturday evenings, 6:30–9:00 PM
- **Advance booking**: 1–2 weeks for popular spots on weekends
- **Same-day bookings**: increasingly common, especially via mobile
- **Tech-savvy but skeptical** — early adopters who hate unnecessary friction
- **Cycling culture** — distance should be shown in cycling minutes, not km
- **Privacy-conscious** — GDPR compliance is expected and noticed
- **WhatsApp-native** — sharing restaurant links via WhatsApp is standard

---

## 4. User Journey

### 4.1 First-Time User

```
Open App → Sign Up (Google/Apple/Email) → Grant Location Permission
→ Set Username → Land on Restaurant Radar (Map View)
```

**Design principles for onboarding:**
- Maximum 3 screens before the map
- No long forms, no friction
- Location permission framed as: "So we can find restaurants near you"
- Username is the only profile field required

### 4.2 Returning User

```
Open App → Restaurant Radar loads with current location
→ See available restaurants as pins → Browse / Search / Filter
```

---

## 5. Feature Specification

### 5.1 Restaurant Radar (Home / Map View)

The primary screen. A full-bleed map (Mapbox) centered on user's current location.

**Map Elements:**
- **Green pins** — restaurants with current availability
- **Grey pins** — restaurants that are fully booked (with "next available" time)
- **Pin clusters** — zoom out groups pins; zoom in reveals individual restaurants
- **User location** — subtle pulsing dot

**Map Interactions:**
- Pan, zoom, pinch — standard map gestures
- Tap pin → Restaurant preview card slides up from bottom
- Long press on map → No action (prevent accidental triggers)

**Top Bar:**
- Search icon (opens search/filter sheet)
- "Favourites only" toggle filter
- Current time + party size quick-adjust

**Bottom Navigation:**
- 🗺️ Radar (active)
- 🔍 Search
- ➕ Add Event
- ❤️ Favourites
- 👤 Profile

### 5.2 Restaurant Detail Card

Slides up as a bottom sheet when a pin is tapped.

**Preview (Half Sheet):**
- Restaurant name + cuisine type
- Available time slots as pill buttons
- Spots remaining ("2 left for tonight")
- Distance in cycling minutes 🚲
- Star rating (public) + vibe tags

**Full Detail (Swipe Up to Expand):**
- Full restaurant photo
- Cuisine type, price range (€–€€€€)
- Public ratings (Google, TheFork aggregated)
- Social media links (Instagram primarily)
- **Vibe Check** — tags like "Date night", "Loud & fun", "Cozy", "Group-friendly"
- **Best Time to Visit** — derived from historical availability data
- "Next available" for fully booked restaurants
- **Book Now** button → redirects to restaurant's official website
- **Save to Favourites** heart icon
- **Associate with Event** link icon

### 5.3 Search & Filters

Opens as a bottom sheet or dedicated screen.

**Search Fields:**
- **Party size** — stepper (1–12+)
- **Time slot** — "Now", "Tonight", "Pick a date/time"
- **Location** — defaults to current location, can type any NL city/neighborhood
- **Cuisine** — chips: Dutch, Indonesian, Italian, Japanese, Surinamese, French, etc.
- **Distance radius** — slider (500m – 10km, default 2km)
- **Price range** — €, €€, €€€, €€€€
- **Vibe** — multi-select chips

**Results:**
- List view with restaurant cards
- Each card shows: name, cuisine, distance, available slots, spots left
- Sort by: distance, rating, availability (soonest)

### 5.4 Favourites

A clean list of saved restaurants.

**Each favourite shows:**
- Restaurant name + cuisine
- Last visited date (if logged)
- Personal rating (if given)
- Current availability status (live)
- Personal notes preview

**Actions:**
- Tap → Goes to restaurant detail
- Swipe left → Remove from favourites
- Filter: "Show on map" toggles favourite pins on Radar

**Favourite Detail (extra vs. regular restaurant detail):**
- Personal notes / review
- Photos you've uploaded
- Associated events
- "Would visit again" toggle
- Order history (what you had)
- Personal rating (separate from public rating)

### 5.5 Events ("Marked Events")

The emotional core of Ate. Events connect meals to memories.

**Add New Event:**
- Event name (e.g., "Mom's 60th Birthday")
- Date
- Associated restaurant (optional — can pick later)
- Photos (upload from camera roll)
- Notes: what you liked, disliked, ambience
- Personal rating
- "Would visit again?" toggle
- **"Make it a tradition?"** toggle

**If "Make it a tradition" is ON:**
- App sends push notification + email X days before the anniversary
- Notification includes: "Mom's 60th was at Restaurant De Kas last year. Want to book again?"
- **Memory Wall** — a visual timeline of the tradition over the years with photos

**Event List View:**
- Upcoming events at top
- Past events below (with photos as visual anchors)
- Traditions marked with a recurring icon

### 5.6 Unavailable / Fully Booked List

Shows restaurants in the area that are currently full.

**Each entry shows:**
- Restaurant name
- "Next available: Tomorrow 7:30 PM" or "Next available: Saturday"
- "Notify me" toggle — sends push when a slot opens
- Tap → Full restaurant detail

### 5.7 Profile

- Username + avatar
- Dining stats: "12 restaurants saved, 4 events logged"
- Google Calendar connection toggle
- Notification preferences
- Location preferences
- Sign out

### 5.8 Google Calendar Integration

- Connect via OAuth2
- App scans calendar for events containing food-related keywords or manually tagged events
- Surfaces as suggestions: "You have 'Anniversary Dinner' on March 15. Want to find a restaurant?"
- User can confirm or dismiss
- Two-way: Events created in Ate can optionally be added to Google Calendar

### 5.9 Notification System

| Trigger | Channel | Timing |
|---|---|---|
| Table opens at notified restaurant | Push | Real-time |
| Tradition reminder | Push + Email | 7 days + 3 days + 1 day before |
| Calendar event detected | Push | 5 days before event |
| Favourite restaurant has special availability | Push | When detected |

---

## 6. Competitor Analysis

### Market Positioning

```
                    Premium / Editorial
                           |
                    Resy   |
                           |
    Simple ——————————— Ate ——————————— Complex
                           |
              TheFork      |    OpenTable
                           |
                    Functional / Utility
```

Ate sits in the **simple + editorial** quadrant — more human than TheFork/OpenTable, more practical than Resy.

### Competitive Differentiators

| Feature | TheFork | OpenTable | Resy | **Ate** |
|---|---|---|---|---|
| Real-time map of availability | ❌ | Partial | ❌ | ✅ |
| "What's open NOW" | ❌ | ❌ | ❌ | ✅ |
| Event/memory logging | ❌ | ❌ | ❌ | ✅ |
| Tradition reminders | ❌ | ❌ | ❌ | ✅ |
| Personal restaurant journal | ❌ | ❌ | ❌ | ✅ |
| Calendar integration | ❌ | ❌ | ❌ | ✅ |
| Cycling distance | ❌ | ❌ | ❌ | ✅ |
| Handles bookings | ✅ | ✅ | ✅ | ❌ (redirects) |
| Netherlands focus | ✅ | Partial | ❌ | ✅ |

**What Ate does NOT do (by design):**
- Does not process bookings — redirects to restaurant's own system
- Does not process payments
- Does not have a loyalty/points program
- Does not have a social feed or reviews from strangers

---

## 7. Design System

### 7.1 Brand Psychology

The Ate logo grid reveals an earthy, organic palette with warm neutrals. The brand feels:
- **Warm** — not cold/corporate
- **Grounded** — earth tones, not neon
- **Approachable** — lowercase, rounded
- **Intentional** — minimal, considered

This is not another blue-and-white tech app. Ate feels like a warm kitchen, a handwritten note, a place you want to return to.

### 7.2 Color Palette

**Primary Colors:**
- Forest Green `#2D5F2D` — Primary actions, available badges, brand anchor
- Cream `#F5F0E8` — Primary background
- Charcoal `#4A4A48` — Primary text, headers

**Secondary Colors:**
- Sage `#C5CFC0` — Cards, secondary surfaces
- Warm Beige `#D9CEBC` — Dividers, subtle backgrounds
- Blush Pink `#E8D0C8` — Event/memory accents
- Terracotta `#C27A3E` — Highlights, scarcity indicators
- Burgundy `#5C2028` — Error states, urgency
- Mustard `#D4A934` — Ratings, stars

**Neutrals:**
- Off White `#FAFAF7` — Page background
- Light Grey `#E8E6E2` — Borders
- Dark Grey `#2C2C2A` — Body text

### 7.3 Typography

**Primary Font:** Inter or DM Sans (rounded, friendly, highly readable)
- Display: 28px / Bold
- H1: 24px / Semibold
- H2: 20px / Semibold
- Body: 16px / Regular
- Caption: 13px / Regular
- Button: 15px / Medium

**Accent Font (optional):** A warm serif like Fraunces or Lora for restaurant names and event titles — adds editorial warmth.

### 7.4 Component Language

- **Corners:** 16px radius (cards), 24px radius (pills/buttons), 50% (avatars)
- **Shadows:** Soft, warm — `0 2px 12px rgba(74, 74, 72, 0.08)`
- **Spacing:** 8px grid system
- **Animations:** Spring physics (not linear), 300ms default duration
- **Haptics:** Light tap on selection, medium on confirmation
- **Icons:** Phosphor Icons (rounded style) or custom line icons

### 7.5 UI Personality

Inspired by:
- **Pickle** — modern card-based discovery, confident typography
- **Bump** — playful micro-interactions, bouncy transitions, delight-first
- **Resy** — editorial quality, photography-forward, no clutter
- **NOT** TheFork/OpenTable — no corporate grid layouts, no red/green traffic-light UX

**Key design decisions:**
- Bottom sheet pattern over full-page navigation (keeps map visible)
- Card-based restaurant previews (not list rows)
- Pill buttons for time slots (not dropdowns)
- Warm, organic color palette (not primary colors)
- Photography-first restaurant cards
- Cycling distance shown by default 🚲
- Subtle animations that feel natural, not flashy

### 7.6 Map Design (Mapbox)

- Custom Mapbox style matching Ate's cream/sage palette
- Green pins for available (custom marker using forest green)
- Grey pins for unavailable
- Warm-toned map tiles (no default blue Google Maps look)
- Custom cluster markers with count badges
- Smooth zoom animations
- Bottom sheet overlays map — map stays visible behind

### 7.7 Figma & Code-to-Canvas Compatibility

The prototype will be built in **Next.js + Tailwind CSS** with components structured for easy import to Figma via:
- **Figma Dev Mode** — inspect Next.js components and extract styles
- **Anima / Locofy** — convert React components to Figma layers
- **Manual** — design tokens (colors, typography, spacing) are documented and can be replicated in Figma

For **Mapbox in Figma**, use the [Mapbox for Figma plugin](https://www.figma.com/community/plugin/1189903964498980592) which generates static map images with custom styles that match your production Mapbox implementation.

---

## 8. Technical Architecture (Prototype)

### Frontend Stack
- **Next.js 14** (App Router)
- **Tailwind CSS** (utility-first, matches design tokens)
- **Mapbox GL JS** (map rendering)
- **Framer Motion** (animations)
- **TypeScript**

### Prototype Scope
For the deployable prototype, we'll build:
1. Onboarding flow (3 screens)
2. Restaurant Radar (map with mock pins)
3. Restaurant detail bottom sheet
4. Search & filter sheet
5. Favourites page
6. Events page (add + view)
7. Profile page
8. Unavailable restaurants list

All with mock data — no backend scraping in the prototype.

---

## 9. Psychology & Emotional Design

### Why People Forget Important Meals

Research in cognitive psychology shows:
- **Planning fallacy** — we assume we'll "get to it later" and then don't
- **Temporal discounting** — future events feel less urgent than present ones
- **Choice overload** — too many restaurant options leads to decision paralysis
- **Emotional anchoring** — meals connected to memories are more valued but also more stressful to plan

### How Ate Addresses This

| Psychological Barrier | Ate's Solution |
|---|---|
| "I'll book it later" | Tradition reminders start 7 days out |
| "Where did we go last year?" | Memory wall with photos and notes |
| "Too many options" | Map shows only what's available NOW |
| "I can't decide" | Vibe tags and "best time to visit" reduce choice |
| "Booking is annoying" | One tap to restaurant's own booking page |
| "I forgot our anniversary" | Google Calendar integration surfaces events |

### Emotional Design Touches

- **Memory Wall** — a visual, photo-rich timeline that makes past meals feel precious
- **Tradition Badge** — a small recurring icon that makes yearly events feel special
- **"X spots left"** — gentle scarcity, not aggressive FOMO
- **Cycling distance** — feels local, personal, Dutch
- **Warm palette** — subconsciously signals comfort, food, home
- **No points, no gamification** — respects the user's intelligence

---

## 10. Edge Cases & Error States

| Scenario | Handling |
|---|---|
| No restaurants available nearby | "All booked up nearby. Try expanding your radius or checking tomorrow." Show unavailable list. |
| Location permission denied | App still works — user manually enters city/neighborhood |
| No internet connection | Show cached last-known availability with "Last updated X min ago" label |
| Restaurant data is stale | Timestamp on every availability badge; greyed out if >30min old |
| User has no events | Empty state with illustration: "Your first meal memory starts here" |
| User has no favourites | Empty state: "Heart a restaurant to save it here" |
| Search returns no results | "No matches. Try fewer filters or a wider area." |
| Notification permission denied | App works without notifications; gentle re-prompt in settings |
| Google Calendar has no food events | "No upcoming events found. You can add events manually." |
| Restaurant has no photos | Default warm-toned placeholder with restaurant initial |

---

*This document is the foundation for Ate's design and development. The next step is the user flow chart (see USER_FLOWS.md) and the interactive prototype.*
