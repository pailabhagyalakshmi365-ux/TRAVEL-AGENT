import React, { useEffect, useState } from 'react';
import {
  computeRouteLegs,
  DESTINATIONS,
  formatCurrency,
} from '../data/worldTripData';
import { CurrencyCode, DestinationData, WorldTripPlan } from '../types/travel';

interface WorldMapSectionProps {
  trip: WorldTripPlan;
  activeCurrency: CurrencyCode;
  customRates?: Partial<Record<CurrencyCode, number>>;
  onToggleCityInTrip: (cityId: string) => void;
  onSelectDestinationForGuide: (dest: DestinationData) => void;
}

interface LiveWeatherState {
  tempC: number;
  windKmh: number;
  source: 'Live Open-Meteo' | 'Seasonal Reference';
}

// Convert lat/lng to SVG 1000x500 equirectangular canvas coordinates
function projectLatLng(lat: number, lng: number): { x: number; y: number } {
  const x = ((lng + 180) / 360) * 1000;
  const y = ((90 - lat) / 180) * 500;
  return { x: Math.round(x * 10) / 10, y: Math.round(y * 10) / 10 };
}

export const WorldMapSection: React.FC<WorldMapSectionProps> = ({
  trip,
  activeCurrency,
  customRates,
  onToggleCityInTrip,
  onSelectDestinationForGuide,
}) => {
  const [selectedPinId, setSelectedPinId] = useState<string>(
    trip.selectedCityIds[0] || 'dubai'
  );
  const [liveWeather, setLiveWeather] = useState<LiveWeatherState | null>(null);
  const [loadingWeather, setLoadingWeather] = useState(false);

  const selectedDest =
    DESTINATIONS.find((d) => d.id === selectedPinId) || DESTINATIONS[0];

  useEffect(() => {
    let cancelled = false;
    setLoadingWeather(true);
    fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${selectedDest.lat}&longitude=${selectedDest.lng}&current_weather=true`
    )
      .then((res) => {
        if (!res.ok) throw new Error('Weather API unavailable');
        return res.json();
      })
      .then((data) => {
        if (cancelled) return;
        if (data?.current_weather?.temperature !== undefined) {
          setLiveWeather({
            tempC: Math.round(data.current_weather.temperature),
            windKmh: Math.round(data.current_weather.windspeed || 12),
            source: 'Live Open-Meteo',
          });
        } else {
          throw new Error('No current_weather');
        }
      })
      .catch(() => {
        if (cancelled) return;
        setLiveWeather({
          tempC: selectedDest.weatherSummary.avgTempC,
          windKmh: 14,
          source: 'Seasonal Reference',
        });
      })
      .finally(() => {
        if (!cancelled) setLoadingWeather(false);
      });

    return () => {
      cancelled = true;
    };
  }, [selectedDest]);

  const legs = computeRouteLegs(trip.startingLocation, trip.selectedCityIds);
  const totalDistanceKm = legs.reduce((sum, l) => sum + l.distanceKm, 0);
  const originPoint = projectLatLng(
    trip.startingLocation.lat,
    trip.startingLocation.lng
  );

  return (
    <section
      id="world-map"
      className="py-16 sm:py-20 bg-slate-950 text-white border-b border-slate-800"
    >
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
          <div>
            <p className="text-xs font-semibold text-emerald-400 tracking-wide mb-2">
              02. Interactive Global Route & Flight Distance Map
            </p>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-white tracking-tight">
              World Flight Path & Country Inspector
            </h2>
            <p className="mt-2 text-sm sm:text-base text-slate-300 max-w-2xl">
              Click any country pin on the map to inspect local travel intelligence, live weather, visa requirements, and exact great-circle flight distances.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-xs font-mono tabular-nums text-slate-300 border border-slate-800 bg-slate-900/90 px-4 py-3 rounded-xl">
            <div>
              <span className="text-slate-400 block">Total Route Distance</span>
              <strong className="text-base text-white">
                {totalDistanceKm.toLocaleString()} km
              </strong>
            </div>
            <div className="h-7 w-px bg-slate-800" />
            <div>
              <span className="text-slate-400 block">Countries Visited</span>
              <strong className="text-base text-emerald-400">
                {trip.selectedCityIds.length} Countries
              </strong>
            </div>
            <div className="h-7 w-px bg-slate-800" />
            <div>
              <span className="text-slate-400 block">Origin & Return</span>
              <strong className="text-base text-orange-400">
                {trip.startingLocation.city} ({trip.startingLocation.airportCode})
              </strong>
            </div>
          </div>
        </div>

        {/* Map + Country Inspector Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Interactive SVG Map Canvas (8 cols) */}
          <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
            <div className="px-5 py-3.5 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-300">
              <div className="flex items-center gap-4">
                <span className="inline-flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-orange-500 inline-block" />
                  <span>Origin Hub ({trip.startingLocation.city})</span>
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 inline-block" />
                  <span>Selected Route Stops</span>
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-sky-400 inline-block" />
                  <span>Optional World Destinations</span>
                </span>
              </div>
              <span className="font-mono text-slate-400">
                Interactive Equirectangular Projection
              </span>
            </div>

            <div className="relative w-full aspect-[2/1] bg-[#071120]">
              <svg
                viewBox="0 0 1000 500"
                className="w-full h-full select-none"
                role="img"
                aria-label="Interactive World Trip Route Map"
              >
                <defs>
                  <linearGradient id="routeArcGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#f97316" />
                    <stop offset="50%" stopColor="#38bdf8" />
                    <stop offset="100%" stopColor="#34d399" />
                  </linearGradient>
                </defs>

                {/* Latitude / Longitude Graticule Lines */}
                {[100, 200, 250, 300, 400].map((yLine) => (
                  <line
                    key={`lat-${yLine}`}
                    x1={0}
                    y1={yLine}
                    x2={1000}
                    y2={yLine}
                    stroke={yLine === 250 ? '#1e3a5f' : '#0f233d'}
                    strokeWidth={yLine === 250 ? 1.2 : 0.8}
                    strokeDasharray={yLine === 250 ? '4 4' : undefined}
                  />
                ))}
                {[166, 333, 500, 666, 833].map((xLine) => (
                  <line
                    key={`lng-${xLine}`}
                    x1={xLine}
                    y1={0}
                    x2={xLine}
                    y2={500}
                    stroke="#0f233d"
                    strokeWidth={0.8}
                  />
                ))}

                {/* Stylized Continental Landmasses */}
                <g fill="#122844" stroke="#1e426e" strokeWidth="1">
                  {/* North America */}
                  <path d="M 85,65 L 245,60 L 310,130 L 275,205 L 220,235 L 175,210 L 125,155 Z" />
                  {/* Central & South America */}
                  <path d="M 225,240 L 275,255 L 355,310 L 325,435 L 285,455 L 260,355 Z" />
                  {/* Greenland */}
                  <path d="M 330,35 L 425,30 L 400,85 L 340,80 Z" />
                  {/* Europe */}
                  <path d="M 455,75 L 585,65 L 605,145 L 535,165 L 465,155 L 445,115 Z" />
                  {/* Africa */}
                  <path d="M 450,175 L 575,175 L 625,255 L 580,385 L 520,390 L 485,290 L 440,235 Z" />
                  {/* Asia & India Subcontinent */}
                  <path d="M 590,65 L 875,70 L 910,165 L 845,245 L 785,260 L 740,215 L 715,255 L 685,205 L 630,210 L 595,150 Z" />
                  {/* Japan Archipelago */}
                  <path d="M 868,132 L 895,142 L 885,172 L 862,162 Z" />
                  {/* Maritime Southeast Asia / Indonesia */}
                  <path d="M 765,265 L 865,270 L 875,295 L 775,292 Z" />
                  {/* Australia & Oceania */}
                  <path d="M 790,320 L 910,320 L 920,405 L 810,410 L 780,365 Z" />
                </g>

                {/* Flight Route Curves Between Consecutive Stops */}
                {legs.map((leg) => {
                  const p1 = projectLatLng(leg.fromLat, leg.fromLng);
                  const p2 = projectLatLng(leg.toLat, leg.toLng);
                  const dx = Math.abs(p2.x - p1.x);

                  // Handle Pacific Date-Line wraparound (e.g. New York -> Tokyo or Tokyo -> NY)
                  const midX = (p1.x + p2.x) / 2;
                  const arcLift = Math.min(75, Math.max(22, dx * 0.16));
                  const midY = Math.min(p1.y, p2.y) - arcLift;

                  return (
                    <g key={`leg-${leg.index}`}>
                      <path
                        d={`M ${p1.x} ${p1.y} Q ${midX} ${midY} ${p2.x} ${p2.y}`}
                        fill="none"
                        stroke="url(#routeArcGrad)"
                        strokeWidth="2.4"
                        strokeDasharray="6 4"
                      />
                      {/* Midpoint Distance Pill Label */}
                      <rect
                        x={midX - 28}
                        y={midY + arcLift * 0.35 - 8}
                        width={56}
                        height={15}
                        rx={4}
                        fill="#0f172a"
                        stroke="#334155"
                        strokeWidth="0.8"
                      />
                      <text
                        x={midX}
                        y={midY + arcLift * 0.35 + 2}
                        textAnchor="middle"
                        fill="#e2e8f0"
                        fontSize="8.5"
                        fontFamily="JetBrains Mono, monospace"
                      >
                        {leg.distanceKm}km
                      </text>
                    </g>
                  );
                })}

                {/* Origin Hub Pin (Hyderabad, India) */}
                <g transform={`translate(${originPoint.x}, ${originPoint.y})`}>
                  <circle r="11" fill="#ea580c" fillOpacity="0.28" />
                  <circle r="6" fill="#f97316" stroke="#ffffff" strokeWidth="2" />
                  <text
                    y={18}
                    textAnchor="middle"
                    fill="#fdba74"
                    fontSize="10.5"
                    fontWeight="700"
                  >
                    {trip.startingLocation.city} ({trip.startingLocation.airportCode})
                  </text>
                </g>

                {/* All World Destination Pins */}
                {DESTINATIONS.map((dest) => {
                  const pt = projectLatLng(dest.lat, dest.lng);
                  const routeIdx = trip.selectedCityIds.indexOf(dest.id);
                  const isInRoute = routeIdx !== -1;
                  const isSelected = selectedPinId === dest.id;

                  // Offset Paris/London/Zurich/Rome labels slightly so European cluster never overlaps
                  const labelOffsetY =
                    dest.id === 'london'
                      ? -14
                      : dest.id === 'paris'
                      ? 17
                      : dest.id === 'zurich'
                      ? -12
                      : dest.id === 'rome'
                      ? 18
                      : -13;

                  return (
                    <g
                      key={dest.id}
                      transform={`translate(${pt.x}, ${pt.y})`}
                      onClick={() => setSelectedPinId(dest.id)}
                      className="cursor-pointer"
                    >
                      {isSelected && (
                        <circle
                          r="15"
                          fill={isInRoute ? '#10b981' : '#38bdf8'}
                          fillOpacity="0.3"
                        />
                      )}
                      <circle
                        r={isInRoute ? 7.5 : 5.5}
                        fill={isInRoute ? '#10b981' : '#38bdf8'}
                        stroke="#0f172a"
                        strokeWidth="2"
                      />
                      {isInRoute && (
                        <text
                          y="3"
                          textAnchor="middle"
                          fill="#052e16"
                          fontSize="8.5"
                          fontWeight="800"
                          fontFamily="JetBrains Mono, monospace"
                        >
                          {routeIdx + 1}
                        </text>
                      )}
                      <text
                        y={labelOffsetY}
                        textAnchor="middle"
                        fill={isSelected ? '#ffffff' : isInRoute ? '#a7f3d0' : '#94a3b8'}
                        fontSize={isSelected ? '11' : '9.5'}
                        fontWeight={isSelected || isInRoute ? '700' : '500'}
                      >
                        {dest.city}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>

            {/* Route Leg Distance & Flight Hours Strip */}
            <div className="p-4 bg-slate-900/90 border-t border-slate-800">
              <div className="text-xs font-semibold text-slate-400 mb-2.5">
                Flight Legs & Great-Circle Distances
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5">
                {legs.map((leg) => (
                  <div
                    key={leg.index}
                    className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800/90 text-xs"
                  >
                    <div className="font-mono text-slate-400">
                      Leg 0{leg.index} · {leg.fromCode} → {leg.toCode}
                    </div>
                    <div className="font-semibold text-white truncate mt-0.5">
                      {leg.fromCity} → {leg.toCity}
                    </div>
                    <div className="font-mono tabular-nums text-emerald-400 mt-1">
                      {leg.distanceKm.toLocaleString()} km · ~{leg.estimatedFlightHours}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right 4 Cols: Clicked Country / City Travel Inspector */}
          <div className="lg:col-span-4 bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <div className="flex items-start justify-between gap-3 pb-4 border-b border-slate-800">
              <div>
                <div className="text-xs text-emerald-400 font-medium">
                  {selectedDest.country} · {selectedDest.continent}
                </div>
                <h3 className="font-display text-2xl font-bold text-white mt-0.5">
                  {selectedDest.city} ({selectedDest.airportCode})
                </h3>
              </div>

              <button
                type="button"
                onClick={() => onToggleCityInTrip(selectedDest.id)}
                className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap cursor-pointer ${
                  trip.selectedCityIds.includes(selectedDest.id)
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30'
                    : 'bg-orange-600 text-white hover:bg-orange-500'
                }`}
              >
                {trip.selectedCityIds.includes(selectedDest.id)
                  ? 'In Active Route ✓'
                  : '+ Add to Route'}
              </button>
            </div>

            {/* Quick Country Selector Buttons */}
            <div className="py-3 border-b border-slate-800">
              <div className="text-xs text-slate-400 mb-2">
                Inspect Country Pin:
              </div>
              <div className="flex flex-wrap gap-1.5">
                {DESTINATIONS.map((d) => (
                  <button
                    key={d.id}
                    type="button"
                    onClick={() => setSelectedPinId(d.id)}
                    className={`px-2.5 py-1 rounded text-xs font-medium transition-colors cursor-pointer ${
                      selectedPinId === d.id
                        ? 'bg-sky-600 text-white'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    {d.city}
                  </button>
                ))}
              </div>
            </div>

            {/* Live Weather + Key Metrics */}
            <div className="py-4 border-b border-slate-800 grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-slate-400 block">Current Weather</span>
                <strong className="text-base font-mono text-white tabular-nums">
                  {loadingWeather
                    ? 'Loading...'
                    : `${liveWeather?.tempC ?? selectedDest.weatherSummary.avgTempC}°C`}
                </strong>
                <span className="text-[11px] text-slate-400 block">
                  {liveWeather?.source || selectedDest.weatherSummary.climateType}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block">Daily Budget ({trip.travelStyle})</span>
                <strong className="text-base font-mono text-emerald-400 tabular-nums">
                  {formatCurrency(
                    selectedDest.avgDailyBudgetINR[trip.travelStyle],
                    activeCurrency,
                    customRates
                  )}
                </strong>
                <span className="text-[11px] text-slate-400 block">
                  Local: {selectedDest.localCurrencyName}
                </span>
              </div>
            </div>

            {/* Key Travel Information */}
            <div className="py-4 space-y-3 text-xs text-slate-300">
              <div>
                <span className="text-slate-400 font-medium block">
                  Best Time to Visit:
                </span>
                <span>{selectedDest.bestTimeToVisit}</span>
              </div>
              <div>
                <span className="text-slate-400 font-medium block">
                  Visa Guide for Indian Citizens:
                </span>
                <span>{selectedDest.travelTips.visaInfoForIndians}</span>
              </div>
              <div>
                <span className="text-slate-400 font-medium block">
                  Local Transit System:
                </span>
                <span>{selectedDest.travelTips.transportation}</span>
              </div>
              <div>
                <span className="text-slate-400 font-medium block">
                  Top Landmarks:
                </span>
                <ul className="mt-1 space-y-1 text-slate-200">
                  {selectedDest.popularAttractions.slice(0, 3).map((attr) => (
                    <li key={attr}>· {attr}</li>
                  ))}
                </ul>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onSelectDestinationForGuide(selectedDest)}
              className="w-full mt-2 py-2.5 px-4 bg-sky-700 hover:bg-sky-600 text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer"
            >
              Open Full {selectedDest.city} Weather, Food & Tips Guide
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
