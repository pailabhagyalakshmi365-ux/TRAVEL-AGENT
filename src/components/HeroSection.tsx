import React, { useState } from 'react';
import { Search, ArrowRight, Globe, Compass } from 'lucide-react';
import {
  computeRouteLegs,
  DESTINATIONS,
  formatCurrency,
  HERO_IMAGE_PATH,
} from '../data/worldTripData';
import { CurrencyCode, DestinationData, WorldTripPlan } from '../types/travel';

interface HeroSectionProps {
  trip: WorldTripPlan;
  totalBudgetINR: number;
  activeCurrency: CurrencyCode;
  customRates?: Partial<Record<CurrencyCode, number>>;
  onPlanMyTrip: () => void;
  onExploreDestinations: () => void;
  onSelectDestinationForGuide: (dest: DestinationData) => void;
  onToggleCityInTrip: (cityId: string) => void;
  onResetFlagshipTrip: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  trip,
  totalBudgetINR,
  activeCurrency,
  customRates,
  onPlanMyTrip,
  onExploreDestinations,
  onSelectDestinationForGuide,
  onToggleCityInTrip,
  onResetFlagshipTrip,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [heroImgFailed, setHeroImgFailed] = useState(false);

  const filteredDestinations = searchQuery.trim()
    ? DESTINATIONS.filter(
        (d) =>
          d.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
          d.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
          d.continent.toLowerCase().includes(searchQuery.toLowerCase()) ||
          d.popularAttractions.some((a) =>
            a.toLowerCase().includes(searchQuery.toLowerCase())
          )
      )
    : [];

  const legs = computeRouteLegs(trip.startingLocation, trip.selectedCityIds);
  const totalDistanceKm = legs.reduce((sum, l) => sum + l.distanceKm, 0);

  const routeStopNames = [
    trip.startingLocation.city,
    ...trip.selectedCityIds.map(
      (id) => DESTINATIONS.find((d) => d.id === id)?.city || id
    ),
    trip.startingLocation.city,
  ];

  return (
    <section id="hero" className="relative w-full overflow-hidden bg-slate-950">
      {/* 16:9 / Full-Screen Background Visual with Zero-Broken-Image Fallback */}
      <div className="relative min-h-[620px] lg:min-h-[680px] flex flex-col justify-between">
        <div className="absolute inset-0 z-0">
          {!heroImgFailed ? (
            <img
              src={HERO_IMAGE_PATH}
              alt="Cinematic coastal world travel horizon at sunset"
              referrerPolicy="no-referrer"
              onError={() => setHeroImgFailed(true)}
              className="w-full h-full object-cover object-center"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-sky-950 via-teal-900 to-orange-900" />
          )}
          {/* Measured Contrast Scrim for WCAG AA Legibility */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/60 to-slate-950/35" />
        </div>

        {/* Main Hero Content */}
        <div className="relative z-10 max-w-[1360px] w-full mx-auto px-4 sm:px-6 lg:px-8 pt-16 sm:pt-24 pb-12">
          <div className="max-w-3xl">
            <p className="text-xs sm:text-sm font-medium tracking-wide text-emerald-300 mb-4">
              All-in-One World Route Architect · Departing from {trip.startingLocation.city}, India ({trip.startingLocation.airportCode})
            </p>

            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-[1.08] mb-5">
              Plan Your Dream World Trip
            </h1>

            <p className="text-base sm:text-lg text-slate-200 leading-relaxed max-w-2xl mb-8">
              Explore the world, create your itinerary and travel smarter. Map multi-continent routes from India, calculate visa and flight budgets across 9 currencies, and organize every day of your journey.
            </p>

            {/* Interactive Search Bar: "Where do you want to go?" */}
            <div className="relative max-w-2xl mb-8">
              <div className="flex items-center bg-white rounded-xl p-1.5 shadow-lg border border-white/20">
                <div className="pl-3.5 pr-2 text-slate-400">
                  <Search className="w-5 h-5" aria-hidden="true" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Where do you want to go? (e.g., Dubai, Paris, Tokyo, Swiss Alps, Bali...)"
                  aria-label="Where do you want to go?"
                  className="w-full py-2.5 px-2 text-sm sm:text-base text-slate-900 placeholder:text-slate-400 focus:outline-none"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="px-2.5 py-1 text-xs text-slate-500 hover:text-slate-800 whitespace-nowrap cursor-pointer"
                  >
                    Clear
                  </button>
                )}
                <button
                  type="button"
                  onClick={onExploreDestinations}
                  className="px-4 py-2.5 bg-sky-700 hover:bg-sky-600 text-white text-xs sm:text-sm font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  Search
                </button>
              </div>

