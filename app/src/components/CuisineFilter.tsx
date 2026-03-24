interface CuisineFilterProps {
  cuisines: string[];
  selected: string;
  onSelect: (cuisine: string) => void;
}

const ALL = 'All';

export default function CuisineFilter({ cuisines, selected, onSelect }: CuisineFilterProps) {
  if (cuisines.length === 0) return null;

  return (
    <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide -mx-4 px-4">
      {[ALL, ...cuisines].map((cuisine) => {
        const isActive = cuisine === ALL ? selected === ALL : selected === cuisine;
        return (
          <button
            key={cuisine}
            onClick={() => onSelect(cuisine === ALL ? ALL : cuisine)}
            className={`flex-shrink-0 px-3.5 py-1.5 rounded-full text-sm font-medium transition whitespace-nowrap ${
              isActive
                ? 'bg-orange-500 text-white shadow-sm'
                : 'bg-white text-gray-600 border border-gray-200 hover:border-orange-300 hover:text-orange-600'
            }`}
          >
            {cuisine}
          </button>
        );
      })}
    </div>
  );
}
