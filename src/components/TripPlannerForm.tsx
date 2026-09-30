import React, { useState } from 'react';
import {
  ArrowDown,
  ArrowUp,
  Check,
  Plus,
  RefreshCw,
  Trash2,
} from 'lucide-react';
import {
  CURRENCY_META,
  DESTINATIONS,
  formatCurrency,
  INDIAN_STARTING_CITIES,
} from '../data/worldTripData';
import {
  CurrencyCode,
  InterestTag,
  StartingCity,
  TravelStyle,
  WorldTripPlan,
} from '../types/travel';

interface TripPlannerFormProps {
  trip: WorldTripPlan;
  activeCurrency: CurrencyCode;
  customRates?: Partial<Record<CurrencyCode, number>>;
  estimatedTotalINR: number;
  onUpdateTrip: (updater: (prev: WorldTripPlan) => WorldTripPlan) => void;
  onCurrencyChange: (currency: CurrencyCode) => void;
  onRegenerateItinerary: () => void;
}

const ALL_INTERESTS: InterestTag[] = [
  'Beaches',
  'Mountains',
  'Adventure',
  'History',
  'Shopping',
  'Food',
  'Nature',
  'Nightlife',
];

const TRAVEL_STYLES: {
  style: TravelStyle;
  summary: string;
  perks: string;
}[] = [
  {
    style: 'Budget',
    summary: 'Smart Boutique & Metro Transit',
    perks: '3-star central design hotels/pods, economy RTW flights, metro passes & authentic local street dining.',
  },
  {
    style: 'Standard',
    summary: 'Comfort 4-Star & Priority Rail',
    perks: '4-star landmark-area hotels, curated airlines, high-speed Eurostar/Shinkansen & signature restaurants.',
  },
  {
    style: 'Luxury',
    summary: '5-Star Flagship & Private Transfers',
    perks: '5-star icons (The Savoy, Address Downtown, Marina Bay Sands), business class & fine dining.',
  },
];

