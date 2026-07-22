import React, { useState, useEffect } from 'react';
import {
  APIProvider,
  Map,
  AdvancedMarker,
  Pin,
  InfoWindow,
  useMap,
  useMapsLibrary,
  useAdvancedMarkerRef,
} from '@vis.gl/react-google-maps';
import { MapPin, Navigation, Compass, Star, Key, ExternalLink, Info, Layers } from 'lucide-react';
import { AttractionItem } from '../types';

interface DestinationMapProps {
  destination: string;
  attractions: AttractionItem[];
}

const API_KEY =
  process.env.GOOGLE_MAPS_PLATFORM_KEY ||
  (import.meta as any).env?.VITE_GOOGLE_MAPS_PLATFORM_KEY ||
  (globalThis as any).GOOGLE_MAPS_PLATFORM_KEY ||
  '';

const hasValidKey = Boolean(API_KEY) && API_KEY !== 'YOUR_API_KEY';

interface GeocodedPlace {
  id: string;
  name: string;
  category: string;
  description: string;
  entryFee: string;
  openingHours: string;
  lat: number;
  lng: number;
}

// Category color mappings for map pins
function getCategoryPinStyle(category: string) {
  switch (category) {
    case 'top_attraction':
      return { bg: '#f59e0b', glyph: '#ffffff', label: 'Top Sight' };
    case 'hidden_gem':
      return { bg: '#a855f7', glyph: '#ffffff', label: 'Hidden Gem' };
    case 'historical':
      return { bg: '#f43f5e', glyph: '#ffffff', label: 'Historic' };
    case 'adventure':
      return { bg: '#10b981', glyph: '#ffffff', label: 'Adventure' };
    case 'family_friendly':
      return { bg: '#06b6d4', glyph: '#ffffff', label: 'Family' };
    case 'free':
      return { bg: '#3b82f6', glyph: '#ffffff', label: 'Free' };
    default:
      return { bg: '#38bdf8', glyph: '#ffffff', label: 'Attraction' };
  }
}

