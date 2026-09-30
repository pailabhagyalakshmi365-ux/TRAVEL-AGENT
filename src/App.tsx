/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useMemo, useState } from 'react';
import { AuthModal } from './components/AuthModal';
import { BudgetAndCurrency } from './components/BudgetAndCurrency';
import { DashboardAndSummary } from './components/DashboardAndSummary';
import { DestinationExplorer } from './components/DestinationExplorer';
import { HeroSection } from './components/HeroSection';
import { ItinerarySection } from './components/ItinerarySection';
import { N8nChatWidget } from './components/N8nChatWidget';
import { Navbar } from './components/Navbar';
import { TravelToolkit } from './components/TravelToolkit';
import { TripPlannerForm } from './components/TripPlannerForm';
import { WorldMapSection } from './components/WorldMapSection';
import {
  calculateTripBudget,
  createDefaultHyderabadWorldTrip,
  DESTINATIONS,
  generatePackingList,
  generateTripItinerary,
  INITIAL_DOCUMENTS_VAULT,
} from './data/worldTripData';
import {
  AuthUser,
  BudgetBreakdown,
  ChecklistCategory,
  CurrencyCode,
  DestinationData,
  ItineraryDay,
  PackingItem,
  TravelDocumentsVault,
  WorldTripPlan,
} from './types/travel';

const TRIPS_STORAGE_KEY = 'world_explorer_saved_trips_v1';
const USER_STORAGE_KEY = 'world_explorer_active_user_v1';
const VAULT_STORAGE_KEY = 'world_explorer_docs_vault_v1';
const SAVED_DEST_KEY = 'world_explorer_saved_dests_v1';

