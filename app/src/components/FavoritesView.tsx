import type { FoodDeal } from '../types';
import DealCard from './DealCard';

interface FavoritesViewProps {
  favorites: FoodDeal[];
  isFavorite: (id: string) => boolean;
  onToggleFavorite: (deal: FoodDeal) => void;
  onSelectDeal: (deal: FoodDeal) => void;
}

export default function FavoritesView({ favorites, isFavorite, onToggleFavorite, onSelectDeal }: FavoritesViewProps) {
  if (favorites.length === 0) {
    return (
      <div className="text-center py-20 px-6">
        <div className="text-6xl mb-4">💛</div>
        <h3 className="text-xl font-semibold text-gray-700 mb-2">
          No favorites yet
        </h3>
        <p className="text-gray-400 max-w-xs mx-auto">
          Tap the heart icon on any deal to save it here for easy access.
        </p>
      </div>
    );
  }

  return (
    <div className="px-4 pb-4">
      <h2 className="text-lg font-bold text-gray-800 mb-4">
        Saved Deals ({favorites.length})
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {favorites.map((deal) => (
          <DealCard
            key={deal.id}
            deal={deal}
            isFavorite={isFavorite(deal.id)}
            onToggleFavorite={() => onToggleFavorite(deal)}
            onSelect={() => onSelectDeal(deal)}
          />
        ))}
      </div>
    </div>
  );
}
