import React, { useState } from 'react';
import {
  MapPin,
  Calendar,
  Users,
  DollarSign,
  Sparkles,
  Compass,
  Check,
  Palmtree,
  Landmark,
  UtensilsCrossed,
  ShoppingBag,
  Building2,
  Waves,
  Trees,
} from 'lucide-react';
import { TripPlannerInput, TravelStyle, InterestType } from '../types';
import { POPULAR_DESTINATIONS } from '../data/popularDestinations';

interface PlannerFormProps {
  onSubmit: (input: TripPlannerInput) => void;
  loading: boolean;
}

const TRAVEL_STYLES: { id: TravelStyle; label: string; desc: string }[] = [
  { id: 'Solo', label: 'Solo Traveler', desc: 'Freedom & flexibility' },
  { id: 'Family', label: 'Family Friendly', desc: 'Comfort & easy pace' },
  { id: 'Adventure', label: 'Adventure', desc: 'Thrill & active outdoors' },
  { id: 'Budget', label: 'Budget Explorer', desc: 'Hostels & smart savings' },
  { id: 'Luxury', label: 'Luxury & Wellness', desc: 'Premium & fine dining' },
];

const INTEREST_OPTIONS: { id: InterestType; label: string; icon: React.ReactNode }[] = [
  { id: 'Nature', label: 'Nature & Parks', icon: <Trees className="w-4 h-4 text-emerald-500" /> },
  { id: 'History', label: 'History & Forts', icon: <Landmark className="w-4 h-4 text-amber-500" /> },
  { id: 'Food', label: 'Local Food & Drinks', icon: <UtensilsCrossed className="w-4 h-4 text-orange-500" /> },
  { id: 'Shopping', label: 'Bazaars & Shopping', icon: <ShoppingBag className="w-4 h-4 text-purple-500" /> },
  { id: 'Temples', label: 'Temples & Heritage', icon: <Building2 className="w-4 h-4 text-rose-500" /> },
  { id: 'Beaches', label: 'Beaches & Coastal', icon: <Waves className="w-4 h-4 text-sky-500" /> },
  { id: 'Wildlife', label: 'Wildlife & Safaris', icon: <Palmtree className="w-4 h-4 text-teal-500" /> },
];

const CURRENCIES = [
  { code: 'INR', symbol: '₹', label: 'INR (₹)' },
  { code: 'USD', symbol: '$', label: 'USD ($)' },
  { code: 'EUR', symbol: '€', label: 'EUR (€)' },
  { code: 'GBP', symbol: '£', label: 'GBP (£)' },
  { code: 'JPY', symbol: '¥', label: 'JPY (¥)' },
  { code: 'AUD', symbol: 'A$', label: 'AUD (A$)' },
];

