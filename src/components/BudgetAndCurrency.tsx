import React, { useState } from 'react';
import { ArrowLeftRight, RotateCcw } from 'lucide-react';
import { CURRENCY_META, formatCurrency } from '../data/worldTripData';
import { BudgetBreakdown, CurrencyCode, WorldTripPlan } from '../types/travel';

interface BudgetAndCurrencyProps {
  trip: WorldTripPlan;
  budget: BudgetBreakdown;
  activeCurrency: CurrencyCode;
  customRates: Partial<Record<CurrencyCode, number>>;
  ratesSource: string;
  onUpdateBudgetOverride: (
    category: keyof BudgetBreakdown,
    valueINR: number
  ) => void;
  onResetBudgetOverrides: () => void;
}

const BUDGET_CATEGORIES: {
  key: keyof BudgetBreakdown;
  label: string;
  description: string;
  colorClass: string;
}[] = [
  {
    key: 'internationalFlights',
    label: 'International Flights',
    description: 'Multi-continent RTW sectors (HYD → DXB → CDG / LHR → JFK → HND → SIN → HYD)',
    colorClass: 'bg-sky-700',
  },
  {
    key: 'domesticFlights',
    label: 'Domestic & Regional Connections',
    description: 'Inter-city Eurostar rail, airport express transfers & regional connectors',
    colorClass: 'bg-sky-500',
  },
  {
    key: 'hotels',
    label: 'Hotels & Accommodations',
    description: 'Total room nights across all selected cities matched to travel style',
    colorClass: 'bg-emerald-600',
  },
  {
    key: 'food',
    label: 'Food & Dining',
    description: 'Breakfast, lunch, dinner, café stops & local culinary experiences',
    colorClass: 'bg-emerald-400',
  },
  {
    key: 'localTransportation',
    label: 'Local Transportation',
    description: 'Nol Card, Navigo, London Tube, NYC OMNY, Tokyo Suica & Singapore MRT',
    colorClass: 'bg-teal-500',
  },
  {
    key: 'attractions',
    label: 'Attractions & Guided Entries',
    description: 'Burj Khalifa, Louvre, Eiffel Summit, Statue of Liberty, Shibuya Sky & Gardens by the Bay',
    colorClass: 'bg-orange-600',
  },
  {
    key: 'shopping',
    label: 'Shopping & Souvenirs',
    description: 'Gold Souk, Paris boutiques, Tokyo electronics & Changi duty-free',
    colorClass: 'bg-orange-400',
  },
  {
    key: 'visaCosts',
    label: 'Visa Costs',
    description: 'UAE, Schengen, UK Standard Visitor, US B1/B2, Japan & Singapore visa fees',
    colorClass: 'bg-amber-500',
  },
  {
    key: 'travelInsurance',
    label: 'Travel Insurance',
    description: 'Comprehensive worldwide medical ($250k cover) & baggage protection',
    colorClass: 'bg-indigo-600',
  },
  {
    key: 'emergencyExpenses',
    label: 'Emergency Expenses Reserve',
    description: 'Contingency buffer for schedule changes, medical or urgent transit',
    colorClass: 'bg-slate-600',
  },
];

