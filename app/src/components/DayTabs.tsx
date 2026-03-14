const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

interface DayTabsProps {
  selectedDay: number;
  onSelectDay: (day: number) => void;
}

export default function DayTabs({ selectedDay, onSelectDay }: DayTabsProps) {
  return (
    <div className="flex gap-2 overflow-x-auto px-4 py-3 scrollbar-hide">
      {DAY_NAMES.map((name, i) => {
        const isSelected = i === selectedDay;
        const isToday = i === new Date().getDay();
        return (
          <button
            key={i}
            onClick={() => onSelectDay(i)}
            className={`
              flex-shrink-0 px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-200
              ${isSelected
                ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/30 scale-105'
                : 'bg-white text-gray-600 hover:bg-orange-50 hover:text-orange-600 shadow-sm'
              }
              ${isToday && !isSelected ? 'ring-2 ring-orange-300' : ''}
            `}
          >
            {name}
            {isToday && <span className="ml-1 text-[10px]">●</span>}
          </button>
        );
      })}
    </div>
  );
}
