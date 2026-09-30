import React, { useState } from 'react';
import { Edit3, Check } from 'lucide-react';
import { DESTINATIONS, formatCurrency } from '../data/worldTripData';
import { CurrencyCode, ItineraryDay, WorldTripPlan } from '../types/travel';

interface ItinerarySectionProps {
  trip: WorldTripPlan;
  activeCurrency: CurrencyCode;
  customRates?: Partial<Record<CurrencyCode, number>>;
  onUpdateDay: (dayNumber: number, updated: Partial<ItineraryDay>) => void;
}

export const ItinerarySection: React.FC<ItinerarySectionProps> = ({
  trip,
  activeCurrency,
  customRates,
  onUpdateDay,
}) => {
  const [cityFilter, setCityFilter] = useState<string>('ALL');
  const [editingDay, setEditingDay] = useState<number | null>(null);
  const [draftMorning, setDraftMorning] = useState('');
  const [draftAfternoon, setDraftAfternoon] = useState('');
  const [draftEvening, setDraftEvening] = useState('');

  const filteredDays =
    cityFilter === 'ALL'
      ? trip.itinerary
      : trip.itinerary.filter((d) => d.cityId === cityFilter);

  const startEdit = (day: ItineraryDay) => {
    setEditingDay(day.dayNumber);
    setDraftMorning(day.morningActivity);
    setDraftAfternoon(day.afternoonActivity);
    setDraftEvening(day.eveningActivity);
  };

  const saveEdit = (dayNumber: number) => {
    onUpdateDay(dayNumber, {
      morningActivity: draftMorning,
      afternoonActivity: draftAfternoon,
      eveningActivity: draftEvening,
    });
    setEditingDay(null);
  };

  return (
    <section
      id="itinerary"
      className="py-16 sm:py-20 bg-slate-50 border-b border-slate-200"
    >
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header & City Filter Controls */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
          <div>
            <p className="text-xs font-semibold text-sky-700 mb-2">
              03. Generated Day-by-Day World Schedule
            </p>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
              Your {trip.itinerary.length}-Day World Trip Itinerary
            </h2>
            <p className="mt-2 text-sm sm:text-base text-slate-600 max-w-2xl">
              Complete daily schedule with morning, afternoon, and evening activities, curated vegetarian and local restaurants, transit times, hotel stays, and daily costs.
            </p>
          </div>

          {/* Interactive City Filter Bar */}
          <div className="flex flex-wrap items-center gap-1.5 p-1.5 bg-white rounded-xl border border-slate-200">
            <button
              type="button"
              onClick={() => setCityFilter('ALL')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                cityFilter === 'ALL'
                  ? 'bg-sky-700 text-white'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All Days ({trip.itinerary.length})
            </button>
            {trip.selectedCityIds.map((cityId) => {
              const dest = DESTINATIONS.find((d) => d.id === cityId);
              if (!dest) return null;
              return (
                <button
                  key={cityId}
                  type="button"
                  onClick={() => setCityFilter(cityId)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                    cityFilter === cityId
                      ? 'bg-sky-700 text-white'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {dest.city}
                </button>
              );
            })}
          </div>
        </div>

        {/* Chronological Day Cards */}
        <div className="space-y-4">
          {filteredDays.map((day) => {
            const isEditing = editingDay === day.dayNumber;
            return (
              <article
                key={day.dayNumber}
                className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 transition-colors hover:border-slate-300"
              >
                {/* Top Metadata Row (Zero-Pill Unboxed Text Discipline) */}
                <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100">
                  <div>
                    <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 font-mono">
                      <span className="font-bold text-sky-800">
                        DAY {String(day.dayNumber).padStart(2, '0')}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span>{day.date}</span>
                      <span aria-hidden="true">·</span>
                      <span className="text-slate-700 font-sans font-semibold">
                        {day.city}, {day.country}
                      </span>
                      {day.transitLegLabel && (
                        <>
                          <span aria-hidden="true">·</span>
                          <span className="text-orange-700 font-sans font-medium">
                            {day.transitLegLabel}
                          </span>
                        </>
                      )}
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 mt-1">
                      {day.city} Exploration — Day {day.dayNumber}
                    </h3>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="text-xs text-slate-500">Estimated Daily Cost</div>
                      <div className="text-base font-mono font-bold text-slate-900 tabular-nums">
                        {formatCurrency(
                          day.estimatedDailyCostINR,
                          activeCurrency,
                          customRates
                        )}
                      </div>
                    </div>

                    {isEditing ? (
                      <button
                        type="button"
                        onClick={() => saveEdit(day.dayNumber)}
                        className="px-3 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg inline-flex items-center gap-1.5 cursor-pointer"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Save</span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => startEdit(day)}
                        className="px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 border border-slate-200 rounded-lg inline-flex items-center gap-1.5 cursor-pointer"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Customize</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Morning / Afternoon / Evening 3-Column Timeline */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-5 border-b border-slate-100">
                  <div>
                    <div className="text-xs font-semibold text-sky-800 mb-1.5">
                      Morning Activity
                    </div>
                    {isEditing ? (
                      <textarea
                        rows={3}
                        value={draftMorning}
                        onChange={(e) => setDraftMorning(e.target.value)}
                        className="w-full p-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-600"
                      />
                    ) : (
                      <p className="text-sm text-slate-700 leading-relaxed">
                        {day.morningActivity}
                      </p>
                    )}
                  </div>

                  <div>
                    <div className="text-xs font-semibold text-emerald-800 mb-1.5">
                      Afternoon Activity
                    </div>
                    {isEditing ? (
                      <textarea
                        rows={3}
                        value={draftAfternoon}
                        onChange={(e) => setDraftAfternoon(e.target.value)}
                        className="w-full p-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-600"
                      />
                    ) : (
                      <p className="text-sm text-slate-700 leading-relaxed">
                        {day.afternoonActivity}
                      </p>
                    )}
                  </div>

                  <div>
                    <div className="text-xs font-semibold text-orange-800 mb-1.5">
                      Evening Activity
                    </div>
                    {isEditing ? (
                      <textarea
                        rows={3}
                        value={draftEvening}
                        onChange={(e) => setDraftEvening(e.target.value)}
                        className="w-full p-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-600"
                      />
                    ) : (
                      <p className="text-sm text-slate-700 leading-relaxed">
                        {day.eveningActivity}
                      </p>
                    )}
                  </div>
                </div>

                {/* Bottom Logistics Bar: Hotel, Transport, Travel Time, Restaurants */}
                <div className="pt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs text-slate-600">
                  <div>
                    <span className="text-slate-400 block">Hotel Suggestion ({trip.travelStyle})</span>
                    <strong className="text-slate-800 font-medium">
                      {day.hotelSuggestion}
                    </strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Transportation Method</span>
                    <strong className="text-slate-800 font-medium">
                      {day.transportationMethod}
                    </strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Estimated Travel Time</span>
                    <strong className="text-slate-800 font-mono tabular-nums">
                      {day.travelTime}
                    </strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Recommended Restaurants</span>
                    <strong className="text-slate-800 font-medium">
                      {day.recommendedRestaurants.join(' · ')}
                    </strong>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};
