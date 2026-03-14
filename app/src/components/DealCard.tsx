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

export default function DealCard({ deal }: { deal: FoodDeal }) {
  const savings = calcSavings(deal.deal_price, deal.regular_price);

  return (
    <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-gray-100 flex flex-col">
      {/* Top accent bar */}
      <div className="h-1.5 bg-gradient-to-r from-orange-400 via-red-400 to-amber-400" />

      <div className="p-5 flex flex-col flex-1">
        {/* Restaurant name + cuisine tag */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <h3 className="text-lg font-bold text-gray-900 leading-tight">
            {deal.restaurant_name}
          </h3>
          {deal.cuisine_type && (
            <span className={`flex-shrink-0 px-2.5 py-0.5 rounded-full text-xs font-medium ${getCuisineColor(deal.cuisine_type)}`}>
              {deal.cuisine_type}
            </span>
          )}
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
          <p className="text-xs text-gray-400 mb-3">
            📍 {deal.address || deal.location_area}
          </p>
        )}

        {/* View Details link */}
        {deal.source_url && (
          <a
            href={deal.source_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-sm font-medium text-orange-500 hover:text-orange-600 transition-colors mt-auto"
          >
            View Details
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        )}
      </div>
    </div>
  );
}