export default function App() {
  // Saved trips state initialized with the Hyderabad -> Dubai -> Paris -> London -> NY -> Tokyo -> Singapore -> Hyderabad World Trip
  const [savedTrips, setSavedTrips] = useState<WorldTripPlan[]>(() => {
    try {
      const raw = localStorage.getItem(TRIPS_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // ignore storage errors
    }
    return [createDefaultHyderabadWorldTrip()];
  });

  const [activeTripId, setActiveTripId] = useState<string>(
    () => savedTrips[0]?.id || 'trip-hyd-world-flagship'
  );

  const activeTrip = useMemo(
    () => savedTrips.find((t) => t.id === activeTripId) || savedTrips[0],
    [savedTrips, activeTripId]
  );

  const [activeCurrency, setActiveCurrency] = useState<CurrencyCode>(
    activeTrip.currency || 'INR'
  );
  const [activeSection, setActiveSection] = useState<string>('hero');
  const [inspectedDestination, setInspectedDestination] =
    useState<DestinationData | null>(null);
  const [isDashboardOpen, setIsDashboardOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);

  // User Auth State (never hardcoded)
  const [user, setUser] = useState<AuthUser | null>(() => {
    try {
      const raw = localStorage.getItem(USER_STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });

  // Saved/Bookmarked Destinations
  const [savedDestinationIds, setSavedDestinationIds] = useState<string[]>(() => {
    try {
      const raw = localStorage.getItem(SAVED_DEST_KEY);
      return raw ? JSON.parse(raw) : ['dubai', 'paris', 'tokyo'];
    } catch {
      return ['dubai', 'paris', 'tokyo'];
    }
  });

  // Secure Travel Documents Vault
  const [documentsVault, setDocumentsVault] = useState<TravelDocumentsVault>(() => {
    try {
      const raw = localStorage.getItem(VAULT_STORAGE_KEY);
      return raw ? JSON.parse(raw) : INITIAL_DOCUMENTS_VAULT;
    } catch {
      return INITIAL_DOCUMENTS_VAULT;
    }
  });

  // Live Exchange Rates State (with fallback to realistic default rates)
  const [customRates, setCustomRates] = useState<
    Partial<Record<CurrencyCode, number>>
  >({});
  const [ratesSource, setRatesSource] = useState<string>('Reference FX Rates');

  useEffect(() => {
    let cancelled = false;
    fetch('https://open.er-api.com/v6/latest/INR')
      .then((res) => {
        if (!res.ok) throw new Error('FX API unavailable');
        return res.json();
      })
      .then((data) => {
        if (cancelled || !data?.rates) return;
        const supported: CurrencyCode[] = [
          'INR',
          'USD',
          'EUR',
          'GBP',
          'JPY',
          'AED',
          'AUD',
          'CAD',
          'SGD',
        ];
        const nextRates: Partial<Record<CurrencyCode, number>> = {};
        supported.forEach((code) => {
          if (typeof data.rates[code] === 'number') {
            nextRates[code] = data.rates[code];
          }
        });
        setCustomRates(nextRates);
        setRatesSource('Live Exchange Rates');
      })
      .catch(() => {
        // Keep built-in reference rates silently
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // Persist changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(TRIPS_STORAGE_KEY, JSON.stringify(savedTrips));
    } catch {
      // ignore
    }
  }, [savedTrips]);

  useEffect(() => {
    try {
      localStorage.setItem(VAULT_STORAGE_KEY, JSON.stringify(documentsVault));
    } catch {
      // ignore
    }
  }, [documentsVault]);

  useEffect(() => {
    try {
      localStorage.setItem(SAVED_DEST_KEY, JSON.stringify(savedDestinationIds));
    } catch {
      // ignore
    }
  }, [savedDestinationIds]);

  const updateActiveTrip = (
    updater: (prev: WorldTripPlan) => WorldTripPlan
  ) => {
    setSavedTrips((prevList) =>
      prevList.map((item) => {
        if (item.id !== activeTrip.id) return item;
        const updated = updater(item);
        return { ...updated, updatedAt: new Date().toISOString() };
      })
    );
  };

  // Keep itinerary automatically synchronized when route cities, days, start date, or travel style change
  const handleRegenerateItinerary = () => {
    updateActiveTrip((prev) => {
      const totalDays = prev.selectedCityIds.reduce(
        (sum, id) => sum + (prev.cityDays[id] ?? 3),
        0
      );
      const endObj = new Date(prev.startDate || '2026-11-10');
      endObj.setDate(endObj.getDate() + Math.max(1, totalDays) - 1);
      const nextEndDate = endObj.toISOString().split('T')[0];

      const nextItinerary = generateTripItinerary(
        prev.startingLocation,
        prev.selectedCityIds,
        prev.cityDays,
        prev.startDate,
        prev.travelStyle,
        prev.interests
      );
      const nextPacking = generatePackingList(
        prev.selectedCityIds,
        totalDays,
        prev.interests
      );
      return {
        ...prev,
        endDate: nextEndDate,
        itinerary: nextItinerary,
        packingList: nextPacking,
      };
    });
  };

  const handleToggleCityInTrip = (cityId: string) => {
    updateActiveTrip((prev) => {
      const exists = prev.selectedCityIds.includes(cityId);
      if (exists && prev.selectedCityIds.length <= 1) return prev;
      const nextCityIds = exists
        ? prev.selectedCityIds.filter((id) => id !== cityId)
        : [...prev.selectedCityIds, cityId];

      const destObj = DESTINATIONS.find((d) => d.id === cityId);
      const nextCityDays = {
        ...prev.cityDays,
        [cityId]: prev.cityDays[cityId] ?? destObj?.recommendedDays ?? 3,
      };
      const totalDays = nextCityIds.reduce(
        (sum, id) => sum + (nextCityDays[id] ?? 3),
        0
      );
      const endObj = new Date(prev.startDate || '2026-11-10');
      endObj.setDate(endObj.getDate() + Math.max(1, totalDays) - 1);

      const nextItinerary = generateTripItinerary(
        prev.startingLocation,
        nextCityIds,
        nextCityDays,
        prev.startDate,
        prev.travelStyle,
        prev.interests
      );

      return {
        ...prev,
        selectedCityIds: nextCityIds,
        cityDays: nextCityDays,
        endDate: endObj.toISOString().split('T')[0],
        itinerary: nextItinerary,
      };
    });
  };

  const budget = useMemo(
    () =>
      calculateTripBudget(
        activeTrip.startingLocation,
        activeTrip.selectedCityIds,
        activeTrip.cityDays,
        activeTrip.travelers,
        activeTrip.travelStyle,
        activeTrip.customBudgetOverrides
      ),
    [
      activeTrip.startingLocation,
      activeTrip.selectedCityIds,
      activeTrip.cityDays,
      activeTrip.travelers,
      activeTrip.travelStyle,
      activeTrip.customBudgetOverrides,
    ]
  );

  const totalBudgetINR = useMemo(
    () => Object.values(budget).reduce((sum, val) => sum + val, 0),
    [budget]
  );

  const handleNavigate = (sectionId: string) => {
    setActiveSection(sectionId);
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleCurrencyChange = (currency: CurrencyCode) => {
    setActiveCurrency(currency);
    updateActiveTrip((prev) => ({ ...prev, currency }));
  };

  const handleUpdateItineraryDay = (
    dayNumber: number,
    updated: Partial<ItineraryDay>
  ) => {
    updateActiveTrip((prev) => ({
      ...prev,
      itinerary: prev.itinerary.map((d) =>
        d.dayNumber === dayNumber ? { ...d, ...updated } : d
      ),
    }));
  };

  const handleUpdateBudgetOverride = (
    category: keyof BudgetBreakdown,
    valueINR: number
  ) => {
    updateActiveTrip((prev) => ({
      ...prev,
      customBudgetOverrides: {
        ...prev.customBudgetOverrides,
        [category]: valueINR,
      },
    }));
  };

  const handleResetBudgetOverrides = () => {
    updateActiveTrip((prev) => ({
      ...prev,
      customBudgetOverrides: {},
    }));
  };

  const handleToggleChecklistItem = (id: string) => {
    updateActiveTrip((prev) => ({
      ...prev,
      checklist: prev.checklist.map((c) =>
        c.id === id ? { ...c, completed: !c.completed } : c
      ),
    }));
  };

  const handleAddChecklistItem = (
    category: ChecklistCategory,
    title: string,
    detail: string
  ) => {
    updateActiveTrip((prev) => ({
      ...prev,
      checklist: [
        ...prev.checklist,
        {
          id: `chk-${Date.now()}`,
          category,
          title,
          detail,
          completed: false,
        },
      ],
    }));
  };

  const handleTogglePackingItem = (id: string) => {
    updateActiveTrip((prev) => ({
      ...prev,
      packingList: prev.packingList.map((p) =>
        p.id === id ? { ...p, packed: !p.packed } : p
      ),
    }));
  };

  const handleAddPackingItem = (
    category: PackingItem['category'],
    name: string,
    reason: string
  ) => {
    updateActiveTrip((prev) => ({
      ...prev,
      packingList: [
        ...prev.packingList,
        {
          id: `pk-${Date.now()}`,
          category,
          name,
          reason,
          packed: false,
        },
      ],
    }));
  };

  const handleRegeneratePackingList = () => {
    updateActiveTrip((prev) => ({
      ...prev,
      packingList: generatePackingList(
        prev.selectedCityIds,
        prev.itinerary.length,
        prev.interests
      ),
    }));
  };

  const handleClearSensitivePassportData = () => {
    setDocumentsVault((prev) => ({
      ...prev,
      passport: {
        holderName: '',
        passportNumber: '',
        issuingCountry: 'Republic of India',
        issueDate: '',
        expiryDate: '',
        notes: 'Sensitive passport fields cleared.',
      },
    }));
  };

  const handleResetFlagshipTrip = () => {
    const fresh = createDefaultHyderabadWorldTrip();
    setSavedTrips((prev) =>
      prev.map((t) => (t.id === activeTrip.id ? { ...fresh, id: t.id } : t))
    );
  };

  const handleCreateNewTrip = (tripName: string) => {
    const base = createDefaultHyderabadWorldTrip();
    const newTrip: WorldTripPlan = {
      ...base,
      id: `trip-${Date.now()}`,
      name: tripName,
    };
    setSavedTrips((prev) => [...prev, newTrip]);
    setActiveTripId(newTrip.id);
  };

  const handleDeleteTrip = (tripId: string) => {
    setSavedTrips((prev) => {
      const remaining = prev.filter((t) => t.id !== tripId);
      if (remaining.length === 0) {
        const fallback = createDefaultHyderabadWorldTrip();
        setActiveTripId(fallback.id);
        return [fallback];
      }
      if (activeTripId === tripId) {
        setActiveTripId(remaining[0].id);
      }
      return remaining;
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      {/* Top Bar Contract Navigation */}
      <Navbar
        activeSection={activeSection}
        onNavigate={handleNavigate}
        activeCurrency={activeCurrency}
        onCurrencyChange={handleCurrencyChange}
        user={user}
        onOpenAuth={() => setIsAuthOpen(true)}
        onLogout={() => {
          setUser(null);
          localStorage.removeItem(USER_STORAGE_KEY);
        }}
        onOpenDashboard={() => setIsDashboardOpen(true)}
      />

      {/* Main Content */}
      <main className="flex-1">
        <HeroSection
          trip={activeTrip}
          totalBudgetINR={totalBudgetINR}
          activeCurrency={activeCurrency}
          customRates={customRates}
          onPlanMyTrip={() => handleNavigate('planner')}
          onExploreDestinations={() => handleNavigate('destinations')}
          onSelectDestinationForGuide={(dest) => setInspectedDestination(dest)}
          onToggleCityInTrip={handleToggleCityInTrip}
          onResetFlagshipTrip={handleResetFlagshipTrip}
          onOpenChat={() => setIsChatOpen(true)}
        />

        <TripPlannerForm
          trip={activeTrip}
          activeCurrency={activeCurrency}
          customRates={customRates}
          estimatedTotalINR={totalBudgetINR}
          onUpdateTrip={updateActiveTrip}
          onCurrencyChange={handleCurrencyChange}
          onRegenerateItinerary={handleRegenerateItinerary}
        />

        <WorldMapSection
          trip={activeTrip}
          activeCurrency={activeCurrency}
          customRates={customRates}
          onToggleCityInTrip={handleToggleCityInTrip}
          onSelectDestinationForGuide={(dest) => setInspectedDestination(dest)}
        />

        <ItinerarySection
          trip={activeTrip}
          activeCurrency={activeCurrency}
          customRates={customRates}
          onUpdateDay={handleUpdateItineraryDay}
        />

        <DestinationExplorer
          selectedCityIds={activeTrip.selectedCityIds}
          savedDestinationIds={savedDestinationIds}
          travelStyle={activeTrip.travelStyle}
          activeCurrency={activeCurrency}
          customRates={customRates}
          inspectedDestination={inspectedDestination}
          onSelectDestinationForGuide={(dest) => setInspectedDestination(dest)}
          onToggleCityInTrip={handleToggleCityInTrip}
          onToggleSaveDestination={(cityId) =>
            setSavedDestinationIds((prev) =>
              prev.includes(cityId)
                ? prev.filter((id) => id !== cityId)
                : [...prev, cityId]
            )
          }
        />

        <BudgetAndCurrency
          trip={activeTrip}
          budget={budget}
          activeCurrency={activeCurrency}
          customRates={customRates}
          ratesSource={ratesSource}
          onUpdateBudgetOverride={handleUpdateBudgetOverride}
          onResetBudgetOverrides={handleResetBudgetOverrides}
        />

        <TravelToolkit
          trip={activeTrip}
          documentsVault={documentsVault}
          onToggleChecklistItem={handleToggleChecklistItem}
          onAddChecklistItem={handleAddChecklistItem}
          onTogglePackingItem={handleTogglePackingItem}
          onAddPackingItem={handleAddPackingItem}
          onRegeneratePackingList={handleRegeneratePackingList}
          onUpdateVault={setDocumentsVault}
          onClearSensitivePassportData={handleClearSensitivePassportData}
        />

        <DashboardAndSummary
          trip={activeTrip}
          savedTrips={savedTrips}
          savedDestinationIds={savedDestinationIds}
          budget={budget}
          activeCurrency={activeCurrency}
          customRates={customRates}
          isDashboardOpen={isDashboardOpen}
          onCloseDashboard={() => setIsDashboardOpen(false)}
          onSelectTrip={(id) => setActiveTripId(id)}
          onCreateNewTrip={handleCreateNewTrip}
          onDeleteTrip={handleDeleteTrip}
          onNavigate={handleNavigate}
          user={user}
          onOpenAuth={() => setIsAuthOpen(true)}
        />
      </main>

      {/* Quiet Editorial Footer */}
      <footer className="bg-slate-950 text-slate-400 border-t border-slate-800 py-10">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <div>
            <span className="font-display font-bold text-white text-sm">
              World Explorer
            </span>
            <span className="mx-2" aria-hidden="true">
              ·
            </span>
            <span>
              Plan Your Dream World Trip from India · Hyderabad → Dubai → Paris → London → New York → Tokyo → Singapore → Hyderabad
            </span>
          </div>
          <div className="flex items-center gap-5">
            <a
              href="#planner"
              onClick={(e) => {
                e.preventDefault();
                handleNavigate('planner');
              }}
              className="hover:text-white transition-colors"
            >
              Trip Planner
            </a>
            <a
              href="#world-map"
              onClick={(e) => {
                e.preventDefault();
                handleNavigate('world-map');
              }}
              className="hover:text-white transition-colors"
            >
              World Map
            </a>
            <a
              href="#destinations"
              onClick={(e) => {
                e.preventDefault();
                handleNavigate('destinations');
              }}
              className="hover:text-white transition-colors"
            >
              Destinations
            </a>
            <a
              href="#summary"
              onClick={(e) => {
                e.preventDefault();
                handleNavigate('summary');
              }}
              className="hover:text-white transition-colors"
            >
              Trip Summary & PDF
            </a>
          </div>
        </div>
      </footer>

      {/* Email / Password Authentication Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onAuthenticated={(loggedUser) => {
          setUser(loggedUser);
          try {
            localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(loggedUser));
          } catch {
            // ignore
          }
        }}
      />

      {/* n8n Live Travel Chat Widget */}
      <N8nChatWidget
        trip={activeTrip}
        activeCurrency={activeCurrency}
        isOpen={isChatOpen}
        onToggleOpen={() => setIsChatOpen((prev) => !prev)}
      />
    </div>
  );
}
