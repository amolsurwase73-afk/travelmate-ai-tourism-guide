import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Compass,
  UtensilsCrossed,
  DollarSign,
  ShieldAlert,
  HelpCircle,
  Bookmark,
  Sparkles,
  MapPin,
  ArrowRight,
  Globe,
  Palmtree,
  CheckCircle2,
  RefreshCw,
  MessageSquare,
  Luggage,
  Bus,
  Leaf,
} from 'lucide-react';

import { TravelGuideData, TripPlannerInput } from './types';
import { POPULAR_DESTINATIONS, PopularDestination } from './data/popularDestinations';
import { Navbar } from './components/Navbar';
import { PlannerForm } from './components/PlannerForm';
import { DestinationOverviewCard } from './components/DestinationOverviewCard';
import { ItineraryView } from './components/ItineraryView';
import { AttractionsGrid } from './components/AttractionsGrid';
import { FoodGuideView } from './components/FoodGuideView';
import { BudgetCalculator } from './components/BudgetCalculator';
import { TravelTipsView } from './components/TravelTipsView';
import { EmergencyAndChecklist } from './components/EmergencyAndChecklist';
import { SmartPackingList } from './components/SmartPackingList';
import { LocalTransportSuggestions } from './components/LocalTransportSuggestions';
import { EcoFriendlyRecommendations } from './components/EcoFriendlyRecommendations';
import { FAQView } from './components/FAQView';
import { AIChatModal } from './components/AIChatModal';
import { SavedTripsModal } from './components/SavedTripsModal';
import { exportGuideToPDF } from './utils/pdfExporter';

type ActiveTab = 'itinerary' | 'attractions' | 'food' | 'budget' | 'tips' | 'transport' | 'eco' | 'packing' | 'emergency' | 'faqs';

const LOADING_STEPS = [
  'Connecting to Google Gemini AI...',
  'Analyzing destination highlights & weather...',
  'Curating top 15 local attractions & hidden gems...',
  'Designing personalized day-by-day itinerary...',
  'Discovering famous dishes & top restaurants...',
  'Calculating real-time budget estimates...',
  'Compiling safety tips, emergency info & checklist...',
];

