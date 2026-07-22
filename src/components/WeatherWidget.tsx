import React, { useState, useEffect } from 'react';
import {
  Sun,
  CloudSun,
  Cloud,
  CloudRain,
  CloudSnow,
  CloudLightning,
  CloudFog,
  Wind,
  Droplets,
  Thermometer,
  RefreshCw,
  AlertCircle,
  Calendar,
} from 'lucide-react';

interface WeatherData {
  locationName: string;
  country?: string;
  currentTemp: number;
  windSpeed: number;
  weatherCode: number;
  dailyForecast: Array<{
    date: string;
    maxTemp: number;
    minTemp: number;
    weatherCode: number;
    precipSum: number;
  }>;
}

export interface WeatherAlert {
  type: 'thunderstorm' | 'heat' | 'cold' | 'rain' | 'wind';
  severity: 'high' | 'medium';
  title: string;
  description: string;
}

export interface WeatherInfo {
  temp: number;
  code: number;
  label: string;
  icon: React.FC<{ className?: string }>;
  color: string;
  alerts?: WeatherAlert[];
}

interface WeatherWidgetProps {
  destination: string;
  onWeatherFetched?: (weatherInfo: WeatherInfo) => void;
  unit?: 'C' | 'F';
  onUnitChange?: (unit: 'C' | 'F') => void;
}

export function detectWeatherAlerts(
  currentTemp: number,
  currentCode: number,
  windSpeed: number,
  dailyForecast: Array<{ maxTemp: number; minTemp: number; weatherCode: number; precipSum: number }>
): WeatherAlert[] {
  const alerts: WeatherAlert[] = [];

  // Check Thunderstorm
  if ([95, 96, 99].includes(currentCode) || dailyForecast.some((d) => [95, 96, 99].includes(d.weatherCode))) {
    alerts.push({
      type: 'thunderstorm',
      severity: 'high',
      title: 'Thunderstorm & Lightning Warning',
      description: 'Severe thunderstorm or lightning risk detected. Stay indoors during rain spells and avoid elevated outdoor spots.',
    });
  }

  // Check Heavy Rain
  if (
    [65, 67, 82].includes(currentCode) ||
    dailyForecast.some((d) => [65, 67, 82].includes(d.weatherCode) || d.precipSum >= 20)
  ) {
    alerts.push({
      type: 'rain',
      severity: 'high',
      title: 'Heavy Rainfall Advisory',
      description: 'Substantial rain expected during travel dates. Pack umbrellas, waterproof shoes, and plan indoor alternatives.',
    });
  }

  // Check Extreme Heat
  const maxForecastTemp = Math.max(currentTemp, ...dailyForecast.map((d) => d.maxTemp));
  if (maxForecastTemp >= 35) {
    alerts.push({
      type: 'heat',
      severity: maxForecastTemp >= 39 ? 'high' : 'medium',
      title: `High Temperature Advisory (${maxForecastTemp}°C / ${Math.round((maxForecastTemp * 9) / 5 + 32)}°F)`,
      description: 'Hot climate conditions expected. Drink plenty of water, wear sunscreen, and restrict strenuous outdoor walks during afternoon peak heat.',
    });
  }

  // Check Extreme Cold
  const minForecastTemp = Math.min(currentTemp, ...dailyForecast.map((d) => d.minTemp));
  if (minForecastTemp <= 4) {
    alerts.push({
      type: 'cold',
      severity: minForecastTemp <= 0 ? 'high' : 'medium',
      title: `Low Temperature Alert (${minForecastTemp}°C / ${Math.round((minForecastTemp * 9) / 5 + 32)}°F)`,
      description: 'Cold weather expected. Carry heavy jackets, thermal wear, and check local road conditions for ice.',
    });
  }

  // Check High Wind
  if (windSpeed >= 35) {
    alerts.push({
      type: 'wind',
      severity: windSpeed >= 50 ? 'high' : 'medium',
      title: `High Wind Advisory (${windSpeed} km/h)`,
      description: 'Breezy or gusty winds reported. Take extra care on coastal cliffs, boat trips, or mountain view towers.',
    });
  }

  return alerts;
}

