import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { TGTGDeal } from '../types';

interface TGTGSectionProps {
  selectedCity: string;
}

function formatPickupTime(start: string | null, end: string | null): string {
  if (!start) return '';
  const s = new Date(start);
  const e = end ? new Date(end) : null;
  const timeOpts: Intl.DateTimeFormatOptions = { hour: 'numeric', minute: '2-digit' };
  const dayOpts: Intl.DateTimeFormatOptions = { weekday: 'short' };

  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  let dayLabel = s.toLocaleDateString('en-US', dayOpts);
  if (s.toDateString() === today.toDateString()) dayLabel = 'Today';
  else if (s.toDateString() === tomorrow.toDateString()) dayLabel = 'Tomorrow';

  const startTime = s.toLocaleTimeString('en-US', timeOpts);
  if (e) {
    const endTime = e.toLocaleTimeString('en-US', timeOpts);
    return `${dayLabel} ${startTime}–${endTime}`;
  }
  return `${dayLabel} ${startTime}`;
}

function savingsPercent(price: number | null, original: number | null): number | null {
  if (!price || !original || original <= 0) return null;
  return Math.round(((original - price) / original) * 100);
}

export default function TGTGSection({ selectedCity }: TGTGSectionProps) {
  const [deals, setDeals] = useState<TGTGDeal[]>([]);
  const [loading, setLoading] = useState(true);
  const [neverPopulated, setNeverPopulated] = useState(false);

  useEffect(() => {
    async function fetchDeals() {
      setLoading(true);

      // Check if table has any data at all
      const { count } = await supabase
        .from('food_tgtg_deals')
        .select('id', { count: 'exact', head: true });

      if (count === 0 || count === null) {
        setNeverPopulated(true);
        setDeals([]);
        setLoading(false);
        return;
      }

      setNeverPopulated(false);

      // Fetch deals for selected city with items available
      const { data, error } = await supabase
        .from('food_tgtg_deals')
        .select('*')
        .eq('city', selectedCity)
        .gt('items_available', 0)
        .order('price', { ascending: true });

      if (error) {
        console.error('Error fetching TGTG deals:', error);
        setDeals([]);
      } else {
        setDeals(data || []);
      }
      setLoading(false);
    }

    fetchDeals();
  }, [selectedCity]);

  return (
    <section className="mx-4 mt-10 mb-6">
      <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl border border-emerald-200 p-6 md:p-8">
        <div className="flex items-center gap-3 mb-3">
          <span className="text-3xl">🥡</span>
          <h2 className="text-xl font-bold text-emerald-800">
            Too Good To Go
          </h2>
          {deals.length > 0 && (
            <span className="bg-emerald-200 text-emerald-700 text-xs font-bold px-2.5 py-1 rounded-full">
              {deals.length} available
            </span>
          )}
        </div>
        <p className="text-emerald-700 text-sm leading-relaxed mb-4">
          Surplus food deals from local restaurants at 50–70% off. Save money and help reduce food waste!
        </p>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white/60 rounded-xl p-3 border border-emerald-100 animate-pulse">
                <div className="h-8 w-8 bg-emerald-100 rounded mb-2" />
                <div className="h-3 w-20 bg-emerald-100 rounded mb-2" />
                <div className="h-3 w-14 bg-emerald-100 rounded" />
              </div>
            ))}
          </div>
        ) : neverPopulated ? (
          <div className="text-center py-6">
            <p className="text-emerald-600 text-sm">
              🔧 Set up TGTG sync to see surplus deals
            </p>
            <p className="text-emerald-500 text-xs mt-1">
              Run <code className="bg-emerald-100 px-1 rounded">tgtg_setup.py</code> to connect your Too Good To Go account
            </p>
          </div>
        ) : deals.length === 0 ? (
          <div className="text-center py-6">
            <p className="text-emerald-600 text-sm">
              📭 No surplus deals right now
            </p>
            <p className="text-emerald-500 text-xs mt-1">
              Check back later — new deals appear throughout the day
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {deals.map((deal) => {
              const savings = savingsPercent(deal.price, deal.original_price);
              return (
                <div
                  key={deal.id}
                  className="bg-white/80 rounded-xl p-3 border border-emerald-100 hover:shadow-md transition-shadow"
                >
                  {deal.cover_image_url ? (
                    <img
                      src={deal.cover_image_url}
                      alt={deal.store_name}
                      className="w-full h-20 object-cover rounded-lg mb-2"
                    />
                  ) : (
                    <div className="text-2xl mb-1">🥡</div>
                  )}
                  <p className="text-xs font-semibold text-gray-700 truncate">
                    {deal.store_name}
                  </p>
                  {deal.description && (
                    <p className="text-[10px] text-gray-500 truncate mt-0.5">
                      {deal.description}
                    </p>
                  )}
                  <div className="flex items-center gap-1.5 mt-1.5">
                    <span className="text-sm font-bold text-emerald-600">
                      ${deal.price?.toFixed(2)}
                    </span>
                    {deal.original_price && (
                      <span className="text-[10px] text-gray-400 line-through">
                        ${deal.original_price.toFixed(2)}
                      </span>
                    )}
                    {savings && (
                      <span className="text-[10px] font-bold text-emerald-500 bg-emerald-50 px-1 rounded">
                        -{savings}%
                      </span>
                    )}
                  </div>
                  {(deal.pickup_start || deal.pickup_end) && (
                    <p className="text-[10px] text-gray-500 mt-1">
                      🕐 {formatPickupTime(deal.pickup_start, deal.pickup_end)}
                    </p>
                  )}
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-[10px] text-emerald-600">
                      {deal.items_available} left
                    </span>
                    {deal.rating && (
                      <span className="text-[10px] text-amber-500">
                        ⭐ {deal.rating.toFixed(1)}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <p className="text-[10px] text-emerald-400 mt-4 text-center">
          Powered by Too Good To Go • Updated every 30 min
        </p>
      </div>
    </section>
  );
}