// Map markers & geocoding inner manager
const MapContent: React.FC<{
  destination: string;
  attractions: AttractionItem[];
}> = ({ destination, attractions }) => {
  const map = useMap();
  const geocodingLib = useMapsLibrary('geocoding');

  const [center, setCenter] = useState<{ lat: number; lng: number }>({ lat: 48.8566, lng: 2.3522 });
  const [places, setPlaces] = useState<GeocodedPlace[]>([]);
  const [selectedPlace, setSelectedPlace] = useState<GeocodedPlace | null>(null);
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [geocoding, setGeocoding] = useState<boolean>(true);

  // Geocode destination & attractions
  useEffect(() => {
    let isMounted = true;

    async function geocodeLocation() {
      if (!destination) return;
      setGeocoding(true);

      try {
        let destLat = 48.8566;
        let destLng = 2.3522;

        // Geocode via JS SDK or fallback API
        if (geocodingLib && window.google) {
          const geocoder = new geocodingLib.Geocoder();
          const res = await geocoder.geocode({ address: destination });
          if (res.results && res.results[0]) {
            const loc = res.results[0].geometry.location;
            destLat = loc.lat();
            destLng = loc.lng();
          }
        } else {
          // Open-Meteo Geocoding API as reliable fallback
          const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
            destination
          )}&count=1&language=en&format=json`;
          const geoRes = await fetch(geoUrl);
          const geoData = await geoRes.json();
          if (geoData.results && geoData.results[0]) {
            destLat = geoData.results[0].latitude;
            destLng = geoData.results[0].longitude;
          }
        }

        if (isMounted) {
          setCenter({ lat: destLat, lng: destLng });
          if (map) {
            map.panTo({ lat: destLat, lng: destLng });
          }
        }

        // Geocode attractions relative to destination center
        const geocodedList: GeocodedPlace[] = [];

        // Spread attractions slightly around center if geocoder is busy
        const baseAngleStep = (2 * Math.PI) / (attractions.length || 1);

        for (let idx = 0; idx < (attractions || []).length; idx++) {
          const item = attractions[idx];
          let placeLat = destLat;
          let placeLng = destLng;

          try {
            if (geocodingLib && window.google) {
              const geocoder = new geocodingLib.Geocoder();
              const result = await geocoder.geocode({ address: `${item.name}, ${destination}` });
              if (result.results && result.results[0]) {
                const l = result.results[0].geometry.location;
                placeLat = l.lat();
                placeLng = l.lng();
              } else {
                // Offset around center radius
                const angle = idx * baseAngleStep;
                const offsetRadius = 0.012 + (idx % 3) * 0.008;
                placeLat = destLat + Math.cos(angle) * offsetRadius;
                placeLng = destLng + Math.sin(angle) * offsetRadius;
              }
            } else {
              const angle = idx * baseAngleStep;
              const offsetRadius = 0.012 + (idx % 3) * 0.008;
              placeLat = destLat + Math.cos(angle) * offsetRadius;
              placeLng = destLng + Math.sin(angle) * offsetRadius;
            }
          } catch {
            const angle = idx * baseAngleStep;
            const offsetRadius = 0.012 + (idx % 3) * 0.008;
            placeLat = destLat + Math.cos(angle) * offsetRadius;
            placeLng = destLng + Math.sin(angle) * offsetRadius;
          }

          geocodedList.push({
            id: item.id || `attraction-${idx}`,
            name: item.name,
            category: item.category,
            description: item.description,
            entryFee: item.entryFee,
            openingHours: item.openingHours,
            lat: placeLat,
            lng: placeLng,
          });
        }

        if (isMounted) {
          setPlaces(geocodedList);
        }
      } catch (e) {
        console.warn('Map geocoding notice:', e);
      } finally {
        if (isMounted) setGeocoding(false);
      }
    }

    geocodeLocation();

    return () => {
      isMounted = false;
    };
  }, [destination, attractions, geocodingLib, map]);

  const filteredPlaces = places.filter((p) => {
    if (activeFilter === 'all') return true;
    return p.category === activeFilter;
  });

  const recenterMap = () => {
    if (map) {
      map.panTo(center);
      map.setZoom(12);
    }
  };

  return (
    <>
      {/* Interactive Controls Bar overlay on Map */}
      <div className="absolute top-3 left-3 right-3 z-10 flex flex-wrap items-center justify-between gap-2 pointer-events-auto">
        {/* Category Filters */}
        <div className="flex items-center gap-1 bg-slate-900/90 backdrop-blur-md p-1 rounded-xl border border-white/20 shadow-xl overflow-x-auto max-w-full">
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition-all ${
              activeFilter === 'all'
                ? 'bg-sky-500 text-white shadow-xs'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            All ({places.length})
          </button>
          <button
            onClick={() => setActiveFilter('top_attraction')}
            className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition-all ${
              activeFilter === 'top_attraction'
                ? 'bg-amber-500 text-white shadow-xs'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            Top Sights
          </button>
          <button
            onClick={() => setActiveFilter('hidden_gem')}
            className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition-all ${
              activeFilter === 'hidden_gem'
                ? 'bg-purple-500 text-white shadow-xs'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            Hidden Gems
          </button>
          <button
            onClick={() => setActiveFilter('historical')}
            className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition-all ${
              activeFilter === 'historical'
                ? 'bg-rose-500 text-white shadow-xs'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            Historic
          </button>
        </div>

        <button
          onClick={recenterMap}
          className="px-3 py-1.5 bg-slate-900/90 hover:bg-slate-800 text-sky-300 border border-white/20 text-xs font-bold rounded-xl shadow-xl flex items-center gap-1.5 transition-all"
          title="Recenter Map"
        >
          <Navigation className="w-3.5 h-3.5" />
          <span>Recenter</span>
        </button>
      </div>

      {/* Main Destination Center Marker */}
      <AdvancedMarker position={center}>
        <div className="p-2 bg-sky-500 text-white rounded-full shadow-2xl border-2 border-white animate-bounce">
          <MapPin className="w-5 h-5 fill-current" />
        </div>
      </AdvancedMarker>

      {/* Attraction Place Markers */}
      {filteredPlaces.map((place) => {
        const pinStyle = getCategoryPinStyle(place.category);
        return (
          <AdvancedMarker
            key={place.id}
            position={{ lat: place.lat, lng: place.lng }}
            onClick={() => setSelectedPlace(place)}
            title={place.name}
          >
            <Pin background={pinStyle.bg} glyphColor={pinStyle.glyph} borderColor="#ffffff" />
          </AdvancedMarker>
        );
      })}

      {/* Selected Marker Info Window */}
      {selectedPlace && (
        <InfoWindow
          position={{ lat: selectedPlace.lat, lng: selectedPlace.lng }}
          onCloseClick={() => setSelectedPlace(null)}
        >
          <div className="p-1 max-w-xs text-slate-900 space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 text-[10px] uppercase font-extrabold bg-sky-100 text-sky-800 rounded-md">
                {getCategoryPinStyle(selectedPlace.category).label}
              </span>
            </div>
            <h5 className="font-extrabold text-sm text-slate-900">{selectedPlace.name}</h5>
            <p className="text-xs text-slate-600 line-clamp-2 leading-snug">{selectedPlace.description}</p>

            <div className="pt-1 border-t border-slate-200 flex items-center justify-between text-[11px] font-semibold text-slate-700">
              <span>Fee: {selectedPlace.entryFee || 'Free/Varies'}</span>
              <span>Hours: {selectedPlace.openingHours || 'Daily'}</span>
            </div>
          </div>
        </InfoWindow>
      )}
    </>
  );
};

export const DestinationMap: React.FC<DestinationMapProps> = ({ destination, attractions }) => {
  // Setup instructions splash card if key is missing
  if (!hasValidKey) {
    return (
      <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-5 text-white space-y-4">
        <div className="flex items-start justify-between gap-3 border-b border-white/10 pb-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-sky-500/20 text-sky-300 rounded-2xl border border-sky-400/30">
              <Compass className="w-6 h-6 animate-spin-slow" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-400/30 rounded-md">
                  Google Maps Integration
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-black text-white mt-0.5">
                Geographic Map & Attractions Visualizer
              </h3>
            </div>
          </div>
        </div>

        {/* API Key Setup Instructions Splash Card */}
        <div className="bg-slate-900/80 border border-amber-400/30 rounded-xl p-4 text-xs space-y-3">
          <div className="flex items-center gap-2 font-black text-amber-300 text-sm">
            <Key className="w-4 h-4 text-amber-400" />
            <span>Google Maps Platform API Key Setup Required</span>
          </div>

          <p className="text-slate-300 leading-relaxed font-medium">
            To render real-time interactive vector maps and geocoded attraction pins for{' '}
            <strong className="text-sky-300">{destination}</strong>, add your Google Maps API key in AI Studio Secrets:
          </p>

          <ol className="list-decimal list-inside space-y-1.5 text-slate-200 font-medium pl-1">
            <li>
              Get an API key from{' '}
              <a
                href="https://console.cloud.google.com/google/maps-apis/start?utm_campaign=gmp-code-assist-ais"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sky-400 hover:underline font-bold inline-flex items-center gap-0.5"
              >
                Google Maps Cloud Console <ExternalLink className="w-3 h-3" />
              </a>
            </li>
            <li>
              When the <strong className="text-amber-200">"Enter your environment variable to continue"</strong> popup appears, paste your key.
            </li>
            <li>
              Or manually: Open <strong className="text-white">Settings (⚙️ top-right)</strong> →{' '}
              <strong className="text-white">Secrets</strong> → type <code className="bg-slate-800 text-amber-300 px-1.5 py-0.5 rounded font-mono">GOOGLE_MAPS_PLATFORM_KEY</code> → paste key → Enter.
            </li>
          </ol>

          <div className="text-[11px] text-sky-200/80 pt-1 border-t border-slate-800 flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 text-sky-400 shrink-0" />
            <span>The app rebuilds automatically upon secret save—no manual reload needed.</span>
          </div>
        </div>

        {/* Attractions Location Preview List */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-sky-200 mb-2 flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-sky-400" /> Attractions Preview ({attractions.length})
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {attractions.slice(0, 6).map((item) => (
              <div
                key={item.id || item.name}
                className="bg-white/5 border border-white/10 rounded-xl p-2.5 text-left text-xs space-y-1"
              >
                <div className="font-extrabold text-white flex items-center justify-between">
                  <span>{item.name}</span>
                  <span className="text-[10px] text-sky-300 font-semibold bg-sky-500/20 px-1.5 py-0.5 rounded">
                    {item.category.replace('_', ' ')}
                  </span>
                </div>
                <p className="text-slate-300 text-[11px] line-clamp-1">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Live Map rendering when key is active
  return (
    <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-4 sm:p-5 text-white space-y-3">
      <div className="flex items-center justify-between border-b border-white/10 pb-2">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-sky-500/20 text-sky-300 rounded-lg border border-sky-400/30">
            <MapPin className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-black text-white">
              Geographic Map & Attractions ({attractions.length})
            </h4>
            <p className="text-[11px] text-sky-200">Interactive Google Map for {destination}</p>
          </div>
        </div>
      </div>

      <div className="relative w-full h-[360px] rounded-xl overflow-hidden border border-white/20 shadow-xl">
        <APIProvider apiKey={API_KEY} version="weekly">
          <Map
            defaultCenter={{ lat: 48.8566, lng: 2.3522 }}
            defaultZoom={12}
            mapId="DEMO_MAP_ID"
            internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
            style={{ width: '100%', height: '100%' }}
            gestureHandling="greedy"
            disableDefaultUI={false}
          >
            <MapContent destination={destination} attractions={attractions} />
          </Map>
        </APIProvider>
      </div>
    </div>
  );
};