export default function App() {
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  const [guideData, setGuideData] = useState<TravelGuideData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingStepIdx, setLoadingStepIdx] = useState<number>(0);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState<ActiveTab>('itinerary');

  const [savedTrips, setSavedTrips] = useState<TravelGuideData[]>(() => {
    try {
      const stored = localStorage.getItem('tourism_guide_saved_trips');
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      return [];
    }
  });

  const [isSavedModalOpen, setIsSavedModalOpen] = useState(false);
  const [isChatModalOpen, setIsChatModalOpen] = useState(false);

  // Sync dark mode class
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Loading animation interval
  useEffect(() => {
    if (!loading) {
      setLoadingStepIdx(0);
      return;
    }
    const interval = setInterval(() => {
      setLoadingStepIdx((prev) => (prev + 1) % LOADING_STEPS.length);
    }, 2200);
    return () => clearInterval(interval);
  }, [loading]);

  const handleGenerateGuide = async (input: TripPlannerInput) => {
    setLoading(true);
    setErrorMsg(null);

    try {
      const response = await fetch('/api/generate-travel-guide', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          destination: input.destination,
          durationDays: input.durationDays,
          travelersCount: input.travelersCount,
          budgetLevel: input.budgetLevel,
          currency: input.currency,
          travelStyle: input.travelStyle,
          interests: input.interests,
        }),
      });

      const json = await response.json();

      if (!response.ok || !json.success) {
        throw new Error(json.error || json.details || 'Failed to generate guide');
      }

      const fullGuideData: TravelGuideData = {
        id: `trip_${Date.now()}`,
        createdAt: new Date().toISOString(),
        inputs: input,
        overview: json.data.overview,
        itinerary: json.data.itinerary,
        attractions: json.data.attractions,
        foodGuide: json.data.foodGuide,
        budgetBreakdown: json.data.budgetBreakdown,
        travelTips: json.data.travelTips,
        emergencyInfo: json.data.emergencyInfo,
        packingChecklist: json.data.packingChecklist,
        faqs: json.data.faqs,
      };

      setGuideData(fullGuideData);
      setActiveTab('itinerary');

      // Smooth scroll to guide
      setTimeout(() => {
        document.getElementById('travel-guide-content')?.scrollIntoView({ behavior: 'smooth' });
      }, 200);
    } catch (err: any) {
      console.error('Error generating guide:', err);
      setErrorMsg(err.message || 'Unable to generate guide. Please check your network and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveTrip = () => {
    if (!guideData) return;
    const exists = savedTrips.some((t) => t.id === guideData.id || t.overview.name === guideData.overview.name);

    let updated: TravelGuideData[];
    if (exists) {
      updated = savedTrips.filter((t) => t.id !== guideData.id && t.overview.name !== guideData.overview.name);
    } else {
      updated = [guideData, ...savedTrips];
    }

    setSavedTrips(updated);
    try {
      localStorage.setItem('tourism_guide_saved_trips', JSON.stringify(updated));
    } catch (e) {
      console.error('LocalStorage write error', e);
    }
  };

  const handleDeleteTrip = (tripId: string) => {
    const updated = savedTrips.filter((t) => t.id !== tripId);
    setSavedTrips(updated);
    try {
      localStorage.setItem('tourism_guide_saved_trips', JSON.stringify(updated));
    } catch (e) {
      console.error('LocalStorage write error', e);
    }
  };

  const isCurrentGuideSaved = guideData
    ? savedTrips.some((t) => t.id === guideData.id || t.overview.name === guideData.overview.name)
    : false;

  const handleDownloadPDF = () => {
    if (!guideData) return;
    exportGuideToPDF('printable-guide-container', guideData);
  };

  const handleQuickDestinationSelect = (pop: PopularDestination) => {
    const today = new Date();
    const end = new Date();
    end.setDate(today.getDate() + pop.idealDays);

    handleGenerateGuide({
      destination: pop.name,
      startDate: today.toISOString().split('T')[0],
      endDate: end.toISOString().split('T')[0],
      durationDays: pop.idealDays,
      travelersCount: 2,
      budgetLevel: pop.budgetLevel,
      currency: pop.currency,
      travelStyle: 'Family',
      interests: pop.interests,
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans transition-colors duration-200 selection:bg-sky-500 selection:text-white">
      {/* Header Bar */}
      <Navbar
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        onOpenSavedTrips={() => setIsSavedModalOpen(true)}
        onOpenChat={() => setIsChatModalOpen(true)}
        savedTripsCount={savedTrips.length}
        onNewSearchClick={() => {
          setGuideData(null);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
        {/* Hero Section */}
        {!guideData && !loading && (
          <section className="text-center space-y-6 pt-4 pb-2">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-sky-500/10 text-sky-700 dark:text-sky-300 border border-sky-300/40 dark:border-sky-800/40 text-xs font-bold animate-pulse">
              <Sparkles className="w-4 h-4 text-sky-500" />
              <span>Next-Gen Travel Intelligence with Gemini 3.6</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-slate-900 dark:text-white max-w-4xl mx-auto leading-tight">
              Discover Local Places & Build Custom{' '}
              <span className="bg-gradient-to-r from-sky-500 via-teal-500 to-emerald-500 bg-clip-text text-transparent">
                Travel Guides in Seconds
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto font-normal">
              Get personalized day-wise itineraries, top 15 local attractions, authentic street food, interactive budget calculators, and 24/7 AI travel support.
            </p>

            {/* Featured Destinations Showcase Cards */}
            <div className="pt-6 space-y-3">
              <div className="flex items-center justify-between px-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                  <Compass className="w-4 h-4 text-sky-500" /> Explore Popular Destinations
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {POPULAR_DESTINATIONS.slice(0, 4).map((pop) => (
                  <button
                    key={pop.name}
                    onClick={() => handleQuickDestinationSelect(pop)}
                    className="group relative h-40 sm:h-48 rounded-2xl overflow-hidden shadow-md border border-slate-200 dark:border-slate-800 text-left focus:outline-none transition-all hover:scale-[1.02] hover:shadow-xl"
                  >
                    <img
                      src={pop.image}
                      alt={pop.name}
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent" />
                    <div className="absolute bottom-3 left-3 right-3 text-white space-y-0.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-extrabold uppercase text-sky-300 tracking-wider">
                          {pop.country}
                        </span>
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-white/20 backdrop-blur-md text-white">
                          {pop.idealDays} Days
                        </span>
                      </div>
                      <h3 className="font-extrabold text-base sm:text-lg leading-tight group-hover:text-sky-300 transition-colors">
                        {pop.name}
                      </h3>
                      <p className="text-[11px] text-slate-300 line-clamp-1 italic">
                        {pop.tagline}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Planner Input Form */}
        <section id="planner-form-section">
          <PlannerForm onSubmit={handleGenerateGuide} loading={loading} />
        </section>

        {/* Loading Indicator with Animated AI Steps */}
        {loading && (
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-sky-200 dark:border-sky-900/50 p-8 text-center shadow-xl space-y-6 animate-pulse">
            <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-sky-500 via-teal-500 to-emerald-500 text-white flex items-center justify-center mx-auto shadow-lg shadow-sky-500/30">
              <RefreshCw className="w-8 h-8 animate-spin" />
            </div>

            <div className="space-y-2">
              <h3 className="text-2xl font-black text-slate-900 dark:text-white">
                Crafting Your Custom Travel Guide
              </h3>
              <p className="text-sm font-semibold text-sky-600 dark:text-sky-400">
                {LOADING_STEPS[loadingStepIdx]}
              </p>
            </div>

            {/* Progress dots */}
            <div className="flex items-center justify-center gap-2">
              {LOADING_STEPS.map((_, idx) => (
                <div
                  key={idx}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    idx === loadingStepIdx
                      ? 'w-8 bg-sky-500'
                      : 'w-2 bg-slate-200 dark:bg-slate-700'
                  }`}
                />
              ))}
            </div>
          </div>
        )}

        {/* Error Notification */}
        {errorMsg && (
          <div className="bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 p-6 rounded-3xl text-center space-y-3">
            <ShieldAlert className="w-10 h-10 text-rose-500 mx-auto" />
            <h3 className="text-lg font-bold text-rose-900 dark:text-rose-200">
              Generation Error
            </h3>
            <p className="text-xs sm:text-sm text-rose-700 dark:text-rose-300">{errorMsg}</p>
            <button
              onClick={() => setErrorMsg(null)}
              className="px-4 py-2 bg-rose-500 text-white font-bold text-xs rounded-xl shadow-xs hover:bg-rose-600 transition-colors"
            >
              Dismiss & Try Again
            </button>
          </div>
        )}

        {/* Generated Guide Content */}
        {guideData && !loading && (
          <section id="travel-guide-content" className="space-y-8">
            <div id="printable-guide-container" className="space-y-8">
              {/* Overview Header Banner */}
              <DestinationOverviewCard
                guideData={guideData}
                onDownloadPDF={handleDownloadPDF}
                onSaveTrip={handleSaveTrip}
                isSaved={isCurrentGuideSaved}
              />

              {/* Navigation Tabs */}
              <div className="bg-white dark:bg-slate-900 rounded-2xl p-2 border border-slate-200/80 dark:border-slate-800 shadow-xs flex items-center gap-1.5 overflow-x-auto scrollbar-none">
                <button
                  id="tab-btn-itinerary"
                  onClick={() => setActiveTab('itinerary')}
                  className={`flex items-center gap-2 px-4 py-3 rounded-xl text-xs sm:text-sm font-extrabold whitespace-nowrap transition-all ${
                    activeTab === 'itinerary'
                      ? 'bg-sky-500 text-white shadow-md shadow-sky-500/20'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <Calendar className="w-4 h-4" />
                  Day-wise Itinerary
                </button>

                <button
                  id="tab-btn-attractions"
                  onClick={() => setActiveTab('attractions')}
                  className={`flex items-center gap-2 px-4 py-3 rounded-xl text-xs sm:text-sm font-extrabold whitespace-nowrap transition-all ${
                    activeTab === 'attractions'
                      ? 'bg-sky-500 text-white shadow-md shadow-sky-500/20'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <Compass className="w-4 h-4" />
                  Attractions ({guideData.attractions?.length || 15})
                </button>

                <button
                  id="tab-btn-food"
                  onClick={() => setActiveTab('food')}
                  className={`flex items-center gap-2 px-4 py-3 rounded-xl text-xs sm:text-sm font-extrabold whitespace-nowrap transition-all ${
                    activeTab === 'food'
                      ? 'bg-sky-500 text-white shadow-md shadow-sky-500/20'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <UtensilsCrossed className="w-4 h-4" />
                  Food Guide
                </button>

                <button
                  id="tab-btn-budget"
                  onClick={() => setActiveTab('budget')}
                  className={`flex items-center gap-2 px-4 py-3 rounded-xl text-xs sm:text-sm font-extrabold whitespace-nowrap transition-all ${
                    activeTab === 'budget'
                      ? 'bg-sky-500 text-white shadow-md shadow-sky-500/20'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <DollarSign className="w-4 h-4" />
                  Budget Breakdown
                </button>

                <button
                  id="tab-btn-tips"
                  onClick={() => setActiveTab('tips')}
                  className={`flex items-center gap-2 px-4 py-3 rounded-xl text-xs sm:text-sm font-extrabold whitespace-nowrap transition-all ${
                    activeTab === 'tips'
                      ? 'bg-sky-500 text-white shadow-md shadow-sky-500/20'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <Globe className="w-4 h-4" />
                  Travel Tips
                </button>

                <button
                  id="tab-btn-transport"
                  onClick={() => setActiveTab('transport')}
                  className={`flex items-center gap-2 px-4 py-3 rounded-xl text-xs sm:text-sm font-extrabold whitespace-nowrap transition-all ${
                    activeTab === 'transport'
                      ? 'bg-sky-500 text-white shadow-md shadow-sky-500/20'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <Bus className="w-4 h-4" />
                  Local Transport
                </button>

                <button
                  id="tab-btn-eco"
                  onClick={() => setActiveTab('eco')}
                  className={`flex items-center gap-2 px-4 py-3 rounded-xl text-xs sm:text-sm font-extrabold whitespace-nowrap transition-all ${
                    activeTab === 'eco'
                      ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/20'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <Leaf className="w-4 h-4 text-emerald-400" />
                  Eco Travel
                </button>

                <button
                  id="tab-btn-packing"
                  onClick={() => setActiveTab('packing')}
                  className={`flex items-center gap-2 px-4 py-3 rounded-xl text-xs sm:text-sm font-extrabold whitespace-nowrap transition-all ${
                    activeTab === 'packing'
                      ? 'bg-sky-500 text-white shadow-md shadow-sky-500/20'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <Luggage className="w-4 h-4" />
                  Smart Packing List
                </button>

                <button
                  id="tab-btn-emergency"
                  onClick={() => setActiveTab('emergency')}
                  className={`flex items-center gap-2 px-4 py-3 rounded-xl text-xs sm:text-sm font-extrabold whitespace-nowrap transition-all ${
                    activeTab === 'emergency'
                      ? 'bg-sky-500 text-white shadow-md shadow-sky-500/20'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <ShieldAlert className="w-4 h-4" />
                  Emergency Support
                </button>

                <button
                  id="tab-btn-faqs"
                  onClick={() => setActiveTab('faqs')}
                  className={`flex items-center gap-2 px-4 py-3 rounded-xl text-xs sm:text-sm font-extrabold whitespace-nowrap transition-all ${
                    activeTab === 'faqs'
                      ? 'bg-sky-500 text-white shadow-md shadow-sky-500/20'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <HelpCircle className="w-4 h-4" />
                  FAQs
                </button>
              </div>

              {/* Active Tab View Rendering */}
              <div>
                {activeTab === 'itinerary' && (
                  <ItineraryView
                    itinerary={guideData.itinerary}
                    currencySymbol={guideData.overview.currencySymbol}
                  />
                )}

                {activeTab === 'attractions' && (
                  <AttractionsGrid attractions={guideData.attractions} />
                )}

                {activeTab === 'food' && (
                  <FoodGuideView foodGuide={guideData.foodGuide} />
                )}

                {activeTab === 'budget' && (
                  <BudgetCalculator
                    budget={guideData.budgetBreakdown}
                    initialTravelers={guideData.inputs.travelersCount}
                    initialDays={guideData.inputs.durationDays}
                    destinationName={guideData.overview.name}
                  />
                )}

                {activeTab === 'tips' && (
                  <TravelTipsView tips={guideData.travelTips} />
                )}

                {activeTab === 'transport' && (
                  <LocalTransportSuggestions
                    destination={guideData.overview.name}
                    currencySymbol={guideData.overview.currencySymbol}
                    publicTransportTips={guideData.travelTips.publicTransportTips}
                    attractions={guideData.attractions}
                  />
                )}

                {activeTab === 'eco' && (
                  <EcoFriendlyRecommendations
                    destination={guideData.overview.name}
                    durationDays={guideData.inputs.durationDays}
                    travelersCount={guideData.inputs.travelersCount}
                  />
                )}

                {activeTab === 'packing' && (
                  <SmartPackingList
                    initialChecklist={guideData.packingChecklist}
                    destination={guideData.overview.name}
                    durationDays={guideData.inputs.durationDays}
                    travelStyle={guideData.inputs.travelStyle}
                  />
                )}

                {activeTab === 'emergency' && (
                  <EmergencyAndChecklist
                    emergencyInfo={guideData.emergencyInfo}
                    packingChecklist={guideData.packingChecklist}
                    destination={guideData.overview.name}
                    durationDays={guideData.inputs.durationDays}
                    travelStyle={guideData.inputs.travelStyle}
                  />
                )}

                {activeTab === 'faqs' && (
                  <FAQView faqs={guideData.faqs} />
                )}
              </div>
            </div>
          </section>
        )}
      </main>

      {/* Floating AI Assistant Trigger Pill */}
      <div className="fixed bottom-6 right-6 z-30">
        <button
          id="floating-chat-trigger"
          onClick={() => setIsChatModalOpen(true)}
          className="flex items-center gap-2.5 px-5 py-3.5 bg-gradient-to-r from-sky-500 via-teal-500 to-emerald-500 text-white font-extrabold text-sm rounded-full shadow-2xl hover:scale-105 active:scale-95 transition-all shadow-sky-500/30"
        >
          <MessageSquare className="w-5 h-5 animate-bounce" />
          <span>Ask AI Assistant</span>
        </button>
      </div>

      {/* Saved Trips Modal */}
      <SavedTripsModal
        isOpen={isSavedModalOpen}
        onClose={() => setIsSavedModalOpen(false)}
        savedTrips={savedTrips}
        onSelectTrip={(trip) => {
          setGuideData(trip);
          setActiveTab('itinerary');
          window.scrollTo({ top: 300, behavior: 'smooth' });
        }}
        onDeleteTrip={handleDeleteTrip}
      />

      {/* AI Assistant Chat Modal */}
      <AIChatModal
        isOpen={isChatModalOpen}
        onClose={() => setIsChatModalOpen(false)}
        destinationContext={guideData?.overview?.name}
      />
    </div>
  );
}