export const PlannerForm: React.FC<PlannerFormProps> = ({ onSubmit, loading }) => {
  const [destination, setDestination] = useState('Pune');
  const [startDate, setStartDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });
  const [endDate, setEndDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 3);
    return d.toISOString().split('T')[0];
  });
  const [travelersCount, setTravelersCount] = useState(2);
  const [budgetLevel, setBudgetLevel] = useState<'Budget' | 'Moderate' | 'Luxury'>('Moderate');
  const [currency, setCurrency] = useState('INR');
  const [travelStyle, setTravelStyle] = useState<TravelStyle>('Family');
  const [interests, setInterests] = useState<InterestType[]>(['History', 'Food', 'Nature']);

  const durationDays = React.useMemo(() => {
    const s = new Date(startDate);
    const e = new Date(endDate);
    const diffTime = Math.abs(e.getTime() - s.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 1;
  }, [startDate, endDate]);

  const toggleInterest = (interest: InterestType) => {
    if (interests.includes(interest)) {
      if (interests.length > 1) {
        setInterests(interests.filter((i) => i !== interest));
      }
    } else {
      setInterests([...interests, interest]);
    }
  };

  const handleSelectPopular = (popName: string, popCurr: string) => {
    setDestination(popName);
    if (popCurr) setCurrency(popCurr);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!destination.trim()) return;

    onSubmit({
      destination: destination.trim(),
      startDate,
      endDate,
      durationDays,
      travelersCount,
      budgetLevel,
      currency,
      travelStyle,
      interests,
    });
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xl p-6 sm:p-8 transition-colors">
      <div className="mb-6">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
          <Compass className="w-7 h-7 text-sky-500" />
          Plan Your AI-Powered Trip
        </h2>
        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
          Customize your preferences to generate personalized day-by-day itineraries, local dishes, attractions, and budget estimates.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Destination & Quick Select Badges */}
        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
            Where do you want to go?
          </label>
          <div className="relative">
            <MapPin className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              id="planner-destination-input"
              type="text"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              placeholder="e.g. Pune, Jaipur, Goa, Tokyo, Paris, Kerala, Hyderabad..."
              required
              className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-2xl text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-all"
            />
          </div>

          {/* Quick Destination Pills */}
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Popular:</span>
            {POPULAR_DESTINATIONS.slice(0, 7).map((pop) => (
              <button
                key={pop.name}
                type="button"
                onClick={() => handleSelectPopular(pop.name, pop.currency)}
                className={`px-2.5 py-1 text-xs font-medium rounded-full transition-all border ${
                  destination.toLowerCase() === pop.name.toLowerCase()
                    ? 'bg-sky-500 text-white border-sky-500 shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-sky-400'
                }`}
              >
                {pop.name}
              </button>
            ))}
          </div>
        </div>

        {/* Dates & Travelers Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
              Start Date
            </label>
            <div className="relative">
              <Calendar className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                id="planner-start-date"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full pl-10 pr-3 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-sky-500 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
              End Date ({durationDays} {durationDays === 1 ? 'Day' : 'Days'})
            </label>
            <div className="relative">
              <Calendar className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                id="planner-end-date"
                type="date"
                value={endDate}
                min={startDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full pl-10 pr-3 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-sky-500 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
              Travelers
            </label>
            <div className="relative flex items-center">
              <Users className="w-4 h-4 absolute left-3.5 text-slate-400" />
              <select
                id="planner-travelers-select"
                value={travelersCount}
                onChange={(e) => setTravelersCount(Number(e.target.value))}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-sky-500 outline-none"
              >
                <option value={1}>1 Solo Traveler</option>
                <option value={2}>2 Travelers (Couple/Friends)</option>
                <option value={3}>3 Travelers</option>
                <option value={4}>4 Travelers (Family/Group)</option>
                <option value={6}>6+ Large Group</option>
              </select>
            </div>
          </div>
        </div>

        {/* Budget & Currency Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
              Budget Level
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['Budget', 'Moderate', 'Luxury'] as const).map((b) => (
                <button
                  key={b}
                  type="button"
                  onClick={() => setBudgetLevel(b)}
                  className={`py-2 px-2 text-xs font-bold rounded-xl border text-center transition-all ${
                    budgetLevel === b
                      ? 'bg-emerald-500 text-white border-emerald-500 shadow-sm'
                      : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-slate-400'
                  }`}
                >
                  {b}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
              Currency
            </label>
            <div className="relative">
              <DollarSign className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <select
                id="planner-currency-select"
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-sky-500 outline-none"
              >
                {CURRENCIES.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Travel Style */}
        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
            Travel Style
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {TRAVEL_STYLES.map((style) => {
              const active = travelStyle === style.id;
              return (
                <button
                  key={style.id}
                  type="button"
                  onClick={() => setTravelStyle(style.id)}
                  className={`p-2.5 text-left rounded-xl border transition-all ${
                    active
                      ? 'bg-sky-500/10 border-sky-500 text-sky-900 dark:text-sky-200 ring-2 ring-sky-500/30'
                      : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 hover:border-slate-400 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <p className="text-xs font-bold">{style.label}</p>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">{style.desc}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Interests Selection */}
        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
            Interests & Activities (Select 1 or more)
          </label>
          <div className="flex flex-wrap gap-2">
            {INTEREST_OPTIONS.map((item) => {
              const selected = interests.includes(item.id);
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => toggleInterest(item.id)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium border transition-all ${
                    selected
                      ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 border-slate-900 dark:border-white shadow-xs'
                      : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-slate-400'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                  {selected && <Check className="w-3.5 h-3.5 ml-0.5" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Submit Button */}
        <button
          id="planner-submit-btn"
          type="submit"
          disabled={loading || !destination.trim()}
          className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-sky-500 via-teal-500 to-emerald-500 text-white font-extrabold text-base sm:text-lg shadow-lg shadow-sky-500/25 hover:shadow-sky-500/40 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Generating AI Travel Guide for {destination}...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-6 h-6 animate-bounce" />
              <span>Generate Tourism Guide & Itinerary</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
};
