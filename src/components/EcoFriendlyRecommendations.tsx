import React, { useState } from 'react';
import {
  Leaf,
  Trees,
  Footprints,
  Recycle,
  ShoppingBag,
  Car,
  Home,
  CheckCircle2,
  Sparkles,
  Award,
  Globe,
  Compass,
  Zap,
  Coffee,
  Heart,
  Droplets,
  ShieldCheck,
  CheckSquare,
  Square,
  RefreshCw,
  ExternalLink,
} from 'lucide-react';

interface EcoFriendlyRecommendationsProps {
  destination: string;
  durationDays?: number;
  travelersCount?: number;
}

interface EcoTipCategory {
  id: string;
  title: string;
  icon: React.FC<{ className?: string }>;
  color: string;
  badge: string;
  recommendations: {
    title: string;
    description: string;
    impact: 'High Impact' | 'Medium Impact' | 'Local Benefit';
  }[];
}

function getDestinationEcoScore(destination: string): { score: number; label: string; highlights: string[] } {
  const destLower = destination.toLowerCase();

  if (destLower.includes('kyoto') || destLower.includes('japan') || destLower.includes('tokyo')) {
    return {
      score: 92,
      label: 'World Leader in Eco Transit & Waste Sorting',
      highlights: ['99% Railway Electric Coverage', 'Meticulous 4-Way Recycling', 'Tap-Water Drinking Purity'],
    };
  }

  if (destLower.includes('costa rica') || destLower.includes('bali') || destLower.includes('iceland') || destLower.includes('switzerland')) {
    return {
      score: 96,
      label: 'Eco-Tourism & Renewable Energy Pioneer',
      highlights: ['100% Geothermal/Hydro Power', 'Protected Cloud Forest Reserves', 'Organic Farm-to-Table Focus'],
    };
  }

  return {
    score: 85,
    label: 'High Potential for Sustainable Travel',
    highlights: ['Public Transit Options Available', 'Local Artisans & Markets', 'Protected Nature Parks'],
  };
}

