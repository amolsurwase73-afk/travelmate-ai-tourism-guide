import React, { useState } from 'react';
import {
  Hotel,
  Utensils,
  Bus,
  Ticket,
  ShoppingBag,
  ShieldAlert,
  Calculator,
  Lightbulb,
  Sparkles,
} from 'lucide-react';
import { BudgetBreakdown } from '../types';
import { LiveCurrencyConverter } from './LiveCurrencyConverter';

interface BudgetCalculatorProps {
  budget: BudgetBreakdown;
  initialTravelers: number;
  initialDays: number;
  destinationName?: string;
}

export const BudgetCalculator: React.FC<BudgetCalculatorProps> = ({
  budget,
  initialTravelers,
  initialDays,
  destinationName = 'Destination',
}) => {
  const [days, setDays] = useState(initialDays || 3);
  const [travelers, setTravelers] = useState(initialTravelers || 2);

  // Multiplier relative to original generation
  const baseDays = initialDays > 0 ? initialDays : 3;
  const baseTravelers = initialTravelers > 0 ? initialTravelers : 2;

  const ratioDays = days / baseDays;
  const ratioTravelers = travelers / baseTravelers;

  const calcHotel = Math.round(budget.hotelCost.estimatedTotal * ratioDays * (travelers > 2 ? 1.5 : 1));
  const calcFood = Math.round(budget.foodExpenses.estimatedTotal * ratioDays * ratioTravelers);
  const calcTransport = Math.round(budget.localTransport.estimatedTotal * ratioDays);
  const calcTickets = Math.round(budget.entryTickets.estimatedTotal * ratioTravelers);
  const calcShopping = Math.round(budget.shoppingBudget.estimatedTotal * ratioTravelers);
  const calcEmergency = Math.round(budget.emergencyBudget.estimatedTotal);

  const totalCalculated = calcHotel + calcFood + calcTransport + calcTickets + calcShopping + calcEmergency;

  const symbol = budget.currencySymbol || '$';

  const items = [
    {
      title: 'Hotel & Accommodation',
      icon: <Hotel className="w-5 h-5 text-sky-500" />,
      amount: calcHotel,
      details: budget.hotelCost.details,
    },
    {
      title: 'Food & Meals',
      icon: <Utensils className="w-5 h-5 text-amber-500" />,
      amount: calcFood,
      details: budget.foodExpenses.details,
    },
    {
      title: 'Local Transportation',
      icon: <Bus className="w-5 h-5 text-teal-500" />,
      amount: calcTransport,
      details: budget.localTransport.details,
    },
    {
      title: 'Sightseeing & Entry Tickets',
      icon: <Ticket className="w-5 h-5 text-purple-500" />,
      amount: calcTickets,
      details: budget.entryTickets.details,
    },
    {
      title: 'Shopping & Souvenirs',
      icon: <ShoppingBag className="w-5 h-5 text-rose-500" />,
      amount: calcShopping,
      details: budget.shoppingBudget.details,
    },
    {
      title: 'Emergency Reserve',
      icon: <ShieldAlert className="w-5 h-5 text-emerald-500" />,
      amount: calcEmergency,
      details: budget.emergencyBudget.details,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Total Banner */}
      <div className="bg-gradient-to-br from-slate-900 via-sky-950 to-teal-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-sky-800/50 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <span className="px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 flex items-center gap-1.5 w-fit">
            <Calculator className="w-3.5 h-3.5" /> Interactive Trip Budget Estimator
          </span>
          <h3 className="text-3xl sm:text-4xl font-black mt-2 text-white">
            {symbol}
            {totalCalculated.toLocaleString()} <span className="text-base sm:text-lg font-normal text-sky-200">({budget.currency})</span>
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 font-medium">
            Estimated total cost for {travelers} traveler(s) over {days} day(s).
          </p>
        </div>

        {/* Adjuster controls */}
        <div className="bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-2xl space-y-3 shrink-0">
          <div className="flex items-center justify-between gap-4 text-xs font-bold">
            <span>Trip Duration:</span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setDays(Math.max(1, days - 1))}
                className="w-7 h-7 rounded-lg bg-white/20 hover:bg-white/30 text-white font-black"
              >
                -
              </button>
              <span className="w-12 text-center text-sm">{days} Days</span>
              <button
                onClick={() => setDays(days + 1)}
                className="w-7 h-7 rounded-lg bg-white/20 hover:bg-white/30 text-white font-black"
              >
                +
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between gap-4 text-xs font-bold">
            <span>Travelers:</span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setTravelers(Math.max(1, travelers - 1))}
                className="w-7 h-7 rounded-lg bg-white/20 hover:bg-white/30 text-white font-black"
              >
                -
              </button>
              <span className="w-12 text-center text-sm">{travelers} Person</span>
              <button
                onClick={() => setTravelers(travelers + 1)}
                className="w-7 h-7 rounded-lg bg-white/20 hover:bg-white/30 text-white font-black"
              >
                +
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Breakdown Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((item, idx) => (
          <div
            key={idx}
            className="bg-white dark:bg-slate-800/90 rounded-3xl border border-slate-200/80 dark:border-slate-700/80 p-5 shadow-xs space-y-2 hover:border-sky-400 transition-all"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-700/60">{item.icon}</div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">{item.title}</h4>
              </div>
              <span className="text-base font-extrabold text-slate-900 dark:text-white">
                {symbol}
                {item.amount.toLocaleString()}
              </span>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400 font-normal leading-relaxed pt-1">
              {item.details}
            </p>
          </div>
        ))}
      </div>

      {/* Live Currency Converter Block */}
      <LiveCurrencyConverter
        destinationCurrency={budget.currency}
        destinationCurrencySymbol={budget.currencySymbol}
        destinationName={destinationName}
        tripBudgetTotal={totalCalculated}
      />

      {/* Cost Saving Tips */}
      {budget.costSavingTips && budget.costSavingTips.length > 0 && (
        <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/50 rounded-3xl p-6 space-y-3">
          <div className="flex items-center gap-2 text-amber-800 dark:text-amber-300 font-extrabold text-base">
            <Lightbulb className="w-5 h-5 text-amber-500" />
            <span>Money Saving Tips for this Trip</span>
          </div>

          <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs font-medium text-amber-900 dark:text-amber-200">
            {budget.costSavingTips.map((tip, i) => (
              <li key={i} className="flex items-start gap-2 bg-white/60 dark:bg-amber-900/20 p-2.5 rounded-xl">
                <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
