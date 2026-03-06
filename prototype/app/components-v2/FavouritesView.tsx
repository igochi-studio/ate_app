"use client";

import { motion } from "framer-motion";
import { HeartIcon } from "@radix-ui/react-icons";
import type { Restaurant } from "../data/restaurants";
import RestaurantCard from "./RestaurantCard";

const spring = { type: "spring" as const, stiffness: 380, damping: 30, mass: 0.8 };

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
    <div className="h-full flex flex-col pt-[env(safe-area-inset-top)] bg-ate-white">
      <div className="px-5 pt-6 pb-3">
        <h1 className="font-editorial text-[28px] font-extrabold text-ate-ink tracking-[-0.02em] leading-none">
          Saved
        </h1>
        <p className="text-[12px] text-ate-muted mt-1.5 font-semibold">
          <span className="font-editorial text-[20px] font-extrabold text-ate-ink mr-1">{favourites.length}</span>
          restaurant{favourites.length !== 1 ? "s" : ""}
        </p>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-24">
        {favourites.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-14 h-14 rounded-full bg-ate-grey flex items-center justify-center mx-auto mb-4">
              <HeartIcon className="w-6 h-6 text-ate-muted/30" />
            </div>
            <p className="font-editorial text-[15px] font-bold text-ate-ink/30">
              No favourites yet
            </p>
            <p className="text-[12px] text-ate-muted mt-1 font-medium">
              Heart a restaurant to save it here
            </p>
          </div>
        ) : (
          favourites.map((r, i) => (
            <motion.div
              key={r.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...spring, delay: i * 0.04 }}
            >
              <RestaurantCard
                restaurant={r}
                isFavourite={true}
                onToggleFavourite={onToggleFavourite}
                onSelect={onSelectRestaurant}
              />
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
