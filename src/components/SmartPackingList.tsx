import React, { useState, useEffect } from 'react';
import {
  CheckSquare,
  Square,
  Sparkles,
  Plus,
  Trash2,
  Copy,
  Check,
  Printer,
  Luggage,
  Sun,
  Snowflake,
  CloudRain,
  Compass,
  Shirt,
  Smartphone,
  FileText,
  Briefcase,
  HeartPulse,
  ShoppingBag,
  RefreshCw,
  Search,
  Filter,
} from 'lucide-react';
import { PackingCategory, TripPlannerInput } from '../types';

interface SmartPackingListProps {
  initialChecklist?: PackingCategory[];
  destination?: string;
  durationDays?: number;
  travelStyle?: string;
}

export interface PackingItem {
  id: string;
  category: string;
  name: string;
  packed: boolean;
  isCustom?: boolean;
}

const CATEGORY_ICONS: Record<string, React.FC<{ className?: string }>> = {
  Clothing: Shirt,
  Apparel: Shirt,
  Toiletries: HeartPulse,
  Electronics: Smartphone,
  Documents: FileText,
  Gear: Briefcase,
  Health: HeartPulse,
  Essentials: ShoppingBag,
};

const CLIMATE_PRESETS = [
  { id: 'tropical', label: 'Warm / Tropical', icon: Sun, color: 'text-amber-500 bg-amber-50 dark:bg-amber-950/40' },
  { id: 'cold', label: 'Cold / Winter', icon: Snowflake, color: 'text-sky-500 bg-sky-50 dark:bg-sky-950/40' },
  { id: 'rainy', label: 'Rainy / Monsoon', icon: CloudRain, color: 'text-teal-500 bg-teal-50 dark:bg-teal-950/40' },
  { id: 'mild', label: 'Mild / Moderate', icon: Compass, color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/40' },
];

const LUGGAGE_TYPES = [
  { id: 'carryon', label: 'Carry-On Suitcase', icon: Luggage },
  { id: 'backpack', label: 'Travel Backpack', icon: Briefcase },
  { id: 'checked', label: 'Checked Bag', icon: ShoppingBag },
];

export const SmartPackingList: React.FC<SmartPackingListProps> = ({
  initialChecklist,
  destination = 'Destination',
  durationDays = 5,
  travelStyle = 'General',
}) => {
  const [items, setItems] = useState<PackingItem[]>(() => {
    // Try localStorage cache first
    try {
      const saved = localStorage.getItem(`smart_packing_${destination}`);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn('LocalStorage parse notice', e);
    }

    // Fallback to initialChecklist prop or smart defaults
    if (initialChecklist && initialChecklist.length > 0) {
      const flattened: PackingItem[] = [];
      initialChecklist.forEach((cat, cIdx) => {
        cat.items.forEach((itemName, iIdx) => {
          flattened.push({
            id: `item-${cIdx}-${iIdx}-${itemName.replace(/\s+/g, '')}`,
            category: cat.category,
            name: itemName,
            packed: false,
          });
        });
      });
      return flattened;
    }

    // Default universal packing list if no initial checklist is supplied
    return [
      { id: 'p1', category: 'Travel Documents & Money', name: 'Passport / Photo ID', packed: false },
      { id: 'p2', category: 'Travel Documents & Money', name: 'Flight / Train Tickets & Hotel Vouchers', packed: false },
      { id: 'p3', category: 'Travel Documents & Money', name: 'Credit / Debit Cards & Local Currency Cash', packed: false },
      { id: 'p4', category: 'Clothing & Footwear', name: `${durationDays}x Tops / T-Shirts`, packed: false },
      { id: 'p5', category: 'Clothing & Footwear', name: `${Math.max(2, Math.ceil(durationDays / 2))}x Pants / Shorts`, packed: false },
      { id: 'p6', category: 'Clothing & Footwear', name: `${durationDays + 1}x Underwear & Socks`, packed: false },
      { id: 'p7', category: 'Clothing & Footwear', name: 'Comfortable Walking Shoes', packed: false },
      { id: 'p8', category: 'Electronics & Gadgets', name: 'Smartphone & Charger', packed: false },
      { id: 'p9', category: 'Electronics & Gadgets', name: 'Power Bank (10,000mAh+)', packed: false },
      { id: 'p10', category: 'Electronics & Gadgets', name: 'Universal Travel Adapter Plug', packed: false },
      { id: 'p11', category: 'Toiletries & Personal Care', name: 'Toothbrush & Toothpaste', packed: false },
      { id: 'p12', category: 'Toiletries & Personal Care', name: 'Travel-size Shampoo & Body Wash', packed: false },
      { id: 'p13', category: 'Toiletries & Personal Care', name: 'Sunscreen & Lip Balm', packed: false },
      { id: 'p14', category: 'Health & First Aid', name: 'Personal Medications & Prescriptions', packed: false },
      { id: 'p15', category: 'Health & First Aid', name: 'Basic First Aid Kit (Bandages, Antiseptic, Painkillers)', packed: false },
    ];
  });

  const [selectedClimate, setSelectedClimate] = useState<string>('mild');
  const [selectedLuggage, setSelectedLuggage] = useState<string>('carryon');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'unpacked' | 'packed'>('all');

  const [newItemName, setNewItemName] = useState<string>('');
  const [newItemCategory, setNewItemCategory] = useState<string>('Clothing & Footwear');
  const [copied, setCopied] = useState<boolean>(false);
  const [generatingAI, setGeneratingAI] = useState<boolean>(false);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(`smart_packing_${destination}`, JSON.stringify(items));
    } catch (e) {
      console.warn('LocalStorage save notice', e);
    }
  }, [items, destination]);

  const toggleItemPacked = (id: string) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, packed: !item.packed } : item))
    );
  };

  const handleCheckAllCategory = (category: string, checkState: boolean) => {
    setItems((prev) =>
      prev.map((item) => (item.category === category ? { ...item, packed: checkState } : item))
    );
  };

  const handleCheckAllGlobal = (checkState: boolean) => {
    setItems((prev) => prev.map((item) => ({ ...item, packed: checkState })));
  };

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName.trim()) return;

    const newItem: PackingItem = {
      id: `custom-${Date.now()}`,
      category: newItemCategory.trim() || 'Custom Essentials',
      name: newItemName.trim(),
      packed: false,
      isCustom: true,
    };

    setItems((prev) => [...prev, newItem]);
    setNewItemName('');
  };

  const handleDeleteItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleCopyList = () => {
    const categoriesMap: Record<string, string[]> = {};
    items.forEach((item) => {
      if (!categoriesMap[item.category]) categoriesMap[item.category] = [];
      categoriesMap[item.category].push(`${item.packed ? '[x]' : '[ ]'} ${item.name}`);
    });

    let formattedText = `🧳 Packing List for ${destination} (${durationDays} Days)\n\n`;
    Object.entries(categoriesMap).forEach(([cat, itemList]) => {
      formattedText += `📌 ${cat}:\n${itemList.join('\n')}\n\n`;
    });

    navigator.clipboard.writeText(formattedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrintList = () => {
    window.print();
  };

  // AI Refresh Generator Endpoint call
  const handleAIGenerateSmartList = async () => {
    setGeneratingAI(true);
    try {
      const res = await fetch('/api/generate-travel-guide', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          destination,
          durationDays,
          travelStyle,
          interests: [selectedClimate, selectedLuggage],
        }),
      });

      const json = await res.json();
      if (json.success && json.data?.packingChecklist) {
        const freshItems: PackingItem[] = [];
        json.data.packingChecklist.forEach((catGroup: PackingCategory, cIdx: number) => {
          catGroup.items.forEach((itemName: string, iIdx: number) => {
            freshItems.push({
              id: `ai-${Date.now()}-${cIdx}-${iIdx}`,
              category: catGroup.category,
              name: itemName,
              packed: false,
            });
          });
        });
        if (freshItems.length > 0) {
          setItems(freshItems);
        }
      }
    } catch (e) {
      console.warn('AI Packing generation warning:', e);
    } finally {
      setGeneratingAI(false);
    }
  };

  // Derived stats
  const totalItems = items.length;
  const packedCount = items.filter((i) => i.packed).length;
  const packedPercentage = totalItems > 0 ? Math.round((packedCount / totalItems) * 100) : 0;

  // Categories list
  const categoriesList: string[] = Array.from(new Set(items.map((i) => i.category)));

  // Filtered items view
  const filteredItems = items.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === 'all' ? true : statusFilter === 'packed' ? item.packed : !item.packed;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 sm:p-8 space-y-6 shadow-xl">
      {/* Header & Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-300/30 text-xs font-black uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5 text-sky-500" />
            <span>AI Smart Packing Assistant</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Luggage className="w-7 h-7 text-sky-500" />
            Smart Packing List Generator
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Tailored checklist for <strong className="text-slate-900 dark:text-white">{destination}</strong> • {durationDays} Days • {travelStyle} Style
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleAIGenerateSmartList}
            disabled={generatingAI}
            className="px-4 py-2.5 bg-gradient-to-r from-sky-500 to-teal-500 hover:from-sky-600 hover:to-teal-600 text-white font-extrabold text-xs rounded-xl shadow-md flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${generatingAI ? 'animate-spin' : ''}`} />
            <span>{generatingAI ? 'Generating AI List...' : 'Smart Refresh'}</span>
          </button>

          <button
            onClick={handleCopyList}
            className="px-3.5 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs rounded-xl border border-slate-200 dark:border-slate-700 flex items-center gap-1.5 transition-all cursor-pointer"
            title="Copy checklist text"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Copied!' : 'Copy'}</span>
          </button>

          <button
            onClick={handlePrintList}
            className="px-3 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs rounded-xl border border-slate-200 dark:border-slate-700 flex items-center gap-1.5 transition-all cursor-pointer"
            title="Print checklist"
          >
            <Printer className="w-4 h-4" />
            <span className="hidden sm:inline">Print</span>
          </button>
        </div>
      </div>

      {/* Progress Bar Header Card */}
      <div className="bg-slate-50 dark:bg-slate-950/60 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 space-y-3">
        <div className="flex items-center justify-between text-xs sm:text-sm font-black">
          <div className="flex items-center gap-2">
            <span className="text-slate-900 dark:text-white">Packing Progress</span>
            {packedPercentage === 100 && (
              <span className="px-2.5 py-0.5 bg-emerald-500 text-white text-[10px] font-extrabold rounded-full animate-bounce">
                🎉 All Packed & Ready to Fly!
              </span>
            )}
          </div>
          <span className="text-sky-600 dark:text-sky-400">
            {packedCount} / {totalItems} items ({packedPercentage}%)
          </span>
        </div>

        <div className="w-full h-3 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden p-0.5">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              packedPercentage === 100
                ? 'bg-gradient-to-r from-emerald-500 to-teal-400'
                : 'bg-gradient-to-r from-sky-500 to-teal-500'
            }`}
            style={{ width: `${packedPercentage}%` }}
          />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 text-xs pt-1">
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleCheckAllGlobal(true)}
              className="text-sky-600 dark:text-sky-400 hover:underline font-bold"
            >
              Check All
            </button>
            <span className="text-slate-300 dark:text-slate-700">•</span>
            <button
              onClick={() => handleCheckAllGlobal(false)}
              className="text-slate-500 hover:underline font-bold"
            >
              Uncheck All
            </button>
          </div>

          <div className="text-slate-500 dark:text-slate-400 font-medium">
            💡 <strong className="text-slate-700 dark:text-slate-300">Tip:</strong> Items saved automatically to your device.
          </div>
        </div>
      </div>

      {/* Quick Filters & Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search items or categories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
        </div>

        {/* Status Filter Pills */}
        <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shrink-0">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1 text-xs font-extrabold rounded-lg transition-all ${
              statusFilter === 'all'
                ? 'bg-sky-500 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            All ({totalItems})
          </button>
          <button
            onClick={() => setStatusFilter('unpacked')}
            className={`px-3 py-1 text-xs font-extrabold rounded-lg transition-all ${
              statusFilter === 'unpacked'
                ? 'bg-amber-500 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            To Pack ({totalItems - packedCount})
          </button>
          <button
            onClick={() => setStatusFilter('packed')}
            className={`px-3 py-1 text-xs font-extrabold rounded-lg transition-all ${
              statusFilter === 'packed'
                ? 'bg-emerald-500 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Packed ({packedCount})
          </button>
        </div>
      </div>

      {/* Add Custom Item Form */}
      <form onSubmit={handleAddItem} className="bg-sky-50/50 dark:bg-slate-800/40 border border-sky-100 dark:border-slate-700/60 p-4 rounded-2xl flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
        <input
          type="text"
          placeholder="Add custom item (e.g., Camera lens, Swimming goggles...)"
          value={newItemName}
          onChange={(e) => setNewItemName(e.target.value)}
          className="flex-1 px-3.5 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500"
        />

        <select
          value={newItemCategory}
          onChange={(e) => setNewItemCategory(e.target.value)}
          className="px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
        >
          {categoriesList.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
          <option value="Custom Essentials">+ New Category</option>
        </select>

        <button
          type="submit"
          disabled={!newItemName.trim()}
          className="px-4 py-2 bg-sky-500 hover:bg-sky-600 disabled:opacity-50 text-white text-xs font-extrabold rounded-xl shadow-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add Item</span>
        </button>
      </form>

      {/* Categorized Checklist Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
        {categoriesList.map((categoryName) => {
          const categoryItems = filteredItems.filter((i) => i.category === categoryName);
          if (categoryItems.length === 0) return null;

          const catTotal = items.filter((i) => i.category === categoryName).length;
          const catPacked = items.filter((i) => i.category === categoryName && i.packed).length;
          const isCatAllPacked = catTotal > 0 && catPacked === catTotal;

          const IconComponent = CATEGORY_ICONS[categoryName] || ShoppingBag;

          return (
            <div
              key={categoryName}
              className="bg-slate-50 dark:bg-slate-950/50 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 space-y-3.5 shadow-xs"
            >
              {/* Category Header */}
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2.5">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-sky-500/10 text-sky-500 rounded-lg">
                    <IconComponent className="w-4 h-4" />
                  </div>
                  <h4 className="text-sm font-black text-slate-900 dark:text-white">
                    {categoryName}
                  </h4>
                </div>

                <div className="flex items-center gap-2 text-xs">
                  <span className="font-bold text-slate-500 dark:text-slate-400 text-[11px]">
                    {catPacked}/{catTotal}
                  </span>
                  <button
                    onClick={() => handleCheckAllCategory(categoryName, !isCatAllPacked)}
                    className="text-[11px] font-extrabold text-sky-600 dark:text-sky-400 hover:underline"
                  >
                    {isCatAllPacked ? 'Uncheck' : 'Check All'}
                  </button>
                </div>
              </div>

              {/* Items List */}
              <ul className="space-y-2">
                {categoryItems.map((item) => (
                  <li
                    key={item.id}
                    className="group flex items-center justify-between gap-3 p-2 rounded-xl hover:bg-white dark:hover:bg-slate-800/80 transition-colors select-none"
                  >
                    <div
                      onClick={() => toggleItemPacked(item.id)}
                      className="flex items-center gap-2.5 flex-1 cursor-pointer"
                    >
                      {item.packed ? (
                        <CheckSquare className="w-4 h-4 text-emerald-500 shrink-0" />
                      ) : (
                        <Square className="w-4 h-4 text-slate-400 dark:text-slate-500 shrink-0" />
                      )}
                      <span
                        className={`text-xs font-semibold ${
                          item.packed
                            ? 'line-through text-slate-400 dark:text-slate-500'
                            : 'text-slate-800 dark:text-slate-200'
                        }`}
                      >
                        {item.name}
                      </span>
                      {item.isCustom && (
                        <span className="text-[9px] px-1.5 py-0.2 font-extrabold uppercase bg-amber-500/20 text-amber-600 dark:text-amber-400 rounded">
                          Custom
                        </span>
                      )}
                    </div>

                    <button
                      onClick={() => handleDeleteItem(item.id)}
                      className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-rose-500 transition-all rounded-md"
                      title="Remove item"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>

      {filteredItems.length === 0 && (
        <div className="py-12 text-center text-slate-400 dark:text-slate-500 space-y-2">
          <Search className="w-8 h-8 mx-auto text-slate-300 dark:text-slate-600" />
          <p className="text-xs font-bold">No packing items match your search or filter.</p>
        </div>
      )}
    </div>
  );
};