// Map WMO Weather Codes to human descriptions & Lucide Icon components
export function getWeatherDetails(code: number) {
  switch (code) {
    case 0:
      return { label: 'Sunny / Clear', icon: Sun, color: 'text-amber-400' };
    case 1:
    case 2:
      return { label: 'Partly Cloudy', icon: CloudSun, color: 'text-amber-200' };
    case 3:
      return { label: 'Overcast', icon: Cloud, color: 'text-slate-300' };
    case 45:
    case 48:
      return { label: 'Foggy', icon: CloudFog, color: 'text-slate-300' };
    case 51:
    case 53:
    case 55:
    case 56:
    case 57:
      return { label: 'Light Drizzle', icon: CloudRain, color: 'text-sky-300' };
    case 61:
    case 63:
    case 65:
    case 66:
    case 67:
      return { label: 'Rainy', icon: CloudRain, color: 'text-sky-400' };
    case 71:
    case 73:
    case 75:
    case 77:
      return { label: 'Snowy', icon: CloudSnow, color: 'text-teal-200' };
    case 80:
    case 81:
    case 82:
      return { label: 'Rain Showers', icon: CloudRain, color: 'text-sky-400' };
    case 95:
    case 96:
    case 99:
      return { label: 'Thunderstorm', icon: CloudLightning, color: 'text-purple-300' };
    default:
      return { label: 'Fair Weather', icon: CloudSun, color: 'text-amber-300' };
  }
}

