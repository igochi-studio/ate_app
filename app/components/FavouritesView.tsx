"use client";

import { motion } from "framer-motion";
import { HeartFilledIcon } from "@radix-ui/react-icons";
import type { Restaurant } from "../data/restaurants";
import RestaurantCard from "./RestaurantCard";

export default function FavouritesView({
  restaurants,
  favouriteIds,
  onToggleFavourite,
  onSelectRestaurant,
}: {
  restaurants: Restaurant[];
  favouriteIds: string[];
  onToggleFavourite: (id: string) => void;
  onSelectRestaurant: (r: Restaurant) => void;
}) {
  const favourites = restaurants.filter((r) => favouriteIds.includes(r.id));

  return (
    <div className="h-full flex flex-col pt-[env(safe-area-inset-top)]">
      <div className="px-4 pt-4 pb-2">
        <h1 className="text-xl font-bold text-charcoal-dark">Favourites</h1>
        <p className="text-xs text-charcoal/40 mt-1">
          {favourites.length} restaurant{favourites.length !== 1 ? "s" : ""} saved
        </p>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-24">
        {favourites.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-blush/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <HeartFilledIcon className="w-7 h-7 text-terracotta/60" />
            </div>
            <p className="text-base font-medium text-charcoal/60">
              No favourites yet
            </p>
            <p className="text-sm text-charcoal/30 mt-1">
              Heart a restaurant to save it here
            </p>
          </div>
        ) : (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              visible: { transition: { staggerChildren: 0.05 } },
            }}
          >
            {favourites.map((r) => (
              <RestaurantCard
                key={r.id}
                restaurant={r}
                isFavourite={true}
                onToggleFavourite={onToggleFavourite}
                onSelect={onSelectRestaurant}
              />
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}
