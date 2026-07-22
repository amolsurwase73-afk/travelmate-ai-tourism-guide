import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { FAQItem } from '../types';

interface FAQViewProps {
  faqs: FAQItem[];
}

export const FAQView: React.FC<FAQViewProps> = ({ faqs }) => {
  const [openIndices, setOpenIndices] = useState<Record<number, boolean>>({ 0: true });

  const toggleAccordion = (index: number) => {
    setOpenIndices((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  return (
    <div className="bg-white dark:bg-slate-800/90 rounded-3xl border border-slate-200/80 dark:border-slate-700/80 p-6 sm:p-8 space-y-6">
      <div className="flex items-center gap-3 text-sky-500">
        <HelpCircle className="w-7 h-7" />
        <div>
          <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
            Frequently Asked Questions
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Everything you need to know before visiting this destination.
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {faqs.map((faq, index) => {
          const isOpen = openIndices[index] || false;
          return (
            <div
              key={index}
              className="bg-slate-50 dark:bg-slate-900/60 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 overflow-hidden transition-all"
            >
              <button
                onClick={() => toggleAccordion(index)}
                className="w-full text-left p-4 sm:p-5 font-extrabold text-sm sm:text-base text-slate-900 dark:text-white flex items-center justify-between gap-4 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <span>{faq.question}</span>
                {isOpen ? <ChevronUp className="w-5 h-5 text-sky-500 shrink-0" /> : <ChevronDown className="w-5 h-5 text-slate-400 shrink-0" />}
              </button>

              {isOpen && (
                <div className="p-4 sm:p-5 pt-0 text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-normal leading-relaxed border-t border-slate-200/40 dark:border-slate-800/40 mt-1">
                  {faq.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
