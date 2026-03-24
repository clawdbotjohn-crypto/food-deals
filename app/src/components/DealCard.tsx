import type { FoodDeal } from '../types';

const CUISINE_COLORS: Record<string, string> = {
  mexican: 'bg-red-100 text-red-700',
  italian: 'bg-green-100 text-green-700',
  japanese: 'bg-pink-100 text-pink-700',
  chinese: 'bg-yellow-100 text-yellow-700',
  thai: 'bg-purple-100 text-purple-700',
  indian: 'bg-orange-100 text-orange-700',
  american: 'bg-blue-100 text-blue-700',
  korean: 'bg-rose-100 text-rose-700',
  vietnamese: 'bg-teal-100 text-teal-700',
  mediterranean: 'bg-amber-100 text-amber-700',
};

function getCuisineColor(cuisine: string | null): string {
  if (!cuisine) return 'bg-gray-100 text-gray-600';
  return CUISINE_COLORS[cuisine.toLowerCase()] || 'bg-gray-100 text-gray-600';
}

function calcSavings(deal: number | null, regular: number | null): number | null {
  if (deal == null || regular == null || regular <= 0) return null;
  return Math.round(((regular - deal) / regular) * 100);
}

interface DealCardProps {
  deal: FoodDeal;
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
  onSelect?: () => void;
}

export default function DealCard({ deal, isFavorite, onToggleFavorite, onSelect }: DealCardProps) {
  const savings = calcSavings(deal.deal_price, deal.regular_price);

  return (
    <div
      className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-gray-100 flex flex-col cursor-pointer active:scale-[0.98] transition-transform"
      onClick={onSelect}
    >
      {/* Top accent bar */}
      <div className="h-1.5 bg-gradient-to-r from-orange-400 via-red-400 to-amber-400" />

      <div className="p-5 flex flex-col flex-1">
        {/* Restaurant name + cuisine tag + heart */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <h3 className="text-lg font-bold text-gray-900 leading-tight flex-1">
            {deal.restaurant_name}
          </h3>
          <div className="flex items-center gap-1.5 flex-shrink-0">
            {deal.cuisine_type && (
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getCuisineColor(deal.cuisine_type)}`}>
                {deal.cuisine_type}
              </span>
            )}
            {onToggleFavorite && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleFavorite();
                }}
                className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
              >
                <svg
                  className={`w-5 h-5 transition-colors ${isFavorite ? 'text-red-500' : 'text-gray-300 hover:text-gray-400'}`}
                  fill={isFavorite ? 'currentColor' : 'none'}
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Deal description */}
        <p className="text-gray-600 text-sm mb-4 leading-relaxed flex-1">
          {deal.deal_description}
        </p>

        {/* Price section */}
        <div className="flex items-end gap-3 mb-3">
          {deal.deal_price != null && (
            <span className="text-2xl font-extrabold text-orange-600">
              ${deal.deal_price.toFixed(2)}
            </span>
          )}
          {deal.regular_price != null && (
            <span className="text-sm text-gray-400 line-through mb-0.5">
              ${deal.regular_price.toFixed(2)}
            </span>
          )}
          {savings != null && (
            <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded-lg mb-0.5">
              {savings}% OFF
            </span>
          )}
        </div>

        {/* Location */}
        {(deal.location_area || deal.address) && (
          <p className="text-xs text-gray-400">
            📍 {deal.address || deal.location_area}
          </p>
        )}
      </div>
    </div>
  );
}
