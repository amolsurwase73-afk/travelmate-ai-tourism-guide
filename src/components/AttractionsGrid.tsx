import React, { useState } from 'react';
import {
  MapPin,
  Clock,
  Ticket,
  Sparkles,
  Search,
  Compass,
  Star,
  ShieldCheck,
  Tag,
} from 'lucide-react';
import { AttractionItem } from '../types';

interface AttractionsGridProps {
  attractions: AttractionItem[];
}

const CATEGORY_FILTERS = [
  { id: 'all', label: 'All 15 Attractions' },
  { id: 'top_attraction', label: 'Top Highlights' },
  { id: 'hidden_gem', label: 'Hidden Gems' },
  { id: 'historical', label: 'Historical' },
  { id: 'adventure', label: 'Adventure' },
  { id: 'family_friendly', label: 'Family Friendly' },
  { id: 'free', label: 'Free Entry' },
];

export const AttractionsGrid: React.FC<AttractionsGridProps> = ({ attractions }) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredAttractions = attractions.filter((item) => {
    const matchesCat = activeCategory === 'all' || item.category === activeCategory;
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.highlights.some((h) => h.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  const getCategoryBadge = (cat: string) => {
    switch (cat) {
      case 'hidden_gem':
        return 'bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300 border-purple-200 dark:border-purple-800';
      case 'historical':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border-amber-200 dark:border-amber-800';
      case 'adventure':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-950 dark:text-orange-300 border-orange-200 dark:border-orange-800';
      case 'family_friendly':
        return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800';
      case 'free':
        return 'bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-300 border-teal-200 dark:border-teal-800';
      default:
        return 'bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300 border-sky-200 dark:border-sky-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Search & Category Filter Bar */}
      <div className="bg-white dark:bg-slate-800/90 rounded-3xl p-5 border border-slate-200/80 dark:border-slate-700/80 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              id="attractions-search-input"
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Filter places or highlights..."
              className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>

          <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 self-end sm:self-auto">
            Showing <span className="font-extrabold text-slate-900 dark:text-white">{filteredAttractions.length}</span> of {attractions.length} Places
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {CATEGORY_FILTERS.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all border shrink-0 ${
                activeCategory === cat.id
                  ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 border-slate-900 dark:border-white shadow-xs'
                  : 'bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-slate-400'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Attractions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredAttractions.map((item, index) => (
          <div
            key={item.id || index}
            className="bg-white dark:bg-slate-800/90 rounded-3xl border border-slate-200/80 dark:border-slate-700/80 p-5 shadow-xs hover:shadow-md hover:border-sky-400 dark:hover:border-sky-500 transition-all flex flex-col justify-between group"
          >
            <div>
              {/* Card Header & Badge */}
              <div className="flex items-start justify-between gap-2 mb-3">
                <span
                  className={`px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider rounded-lg border ${getCategoryBadge(
                    item.category
                  )}`}
                >
                  {item.category.replace('_', ' ')}
                </span>
                <span className="text-xs font-bold text-slate-400 dark:text-slate-500">
                  #{index + 1}
                </span>
              </div>

              <h3 className="text-lg font-extrabold text-slate-900 dark:text-white group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
                {item.name}
              </h3>

              <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 line-clamp-3 font-normal leading-relaxed">
                {item.description}
              </p>

              {/* Hours & Suggested Duration */}
              <div className="mt-4 space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
                <div className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                  <span>
                    <strong className="text-slate-700 dark:text-slate-300">Hours:</strong> {item.openingHours}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Compass className="w-3.5 h-3.5 text-sky-500 shrink-0" />
                  <span>
                    <strong className="text-slate-700 dark:text-slate-300">Duration:</strong> {item.suggestedDuration}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Ticket className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span>
                    <strong className="text-slate-700 dark:text-slate-300">Entry Fee:</strong> {item.entryFee}
                  </span>
                </div>
              </div>

              {/* Highlights tags */}
              {item.highlights && item.highlights.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {item.highlights.map((h, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 text-[10px] font-semibold bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-md"
                    >
                      #{h}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Insider Tip Footer */}
            {item.insiderTip && (
              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-700/60 text-[11px] text-sky-800 dark:text-sky-300 bg-sky-50/50 dark:bg-sky-950/30 p-2.5 rounded-xl flex items-start gap-2">
                <Sparkles className="w-3.5 h-3.5 text-sky-500 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold">Insider Tip: </span>
                  {item.insiderTip}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
