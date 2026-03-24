import { useState, useEffect, useCallback } from 'react';
import type { FoodDeal } from '../types';

const STORAGE_KEY = 'food-deals-favorites';

function loadFavorites(): FoodDeal[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveFavorites(deals: FoodDeal[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(deals));
}

export function useFavorites() {
  const [favorites, setFavorites] = useState<FoodDeal[]>(loadFavorites);

  useEffect(() => {
    saveFavorites(favorites);
  }, [favorites]);

  const isFavorite = useCallback(
    (id: string) => favorites.some((d) => d.id === id),
    [favorites]
  );

  const toggleFavorite = useCallback((deal: FoodDeal) => {
    setFavorites((prev) => {
      const exists = prev.some((d) => d.id === deal.id);
      if (exists) return prev.filter((d) => d.id !== deal.id);
      return [...prev, deal];
    });
  }, []);

  return { favorites, isFavorite, toggleFavorite };
}