export const BudgetAndCurrency: React.FC<BudgetAndCurrencyProps> = ({
  trip,
  budget,
  activeCurrency,
  customRates,
  ratesSource,
  onUpdateBudgetOverride,
  onResetBudgetOverrides,
}) => {
  const [convAmount, setConvAmount] = useState<string>('100000');
  const [fromCurr, setFromCurr] = useState<CurrencyCode>('INR');
  const [toCurr, setToCurr] = useState<CurrencyCode>('USD');

  const totalEstimatedINR = Object.values(budget).reduce((sum, v) => sum + v, 0);
  const totalDays = Math.max(1, trip.itinerary.length);
  const dailyAvgINR = totalEstimatedINR / totalDays;
  const costPerTravelerINR = totalEstimatedINR / Math.max(1, trip.travelers);

  const getRate = (code: CurrencyCode) =>
    customRates[code] ?? CURRENCY_META[code].rateFromINR;

  const numericAmount = Math.max(0, parseFloat(convAmount) || 0);
  const amountInINR = numericAmount / getRate(fromCurr);
  const convertedResult = amountInINR * getRate(toCurr);

  const handleSwapCurrencies = () => {
    setFromCurr(toCurr);
    setToCurr(fromCurr);
  };

  return (
    <section
      id="budget"
      className="py-16 sm:py-20 bg-slate-50 border-b border-slate-200"
    >
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
          <div>
            <p className="text-xs font-semibold text-sky-700 mb-2">
              05. World Trip Budget Calculator & Multi-Currency Converter
            </p>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
              Financial Estimator & Live FX Converter
            </h2>
            <p className="mt-2 text-sm sm:text-base text-slate-600 max-w-2xl">
              Review all 10 travel cost categories for {trip.travelers} traveler(s) over {totalDays} days ({trip.travelStyle} tier), and convert between INR, USD, EUR, GBP, JPY, AED, AUD, CAD, and SGD.
            </p>
          </div>

          {Object.keys(trip.customBudgetOverrides).length > 0 && (
            <button
              type="button"
              onClick={onResetBudgetOverrides}
              className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-xl hover:bg-slate-100 inline-flex items-center gap-1.5 self-start cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset to Auto-Calculated Estimates</span>
            </button>
          )}
        </div>

        {/* Summary KPI Strip (Total, Daily Average, Cost per Traveler) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white border border-slate-200 rounded-2xl p-6">
            <div className="text-xs font-medium text-slate-500">
              Total Estimated Budget ({trip.travelers} Travelers · {totalDays} Days)
            </div>
            <div className="text-3xl font-mono font-bold text-slate-900 tabular-nums mt-1">
              {formatCurrency(totalEstimatedINR, activeCurrency, customRates)}
            </div>
            {activeCurrency !== 'INR' && (
              <div className="text-xs font-mono text-slate-500 tabular-nums mt-1">
                Equivalent: {formatCurrency(totalEstimatedINR, 'INR', customRates)}
              </div>
            )}
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-6">
            <div className="text-xs font-medium text-slate-500">
              Daily Average Budget (All Travelers Combined)
            </div>
            <div className="text-3xl font-mono font-bold text-sky-700 tabular-nums mt-1">
              {formatCurrency(dailyAvgINR, activeCurrency, customRates)}
              <span className="text-sm font-normal text-slate-500"> / day</span>
            </div>
            <div className="text-xs text-slate-500 mt-1">
              Across {trip.selectedCityIds.length} international destinations
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-6">
            <div className="text-xs font-medium text-slate-500">
              Estimated Cost per Traveler
            </div>
            <div className="text-3xl font-mono font-bold text-emerald-700 tabular-nums mt-1">
              {formatCurrency(costPerTravelerINR, activeCurrency, customRates)}
              <span className="text-sm font-normal text-slate-500"> / person</span>
            </div>
            <div className="text-xs text-slate-500 mt-1">
              Includes flights, hotels, visas, insurance & reserve
            </div>
          </div>
        </div>

        {/* Main 12-Col Grid: 10-Category Breakdown (7 cols) + Currency Converter (5 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left 7 Cols: 10-Category Budget Calculator */}
          <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-slate-900">
                10-Category Expense Breakdown
              </h3>
              <span className="text-xs text-slate-500">
                Adjust any category slider to customize
              </span>
            </div>

            {/* Visual Proportion Bar */}
            <div className="h-3 w-full rounded-full overflow-hidden flex bg-slate-100 mb-6">
              {BUDGET_CATEGORIES.map((cat) => {
                const val = budget[cat.key];
                const pct =
                  totalEstimatedINR > 0 ? (val / totalEstimatedINR) * 100 : 10;
                return (
                  <div
                    key={cat.key}
                    style={{ width: `${Math.max(2, pct)}%` }}
                    className={`${cat.colorClass} h-full`}
                    title={`${cat.label}: ${Math.round(pct)}%`}
                  />
                );
              })}
            </div>

            <div className="divide-y divide-slate-100">
              {BUDGET_CATEGORIES.map((cat) => {
                const valINR = budget[cat.key];
                const pct =
                  totalEstimatedINR > 0
                    ? Math.round((valINR / totalEstimatedINR) * 100)
                    : 0;

                return (
                  <div key={cat.key} className="py-3.5 first:pt-0 last:pb-0">
                    <div className="flex items-center justify-between gap-4 mb-1">
                      <div className="flex items-center gap-2.5">
                        <span
                          className={`w-2.5 h-2.5 rounded-full ${cat.colorClass} shrink-0`}
                        />
                        <span className="text-sm font-semibold text-slate-900">
                          {cat.label}
                        </span>
                        <span className="text-xs font-mono text-slate-400 tabular-nums">
                          {pct}%
                        </span>
                      </div>

                      <div className="text-sm font-mono font-bold text-slate-900 tabular-nums">
                        {formatCurrency(valINR, activeCurrency, customRates)}
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <p className="text-xs text-slate-500">{cat.description}</p>
                      <input
                        type="range"
                        min={5000}
                        max={1200000}
                        step={5000}
                        value={valINR}
                        onChange={(e) =>
                          onUpdateBudgetOverride(cat.key, Number(e.target.value))
                        }
                        aria-label={`Adjust ${cat.label} budget`}
                        className="w-full sm:w-40 accent-sky-700 cursor-pointer shrink-0"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right 5 Cols: Multi-Currency Converter (INR, USD, EUR, GBP, JPY, AED, AUD, CAD, SGD) */}
          <div className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-6 space-y-6">
            <div>
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-slate-900">
                  World Currency Converter
                </h3>
                <span className="text-xs font-mono text-emerald-700">
                  {ratesSource}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Instant conversion across INR, USD, EUR, GBP, JPY, AED, AUD, CAD, and SGD.
              </p>
            </div>

            {/* Amount Input */}
            <div>
              <label
                htmlFor="converter-amount-input"
                className="block text-xs font-semibold text-slate-700 mb-1.5"
              >
                Amount to Convert
              </label>
              <input
                id="converter-amount-input"
                type="number"
                min="0"
                value={convAmount}
                onChange={(e) => setConvAmount(e.target.value)}
                className="w-full px-4 py-2.5 text-base font-mono font-semibold text-slate-900 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-600 tabular-nums"
              />
            </div>

            {/* From / Swap / To Selectors */}
            <div className="grid grid-cols-11 gap-2 items-end">
              <div className="col-span-5">
                <label
                  htmlFor="conv-from-curr"
                  className="block text-xs font-medium text-slate-600 mb-1"
                >
                  From Currency
                </label>
                <select
                  id="conv-from-curr"
                  value={fromCurr}
                  onChange={(e) => setFromCurr(e.target.value as CurrencyCode)}
                  className="w-full px-3 py-2.5 text-xs font-mono font-semibold bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-600 cursor-pointer"
                >
                  {(Object.keys(CURRENCY_META) as CurrencyCode[]).map((c) => (
                    <option key={c} value={c}>
                      {c} — {CURRENCY_META[c].name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-span-1 flex justify-center">
                <button
                  type="button"
                  onClick={handleSwapCurrencies}
                  aria-label="Swap currencies"
                  className="p-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 cursor-pointer"
                >
                  <ArrowLeftRight className="w-4 h-4" />
                </button>
              </div>

              <div className="col-span-5">
                <label
                  htmlFor="conv-to-curr"
                  className="block text-xs font-medium text-slate-600 mb-1"
                >
                  To Currency
                </label>
                <select
                  id="conv-to-curr"
                  value={toCurr}
                  onChange={(e) => setToCurr(e.target.value as CurrencyCode)}
                  className="w-full px-3 py-2.5 text-xs font-mono font-semibold bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-600 cursor-pointer"
                >
                  {(Object.keys(CURRENCY_META) as CurrencyCode[]).map((c) => (
                    <option key={c} value={c}>
                      {c} — {CURRENCY_META[c].name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Conversion Output Display */}
            <div className="p-4 rounded-xl bg-sky-50/70 border border-sky-200">
              <div className="text-xs text-sky-800 font-mono tabular-nums">
                {numericAmount.toLocaleString()} {fromCurr} =
              </div>
              <div className="text-2xl font-mono font-bold text-slate-900 tabular-nums mt-1">
                {CURRENCY_META[toCurr].symbol}
                {convertedResult.toLocaleString('en-US', {
                  minimumFractionDigits: toCurr === 'JPY' ? 0 : 2,
                  maximumFractionDigits: toCurr === 'JPY' ? 0 : 2,
                })}{' '}
                <span className="text-sm font-semibold text-sky-800">{toCurr}</span>
              </div>
              <div className="text-xs font-mono text-slate-500 mt-1 tabular-nums">
                1 {fromCurr} = {(getRate(toCurr) / getRate(fromCurr)).toFixed(4)} {toCurr} · 1 {toCurr} ={' '}
                {(getRate(fromCurr) / getRate(toCurr)).toFixed(2)} {fromCurr}
              </div>
            </div>

            {/* All 9 Currencies Live Reference Table */}
            <div>
              <h4 className="text-xs font-semibold text-slate-700 mb-2.5">
                Multi-Currency Equivalent for {numericAmount.toLocaleString()} {fromCurr}
              </h4>
              <div className="grid grid-cols-3 gap-2">
                {(Object.keys(CURRENCY_META) as CurrencyCode[]).map((code) => {
                  const val = amountInINR * getRate(code);
                  return (
                    <div
                      key={code}
                      className="p-2.5 rounded-lg border border-slate-200 bg-slate-50/70 text-xs font-mono tabular-nums"
                    >
                      <div className="text-slate-500 font-semibold">{code}</div>
                      <div className="text-slate-900 font-bold truncate mt-0.5">
                        {CURRENCY_META[code].symbol}
                        {Math.round(val).toLocaleString()}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