export const WeatherWidget: React.FC<WeatherWidgetProps> = ({
  destination,
  onWeatherFetched,
  unit = 'C',
  onUnitChange,
}) => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const convertTemp = (tempInC: number) => (unit === 'F' ? Math.round((tempInC * 9) / 5 + 32) : tempInC);

  const fetchWeather = async () => {
    setLoading(true);
    setError(null);

    try {
      // 1. Geocode destination name to lat/lng using Open-Meteo Geocoding API
      const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
        destination
      )}&count=1&language=en&format=json`;
      
      const geoRes = await fetch(geoUrl);
      const geoData = await geoRes.json();

      if (!geoData.results || geoData.results.length === 0) {
        throw new Error(`Location coordinates not found for "${destination}"`);
      }

      const match = geoData.results[0];
      const lat = match.latitude;
      const lng = match.longitude;

      // 2. Fetch real-time weather & 5-day forecast
      const forecastUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current_weather=true&daily=temperature_2m_max,temperature_2m_min,weathercode,precipitation_sum&timezone=auto`;
      
      const forecastRes = await fetch(forecastUrl);
      const forecastData = await forecastRes.json();

      if (!forecastData.current_weather || !forecastData.daily) {
        throw new Error('Weather forecast unavailable');
      }

      const current = forecastData.current_weather;
      const daily = forecastData.daily;

      const dailyList = daily.time.slice(0, 5).map((dateStr: string, index: number) => ({
        date: dateStr,
        maxTemp: Math.round(daily.temperature_2m_max[index]),
        minTemp: Math.round(daily.temperature_2m_min[index]),
        weatherCode: daily.weathercode[index],
        precipSum: daily.precipitation_sum ? daily.precipitation_sum[index] : 0,
      }));

      const currentTempRounded = Math.round(current.temperature);
      const currentCode = current.weathercode;
      const condition = getWeatherDetails(currentCode);
      const windSpeedRounded = Math.round(current.windspeed);

      const alerts = detectWeatherAlerts(currentTempRounded, currentCode, windSpeedRounded, dailyList);

      setWeather({
        locationName: match.name,
        country: match.country,
        currentTemp: currentTempRounded,
        windSpeed: windSpeedRounded,
        weatherCode: currentCode,
        dailyForecast: dailyList,
      });

      if (onWeatherFetched) {
        onWeatherFetched({
          temp: currentTempRounded,
          code: currentCode,
          label: condition.label,
          icon: condition.icon,
          color: condition.color,
          alerts,
        });
      }
    } catch (err: any) {
      console.error('Weather fetch error:', err);
      setError(err.message || 'Failed to load weather forecast');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (destination) {
      fetchWeather();
    }
  }, [destination]);

  if (loading) {
    return (
      <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-4 flex items-center justify-between text-white animate-pulse">
        <div className="flex items-center gap-3">
          <RefreshCw className="w-5 h-5 text-sky-300 animate-spin" />
          <span className="text-xs font-semibold text-slate-200">
            Fetching real-time weather for {destination}...
          </span>
        </div>
      </div>
    );
  }

  if (error || !weather) {
    return (
      <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-4 flex items-center justify-between text-white">
        <div className="flex items-center gap-2 text-xs text-rose-300 font-medium">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
          <span>Real-time weather unavailable for {destination}</span>
        </div>
        <button
          onClick={fetchWeather}
          className="px-2.5 py-1 text-[11px] font-bold bg-white/20 hover:bg-white/30 rounded-lg text-white transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  const currentCondition = getWeatherDetails(weather.weatherCode);
  const IconComponent = currentCondition.icon;

  return (
    <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-4 sm:p-5 text-white space-y-4">
      {/* Current Real-time Weather Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-white/15 rounded-2xl text-amber-300">
            <IconComponent className={`w-8 h-8 ${currentCondition.color}`} />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase tracking-wider font-extrabold text-sky-300 bg-sky-500/20 px-2 py-0.5 rounded-md border border-sky-400/30">
                Live Forecast
              </span>
              <span className="text-xs font-bold text-slate-300">
                {weather.locationName}{weather.country ? `, ${weather.country}` : ''}
              </span>
            </div>

            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-2xl sm:text-3xl font-black">
                {convertTemp(weather.currentTemp)}°{unit}
              </span>
              <span className="text-xs font-semibold text-slate-200">{currentCondition.label}</span>
            </div>
          </div>
        </div>

        {/* Extra Weather Indicators */}
        <div className="flex items-center gap-3 sm:gap-4 text-xs text-slate-300 font-medium flex-wrap">
          <div className="flex items-center gap-1.5 bg-white/5 px-3 py-1.5 rounded-xl border border-white/10">
            <Wind className="w-4 h-4 text-sky-300" />
            <span>{weather.windSpeed} km/h wind</span>
          </div>

          {/* Unit Toggle Pill */}
          <div className="flex items-center p-0.5 bg-white/10 rounded-xl border border-white/15">
            <button
              id="weather-unit-c-btn"
              onClick={() => onUnitChange && onUnitChange('C')}
              className={`px-2.5 py-1 text-xs font-black rounded-lg transition-all ${
                unit === 'C'
                  ? 'bg-sky-500 text-white shadow-xs'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              °C
            </button>
            <button
              id="weather-unit-f-btn"
              onClick={() => onUnitChange && onUnitChange('F')}
              className={`px-2.5 py-1 text-xs font-black rounded-lg transition-all ${
                unit === 'F'
                  ? 'bg-sky-500 text-white shadow-xs'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              °F
            </button>
          </div>

          <button
            onClick={fetchWeather}
            className="p-2 bg-white/10 hover:bg-white/20 rounded-xl transition-colors text-slate-200 hover:text-white"
            title="Refresh Live Weather"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 5-Day Weather Forecast Strip */}
      <div>
        <div className="text-[11px] font-bold uppercase tracking-wider text-sky-200 mb-2 flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5 text-sky-400" /> 5-Day Temperature Outlook
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {weather.dailyForecast.map((day, idx) => {
            const dayCondition = getWeatherDetails(day.weatherCode);
            const DayIcon = dayCondition.icon;
            const dateObj = new Date(day.date);
            const dayName = idx === 0 ? 'Today' : dateObj.toLocaleDateString('en-US', { weekday: 'short' });

            return (
              <div
                key={day.date}
                className="bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl p-2.5 text-center transition-all"
              >
                <div className="text-[11px] font-bold text-slate-300">{dayName}</div>
                <div className="my-1 flex justify-center">
                  <DayIcon className={`w-5 h-5 ${dayCondition.color}`} />
                </div>
                <div className="text-xs font-black text-white">
                  {convertTemp(day.maxTemp)}° / <span className="text-slate-400 font-medium">{convertTemp(day.minTemp)}°</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
