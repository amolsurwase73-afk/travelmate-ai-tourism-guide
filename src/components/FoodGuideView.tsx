import React, { useState } from 'react';
import { UtensilsCrossed, Store, Sparkles, AlertCircle, Leaf, Cake } from 'lucide-react';
import { FoodGuide } from '../types';

interface FoodGuideViewProps {
  foodGuide: FoodGuide;
}

export const FoodGuideView: React.FC<FoodGuideViewProps> = ({ foodGuide }) => {
  const [activeTab, setActiveTab] = useState<'dishes' | 'restaurants' | 'street' | 'veg' | 'desserts'>('dishes');

  return (
    <div className="space-y-6">
      {/* Sub-navigation tabs */}
      <div className="bg-white dark:bg-slate-800/90 rounded-2xl p-2 border border-slate-200/80 dark:border-slate-700/80 shadow-xs flex items-center gap-1.5 overflow-x-auto scrollbar-none">
        <button
          onClick={() => setActiveTab('dishes')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-extrabold whitespace-nowrap transition-all ${
            activeTab === 'dishes'
              ? 'bg-amber-500 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/60'
          }`}
        >
          <UtensilsCrossed className="w-4 h-4" />
          Famous Dishes ({foodGuide.famousDishes.length})
        </button>

        <button
          onClick={() => setActiveTab('restaurants')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-extrabold whitespace-nowrap transition-all ${
            activeTab === 'restaurants'
              ? 'bg-amber-500 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/60'
          }`}
        >
          <Store className="w-4 h-4" />
          Top Restaurants ({foodGuide.topRestaurants.length})
        </button>

        <button
          onClick={() => setActiveTab('street')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-extrabold whitespace-nowrap transition-all ${
            activeTab === 'street'
              ? 'bg-amber-500 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/60'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          Street Food
        </button>

        <button
          onClick={() => setActiveTab('veg')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-extrabold whitespace-nowrap transition-all ${
            activeTab === 'veg'
              ? 'bg-emerald-500 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/60'
          }`}
        >
          <Leaf className="w-4 h-4" />
          Vegetarian / Vegan
        </button>

        <button
          onClick={() => setActiveTab('desserts')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-extrabold whitespace-nowrap transition-all ${
            activeTab === 'desserts'
              ? 'bg-rose-500 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/60'
          }`}
        >
          <Cake className="w-4 h-4" />
          Must-Try Desserts
        </button>
      </div>

      {/* Tab 1: Famous Dishes */}
      {activeTab === 'dishes' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {foodGuide.famousDishes.map((dish, i) => (
            <div
              key={i}
              className="bg-white dark:bg-slate-800/90 rounded-3xl border border-slate-200/80 dark:border-slate-700/80 p-5 shadow-xs hover:border-amber-400 transition-all space-y-3"
            >
              <div className="flex items-start justify-between gap-2">
                <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">
                  {dish.name}
                </h3>
                <span
                  className={`px-2.5 py-0.5 text-[10px] font-extrabold rounded-full border ${
                    dish.vegOrNonVeg === 'Veg' || dish.vegOrNonVeg === 'Vegan'
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-300'
                      : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 border-rose-300'
                  }`}
                >
                  {dish.vegOrNonVeg}
                </span>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                {dish.description}
              </p>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between text-xs text-slate-600 dark:text-slate-400 font-medium">
                <span>
                  <strong className="text-slate-900 dark:text-white">Where to try:</strong> {dish.whereToTry}
                </span>
                <span className="font-bold text-amber-600 dark:text-amber-400">{dish.priceRange}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 2: Top Restaurants */}
      {activeTab === 'restaurants' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {foodGuide.topRestaurants.map((resto, i) => (
            <div
              key={i}
              className="bg-white dark:bg-slate-800/90 rounded-3xl border border-slate-200/80 dark:border-slate-700/80 p-5 shadow-xs space-y-3 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <span className="px-2.5 py-0.5 text-[10px] font-extrabold rounded-md bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
                    {resto.type}
                  </span>
                  <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                    {resto.priceRange}
                  </span>
                </div>

                <h3 className="text-base font-extrabold text-slate-900 dark:text-white mt-2">
                  {resto.name}
                </h3>
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                  {resto.cuisine} Cuisine
                </p>

                <p className="text-xs text-slate-600 dark:text-slate-300 mt-2">
                  📍 {resto.address}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-700/60 text-xs text-amber-800 dark:text-amber-300">
                <strong>Signature Dish:</strong> {resto.signatureDish}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 3: Street Food Spots */}
      {activeTab === 'street' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {foodGuide.streetFoodSpots.map((spot, i) => (
              <div
                key={i}
                className="bg-white dark:bg-slate-800/90 rounded-3xl border border-slate-200/80 dark:border-slate-700/80 p-5 shadow-xs space-y-2"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                    📍 {spot.spotName}
                  </h3>
                  <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                    {spot.budgetLevel}
                  </span>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300">
                  <strong>Famous For:</strong> {spot.famousFor}
                </p>

                <div className="p-2.5 bg-amber-50 dark:bg-amber-950/40 rounded-xl text-amber-800 dark:text-amber-200 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-500 shrink-0" />
                  <span>
                    <strong>Hygiene Tip:</strong> {spot.hygieneTip}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Vegetarian Options */}
      {activeTab === 'veg' && (
        <div className="bg-white dark:bg-slate-800/90 rounded-3xl border border-slate-200/80 dark:border-slate-700/80 p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
            <Leaf className="w-5 h-5" />
            <h3 className="text-lg font-extrabold">Pure Vegetarian & Vegan Traveler Guide</h3>
          </div>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {foodGuide.vegetarianOptions.map((item, i) => (
              <li
                key={i}
                className="p-3 bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200/60 dark:border-emerald-900/40 rounded-xl text-xs sm:text-sm font-medium text-emerald-900 dark:text-emerald-200 flex items-center gap-2"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Tab 5: Must-Try Desserts */}
      {activeTab === 'desserts' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {foodGuide.desserts.map((d, i) => (
            <div
              key={i}
              className="bg-white dark:bg-slate-800/90 rounded-3xl border border-slate-200/80 dark:border-slate-700/80 p-5 shadow-xs space-y-2"
            >
              <div className="flex items-center gap-2 text-rose-500">
                <Cake className="w-5 h-5" />
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                  {d.name}
                </h3>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 font-normal leading-relaxed">
                {d.description}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
