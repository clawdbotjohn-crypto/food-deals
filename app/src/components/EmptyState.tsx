const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export default function EmptyState({ day }: { day: number }) {
  return (
    <div className="text-center py-16 px-6">
      <div className="text-6xl mb-4">🍽️</div>
      <h3 className="text-xl font-semibold text-gray-700 mb-2">
        No deals found for {DAY_NAMES[day]}
      </h3>
      <p className="text-gray-400">
        Check another day — there's always something delicious waiting!
      </p>
    </div>
  );
}
