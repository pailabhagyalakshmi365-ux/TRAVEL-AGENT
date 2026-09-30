export type CurrencyCode = 'INR' | 'USD' | 'EUR' | 'GBP' | 'JPY' | 'AED' | 'AUD' | 'CAD' | 'SGD';

export type TravelStyle = 'Budget' | 'Standard' | 'Luxury';

export type InterestTag =
  | 'Beaches'
  | 'Mountains'
  | 'Adventure'
  | 'History'
  | 'Shopping'
  | 'Food'
  | 'Nature'
  | 'Nightlife';

export interface RestaurantRecommendation {
  name: string;
  cuisine: string;
  type: 'Vegetarian-Friendly' | 'Pure Vegetarian' | 'Non-Vegetarian & Local';
  neighborhood: string;
  avgMealCostINR: number;
  signatureDish: string;
}

export interface SeasonalWeather {
  season: string;
  months: string;
  tempRange: string;
  condition: string;
  packingAdvice: string;
}

export interface LocalPhrase {
  phrase: string;
  local: string;
  pronunciation: string;
}

export interface DayTemplate {
  title: string;
  morning: string;
  afternoon: string;
  evening: string;
  transport: string;
  travelTime: string;
  interestFocus: InterestTag[];
}

export interface DestinationData {
  id: string;
  city: string;
  country: string;
  continent: 'Asia' | 'Europe' | 'North America' | 'Oceania' | 'Africa';
  airportCode: string;
  lat: number;
  lng: number;
  image: string;
  fallbackGradient: string;
  bestTimeToVisit: string;
  popularAttractions: string[];
  avgDailyBudgetINR: {
    Budget: number;
    Standard: number;
    Luxury: number;
  };
  recommendedDays: number;
  localCurrency: CurrencyCode | string;
  localCurrencyName: string;
  popularFoods: string[];
  vegetarianOptions: string[];
  nonVegetarianOptions: string[];
  popularRestaurants: RestaurantRecommendation[];
  approxDailyFoodCostINR: {
    Budget: number;
    Standard: number;
    Luxury: number;
  };
  weatherSummary: {
    avgTempC: number;
    climateType: string;
    rainyMonths: string;
    seasons: SeasonalWeather[];
  };
  travelTips: {
    customs: string;
    safety: string;
    transportation: string;
    internetSim: string;
    currencyTip: string;
    visaInfoForIndians: string;
  };
  localPhrases: LocalPhrase[];
  hotelsByStyle: {
    Budget: { name: string; area: string; nightlyRateINR: number };
    Standard: { name: string; area: string; nightlyRateINR: number };
    Luxury: { name: string; area: string; nightlyRateINR: number };
  };
  dayTemplates: DayTemplate[];
}

export interface ItineraryDay {
  dayNumber: number;
  date: string;
  cityId: string;
  city: string;
  country: string;
  morningActivity: string;
  afternoonActivity: string;
  eveningActivity: string;
  recommendedRestaurants: string[];
  estimatedDailyCostINR: number;
  travelTime: string;
  transportationMethod: string;
  hotelSuggestion: string;
  isTransitDay?: boolean;
  transitLegLabel?: string;
}

export interface BudgetBreakdown {
  internationalFlights: number;
  domesticFlights: number;
  hotels: number;
  food: number;
  localTransportation: number;
  attractions: number;
  shopping: number;
  visaCosts: number;
  travelInsurance: number;
  emergencyExpenses: number;
}

export type ChecklistCategory =
  | 'Passport'
  | 'Visa'
  | 'Flight tickets'
  | 'Hotel bookings'
  | 'Travel insurance'
  | 'Currency'
  | 'SIM/eSIM'
  | 'Medicines'
  | 'Clothes'
  | 'Important documents';

export interface ChecklistItem {
  id: string;
  category: ChecklistCategory;
  title: string;
  detail: string;
  completed: boolean;
}

export interface PackingItem {
  id: string;
  category: 'Clothing & Layers' | 'Footwear' | 'Electronics & SIM' | 'Health & Medicines' | 'Documents & Money' | 'Activity Gear';
  name: string;
  reason: string;
  packed: boolean;
}

export interface PassportDoc {
  holderName: string;
  passportNumber: string;
  issuingCountry: string;
  issueDate: string;
  expiryDate: string;
  notes: string;
}

export interface VisaDoc {
  id: string;
  country: string;
  visaType: string;
  referenceNumber: string;
  validFrom: string;
  validUntil: string;
  status: 'Approved' | 'Pending' | 'Application Prepared';
}

export interface FlightDoc {
  id: string;
  route: string;
  airline: string;
  flightNumber: string;
  pnrCode: string;
  departureDateTime: string;
  terminalInfo: string;
}

export interface HotelDoc {
  id: string;
  city: string;
  hotelName: string;
  confirmationCode: string;
  checkIn: string;
  checkOut: string;
}

export interface EmergencyContactDoc {
  id: string;
  name: string;
  relationshipOrRole: string;
  phone: string;
  location: string;
}

export interface TravelDocumentsVault {
  passport: PassportDoc;
  visas: VisaDoc[];
  flights: FlightDoc[];
  hotels: HotelDoc[];
  emergencyContacts: EmergencyContactDoc[];
}

export interface StartingCity {
  id: string;
  city: string;
  country: string;
  airportCode: string;
  lat: number;
  lng: number;
}

export interface WorldTripPlan {
  id: string;
  name: string;
  startingLocation: StartingCity;
  selectedCityIds: string[];
  cityDays: Record<string, number>;
  startDate: string;
  endDate: string;
  travelers: number;
  travelStyle: TravelStyle;
  interests: InterestTag[];
  targetBudgetINR: number;
  currency: CurrencyCode;
  itinerary: ItineraryDay[];
  customBudgetOverrides: Partial<BudgetBreakdown>;
  checklist: ChecklistItem[];
  packingList: PackingItem[];
  updatedAt: string;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}
