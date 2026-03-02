"use client";

import { useState, useCallback } from "react";
import { AnimatePresence, LayoutGroup } from "framer-motion";
import { mockRestaurants, mockEvents } from "./data/restaurants";
import type { Restaurant, Event } from "./data/restaurants";
import OnboardingFlow from "./components/OnboardingFlow";
import TabBar from "./components/TabBar";
import RadarView from "./components/RadarView";
import SearchView from "./components/SearchView";
import EventsView from "./components/EventsView";
import FavouritesView from "./components/FavouritesView";
import ProfileView from "./components/ProfileView";
import RestaurantDetail from "./components/RestaurantDetail";

type Tab = "radar" | "search" | "event" | "favourites" | "profile";

export default function Home() {
  const [onboarded, setOnboarded] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>("radar");
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
  const [favouriteIds, setFavouriteIds] = useState<string[]>(["1", "2"]);
  const [events, setEvents] = useState<Event[]>(mockEvents);

  const toggleFavourite = useCallback((id: string) => {
    setFavouriteIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  }, []);

  const addEvent = useCallback((event: Event) => {
    setEvents((prev) => [...prev, event]);
  }, []);

  if (!onboarded) {
    return <OnboardingFlow onComplete={() => setOnboarded(true)} />;
  }

  return (
    <LayoutGroup>
      <div className="h-screen flex flex-col bg-cream-light overflow-hidden">
        <div className="flex-1 overflow-hidden">
          {activeTab === "radar" && (
            <RadarView
              key="radar"
              restaurants={mockRestaurants}
              favouriteIds={favouriteIds}
              onToggleFavourite={toggleFavourite}
              onSelectRestaurant={setSelectedRestaurant}
              onOpenSearch={() => setActiveTab("search")}
            />
          )}
          {activeTab === "search" && (
            <SearchView
              key="search"
              restaurants={mockRestaurants}
              favouriteIds={favouriteIds}
              onToggleFavourite={toggleFavourite}
              onSelectRestaurant={setSelectedRestaurant}
            />
          )}
          {activeTab === "event" && (
            <EventsView
              key="events"
              events={events}
              restaurants={mockRestaurants}
              onAddEvent={addEvent}
            />
          )}
          {activeTab === "favourites" && (
            <FavouritesView
              key="favourites"
              restaurants={mockRestaurants}
              favouriteIds={favouriteIds}
              onToggleFavourite={toggleFavourite}
              onSelectRestaurant={setSelectedRestaurant}
            />
          )}
          {activeTab === "profile" && (
            <ProfileView
              key="profile"
              favouriteCount={favouriteIds.length}
              eventCount={events.length}
            />
          )}
        </div>

        <TabBar active={activeTab} onNavigate={setActiveTab} />

        <AnimatePresence>
          {selectedRestaurant && (
            <RestaurantDetail
              restaurant={selectedRestaurant}
              isFavourite={favouriteIds.includes(selectedRestaurant.id)}
              onToggleFavourite={toggleFavourite}
              onClose={() => setSelectedRestaurant(null)}
            />
          )}
        </AnimatePresence>
      </div>
    </LayoutGroup>
  );
}
