import React, { useState } from 'react';
import {
  Copy,
  Download,
  FileText,
  Plus,
  Share2,
  X,
  Check,
} from 'lucide-react';
import {
  computeRouteLegs,
  DESTINATIONS,
  formatCurrency,
} from '../data/worldTripData';
import {
  AuthUser,
  BudgetBreakdown,
  CurrencyCode,
  WorldTripPlan,
} from '../types/travel';
import { downloadTripPlanAsPDF } from '../utils/pdfExport';

interface DashboardAndSummaryProps {
  trip: WorldTripPlan;
  savedTrips: WorldTripPlan[];
  savedDestinationIds: string[];
  budget: BudgetBreakdown;
  activeCurrency: CurrencyCode;
  customRates?: Partial<Record<CurrencyCode, number>>;
  isDashboardOpen: boolean;
  onCloseDashboard: () => void;
  onSelectTrip: (tripId: string) => void;
  onCreateNewTrip: (tripName: string) => void;
  onDeleteTrip: (tripId: string) => void;
  onNavigate: (sectionId: string) => void;
  user: AuthUser | null;
  onOpenAuth: () => void;
}

export const DashboardAndSummary: React.FC<DashboardAndSummaryProps> = ({
  trip,
  savedTrips,
  savedDestinationIds,
  budget,
  activeCurrency,
  customRates,
  isDashboardOpen,
  onCloseDashboard,
  onSelectTrip,
  onCreateNewTrip,
  onDeleteTrip,
  onNavigate,
  user,
  onOpenAuth,
}) => {
  const [newTripTitle, setNewTripTitle] = useState('');
  const [copiedSummary, setCopiedSummary] = useState(false);

  const legs = computeRouteLegs(trip.startingLocation, trip.selectedCityIds);
  const totalDistanceKm = legs.reduce((sum, l) => sum + l.distanceKm, 0);
  const totalCostINR = Object.values(budget).reduce((sum, v) => sum + v, 0);

  const selectedDestinations = trip.selectedCityIds
    .map((id) => DESTINATIONS.find((d) => d.id === id))
    .filter((d): d is NonNullable<typeof d> => Boolean(d));

  const routeChain = [
    trip.startingLocation.city,
    ...selectedDestinations.map((d) => d.city),
    trip.startingLocation.city,
  ].join(' → ');

  const handleCopyShareSummary = () => {
    const text = `World Explorer Trip Plan: ${trip.name}\nRoute: ${routeChain}\nDuration: ${trip.itinerary.length} Days (${trip.startDate} to ${trip.endDate})\nTravelers: ${trip.travelers} (${trip.travelStyle})\nTotal Estimated Budget: ${formatCurrency(totalCostINR, activeCurrency, customRates)}`;
    navigator.clipboard?.writeText(text);
    setCopiedSummary(true);
    setTimeout(() => setCopiedSummary(false), 2500);
  };

  const completedChecklist = trip.checklist.filter((c) => c.completed).length;
  const packedCount = trip.packingList.filter((p) => p.packed).length;

  return (
    <>
      {/* On-Page Trip Summary Section */}
      <section
        id="summary"
        className="py-16 sm:py-20 bg-slate-900 text-white border-b border-slate-800"
      >
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
            <div>
              <p className="text-xs font-semibold text-emerald-400 mb-2">
                07. Executive World Trip Summary & Official PDF Export
              </p>
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-white tracking-tight">
                Complete World Trip Summary
              </h2>
              <p className="mt-2 text-sm sm:text-base text-slate-300 max-w-2xl">
                Review your end-to-end world route, countries and cities visited, total budget, hotels, transportation, major attractions, and packing readiness.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 self-start">
              <button
                type="button"
                onClick={handleCopyShareSummary}
                className="px-4 py-3 text-xs sm:text-sm font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl inline-flex items-center gap-2 transition-colors whitespace-nowrap cursor-pointer"
              >
                {copiedSummary ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>Trip Summary Copied!</span>
                  </>
                ) : (
                  <>
                    <Share2 className="w-4 h-4" />
                    <span>Share / Copy Summary</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() =>
                  downloadTripPlanAsPDF(trip, activeCurrency, customRates)
                }
                className="px-6 py-3 text-xs sm:text-sm font-semibold text-white bg-orange-600 hover:bg-orange-500 rounded-xl inline-flex items-center gap-2 transition-colors whitespace-nowrap shadow-md cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Download Trip Plan as PDF</span>
              </button>
            </div>
          </div>

          {/* Summary Dossier Surface */}
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-8">
            {/* Route Banner */}
            <div className="pb-6 border-b border-slate-800">
              <div className="text-xs font-mono text-emerald-400 mb-1.5">
                Full Circumnavigation Route ({totalDistanceKm.toLocaleString()} km)
              </div>
              <div className="text-lg sm:text-xl font-display font-bold text-white leading-snug">
                {routeChain}
              </div>
            </div>

            {/* Key Summary Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pb-6 border-b border-slate-800 font-mono tabular-nums">
              <div>
                <span className="text-xs font-sans text-slate-400 block">
                  Countries & Cities Visited
                </span>
                <strong className="text-xl text-white mt-0.5 block">
                  {selectedDestinations.length} Countries · {selectedDestinations.length} Cities
                </strong>
                <span className="text-xs font-sans text-slate-400">
                  + {trip.startingLocation.city}, India hub
                </span>
              </div>

              <div>
                <span className="text-xs font-sans text-slate-400 block">
                  Number of Days
                </span>
                <strong className="text-xl text-white mt-0.5 block">
                  {trip.itinerary.length} Days
                </strong>
                <span className="text-xs text-slate-400">
                  {trip.startDate} → {trip.endDate}
                </span>
              </div>

              <div>
                <span className="text-xs font-sans text-slate-400 block">
                  Total Estimated Cost
                </span>
                <strong className="text-xl text-emerald-400 mt-0.5 block">
                  {formatCurrency(totalCostINR, activeCurrency, customRates)}
                </strong>
                <span className="text-xs font-sans text-slate-400">
                  {trip.travelers} Travelers · {trip.travelStyle} Style
                </span>
              </div>

              <div>
                <span className="text-xs font-sans text-slate-400 block">
                  Checklist & Packing Readiness
                </span>
                <strong className="text-xl text-sky-400 mt-0.5 block">
                  {completedChecklist}/{trip.checklist.length} Tasks · {packedCount}/{trip.packingList.length} Packed
                </strong>
                <span className="text-xs font-sans text-slate-400">
                  Pre-departure status
                </span>
              </div>
            </div>

            {/* 3-Column Detailed Summary Breakdown: Attractions, Hotels & Transport, Packing Checklist */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 text-xs">
              <div>
                <h3 className="text-sm font-bold text-white mb-3">
                  Countries, Cities & Major Attractions
                </h3>
                <div className="space-y-3">
                  {selectedDestinations.map((dest, idx) => (
                    <div
                      key={dest.id}
                      className="p-3 rounded-xl bg-slate-900 border border-slate-800"
                    >
                      <div className="font-bold text-white">
                        0{idx + 1}. {dest.city}, {dest.country} ({trip.cityDays[dest.id] ?? dest.recommendedDays} Days)
                      </div>
                      <div className="text-slate-400 mt-1">
                        {dest.popularAttractions.slice(0, 3).join(' · ')}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-bold text-white mb-3">
                  Selected Hotels & Transportation
                </h3>
                <div className="space-y-3">
                  {selectedDestinations.map((dest) => {
                    const hotel = dest.hotelsByStyle[trip.travelStyle];
                    return (
                      <div
                        key={dest.id}
                        className="p-3 rounded-xl bg-slate-900 border border-slate-800"
                      >
                        <div className="font-bold text-emerald-400">
                          {dest.city}: {hotel.name}
                        </div>
                        <div className="text-slate-300 mt-0.5">
                          Area: {hotel.area} ·{' '}
                          <span className="font-mono tabular-nums">
                            {formatCurrency(
                              hotel.nightlyRateINR,
                              activeCurrency,
                              customRates
                            )}
                            /night
                          </span>
                        </div>
                        <div className="text-slate-400 mt-1">
                          Transit: {dest.dayTemplates[0]?.transport}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-bold text-white mb-3">
                  Packing & Readiness Summary
                </h3>
                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2.5">
                  {trip.packingList.slice(0, 7).map((item) => (
                    <div
                      key={item.id}
                      className="flex items-start justify-between gap-2 pb-2 border-b border-slate-800/80 last:border-none last:pb-0"
                    >
                      <span className="text-slate-200">{item.name}</span>
                      <span
                        className={`font-mono shrink-0 ${
                          item.packed ? 'text-emerald-400' : 'text-amber-400'
                        }`}
                      >
                        {item.packed ? 'Packed' : 'To Pack'}
                      </span>
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() =>
                    downloadTripPlanAsPDF(trip, activeCurrency, customRates)
                  }
                  className="w-full mt-4 py-3 px-4 bg-orange-600 hover:bg-orange-500 text-white font-semibold rounded-xl inline-flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <FileText className="w-4 h-4" />
                  <span>Download Trip Plan as PDF</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* User Dashboard Modal */}
      {isDashboardOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="User Trip Management Dashboard"
          className="fixed inset-0 z-50 bg-slate-950/65 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
        >
          <div className="bg-white border border-slate-200 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="sticky top-0 z-10 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
              <div>
                <div className="text-xs font-semibold text-sky-700">
                  World Explorer Traveler Workspace
                </div>
                <h3 className="font-display text-2xl font-bold text-slate-900">
                  User Dashboard & Saved Trips
                </h3>
              </div>
              <button
                type="button"
                onClick={onCloseDashboard}
                className="p-2 text-slate-500 hover:text-slate-900 rounded-lg hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-8">
              {/* Account Status Banner */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-wrap items-center justify-between gap-4">
                <div>
                  <div className="text-sm font-bold text-slate-900">
                    {user
                      ? `Signed in as ${user.name} (${user.email})`
                      : 'Guest Session Active'}
                  </div>
                  <div className="text-xs text-slate-500">
                    {user
                      ? 'Your trips, checklists, and preferences are synced to your profile.'
                      : 'Sign in with email and password to manage your trips across sessions.'}
                  </div>
                </div>
                {!user && (
                  <button
                    type="button"
                    onClick={() => {
                      onCloseDashboard();
                      onOpenAuth();
                    }}
                    className="px-4 py-2 bg-sky-700 hover:bg-sky-600 text-white text-xs font-semibold rounded-lg cursor-pointer"
                  >
                    Sign In / Create Account
                  </button>
                )}
              </div>

              {/* Create or Switch Trips */}
              <div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                  <h4 className="text-base font-bold text-slate-900">
                    Your Saved World Trips ({savedTrips.length})
                  </h4>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={newTripTitle}
                      onChange={(e) => setNewTripTitle(e.target.value)}
                      placeholder="New trip title (e.g., Summer Europe & Japan)"
                      className="px-3 py-1.5 text-xs border border-slate-300 rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (!newTripTitle.trim()) return;
                        onCreateNewTrip(newTripTitle.trim());
                        setNewTripTitle('');
                      }}
                      className="px-3.5 py-1.5 bg-sky-700 hover:bg-sky-600 text-white text-xs font-semibold rounded-lg inline-flex items-center gap-1 whitespace-nowrap cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Create Trip</span>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {savedTrips.map((t) => {
                    const isActive = t.id === trip.id;
                    return (
                      <div
                        key={t.id}
                        className={`p-4 rounded-xl border flex flex-col justify-between gap-3 ${
                          isActive
                            ? 'border-sky-600 bg-sky-50/40'
                            : 'border-slate-200 bg-white'
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-bold text-slate-900">
                              {t.name}
                            </span>
                            {isActive && (
                              <span className="text-xs font-semibold text-sky-700">
                                Active
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-slate-500 mt-1">
                            Origin: {t.startingLocation.city} · {t.selectedCityIds.length} Stops ·{' '}
                            {t.itinerary.length} Days · {t.travelStyle}
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => onSelectTrip(t.id)}
                            className="px-3 py-1.5 text-xs font-semibold bg-slate-900 text-white rounded-lg cursor-pointer"
                          >
                            {isActive ? 'Editing Now' : 'Load Trip'}
                          </button>
                          {savedTrips.length > 1 && (
                            <button
                              type="button"
                              onClick={() => onDeleteTrip(t.id)}
                              className="px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 rounded-lg cursor-pointer"
                            >
                              Delete
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Saved / Bookmarked Destinations */}
              <div>
                <h4 className="text-base font-bold text-slate-900 mb-3">
                  Saved Destinations ({savedDestinationIds.length})
                </h4>
                {savedDestinationIds.length === 0 ? (
                  <p className="text-xs text-slate-500">
                    Click the bookmark icon on any destination card to save places for future trips.
                  </p>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {savedDestinationIds.map((id) => {
                      const d = DESTINATIONS.find((dest) => dest.id === id);
                      if (!d) return null;
                      return (
                        <div
                          key={id}
                          className="px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 text-xs font-medium text-slate-800"
                        >
                          {d.city}, {d.country} ({d.airportCode})
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Quick Workspace Jump Actions */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => {
                    onCloseDashboard();
                    onNavigate('planner');
                  }}
                  className="p-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-left text-xs cursor-pointer"
                >
                  <strong className="text-slate-900 block">Edit Route & Dates</strong>
                  <span className="text-slate-500">Trip Planner Form</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onCloseDashboard();
                    onNavigate('itinerary');
                  }}
                  className="p-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-left text-xs cursor-pointer"
                >
                  <strong className="text-slate-900 block">View Itinerary</strong>
                  <span className="text-slate-500">{trip.itinerary.length} Daily Plans</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onCloseDashboard();
                    onNavigate('budget');
                  }}
                  className="p-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-left text-xs cursor-pointer"
                >
                  <strong className="text-slate-900 block">View Budget</strong>
                  <span className="text-slate-500 font-mono tabular-nums">
                    {formatCurrency(totalCostINR, activeCurrency, customRates)}
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() =>
                    downloadTripPlanAsPDF(trip, activeCurrency, customRates)
                  }
                  className="p-3 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-left text-xs cursor-pointer"
                >
                  <strong className="block">Download PDF</strong>
                  <span className="text-orange-100">Official Trip Dossier</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
