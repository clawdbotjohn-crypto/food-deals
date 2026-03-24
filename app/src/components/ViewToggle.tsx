export type ViewMode = 'grid' | 'map';

interface ViewToggleProps {
  mode: ViewMode;
  onChange: (mode: ViewMode) => void;
}

export default function ViewToggle({ mode, onChange }: ViewToggleProps) {
  return (
    <div className="inline-flex rounded-full border border-gray-200 bg-white shadow-sm overflow-hidden">
      <button
        onClick={() => onChange('grid')}
        className={`flex items-center gap-1 px-3 py-1.5 text-xs font-medium transition ${
          mode === 'grid'
            ? 'bg-orange-500 text-white'
            : 'text-gray-500 hover:text-gray-700'
        }`}
        aria-label="Grid view"
      >
        {/* Grid icon */}
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
          />
        </svg>
        List
      </button>
      <button
        onClick={() => onChange('map')}
        className={`flex items-center gap-1 px-3 py-1.5 text-xs font-medium transition ${
          mode === 'map'
            ? 'bg-orange-500 text-white'
            : 'text-gray-500 hover:text-gray-700'
        }`}
        aria-label="Map view"
      >
        {/* Map pin icon */}
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
          />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
        Map
      </button>
    </div>
  );
}
