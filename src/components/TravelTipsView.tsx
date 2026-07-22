import React from 'react';
import {
  ShieldCheck,
  Heart,
  CloudSun,
  AlertTriangle,
  Bus,
} from 'lucide-react';
import { TravelTips } from '../types';

interface TravelTipsViewProps {
  tips: TravelTips;
}

export const TravelTipsView: React.FC<TravelTipsViewProps> = ({ tips }) => {
  return (
    <div className="space-y-6">
      {/* Weather Banner */}
      {tips.weatherAdvice && (
        <div className="bg-gradient-to-r from-sky-500 to-teal-500 text-white rounded-3xl p-6 shadow-md flex items-start gap-4">
          <div className="p-3 bg-white/20 backdrop-blur-md rounded-2xl shrink-0">
            <CloudSun className="w-7 h-7 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-extrabold text-white">Weather & Best Dressing Advice</h3>
            <p className="text-xs sm:text-sm text-sky-100 mt-1 font-medium leading-relaxed">
              {tips.weatherAdvice}
            </p>
          </div>
        </div>
      )}

      {/* Grid of Tip Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Safety Tips */}
        <div className="bg-white dark:bg-slate-800/90 rounded-3xl border border-slate-200/80 dark:border-slate-700/80 p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
            <ShieldCheck className="w-6 h-6" />
            <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">Safety & Security Tips</h3>
          </div>
          <ul className="space-y-2.5">
            {tips.safetyTips.map((tip, i) => (
              <li
                key={i}
                className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700 dark:text-slate-300 font-normal leading-relaxed"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0 mt-2" />
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Local Customs */}
        <div className="bg-white dark:bg-slate-800/90 rounded-3xl border border-slate-200/80 dark:border-slate-700/80 p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 text-rose-500">
            <Heart className="w-6 h-6" />
            <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">Local Customs & Etiquette</h3>
          </div>
          <ul className="space-y-2.5">
            {tips.localCustoms.map((tip, i) => (
              <li
                key={i}
                className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700 dark:text-slate-300 font-normal leading-relaxed"
              >
                <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0 mt-2" />
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Common Scams to Avoid */}
        <div className="bg-white dark:bg-slate-800/90 rounded-3xl border border-slate-200/80 dark:border-slate-700/80 p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 text-amber-500">
            <AlertTriangle className="w-6 h-6" />
            <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">Common Tourist Scams to Avoid</h3>
          </div>
          <ul className="space-y-2.5">
            {tips.commonScamsToAvoid.map((scam, i) => (
              <li
                key={i}
                className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700 dark:text-slate-300 font-normal leading-relaxed p-2.5 bg-amber-50/50 dark:bg-amber-950/20 rounded-xl"
              >
                <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0 mt-2" />
                <span>{scam}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Public Transport */}
        <div className="bg-white dark:bg-slate-800/90 rounded-3xl border border-slate-200/80 dark:border-slate-700/80 p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 text-sky-500">
            <Bus className="w-6 h-6" />
            <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">Public Transport & Mobility</h3>
          </div>
          <ul className="space-y-2.5">
            {tips.publicTransportTips.map((tip, i) => (
              <li
                key={i}
                className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700 dark:text-slate-300 font-normal leading-relaxed"
              >
                <span className="w-2 h-2 rounded-full bg-sky-500 shrink-0 mt-2" />
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
