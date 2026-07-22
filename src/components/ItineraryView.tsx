import React, { useState } from 'react';
import {
  Sun,
  Sunset,
  Moon,
  Clock,
  MapPin,
  DollarSign,
  Lightbulb,
  Calendar,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { DayItinerary, DayItinerarySlot } from '../types';

interface ItineraryViewProps {
  itinerary: DayItinerary[];
  currencySymbol: string;
}

export const ItineraryView: React.FC<ItineraryViewProps> = ({ itinerary, currencySymbol }) => {
  const [selectedDay, setSelectedDay] = useState<number>(1);
  const [expandedSlots, setExpandedSlots] = useState<Record<string, boolean>>({});

  const currentDayData = itinerary.find((d) => d.dayNumber === selectedDay) || itinerary[0];

  const toggleSlot = (key: string) => {
    setExpandedSlots((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const renderSlotCard = (
    title: string,
    slot: DayItinerarySlot,
    icon: React.ReactNode,
    timeColor: string,
    slotKey: string
  ) => {
    if (!slot) return null;
    const isExpanded = expandedSlots[slotKey] ?? true;

    return (
      <div className="bg-white dark:bg-slate-800/90 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 p-5 shadow-xs transition-all hover:border-sky-400 dark:hover:border-sky-500">
        <div className="flex items-center justify-between cursor-pointer" onClick={() => toggleSlot(slotKey)}>
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-xl ${timeColor} text-white shadow-xs`}>{icon}</div>
            <div>
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                {title} • {slot.time}
              </span>
              <h4 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mt-0.5">
                {slot.title}
              </h4>
            </div>
          </div>
          <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
            {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </button>
        </div>

        {isExpanded && (
          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-700/60 space-y-3">
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
              {slot.description}
            </p>

            <div className="flex flex-wrap items-center gap-3 text-xs font-medium text-slate-600 dark:text-slate-400">
              <span className="flex items-center gap-1 bg-slate-100 dark:bg-slate-700/60 px-2.5 py-1 rounded-lg">
                <MapPin className="w-3.5 h-3.5 text-sky-500" />
                {slot.location}
              </span>

              <span className="flex items-center gap-1 bg-slate-100 dark:bg-slate-700/60 px-2.5 py-1 rounded-lg">
                <Clock className="w-3.5 h-3.5 text-amber-500" />
                Duration: {slot.duration}
              </span>

              <span className="flex items-center gap-1 bg-slate-100 dark:bg-slate-700/60 px-2.5 py-1 rounded-lg text-emerald-600 dark:text-emerald-400 font-bold">
                <DollarSign className="w-3.5 h-3.5" />
                Est. {slot.estimatedCost}
              </span>
            </div>

            {slot.tip && (
              <div className="flex items-start gap-2 p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-200/60 dark:border-amber-900/40 rounded-xl text-amber-800 dark:text-amber-200 text-xs">
                <Lightbulb className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold">Pro Tip: </span>
                  {slot.tip}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Day Selector Buttons */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {itinerary.map((day) => {
          const isActive = day.dayNumber === selectedDay;
          return (
            <button
              key={day.dayNumber}
              onClick={() => setSelectedDay(day.dayNumber)}
              className={`px-5 py-3 rounded-2xl font-extrabold text-xs sm:text-sm whitespace-nowrap transition-all border shrink-0 flex items-center gap-2 ${
                isActive
                  ? 'bg-sky-500 text-white border-sky-500 shadow-md shadow-sky-500/20'
                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-sky-400'
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span>Day {day.dayNumber}</span>
            </button>
          );
        })}
      </div>

      {/* Selected Day Content */}
      {currentDayData && (
        <div className="bg-slate-50 dark:bg-slate-900/60 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-sky-600 dark:text-sky-400">
                Schedule • Day {currentDayData.dayNumber}
              </span>
              <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white mt-0.5">
                {currentDayData.title}
              </h3>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800">
              4 Time Blocks
            </span>
          </div>

          <div className="space-y-4">
            {renderSlotCard(
              'Morning',
              currentDayData.morning,
              <Sun className="w-5 h-5" />,
              'bg-gradient-to-r from-amber-500 to-orange-500',
              `day${currentDayData.dayNumber}-morning`
            )}

            {renderSlotCard(
              'Afternoon',
              currentDayData.afternoon,
              <Sun className="w-5 h-5" />,
              'bg-gradient-to-r from-sky-500 to-teal-500',
              `day${currentDayData.dayNumber}-afternoon`
            )}

            {renderSlotCard(
              'Evening',
              currentDayData.evening,
              <Sunset className="w-5 h-5" />,
              'bg-gradient-to-r from-indigo-500 to-purple-500',
              `day${currentDayData.dayNumber}-evening`
            )}

            {currentDayData.night &&
              renderSlotCard(
                'Night',
                currentDayData.night,
                <Moon className="w-5 h-5" />,
                'bg-gradient-to-r from-slate-700 to-slate-900',
                `day${currentDayData.dayNumber}-night`
              )}
          </div>
        </div>
      )}
    </div>
  );
};