export const TripPlannerForm: React.FC<TripPlannerFormProps> = ({
  trip,
  activeCurrency,
  customRates,
  estimatedTotalINR,
  onUpdateTrip,
  onCurrencyChange,
  onRegenerateItinerary,
}) => {
  const [activeStep, setActiveStep] = useState<1 | 2 | 3>(1);
  const [customStartCity, setCustomStartCity] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleSelectStartCity = (city: StartingCity) => {
    onUpdateTrip((prev) => ({
      ...prev,
      startingLocation: city,
    }));
  };

  const handleApplyCustomStartCity = () => {
    const trimmed = customStartCity.trim();
    if (!trimmed) return;
    onUpdateTrip((prev) => ({
      ...prev,
      startingLocation: {
        id: trimmed.toLowerCase().replace(/\s+/g, '-'),
        city: trimmed,
        country: 'India',
        airportCode: trimmed.slice(0, 3).toUpperCase(),
        lat: 17.385,
        lng: 78.4867,
      },
    }));
    setCustomStartCity('');
  };

  const handleToggleDestination = (cityId: string) => {
    onUpdateTrip((prev) => {
      const exists = prev.selectedCityIds.includes(cityId);
      if (exists && prev.selectedCityIds.length <= 1) {
        return prev; // Keep at least 1 destination
      }
      const nextIds = exists
        ? prev.selectedCityIds.filter((id) => id !== cityId)
        : [...prev.selectedCityIds, cityId];

      const destObj = DESTINATIONS.find((d) => d.id === cityId);
      const nextDays = {
        ...prev.cityDays,
        [cityId]: prev.cityDays[cityId] ?? destObj?.recommendedDays ?? 3,
      };
      return {
        ...prev,
        selectedCityIds: nextIds,
        cityDays: nextDays,
      };
    });
  };

  const handleMoveCity = (index: number, direction: 'up' | 'down') => {
    onUpdateTrip((prev) => {
      const arr = [...prev.selectedCityIds];
      const targetIndex = direction === 'up' ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= arr.length) return prev;
      const temp = arr[index];
      arr[index] = arr[targetIndex];
      arr[targetIndex] = temp;
      return { ...prev, selectedCityIds: arr };
    });
  };

  const handleChangeCityDays = (cityId: string, delta: number) => {
    onUpdateTrip((prev) => {
      const current = prev.cityDays[cityId] ?? 3;
      const updated = Math.max(1, Math.min(14, current + delta));
      return {
        ...prev,
        cityDays: {
          ...prev.cityDays,
          [cityId]: updated,
        },
      };
    });
  };

  const handleToggleInterest = (interest: InterestTag) => {
    onUpdateTrip((prev) => {
      const exists = prev.interests.includes(interest);
      const next = exists
        ? prev.interests.filter((i) => i !== interest)
        : [...prev.interests, interest];
      return { ...prev, interests: next.length > 0 ? next : [interest] };
    });
  };

  const handleTriggerGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      onRegenerateItinerary();
      setIsGenerating(false);
      const el = document.getElementById('itinerary');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, 250);
  };

  const totalTripDays = trip.selectedCityIds.reduce(
    (sum, id) => sum + (trip.cityDays[id] ?? 3),
    0
  );

  return (
    <section
      id="planner"
      className="py-16 sm:py-20 bg-white border-b border-slate-200"
    >
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
          <div>
            <p className="text-xs font-semibold text-sky-700 mb-2">
              01. Multi-Step World Trip Configurator
            </p>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
              Configure Your World Route & Preferences
            </h2>
            <p className="mt-2 text-sm sm:text-base text-slate-600 max-w-2xl">
              Customize your departure city in India, select countries and cities in sequence, set your travel dates, style, interests, and target budget.
            </p>
          </div>

          {/* Step Navigation Tabs */}
          <div
            role="tablist"
            aria-label="Trip Planner Steps"
            className="flex items-center gap-1.5 p-1.5 bg-slate-100 rounded-xl border border-slate-200 self-start"
          >
            <button
              type="button"
              role="tab"
              aria-selected={activeStep === 1}
              onClick={() => setActiveStep(1)}
              className={`px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                activeStep === 1
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              1. Origin, Countries & Cities
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeStep === 2}
              onClick={() => setActiveStep(2)}
              className={`px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                activeStep === 2
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              2. Dates, Travelers & Style
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeStep === 3}
              onClick={() => setActiveStep(3)}
              className={`px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                activeStep === 3
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              3. Interests, Budget & Currency
            </button>
          </div>
        </div>

        {/* Main Planner Workspace Surface (Single-elevation border container) */}
        <div className="border border-slate-200 rounded-2xl bg-slate-50/60 p-6 sm:p-8">
          {/* STEP 1: Starting Location, Countries to Visit, Cities to Visit */}
          {activeStep === 1 && (
            <div className="space-y-10">
              {/* 1. Starting Location */}
              <div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                  <div>
                    <h3 className="text-base font-semibold text-slate-900">
                      Step 1A · Starting Location in India
                    </h3>
                    <p className="text-xs text-slate-500">
                      Select your international departure and return hub. Default is Hyderabad (RGIA - HYD).
                    </p>
                  </div>
                  <div className="text-xs font-mono text-sky-800">
                    Selected Origin: {trip.startingLocation.city}, {trip.startingLocation.country} ({trip.startingLocation.airportCode})
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 mb-3">
                  {INDIAN_STARTING_CITIES.map((item) => {
                    const isSelected =
                      trip.startingLocation.city.toLowerCase() === item.city.toLowerCase();
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => handleSelectStartCity(item)}
                        className={`px-3.5 py-2.5 rounded-xl border text-left transition-colors cursor-pointer ${
                          isSelected
                            ? 'bg-sky-700 text-white border-sky-700'
                            : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <div className="text-sm font-semibold whitespace-nowrap">
                          {item.city}
                        </div>
                        <div
                          className={`text-xs font-mono ${
                            isSelected ? 'text-sky-200' : 'text-slate-500'
                          }`}
                        >
                          {item.airportCode} · India
                        </div>
                      </button>
                    );
                  })}
                </div>

                <div className="flex flex-wrap items-center gap-2 max-w-md">
                  <input
                    type="text"
                    value={customStartCity}
                    onChange={(e) => setCustomStartCity(e.target.value)}
                    placeholder="Or enter another starting city (e.g., Kochi, Ahmedabad)"
                    className="flex-1 px-3.5 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-600"
                  />
                  <button
                    type="button"
                    onClick={handleApplyCustomStartCity}
                    className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-100 transition-colors whitespace-nowrap cursor-pointer"
                  >
                    Set Custom Origin
                  </button>
                </div>
              </div>

              <hr className="border-slate-200" />

              {/* 2 & 3. Countries & Cities to Visit + Route Sequencer */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Left 7 Cols: Available World Countries & Cities */}
                <div className="lg:col-span-7">
                  <h3 className="text-base font-semibold text-slate-900 mb-1">
                    Step 1B · Select Countries & Cities to Visit
                  </h3>
                  <p className="text-xs text-slate-500 mb-4">
                    Click any country/city below to add or remove it from your world trip route.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {DESTINATIONS.map((dest) => {
                      const isSelected = trip.selectedCityIds.includes(dest.id);
                      const routeIdx = trip.selectedCityIds.indexOf(dest.id);
                      return (
                        <button
                          key={dest.id}
                          type="button"
                          onClick={() => handleToggleDestination(dest.id)}
                          className={`p-3.5 rounded-xl border text-left transition-colors flex items-start justify-between gap-3 cursor-pointer ${
                            isSelected
                              ? 'bg-white border-sky-600 ring-1 ring-sky-600'
                              : 'bg-white/70 border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          <div>
                            <div className="text-xs text-slate-500">
                              {dest.country} · {dest.continent}
                            </div>
                            <div className="text-sm font-semibold text-slate-900 mt-0.5">
                              {dest.city} ({dest.airportCode})
                            </div>
                            <div className="text-xs text-slate-500 mt-1 font-mono tabular-nums">
                              Rec: {dest.recommendedDays}d ·{' '}
                              {formatCurrency(
                                dest.avgDailyBudgetINR[trip.travelStyle],
                                activeCurrency,
                                customRates
                              )}
                              /day
                            </div>
                          </div>

                          <div
                            className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-mono font-bold shrink-0 ${
                              isSelected
                                ? 'bg-sky-700 text-white'
                                : 'bg-slate-100 text-slate-500'
                            }`}
                          >
                            {isSelected ? `0${routeIdx + 1}` : <Plus className="w-4 h-4" />}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Right 5 Cols: Active Route Sequence & Days per City */}
                <div className="lg:col-span-5 bg-white border border-slate-200 rounded-xl p-5">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-base font-semibold text-slate-900">
                        Step 1C · Route Order & Days per City
                      </h3>
                      <p className="text-xs text-slate-500">
                        Reorder stops or adjust stay duration ({totalTripDays} total days).
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2.5">
                    {/* Origin Pin */}
                    <div className="px-3.5 py-2.5 rounded-lg bg-slate-100 text-xs font-medium text-slate-700 flex items-center justify-between">
                      <span>
                        Start: <strong>{trip.startingLocation.city}, India</strong> ({trip.startingLocation.airportCode})
                      </span>
                      <span className="font-mono text-slate-500">Departure Hub</span>
                    </div>

                    {trip.selectedCityIds.map((cityId, idx) => {
                      const dest = DESTINATIONS.find((d) => d.id === cityId);
                      if (!dest) return null;
                      const stayDays = trip.cityDays[cityId] ?? dest.recommendedDays;

                      return (
                        <div
                          key={cityId}
                          className="p-3 rounded-lg border border-slate-200 flex items-center justify-between gap-2 bg-white"
                        >
                          <div className="min-w-0">
                            <div className="text-xs text-slate-500 font-mono">
                              Stop 0{idx + 1} · {dest.country}
                            </div>
                            <div className="text-sm font-semibold text-slate-900 truncate">
                              {dest.city} ({dest.airportCode})
                            </div>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            {/* Days Stepper */}
                            <div className="flex items-center border border-slate-200 rounded-lg bg-slate-50">
                              <button
                                type="button"
                                onClick={() => handleChangeCityDays(cityId, -1)}
                                aria-label={`Decrease days in ${dest.city}`}
                                className="px-2 py-1 text-xs font-bold text-slate-600 hover:text-slate-900 cursor-pointer"
                              >
                                −
                              </button>
                              <span className="px-2 text-xs font-mono font-semibold text-slate-900 tabular-nums">
                                {stayDays}d
                              </span>
                              <button
                                type="button"
                                onClick={() => handleChangeCityDays(cityId, 1)}
                                aria-label={`Increase days in ${dest.city}`}
                                className="px-2 py-1 text-xs font-bold text-slate-600 hover:text-slate-900 cursor-pointer"
                              >
                                +
                              </button>
                            </div>

                            {/* Reorder Up/Down */}
                            <div className="flex items-center gap-1">
                              <button
                                type="button"
                                disabled={idx === 0}
                                onClick={() => handleMoveCity(idx, 'up')}
                                aria-label={`Move ${dest.city} earlier`}
                                className="p-1.5 text-slate-500 hover:text-slate-900 disabled:opacity-30 cursor-pointer"
                              >
                                <ArrowUp className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                disabled={idx === trip.selectedCityIds.length - 1}
                                onClick={() => handleMoveCity(idx, 'down')}
                                aria-label={`Move ${dest.city} later`}
                                className="p-1.5 text-slate-500 hover:text-slate-900 disabled:opacity-30 cursor-pointer"
                              >
                                <ArrowDown className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                disabled={trip.selectedCityIds.length <= 1}
                                onClick={() => handleToggleDestination(cityId)}
                                aria-label={`Remove ${dest.city}`}
                                className="p-1.5 text-slate-400 hover:text-red-600 disabled:opacity-30 cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}

                    {/* Return Pin */}
                    <div className="px-3.5 py-2.5 rounded-lg bg-slate-100 text-xs font-medium text-slate-700 flex items-center justify-between">
                      <span>
                        Return: <strong>{trip.startingLocation.city}, India</strong> ({trip.startingLocation.airportCode})
                      </span>
                      <span className="font-mono text-slate-500">Home Arrival</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setActiveStep(2)}
                  className="px-5 py-2.5 bg-sky-700 hover:bg-sky-600 text-white text-xs sm:text-sm font-semibold rounded-xl transition-colors cursor-pointer"
                >
                  Continue to Dates, Travelers & Style →
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Travel Dates, Number of Travelers, Travel Style */}
          {activeStep === 2 && (
            <div className="space-y-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* 4. Travel Dates */}
                <div className="bg-white p-5 rounded-xl border border-slate-200">
                  <h3 className="text-base font-semibold text-slate-900 mb-1">
                    Step 2A · Travel Dates
                  </h3>
                  <p className="text-xs text-slate-500 mb-4">
                    Select your departure date from {trip.startingLocation.city}. Your return date automatically syncs with your {totalTripDays}-day city schedule.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="trip-start-date"
                        className="block text-xs font-medium text-slate-700 mb-1"
                      >
                        Departure Date
                      </label>
                      <input
                        id="trip-start-date"
                        type="date"
                        value={trip.startDate}
                        onChange={(e) => {
                          const newStart = e.target.value;
                          if (!newStart) return;
                          const endObj = new Date(newStart);
                          endObj.setDate(endObj.getDate() + totalTripDays - 1);
                          onUpdateTrip((prev) => ({
                            ...prev,
                            startDate: newStart,
                            endDate: endObj.toISOString().split('T')[0],
                          }));
                        }}
                        className="w-full px-3.5 py-2 text-sm font-mono bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-600"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="trip-end-date"
                        className="block text-xs font-medium text-slate-700 mb-1"
                      >
                        Calculated Return Date ({totalTripDays} Days)
                      </label>
                      <input
                        id="trip-end-date"
                        type="date"
                        value={trip.endDate}
                        readOnly
                        className="w-full px-3.5 py-2 text-sm font-mono bg-slate-100 text-slate-600 border border-slate-200 rounded-lg cursor-not-allowed"
                      />
                    </div>
                  </div>
                </div>

                {/* 5. Number of Travelers */}
                <div className="bg-white p-5 rounded-xl border border-slate-200">
                  <h3 className="text-base font-semibold text-slate-900 mb-1">
                    Step 2B · Number of Travelers
                  </h3>
                  <p className="text-xs text-slate-500 mb-4">
                    Flight tickets, food, visas, and room allocations scale automatically.
                  </p>

                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() =>
                          onUpdateTrip((prev) => ({
                            ...prev,
                            travelers: Math.max(1, prev.travelers - 1),
                          }))
                        }
                        className="w-10 h-10 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-base font-bold text-slate-800 cursor-pointer"
                      >
                        −
                      </button>
                      <div className="px-4 text-center">
                        <div className="text-2xl font-mono font-bold text-slate-900 tabular-nums">
                          {trip.travelers}
                        </div>
                        <div className="text-xs text-slate-500">
                          {trip.travelers === 1 ? 'Solo Traveler' : 'Travelers'}
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          onUpdateTrip((prev) => ({
                            ...prev,
                            travelers: Math.min(16, prev.travelers + 1),
                          }))
                        }
                        className="w-10 h-10 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-base font-bold text-slate-800 cursor-pointer"
                      >
                        +
                      </button>
                    </div>

                    <div className="flex flex-wrap items-center gap-1.5">
                      {[
                        { label: 'Solo (1)', count: 1 },
                        { label: 'Couple (2)', count: 2 },
                        { label: 'Family (4)', count: 4 },
                        { label: 'Group (6)', count: 6 },
                      ].map((preset) => (
                        <button
                          key={preset.count}
                          type="button"
                          onClick={() =>
                            onUpdateTrip((prev) => ({ ...prev, travelers: preset.count }))
                          }
                          className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors whitespace-nowrap cursor-pointer ${
                            trip.travelers === preset.count
                              ? 'bg-sky-700 text-white border-sky-700'
                              : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          {preset.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* 6. Travel Style */}
              <div>
                <h3 className="text-base font-semibold text-slate-900 mb-1">
                  Step 2C · Select Travel Style
                </h3>
                <p className="text-xs text-slate-500 mb-4">
                  Choose between Budget, Standard, and Luxury to match hotel suggestions and daily cost estimates.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {TRAVEL_STYLES.map((item) => {
                    const isSelected = trip.travelStyle === item.style;
                    return (
                      <button
                        key={item.style}
                        type="button"
                        onClick={() =>
                          onUpdateTrip((prev) => ({
                            ...prev,
                            travelStyle: item.style,
                            customBudgetOverrides: {},
                          }))
                        }
                        className={`p-5 rounded-xl border text-left transition-colors cursor-pointer ${
                          isSelected
                            ? 'bg-white border-sky-700 ring-2 ring-sky-700/20'
                            : 'bg-white border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-base font-bold text-slate-900">
                            {item.style}
                          </span>
                          <span
                            className={`text-xs font-semibold ${
                              isSelected ? 'text-sky-700' : 'text-slate-400'
                            }`}
                          >
                            {isSelected ? 'Active Style ✓' : 'Select'}
                          </span>
                        </div>
                        <div className="text-xs font-semibold text-slate-700 mb-1.5">
                          {item.summary}
                        </div>
                        <p className="text-xs text-slate-500 leading-relaxed">
                          {item.perks}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setActiveStep(1)}
                  className="px-4 py-2.5 text-xs sm:text-sm font-medium text-slate-600 hover:text-slate-900 cursor-pointer"
                >
                  ← Back to Origin & Cities
                </button>
                <button
                  type="button"
                  onClick={() => setActiveStep(3)}
                  className="px-5 py-2.5 bg-sky-700 hover:bg-sky-600 text-white text-xs sm:text-sm font-semibold rounded-xl transition-colors cursor-pointer"
                >
                  Continue to Interests, Budget & Currency →
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Interests, Total Budget, Currency Selection */}
          {activeStep === 3 && (
            <div className="space-y-10">
              {/* 7. Interests */}
              <div>
                <h3 className="text-base font-semibold text-slate-900 mb-1">
                  Step 3A · Select Your Travel Interests
                </h3>
                <p className="text-xs text-slate-500 mb-4">
                  Activities and personalized packing gear adapt to your chosen interests.
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {ALL_INTERESTS.map((interest) => {
                    const active = trip.interests.includes(interest);
                    return (
                      <button
                        key={interest}
                        type="button"
                        onClick={() => handleToggleInterest(interest)}
                        className={`px-4 py-3 rounded-xl border text-sm font-semibold flex items-center justify-between transition-colors cursor-pointer ${
                          active
                            ? 'bg-sky-700 text-white border-sky-700'
                            : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <span>{interest}</span>
                        {active && <Check className="w-4 h-4 shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* 8. Total Budget */}
                <div className="bg-white p-5 rounded-xl border border-slate-200">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-base font-semibold text-slate-900">
                      Step 3B · Target Total Budget
                    </h3>
                    <span className="text-sm font-mono font-bold text-sky-800 tabular-nums">
                      {formatCurrency(trip.targetBudgetINR, activeCurrency, customRates)}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mb-4">
                    Set your overall trip budget cap to compare against our live route calculation (
                    <span className="font-mono tabular-nums font-semibold text-slate-700">
                      {formatCurrency(estimatedTotalINR, activeCurrency, customRates)}
                    </span>
                    ).
                  </p>

                  <input
                    type="range"
                    min={400000}
                    max={6000000}
                    step={50000}
                    value={trip.targetBudgetINR}
                    onChange={(e) =>
                      onUpdateTrip((prev) => ({
                        ...prev,
                        targetBudgetINR: Number(e.target.value),
                      }))
                    }
                    aria-label="Target Total Budget in INR"
                    className="w-full accent-sky-700 cursor-pointer mb-2"
                  />

                  <div className="flex items-center justify-between text-xs font-mono text-slate-500 tabular-nums">
                    <span>{formatCurrency(400000, activeCurrency, customRates)}</span>
                    <span>
                      Status:{' '}
                      {estimatedTotalINR <= trip.targetBudgetINR ? (
                        <strong className="text-emerald-700">Within Target Budget</strong>
                      ) : (
                        <strong className="text-amber-700">Exceeds Target Cap</strong>
                      )}
                    </span>
                    <span>{formatCurrency(6000000, activeCurrency, customRates)}</span>
                  </div>
                </div>

                {/* 9. Currency Selection */}
                <div className="bg-white p-5 rounded-xl border border-slate-200">
                  <h3 className="text-base font-semibold text-slate-900 mb-1">
                    Step 3C · Preferred Display Currency
                  </h3>
                  <p className="text-xs text-slate-500 mb-4">
                    Switch all itinerary daily costs, hotel rates, and budget tables across 9 global currencies.
                  </p>

                  <div className="grid grid-cols-3 gap-2">
                    {(Object.keys(CURRENCY_META) as CurrencyCode[]).map((code) => {
                      const isSelected = activeCurrency === code;
                      return (
                        <button
                          key={code}
                          type="button"
                          onClick={() => onCurrencyChange(code)}
                          className={`px-3 py-2 rounded-lg border text-xs font-mono font-semibold transition-colors cursor-pointer ${
                            isSelected
                              ? 'bg-sky-700 text-white border-sky-700'
                              : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          {code} ({CURRENCY_META[code].symbol.trim()})
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
                <button
                  type="button"
                  onClick={() => setActiveStep(2)}
                  className="px-4 py-2.5 text-xs sm:text-sm font-medium text-slate-600 hover:text-slate-900 cursor-pointer"
                >
                  ← Back to Dates & Style
                </button>

                <button
                  type="button"
                  onClick={handleTriggerGenerate}
                  disabled={isGenerating}
                  className="px-6 py-3.5 bg-orange-600 hover:bg-orange-500 text-white text-sm font-semibold rounded-xl transition-colors inline-flex items-center gap-2 shadow-xs cursor-pointer"
                >
                  <RefreshCw
                    className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`}
                    aria-hidden="true"
                  />
                  <span>
                    {isGenerating
                      ? 'Building World Itinerary...'
                      : 'Generate Day-by-Day World Itinerary'}
                  </span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
