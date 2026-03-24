interface CitySelectorProps {
  cities: string[];
  selectedCity: string;
  onSelectCity: (city: string) => void;
  loading?: boolean;
}

export default function CitySelector({
  cities,
  selectedCity,
  onSelectCity,
  loading,
}: CitySelectorProps) {
  if (cities.length <= 1 && !loading) return null;

  return (
    <div className="flex items-center justify-center gap-2 mt-1">
      <svg
        className="w-4 h-4 text-gray-400 flex-shrink-0"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
        />
      </svg>
      {loading ? (
        <span className="text-sm text-gray-400 animate-pulse">
          Detecting location…
        </span>
      ) : (
        <select
          value={selectedCity}
          onChange={(e) => onSelectCity(e.target.value)}
          className="text-sm text-gray-600 bg-transparent border border-gray-200 rounded-lg px-2 py-1 
                     hover:border-orange-300 focus:border-orange-400 focus:ring-1 focus:ring-orange-200 
                     outline-none cursor-pointer transition-colors"
        >
          {cities.map((city) => (
            <option key={city} value={city}>
              {city}
            </option>
          ))}
        </select>
      )}
    </div>
  );
}
