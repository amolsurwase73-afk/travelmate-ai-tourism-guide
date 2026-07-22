import React, { useState } from 'react';
import {
  Bus,
  Train,
  Car,
  Bike,
  Plane,
  CreditCard,
  Clock,
  DollarSign,
  AlertTriangle,
  CheckCircle2,
  Navigation,
  Sparkles,
  MapPin,
  ExternalLink,
  Shield,
  Compass,
  ArrowRight,
  Info,
} from 'lucide-react';
import { AttractionItem } from '../types';

interface LocalTransportSuggestionsProps {
  destination: string;
  currencySymbol?: string;
  publicTransportTips?: string[];
  attractions?: AttractionItem[];
}

export interface TransportModeOption {
  id: string;
  title: string;
  category: 'metro' | 'ridehail' | 'bus' | 'airport' | 'bike';
  icon: React.FC<{ className?: string }>;
  appsOrServices: string[];
  avgCost: string;
  speedAndReliability: string;
  paymentMethod: string;
  bestFor: string;
  insiderTip: string;
  warnings?: string;
}

// Preset transport profiles for popular world destinations or smart fallback
function getTransportModesForDestination(destination: string, currencySymbol: string = '$'): TransportModeOption[] {
  const destLower = destination.toLowerCase();

  // Tokyo / Japan
  if (destLower.includes('tokyo') || destLower.includes('japan') || destLower.includes('kyoto') || destLower.includes('osaka')) {
    return [
      {
        id: 'tm-metro',
        title: 'Tokyo Metro & JR Lines',
        category: 'metro',
        icon: Train,
        appsOrServices: ['Suica / Pasmo Card', 'Japan Travel by NAVITIME', 'Google Maps Transit'],
        avgCost: `${currencySymbol}1.50 - ${currencySymbol}3.50 per trip`,
        speedAndReliability: 'Ultra Fast & 99.9% Punctual',
        paymentMethod: 'IC Cards (Suica / Pasmo) or Apple Wallet',
        bestFor: 'Navigating anywhere across the city quickly',
        insiderTip: 'Tap your digital Suica card directly on iPhone/Android at turnstiles for seamless transfers without standing in ticket lines.',
        warnings: 'Trains stop operating around midnight (12:00 AM - 12:30 AM). Plan your night out accordingly!',
      },
      {
        id: 'tm-airport',
        title: 'Narita / Haneda Airport Express Trains',
        category: 'airport',
        icon: Plane,
        appsOrServices: ['Keisei Skyliner', 'JR Narita Express (NEX)', 'Tokyo Monorail'],
        avgCost: `${currencySymbol}15 - ${currencySymbol}25 one-way`,
        speedAndReliability: 'Fastest connection (36 - 50 mins)',
        paymentMethod: 'Credit Card, Ticket Counters, or Online Booking',
        bestFor: 'Airport to Tokyo Station / Shinjuku / Ueno',
        insiderTip: 'Book the Keisei Skyliner ticket online in advance to save up to 15% on return transfers.',
      },
      {
        id: 'tm-ridehail',
        title: 'Taxis & Ride-Hailing Apps',
        category: 'ridehail',
        icon: Car,
        appsOrServices: ['GO App', 'Uber Tokyo', 'S.RIDE'],
        avgCost: `${currencySymbol}10 base fare + ${currencySymbol}3/km (Premium price)`,
        speedAndReliability: 'Highly reliable, luxury vehicles',
        paymentMethod: 'In-app Credit Card or Cash',
        bestFor: 'Late night travel after metro shutdown or with heavy luggage',
        insiderTip: 'Automatic rear doors open by themselves—do not attempt to manually open taxi doors.',
      },
      {
        id: 'tm-bike',
        title: 'City Bikeshare & E-Scooters',
        category: 'bike',
        icon: Bike,
        appsOrServices: ['Docomo Bike Share', 'LUUP E-Scooters'],
        avgCost: `${currencySymbol}1.20 per 30 minutes`,
        speedAndReliability: 'Great for short neighborhood explorations',
        paymentMethod: 'Smartphone App & Credit Card',
        bestFor: 'Exploring quiet backstreets of Yanaka, Shibuya, or Asakusa',
        insiderTip: 'Always park only inside designated LUUP/Docomo parking ports to avoid fines.',
      },
    ];
  }

  // London / UK
  if (destLower.includes('london') || destLower.includes('uk') || destLower.includes('england')) {
    return [
      {
        id: 'tm-tube',
        title: 'London Underground (The Tube) & Elizabeth Line',
        category: 'metro',
        icon: Train,
        appsOrServices: ['TfL GO', 'Citymapper', 'Contactless Pay'],
        avgCost: `${currencySymbol}2.80 - ${currencySymbol}4.50 (Daily fare capped automatically)`,
        speedAndReliability: 'Frequent & High Capacity',
        paymentMethod: 'Contactless Visa/Mastercard or Oyster Card',
        bestFor: 'Hopping between central sights (Zone 1 - 2)',
        insiderTip: 'Always tap the EXACT same contactless card or phone when touching in and touching out to ensure daily fare caps apply.',
        warnings: 'Stand on the right side of escalators; walk on the left.',
      },
      {
        id: 'tm-bus',
        title: 'Iconic Double-Decker Red Buses',
        category: 'bus',
        icon: Bus,
        appsOrServices: ['Transport for London (TfL)'],
        avgCost: `${currencySymbol}1.75 flat fare (Includes unlimited transfers within 1 hour)`,
        speedAndReliability: 'Scenic, moderate speed depending on traffic',
        paymentMethod: 'Contactless Pay only (Cash NOT accepted)',
        bestFor: 'Scenic street-level sightseeing from the top deck',
        insiderTip: 'Bus fares feature the "Hopper Fare"—change as many buses as you like within 60 minutes for a single £1.75 fee.',
      },
      {
        id: 'tm-airport',
        title: 'Heathrow / Gatwick Airport Express',
        category: 'airport',
        icon: Plane,
        appsOrServices: ['Heathrow Express', 'Elizabeth Line', 'Gatwick Express'],
        avgCost: `${currencySymbol}15 - ${currencySymbol}25`,
        speedAndReliability: '15 mins non-stop from Paddington',
        paymentMethod: 'Online or Contactless',
        bestFor: 'Rapid airport connection',
        insiderTip: 'The Elizabeth Line is almost as fast as Heathrow Express but costs less than half the price.',
      },
    ];
  }

  // Paris / France
  if (destLower.includes('paris') || destLower.includes('france')) {
    return [
      {
        id: 'tm-paris-metro',
        title: 'Paris Métro & RER Trains',
        category: 'metro',
        icon: Train,
        appsOrServices: ['IDF Mobilités', 'Bonjour RATP', 'Citymapper'],
        avgCost: `${currencySymbol}2.15 per single ticket (Ticket t+)`,
        speedAndReliability: 'Extensive station coverage across every district',
        paymentMethod: 'Navigo Easy Pass, Apple Pay, or Paper t+ tickets',
        bestFor: 'Traveling across arrondissements quickly',
        insiderTip: 'Keep your validated ticket until you exit the station—ticket inspectors check frequently near exits.',
        warnings: 'Mind your belongings around major hub stations like Châtelet and Gare du Nord.',
      },
      {
        id: 'tm-paris-ride',
        title: 'Ride-Hailing & Taxis',
        category: 'ridehail',
        icon: Car,
        appsOrServices: ['Uber Paris', 'Bolt', 'G7 Taxi'],
        avgCost: `${currencySymbol}10 - ${currencySymbol}25 central trip`,
        speedAndReliability: 'Comfortable, regulated fixed rates from airports',
        paymentMethod: 'In-app payment',
        bestFor: 'Night travel or trips with heavy luggage',
        insiderTip: 'Official G7 taxis have fixed fare rates between CDG airport and Paris city center.',
      },
      {
        id: 'tm-paris-bike',
        title: 'Vélib\' Métropole Bikes',
        category: 'bike',
        icon: Bike,
        appsOrServices: ['Vélib\' App', 'Lime', 'Dott'],
        avgCost: `${currencySymbol}3 per single ride or ${currencySymbol}5 day-pass`,
        speedAndReliability: 'Excellent dedicated bike lane networks (Coronapistes)',
        paymentMethod: 'App & Credit Card',
        bestFor: 'Riding along the Seine river and grand boulevards',
        insiderTip: 'Green bikes are mechanical; blue bikes are electric-assisted.',
      },
    ];
  }

  // Universal Default Profile for any destination
  return [
    {
      id: 'tm-public',
      title: `${destination} Metro & Public Bus Network`,
      category: 'metro',
      icon: Train,
      appsOrServices: ['Google Maps Transit', 'Moovit App', 'Local Transit Card'],
      avgCost: `${currencySymbol}1.50 - ${currencySymbol}4.00 per ride`,
      speedAndReliability: 'High frequency during peak hours',
      paymentMethod: 'Transit Smart Card, Contactless Card, or Cash',
      bestFor: 'Affordable daily sightseeing between city attractions',
      insiderTip: 'Purchase a 24-hour or 3-day unlimited tourist transit pass to save over 40% on individual ride tickets.',
      warnings: 'Validate your ticket at the electronic stamping boxes before boarding to avoid spot fines.',
    },
    {
      id: 'tm-hail',
      title: 'Ride-Hailing & Official Taxis',
      category: 'ridehail',
      icon: Car,
      appsOrServices: ['Uber', 'Grab', 'Bolt', 'Local Taxi App'],
      avgCost: `${currencySymbol}8 - ${currencySymbol}20 typical trip`,
      speedAndReliability: 'Door-to-door convenience',
      paymentMethod: 'In-App Credit Card or Metered Cash',
      bestFor: 'Late night returns, group travel, or direct hotel drops',
      insiderTip: 'Always check that the driver starts the electronic meter before setting off, or rely on upfront fixed in-app pricing.',
    },
    {
      id: 'tm-airport-transfer',
      title: 'Airport Transfer Shuttles & Express Trains',
      category: 'airport',
      icon: Plane,
      appsOrServices: ['Airport Express Rail', 'Official Airport Bus Shuttle'],
      avgCost: `${currencySymbol}10 - ${currencySymbol}20 one-way`,
      speedAndReliability: 'Direct connection avoiding city traffic jams',
      paymentMethod: 'Credit Card or Kiosk Ticket',
      bestFor: 'Seamless travel from the arrival terminal to downtown hotels',
      insiderTip: 'Look for official airport transport information desks inside the arrival hall to avoid unmetered street solicitors.',
    },
    {
      id: 'tm-micro',
      title: 'Bicycles & Micro-Mobility Rentals',
      category: 'bike',
      icon: Bike,
      appsOrServices: ['Lime', 'Bird', 'City Bike Share'],
      avgCost: `${currencySymbol}2 - ${currencySymbol}5 per 15 mins`,
      speedAndReliability: 'Agile for short scenic routes',
      paymentMethod: 'Smartphone App',
      bestFor: 'Exploring parks, waterfront promenades, and pedestrian zones',
      insiderTip: 'Wear a helmet where required and stick to marked cycle lanes for safety.',
    },
  ];
}

