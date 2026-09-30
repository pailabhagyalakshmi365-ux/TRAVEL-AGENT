import React from 'react';
import { CURRENCY_META } from '../data/worldTripData';
import { AuthUser, CurrencyCode } from '../types/travel';

interface NavbarProps {
  activeSection: string;
  onNavigate: (sectionId: string) => void;
  activeCurrency: CurrencyCode;
  onCurrencyChange: (currency: CurrencyCode) => void;
  user: AuthUser | null;
  onOpenAuth: () => void;
  onLogout: () => void;
  onOpenDashboard: () => void;
}

const NAV_ITEMS = [
  { id: 'planner', label: 'Trip Planner' },
  { id: 'itinerary', label: 'Itinerary' },
  { id: 'world-map', label: 'World Map' },
  { id: 'destinations', label: 'Destinations' },
  { id: 'budget', label: 'Budget & FX' },
  { id: 'toolkit', label: 'Toolkit & Vault' },
];

export const Navbar: React.FC<NavbarProps> = ({
  activeSection,
  onNavigate,
  activeCurrency,
  onCurrencyChange,
  user,
  onOpenAuth,
  onLogout,
  onOpenDashboard,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Zone 1: Single text element brand wordmark */}
        <a
          href="#hero"
          onClick={(e) => {
            e.preventDefault();
            onNavigate('hero');
          }}
          className="font-display text-xl font-bold tracking-tight text-slate-900 whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-600 rounded"
        >
          World Explorer
        </a>

        {/* Zone 2: 6 clean single-line text navigation links */}
        <nav
          aria-label="Primary Navigation"
          className="hidden lg:flex items-center gap-7 text-sm font-medium text-slate-600"
        >
          {NAV_ITEMS.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  onNavigate(item.id);
                }}
                className={`whitespace-nowrap shrink-0 py-1 border-b-2 transition-colors duration-150 ${
                  isActive
                    ? 'border-sky-600 text-slate-900 font-semibold'
                    : 'border-transparent hover:text-slate-900 hover:border-slate-300'
                }`}
              >
                {item.label}
              </a>
            );
          })}
        </nav>

        {/* Zone 3: Primary actions */}
        <div className="flex items-center gap-2.5 shrink-0">
          <label htmlFor="global-currency-select" className="sr-only">
            Display Currency
          </label>
          <select
            id="global-currency-select"
            value={activeCurrency}
            onChange={(e) => onCurrencyChange(e.target.value as CurrencyCode)}
            className="h-9 px-2.5 text-xs font-mono font-medium text-slate-700 bg-slate-100 border border-slate-200 rounded-lg hover:bg-slate-200/70 focus:outline-none focus:ring-2 focus:ring-sky-600 transition-colors cursor-pointer"
          >
            {(Object.keys(CURRENCY_META) as CurrencyCode[]).map((code) => (
              <option key={code} value={code}>
                {code} ({CURRENCY_META[code].symbol.trim()})
              </option>
            ))}
          </select>

          <button
            type="button"
            onClick={onOpenDashboard}
            className="h-9 px-3.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            Dashboard & PDF
          </button>

          {user ? (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onOpenDashboard}
                className="hidden sm:inline-flex h-9 px-3 items-center text-xs font-semibold text-sky-900 bg-sky-50 border border-sky-200 rounded-lg whitespace-nowrap max-w-[140px] truncate cursor-pointer"
                title={user.email}
              >
                {user.name}
              </button>
              <button
                type="button"
                onClick={onLogout}
                className="h-9 px-3 text-xs font-medium text-slate-600 hover:text-slate-900 border border-slate-200 rounded-lg hover:bg-slate-100 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                Logout
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={onOpenAuth}
              className="h-9 px-4 text-xs font-semibold text-white bg-orange-600 hover:bg-orange-500 rounded-lg transition-colors whitespace-nowrap shrink-0 shadow-xs cursor-pointer"
            >
              Sign In
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
