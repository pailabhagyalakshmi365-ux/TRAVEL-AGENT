import React, { useState } from 'react';
import {
  CheckSquare,
  Eye,
  EyeOff,
  Lock,
  Plus,
  RefreshCw,
  ShieldCheck,
  Square,
  Trash2,
} from 'lucide-react';
import {
  ChecklistCategory,
  ChecklistItem,
  PackingItem,
  TravelDocumentsVault,
  WorldTripPlan,
} from '../types/travel';

interface TravelToolkitProps {
  trip: WorldTripPlan;
  documentsVault: TravelDocumentsVault;
  onToggleChecklistItem: (id: string) => void;
  onAddChecklistItem: (
    category: ChecklistCategory,
    title: string,
    detail: string
  ) => void;
  onTogglePackingItem: (id: string) => void;
  onAddPackingItem: (
    category: PackingItem['category'],
    name: string,
    reason: string
  ) => void;
  onRegeneratePackingList: () => void;
  onUpdateVault: (
    updater: (prev: TravelDocumentsVault) => TravelDocumentsVault
  ) => void;
  onClearSensitivePassportData: () => void;
}

const CHECKLIST_CATEGORIES: ChecklistCategory[] = [
  'Passport',
  'Visa',
  'Flight tickets',
  'Hotel bookings',
  'Travel insurance',
  'Currency',
  'SIM/eSIM',
  'Medicines',
  'Clothes',
  'Important documents',
];

function maskSensitive(value: string, showUnmasked: boolean): string {
  if (!value) return 'Not entered (Private)';
  if (showUnmasked) return value;
  if (value.length <= 4) return '••••';
  return `${'•'.repeat(Math.max(4, value.length - 3))}${value.slice(-3)}`;
}