export const LocalTransportSuggestions: React.FC<LocalTransportSuggestionsProps> = ({
  destination,
  currencySymbol = '$',
  publicTransportTips = [],
  attractions = [],
}) => {
  const options = getTransportModesForDestination(destination, currencySymbol);

  // Fare route calculator state
  const [startPoint, setStartPoint] = useState<string>('City Center / Hotel Zone');
  const [endPoint, setEndPoint] = useState<string>(attractions[0]?.name || 'Top Attraction');
  const [selectedTransport, setSelectedTransport] = useState<string>('metro');

  // Calculate dummy transit estimation
  const estimateTransit = () => {
    let modeLabel = 'Metro / Public Train';
    let duration = '15 - 25 mins';
    let cost = `${currencySymbol}2.50`;
    let proTip = 'Fastest route bypassing road traffic congestion.';

    if (selectedTransport === 'ridehail') {
      modeLabel = 'Ride-Hailing / Taxi';
      duration = '12 - 20 mins';
      cost = `${currencySymbol}12 - ${currencySymbol}18`;
      proTip = 'Door-to-door convenience with air conditioning and luggage space.';
    } else if (selectedTransport === 'bus') {
      modeLabel = 'Public Bus / Tram';
      duration = '25 - 35 mins';
      cost = `${currencySymbol}1.80`;
      proTip = 'Scenic route with street-level views of historic neighborhoods.';
    } else if (selectedTransport === 'bike') {
      modeLabel = 'E-Bike / Bicycle';
      duration = '18 - 25 mins';
      cost = `${currencySymbol}3.00`;
      proTip = 'Eco-friendly and fun through dedicated cycle lanes.';
    }

    return { modeLabel, duration, cost, proTip };
  };

  const transitEstimate = estimateTransit();

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 sm:p-8 space-y-8 shadow-xl">
      {/* Header */}
      <div className="border-b border-slate-200 dark:border-slate-800 pb-5">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-300/30 text-xs font-black uppercase tracking-wider mb-2">
          <Bus className="w-3.5 h-3.5 text-sky-500" />
          <span>Getting Around Like a Local</span>
        </div>
        <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white flex items-center gap-2">
          Local Transport & Transit Guide
        </h3>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
          Everything you need to navigate <strong className="text-slate-900 dark:text-white">{destination}</strong> efficiently, affordably, and safely.
        </p>
      </div>

      {/* Transit Modes Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {options.map((option) => {
          const CategoryIcon = option.icon;
          return (
            <div
              key={option.id}
              className="bg-slate-50 dark:bg-slate-950/60 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 space-y-4 hover:border-sky-400/50 transition-all shadow-xs flex flex-col justify-between"
            >
              <div className="space-y-3">
                {/* Title & Category Badge */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-sky-500/15 text-sky-500 dark:text-sky-400 rounded-xl border border-sky-400/30">
                      <CategoryIcon className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-extrabold text-slate-900 dark:text-white text-base">
                        {option.title}
                      </h4>
                      <p className="text-[11px] font-bold text-sky-600 dark:text-sky-400 uppercase tracking-wider">
                        {option.category.toUpperCase()} MODE
                      </p>
                    </div>
                  </div>
                </div>

                {/* Details Pills */}
                <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                  <div className="p-2.5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 space-y-0.5">
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 uppercase font-black tracking-wider flex items-center gap-1">
                      <DollarSign className="w-3 h-3 text-emerald-500" /> Avg Cost
                    </span>
                    <span className="font-extrabold text-slate-800 dark:text-slate-200 block text-xs">
                      {option.avgCost}
                    </span>
                  </div>

                  <div className="p-2.5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 space-y-0.5">
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 uppercase font-black tracking-wider flex items-center gap-1">
                      <CreditCard className="w-3 h-3 text-sky-500" /> Payment
                    </span>
                    <span className="font-bold text-slate-800 dark:text-slate-200 block text-[11px] truncate" title={option.paymentMethod}>
                      {option.paymentMethod}
                    </span>
                  </div>
                </div>

                {/* Best For */}
                <div className="text-xs text-slate-600 dark:text-slate-300 space-y-1">
                  <span className="font-extrabold text-slate-900 dark:text-white block">Best For:</span>
                  <p className="leading-relaxed text-[11px]">{option.bestFor}</p>
                </div>

                {/* Apps / Services Tags */}
                <div className="pt-1">
                  <span className="text-[10px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-1.5">
                    Recommended Apps & Services:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {option.appsOrServices.map((app) => (
                      <span
                        key={app}
                        className="px-2.5 py-1 bg-sky-500/10 text-sky-700 dark:text-sky-300 border border-sky-300/30 rounded-lg text-[11px] font-bold inline-flex items-center gap-1"
                      >
                        <Navigation className="w-3 h-3 text-sky-500" />
                        {app}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Pro Tip & Warning Footer */}
              <div className="pt-3 border-t border-slate-200 dark:border-slate-800 space-y-2 text-xs">
                <div className="p-2.5 bg-amber-500/10 dark:bg-amber-950/30 border border-amber-400/30 rounded-xl flex items-start gap-2 text-amber-800 dark:text-amber-300 text-[11px] leading-relaxed">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                  <span><strong>Insider Tip:</strong> {option.insiderTip}</span>
                </div>

                {option.warnings && (
                  <div className="p-2.5 bg-rose-500/10 dark:bg-rose-950/30 border border-rose-400/30 rounded-xl flex items-start gap-2 text-rose-800 dark:text-rose-300 text-[11px] leading-relaxed">
                    <AlertTriangle className="w-3.5 h-3.5 text-rose-500 shrink-0 mt-0.5" />
                    <span><strong>Heads Up:</strong> {option.warnings}</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Interactive Transit Fare & Duration Estimator */}
      <div className="bg-gradient-to-br from-slate-900 to-sky-950 p-6 sm:p-7 rounded-2xl text-white space-y-5 border border-sky-500/30 shadow-2xl">
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-sky-500/20 text-sky-400 rounded-xl border border-sky-400/30">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-extrabold text-base sm:text-lg text-white">
                Interactive Route & Fare Estimator
              </h4>
              <p className="text-xs text-sky-200">
                Estimate travel duration and cost between locations in {destination}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-[11px] font-extrabold uppercase text-sky-200 mb-1">From</label>
            <input
              type="text"
              value={startPoint}
              onChange={(e) => setStartPoint(e.target.value)}
              className="w-full px-3 py-2 bg-slate-800/90 border border-slate-700 rounded-xl text-xs font-bold text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>

          <div>
            <label className="block text-[11px] font-extrabold uppercase text-sky-200 mb-1">To Destination</label>
            <select
              value={endPoint}
              onChange={(e) => setEndPoint(e.target.value)}
              className="w-full px-3 py-2 bg-slate-800/90 border border-slate-700 rounded-xl text-xs font-bold text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
            >
              {attractions.length > 0 ? (
                attractions.map((att) => (
                  <option key={att.name} value={att.name}>
                    {att.name}
                  </option>
                ))
              ) : (
                <option value="Top Attraction">Top City Attraction</option>
              )}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-extrabold uppercase text-sky-200 mb-1">Travel Mode</label>
            <select
              value={selectedTransport}
              onChange={(e) => setSelectedTransport(e.target.value)}
              className="w-full px-3 py-2 bg-slate-800/90 border border-slate-700 rounded-xl text-xs font-bold text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
            >
              <option value="metro">🚆 Metro / Train</option>
              <option value="ridehail">🚕 Ride-Hail / Taxi</option>
              <option value="bus">🚌 Public Bus</option>
              <option value="bike">🚲 E-Bike / Scooter</option>
            </select>
          </div>
        </div>

        {/* Estimation Output Result Box */}
        <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/15 grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-400/20 text-amber-300 rounded-lg">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-300 block">Est. Duration</span>
              <span className="text-sm font-black text-amber-300">{transitEstimate.duration}</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-400/20 text-emerald-300 rounded-lg">
              <DollarSign className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-300 block">Estimated Fare</span>
              <span className="text-sm font-black text-emerald-300">{transitEstimate.cost}</span>
            </div>
          </div>

          <div className="text-xs text-sky-200 font-medium border-t sm:border-t-0 sm:border-l border-white/15 sm:pl-4 pt-2 sm:pt-0">
            <span className="font-bold text-white block mb-0.5">Route Recommendation:</span>
            <span>{transitEstimate.proTip}</span>
          </div>
        </div>
      </div>

      {/* Local Transport Tips List */}
      {publicTransportTips && publicTransportTips.length > 0 && (
        <div className="bg-slate-50 dark:bg-slate-950/60 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 space-y-3">
          <h4 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            Destination Transit Guidelines for {destination}
          </h4>

          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            {publicTransportTips.map((tip, idx) => (
              <li
                key={idx}
                className="p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-700 dark:text-slate-300 font-medium flex items-start gap-2 leading-relaxed"
              >
                <span className="w-5 h-5 rounded-full bg-sky-500/10 text-sky-500 font-black text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
