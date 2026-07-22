import React, { useState, useEffect } from 'react';
import {
  ArrowLeftRight,
  TrendingUp,
  RefreshCw,
  Coins,
  DollarSign,
  Info,
  Check,
  Sparkles,
  Calculator,
  Globe,
} from 'lucide-react';

interface LiveCurrencyConverterProps {
  destinationCurrency?: string;
  destinationCurrencySymbol?: string;
  destinationName?: string;
  tripBudgetTotal?: number;
}

interface CurrencyInfo {
  code: string;
  name: string;
  symbol: string;
  flag: string;
}

const SUPPORTED_CURRENCIES: CurrencyInfo[] = [
  { code: 'USD', name: 'US Dollar', symbol: '$', flag: '🇺🇸' },
  { code: 'EUR', name: 'Euro', symbol: '€', flag: '🇪🇺' },
  { code: 'GBP', name: 'British Pound', symbol: '£', flag: '🇬🇧' },
  { code: 'JPY', name: 'Japanese Yen', symbol: '¥', flag: '🇯🇵' },
  { code: 'AUD', name: 'Australian Dollar', symbol: 'A$', flag: '🇦🇺' },
  { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$', flag: '🇨🇦' },
  { code: 'CHF', name: 'Swiss Franc', symbol: 'CHF', flag: '🇨🇭' },
  { code: 'CNY', name: 'Chinese Yuan', symbol: '¥', flag: '🇨🇳' },
  { code: 'INR', name: 'Indian Rupee', symbol: '₹', flag: '🇮🇳' },
  { code: 'SGD', name: 'Singapore Dollar', symbol: 'S$', flag: '🇸🇬' },
  { code: 'AED', name: 'UAE Dirham', symbol: 'AED', flag: '🇦🇪' },
  { code: 'THB', name: 'Thai Baht', symbol: '฿', flag: '🇹🇭' },
  { code: 'KRW', name: 'South Korean Won', symbol: '₩', flag: '🇰🇷' },
  { code: 'MXN', name: 'Mexican Peso', symbol: 'MEX$', flag: '🇲🇽' },
  { code: 'BRL', name: 'Brazilian Real', symbol: 'R$', flag: '🇧🇷' },
  { code: 'NZD', name: 'New Zealand Dollar', symbol: 'NZ$', flag: '🇳🇿' },
  { code: 'IDR', name: 'Indonesian Rupiah', symbol: 'Rp', flag: '🇮🇩' },
  { code: 'VND', name: 'Vietnamese Dong', symbol: '₫', flag: '🇻🇳' },
  { code: 'TRY', name: 'Turkish Lira', symbol: '₺', flag: '🇹🇷' },
  { code: 'EGP', name: 'Egyptian Pound', symbol: 'E£', flag: '🇪🇬' },
];

// Fallback rates against 1 USD in case network fails
const FALLBACK_RATES_USD: Record<string, number> = {
  USD: 1.0,
  EUR: 0.92,
  GBP: 0.78,
  JPY: 155.2,
  AUD: 1.52,
  CAD: 1.36,
  CHF: 0.89,
  CNY: 7.25,
  INR: 83.5,
  SGD: 1.35,
  AED: 3.67,
  THB: 36.8,
  KRW: 1380.0,
  MXN: 18.2,
  BRL: 5.45,
  NZD: 1.63,
  IDR: 16350.0,
  VND: 25400.0,
  TRY: 32.8,
  EGP: 47.6,
};

export const LiveCurrencyConverter: React.FC<LiveCurrencyConverterProps> = ({
  destinationCurrency = 'EUR',
  destinationCurrencySymbol = '€',
  destinationName = 'Destination',
  tripBudgetTotal = 1500,
}) => {
  const [fromCurrency, setFromCurrency] = useState<string>('USD');
  const [toCurrency, setToCurrency] = useState<string>(() => {
    // Sanitize destination code
    const matched = SUPPORTED_CURRENCIES.find(
      (c) => c.code === destinationCurrency.toUpperCase()
    );
    return matched ? matched.code : 'EUR';
  });

  const [amount, setAmount] = useState<number>(100);
  const [rates, setRates] = useState<Record<string, number>>(FALLBACK_RATES_USD);
  const [loading, setLoading] = useState<boolean>(false);
  const [lastUpdated, setLastUpdated] = useState<string>('Live API');

  // Fetch rates
  const fetchRates = async () => {
    setLoading(true);
    try {
      const res = await fetch('https://open.er-api.com/v6/latest/USD');
      const data = await res.json();
      if (data && data.rates) {
        setRates(data.rates);
        setLastUpdated(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      }
    } catch (err) {
      console.warn('Currency API fallback used:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRates();
  }, []);

  // Update target currency when prop changes
  useEffect(() => {
    const matched = SUPPORTED_CURRENCIES.find(
      (c) => c.code === destinationCurrency.toUpperCase()
    );
    if (matched) {
      setToCurrency(matched.code);
    }
  }, [destinationCurrency]);

  const handleSwap = () => {
    const temp = fromCurrency;
    setFromCurrency(toCurrency);
    setToCurrency(temp);
  };

  // Rate calculation
  const rateFromUSD = rates[fromCurrency] || FALLBACK_RATES_USD[fromCurrency] || 1;
  const rateToUSD = rates[toCurrency] || FALLBACK_RATES_USD[toCurrency] || 1;

  // 1 unit of fromCurrency in toCurrency
  const exchangeRate = rateToUSD / rateFromUSD;
  const convertedAmount = amount * exchangeRate;

  const fromInfo =
    SUPPORTED_CURRENCIES.find((c) => c.code === fromCurrency) || SUPPORTED_CURRENCIES[0];
  const toInfo =
    SUPPORTED_CURRENCIES.find((c) => c.code === toCurrency) || SUPPORTED_CURRENCIES[1];

  const cheatSheetSteps = [5, 10, 25, 50, 100, 250, 500, 1000];

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 sm:p-8 space-y-6 shadow-xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-300/30 text-xs font-black uppercase tracking-wider mb-2">
            <Coins className="w-3.5 h-3.5 text-emerald-500" />
            <span>Real-time FX Rates</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            Live Currency Converter
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Instant exchange rate calculator for <strong className="text-slate-900 dark:text-white">{destinationName}</strong> travel expenses.
          </p>
        </div>

        <button
          onClick={fetchRates}
          disabled={loading}
          className="px-3.5 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs rounded-xl border border-slate-200 dark:border-slate-700 flex items-center gap-2 transition-all cursor-pointer shrink-0 self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-emerald-500 ${loading ? 'animate-spin' : ''}`} />
          <span>Rates: {lastUpdated}</span>
        </button>
      </div>

      {/* Main Conversion Control Block */}
      <div className="bg-slate-50 dark:bg-slate-950/60 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
          {/* From Currency Block */}
          <div className="md:col-span-2 space-y-1.5">
            <label className="block text-[11px] font-extrabold uppercase text-slate-500 dark:text-slate-400">
              You Pay / Amount
            </label>
            <div className="flex items-center gap-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-2 focus-within:ring-2 focus-within:ring-emerald-500">
              <span className="text-lg pl-2">{fromInfo.flag}</span>
              <select
                value={fromCurrency}
                onChange={(e) => setFromCurrency(e.target.value)}
                className="bg-transparent font-extrabold text-xs text-slate-900 dark:text-white focus:outline-none cursor-pointer pr-1"
              >
                {SUPPORTED_CURRENCIES.map((c) => (
                  <option key={c.code} value={c.code} className="dark:bg-slate-900">
                    {c.code} ({c.symbol})
                  </option>
                ))}
              </select>
              <input
                type="number"
                min="1"
                value={amount}
                onChange={(e) => setAmount(Math.max(0, parseFloat(e.target.value) || 0))}
                className="w-full text-right font-black text-lg sm:text-xl text-slate-900 dark:text-white bg-transparent focus:outline-none pr-2"
              />
            </div>
          </div>

          {/* Swap Button */}
          <div className="md:col-span-1 flex justify-center pt-2 md:pt-4">
            <button
              onClick={handleSwap}
              className="p-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl shadow-lg hover:rotate-180 transition-all duration-300 cursor-pointer"
              title="Swap Currencies"
            >
              <ArrowLeftRight className="w-5 h-5" />
            </button>
          </div>

          {/* To Currency Block */}
          <div className="md:col-span-2 space-y-1.5">
            <label className="block text-[11px] font-extrabold uppercase text-slate-500 dark:text-slate-400">
              You Receive ({toInfo.name})
            </label>
            <div className="flex items-center gap-2 bg-emerald-500/10 dark:bg-emerald-950/40 border border-emerald-400/40 rounded-xl p-2">
              <span className="text-lg pl-2">{toInfo.flag}</span>
              <select
                value={toCurrency}
                onChange={(e) => setToCurrency(e.target.value)}
                className="bg-transparent font-extrabold text-xs text-emerald-800 dark:text-emerald-300 focus:outline-none cursor-pointer pr-1"
              >
                {SUPPORTED_CURRENCIES.map((c) => (
                  <option key={c.code} value={c.code} className="dark:bg-slate-900">
                    {c.code} ({c.symbol})
                  </option>
                ))}
              </select>
              <div className="w-full text-right font-black text-lg sm:text-xl text-emerald-600 dark:text-emerald-400 pr-2 truncate">
                {toInfo.symbol}
                {convertedAmount.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Live Exchange Rate Ratio Banner */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 pt-2 text-xs font-semibold text-slate-600 dark:text-slate-300 border-t border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-1.5">
            <TrendingUp className="w-4 h-4 text-emerald-500" />
            <span>
              1 {fromCurrency} ={' '}
              <strong className="text-slate-900 dark:text-white">
                {exchangeRate.toFixed(4)} {toCurrency}
              </strong>
            </span>
          </div>

          <div className="text-[11px] text-slate-400 dark:text-slate-500">
            Reverse: 1 {toCurrency} = {(1 / exchangeRate).toFixed(4)} {fromCurrency}
          </div>
        </div>
      </div>

      {/* Quick Travel Cheat Sheet Grid */}
      <div className="space-y-3">
        <h4 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
          <Calculator className="w-4 h-4 text-sky-500" />
          Quick Conversion Cheat Sheet ({fromCurrency} ➔ {toCurrency})
        </h4>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {cheatSheetSteps.map((step) => {
            const stepConverted = step * exchangeRate;
            return (
              <div
                key={step}
                onClick={() => setAmount(step)}
                className="p-3 bg-slate-50 dark:bg-slate-950/50 hover:bg-sky-50/80 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 rounded-xl cursor-pointer transition-all space-y-0.5"
              >
                <div className="text-[11px] font-bold text-slate-500 dark:text-slate-400">
                  {fromInfo.symbol}
                  {step} {fromCurrency}
                </div>
                <div className="text-sm font-black text-emerald-600 dark:text-emerald-400">
                  {toInfo.symbol}
                  {stepConverted.toLocaleString(undefined, {
                    minimumFractionDigits: stepConverted < 10 ? 2 : 0,
                    maximumFractionDigits: 2,
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick Common Expenses Buttons */}
      <div className="bg-sky-50/50 dark:bg-slate-800/40 p-4 rounded-2xl border border-sky-100 dark:border-slate-700/60 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="font-extrabold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
          <Globe className="w-4 h-4 text-sky-500" />
          <span>Popular Travel Expenses Quick Presets:</span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setAmount(4)}
            className="px-3 py-1.5 bg-white dark:bg-slate-900 hover:bg-sky-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg font-bold text-slate-700 dark:text-slate-200 shadow-2xs transition-all"
          >
            ☕ Espresso ({fromInfo.symbol}4)
          </button>
          <button
            onClick={() => setAmount(15)}
            className="px-3 py-1.5 bg-white dark:bg-slate-900 hover:bg-sky-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg font-bold text-slate-700 dark:text-slate-200 shadow-2xs transition-all"
          >
            🍕 Lunch ({fromInfo.symbol}15)
          </button>
          <button
            onClick={() => setAmount(45)}
            className="px-3 py-1.5 bg-white dark:bg-slate-900 hover:bg-sky-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg font-bold text-slate-700 dark:text-slate-200 shadow-2xs transition-all"
          >
            🍷 Dinner for Two ({fromInfo.symbol}45)
          </button>
          <button
            onClick={() => setAmount(120)}
            className="px-3 py-1.5 bg-white dark:bg-slate-900 hover:bg-sky-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg font-bold text-slate-700 dark:text-slate-200 shadow-2xs transition-all"
          >
            🏨 Hotel Night ({fromInfo.symbol}120)
          </button>
        </div>
      </div>
    </div>
  );
};