export const TravelToolkit: React.FC<TravelToolkitProps> = ({
  trip,
  documentsVault,
  onToggleChecklistItem,
  onAddChecklistItem,
  onTogglePackingItem,
  onAddPackingItem,
  onRegeneratePackingList,
  onUpdateVault,
  onClearSensitivePassportData,
}) => {
  const [activeTab, setActiveTab] = useState<'checklist' | 'packing' | 'vault'>(
    'checklist'
  );

  // Checklist new item state
  const [newChkCategory, setNewChkCategory] =
    useState<ChecklistCategory>('Passport');
  const [newChkTitle, setNewChkTitle] = useState('');
  const [newChkDetail, setNewChkDetail] = useState('');

  // Packing new item state
  const [newPackCat, setNewPackCat] =
    useState<PackingItem['category']>('Clothing & Layers');
  const [newPackName, setNewPackName] = useState('');
  const [newPackReason, setNewPackReason] = useState('');

  // Vault privacy mask state (sensitive data hidden by default!)
  const [showSensitiveNumbers, setShowSensitiveNumbers] = useState(false);

  // Vault new flight / emergency contact form state
  const [newContactName, setNewContactName] = useState('');
  const [newContactRole, setNewContactRole] = useState('');
  const [newContactPhone, setNewContactPhone] = useState('');

  const completedChecklistCount = trip.checklist.filter(
    (c) => c.completed
  ).length;
  const packedItemsCount = trip.packingList.filter((p) => p.packed).length;

  return (
    <section
      id="toolkit"
      className="py-16 sm:py-20 bg-white border-b border-slate-200"
    >
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header & Tab Switcher */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
          <div>
            <p className="text-xs font-semibold text-sky-700 mb-2">
              06. Pre-Departure Readiness & Encrypted Local Document Organizer
            </p>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
              Travel Checklist, Packing List & Documents Vault
            </h2>
            <p className="mt-2 text-sm sm:text-base text-slate-600 max-w-2xl">
              Track your 10-point international departure checklist, generate weather-adaptive packing lists, and store travel documents with privacy masking.
            </p>
          </div>

          <div
            role="tablist"
            aria-label="Travel Toolkit Tabs"
            className="flex flex-wrap items-center gap-1.5 p-1.5 bg-slate-100 rounded-xl border border-slate-200 self-start"
          >
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'checklist'}
              onClick={() => setActiveTab('checklist')}
              className={`px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                activeTab === 'checklist'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Travel Checklist ({completedChecklistCount}/{trip.checklist.length})
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'packing'}
              onClick={() => setActiveTab('packing')}
              className={`px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                activeTab === 'packing'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Packing List ({packedItemsCount}/{trip.packingList.length})
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'vault'}
              onClick={() => setActiveTab('vault')}
              className={`px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                activeTab === 'vault'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Travel Documents Vault
            </button>
          </div>
        </div>

        {/* TAB 1: TRAVEL CHECKLIST */}
        {activeTab === 'checklist' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8 space-y-3">
              {trip.checklist.map((item) => (
                <div
                  key={item.id}
                  onClick={() => onToggleChecklistItem(item.id)}
                  className={`p-4 rounded-xl border transition-colors flex items-start gap-3.5 cursor-pointer ${
                    item.completed
                      ? 'bg-emerald-50/40 border-emerald-200'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <button
                    type="button"
                    aria-label={`Mark ${item.title} as ${
                      item.completed ? 'incomplete' : 'complete'
                    }`}
                    className="mt-0.5 text-sky-700 shrink-0"
                  >
                    {item.completed ? (
                      <CheckSquare className="w-5 h-5 text-emerald-600" />
                    ) : (
                      <Square className="w-5 h-5 text-slate-400" />
                    )}
                  </button>
                  <div className="flex-1">
                    <div className="text-xs font-mono text-sky-800 font-semibold">
                      {item.category} · {item.completed ? 'Completed' : 'Action Required'}
                    </div>
                    <div
                      className={`text-sm font-bold mt-0.5 ${
                        item.completed
                          ? 'line-through text-slate-500'
                          : 'text-slate-900'
                      }`}
                    >
                      {item.title}
                    </div>
                    <p className="text-xs text-slate-500 mt-1">{item.detail}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Add Custom Checklist Task */}
            <div className="lg:col-span-4 bg-slate-50 border border-slate-200 rounded-2xl p-6 h-fit space-y-4">
              <h3 className="text-base font-bold text-slate-900">
                Add Checklist Task
              </h3>
              <p className="text-xs text-slate-500">
                All 10 essential travel readiness categories are covered. Add custom reminders for your trip below.
              </p>

              <div>
                <label
                  htmlFor="chk-cat-select"
                  className="block text-xs font-medium text-slate-700 mb-1"
                >
                  Category
                </label>
                <select
                  id="chk-cat-select"
                  value={newChkCategory}
                  onChange={(e) =>
                    setNewChkCategory(e.target.value as ChecklistCategory)
                  }
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg"
                >
                  {CHECKLIST_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="chk-title-input"
                  className="block text-xs font-medium text-slate-700 mb-1"
                >
                  Task Title
                </label>
                <input
                  id="chk-title-input"
                  type="text"
                  value={newChkTitle}
                  onChange={(e) => setNewChkTitle(e.target.value)}
                  placeholder="e.g., Book Louvres timed-entry slot"
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg"
                />
              </div>

              <div>
                <label
                  htmlFor="chk-detail-input"
                  className="block text-xs font-medium text-slate-700 mb-1"
                >
                  Notes
                </label>
                <input
                  id="chk-detail-input"
                  type="text"
                  value={newChkDetail}
                  onChange={(e) => setNewChkDetail(e.target.value)}
                  placeholder="e.g., Print QR voucher for Day 5 morning"
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg"
                />
              </div>

              <button
                type="button"
                onClick={() => {
                  if (!newChkTitle.trim()) return;
                  onAddChecklistItem(
                    newChkCategory,
                    newChkTitle.trim(),
                    newChkDetail.trim() || 'Custom traveler checklist item'
                  );
                  setNewChkTitle('');
                  setNewChkDetail('');
                }}
                className="w-full py-2.5 px-4 bg-sky-700 hover:bg-sky-600 text-white text-xs font-semibold rounded-xl transition-colors inline-flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add to Travel Checklist</span>
              </button>
            </div>
          </div>
        )}

        {/* TAB 2: PERSONALIZED PACKING LIST */}
        {activeTab === 'packing' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8 space-y-4">
              <div className="p-4 rounded-xl bg-sky-50/70 border border-sky-200 flex flex-wrap items-center justify-between gap-4">
                <div className="text-xs text-sky-950">
                  <strong>Smart Packing Profile:</strong> Tailored for{' '}
                  {trip.itinerary.length} days across {trip.selectedCityIds.length}{' '}
                  countries · Interests: {trip.interests.join(', ')}
                </div>
                <button
                  type="button"
                  onClick={onRegeneratePackingList}
                  className="px-3 py-1.5 text-xs font-semibold text-sky-800 bg-white border border-sky-200 rounded-lg hover:bg-sky-100 inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Sync with Route & Weather</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {trip.packingList.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => onTogglePackingItem(item.id)}
                    className={`p-4 rounded-xl border transition-colors flex items-start gap-3 cursor-pointer ${
                      item.packed
                        ? 'bg-emerald-50/40 border-emerald-200'
                        : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <button
                      type="button"
                      aria-label={`Toggle packed status for ${item.name}`}
                      className="mt-0.5 shrink-0"
                    >
                      {item.packed ? (
                        <CheckSquare className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <Square className="w-4 h-4 text-slate-400" />
                      )}
                    </button>
                    <div>
                      <div className="text-[11px] font-mono text-slate-500">
                        {item.category}
                      </div>
                      <div
                        className={`text-sm font-semibold mt-0.5 ${
                          item.packed
                            ? 'line-through text-slate-500'
                            : 'text-slate-900'
                        }`}
                      >
                        {item.name}
                      </div>
                      <div className="text-xs text-slate-500 mt-1">
                        {item.reason}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-4 bg-slate-50 border border-slate-200 rounded-2xl p-6 h-fit space-y-4">
              <h3 className="text-base font-bold text-slate-900">
                Add Custom Packing Item
              </h3>
              <div>
                <label
                  htmlFor="pack-cat-select"
                  className="block text-xs font-medium text-slate-700 mb-1"
                >
                  Gear Category
                </label>
                <select
                  id="pack-cat-select"
                  value={newPackCat}
                  onChange={(e) =>
                    setNewPackCat(e.target.value as PackingItem['category'])
                  }
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg"
                >
                  <option value="Clothing & Layers">Clothing & Layers</option>
                  <option value="Footwear">Footwear</option>
                  <option value="Electronics & SIM">Electronics & SIM</option>
                  <option value="Health & Medicines">Health & Medicines</option>
                  <option value="Documents & Money">Documents & Money</option>
                  <option value="Activity Gear">Activity Gear</option>
                </select>
              </div>
              <div>
                <label
                  htmlFor="pack-name-input"
                  className="block text-xs font-medium text-slate-700 mb-1"
                >
                  Item Name
                </label>
                <input
                  id="pack-name-input"
                  type="text"
                  value={newPackName}
                  onChange={(e) => setNewPackName(e.target.value)}
                  placeholder="e.g., Instant Masala Chai Sachets & Dry Snacks"
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg"
                />
              </div>
              <div>
                <label
                  htmlFor="pack-reason-input"
                  className="block text-xs font-medium text-slate-700 mb-1"
                >
                  Weather / Activity Purpose
                </label>
                <input
                  id="pack-reason-input"
                  type="text"
                  value={newPackReason}
                  onChange={(e) => setNewPackReason(e.target.value)}
                  placeholder="e.g., Late-night hotel snack after long flights"
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg"
                />
              </div>
              <button
                type="button"
                onClick={() => {
                  if (!newPackName.trim()) return;
                  onAddPackingItem(
                    newPackCat,
                    newPackName.trim(),
                    newPackReason.trim() || 'Custom traveler gear'
                  );
                  setNewPackName('');
                  setNewPackReason('');
                }}
                className="w-full py-2.5 px-4 bg-sky-700 hover:bg-sky-600 text-white text-xs font-semibold rounded-xl transition-colors inline-flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add to Packing List</span>
              </button>
            </div>
          </div>
        )}

        {/* TAB 3: SECURE TRAVEL DOCUMENTS VAULT */}
        {activeTab === 'vault' && (
          <div className="space-y-8">
            {/* Security & Privacy Shield Bar */}
            <div className="p-4 rounded-2xl bg-slate-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start sm:items-center gap-3">
                <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5 sm:mt-0" />
                <div className="text-xs">
                  <strong className="text-sm text-white block">
                    Private Local Document Vault — Sensitive Fields Masked by Default
                  </strong>
                  <span className="text-slate-300">
                    Your passport numbers, visa references, and booking codes remain strictly in your local browser session and are never displayed publicly.
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2.5 shrink-0">
                <button
                  type="button"
                  onClick={() => setShowSensitiveNumbers((prev) => !prev)}
                  className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white inline-flex items-center gap-1.5 cursor-pointer"
                >
                  {showSensitiveNumbers ? (
                    <>
                      <EyeOff className="w-3.5 h-3.5 text-amber-400" />
                      <span>Mask Sensitive Numbers</span>
                    </>
                  ) : (
                    <>
                      <Eye className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Reveal Masked Numbers</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={onClearSensitivePassportData}
                  className="px-3.5 py-2 rounded-xl bg-red-950/80 hover:bg-red-900 text-red-200 border border-red-800/60 text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Wipe Personal Data</span>
                </button>
              </div>
            </div>

            {/* 1. Passport Details & 2. Visa Information */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Passport Form (5 Cols) */}
              <div className="lg:col-span-5 bg-slate-50 border border-slate-200 rounded-2xl p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-slate-900">
                    1. Passport Details
                  </h3>
                  <span className="text-xs font-mono text-slate-500 inline-flex items-center gap-1">
                    <Lock className="w-3 h-3" /> Private
                  </span>
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <label
                      htmlFor="vault-passport-holder"
                      className="block font-medium text-slate-700 mb-1"
                    >
                      Passport Holder Full Name (Not Hardcoded)
                    </label>
                    <input
                      id="vault-passport-holder"
                      type="text"
                      value={documentsVault.passport.holderName}
                      onChange={(e) =>
                        onUpdateVault((prev) => ({
                          ...prev,
                          passport: {
                            ...prev.passport,
                            holderName: e.target.value,
                          },
                        }))
                      }
                      placeholder="Enter traveler name locally..."
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="vault-passport-num"
                      className="block font-medium text-slate-700 mb-1"
                    >
                      Passport Number
                    </label>
                    <input
                      id="vault-passport-num"
                      type={showSensitiveNumbers ? 'text' : 'password'}
                      value={documentsVault.passport.passportNumber}
                      onChange={(e) =>
                        onUpdateVault((prev) => ({
                          ...prev,
                          passport: {
                            ...prev.passport,
                            passportNumber: e.target.value,
                          },
                        }))
                      }
                      placeholder="Enter passport number (masked)..."
                      className="w-full px-3 py-2 font-mono bg-white border border-slate-200 rounded-lg"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label
                        htmlFor="vault-passport-issue"
                        className="block font-medium text-slate-700 mb-1"
                      >
                        Issue Date
                      </label>
                      <input
                        id="vault-passport-issue"
                        type="date"
                        value={documentsVault.passport.issueDate}
                        onChange={(e) =>
                          onUpdateVault((prev) => ({
                            ...prev,
                            passport: {
                              ...prev.passport,
                              issueDate: e.target.value,
                            },
                          }))
                        }
                        className="w-full px-3 py-2 font-mono bg-white border border-slate-200 rounded-lg"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="vault-passport-expiry"
                        className="block font-medium text-slate-700 mb-1"
                      >
                        Expiry Date
                      </label>
                      <input
                        id="vault-passport-expiry"
                        type="date"
                        value={documentsVault.passport.expiryDate}
                        onChange={(e) =>
                          onUpdateVault((prev) => ({
                            ...prev,
                            passport: {
                              ...prev.passport,
                              expiryDate: e.target.value,
                            },
                          }))
                        }
                        className="w-full px-3 py-2 font-mono bg-white border border-slate-200 rounded-lg"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Visa Information (7 Cols) */}
              <div className="lg:col-span-7 bg-slate-50 border border-slate-200 rounded-2xl p-6">
                <h3 className="text-base font-bold text-slate-900 mb-4">
                  2. Multi-Country Visa Tracker
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {documentsVault.visas.map((visa) => (
                    <div
                      key={visa.id}
                      className="p-3.5 rounded-xl bg-white border border-slate-200 text-xs space-y-1"
                    >
                      <div className="flex items-center justify-between">
                        <strong className="text-slate-900">{visa.country}</strong>
                        <span
                          className={`font-semibold ${
                            visa.status === 'Approved'
                              ? 'text-emerald-700'
                              : 'text-amber-700'
                          }`}
                        >
                          {visa.status}
                        </span>
                      </div>
                      <div className="text-slate-600">{visa.visaType}</div>
                      <div className="font-mono text-slate-500">
                        Ref: {maskSensitive(visa.referenceNumber, showSensitiveNumbers)}
                      </div>
                      <div className="font-mono text-slate-400">
                        Valid: {visa.validFrom} → {visa.validUntil}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 3. Flight Bookings, 4. Hotel Bookings & 5. Emergency Contacts */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Flight Information */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5">
                <h3 className="text-base font-bold text-slate-900 mb-3">
                  3. Flight & Rail Bookings
                </h3>
                <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1">
                  {documentsVault.flights.map((fl) => (
                    <div
                      key={fl.id}
                      className="p-3 rounded-xl bg-white border border-slate-200 text-xs"
                    >
                      <div className="font-bold text-slate-900">{fl.route}</div>
                      <div className="text-slate-600 mt-0.5">
                        {fl.airline} · <span className="font-mono">{fl.flightNumber}</span>
                      </div>
                      <div className="font-mono text-sky-800 mt-1">
                        PNR: {maskSensitive(fl.pnrCode, showSensitiveNumbers)} · {fl.departureDateTime}
                      </div>
                      <div className="text-slate-400 mt-0.5">{fl.terminalInfo}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Hotel Bookings */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5">
                <h3 className="text-base font-bold text-slate-900 mb-3">
                  4. Hotel Vouchers
                </h3>
                <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1">
                  {documentsVault.hotels.map((ht) => (
                    <div
                      key={ht.id}
                      className="p-3 rounded-xl bg-white border border-slate-200 text-xs"
                    >
                      <div className="text-sky-700 font-semibold">{ht.city}</div>
                      <div className="font-bold text-slate-900 mt-0.5">
                        {ht.hotelName}
                      </div>
                      <div className="font-mono text-slate-600 mt-1">
                        Confirmation: {maskSensitive(ht.confirmationCode, showSensitiveNumbers)}
                      </div>
                      <div className="font-mono text-slate-400 mt-0.5">
                        {ht.checkIn} → {ht.checkOut}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Emergency Contacts */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 flex flex-col justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-900 mb-3">
                    5. Emergency Contacts
                  </h3>
                  <div className="space-y-2.5 mb-4">
                    {documentsVault.emergencyContacts.map((ec) => (
                      <div
                        key={ec.id}
                        className="p-3 rounded-xl bg-white border border-slate-200 text-xs"
                      >
                        <div className="font-bold text-slate-900">{ec.name}</div>
                        <div className="text-slate-500">{ec.relationshipOrRole}</div>
                        <div className="font-mono font-semibold text-emerald-700 mt-1">
                          {ec.phone}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Add Personal Emergency Contact */}
                <div className="pt-3 border-t border-slate-200 space-y-2 text-xs">
                  <div className="font-semibold text-slate-700">
                    Add Family / Embassy Contact
                  </div>
                  <input
                    type="text"
                    value={newContactName}
                    onChange={(e) => setNewContactName(e.target.value)}
                    placeholder="Contact Name"
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={newContactRole}
                      onChange={(e) => setNewContactRole(e.target.value)}
                      placeholder="Relationship"
                      className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg"
                    />
                    <input
                      type="text"
                      value={newContactPhone}
                      onChange={(e) => setNewContactPhone(e.target.value)}
                      placeholder="+91 Phone"
                      className="w-full px-2.5 py-1.5 font-mono bg-white border border-slate-200 rounded-lg"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      if (!newContactName.trim() || !newContactPhone.trim()) return;
                      onUpdateVault((prev) => ({
                        ...prev,
                        emergencyContacts: [
                          ...prev.emergencyContacts,
                          {
                            id: `ec-${Date.now()}`,
                            name: newContactName.trim(),
                            relationshipOrRole:
                              newContactRole.trim() || 'Emergency Contact',
                            phone: newContactPhone.trim(),
                            location: 'India / Global',
                          },
                        ],
                      }));
                      setNewContactName('');
                      setNewContactRole('');
                      setNewContactPhone('');
                    }}
                    className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-lg transition-colors cursor-pointer"
                  >
                    + Save Emergency Contact
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
