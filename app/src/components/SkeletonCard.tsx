export default function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-100 animate-pulse">
      <div className="h-1.5 bg-gray-200" />
      <div className="p-5 space-y-4">
        <div className="flex justify-between">
          <div className="h-5 bg-gray-200 rounded w-2/3" />
          <div className="h-5 bg-gray-200 rounded-full w-16" />
        </div>
        <div className="space-y-2">
          <div className="h-3 bg-gray-200 rounded w-full" />
          <div className="h-3 bg-gray-200 rounded w-4/5" />
        </div>
        <div className="flex items-center gap-3">
          <div className="h-7 bg-gray-200 rounded w-20" />
          <div className="h-4 bg-gray-200 rounded w-14" />
        </div>
        <div className="h-3 bg-gray-200 rounded w-1/2" />
      </div>
    </div>
  );
}