export const EcoFriendlyRecommendations: React.FC<EcoFriendlyRecommendationsProps> = ({
  destination,
  durationDays = 5,
  travelersCount = 2,
}) => {
  const ecoMetrics = getDestinationEcoScore(destination);

  // Carbon calculator state
  const [transportMode, setTransportMode] = useState<'flight' | 'train' | 'ev'>('flight');
  const [offsetTrees, setOffsetTrees] = useState<number>(Math.ceil(durationDays * travelersCount * 1.5));

  // Interactive Eco Commitments
  const [commitments, setCommitments] = useState<Record<string, boolean>>({
    reusable_bottle: true,
    public_transit: true,
    towel_reuse: true,
    plant_meal: false,
    local_artisan: true,
    no_plastic: true,
  });

  const toggleCommitment = (key: string) => {
    setCommitments((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const completedCommitments = Object.values(commitments).filter(Boolean).length;
  const totalCommitments = Object.keys(commitments).length;

  const ecoCategories: EcoTipCategory[] = [
    {
      id: 'lodging',
      title: 'Green Stays & Sustainable Lodging',
      icon: Home,
      color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300/30',
      badge: 'STAY GREEN',
      recommendations: [
        {
          title: 'Choose GSTC or Green Key Certified Hotels',
          description: `Look for eco-certified hotels in ${destination} that utilize solar energy, rainwater harvesting, and eco-friendly toiletries.`,
          impact: 'High Impact',
        },
        {
          title: 'Opt into Linen & Towel Reuse Programs',
          description: 'Decline daily bed sheet and towel changes to save up to 400 liters of water per 3-night stay.',
          impact: 'Medium Impact',
        },
        {
          title: 'Support Locally-Owned Homestays & Guesthouses',
          description: 'Directly support local host families, keeping 80%+ of tourist revenue in the destination community.',
          impact: 'Local Benefit',
        },
      ],
    },
    {
      id: 'transit',
      title: 'Low-Carbon & Active Transportation',
      icon: Car,
      color: 'text-sky-500 bg-sky-50 dark:bg-sky-950/40 border-sky-300/30',
      badge: 'CLEAN MOBILITY',
      recommendations: [
        {
          title: 'Prioritize Trains & Electric Public Buses',
          description: `Taking public transit in ${destination} reduces your carbon footprint by up to 75% compared to private car hires.`,
          impact: 'High Impact',
        },
        {
          title: 'Join Guided Walking or E-Bike Tours',
          description: 'Explore historic alleys and neighborhood markets on foot or bicycle with zero carbon emissions.',
          impact: 'High Impact',
        },
        {
          title: 'Consolidate Sightseeing Into Geographic Clusters',
          description: 'Group attractions by neighborhood to minimize crisscrossing the city with unnecessary motorized transport.',
          impact: 'Medium Impact',
        },
      ],
    },
    {
      id: 'dining',
      title: 'Farm-to-Table & Zero-Waste Dining',
      icon: Coffee,
      color: 'text-amber-500 bg-amber-50 dark:bg-amber-950/40 border-amber-300/30',
      badge: 'ECO EATS',
      recommendations: [
        {
          title: 'Eat at Local Farm-to-Table Restaurants',
          description: `Enjoy fresh seasonal ingredients sourced directly from farms within 50km of ${destination}.`,
          impact: 'Local Benefit',
        },
        {
          title: 'Try 1+ Plant-Based Meal Per Day',
          description: 'Plant-based meals generate up to 60% fewer greenhouse emissions than red meat heavy dishes.',
          impact: 'High Impact',
        },
        {
          title: 'Carry a Lightweight Reusable Water Bottle',
          description: `Avoid buying single-use plastic bottles. Refill at hotel filter stations or certified clean tap spots in ${destination}.`,
          impact: 'High Impact',
        },
      ],
    },
    {
      id: 'wildlife',
      title: 'Leave No Trace & Wildlife Respect',
      icon: Trees,
      color: 'text-teal-500 bg-teal-50 dark:bg-teal-950/40 border-teal-300/30',
      badge: 'NATURE RESPECT',
      recommendations: [
        {
          title: 'Support Ethical Wildlife Sanctuaries Only',
          description: 'Avoid attractions offering animal rides, performance shows, or unnatural photo ops with chained wildlife.',
          impact: 'High Impact',
        },
        {
          title: 'Use Coral-Safe Reef-Friendly Sunscreen',
          description: 'When visiting beaches or rivers, use non-nano zinc oxide sunscreen that does not damage delicate marine ecosystems.',
          impact: 'High Impact',
        },
        {
          title: 'Pack Out All Trash on Nature Hikes',
          description: 'Follow Leave-No-Trace principles: stay on marked trails, do not pick wildflowers, and leave nature intact.',
          impact: 'Medium Impact',
        },
      ],
    },
  ];

  // Calculate CO2 estimate
  const estKgCO2 =
    transportMode === 'flight'
      ? durationDays * travelersCount * 140
      : transportMode === 'train'
      ? durationDays * travelersCount * 25
      : durationDays * travelersCount * 45;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 sm:p-8 space-y-8 shadow-xl">
      {/* Header */}
      <div className="border-b border-slate-200 dark:border-slate-800 pb-5">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-300/30 text-xs font-black uppercase tracking-wider mb-2">
          <Leaf className="w-3.5 h-3.5 text-emerald-500" />
          <span>Sustainable & Responsible Travel</span>
        </div>
        <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white flex items-center gap-2">
          Eco-Friendly Travel Recommendations
        </h3>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
          How to explore <strong className="text-slate-900 dark:text-white">{destination}</strong> while minimizing environmental impact and supporting local communities.
        </p>
      </div>

      {/* Destination Eco Index Card */}
      <div className="bg-gradient-to-br from-emerald-950 via-slate-900 to-teal-950 text-white p-6 rounded-2xl border border-emerald-500/30 shadow-2xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-emerald-500/20 text-emerald-400 rounded-2xl border border-emerald-400/30">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-extrabold text-emerald-300 tracking-wider block">
                Destination Sustainability Index
              </span>
              <h4 className="text-lg font-black text-white">{destination} Green Score</h4>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-emerald-500/20 px-4 py-2 rounded-2xl border border-emerald-400/30 self-start sm:self-auto">
            <span className="text-2xl sm:text-3xl font-black text-emerald-300">{ecoMetrics.score}</span>
            <span className="text-xs text-emerald-200 font-bold">/ 100</span>
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-xs text-emerald-200 font-bold flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{ecoMetrics.label}</span>
          </p>

          <div className="flex flex-wrap gap-2 pt-1">
            {ecoMetrics.highlights.map((item) => (
              <span
                key={item}
                className="px-2.5 py-1 bg-white/10 text-emerald-200 text-[11px] font-extrabold rounded-lg border border-white/10 flex items-center gap-1"
              >
                <ShieldCheck className="w-3 h-3 text-emerald-400" />
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Interactive Carbon Footprint & Offset Estimator */}
      <div className="bg-slate-50 dark:bg-slate-950/60 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-sky-500/10 text-sky-500 rounded-xl">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-extrabold text-slate-900 dark:text-white text-sm sm:text-base">
                Trip Carbon Footprint Estimator
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Estimated emissions for {travelersCount} travelers over {durationDays} days in {destination}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button
            onClick={() => setTransportMode('flight')}
            className={`p-3 rounded-xl border text-xs font-extrabold flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
              transportMode === 'flight'
                ? 'bg-sky-500 text-white border-sky-500 shadow-md'
                : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-800'
            }`}
          >
            <span>✈️ Flight + Public Transit</span>
            <span className="text-[10px] opacity-80">~140 kg CO2 / day</span>
          </button>

          <button
            onClick={() => setTransportMode('train')}
            className={`p-3 rounded-xl border text-xs font-extrabold flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
              transportMode === 'train'
                ? 'bg-emerald-500 text-white border-emerald-500 shadow-md'
                : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-800'
            }`}
          >
            <span>🚆 Rail / High-Speed Train</span>
            <span className="text-[10px] opacity-80">~25 kg CO2 / day (82% Less!)</span>
          </button>

          <button
            onClick={() => setTransportMode('ev')}
            className={`p-3 rounded-xl border text-xs font-extrabold flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
              transportMode === 'ev'
                ? 'bg-teal-500 text-white border-teal-500 shadow-md'
                : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-800'
            }`}
          >
            <span>🚘 Electric Vehicle / Hybrid</span>
            <span className="text-[10px] opacity-80">~45 kg CO2 / day</span>
          </button>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-0.5 text-center sm:text-left">
            <span className="text-[10px] font-extrabold uppercase text-slate-400 dark:text-slate-500 tracking-wider">
              Total Trip Carbon Footprint
            </span>
            <div className="text-xl font-black text-slate-900 dark:text-white flex items-center justify-center sm:justify-start gap-1">
              <span className="text-emerald-500">{estKgCO2} kg CO2e</span>
            </div>
          </div>

          <div className="text-xs text-slate-600 dark:text-slate-300 font-medium space-y-1 text-center sm:text-right">
            <span className="font-extrabold text-slate-900 dark:text-white block">
              Offset Recommendation:
            </span>
            <span className="text-emerald-600 dark:text-emerald-400 font-bold block">
              🌳 Plant ~{Math.ceil(estKgCO2 / 20)} Native Trees or Support Verified Reforestation
            </span>
          </div>
        </div>
      </div>

      {/* Main Recommendations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {ecoCategories.map((cat) => {
          const CategoryIcon = cat.icon;
          return (
            <div
              key={cat.id}
              className="bg-slate-50 dark:bg-slate-950/60 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 space-y-4 shadow-xs"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className={`p-2 rounded-xl border ${cat.color}`}>
                    <CategoryIcon className="w-5 h-5" />
                  </div>
                  <h4 className="font-black text-slate-900 dark:text-white text-base">
                    {cat.title}
                  </h4>
                </div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-300/30">
                  {cat.badge}
                </span>
              </div>

              <div className="space-y-3 pt-1">
                {cat.recommendations.map((rec, rIdx) => (
                  <div
                    key={rIdx}
                    className="bg-white dark:bg-slate-900 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <h5 className="text-xs font-extrabold text-slate-900 dark:text-white">
                        {rec.title}
                      </h5>
                      <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 shrink-0">
                        {rec.impact}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                      {rec.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Interactive Eco Traveler Commitment Checklist */}
      <div className="bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/50 p-6 rounded-2xl space-y-4">
        <div className="flex items-center justify-between border-b border-emerald-200 dark:border-emerald-900/50 pb-3">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <div>
              <h4 className="font-extrabold text-slate-900 dark:text-white text-base">
                My Sustainable Travel Commitment Checklist
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Pledge small habits that make a big impact in {destination}
              </p>
            </div>
          </div>

          <span className="text-xs font-black px-3 py-1 bg-emerald-500 text-white rounded-xl shadow-xs">
            {completedCommitments} / {totalCommitments} Pledged
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div
            onClick={() => toggleCommitment('reusable_bottle')}
            className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-emerald-200 dark:border-emerald-800 flex items-center gap-2.5 cursor-pointer select-none hover:border-emerald-500 transition-all"
          >
            {commitments.reusable_bottle ? (
              <CheckSquare className="w-4 h-4 text-emerald-500 shrink-0" />
            ) : (
              <Square className="w-4 h-4 text-slate-400 shrink-0" />
            )}
            <span className={commitments.reusable_bottle ? 'font-extrabold text-emerald-700 dark:text-emerald-300' : 'text-slate-700 dark:text-slate-300 font-medium'}>
              🥤 Carry a refillable water bottle daily
            </span>
          </div>

          <div
            onClick={() => toggleCommitment('public_transit')}
            className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-emerald-200 dark:border-emerald-800 flex items-center gap-2.5 cursor-pointer select-none hover:border-emerald-500 transition-all"
          >
            {commitments.public_transit ? (
              <CheckSquare className="w-4 h-4 text-emerald-500 shrink-0" />
            ) : (
              <Square className="w-4 h-4 text-slate-400 shrink-0" />
            )}
            <span className={commitments.public_transit ? 'font-extrabold text-emerald-700 dark:text-emerald-300' : 'text-slate-700 dark:text-slate-300 font-medium'}>
              🚆 Use public transport, bikes, or walking
            </span>
          </div>

          <div
            onClick={() => toggleCommitment('towel_reuse')}
            className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-emerald-200 dark:border-emerald-800 flex items-center gap-2.5 cursor-pointer select-none hover:border-emerald-500 transition-all"
          >
            {commitments.towel_reuse ? (
              <CheckSquare className="w-4 h-4 text-emerald-500 shrink-0" />
            ) : (
              <Square className="w-4 h-4 text-slate-400 shrink-0" />
            )}
            <span className={commitments.towel_reuse ? 'font-extrabold text-emerald-700 dark:text-emerald-300' : 'text-slate-700 dark:text-slate-300 font-medium'}>
              🏨 Reuse hotel towels and turn off AC when out
            </span>
          </div>

          <div
            onClick={() => toggleCommitment('local_artisan')}
            className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-emerald-200 dark:border-emerald-800 flex items-center gap-2.5 cursor-pointer select-none hover:border-emerald-500 transition-all"
          >
            {commitments.local_artisan ? (
              <CheckSquare className="w-4 h-4 text-emerald-500 shrink-0" />
            ) : (
              <Square className="w-4 h-4 text-slate-400 shrink-0" />
            )}
            <span className={commitments.local_artisan ? 'font-extrabold text-emerald-700 dark:text-emerald-300' : 'text-slate-700 dark:text-slate-300 font-medium'}>
              🛍️ Buy souvenirs directly from local craft artisans
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
