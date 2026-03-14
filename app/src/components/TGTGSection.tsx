export default function TGTGSection() {
  return (
    <section className="mx-4 mt-10 mb-6">
      <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl border border-emerald-200 p-6 md:p-8">
        <div className="flex items-center gap-3 mb-3">
          <span className="text-3xl">🥡</span>
          <h2 className="text-xl font-bold text-emerald-800">
            Too Good To Go
          </h2>
          <span className="bg-emerald-200 text-emerald-700 text-xs font-bold px-2.5 py-1 rounded-full">
            Coming Soon
          </span>
        </div>
        <p className="text-emerald-700 text-sm leading-relaxed mb-4">
          Surplus food deals from local restaurants at 50-70% off. Save money and help reduce food waste!
        </p>
        {/* Mockup cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {[
            { name: 'Local Bakery', price: '$3.99', orig: '$12.00', emoji: '🥐' },
            { name: 'Sushi Express', price: '$4.99', orig: '$15.00', emoji: '🍣' },
            { name: 'Pizza Corner', price: '$5.99', orig: '$18.00', emoji: '🍕' },
          ].map((item) => (
            <div
              key={item.name}
              className="bg-white/60 rounded-xl p-3 border border-emerald-100 opacity-70"
            >
              <div className="text-2xl mb-1">{item.emoji}</div>
              <p className="text-xs font-semibold text-gray-700">{item.name}</p>
              <div className="flex items-center gap-1 mt-1">
                <span className="text-sm font-bold text-emerald-600">{item.price}</span>
                <span className="text-[10px] text-gray-400 line-through">{item.orig}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
