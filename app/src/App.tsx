import { useState, useEffect } from 'react';
import { supabase } from './lib/supabase';
import type { FoodDeal } from './types';
import DayTabs from './components/DayTabs';
import DealCard from './components/DealCard';
import SkeletonCard from './components/SkeletonCard';
import EmptyState from './components/EmptyState';
import TGTGSection from './components/TGTGSection';

function App() {
  const [selectedDay, setSelectedDay] = useState(new Date().getDay());
  const [deals, setDeals] = useState<FoodDeal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDeals() {
      setLoading(true);
      const { data, error } = await supabase
        .from('food_deals')
        .select('*')
        .eq('day_of_week', selectedDay)
        .order('deal_price', { ascending: true });

      if (error) {
        console.error('Error fetching deals:', error);
        setDeals([]);
      } else {
        setDeals(data || []);
      }
      setLoading(false);
    }

    fetchDeals();
  }, [selectedDay]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 via-white to-amber-50">
      {/* Header */}
      <header className="pt-8 pb-4 px-4 text-center">
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
          🍔 Food Deals
        </h1>
        <p className="text-gray-500 mt-1 text-sm">
          Eastside Seattle's best daily deals
        </p>
      </header>

      {/* Day Tabs */}
      <nav className="sticky top-0 z-10 bg-gradient-to-b from-orange-50/95 to-orange-50/80 backdrop-blur-sm pb-2">
        <DayTabs selectedDay={selectedDay} onSelectDay={setSelectedDay} />
      </nav>

      {/* Deal Cards */}
      <main className="px-4 pb-4">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : deals.length === 0 ? (
          <EmptyState day={selectedDay} />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {deals.map((deal) => (
              <DealCard key={deal.id} deal={deal} />
            ))}
          </div>
        )}
      </main>

      {/* TGTG Section */}
      <TGTGSection />

      {/* Footer */}
      <footer className="text-center py-6 text-sm text-gray-400 border-t border-gray-100 mt-4">
        Built with ❤️ | Have a deal to share? <span className="text-orange-400">(coming soon)</span>
      </footer>
    </div>
  );
}

export default App;
