import React, { useState } from 'react';
import { X, Bookmark, Check } from 'lucide-react';
import { DESTINATIONS, formatCurrency } from '../data/worldTripData';
import { CurrencyCode, DestinationData, TravelStyle } from '../types/travel';

interface DestinationExplorerProps {
  selectedCityIds: string[];
  savedDestinationIds: string[];
  travelStyle: TravelStyle;
  activeCurrency: CurrencyCode;
  customRates?: Partial<Record<CurrencyCode, number>>;
  inspectedDestination: DestinationData | null;
  onSelectDestinationForGuide: (dest: DestinationData | null) => void;
  onToggleCityInTrip: (cityId: string) => void;
  onToggleSaveDestination: (cityId: string) => void;
}

export const DestinationExplorer: React.FC<DestinationExplorerProps> = ({
  selectedCityIds,
  savedDestinationIds,
  travelStyle,
  activeCurrency,
  customRates,
  inspectedDestination,
  onSelectDestinationForGuide,
  onToggleCityInTrip,
  onToggleSaveDestination,
}) => {
  const [continentFilter, setContinentFilter] = useState<string>('ALL');
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});
  const [activeGuideTab, setActiveGuideTab] = useState<'weather' | 'food' | 'tips'>('food');

  const continents = ['ALL', 'Asia', 'Europe', 'North America', 'Oceania'];

  const visibleDestinations =
    continentFilter === 'ALL'
      ? DESTINATIONS
      : DESTINATIONS.filter((d) => d.continent === continentFilter);

  return (
    <section
      id="destinations"
      className="py-16 sm:py-20 bg-white border-b border-slate-200"
    >
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading & Continent Filter */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
          <div>
            <p className="text-xs font-semibold text-sky-700 mb-2">
              04. Destination Explorer, Weather, Food Guide & Local Tips
            </p>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
              Explore World Destinations
            </h2>
            <p className="mt-2 text-sm sm:text-base text-slate-600 max-w-2xl">
              Compare best seasons, daily budgets, attractions, local currencies, vegetarian & local food guides, and cultural tips for every stop.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-1.5 p-1.5 bg-slate-100 rounded-xl border border-slate-200 self-start">
            {continents.map((cont) => (
              <button
                key={cont}
                type="button"
                onClick={() => setContinentFilter(cont)}
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                  continentFilter === cont
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {cont === 'ALL' ? 'All Continents' : cont}
              </button>
            ))}
          </div>
        </div>

        {/* Destination Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {visibleDestinations.map((dest) => {
            const inRoute = selectedCityIds.includes(dest.id);
            const isSaved = savedDestinationIds.includes(dest.id);
            const imgFailed = failedImages[dest.id];

            return (
              <article
                key={dest.id}
                className="border border-slate-200 rounded-2xl overflow-hidden bg-white flex flex-col justify-between transition-colors hover:border-slate-300"
              >
                <div>
                  {/* 4:3 Image Slot with Zero-Broken-Image Fallback */}
                  <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-900">
                    {!imgFailed ? (
                      <img
                        src={dest.image}
                        alt={`${dest.city}, ${dest.country} scenic landmark view`}
                        referrerPolicy="no-referrer"
                        onError={() =>
                          setFailedImages((prev) => ({ ...prev, [dest.id]: true }))
                        }
                        className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                      />
                    ) : (
                      <div
                        className={`w-full h-full bg-gradient-to-br ${dest.fallbackGradient} flex items-center justify-center p-6 text-center`}
                      >
                        <span className="font-display text-2xl font-bold text-white">
                          {dest.city}, {dest.country}
                        </span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-transparent to-transparent" />

                    {/* Save Bookmark Button */}
                    <button
                      type="button"
                      onClick={() => onToggleSaveDestination(dest.id)}
                      aria-label={
                        isSaved ? `Remove ${dest.city} from saved` : `Save ${dest.city}`
                      }
                      className={`absolute top-3 right-3 p-2 rounded-lg backdrop-blur-md transition-colors cursor-pointer ${
                        isSaved
                          ? 'bg-orange-600 text-white'
                          : 'bg-slate-900/60 text-white hover:bg-slate-900/80'
                      }`}
                    >
                      <Bookmark className="w-4 h-4" />
                    </button>

                    <div className="absolute bottom-3 left-4 right-4 text-white">
                      <div className="text-xs text-slate-200">
                        {dest.country} · {dest.continent} · {dest.localCurrency}
                      </div>
                      <h3 className="font-display text-2xl font-bold tracking-tight">
                        {dest.city}
                      </h3>
                    </div>
                  </div>

                  {/* Card Body (Unboxed metadata with · separators) */}
                  <div className="p-5 space-y-3.5">
                    <div className="flex flex-wrap items-center gap-1.5 text-xs text-slate-600 font-mono tabular-nums">
                      <span>Rec: {dest.recommendedDays} Days</span>
                      <span aria-hidden="true">·</span>
                      <span>
                        Avg{' '}
                        <strong className="text-slate-900">
                          {formatCurrency(
                            dest.avgDailyBudgetINR[travelStyle],
                            activeCurrency,
                            customRates
                          )}
                        </strong>
                        /day
                      </span>
                      <span aria-hidden="true">·</span>
                      <span>{dest.weatherSummary.avgTempC}°C Avg</span>
                    </div>

                    <div className="text-xs text-slate-600 space-y-1.5">
                      <div>
                        <strong className="text-slate-900">Best time to visit:</strong>{' '}
                        {dest.bestTimeToVisit}
                      </div>
                      <div>
                        <strong className="text-slate-900">Popular attractions:</strong>{' '}
                        {dest.popularAttractions.slice(0, 3).join(' · ')}
                      </div>
                      <div>
                        <strong className="text-slate-900">Popular foods:</strong>{' '}
                        {dest.popularFoods.slice(0, 3).join(' · ')}
                      </div>
                      <div>
                        <strong className="text-slate-900">Travel tip:</strong>{' '}
                        {dest.travelTips.transportation}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="px-5 pb-5 pt-2 flex items-center gap-2.5">
                  <button
                    type="button"
                    onClick={() => onSelectDestinationForGuide(dest)}
                    className="flex-1 py-2.5 px-3 text-xs font-semibold text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors whitespace-nowrap cursor-pointer"
                  >
                    Weather, Food & Tips
                  </button>
                  <button
                    type="button"
                    onClick={() => onToggleCityInTrip(dest.id)}
                    className={`py-2.5 px-4 text-xs font-semibold rounded-xl transition-colors whitespace-nowrap inline-flex items-center gap-1 cursor-pointer ${
                      inRoute
                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100'
                        : 'bg-sky-700 text-white hover:bg-sky-600'
                    }`}
                  >
                    {inRoute ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>In Route</span>
                      </>
                    ) : (
                      <span>+ Add Stop</span>
                    )}
                  </button>
                </div>
              </article>
            );
          })}
        </div>

        {/* Dedicated Deep-Dive Guide Panel (Weather, Food Guide & Travel Tips) */}
        {inspectedDestination && (
          <div
            role="dialog"
            aria-modal="true"
            aria-label={`${inspectedDestination.city} Travel, Weather and Food Guide`}
            className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
          >
            <div className="bg-white border border-slate-200 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
              {/* Modal Header */}
              <div className="sticky top-0 z-10 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between gap-4">
                <div>
                  <div className="text-xs text-sky-700 font-semibold">
                    {inspectedDestination.country} · Local Currency: {inspectedDestination.localCurrencyName}
                  </div>
                  <h3 className="font-display text-2xl font-bold text-slate-900">
                    {inspectedDestination.city} — Complete Weather, Food & Travel Guide
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => onSelectDestinationForGuide(null)}
                  aria-label="Close destination guide"
                  className="p-2 text-slate-500 hover:text-slate-900 rounded-lg hover:bg-slate-100 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Sub-Navigation Tabs inside Deep-Dive */}
              <div className="px-6 pt-4 border-b border-slate-200 flex items-center gap-4">
                {[
                  { id: 'food', label: 'Food Guide (Veg & Non-Veg)' },
                  { id: 'weather', label: 'Weather & Seasonal Guide' },
                  { id: 'tips', label: 'Travel Tips, SIM & Phrases' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveGuideTab(tab.id as 'weather' | 'food' | 'tips')}
                    className={`pb-3 text-xs sm:text-sm font-semibold border-b-2 transition-colors cursor-pointer ${
                      activeGuideTab === tab.id
                        ? 'border-sky-700 text-sky-800'
                        : 'border-transparent text-slate-500 hover:text-slate-900'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              <div className="p-6 space-y-6">
                {/* TAB 1: FOOD GUIDE */}
                {activeGuideTab === 'food' && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-b border-slate-200 pb-5">
                      <div>
                        <span className="text-xs text-slate-500 block">Famous Local Foods</span>
                        <p className="text-sm font-semibold text-slate-900 mt-1">
                          {inspectedDestination.popularFoods.join(' · ')}
                        </p>
                      </div>
                      <div>
                        <span className="text-xs text-slate-500 block">
                          Approx. Daily Food Cost ({travelStyle})
                        </span>
                        <p className="text-base font-mono font-bold text-emerald-700 tabular-nums mt-1">
                          {formatCurrency(
                            inspectedDestination.approxDailyFoodCostINR[travelStyle],
                            activeCurrency,
                            customRates
                          )}{' '}
                          / day
                        </p>
                      </div>
                      <div>
                        <span className="text-xs text-slate-500 block">
                          Budget / Standard / Luxury Meals
                        </span>
                        <p className="text-xs font-mono text-slate-700 tabular-nums mt-1">
                          {formatCurrency(
                            inspectedDestination.approxDailyFoodCostINR.Budget,
                            activeCurrency,
                            customRates
                          )}{' '}
                          /{' '}
                          {formatCurrency(
                            inspectedDestination.approxDailyFoodCostINR.Standard,
                            activeCurrency,
                            customRates
                          )}{' '}
                          /{' '}
                          {formatCurrency(
                            inspectedDestination.approxDailyFoodCostINR.Luxury,
                            activeCurrency,
                            customRates
                          )}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-200">
                        <h4 className="text-sm font-bold text-emerald-950 mb-2">
                          Vegetarian & Indian-Friendly Options
                        </h4>
                        <ul className="space-y-1.5 text-xs text-emerald-900">
                          {inspectedDestination.vegetarianOptions.map((item) => (
                            <li key={item}>· {item}</li>
                          ))}
                        </ul>
                      </div>

                      <div className="p-4 rounded-xl bg-orange-50/60 border border-orange-200">
                        <h4 className="text-sm font-bold text-orange-950 mb-2">
                          Signature Non-Vegetarian & Local Specialties
                        </h4>
                        <ul className="space-y-1.5 text-xs text-orange-900">
                          {inspectedDestination.nonVegetarianOptions.map((item) => (
                            <li key={item}>· {item}</li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-bold text-slate-900 mb-3">
                        Popular Restaurants in {inspectedDestination.city}
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {inspectedDestination.popularRestaurants.map((rest) => (
                          <div
                            key={rest.name}
                            className="p-4 rounded-xl border border-slate-200 bg-slate-50/60"
                          >
                            <div className="text-xs text-sky-700 font-semibold">
                              {rest.type} · {rest.neighborhood}
                            </div>
                            <div className="text-sm font-bold text-slate-900 mt-0.5">
                              {rest.name}
                            </div>
                            <div className="text-xs text-slate-600 mt-1">
                              Specialty: {rest.signatureDish}
                            </div>
                            <div className="text-xs font-mono font-semibold text-slate-800 mt-2 tabular-nums">
                              Avg Meal:{' '}
                              {formatCurrency(
                                rest.avgMealCostINR,
                                activeCurrency,
                                customRates
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 2: WEATHER & SEASONAL GUIDE */}
                {activeGuideTab === 'weather' && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                      <div>
                        <span className="text-slate-500 block">Climate Classification</span>
                        <strong className="text-sm text-slate-900">
                          {inspectedDestination.weatherSummary.climateType}
                        </strong>
                      </div>
                      <div>
                        <span className="text-slate-500 block">Best Months to Visit</span>
                        <strong className="text-sm text-emerald-700">
                          {inspectedDestination.bestTimeToVisit}
                        </strong>
                      </div>
                      <div>
                        <span className="text-slate-500 block">Rainfall Pattern</span>
                        <strong className="text-sm text-slate-900">
                          {inspectedDestination.weatherSummary.rainyMonths}
                        </strong>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {inspectedDestination.weatherSummary.seasons.map((s) => (
                        <div
                          key={s.season}
                          className="p-4 rounded-xl border border-slate-200 bg-white space-y-2"
                        >
                          <div className="text-xs font-mono text-sky-700 font-semibold">
                            {s.months} · {s.tempRange}
                          </div>
                          <div className="text-sm font-bold text-slate-900">
                            {s.season}
                          </div>
                          <p className="text-xs text-slate-600">{s.condition}</p>
                          <p className="text-xs text-slate-800 font-medium pt-1 border-t border-slate-100">
                            Packing: {s.packingAdvice}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* TAB 3: TRAVEL TIPS & LOCAL PHRASES */}
                {activeGuideTab === 'tips' && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                      <div className="p-4 rounded-xl border border-slate-200">
                        <strong className="text-slate-900 block mb-1">
                          Local Customs & Etiquette
                        </strong>
                        <p className="text-slate-600 leading-relaxed">
                          {inspectedDestination.travelTips.customs}
                        </p>
                      </div>
                      <div className="p-4 rounded-xl border border-slate-200">
                        <strong className="text-slate-900 block mb-1">
                          Safety & Emergency Numbers
                        </strong>
                        <p className="text-slate-600 leading-relaxed">
                          {inspectedDestination.travelTips.safety}
                        </p>
                      </div>
                      <div className="p-4 rounded-xl border border-slate-200">
                        <strong className="text-slate-900 block mb-1">
                          Public Transportation & Passes
                        </strong>
                        <p className="text-slate-600 leading-relaxed">
                          {inspectedDestination.travelTips.transportation}
                        </p>
                      </div>
                      <div className="p-4 rounded-xl border border-slate-200">
                        <strong className="text-slate-900 block mb-1">
                          Internet, SIM & eSIM Advice
                        </strong>
                        <p className="text-slate-600 leading-relaxed">
                          {inspectedDestination.travelTips.internetSim}
                        </p>
                      </div>
                      <div className="p-4 rounded-xl border border-slate-200">
                        <strong className="text-slate-900 block mb-1">
                          Currency & Tipping Rules
                        </strong>
                        <p className="text-slate-600 leading-relaxed">
                          {inspectedDestination.travelTips.currencyTip}
                        </p>
                      </div>
                      <div className="p-4 rounded-xl border border-slate-200">
                        <strong className="text-slate-900 block mb-1">
                          Visa Requirement for Indian Passport
                        </strong>
                        <p className="text-slate-600 leading-relaxed">
                          {inspectedDestination.travelTips.visaInfoForIndians}
                        </p>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-bold text-slate-900 mb-3">
                        Essential Local Phrases in {inspectedDestination.city}
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {inspectedDestination.localPhrases.map((lp) => (
                          <div
                            key={lp.phrase}
                            className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs"
                          >
                            <div className="text-slate-500">{lp.phrase}</div>
                            <div className="text-sm font-bold text-slate-900 mt-0.5">
                              {lp.local}
                            </div>
                            <div className="font-mono text-sky-700 mt-0.5">
                              [{lp.pronunciation}]
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
