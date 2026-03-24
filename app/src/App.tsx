import { useState, useEffect } from 'react';
import { supabase } from './lib/supabase';
import { detectUserCity, DEFAULT_CITY } from './lib/geolocation';
import type { FoodDeal } from './types';
import { useFavorites } from './hooks/useFavorites';
import DayTabs from './components/DayTabs';
import DealCard from './components/DealCard';
import SkeletonCard from './components/SkeletonCard';
import EmptyState from './components/EmptyState';
import TGTGSection from './components/TGTGSection';
import CitySelector from './components/CitySelector';
import BottomNav from './components/BottomNav';
import type { NavTab } from './components/BottomNav';
import DealDetail from './components/DealDetail';
import FavoritesView from './components/FavoritesView';
import AboutView from './components/AboutView';

function App() {
  const [selectedDay, setSelectedDay] = useState(new Date().getDay());
  const [deals, setDeals] = useState<FoodDeal[]>([]);
  const [loading, setLoading] = useState(true);
  const [cities, setCities] = useState<string[]>([]);
  const [selectedCity, setSelectedCity] = useState<string>(DEFAULT_CITY);
  const [cityLoading, setCityLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<NavTab>('deals');
  const [selectedDeal, setSelectedDeal] = useState<FoodDeal | null>(null);

  const { favorites, isFavorite, toggleFavorite } = useFavorites();

  // Fetch available cities on mount + detect user location
  useEffect(() => {
    async function init() {
      const { data: cityData } = await supabase
        .from('food_deals')
        .select('city')
        .not('city', 'is', null);

      const uniqueCities = [
        ...new Set((cityData || []).map((d: { city: string }) => d.city)),
      ].sort();
      setCities(uniqueCities);

      if (uniqueCities.length > 0) {
        const detected = await detectUserCity(uniqueCities);
        setSelectedCity(detected);
      }
      setCityLoading(false);
    }

    init();
  }, []);

  // Fetch deals when day or city changes
  useEffect(() => {
    async function fetchDeals() {
      setLoading(true);
      const { data, error } = await supabase
        .from('food_deals')
        .select('*')
        .eq('day_of_week', selectedDay)
        .eq('city', selectedCity)
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
  }, [selectedDay, selectedCity]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 via-white to-amber-50 pb-20">
      {/* Header — only on deals tab */}
      {activeTab === 'deals' && (
        <header className="pt-8 pb-4 px-4 text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
            🍔 Food Deals
          </h1>
          <p className="text-gray-500 mt-1 text-sm">
            {selectedCity ? `${selectedCity}'s best daily deals` : 'Best daily deals near you'}
          </p>
          <CitySelector
            cities={cities}
            selectedCity={selectedCity}
            onSelectCity={setSelectedCity}
            loading={cityLoading}
          />
        </header>
      )}

      {/* Favorites header */}
      {activeTab === 'favorites' && (
        <header className="pt-8 pb-4 px-4 text-center">
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            ❤️ Favorites
          </h1>
          <p className="text-gray-500 mt-1 text-sm">Your saved deals</p>
        </header>
      )}

      {/* About header */}
      {activeTab === 'about' && (
        <header className="pt-8 pb-2 px-4 text-center">
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            About
          </h1>
        </header>
      )}

      {/* Tab Content */}
      {activeTab === 'deals' && (
        <>
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
                  <DealCard
                    key={deal.id}
                    deal={deal}
                    isFavorite={isFavorite(deal.id)}
                    onToggleFavorite={() => toggleFavorite(deal)}
                    onSelect={() => setSelectedDeal(deal)}
                  />
                ))}
              </div>
            )}
          </main>

          {/* TGTG Section */}
          <TGTGSection selectedCity={selectedCity} />
        </>
      )}

      {activeTab === 'favorites' && (
        <FavoritesView
          favorites={favorites}
          isFavorite={isFavorite}
          onToggleFavorite={toggleFavorite}
          onSelectDeal={setSelectedDeal}
        />
      )}

      {activeTab === 'about' && <AboutView />}

      {/* Bottom Navigation */}
      <BottomNav
        activeTab={activeTab}
        onTabChange={setActiveTab}
        favoritesCount={favorites.length}
      />

      {/* Deal Detail Modal */}
      {selectedDeal && (
        <DealDetail
          deal={selectedDeal}
          isFavorite={isFavorite(selectedDeal.id)}
          onToggleFavorite={() => toggleFavorite(selectedDeal)}
          onClose={() => setSelectedDeal(null)}
        />
      )}
    </div>
  );
}

export default App;
