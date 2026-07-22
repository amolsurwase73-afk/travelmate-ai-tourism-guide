import React from 'react';
import { Compass, Moon, Sun, Bookmark, MessageSquare, MapPin, Sparkles } from 'lucide-react';

interface NavbarProps {
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
  onOpenSavedTrips: () => void;
  onOpenChat: () => void;
  savedTripsCount: number;
  onNewSearchClick: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  darkMode,
  setDarkMode,
  onOpenSavedTrips,
  onOpenChat,
  savedTripsCount,
  onNewSearchClick,
}) => {
  return (
    <header className="sticky top-0 z-40 backdrop-blur-md bg-white/80 dark:bg-slate-900/80 border-b border-slate-200 dark:border-slate-800 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand Logo & Name */}
        <button
          id="brand-logo-btn"
          onClick={onNewSearchClick}
          className="flex items-center gap-3 text-left group focus:outline-none"
        >
          <div className="p-2.5 rounded-xl bg-gradient-to-tr from-sky-500 via-teal-500 to-emerald-500 text-white shadow-md shadow-sky-500/20 group-hover:scale-105 transition-transform">
            <Compass className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-sky-600 via-teal-600 to-emerald-600 dark:from-sky-400 dark:via-teal-400 dark:to-emerald-400 bg-clip-text text-transparent">
                Tourism Guide AI
              </span>
              <span className="px-1.5 py-0.5 text-[10px] font-semibold bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-300 rounded-md border border-sky-200 dark:border-sky-800 flex items-center gap-0.5">
                <Sparkles className="w-2.5 h-2.5" /> Gemini
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium hidden sm:block">
              Smart Itineraries, Local Food, Attractions & Budgets
            </p>
          </div>
        </button>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Plan New Trip */}
          <button
            id="nav-new-trip-btn"
            onClick={onNewSearchClick}
            className="hidden md:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <MapPin className="w-4 h-4 text-sky-500" />
            Plan Trip
          </button>

          {/* AI Chat Assistant */}
          <button
            id="nav-chat-btn"
            onClick={onOpenChat}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-sky-500/10 text-sky-700 dark:text-sky-300 hover:bg-sky-500/20 border border-sky-200/60 dark:border-sky-800/60 transition-all shadow-xs"
          >
            <MessageSquare className="w-4 h-4 text-sky-600 dark:text-sky-400" />
            <span className="hidden sm:inline">Ask AI Assistant</span>
          </button>

          {/* Saved Trips */}
          <button
            id="nav-saved-trips-btn"
            onClick={onOpenSavedTrips}
            className="relative p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Saved Itineraries"
          >
            <Bookmark className="w-5 h-5" />
            {savedTripsCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-bounce">
                {savedTripsCount}
              </span>
            )}
          </button>

          {/* Dark Mode Toggle */}
          <button
            id="nav-darkmode-toggle"
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {darkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-slate-700" />}
          </button>
        </div>
      </div>
    </header>
  );
};