              {/* Instant Search Results Dropdown */}
              {searchQuery.trim().length > 0 && (
                <div className="absolute left-0 right-0 mt-2 bg-white rounded-xl border border-slate-200 shadow-xl overflow-hidden z-30">
                  {filteredDestinations.length === 0 ? (
                    <div className="p-4 text-sm text-slate-600 flex items-center justify-between">
                      <span>No matching city found for &ldquo;{searchQuery}&rdquo;.</span>
                      <button
                        type="button"
                        onClick={() => {
                          setSearchQuery('');
                          onPlanMyTrip();
                        }}
                        className="text-xs font-semibold text-sky-700 hover:underline cursor-pointer"
                      >
                        Open Custom Trip Planner
                      </button>
                    </div>
                  ) : (
                    <div className="divide-y divide-slate-100 max-h-72 overflow-y-auto">
                      {filteredDestinations.map((dest) => {
                        const inRoute = trip.selectedCityIds.includes(dest.id);
                        return (
                          <div
                            key={dest.id}
                            className="px-4 py-3 hover:bg-slate-50 flex items-center justify-between gap-4"
                          >
                            <div>
                              <div className="text-sm font-semibold text-slate-900">
                                {dest.city}, {dest.country} ({dest.airportCode})
                              </div>
                              <div className="text-xs text-slate-500">
                                Best: {dest.bestTimeToVisit} · {dest.recommendedDays} Days · Avg{' '}
                                <span className="font-mono tabular-nums">
                                  {formatCurrency(
                                    dest.avgDailyBudgetINR[trip.travelStyle],
                                    activeCurrency,
                                    customRates
                                  )}
                                </span>
                                /day
                              </div>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                              <button
                                type="button"
                                onClick={() => {
                                  setSearchQuery('');
                                  onSelectDestinationForGuide(dest);
                                }}
                                className="px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors whitespace-nowrap cursor-pointer"
                              >
                                View Guide
                              </button>
                              <button
                                type="button"
                                onClick={() => onToggleCityInTrip(dest.id)}
                                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                                  inRoute
                                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100'
                                    : 'bg-orange-600 text-white hover:bg-orange-500'
                                }`}
                              >
                                {inRoute ? 'In Route ✓' : '+ Add to Trip'}
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Hero Primary & Secondary Action Buttons */}
            <div className="flex flex-wrap items-center gap-3.5">
              <button
                type="button"
                onClick={onPlanMyTrip}
                className="px-6 py-3.5 bg-orange-600 hover:bg-orange-500 text-white text-sm font-semibold rounded-xl transition-colors inline-flex items-center gap-2 whitespace-nowrap shadow-sm cursor-pointer"
              >
                <span>Plan My Trip</span>
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </button>

              <button
                type="button"
                onClick={onExploreDestinations}
                className="px-6 py-3.5 bg-white/15 hover:bg-white/25 text-white border border-white/30 backdrop-blur-xs text-sm font-semibold rounded-xl transition-colors inline-flex items-center gap-2 whitespace-nowrap cursor-pointer"
              >
                <Compass className="w-4 h-4" aria-hidden="true" />
                <span>Explore Destinations</span>
              </button>
            </div>
          </div>
        </div>

        {/* Active Flagship World Route Bar */}
        <div className="relative z-10 border-t border-white/15 bg-slate-950/80 backdrop-blur-md">
          <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs text-emerald-400 font-medium">
                <Globe className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Active World Route Circuit</span>
                <span aria-hidden="true">·</span>
                <span className="font-mono tabular-nums text-slate-300">
                  {totalDistanceKm.toLocaleString()} km
                </span>
                <span aria-hidden="true">·</span>
                <span className="font-mono tabular-nums text-slate-300">
                  {trip.itinerary.length} Days
                </span>
                <span aria-hidden="true">·</span>
                <span className="font-mono tabular-nums text-slate-300">
                  {trip.travelers} Travelers ({trip.travelStyle})
                </span>
              </div>

              <div className="text-sm sm:text-base font-medium text-white flex flex-wrap items-center gap-x-2 gap-y-1">
                {routeStopNames.map((city, idx) => (
                  <React.Fragment key={`${city}-${idx}`}>
                    <span
                      className={
                        idx === 0 || idx === routeStopNames.length - 1
                          ? 'text-orange-400 font-semibold'
                          : 'text-white'
                      }
                    >
                      {city}
                    </span>
                    {idx < routeStopNames.length - 1 && (
                      <span className="text-slate-400 font-mono text-xs" aria-hidden="true">
                        →
                      </span>
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-6 shrink-0">
              <div>
                <div className="text-xs text-slate-400">Estimated Total Trip Cost</div>
                <div className="text-lg font-mono font-semibold text-white tabular-nums">
                  {formatCurrency(totalBudgetINR, activeCurrency, customRates)}
                </div>
              </div>
              <button
                type="button"
                onClick={onResetFlagshipTrip}
                className="px-3.5 py-2 text-xs font-medium text-slate-200 hover:text-white border border-white/20 hover:border-white/40 rounded-lg transition-colors whitespace-nowrap cursor-pointer"
              >
                Reset Hyderabad 6-Nation Route
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
