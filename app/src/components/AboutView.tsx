export default function AboutView() {
  return (
    <div className="px-4 pb-4 max-w-lg mx-auto">
      <div className="text-center py-8">
        <span className="text-5xl">🍔</span>
        <h2 className="text-2xl font-extrabold text-gray-900 mt-3">Food Deals</h2>
        <p className="text-gray-500 mt-1">Find the best daily food deals near you</p>
      </div>

      <div className="space-y-5">
        {/* How it works */}
        <section className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
          <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
            <span className="text-lg">✨</span> How It Works
          </h3>
          <ol className="space-y-2 text-sm text-gray-600">
            <li className="flex items-start gap-2">
              <span className="bg-orange-100 text-orange-700 font-bold text-xs w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">1</span>
              <span>Select your city to see local deals</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="bg-orange-100 text-orange-700 font-bold text-xs w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">2</span>
              <span>Browse deals by day of the week</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="bg-orange-100 text-orange-700 font-bold text-xs w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">3</span>
              <span>Tap any deal to see full details, save favorites, or share with friends</span>
            </li>
          </ol>
        </section>

        {/* Disclaimer */}
        <section className="bg-amber-50 rounded-2xl p-5 border border-amber-200">
          <h3 className="font-bold text-amber-800 mb-2 flex items-center gap-2">
            <span className="text-lg">⚠️</span> Disclaimer
          </h3>
          <p className="text-sm text-amber-700 leading-relaxed">
            Deal information may not be 100% accurate or up to date. Prices, availability, and times can change without notice. Always verify directly with the restaurant before visiting.
          </p>
        </section>

        {/* About the data */}
        <section className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
          <h3 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
            <span className="text-lg">📊</span> About the Data
          </h3>
          <p className="text-sm text-gray-600 leading-relaxed">
            Deals are curated from public sources, restaurant websites, and community submissions. We update regularly to keep things fresh.
          </p>
        </section>

        {/* Credits */}
        <div className="text-center py-6 text-sm text-gray-400">
          <p>Version 1.0.0</p>
          <p className="mt-1">Built with ❤️ and great food</p>
        </div>
      </div>
    </div>
  );
}
