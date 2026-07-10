import { useState } from 'react';
import { supabase } from '../lib/supabase';

// NOTE: This component inserts into the `submitted_deals` table.
// A Supabase migration is needed to create this table:
//
// CREATE TABLE submitted_deals (
//   id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
//   restaurant_name text NOT NULL,
//   deal_description text NOT NULL,
//   deal_price numeric,
//   regular_price numeric,
//   day_of_week integer NOT NULL,
//   cuisine_type text,
//   location_area text,
//   source_url text,
//   submitted_at timestamptz DEFAULT now(),
//   status text DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
//   submitter_ip text
// );
//
// ALTER TABLE submitted_deals ENABLE ROW LEVEL SECURITY;
// CREATE POLICY "Anyone can insert" ON submitted_deals FOR INSERT WITH CHECK (true);

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const CUISINES = [
  'Mexican', 'Asian', 'Italian', 'American', 'Seafood',
  'Pizza', 'Wings', 'Breakfast', 'Drinks', 'Other',
];

interface FormData {
  restaurant_name: string;
  deal_description: string;
  deal_price: string;
  regular_price: string;
  day_of_week: string;
  cuisine_type: string;
  location_area: string;
  source_url: string;
}

const initialFormData: FormData = {
  restaurant_name: '',
  deal_description: '',
  deal_price: '',
  regular_price: '',
  day_of_week: String(new Date().getDay()),
  cuisine_type: '',
  location_area: '',
  source_url: '',
};

export default function SubmitDealForm() {
  const [form, setForm] = useState<FormData>(initialFormData);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, boolean>>>({});
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  function validate(): boolean {
    const newErrors: Partial<Record<keyof FormData, boolean>> = {};
    if (!form.restaurant_name.trim()) newErrors.restaurant_name = true;
    if (!form.deal_description.trim()) newErrors.deal_description = true;
    if (!form.day_of_week) newErrors.day_of_week = true;
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    setStatus('submitting');

    const payload = {
      restaurant_name: form.restaurant_name.trim(),
      deal_description: form.deal_description.trim(),
      deal_price: form.deal_price ? parseFloat(form.deal_price) : null,
      regular_price: form.regular_price ? parseFloat(form.regular_price) : null,
      day_of_week: parseInt(form.day_of_week, 10),
      cuisine_type: form.cuisine_type || null,
      location_area: form.location_area.trim() || null,
      source_url: form.source_url.trim() || null,
    };

    const { error } = await supabase.from('submitted_deals').insert(payload);

    if (error) {
      console.error('Submit deal error:', error);
      setStatus('error');
    } else {
      setStatus('success');
      setForm(initialFormData);
      setErrors({});
    }
  }

  if (status === 'success') {
    return (
      <div className="px-4 py-12 text-center">
        <div className="bg-green-50 border border-green-200 rounded-2xl p-8 max-w-md mx-auto">
          <div className="text-4xl mb-3">🎉</div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Thanks!</h2>
          <p className="text-gray-600">Your deal will be reviewed and added soon.</p>
          <button
            onClick={() => setStatus('idle')}
            className="mt-6 px-5 py-2 bg-orange-500 text-white font-semibold rounded-full hover:bg-orange-600 transition-colors"
          >
            Submit Another
          </button>
        </div>
      </div>
    );
  }

  const inputClass = (field: keyof FormData) =>
    `w-full px-4 py-3 rounded-xl border ${
      errors[field] ? 'border-red-400 bg-red-50' : 'border-gray-200 bg-white'
    } focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-orange-400 transition-colors`;

  return (
    <div className="px-4 py-4 max-w-lg mx-auto">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Restaurant Name */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Restaurant Name <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            value={form.restaurant_name}
            onChange={(e) => setForm({ ...form, restaurant_name: e.target.value })}
            placeholder="e.g., Sushi Palace"
            className={inputClass('restaurant_name')}
          />
          {errors.restaurant_name && (
            <p className="text-red-500 text-xs mt-1">Restaurant name is required</p>
          )}
        </div>

        {/* Deal Description */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Deal Description <span className="text-red-400">*</span>
          </label>
          <textarea
            value={form.deal_description}
            onChange={(e) => setForm({ ...form, deal_description: e.target.value })}
            placeholder="e.g., Half price sushi rolls all night"
            rows={3}
            className={inputClass('deal_description')}
          />
          {errors.deal_description && (
            <p className="text-red-500 text-xs mt-1">Deal description is required</p>
          )}
        </div>

        {/* Price Row */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Deal Price ($)
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={form.deal_price}
              onChange={(e) => setForm({ ...form, deal_price: e.target.value })}
              placeholder="e.g., 5.99"
              className={inputClass('deal_price')}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Regular Price ($)
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={form.regular_price}
              onChange={(e) => setForm({ ...form, regular_price: e.target.value })}
              placeholder="e.g., 11.99"
              className={inputClass('regular_price')}
            />
          </div>
        </div>

        {/* Day of Week */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Day of Week <span className="text-red-400">*</span>
          </label>
          <select
            value={form.day_of_week}
            onChange={(e) => setForm({ ...form, day_of_week: e.target.value })}
            className={inputClass('day_of_week')}
          >
            {DAYS.map((day, i) => (
              <option key={i} value={i}>{day}</option>
            ))}
          </select>
          {errors.day_of_week && (
            <p className="text-red-500 text-xs mt-1">Day of week is required</p>
          )}
        </div>

        {/* Cuisine Type */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Cuisine Type
          </label>
          <select
            value={form.cuisine_type}
            onChange={(e) => setForm({ ...form, cuisine_type: e.target.value })}
            className={inputClass('cuisine_type')}
          >
            <option value="">Select a cuisine (optional)</option>
            {CUISINES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        {/* Location */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Location / Area
          </label>
          <input
            type="text"
            value={form.location_area}
            onChange={(e) => setForm({ ...form, location_area: e.target.value })}
            placeholder="e.g., Downtown Redmond"
            className={inputClass('location_area')}
          />
        </div>

        {/* Source URL */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Source URL
          </label>
          <input
            type="url"
            value={form.source_url}
            onChange={(e) => setForm({ ...form, source_url: e.target.value })}
            placeholder="e.g., https://restaurant.com/specials"
            className={inputClass('source_url')}
          />
        </div>

        {/* Error State */}
        {status === 'error' && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-center">
            <p className="text-red-700 font-medium text-sm">Something went wrong. Please try again.</p>
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={status === 'submitting'}
          className="w-full py-3.5 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold rounded-xl shadow-md hover:from-orange-600 hover:to-amber-600 disabled:opacity-60 disabled:cursor-not-allowed transition-all"
        >
          {status === 'submitting' ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Submitting...
            </span>
          ) : (
            'Submit Deal'
          )}
        </button>
      </form>
    </div>
  );
}
