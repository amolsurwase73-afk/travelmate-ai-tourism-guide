import React from 'react';
import {
  PhoneCall,
  Shield,
  Siren,
  Building,
} from 'lucide-react';
import { EmergencyInfo, PackingCategory } from '../types';
import { SmartPackingList } from './SmartPackingList';

interface EmergencyAndChecklistProps {
  emergencyInfo: EmergencyInfo;
  packingChecklist: PackingCategory[];
  destination?: string;
  durationDays?: number;
  travelStyle?: string;
}

export const EmergencyAndChecklist: React.FC<EmergencyAndChecklistProps> = ({
  emergencyInfo,
  packingChecklist,
  destination = 'Destination',
  durationDays = 5,
  travelStyle = 'General',
}) => {
  return (
    <div className="space-y-8">
      {/* Emergency Contacts Section */}
      <div className="bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50 rounded-3xl p-6 sm:p-8 space-y-6">
        <div className="flex items-center gap-3 text-rose-600 dark:text-rose-400">
          <Siren className="w-7 h-7 animate-pulse" />
          <div>
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
              Emergency Contacts & Support
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              Important local helpline numbers and nearby hospital contacts for {destination}.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-rose-100 dark:border-rose-900/30 shadow-xs">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Police Helpline</span>
            <div className="flex items-center gap-2 mt-1 text-slate-900 dark:text-white font-black text-lg">
              <Shield className="w-5 h-5 text-sky-500" />
              <span>{emergencyInfo.policeNumber}</span>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-rose-100 dark:border-rose-900/30 shadow-xs">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Ambulance</span>
            <div className="flex items-center gap-2 mt-1 text-slate-900 dark:text-white font-black text-lg">
              <PhoneCall className="w-5 h-5 text-rose-500" />
              <span>{emergencyInfo.ambulanceNumber}</span>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-rose-100 dark:border-rose-900/30 shadow-xs">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Tourist Helpline</span>
            <div className="flex items-center gap-2 mt-1 text-slate-900 dark:text-white font-black text-lg">
              <PhoneCall className="w-5 h-5 text-amber-500" />
              <span>{emergencyInfo.touristHelpline}</span>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-rose-100 dark:border-rose-900/30 shadow-xs">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Embassy / Assistance</span>
            <div className="flex items-center gap-2 mt-1 text-slate-900 dark:text-white font-bold text-xs">
              <Building className="w-5 h-5 text-teal-500 shrink-0" />
              <span>{emergencyInfo.embassyOrLocalAssistance}</span>
            </div>
          </div>
        </div>

        {/* Nearby Hospitals */}
        {emergencyInfo.nearbyHospitals && emergencyInfo.nearbyHospitals.length > 0 && (
          <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-rose-100 dark:border-rose-900/30">
            <h4 className="text-xs font-extrabold uppercase text-slate-500 dark:text-slate-400 mb-2">
              Recommended Nearby Hospitals
            </h4>
            <div className="flex flex-wrap gap-2">
              {emergencyInfo.nearbyHospitals.map((hosp, i) => (
                <span
                  key={i}
                  className="px-3 py-1 bg-rose-50 dark:bg-rose-950/40 text-rose-900 dark:text-rose-200 text-xs font-semibold rounded-lg border border-rose-200/60 dark:border-rose-800/60"
                >
                  🏥 {hosp}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Interactive Smart Packing Checklist Generator */}
      <SmartPackingList
        initialChecklist={packingChecklist}
        destination={destination}
        durationDays={durationDays}
        travelStyle={travelStyle}
      />
    </div>
  );
};

