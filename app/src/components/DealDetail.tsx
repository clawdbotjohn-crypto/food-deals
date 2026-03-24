import type { FoodDeal } from '../types';

const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

interface DealDetailProps {
  deal: FoodDeal;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  onClose: () => void;
}

function calcSavings(deal: number | null, regular: number | null): number | null {
  if (deal == null || regular == null || regular <= 0) return null;
  return Math.round(((regular - deal) / regular) * 100);
}

export default function DealDetail({ deal, isFavorite, onToggleFavorite, onClose }: DealDetailProps) {
  const savings = calcSavings(deal.deal_price, deal.regular_price);
  const mapsUrl = deal.address
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(deal.address)}`
    : null;

  async function handleShare() {
    const text = `${deal.restaurant_name} — ${deal.deal_description}${deal.deal_price != null ? ` ($${deal.deal_price.toFixed(2)})` : ''}`;
    if (navigator.share) {
      try {
        await navigator.share({ title: 'Food Deal', text });
      } catch {
        // User cancelled
      }
    } else {
      await navigator.clipboard.writeText(text);
      alert('Deal copied to clipboard!');
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 animate-fade-in" onClick={onClose} />

      {/* Sheet */}
      <div className="relative bg-white w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-t-3xl sm:rounded-2xl animate-slide-up">
        {/* Accent bar */}
        <div className="h-1.5 bg-gradient-to-r from-orange-400 via-red-400 to-amber-400 rounded-t-3xl sm:rounded-t-2xl" />

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="p-6">
          {/* Restaurant name */}
          <h2 className="text-2xl font-extrabold text-gray-900 pr-8 mb-1">
            {deal.restaurant_name}
          </h2>

          {/* Cuisine + Day */}
          <div className="flex items-center gap-2 mb-4">
            {deal.cuisine_type && (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-700">
                {deal.cuisine_type}
              </span>
            )}
            <span className="text-xs text-gray-400">
              {DAY_NAMES[deal.day_of_week]}
            </span>
          </div>

          {/* Description */}
          <p className="text-gray-600 leading-relaxed mb-5">
            {deal.deal_description}
          </p>

          {/* Price section */}
          <div className="flex items-end gap-3 mb-5">
            {deal.deal_price != null && (
              <span className="text-3xl font-extrabold text-orange-600">
                ${deal.deal_price.toFixed(2)}
              </span>
            )}
            {deal.regular_price != null && (
              <span className="text-base text-gray-400 line-through mb-0.5">
                ${deal.regular_price.toFixed(2)}
              </span>
            )}
            {savings != null && (
              <span className="bg-green-100 text-green-700 text-sm font-bold px-3 py-1 rounded-lg mb-0.5">
                Save {savings}%
              </span>
            )}
          </div>

          {/* Address */}
          {deal.address && (
            <div className="flex items-start gap-2 mb-2 text-sm text-gray-600">
              <span className="flex-shrink-0 mt-0.5">📍</span>
              <span>{deal.address}</span>
            </div>
          )}

          {/* Location area */}
          {deal.location_area && (
            <div className="flex items-start gap-2 mb-4 text-sm text-gray-500">
              <span className="flex-shrink-0 mt-0.5">🏘️</span>
              <span>{deal.location_area}</span>
            </div>
          )}

          {/* Map link */}
          {mapsUrl && (
            <a
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700 mb-6 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Open in Google Maps
            </a>
          )}

          {/* Source URL */}
          {deal.source_url && (
            <a
              href={deal.source_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm font-medium text-orange-500 hover:text-orange-600 mb-6 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              View Source
            </a>
          )}

          {/* Action buttons */}
          <div className="flex gap-3 mt-2">
            <button
              onClick={onToggleFavorite}
              className={`flex-1 py-3 rounded-xl font-semibold text-sm transition-colors flex items-center justify-center gap-2 ${
                isFavorite
                  ? 'bg-red-50 text-red-600 border border-red-200'
                  : 'bg-orange-50 text-orange-600 border border-orange-200'
              }`}
            >
              <svg
                className="w-5 h-5"
                fill={isFavorite ? 'currentColor' : 'none'}
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
              </svg>
              {isFavorite ? 'Saved' : 'Save to Favorites'}
            </button>
            <button
              onClick={handleShare}
              className="py-3 px-5 rounded-xl font-semibold text-sm bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z" />
              </svg>
              Share
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
