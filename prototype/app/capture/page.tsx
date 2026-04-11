"use client";

import { useState, useEffect } from "react";
import { mockRestaurants, mockEvents } from "../data/restaurants";
import type { Restaurant } from "../data/restaurants";
import RadarView from "../components-v2/RadarView";
import RestaurantDetail from "../components-v2/RestaurantDetail";
import CommunityView from "../components-v2/CommunityView";
import EventsView from "../components-v2/EventsView";
import FavouritesView from "../components-v2/FavouritesView";
import ProfileView from "../components-v2/ProfileView";
import TabBar from "../components-v2/TabBar";
import OnboardingFlow from "../components-v2/OnboardingFlow";

// Mobile frame wrapper — forces 390x844 iPhone 14 dimensions
function MobileFrame({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        width: 390,
        height: 844,
        overflow: "hidden",
        position: "relative",
        background: "#FFFFFF",
        borderRadius: 0,
        margin: 0,
      }}
    >
      {children}
    </div>
  );
}

export default function CapturePage() {
  const [screen, setScreen] = useState("onboarding-welcome");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const s = new URLSearchParams(window.location.search).get("screen");
      if (s) setScreen(s);
    }
  }, []);

  const [favouriteIds] = useState(["1", "4"]);
  const toggleFav = () => {};

  const renderScreen = () => {
    switch (screen) {
      // ─── ONBOARDING ───
      case "onboarding-welcome":
        return (
          <MobileFrame>
            <OnboardingFlow onComplete={() => {}} />
          </MobileFrame>
        );

      // ─── MAP VIEW (default) ───
      case "map":
        return (
          <MobileFrame>
            <div style={{ height: 844, position: "relative" }}>
              <RadarView
                restaurants={mockRestaurants}
                favouriteIds={favouriteIds}
                onToggleFavourite={toggleFav}
                onSelectRestaurant={() => {}}
              />
              <TabBar active="radar" onNavigate={() => {}} />
            </div>
          </MobileFrame>
        );

      // ─── RESTAURANT DETAIL (available) ───
      case "detail":
        return (
          <MobileFrame>
            <div style={{ height: 844, position: "relative", background: "rgba(13,13,13,0.3)" }}>
              <RestaurantDetail
                restaurant={mockRestaurants[0]}
                isFavourite={true}
                onToggleFavourite={toggleFav}
                onClose={() => {}}
              />
            </div>
          </MobileFrame>
        );

      // ─── RESTAURANT DETAIL (unavailable) ───
      case "detail-unavailable":
        return (
          <MobileFrame>
            <div style={{ height: 844, position: "relative", background: "rgba(13,13,13,0.3)" }}>
              <RestaurantDetail
                restaurant={mockRestaurants[2]}
                isFavourite={false}
                onToggleFavourite={toggleFav}
                onClose={() => {}}
              />
            </div>
          </MobileFrame>
        );

      // ─── COMMUNITY ───
      case "community":
        return (
          <MobileFrame>
            <div style={{ height: 844, overflow: "auto" }}>
              <CommunityView />
              <TabBar active="community" onNavigate={() => {}} />
            </div>
          </MobileFrame>
        );

      // ─── EVENTS ───
      case "events":
        return (
          <MobileFrame>
            <div style={{ height: 844, overflow: "auto" }}>
              <EventsView
                restaurants={mockRestaurants}
                events={mockEvents}
                onAddEvent={() => {}}
              />
              <TabBar active="event" onNavigate={() => {}} />
            </div>
          </MobileFrame>
        );

      // ─── FAVOURITES (with items) ───
      case "favourites":
        return (
          <MobileFrame>
            <div style={{ height: 844, overflow: "auto" }}>
              <FavouritesView
                restaurants={mockRestaurants}
                favouriteIds={["1", "4", "8"]}
                onToggleFavourite={toggleFav}
                onSelectRestaurant={() => {}}
              />
              <TabBar active="favourites" onNavigate={() => {}} />
            </div>
          </MobileFrame>
        );

      // ─── FAVOURITES (empty) ───
      case "favourites-empty":
        return (
          <MobileFrame>
            <div style={{ height: 844, overflow: "auto" }}>
              <FavouritesView
                restaurants={mockRestaurants}
                favouriteIds={[]}
                onToggleFavourite={toggleFav}
                onSelectRestaurant={() => {}}
              />
              <TabBar active="favourites" onNavigate={() => {}} />
            </div>
          </MobileFrame>
        );

      // ─── PROFILE ───
      case "profile":
        return (
          <MobileFrame>
            <div style={{ height: 844, overflow: "auto" }}>
              <ProfileView favouriteCount={2} eventCount={3} />
              <TabBar active="profile" onNavigate={() => {}} />
            </div>
          </MobileFrame>
        );

      default:
        return (
          <MobileFrame>
            <div style={{ height: 844, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <p>Unknown screen: {screen}</p>
            </div>
          </MobileFrame>
        );
    }
  };

  return (
    <div style={{ background: "#E5E5E5", minHeight: "100vh", padding: 0, margin: 0 }}>
      {renderScreen()}
    </div>
  );
}
