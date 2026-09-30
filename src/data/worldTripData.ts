import {
  BudgetBreakdown,
  ChecklistItem,
  CurrencyCode,
  DestinationData,
  InterestTag,
  ItineraryDay,
  PackingItem,
  StartingCity,
  TravelDocumentsVault,
  TravelStyle,
  WorldTripPlan,
} from '../types/travel';

export const HERO_IMAGE_PATH = '/src/assets/images/hero_world_travel_1790744870087.jpg';

export const CURRENCY_META: Record<
  CurrencyCode,
  { code: CurrencyCode; symbol: string; name: string; rateFromINR: number }
> = {
  INR: { code: 'INR', symbol: '₹', name: 'Indian Rupee', rateFromINR: 1 },
  USD: { code: 'USD', symbol: '$', name: 'US Dollar', rateFromINR: 0.0119 },
  EUR: { code: 'EUR', symbol: '€', name: 'Euro', rateFromINR: 0.0109 },
  GBP: { code: 'GBP', symbol: '£', name: 'British Pound', rateFromINR: 0.0093 },
  JPY: { code: 'JPY', symbol: '¥', name: 'Japanese Yen', rateFromINR: 1.78 },
  AED: { code: 'AED', symbol: 'AED ', name: 'UAE Dirham', rateFromINR: 0.0437 },
  AUD: { code: 'AUD', symbol: 'A$', name: 'Australian Dollar', rateFromINR: 0.0181 },
  CAD: { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar', rateFromINR: 0.0164 },
  SGD: { code: 'SGD', symbol: 'S$', name: 'Singapore Dollar', rateFromINR: 0.0159 },
};

export function convertFromINR(
  amountINR: number,
  targetCurrency: CurrencyCode,
  customRates?: Partial<Record<CurrencyCode, number>>
): number {
  const rate = customRates?.[targetCurrency] ?? CURRENCY_META[targetCurrency].rateFromINR;
  return amountINR * rate;
}

export function formatCurrency(
  amountINR: number,
  currency: CurrencyCode,
  customRates?: Partial<Record<CurrencyCode, number>>
): string {
  const converted = convertFromINR(amountINR, currency, customRates);
  const meta = CURRENCY_META[currency];
  if (currency === 'INR') {
    return `₹${Math.round(converted).toLocaleString('en-IN')}`;
  }
  if (currency === 'JPY') {
    return `¥${Math.round(converted).toLocaleString('en-US')}`;
  }
  return `${meta.symbol}${Math.round(converted).toLocaleString('en-US')}`;
}

export const INDIAN_STARTING_CITIES: StartingCity[] = [
  {
    id: 'hyderabad',
    city: 'Hyderabad',
    country: 'India',
    airportCode: 'HYD',
    lat: 17.385,
    lng: 78.4867,
  },
  {
    id: 'mumbai',
    city: 'Mumbai',
    country: 'India',
    airportCode: 'BOM',
    lat: 19.076,
    lng: 72.8777,
  },
  {
    id: 'delhi',
    city: 'New Delhi',
    country: 'India',
    airportCode: 'DEL',
    lat: 28.6139,
    lng: 77.209,
  },
  {
    id: 'bengaluru',
    city: 'Bengaluru',
    country: 'India',
    airportCode: 'BLR',
    lat: 12.9716,
    lng: 77.5946,
  },
  {
    id: 'chennai',
    city: 'Chennai',
    country: 'India',
    airportCode: 'MAA',
    lat: 13.0827,
    lng: 80.2707,
  },
  {
    id: 'kolkata',
    city: 'Kolkata',
    country: 'India',
    airportCode: 'CCU',
    lat: 22.5726,
    lng: 88.3639,
  },
];

export const DESTINATIONS: DestinationData[] = [
  {
    id: 'dubai',
    city: 'Dubai',
    country: 'United Arab Emirates',
    continent: 'Asia',
    airportCode: 'DXB',
    lat: 25.2048,
    lng: 55.2708,
    image: '/src/assets/images/dest_dubai_skyline_1790744886583.jpg',
    fallbackGradient: 'from-amber-700 via-orange-600 to-sky-900',
    bestTimeToVisit: 'November to March',
    popularAttractions: [
      'Burj Khalifa At The Top (Level 124 & 148)',
      'Dubai Marina Yacht Promenade',
      'Museum of the Future',
      'Al Fahidi Historical Neighbourhood & Creek Abra',
      'Arabian Desert Dune Safari & Stargazing',
    ],
    avgDailyBudgetINR: {
      Budget: 9500,
      Standard: 18500,
      Luxury: 46000,
    },
    recommendedDays: 3,
    localCurrency: 'AED',
    localCurrencyName: 'UAE Dirham (AED)',
    popularFoods: ['Al Harees', 'Shawarma & Mezze Platter', 'Kunafa with Pistachio', 'Camel Milk Gelato', 'Luqaimat'],
    vegetarianOptions: [
      'Lebanese Hummus, Mutabbal & Crispy Falafel wraps in Al Karama',
      'Rajasthani & South Indian Thalis at Meena Bazaar & Bur Dubai',
      'Zaatar Manakish flatbreads & Fattoush salad',
    ],
    nonVegetarianOptions: [
      'Charcoal-grilled Lamb Mandi & Chicken Machboos',
      'Emirati Seafood Grill along Jumeirah Fishing Harbour',
      'Classic Iranian Mixed Kebab Platter at Al Ustad Special Kabab',
    ],
    popularRestaurants: [
      {
        name: 'Arabian Tea House',
        cuisine: 'Emirati & Middle Eastern',
        type: 'Vegetarian-Friendly',
        neighborhood: 'Al Fahidi Historical District',
        avgMealCostINR: 2400,
        signatureDish: 'Emirati Breakfast Tray & Date Cake',
      },
      {
        name: 'Maharaja Bhog',
        cuisine: 'Indian Royal Vegetarian',
        type: 'Pure Vegetarian',
        neighborhood: 'Al Karama',
        avgMealCostINR: 1500,
        signatureDish: 'Unlimited Traditional Thali',
      },
      {
        name: 'Pierchic',
        cuisine: 'Mediterranean Seafood',
        type: 'Non-Vegetarian & Local',
        neighborhood: 'Jumeirah Al Qasr',
        avgMealCostINR: 9500,
        signatureDish: 'Grilled Gulf Hammour & Saffron Risotto',
      },
    ],
    approxDailyFoodCostINR: {
      Budget: 2200,
      Standard: 4800,
      Luxury: 12500,
    },
    weatherSummary: {
      avgTempC: 27,
      climateType: 'Subtropical Arid Coastal',
      rainyMonths: 'Rare brief showers in January–February',
      seasons: [
        {
          season: 'Winter Peak',
          months: 'Nov – Mar',
          tempRange: '18°C – 28°C',
          condition: 'Sunny, pleasant coastal breezes',
          packingAdvice: 'Breathable cottons and a light evening jacket for desert dunes.',
        },
        {
          season: 'Shoulder',
          months: 'Apr & Oct',
          tempRange: '24°C – 35°C',
          condition: 'Warm and dry with clear skies',
          packingAdvice: 'UV sunglasses, linen shirts, and reef-safe sunscreen.',
        },
        {
          season: 'Summer',
          months: 'May – Sep',
          tempRange: '31°C – 43°C',
          condition: 'Hot daytime sun; indoor attractions fully air-conditioned',
          packingAdvice: 'Light shawl for strong indoor AC and hydration bottle.',
        },
      ],
    },
    travelTips: {
      customs: 'Dress modestly at heritage mosques and old souks. Public displays of affection are discouraged.',
      safety: 'One of the safest cities globally. Emergency police number is 999; ambulance is 998.',
      transportation: 'Buy a Silver Nol Card at DXB Airport for seamless Red & Green Line Metro, tram, and water bus rides.',
      internetSim: 'Complimentary 1GB tourist SIM handed at Dubai Immigration; eSIM top-ups available via Du or Etisalat.',
      currencyTip: '1 AED is pegged at ~0.27 USD (~₹22.8). Cards and Apple/Google Pay are accepted everywhere except small Creek abras (carry AED 5 coins).',
      visaInfoForIndians: '30-day pre-arranged UAE Tourist eVisa (or 14-day Visa on Arrival if holding a valid US/UK/Schengen visa).',
    },
    localPhrases: [
      { phrase: 'Hello / Peace be upon you', local: 'As-salamu alaykum', pronunciation: 'As-sa-laa-mu a-lay-kum' },
      { phrase: 'Thank you', local: 'Shukran', pronunciation: 'Shuk-ran' },
      { phrase: 'How much is this?', local: 'Bikam hadha?', pronunciation: 'Bi-kam haa-dhaa' },
    ],
    hotelsByStyle: {
      Budget: { name: 'Rove Downtown Dubai', area: 'Downtown / Burj Views', nightlyRateINR: 6200 },
      Standard: { name: 'Taj Dubai Business Bay', area: 'Business Bay', nightlyRateINR: 12800 },
      Luxury: { name: 'Address Downtown Waterfront', area: 'Downtown Boulevard', nightlyRateINR: 34000 },
    },
    dayTemplates: [
      {
        title: 'Old Dubai Creek & Sky-High Icons',
        morning: 'Walk Al Fahidi Historical Neighbourhood, cross Dubai Creek on a 1-AED wooden Abra boat, and browse the Gold & Spice Souks.',
        afternoon: 'Visit the Museum of the Future and explore Dubai Mall Aquarium & Underwater Zoo.',
        evening: 'Sunset ascent to Burj Khalifa Level 124/125 followed by the Dubai Fountain waterfront show.',
        transport: 'Dubai Metro Red Line + Traditional Abra Boat',
        travelTime: '3h 45m flight from Hyderabad (HYD → DXB)',
        interestFocus: ['History', 'Shopping', 'Nightlife'],
      },
      {
        title: 'Arabian Desert Dunes & Marina Skyline',
        morning: 'Relax at Jumeirah Beach and walk the Palm Jumeirah Boardwalk overlooking Atlantis.',
        afternoon: '4x4 Lahbab Red Dune Desert Safari with sandboarding and camel caravan trail.',
        evening: 'Bedouin desert camp dinner under the stars or dhow cruise along Dubai Marina.',
        transport: 'Dubai Tram + 4x4 Desert Land Cruiser',
        travelTime: '45m drive to Lahbab Dunes',
        interestFocus: ['Adventure', 'Beaches', 'Food'],
      },
      {
        title: 'Miracle Garden & Global Village Culture',
        morning: 'Stroll through floral installations at Dubai Miracle Garden and Butterfly Sanctuary.',
        afternoon: 'Art galleries at Alserkal Avenue and specialty coffee tasting.',
        evening: 'Explore international pavilions and street food markets at Global Village.',
        transport: 'RTA Express Bus + Metro',
        travelTime: '30m local transit',
        interestFocus: ['Nature', 'Food', 'Shopping'],
      },
    ],
  },
  {
    id: 'paris',
    city: 'Paris',
    country: 'France',
    continent: 'Europe',
    airportCode: 'CDG',
    lat: 48.8566,
    lng: 2.3522,
    image: '/src/assets/images/dest_paris_eiffel_1790744900393.jpg',
    fallbackGradient: 'from-sky-800 via-indigo-800 to-amber-700',
    bestTimeToVisit: 'April to June & September to October',
    popularAttractions: [
      'Eiffel Tower & Trocadéro Gardens',
      'Louvre Museum & Tuileries Courtyard',
      'Montmartre & Sacré-Cœur Basilica',
      'Musée d’Orsay Impressionist Gallery',
      'Seine River Sunset Bateaux Cruise',
    ],
    avgDailyBudgetINR: {
      Budget: 12000,
      Standard: 23500,
      Luxury: 56000,
    },
    recommendedDays: 4,
    localCurrency: 'EUR',
    localCurrencyName: 'Euro (€)',
    popularFoods: ['Artisanal Croissant & Pain au Chocolat', 'Soupe à l’Oignon', 'Crêpes Suzette', 'Macarons', 'Ratatouille Provençale'],
    vegetarianOptions: [
      'Buckwheat Savoury Galettes with Gruyère, Mushrooms & Spinach in Montparnasse',
      'Warm Ratatouille, Goat Cheese Tartine & Truffle Pasta at Le Marais bistros',
      'Indian & Vegetarian brasseries around Passage Brady and Gare du Nord',
    ],
    nonVegetarianOptions: [
      'Duck Confit (Confit de Canard) with Sarladaise potatoes',
      'Classic Boeuf Bourguignon slow-braised in Burgundy wine',
      'Fresh Brittany Oysters & Moules Marinières',
    ],
    popularRestaurants: [
      {
        name: 'Breizh Café Le Marais',
        cuisine: 'Brittany Artisanal Crêperie',
        type: 'Vegetarian-Friendly',
        neighborhood: 'Le Marais (3rd Arr.)',
        avgMealCostINR: 2800,
        signatureDish: 'Organic Buckwheat Galette with Comté & Forest Mushrooms',
      },
      {
        name: 'Saravanaa Bhavan Paris',
        cuisine: 'South Indian Vegetarian',
        type: 'Pure Vegetarian',
        neighborhood: '10th Arr. (Rue du Faubourg)',
        avgMealCostINR: 1600,
        signatureDish: 'Ghee Roast Dosa & Filter Coffee',
      },
      {
        name: 'Bouillon Chartier',
        cuisine: 'Historic 1896 French Brasserie',
        type: 'Non-Vegetarian & Local',
        neighborhood: 'Grands Boulevards (9th Arr.)',
        avgMealCostINR: 3100,
        signatureDish: 'Roast Free-Range Poultry & Crème Caramel',
      },
    ],
    approxDailyFoodCostINR: {
      Budget: 2900,
      Standard: 6200,
      Luxury: 16000,
    },
    weatherSummary: {
      avgTempC: 16,
      climateType: 'Temperate Oceanic',
      rainyMonths: 'Light passing showers possible year-round',
      seasons: [
        {
          season: 'Spring',
          months: 'Mar – May',
          tempRange: '9°C – 20°C',
          condition: 'Crisp mornings, blooming chestnut trees along the Seine',
          packingAdvice: 'Trench coat, light knitwear, and comfortable walking sneakers.',
        },
        {
          season: 'Summer',
          months: 'Jun – Aug',
          tempRange: '16°C – 27°C',
          condition: 'Long daylight until 10 PM; outdoor café terraces',
          packingAdvice: 'Breathable linen, sunglasses, and compact umbrella.',
        },
        {
          season: 'Autumn / Winter',
          months: 'Sep – Feb',
          tempRange: '3°C – 17°C',
          condition: 'Golden foliage in October; festive lights in winter',
          packingAdvice: 'Warm wool overcoat, scarf, and thermal base layer.',
        },
      ],
    },
    travelTips: {
      customs: 'Always greet shopkeepers with "Bonjour" when entering and "Merci, au revoir" when leaving.',
      safety: 'Keep bags zipped on Metro Lines 1 and 4 and near Trocadéro. European emergency number is 112.',
      transportation: 'Use the Île-de-France Mobilités app or a Navigo Easy card for Metro and RER trains.',
      internetSim: 'Orange Holiday Europe eSIM covers France and roaming across Europe.',
      currencyTip: 'Service charge ("service compris") is included by law on restaurant bills; rounding up €1–€2 is appreciated.',
      visaInfoForIndians: 'Schengen Short-Stay Visa (Type C) applied via VFS Global in Hyderabad prior to departure.',
    },
    localPhrases: [
      { phrase: 'Good morning / Hello', local: 'Bonjour', pronunciation: 'Bon-zhoor' },
      { phrase: 'Please / Excuse me', local: 'S’il vous plaît / Pardon', pronunciation: 'Seel voo pleh' },
      { phrase: 'Can I have tap water?', local: 'Une carafe d’eau, s’il vous plaît', pronunciation: 'Oon ka-raf doh' },
    ],
    hotelsByStyle: {
      Budget: { name: 'Generator Paris Design Hostel & Rooms', area: 'Canal Saint-Martin (10th Arr.)', nightlyRateINR: 8400 },
      Standard: { name: 'Hôtel Citadines Tour Eiffel Paris', area: '15th Arr. / Left Bank', nightlyRateINR: 16900 },
      Luxury: { name: 'Le Meurice Dorchester Collection', area: 'Rue de Rivoli / Tuileries', nightlyRateINR: 49000 },
    },
    dayTemplates: [
      {
        title: 'Eiffel Tower, Seine Banks & Arc de Triomphe',
        morning: 'Sunrise photos at Place du Trocadéro followed by elevator ascent to the Eiffel Tower summit.',
        afternoon: 'Stroll Champ de Mars, Pont Alexandre III, and Champs-Élysées up to Arc de Triomphe.',
        evening: 'Illuminated Bateaux Parisiens cruise along the Seine River at golden hour.',
        transport: 'RER B from CDG + Paris Metro Line 6',
        travelTime: '7h 10m flight from Dubai (DXB → CDG)',
        interestFocus: ['History', 'Food', 'Nightlife'],
      },
      {
        title: 'Louvre Masterpieces & Le Marais Quarters',
        morning: 'Timed-entry morning tour of the Louvre Museum (Mona Lisa, Winged Victory, Napoleon Apartments).',
        afternoon: 'Walk through Jardin des Tuileries, Palais Royal columns, and historic Le Marais boutiques.',
        evening: 'Artisanal crêpe & cider dinner around Place des Vosges.',
        transport: 'Paris Metro Line 1 + Walking',
        travelTime: '20m local Metro ride',
        interestFocus: ['History', 'Shopping', 'Food'],
      },
      {
        title: 'Montmartre Hilltop & Musée d’Orsay',
        morning: 'Explore Musée d’Orsay housed in a Beaux-Arts railway station (Van Gogh & Monet collections).',
        afternoon: 'Ride the funicular up to Sacré-Cœur Basilica and Place du Tertre artists square in Montmartre.',
        evening: 'Evening jazz and patisserie tasting in Saint-Germain-des-Prés.',
        transport: 'Metro Line 12 + Montmartre Funicular',
        travelTime: '25m local Metro ride',
        interestFocus: ['History', 'Nature', 'Nightlife'],
      },
      {
        title: 'Palace of Versailles Hall of Mirrors',
        morning: 'Half-day excursion to Château de Versailles: Hall of Mirrors and Royal State Apartments.',
        afternoon: 'Cycle or stroll beside the Grand Canal and Marie Antoinette’s Estate gardens.',
        evening: 'Farewell rooftop dinner overlooking Garnier Opera House.',
        transport: 'RER C Train to Versailles Château Rive Gauche',
        travelTime: '45m RER rail journey',
        interestFocus: ['History', 'Nature', 'Shopping'],
      },
    ],
  },
  {
    id: 'london',
    city: 'London',
    country: 'United Kingdom',
    continent: 'Europe',
    airportCode: 'LHR',
    lat: 51.5072,
    lng: -0.1276,
    image: '/src/assets/images/dest_london_thames_1790744921507.jpg',
    fallbackGradient: 'from-slate-800 via-sky-900 to-emerald-900',
    bestTimeToVisit: 'May to September',
    popularAttractions: [
      'Tower of London & Tower Bridge Glass Walkway',
      'Westminster Abbey, Big Ben & Houses of Parliament',
      'British Museum & Covent Garden Piazza',
      'London Eye & South Bank Cultural Walk',
      'Hyde Park, Kensington Palace & Greenwich Royal Observatory',
    ],
    avgDailyBudgetINR: {
      Budget: 13000,
      Standard: 25000,
      Luxury: 59000,
    },
    recommendedDays: 3,
    localCurrency: 'GBP',
    localCurrencyName: 'British Pound Sterling (£)',
    popularFoods: ['Afternoon Tea with Scones & Clotted Cream', 'Borough Market Artisan Pies', 'Fish and Chips', 'Brick Lane Curry', 'Sticky Toffee Pudding'],
    vegetarianOptions: [
      'Dishoom’s House Black Daal, Jackfruit Biryani & Chilli Cheese Toast in Covent Garden',
      'Borough Market Gourmet Grilled Cheese, Ethiopian Vegan Platters & Mushroom Risotto',
      'Traditional English Afternoon Tea with vegetarian finger sandwiches and warm scones',
    ],
    nonVegetarianOptions: [
      'Classic Beer-Battered Atlantic Cod & Hand-Cut Chips in Soho',
      'Sunday Roast with Yorkshire Pudding and pan gravy at a historic Thames tavern',
      'Salt Beef Bagel at Brick Lane Beigel Bake',
    ],
    popularRestaurants: [
      {
        name: 'Dishoom Covent Garden',
        cuisine: 'Bombay Irani Café & British-Indian',
        type: 'Vegetarian-Friendly',
        neighborhood: 'Covent Garden',
        avgMealCostINR: 3400,
        signatureDish: '24-Hour House Black Daal & Pau Bhaji',
      },
      {
        name: 'Mildreds Soho',
        cuisine: 'Modern Plant-Based International',
        type: 'Pure Vegetarian',
        neighborhood: 'Soho (Lexington St)',
        avgMealCostINR: 3100,
        signatureDish: 'Katsu Curry & Truffle Arancini',
      },
      {
        name: 'Borough Market Traders Hall',
        cuisine: 'Artisan British & Global Street Food',
        type: 'Non-Vegetarian & Local',
        neighborhood: 'London Bridge / Southwark',
        avgMealCostINR: 2100,
        signatureDish: 'Cumbrian Artisan Pies & Strawberries with Cream',
      },
    ],
    approxDailyFoodCostINR: {
      Budget: 3100,
      Standard: 6800,
      Luxury: 17500,
    },
    weatherSummary: {
      avgTempC: 15,
      climateType: 'Temperate Maritime',
      rainyMonths: 'Brief light drizzle possible any month',
      seasons: [
        {
          season: 'Spring / Summer',
          months: 'May – Aug',
          tempRange: '12°C – 24°C',
          condition: 'Lush royal parks and long sunny evenings',
          packingAdvice: 'Light waterproof jacket, layered shirts, and walking shoes.',
        },
        {
          season: 'Autumn',
          months: 'Sep – Nov',
          tempRange: '8°C – 18°C',
          condition: 'Crisp air and amber leaves in Hyde Park',
          packingAdvice: 'Sweater, trench coat, and compact windproof umbrella.',
        },
        {
          season: 'Winter',
          months: 'Dec –Feb',
          tempRange: '2°C – 9°C',
          condition: 'Chilly with festive West End illuminations',
          packingAdvice: 'Insulated coat, gloves, and warm knitwear.',
        },
      ],
    },
    travelTips: {
      customs: 'Stand on the right on Tube escalators so commuters can walk on the left. Queueing politely is sacred.',
      safety: 'Look right first before crossing streets (vehicles drive on the left, same as India). Emergency number is 999.',
      transportation: 'Tap any contactless Visa/Mastercard or phone directly on London Underground and red double-decker buses (automatic daily fare cap applies).',
      internetSim: 'Giffgaff or Voxi UK eSIM works seamlessly across London and the Underground Wi-Fi.',
      currencyTip: 'London is nearly 100% cashless; even street performers and market stalls take contactless tap.',
      visaInfoForIndians: 'UK Standard Visitor Visa (applied separate from Schengen via VFS Global in India).',
    },
    localPhrases: [
      { phrase: 'Thank you / Goodbye', local: 'Cheers', pronunciation: 'Cheers' },
      { phrase: 'London Subway', local: 'The Tube / Underground', pronunciation: 'The Tube' },
      { phrase: 'Restroom', local: 'The Loo', pronunciation: 'The Loo' },
    ],
    hotelsByStyle: {
      Budget: { name: 'Point A Hotel London Westminster', area: 'Waterloo / Westminster', nightlyRateINR: 9200 },
      Standard: { name: 'citizenM Tower of London', area: 'Tower Hill', nightlyRateINR: 18500 },
      Luxury: { name: 'The Savoy London', area: 'Strand / River Thames', nightlyRateINR: 54000 },
    },
    dayTemplates: [
      {
        title: 'Eurostar Arrival, Westminster & South Bank',
        morning: 'Arrive at London St Pancras via high-speed Eurostar train under the English Channel; walk past Big Ben, Parliament, and Westminster Abbey.',
        afternoon: 'Board the London Eye observation wheel and stroll the South Bank past Shakespeare’s Globe and Tate Modern.',
        evening: 'West End theatre musical or street performances at Covent Garden Piazza.',
        transport: 'Eurostar High-Speed Rail + London Underground',
        travelTime: '2h 16m Eurostar train from Paris (Gare du Nord → St Pancras)',
        interestFocus: ['History', 'Nightlife', 'Nature'],
      },
      {
        title: 'Tower of London, Borough Market & Sky Garden',
        morning: 'Inspect the Crown Jewels at the Tower of London and cross the iconic Tower Bridge.',
        afternoon: 'Artisanal lunch at Borough Market followed by panoramic city views from Sky Garden.',
        evening: 'Uber Boat by Thames Clippers cruise from London Bridge to Greenwich or Canary Wharf.',
        transport: 'Thames Clippers River Bus + Tube Circle Line',
        travelTime: '20m river transit',
        interestFocus: ['History', 'Food', 'Shopping'],
      },
      {
        title: 'British Museum, Royal Parks & Kensington',
        morning: 'Morning stroll through Hyde Park and Buckingham Palace Mall, followed by the British Museum.',
        afternoon: 'Explore Notting Hill Portobello Road or Harrods & Victoria and Albert Museum in Knightsbridge.',
        evening: 'Classic British Afternoon Tea or dinner in Soho.',
        transport: 'Iconic Red Route 11 Double-Decker Bus + Piccadilly Line',
        travelTime: '25m local bus ride',
        interestFocus: ['History', 'Shopping', 'Food'],
      },
    ],
  },
  {
    id: 'newyork',
    city: 'New York',
    country: 'United States',
    continent: 'North America',
    airportCode: 'JFK',
    lat: 40.7128,
    lng: -74.006,
    image: '/src/assets/images/dest_newyork_manhattan_1790744935242.jpg',
    fallbackGradient: 'from-blue-950 via-slate-800 to-orange-700',
    bestTimeToVisit: 'April to June & September to November',
    popularAttractions: [
      'Statue of Liberty & Ellis Island Ferry',
      'Central Park, Bethesda Terrace & The Met',
      'Brooklyn Bridge & DUMBO Waterfront',
      'Top of the Rock / Summit One Vanderbilt',
      'Times Square, Broadway & The High Line',
    ],
    avgDailyBudgetINR: {
      Budget: 14500,
      Standard: 28000,
      Luxury: 65000,
    },
    recommendedDays: 4,
    localCurrency: 'USD',
    localCurrencyName: 'US Dollar ($)',
    popularFoods: ['New York Thin-Crust Pizza Slice', 'Hand-Rolled Bagel with Lox or Cream Cheese', 'New York Cheesecake', 'Pastrami on Rye', 'Halal Cart Platters'],
    vegetarianOptions: [
      'Joe’s Pizza Margherita Slice in Greenwich Village & Scarr’s Cheese Slices',
      'Ess-a-Bagel toasted Everything Bagel with scallion or vegetable cream cheese',
      'Saravanaa Bhavan / Dhamaka / Semma on Lexington Ave ("Curry Hill") & NY Dosas cart in Washington Square Park',
    ],
    nonVegetarianOptions: [
      'Katz’s Delicatessen Hand-Carved Pastrami Sandwich on Lower East Side',
      'Classic Shake Shack Smashburger at Madison Square Park',
      'Chelsea Market Maine Lobster Roll',
    ],
    popularRestaurants: [
      {
        name: 'Joe’s Pizza Carmine St',
        cuisine: 'Iconic Greenwich Village Pizzeria',
        type: 'Vegetarian-Friendly',
        neighborhood: 'Greenwich Village',
        avgMealCostINR: 1400,
        signatureDish: 'Fresh Mozzarella & San Marzano Tomato Slice',
      },
      {
        name: 'NY Dosas (Thiru’s Cart) & Spicy Moon',
        cuisine: 'South Indian Vegan & Szechuan Vegetarian',
        type: 'Pure Vegetarian',
        neighborhood: 'Washington Square Park / East Village',
        avgMealCostINR: 1800,
        signatureDish: 'Pondicherry Masala Dosa & Dan Dan Noodles',
      },
      {
        name: 'Katz’s Delicatessen',
        cuisine: '1888 New York Jewish Deli',
        type: 'Non-Vegetarian & Local',
        neighborhood: 'Lower East Side',
        avgMealCostINR: 2900,
        signatureDish: 'Pastrami on Rye with Matzo Ball Soup',
      },
    ],
    approxDailyFoodCostINR: {
      Budget: 3500,
      Standard: 7500,
      Luxury: 19000,
    },
    weatherSummary: {
      avgTempC: 17,
      climateType: 'Humid Subtropical / Continental',
      rainyMonths: 'Evenly distributed brief rain showers',
      seasons: [
        {
          season: 'Spring',
          months: 'Apr – Jun',
          tempRange: '11°C – 25°C',
          condition: 'Cherry blossoms in Central Park and Brooklyn Botanic Garden',
          packingAdvice: 'Denim jacket, breathable tees, and cushioned walking shoes (15,000+ steps/day).',
        },
        {
          season: 'Autumn',
          months: 'Sep – Nov',
          tempRange: '9°C – 23°C',
          condition: 'Crisp blue skies and brilliant foliage in Central Park',
          packingAdvice: 'Light sweater, windbreaker, and comfortable sneakers.',
        },
        {
          season: 'Winter',
          months: 'Dec – Mar',
          tempRange: '-2°C – 7°C',
          condition: 'Brisk winter air with Rockefeller ice skating',
          packingAdvice: 'Heavy down parka, beanie, and thermal gloves.',
        },
      ],
    },
    travelTips: {
      customs: 'Walk briskly on sidewalks and step to the side if stopping for photos. Tipping 18%–20% at sit-down restaurants is standard.',
      safety: 'Subways run 24/7; ride in the middle cars with the conductor late at night. Emergency number is 911.',
      transportation: 'Use OMNY contactless tap-to-pay on all NYC Subway turnstiles and buses ($34 weekly fare cap).',
      internetSim: 'T-Mobile or Mint Mobile eSIM activates instantly upon landing at JFK.',
      currencyTip: 'Menu and store prices exclude ~8.875% NYC sales tax, which is added at checkout.',
      visaInfoForIndians: 'US B1/B2 Tourist Visa (10-year multiple entry typical for Indian passport holders).',
    },
    localPhrases: [
      { phrase: 'Coffee with milk and sugar', local: 'Regular coffee', pronunciation: 'Reg-yu-lar caw-fee' },
      { phrase: 'Subway heading towards Bronx/Queens', local: 'Uptown train', pronunciation: 'Up-town train' },
      { phrase: 'Corner grocery & deli', local: 'Bodega', pronunciation: 'Bo-day-ga' },
    ],
    hotelsByStyle: {
      Budget: { name: 'Pod 51 Hotel Midtown', area: 'Midtown East (51st St)', nightlyRateINR: 11200 },
      Standard: { name: 'Arlo Midtown Manhattan', area: 'Midtown West / Hudson Yards', nightlyRateINR: 21500 },
      Luxury: { name: 'The Plaza New York at Central Park', area: 'Fifth Avenue / Central Park South', nightlyRateINR: 62000 },
    },
    dayTemplates: [
      {
        title: 'Midtown Icons, Central Park & Top of the Rock',
        morning: 'Walk Fifth Avenue from New York Public Library & Grand Central Terminal up to Central Park’s Bethesda Terrace and Bow Bridge.',
        afternoon: 'Explore The Metropolitan Museum of Art or MoMA.',
        evening: 'Sunset skyline view from Top of the Rock (or Summit One Vanderbilt) followed by Times Square & Broadway.',
        transport: 'AirTrain JFK + E Subway Line',
        travelTime: '7h 55m transatlantic flight from London (LHR → JFK)',
        interestFocus: ['Nature', 'History', 'Nightlife'],
      },
      {
        title: 'Statue of Liberty, Wall Street & Brooklyn Bridge',
        morning: 'Morning ferry from Battery Park to Liberty Island and Ellis Island Immigration Museum.',
        afternoon: 'Walk Wall Street, Charging Bull, 9/11 Memorial Pools, and Oculus.',
        evening: 'Golden hour walk across the Brooklyn Bridge into DUMBO for Manhattan skyline views and brick-oven pizza.',
        transport: 'Statue City Cruises Ferry + Subway Line 4/5',
        travelTime: '25m subway & ferry transit',
        interestFocus: ['History', 'Food', 'Adventure'],
      },
      {
        title: 'The High Line, Chelsea Market & Greenwich Village',
        morning: 'Walk the elevated High Line park from Hudson Yards to Little Island over the Hudson River.',
        afternoon: 'Tasting tour inside Chelsea Market followed by tree-lined brownstone streets of Greenwich Village and Washington Square Park.',
        evening: 'Live jazz club evening at Village Vanguard or Blue Note.',
        transport: 'Subway Line A/C/E + Walking',
        travelTime: '20m subway ride',
        interestFocus: ['Nature', 'Food', 'Nightlife'],
      },
      {
        title: 'SoHo Cast-Iron Architecture & Roosevelt Island Tram',
        morning: 'Ride the aerial Roosevelt Island Tramway across the East River for cinematic views.',
        afternoon: 'Explore SoHo cast-iron galleries, Chinatown dim sum, and Little Italy.',
        evening: 'Sunset Staten Island Ferry ride or rooftop lounge in Williamsburg.',
        transport: 'Roosevelt Island Aerial Tram + F Train',
        travelTime: '15m aerial tram ride',
        interestFocus: ['Shopping', 'Adventure', 'Food'],
      },
    ],
  },
  {
    id: 'tokyo',
    city: 'Tokyo',
    country: 'Japan',
    continent: 'Asia',
    airportCode: 'HND',
    lat: 35.6762,
    lng: 139.6503,
    image: '/src/assets/images/dest_tokyo_pagoda_1790744950999.jpg',
    fallbackGradient: 'from-indigo-950 via-sky-900 to-rose-800',
    bestTimeToVisit: 'March to May (Sakura) & October to November (Koyo)',
    popularAttractions: [
      'Senso-ji Temple & Asakusa Nakamise Street',
      'Shibuya Sky & Shibuya Scramble Crossing',
      'Meiji Jingu Forest Shrine & Harajuku',
      'teamLab Planets Immersive Digital Museum',
      'Mount Fuji & Lake Kawaguchiko Scenic Excursion',
    ],
    avgDailyBudgetINR: {
      Budget: 9800,
      Standard: 19500,
      Luxury: 48000,
    },
    recommendedDays: 4,
    localCurrency: 'JPY',
    localCurrencyName: 'Japanese Yen (¥)',
    popularFoods: ['Artisanal Ramen', 'Edomae Nigiri Sushi', 'Crispy Vegetable & Prawn Tempura', 'Matcha Parfait', 'Taiyaki & Takoyaki'],
    vegetarianOptions: [
      'T’s Tantan Golden Sesame Ramen inside Tokyo Station (100% plant-based, rich umami broth)',
      'Afuri Vegan Yuzu Shio Ramen in Harajuku & Roppongi',
      'Zen Buddhist Shojin Ryori multi-course temple cuisine & Vegetable Tempura Donburi',
    ],
    nonVegetarianOptions: [
      'Tsukiji Outer Market Fresh Tuna Nigiri & Tamagoyaki',
      'Tonkatsu Maisen Omotesando Crispy Pork Cutlet',
      'A5 Wagyu Yakiniku grill in Shinjuku',
    ],
    popularRestaurants: [
      {
        name: 'T’s Tantan Tokyo Station',
        cuisine: 'Plant-Based Artisanal Ramen',
        type: 'Pure Vegetarian',
        neighborhood: 'Marunouchi / Keiyo Street',
        avgMealCostINR: 1100,
        signatureDish: 'Golden Sesame Tantanmen Ramen & Gyoza',
      },
      {
        name: 'Gonpachi Nishiazabu',
        cuisine: 'Traditional Izakaya & Buckwheat Soba',
        type: 'Vegetarian-Friendly',
        neighborhood: 'Roppongi / Nishiazabu',
        avgMealCostINR: 3200,
        signatureDish: 'Handmade Cold Soba, Tofu Skewers & Tempura',
      },
      {
        name: 'Sushiro / Tsukiji Sushisay',
        cuisine: 'Edomae Sushi',
        type: 'Non-Vegetarian & Local',
        neighborhood: 'Tsukiji / Ginza',
        avgMealCostINR: 2800,
        signatureDish: 'Chef’s Seasonal Omakase Nigiri Set',
      },
    ],
    approxDailyFoodCostINR: {
      Budget: 2100,
      Standard: 4600,
      Luxury: 14000,
    },
    weatherSummary: {
      avgTempC: 18,
      climateType: 'Humid Subtropical',
      rainyMonths: 'June (Tsuyu plum rain) & September',
      seasons: [
        {
          season: 'Spring (Sakura)',
          months: 'Mar – May',
          tempRange: '10°C – 22°C',
          condition: 'Cherry blossoms blanketing Ueno Park and Chidorigafuchi',
          packingAdvice: 'Light cardigan, slip-on walking shoes (easy removal at temples).',
        },
        {
          season: 'Autumn (Koyo)',
          months: 'Oct – Nov',
          tempRange: '12°C – 21°C',
          condition: 'Clear skies for Mount Fuji views and crimson maple leaves',
          packingAdvice: 'Layered knitwear and light windproof jacket.',
        },
        {
          season: 'Winter',
          months: 'Dec – Feb',
          tempRange: '2°C – 12°C',
          condition: 'Crisp, dry, and sunny days with crystal-clear Fuji visibility',
          packingAdvice: 'Warm coat and Heattech base layers.',
        },
      ],
    },
    travelTips: {
      customs: 'Never tip in Japan (it is politely refused). Speak quietly on trains and avoid eating while walking on busy streets.',
      safety: 'Extremely safe day and night. Emergency police is 110; ambulance is 119.',
      transportation: 'Add a digital Welcome Suica or Pasmo IC card to your phone wallet for instant tap on JR Yamanote Line and Tokyo Metro.',
      internetSim: 'Ubigi or Airalo Japan 5G eSIM works underground and on bullet trains.',
      currencyTip: 'Carry ¥10,000–¥15,000 in cash for shrine charms, small ramen ticket machines, and street snacks (7-Eleven ATMs accept Indian Visa/Mastercard).',
      visaInfoForIndians: 'Japan Tourist eVisa for Indian citizens residing in India (smooth online/VFS processing in 5–7 working days).',
    },
    localPhrases: [
      { phrase: 'Thank you very much', local: 'Arigatō gozaimasu', pronunciation: 'Ah-ree-ga-toh go-zai-mas' },
      { phrase: 'Excuse me / Sorry', local: 'Sumimasen', pronunciation: 'Soo-mee-ma-sen' },
      { phrase: 'I am vegetarian (no meat/fish)', local: 'Bejitarian desu (niku to sakana nashi)', pronunciation: 'Be-ji-ta-ri-an des' },
    ],
    hotelsByStyle: {
      Budget: { name: 'sequence MIYASHITA PARK Shibuya', area: 'Shibuya', nightlyRateINR: 7800 },
      Standard: { name: 'Hotel Groove Shinjuku / Tokyu Stay Ginza', area: 'Ginza / Shinjuku', nightlyRateINR: 15800 },
      Luxury: { name: 'Aman Tokyo / Palace Hotel Otemachi', area: 'Otemachi Imperial Gardens', nightlyRateINR: 46000 },
    },
    dayTemplates: [
      {
        title: 'Historic Asakusa, Ueno Park & Tokyo Skytree',
        morning: 'Pass through Kaminarimon Thunder Gate to Senso-ji Temple and browse traditional crafts on Nakamise-dori.',
        afternoon: 'Stroll Ueno Park museums and Akihabara Electric Town.',
        evening: 'Panoramic twilight views from Tokyo Skytree Tembo Deck and Sumida River walk.',
        transport: 'Tokyo Monorail + Ginza Subway Line',
        travelTime: '14h 10m transpacific flight from New York (JFK → HND)',
        interestFocus: ['History', 'Shopping', 'Food'],
      },
      {
        title: 'Meiji Shrine, Harajuku & Shibuya Sky Sunset',
        morning: 'Walk beneath towering cedar torii gates at Meiji Jingu Shrine and Yoyogi Park.',
        afternoon: 'Explore Harajuku’s Takeshita Street, Omotesando architectural avenues, and Nezu Museum garden.',
        evening: 'Cross the Shibuya Scramble and ascend Shibuya Sky open-air rooftop at sunset.',
        transport: 'JR Yamanote Line',
        travelTime: '15m rail ride',
        interestFocus: ['Nature', 'Shopping', 'Nightlife'],
      },
      {
        title: 'teamLab Planets, Tsukiji & Ginza',
        morning: 'Barefoot immersive digital art experience at teamLab Planets in Toyosu.',
        afternoon: 'Culinary tasting tour at Tsukiji Outer Market and Hamarikyu Gardens tea house on a tidal pond.',
        evening: 'Evening illumination walk in Ginza and Tokyo Station Marunouchi plaza.',
        transport: 'Yurikamome Monorail + Metro Hibiya Line',
        travelTime: '20m monorail ride',
        interestFocus: ['Food', 'Adventure', 'Shopping'],
      },
      {
        title: 'Mount Fuji & Chureito Pagoda Day Excursion',
        morning: 'Express train from Shinjuku to Kawaguchiko; climb to Chureito five-story pagoda overlooking Mount Fuji.',
        afternoon: 'Lake Kawaguchiko ropeway and Oishi Park seasonal flower fields.',
        evening: 'Return to Shinjuku for dinner in Omoide Yokocho and Tokyo Metropolitan Building light show.',
        transport: 'Fuji Excursion Limited Express Train',
        travelTime: '1h 55m scenic rail from Shinjuku',
        interestFocus: ['Mountains', 'Nature', 'Adventure'],
      },
    ],
  },
  {
    id: 'singapore',
    city: 'Singapore',
    country: 'Singapore',
    continent: 'Asia',
    airportCode: 'SIN',
    lat: 1.3521,
    lng: 103.8198,
    image: '/src/assets/images/dest_singapore_bay_1790744963579.jpg',
    fallbackGradient: 'from-emerald-900 via-teal-800 to-sky-900',
    bestTimeToVisit: 'February to April & July to October',
    popularAttractions: [
      'Gardens by the Bay (Cloud Forest, Flower Dome & Supertree Grove)',
      'Marina Bay Sands SkyPark Observation Deck',
      'Jewel Changi Rain Vortex & Canopy Park',
      'Sentosa Island Cable Car & Palawan Beach',
      'Singapore Botanic Gardens (UNESCO Heritage) & Little India / Chinatown',
    ],
    avgDailyBudgetINR: {
      Budget: 8500,
      Standard: 17000,
      Luxury: 42000,
    },
    recommendedDays: 3,
    localCurrency: 'SGD',
    localCurrencyName: 'Singapore Dollar (S$)',
    popularFoods: ['Kaya Toast with Soft Eggs & Kopi', 'Laksa Lemak', 'Chilli Crab with Mantou', 'Satay by the Bay', 'Ice Kachang & Chendol'],
    vegetarianOptions: [
      'Komala Vilas & Murugan Idli Shop on Serangoon Road in Little India',
      'Whole Earth (Michelin Bib Gourmand Peranakan-Thai vegetarian cuisine at Tanjong Pagar)',
      'Vegetarian Bee Hoon, Prata & Kaya Toast at Lau Pa Sat and Maxwell Food Centre',
    ],
    nonVegetarianOptions: [
      'Tian Tian Hainanese Chicken Rice at Maxwell Food Centre',
      'Jumbo Seafood Singapore Chilli Crab along Clarke Quay Riverwalk',
      'Charcoal-grilled Satay skewers at Lau Pa Sat Boon Tat Street',
    ],
    popularRestaurants: [
      {
        name: 'Lau Pa Sat Festival Market',
        cuisine: 'Heritage Victorian Cast-Iron Hawker Hall',
        type: 'Vegetarian-Friendly',
        neighborhood: 'Raffles Place / Downtown Core',
        avgMealCostINR: 950,
        signatureDish: 'Laksa, Popiah Rolls & Evening Satay Street',
      },
      {
        name: 'Komala Vilas (Est. 1947)',
        cuisine: 'Traditional South & North Indian Vegetarian',
        type: 'Pure Vegetarian',
        neighborhood: 'Little India (Serangoon Rd)',
        avgMealCostINR: 1100,
        signatureDish: 'Banana Leaf Meal & Mysore Masala Dosa',
      },
      {
        name: 'Jumbo Seafood Riverside Point',
        cuisine: 'Iconic Singaporean Seafood',
        type: 'Non-Vegetarian & Local',
        neighborhood: 'Clarke Quay',
        avgMealCostINR: 5200,
        signatureDish: 'Award-Winning Singapore Chilli Crab with Fried Mantou',
      },
    ],
    approxDailyFoodCostINR: {
      Budget: 1800,
      Standard: 3900,
      Luxury: 11000,
    },
    weatherSummary: {
      avgTempC: 28,
      climateType: 'Tropical Rainforest Equatorial',
      rainyMonths: 'Short afternoon tropical showers possible year-round',
      seasons: [
        {
          season: 'Dry Equatorial Window',
          months: 'Feb – Apr',
          tempRange: '25°C – 31°C',
          condition: 'Bright sunshine and pleasant sea breeze at Marina Bay',
          packingAdvice: 'Light breathable linen/cotton and UV umbrella.',
        },
        {
          season: 'Mid-Year Tropical',
          months: 'May – Oct',
          tempRange: '26°C – 32°C',
          condition: 'Warm evenings ideal for Gardens by the Bay night shows',
          packingAdvice: 'Comfortable sandals/sneakers and light sweater for chilled domes.',
        },
        {
          season: 'Monsoon Breeze',
          months: 'Nov – Jan',
          tempRange: '24°C – 30°C',
          condition: 'Lush greenery with refreshing afternoon showers',
          packingAdvice: 'Compact umbrella and quick-dry walking shoes.',
        },
      ],
    },
    travelTips: {
      customs: 'Return your tray at hawker centres (mandatory by law). Chewing gum importation and littering carry strict fines.',
      safety: 'Ultra-safe and walkable at all hours. Emergency police is 999; ambulance is 995.',
      transportation: 'Simply tap your contactless Visa/Mastercard on MRT trains and buses (SimplyGo) or use an EZ-Link card.',
      internetSim: 'Singtel or StarHub tourist eSIM available at Changi Airport for S$12 with 100GB data.',
      currencyTip: 'Hawker stalls accept PayNow QR or S$ cash; carry S$30–S$50 in small notes for traditional food centres.',
      visaInfoForIndians: 'Singapore Tourist eVisa via authorized agent + mandatory free SG Arrival Card (SGAC) submitted 3 days before landing.',
    },
    localPhrases: [
      { phrase: 'Black coffee with sugar', local: 'Kopi O', pronunciation: 'Koh-pee Oh' },
      { phrase: 'Delicious / Great', local: 'Shiok!', pronunciation: 'Shee-ok' },
      { phrase: 'Thank you (Malay)', local: 'Terima kasih', pronunciation: 'Te-ree-mah kah-seh' },
    ],
    hotelsByStyle: {
      Budget: { name: 'lyf Funan Singapore by Ascott', area: 'Civic District / City Hall', nightlyRateINR: 7600 },
      Standard: { name: 'PARKROYAL COLLECTION Marina Bay', area: 'Marina Bay (Garden-in-a-Hotel)', nightlyRateINR: 16500 },
      Luxury: { name: 'Marina Bay Sands Integrated Resort', area: 'Bayfront Infinity Pool', nightlyRateINR: 44000 },
    },
    dayTemplates: [
      {
        title: 'Marina Bay Sands, Merlion & Gardens by the Bay',
        morning: 'Walk from Merlion Park across the Helix Bridge to ArtScience Museum at Marina Bay.',
        afternoon: 'Explore the cooled Cloud Forest (indoor waterfall) and Flower Dome at Gardens by the Bay.',
        evening: 'Garden Rhapsody light & sound show beneath the Supertrees followed by Spectra water show.',
        transport: 'Singapore MRT Downtown & Circle Lines',
        travelTime: '7h 15m flight from Tokyo (HND → SIN)',
        interestFocus: ['Nature', 'Nightlife', 'History'],
      },
      {
        title: 'Sentosa Island Cable Car, Beaches & Heritage Quarters',
        morning: 'Ride the Mount Faber aerial cable car into Sentosa Island; relax at Palawan & Siloso Beach.',
        afternoon: 'Explore colorful shophouses in Little India (Sri Veeramakaliamman Temple) and Kampong Glam (Haji Lane).',
        evening: 'Dinner at Lau Pa Sat Satay Street and Clarke Quay river promenade.',
        transport: 'Singapore Cable Car + North East MRT Line',
        travelTime: '25m MRT & cable car transit',
        interestFocus: ['Beaches', 'Food', 'Shopping'],
      },
      {
        title: 'UNESCO Botanic Gardens & Jewel Changi Rain Vortex',
        morning: 'Walk the National Orchid Garden inside the UNESCO-listed Singapore Botanic Gardens.',
        afternoon: 'Marvel at the 40-meter HSBC Rain Vortex waterfall and Shiseido Forest Valley at Jewel Changi Airport.',
        evening: 'Direct evening flight back to Hyderabad (SIN → HYD, 4h 35m).',
        transport: 'MRT East-West Line to Changi Airport',
        travelTime: '4h 35m return flight to Hyderabad (SIN → HYD)',
        interestFocus: ['Nature', 'Shopping', 'Food'],
      },
    ],
  },
  {
    id: 'rome',
    city: 'Rome',
    country: 'Italy',
    continent: 'Europe',
    airportCode: 'FCO',
    lat: 41.9028,
    lng: 12.4964,
    image: '/src/assets/images/dest_paris_eiffel_1790744900393.jpg',
    fallbackGradient: 'from-amber-800 via-orange-700 to-stone-900',
    bestTimeToVisit: 'April to June & September to October',
    popularAttractions: [
      'Colosseum, Roman Forum & Palatine Hill',
      'Vatican Museums, Sistine Chapel & St. Peter’s Basilica',
      'Pantheon & Piazza Navona',
      'Trevi Fountain & Spanish Steps',
      'Trastevere Cobblestone Alleys & Villa Borghese',
    ],
    avgDailyBudgetINR: {
      Budget: 10800,
      Standard: 20500,
      Luxury: 49000,
    },
    recommendedDays: 3,
    localCurrency: 'EUR',
    localCurrencyName: 'Euro (€)',
    popularFoods: ['Cacio e Pepe', 'Roman Pizza al Taglio', 'Supplì (Crispy Mozzarella Rice Balls)', 'Artisanal Gelato', 'Tiramisu'],
    vegetarianOptions: [
      'Pasta Cacio e Pepe, Pasta alla Norma & Margherita Pizza in Trastevere',
      'Carciofi alla Romana (Roman braised artichokes) & Eggplant Parmigiana',
      'Artisanal pistachio and dark chocolate Gelato at Giolitti or Frigidarium',
    ],
    nonVegetarianOptions: [
      'Authentic Spaghetti alla Carbonara with Guanciale and Pecorino Romano',
      'Saltimbocca alla Romana',
      'Crispy Roman Maritozzo and Seafood Frittura',
    ],
    popularRestaurants: [
      {
        name: 'Tonnarello Trastevere',
        cuisine: 'Traditional Roman Trattoria',
        type: 'Vegetarian-Friendly',
        neighborhood: 'Trastevere',
        avgMealCostINR: 2300,
        signatureDish: 'Fresh Tonnarelli Cacio e Pepe in Pecorino Wheel',
      },
      {
        name: 'Rifugio Romano',
        cuisine: 'Roman Vegetarian & Vegan Trattoria',
        type: 'Pure Vegetarian',
        neighborhood: 'Via Volturno (Near Termini)',
        avgMealCostINR: 2100,
        signatureDish: 'Plant-Based Roman Carbonara & Truffle Pizza',
      },
      {
        name: 'Roscioli Salumeria con Cucina',
        cuisine: 'Historic Roman Gastronomy',
        type: 'Non-Vegetarian & Local',
        neighborhood: 'Campo de’ Fiori',
        avgMealCostINR: 4200,
        signatureDish: 'Rigatoni con la Pajata & Artisanal Burrata',
      },
    ],
    approxDailyFoodCostINR: {
      Budget: 2500,
      Standard: 5400,
      Luxury: 14000,
    },
    weatherSummary: {
      avgTempC: 19,
      climateType: 'Mediterranean',
      rainyMonths: 'November is the rainiest month',
      seasons: [
        {
          season: 'Spring / Autumn',
          months: 'Apr – Jun & Sep – Oct',
          tempRange: '14°C – 26°C',
          condition: 'Golden Mediterranean sunshine and mild evenings',
          packingAdvice: 'Breathable shirts, sunglasses, and scarf for basilica dress codes.',
        },
      ],
    },
    travelTips: {
      customs: 'Shoulders and knees must be covered when entering St. Peter’s Basilica and Roman churches.',
      safety: 'Drink free cold spring water from Rome’s historic "Nasoni" street fountains. Emergency is 112.',
      transportation: 'Tap contactless card on Rome Metro Lines A & B and ATAC buses.',
      internetSim: 'Covered under the same European Schengen eSIM.',
      currencyTip: 'Look for "Servizio" or "Coperto" (€1.50–€3 bread/cover charge per person) listed on menus.',
      visaInfoForIndians: 'Covered by the same Schengen Visa used for Paris/Switzerland.',
    },
    localPhrases: [
      { phrase: 'Hello / Goodbye', local: 'Ciao / Buongiorno', pronunciation: 'Chow / Bwon-jor-noh' },
      { phrase: 'Thank you', local: 'Grazie', pronunciation: 'Graht-zee-eh' },
    ],
    hotelsByStyle: {
      Budget: { name: 'The Beehive Rome Boutique', area: 'Termini / Castro Pretorio', nightlyRateINR: 7900 },
      Standard: { name: 'Hotel Artemide Via Nazionale', area: 'Centro Storico', nightlyRateINR: 15900 },
      Luxury: { name: 'Hotel Hassler Roma', area: 'Trinità dei Monti / Spanish Steps', nightlyRateINR: 48000 },
    },
    dayTemplates: [
      {
        title: 'Colosseum, Roman Forum & Trevi Fountain',
        morning: 'Guided walk inside the Colosseum arena floor, Arch of Constantine, and Roman Forum.',
        afternoon: 'Walk past Piazza Venezia to the Pantheon and Piazza Navona.',
        evening: 'Toss a coin at Trevi Fountain and dine in Trastevere.',
        transport: 'Rome Metro Line B + Walking',
        travelTime: '2h flight within Europe',
        interestFocus: ['History', 'Food', 'Nightlife'],
      },
    ],
  },
  {
    id: 'zurich',
    city: 'Zurich & Swiss Alps',
    country: 'Switzerland',
    continent: 'Europe',
    airportCode: 'ZRH',
    lat: 47.3769,
    lng: 8.5417,
    image: '/src/assets/images/hero_world_travel_1790744870087.jpg',
    fallbackGradient: 'from-sky-900 via-cyan-800 to-emerald-900',
    bestTimeToVisit: 'May to October (Hiking) & December to March (Snow)',
    popularAttractions: [
      'Jungfraujoch — Top of Europe Glacier Saddle',
      'Mount Titlis Rotair Revolving Cable Car & Cliff Walk',
      'Lake Lucerne Chapel Bridge & Panorama Cruise',
      'Lauterbrunnen Valley of 72 Waterfalls',
      'Zurich Old Town (Altstadt) & Lindt Home of Chocolate',
    ],
    avgDailyBudgetINR: {
      Budget: 15500,
      Standard: 29500,
      Luxury: 68000,
    },
    recommendedDays: 3,
    localCurrency: 'EUR',
    localCurrencyName: 'Swiss Franc (CHF / € accepted)',
    popularFoods: ['Swiss Cheese Fondue', 'Crispy Potato Rösti', 'Raclette', 'Lindt Artisanal Pralines', 'Bircher Muesli'],
    vegetarianOptions: [
      'Hiltl Zurich (Guinness World Record oldest vegetarian restaurant since 1898)',
      'Traditional Alpine Cheese Fondue with crusty bread, baby potatoes, and pickles',
      'Golden Potato Rösti topped with alpine herbs and fried egg or mushrooms',
    ],
    nonVegetarianOptions: [
      'Zürcher Geschnetzeltes (veal strips in creamy white wine mushroom sauce)',
      'Alpine Bratwurst with onion gravy',
      'Lake Zurich pan-seared perch fillets',
    ],
    popularRestaurants: [
      {
        name: 'Haus Hiltl Zurich',
        cuisine: 'World’s Oldest Vegetarian Restaurant (Est. 1898)',
        type: 'Pure Vegetarian',
        neighborhood: 'Sihlstrasse, Zurich',
        avgMealCostINR: 3400,
        signatureDish: '100-Dish Gourmet Buffet & Swiss Zürcher Geschnetzeltes (Plant-Based)',
      },
      {
        name: 'Swiss Chuchi Restaurant',
        cuisine: 'Traditional Alpine Fondue Chalet',
        type: 'Vegetarian-Friendly',
        neighborhood: 'Niederdorf Old Town',
        avgMealCostINR: 3900,
        signatureDish: 'Original Gruyère & Vacherin Cheese Fondue & Rösti',
      },
    ],
    approxDailyFoodCostINR: {
      Budget: 3600,
      Standard: 7800,
      Luxury: 19500,
    },
    weatherSummary: {
      avgTempC: 14,
      climateType: 'Alpine & Temperate Continental',
      rainyMonths: 'Occasional summer mountain showers',
      seasons: [
        {
          season: 'Alpine Summer',
          months: 'Jun – Sep',
          tempRange: '12°C – 24°C (0°C on peaks)',
          condition: 'Emerald meadows and crystal-clear alpine lakes',
          packingAdvice: 'Fleece layer and sunglasses even in summer for snow glaciers.',
        },
      ],
    },
    travelTips: {
      customs: 'Trains depart to the exact second. Quiet hours in residential areas begin at 10 PM.',
      safety: 'Exceptionally safe. Emergency number is 112.',
      transportation: 'Swiss Travel Pass covers SBB trains, lake steamers, city trams, and 50% off mountain railways.',
      internetSim: 'Check that your European eSIM explicitly includes Switzerland (non-EU member, though inside Schengen).',
      currencyTip: 'Swiss Franc (CHF) is the official currency, though Euros are widely accepted at stations.',
      visaInfoForIndians: 'Covered by the Schengen Visa.',
    },
    localPhrases: [
      { phrase: 'Hello (Swiss German)', local: 'Grüezi', pronunciation: 'Groo-et-see' },
      { phrase: 'Thank you', local: 'Merci vilmal', pronunciation: 'Mer-see veel-mahl' },
    ],
    hotelsByStyle: {
      Budget: { name: 'Ruby Mimi Hotel Zurich', area: 'Bahnhofstrasse / Central', nightlyRateINR: 11800 },
      Standard: { name: 'Hotel Schweizerhof Luzern / Interlaken', area: 'Lakefront Promenade', nightlyRateINR: 23000 },
      Luxury: { name: 'Baur au Lac Zurich', area: 'Lake Zurich Park', nightlyRateINR: 64000 },
    },
    dayTemplates: [
      {
        title: 'Mount Titlis Eternal Snow & Lucerne Lake Cruise',
        morning: 'Board SBB train to Engelberg and ride the Rotair revolving cable car to Mount Titlis glacier at 3,020m.',
        afternoon: 'Cross Europe’s highest suspension Cliff Walk and visit Lucerne’s 14th-century Chapel Bridge.',
        evening: 'Swiss cheese fondue and rösti dinner overlooking the Limmat River.',
        transport: 'SBB Panorama Rail + Titlis Rotair Gondola',
        travelTime: '1h 15m scenic train',
        interestFocus: ['Mountains', 'Adventure', 'Nature'],
      },
    ],
  },
  {
    id: 'bali',
    city: 'Bali (Ubud & Uluwatu)',
    country: 'Indonesia',
    continent: 'Asia',
    airportCode: 'DPS',
    lat: -8.4095,
    lng: 115.1889,
    image: '/src/assets/images/hero_world_travel_1790744870087.jpg',
    fallbackGradient: 'from-emerald-800 via-teal-700 to-amber-700',
    bestTimeToVisit: 'April to October',
    popularAttractions: [
      'Tegalalang Rice Terraces & Campuhan Ridge Walk',
      'Uluwatu Cliff Temple & Sunset Kecak Fire Dance',
      'Nusa Penida Kelingking Cliff & Snorkeling',
      'Mount Batur Sunrise Volcano Trek',
      'Ulun Danu Beratan Water Temple',
    ],
    avgDailyBudgetINR: {
      Budget: 5200,
      Standard: 11500,
      Luxury: 31000,
    },
    recommendedDays: 4,
    localCurrency: 'USD',
    localCurrencyName: 'Indonesian Rupiah (IDR)',
    popularFoods: ['Nasi Goreng', 'Gado-Gado Peanut Salad', 'Smoothie Bowls', 'Satay Lilit', 'Pisang Goreng'],
    vegetarianOptions: [
      'Gado-Gado (steamed vegetables, tempeh, and tofu in rich peanut sauce)',
      'Ubud Organic Café Dragonfruit & Acai Smoothie Bowls and Tempe Crispy Nasi Campur',
    ],
    nonVegetarianOptions: [
      'Jimbaran Bay Grilled Red Snapper on the beach at sunset',
      'Balinese Bebek Betutu (slow-cooked spiced duck)',
    ],
    popularRestaurants: [
      {
        name: 'Clear Café Ubud',
        cuisine: 'Balinese Wellness & Plant-Forward',
        type: 'Vegetarian-Friendly',
        neighborhood: 'Ubud Center',
        avgMealCostINR: 950,
        signatureDish: 'Balinese Tempeh Curry & Raw Cacao Bowl',
      },
    ],
    approxDailyFoodCostINR: {
      Budget: 1100,
      Standard: 2600,
      Luxury: 7500,
    },
    weatherSummary: {
      avgTempC: 28,
      climateType: 'Tropical Island',
      rainyMonths: 'December to February',
      seasons: [
        {
          season: 'Dry Tropical Season',
          months: 'Apr – Oct',
          tempRange: '24°C – 30°C',
          condition: 'Sunny beach days and cool Ubud highland evenings',
          packingAdvice: 'Resort wear, swimwear, and sarong for temple visits.',
        },
      ],
    },
    travelTips: {
      customs: 'Wear a sarong and sash (usually provided at entrances) when visiting Balinese Hindu temples.',
      safety: 'Use Bluebird Taxi or Grab/Gojek apps for transparent ride fares.',
      transportation: 'Private driver hire for a full 10-hour day costs ~₹3,200–₹4,000.',
      internetSim: 'Telkomsel tourist eSIM or airport SIM card.',
      currencyTip: '1 INR ≈ 190 IDR; check zeros carefully on large Rupiah notes.',
      visaInfoForIndians: 'Visa on Arrival (VoA) at Denpasar Airport or online e-VoA for 30 days.',
    },
    localPhrases: [
      { phrase: 'Thank you', local: 'Terima kasih / Suksma', pronunciation: 'Sook-smah' },
    ],
    hotelsByStyle: {
      Budget: { name: 'Puri Garden Hotel & Hostel Ubud', area: 'Ubud Monkey Forest Rd', nightlyRateINR: 3800 },
      Standard: { name: 'Alaya Resort Ubud', area: 'Ubud Rice Fields', nightlyRateINR: 9400 },
      Luxury: { name: 'Four Seasons Resort Bali at Sayan', area: 'Ayung River Valley', nightlyRateINR: 36000 },
    },
    dayTemplates: [
      {
        title: 'Ubud Rice Terraces, Waterfalls & Uluwatu Cliff Sunset',
        morning: 'Sunrise walk across Tegalalang Rice Terraces and Tirta Empul Holy Spring Temple.',
        afternoon: 'Relax at Padang Padang Beach and Uluwatu coastal cliffs.',
        evening: 'Sunset Kecak Fire Dance overlooking the Indian Ocean followed by Jimbaran beach dinner.',
        transport: 'Private Chartered Car',
        travelTime: '1h 15m scenic drive',
        interestFocus: ['Beaches', 'Nature', 'History'],
      },
    ],
  },
  {
    id: 'sydney',
    city: 'Sydney',
    country: 'Australia',
    continent: 'Oceania',
    airportCode: 'SYD',
    lat: -33.8688,
    lng: 151.2093,
    image: '/src/assets/images/dest_singapore_bay_1790744963579.jpg',
    fallbackGradient: 'from-sky-700 via-blue-900 to-amber-600',
    bestTimeToVisit: 'September to November & March to May',
    popularAttractions: [
      'Sydney Opera House & Circular Quay Harbour',
      'Sydney Harbour Bridge Climb & The Rocks',
      'Bondi to Coogee Coastal Cliff Walk',
      'Manly Beach Ferry & Taronga Zoo',
      'Blue Mountains Three Sisters Day Trip',
    ],
    avgDailyBudgetINR: {
      Budget: 11500,
      Standard: 22000,
      Luxury: 51000,
    },
    recommendedDays: 3,
    localCurrency: 'AUD',
    localCurrencyName: 'Australian Dollar (A$)',
    popularFoods: ['Sourdough Avocado Smash & Flat White', 'Sydney Rock Oysters', 'Lamington Sponge Cake', 'Pavlova with Passionfruit'],
    vegetarianOptions: [
      'Sydney Specialty Café Sourdough Avocado Toast with Halloumi & Poached Eggs',
      'Surry Hills Plant-Based Asian Fusion & Harris Park Indian Dining Strip',
    ],
    nonVegetarianOptions: [
      'Barramundi fillet at Sydney Fish Market',
      'Classic Australian Meat Pie at Harry’s Cafe de Wheels',
    ],
    popularRestaurants: [
      {
        name: 'The Grounds of Alexandria',
        cuisine: 'Garden Roastery & Modern Australian',
        type: 'Vegetarian-Friendly',
        neighborhood: 'Alexandria',
        avgMealCostINR: 2600,
        signatureDish: 'Artisanal Brekkie Plate & Specialty Flat White',
      },
    ],
    approxDailyFoodCostINR: {
      Budget: 2700,
      Standard: 5600,
      Luxury: 14500,
    },
    weatherSummary: {
      avgTempC: 21,
      climateType: 'Sunny Temperate Coastal',
      rainyMonths: 'Brief coastal showers in March–June',
      seasons: [
        {
          season: 'Southern Spring / Summer',
          months: 'Oct – Mar',
          tempRange: '17°C – 28°C',
          condition: 'Sparkling harbour skies and warm surf beaches',
          packingAdvice: 'SPF 50+ sunscreen, sunhat, and coastal walking shoes.',
        },
      ],
    },
    travelTips: {
      customs: 'Swim strictly between the red and yellow flags at Bondi and Manly beaches.',
      safety: 'High UV index year-round. Emergency number is 000.',
      transportation: 'Tap contactless card or Opal Card on Circular Quay ferries, trains, and light rail.',
      internetSim: 'Telstra or Optus prepaid eSIM.',
      currencyTip: 'Australia is cashless-friendly with no mandatory tipping culture.',
      visaInfoForIndians: 'Australia Subclass 600 Visitor Visa (100% online application via ImmiAccount, no passport sticker required).',
    },
    localPhrases: [
      { phrase: 'Good day / Hello', local: 'G’day', pronunciation: 'Guh-day' },
      { phrase: 'Afternoon', local: 'Arvo', pronunciation: 'Ar-voh' },
    ],
    hotelsByStyle: {
      Budget: { name: 'Wake Up! Sydney Central', area: 'Pitt Street / Central', nightlyRateINR: 7400 },
      Standard: { name: 'Vibe Hotel Sydney Darling Harbour', area: 'Darling Harbour', nightlyRateINR: 15400 },
      Luxury: { name: 'Park Hyatt Sydney Harbourfront', area: 'The Rocks / Opera View', nightlyRateINR: 49000 },
    },
    dayTemplates: [
      {
        title: 'Sydney Opera House, Harbour Ferry & Bondi Coastal Walk',
        morning: 'Guided architectural tour of Sydney Opera House and stroll through Royal Botanic Garden.',
        afternoon: 'Walk the dramatic Bondi to Coogee clifftop trail and swim at Bondi Icebergs.',
        evening: 'Sunset Manly Ferry across Sydney Harbour and dinner at The Rocks.',
        transport: 'Sydney Harbour Ferry F1 + Bus 333',
        travelTime: '30m harbour ferry ride',
        interestFocus: ['Beaches', 'Nature', 'Adventure'],
      },
    ],
  },
];

export const FLAGSHIP_CITY_IDS = ['dubai', 'paris', 'london', 'newyork', 'tokyo', 'singapore'];

export const DEFAULT_CITY_DAYS: Record<string, number> = {
  dubai: 3,
  paris: 4,
  london: 3,
  newyork: 4,
  tokyo: 4,
  singapore: 3,
};

// Haversine Great-Circle Distance Calculator (in kilometers)
export function calculateDistanceKm(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
}

export interface RouteLeg {
  index: number;
  fromCity: string;
  fromCountry: string;
  fromCode: string;
  fromLat: number;
  fromLng: number;
  toCity: string;
  toCountry: string;
  toCode: string;
  toLat: number;
  toLng: number;
  distanceKm: number;
  estimatedFlightHours: string;
}

export function computeRouteLegs(
  startingCity: StartingCity,
  selectedCityIds: string[]
): RouteLeg[] {
  const stops = selectedCityIds
    .map((id) => DESTINATIONS.find((d) => d.id === id))
    .filter((d): d is DestinationData => Boolean(d));

  if (stops.length === 0) return [];

  const waypoints = [
    {
      city: startingCity.city,
      country: startingCity.country,
      code: startingCity.airportCode,
      lat: startingCity.lat,
      lng: startingCity.lng,
    },
    ...stops.map((s) => ({
      city: s.city,
      country: s.country,
      code: s.airportCode,
      lat: s.lat,
      lng: s.lng,
    })),
    {
      city: startingCity.city,
      country: startingCity.country,
      code: startingCity.airportCode,
      lat: startingCity.lat,
      lng: startingCity.lng,
    },
  ];

  const legs: RouteLeg[] = [];
  for (let i = 0; i < waypoints.length - 1; i++) {
    const from = waypoints[i];
    const to = waypoints[i + 1];
    const distanceKm = calculateDistanceKm(from.lat, from.lng, to.lat, to.lng);
    const hoursRaw = distanceKm / 780 + 0.6;
    const h = Math.floor(hoursRaw);
    const m = Math.round((hoursRaw - h) * 60);
    legs.push({
      index: i + 1,
      fromCity: from.city,
      fromCountry: from.country,
      fromCode: from.code,
      fromLat: from.lat,
      fromLng: from.lng,
      toCity: to.city,
      toCountry: to.country,
      toCode: to.code,
      toLat: to.lat,
      toLng: to.lng,
      distanceKm,
      estimatedFlightHours: `${h}h ${m.toString().padStart(2, '0')}m`,
    });
  }
  return legs;
}

export function generateTripItinerary(
  startingCity: StartingCity,
  selectedCityIds: string[],
  cityDays: Record<string, number>,
  startDateStr: string,
  travelStyle: TravelStyle,
  interests: InterestTag[]
): ItineraryDay[] {
  const days: ItineraryDay[] = [];
  const baseDate = startDateStr ? new Date(startDateStr) : new Date('2026-11-10');
  let dayCounter = 1;

  let prevCityName = startingCity.city;
  let prevAirportCode = startingCity.airportCode;
  let prevLat = startingCity.lat;
  let prevLng = startingCity.lng;

  for (const cityId of selectedCityIds) {
    const dest = DESTINATIONS.find((d) => d.id === cityId);
    if (!dest) continue;

    const stayDays = Math.max(1, cityDays[cityId] ?? dest.recommendedDays);
    const distFromPrev = calculateDistanceKm(prevLat, prevLng, dest.lat, dest.lng);
    const flightHours = Math.max(2, Math.round((distFromPrev / 780 + 0.6) * 10) / 10);

    for (let d = 0; d < stayDays; d++) {
      const currentDate = new Date(baseDate);
      currentDate.setDate(baseDate.getDate() + (dayCounter - 1));
      const formattedDate = currentDate.toISOString().split('T')[0];

      const template = dest.dayTemplates[d % dest.dayTemplates.length];
      const hotel = dest.hotelsByStyle[travelStyle];
      const dailyBaseCost = dest.avgDailyBudgetINR[travelStyle];

      // Personalize afternoon or evening note if user selected specific interests
      const matchedInterest = interests.find((i) => template.interestFocus.includes(i)) || interests[0];
      const interestEnhancement =
        d === stayDays - 1 && matchedInterest
          ? ` (Tailored ${matchedInterest} highlight included)`
          : '';

      const isArrivalDay = d === 0;
      const isLastDayOfTrip =
        cityId === selectedCityIds[selectedCityIds.length - 1] && d === stayDays - 1;

      const transitLabel = isArrivalDay
        ? `Inbound: ${prevCityName} (${prevAirportCode}) → ${dest.city} (${dest.airportCode}) · ${distFromPrev.toLocaleString()} km`
        : isLastDayOfTrip
        ? `Return: ${dest.city} (${dest.airportCode}) → ${startingCity.city} (${startingCity.airportCode})`
        : undefined;

      days.push({
        dayNumber: dayCounter,
        date: formattedDate,
        cityId: dest.id,
        city: dest.city,
        country: dest.country,
        morningActivity: template.morning,
        afternoonActivity: `${template.afternoon}${interestEnhancement}`,
        eveningActivity: isLastDayOfTrip
          ? `${template.evening} Later, transfer to ${dest.airportCode} Airport for return flight to ${startingCity.city} (${startingCity.airportCode}).`
          : template.evening,
        recommendedRestaurants: dest.popularRestaurants.map(
          (r) => `${r.name} (${r.type === 'Pure Vegetarian' ? 'Pure Veg' : r.cuisine})`
        ),
        estimatedDailyCostINR: dailyBaseCost,
        travelTime: isArrivalDay
          ? `${flightHours}h transit from ${prevCityName} + ${template.travelTime}`
          : template.travelTime,
        transportationMethod: isArrivalDay
          ? `International Flight (${prevAirportCode}→${dest.airportCode}) + ${template.transport}`
          : template.transport,
        hotelSuggestion: `${hotel.name} (${hotel.area})`,
        isTransitDay: isArrivalDay || isLastDayOfTrip,
        transitLegLabel: transitLabel,
      });

      dayCounter++;
    }

    prevCityName = dest.city;
    prevAirportCode = dest.airportCode;
    prevLat = dest.lat;
    prevLng = dest.lng;
  }

  return days;
}

export function calculateTripBudget(
  startingCity: StartingCity,
  selectedCityIds: string[],
  cityDays: Record<string, number>,
  travelers: number,
  travelStyle: TravelStyle,
  overrides?: Partial<BudgetBreakdown>
): BudgetBreakdown {
  const legs = computeRouteLegs(startingCity, selectedCityIds);
  const totalDistanceKm = legs.reduce((acc, l) => acc + l.distanceKm, 0);

  const styleFlightMultiplier =
    travelStyle === 'Budget' ? 6.2 : travelStyle === 'Standard' ? 8.5 : 22.0;

  const perPersonIntlFlights = Math.round((totalDistanceKm * styleFlightMultiplier) / 100) * 100;
  const internationalFlights = overrides?.internationalFlights ?? perPersonIntlFlights * travelers;

  const domesticFlights =
    overrides?.domesticFlights ??
    (travelStyle === 'Budget' ? 8500 : travelStyle === 'Standard' ? 14500 : 32000) * travelers;

  let totalHotelsPerRoom = 0;
  let totalFoodPerPerson = 0;
  let totalLocalTransitPerPerson = 0;
  let totalAttractionsPerPerson = 0;

  const roomsNeeded = Math.max(1, Math.ceil(travelers / 2));

  for (const cityId of selectedCityIds) {
    const dest = DESTINATIONS.find((d) => d.id === cityId);
    if (!dest) continue;
    const days = Math.max(1, cityDays[cityId] ?? dest.recommendedDays);
    totalHotelsPerRoom += dest.hotelsByStyle[travelStyle].nightlyRateINR * days;
    totalFoodPerPerson += dest.approxDailyFoodCostINR[travelStyle] * days;
    totalLocalTransitPerPerson +=
      (travelStyle === 'Budget' ? 1100 : travelStyle === 'Standard' ? 2100 : 5800) * days;
    totalAttractionsPerPerson +=
      (travelStyle === 'Budget' ? 1600 : travelStyle === 'Standard' ? 3200 : 7400) * days;
  }

  const hotels = overrides?.hotels ?? totalHotelsPerRoom * roomsNeeded;
  const food = overrides?.food ?? totalFoodPerPerson * travelers;
  const localTransportation = overrides?.localTransportation ?? totalLocalTransitPerPerson * travelers;
  const attractions = overrides?.attractions ?? totalAttractionsPerPerson * travelers;

  const shopping =
    overrides?.shopping ??
    (travelStyle === 'Budget' ? 25000 : travelStyle === 'Standard' ? 65000 : 180000) * travelers;

  // Visa fees per Indian traveler (UAE ~6.5k, Schengen ~9k, UK ~13.5k, USA ~15.5k, Japan ~1.5k, SG ~2.5k)
  const visaCostPerPerson = selectedCityIds.length * 7500;
  const visaCosts = overrides?.visaCosts ?? visaCostPerPerson * travelers;

  const totalDays = Object.entries(cityDays)
    .filter(([id]) => selectedCityIds.includes(id))
    .reduce((sum, [, d]) => sum + d, 0);

  const travelInsurance =
    overrides?.travelInsurance ?? Math.max(3500, totalDays * 280) * travelers;

  const emergencyExpenses =
    overrides?.emergencyExpenses ??
    (travelStyle === 'Budget' ? 30000 : travelStyle === 'Standard' ? 60000 : 140000);

  return {
    internationalFlights,
    domesticFlights,
    hotels,
    food,
    localTransportation,
    attractions,
    shopping,
    visaCosts,
    travelInsurance,
    emergencyExpenses,
  };
}

export const DEFAULT_TRAVEL_CHECKLIST: ChecklistItem[] = [
  {
    id: 'chk-passport',
    category: 'Passport',
    title: 'Verify Indian Passport 6-month validity & minimum 6 blank pages',
    detail: 'Required for UAE, Schengen, UK, USA, Japan, and Singapore immigration.',
    completed: true,
  },
  {
    id: 'chk-visa-1',
    category: 'Visa',
    title: 'Secure US B1/B2, UK Standard Visitor & Schengen Multi-Entry Visas',
    detail: 'Apply at VFS Global Hyderabad at least 45–60 days before departure.',
    completed: true,
  },
  {
    id: 'chk-visa-2',
    category: 'Visa',
    title: 'Complete UAE eVisa, Japan eVisa & Singapore SG Arrival Card (SGAC)',
    detail: 'SGAC is submitted online 72 hours prior to landing at Changi.',
    completed: false,
  },
  {
    id: 'chk-flights',
    category: 'Flight tickets',
    title: 'Confirm Round-the-World (RTW) multi-city PNR & baggage allowances',
    detail: 'HYD → DXB → CDG (Eurostar to LHR) → JFK → HND → SIN → HYD.',
    completed: true,
  },
  {
    id: 'chk-hotels',
    category: 'Hotel bookings',
    title: 'Save refundable hotel vouchers for all 6 cities (offline PDF copy)',
    detail: 'Immigration officers in London, Tokyo, and Singapore often inspect accommodation proof.',
    completed: true,
  },
  {
    id: 'chk-insurance',
    category: 'Travel insurance',
    title: 'Purchase USD $250,000 Worldwide Medical & Baggage Insurance (including USA)',
    detail: 'Ensure policy covers Schengen €30,000 minimum mandate and US hospitalization.',
    completed: false,
  },
  {
    id: 'chk-currency',
    category: 'Currency',
    title: 'Load Zero-Forex Markup Multi-Currency Card + Emergency Cash (USD, EUR, JPY)',
    detail: 'Enable international contactless tap-to-pay on primary Indian credit/debit cards.',
    completed: false,
  },
  {
    id: 'chk-sim',
    category: 'SIM/eSIM',
    title: 'Install Global Roaming eSIM profile + Activate International SMS Roaming on Indian SIM',
    detail: 'Essential for receiving bank OTPs while in Dubai, Europe, US, and Japan.',
    completed: false,
  },
  {
    id: 'chk-medicines',
    category: 'Medicines',
    title: 'Pack personal medical kit with signed doctor prescription',
    detail: 'UAE and Japan strictly regulate certain cold/pain medications; carry original strips & prescription.',
    completed: false,
  },
  {
    id: 'chk-clothes',
    category: 'Clothes',
    title: 'Pack multi-climate layering system (Desert sun to European/NY crisp autumn)',
    detail: 'Breathable linen for Dubai/Singapore + trench coat & thermal innerwear for Paris/London/NY/Tokyo.',
    completed: false,
  },
  {
    id: 'chk-docs',
    category: 'Important documents',
    title: 'Store DigiLocker backups, colour passport scans & passport photos (35x45mm & 2x2 inch)',
    detail: 'Keep physical copies separate from your primary passport pouch.',
    completed: true,
  },
];

export function generatePackingList(
  selectedCityIds: string[],
  totalDays: number,
  interests: InterestTag[]
): PackingItem[] {
  const items: PackingItem[] = [
    {
      id: 'pk-1',
      category: 'Documents & Money',
      name: 'Passport, Printed Visa Notices & Return Ticket Itinerary Folder',
      reason: 'Mandatory across all 6 international border crossings',
      packed: true,
    },
    {
      id: 'pk-2',
      category: 'Documents & Money',
      name: 'Zero-Forex Markup Card + Emergency Cash Pouch (USD/EUR/JPY)',
      reason: 'Tap-to-pay for London/NY/SG transit + cash for Tokyo shrines & ramen stalls',
      packed: true,
    },
    {
      id: 'pk-3',
      category: 'Electronics & SIM',
      name: 'Universal All-in-One Travel Adapter (Type C, G, A & O plugs) with 65W GaN USB-C',
      reason: 'Covers UK/Dubai/SG (Type G), France (Type C/E), and US/Japan (Type A)',
      packed: true,
    },
    {
      id: 'pk-4',
      category: 'Electronics & SIM',
      name: '20,000mAh Airline-Approved Power Bank (under 100Wh in cabin bag)',
      reason: '15,000+ daily steps with navigation, translation & eSIM usage',
      packed: false,
    },
    {
      id: 'pk-5',
      category: 'Clothing & Layers',
      name: `Breathable Cotton & Linen Shirts (${Math.min(8, Math.ceil(totalDays / 3))} sets)`,
      reason: 'Ideal for warm daytime climates in Dubai (27°C) and Singapore (28°C)',
      packed: false,
    },
    {
      id: 'pk-6',
      category: 'Clothing & Layers',
      name: 'Packable Ultralight Down Jacket + Water-Resistant Trench Layer',
      reason: 'Essential for crisp evenings in Paris, London, New York, and Mount Fuji',
      packed: false,
    },
    {
      id: 'pk-7',
      category: 'Footwear',
      name: 'Broken-in Cushioned Walking Sneakers + Slip-on Shoes',
      reason: 'Cobblestones in Paris/London and easy shoe removal at Tokyo temples',
      packed: true,
    },
    {
      id: 'pk-8',
      category: 'Health & Medicines',
      name: 'Prescription Medications with Doctor’s Note, Electrolytes & Jet-Lag Melatonin',
      reason: 'Crossing 14+ time zones from Hyderabad across Europe, Atlantic, and Pacific',
      packed: false,
    },
  ];

  if (interests.includes('Beaches') || selectedCityIds.includes('dubai') || selectedCityIds.includes('singapore')) {
    items.push({
      id: 'pk-beach',
      category: 'Activity Gear',
      name: 'Polarized UV400 Sunglasses, Swimwear & SPF 50+ Sunscreen',
      reason: 'For Jumeirah Beach, Arabian Desert Safari, and Sentosa Island',
      packed: false,
    });
  }

  if (interests.includes('Mountains') || interests.includes('Adventure') || selectedCityIds.includes('tokyo') || selectedCityIds.includes('zurich')) {
    items.push({
      id: 'pk-mtn',
      category: 'Activity Gear',
      name: 'Thermal Base Layer, Windproof Gloves & Foldable Daypack',
      reason: 'For Mount Fuji Kawaguchiko excursion & high-altitude lookouts',
      packed: false,
    });
  }

  if (interests.includes('Food')) {
    items.push({
      id: 'pk-food',
      category: 'Activity Gear',
      name: 'Bilingual Dietary Preference Card (Japanese / French Vegetarian Card)',
      reason: 'Helpful when ordering dashi-free vegetarian dishes in Tokyo and Paris bistros',
      packed: false,
    });
  }

  if (interests.includes('Nightlife') || interests.includes('Shopping')) {
    items.push({
      id: 'pk-smart',
      category: 'Clothing & Layers',
      name: 'Smart-Casual Evening Outfit + Packable Foldable Duffle Bag',
      reason: 'For rooftop dining in Dubai/Paris/NY and carrying extra shopping home to Hyderabad',
      packed: false,
    });
  }

  return items;
}

export const INITIAL_DOCUMENTS_VAULT: TravelDocumentsVault = {
  passport: {
    holderName: '',
    passportNumber: '',
    issuingCountry: 'Republic of India',
    issueDate: '',
    expiryDate: '',
    notes: 'Keep digital scan in DigiLocker and physical photocopy in carry-on.',
  },
  visas: [
    {
      id: 'v-1',
      country: 'United Arab Emirates (Dubai)',
      visaType: '30-Day Tourist eVisa',
      referenceNumber: 'UAE-EV-884920',
      validFrom: '2026-11-01',
      validUntil: '2026-12-30',
      status: 'Approved',
    },
    {
      id: 'v-2',
      country: 'France (Schengen Area)',
      visaType: 'Short-Stay Type C Multi-Entry',
      referenceNumber: 'FRA-SCH-441092',
      validFrom: '2026-11-05',
      validUntil: '2027-05-04',
      status: 'Approved',
    },
    {
      id: 'v-3',
      country: 'United Kingdom (London)',
      visaType: '6-Month Standard Visitor Visa',
      referenceNumber: 'UKVI-902318',
      validFrom: '2026-11-01',
      validUntil: '2027-05-01',
      status: 'Approved',
    },
    {
      id: 'v-4',
      country: 'United States (New York)',
      visaType: 'B1/B2 10-Year Multiple Entry',
      referenceNumber: 'US-B1B2-773104',
      validFrom: '2024-06-15',
      validUntil: '2034-06-14',
      status: 'Approved',
    },
    {
      id: 'v-5',
      country: 'Japan (Tokyo)',
      visaType: 'Single-Entry Tourist eVisa',
      referenceNumber: 'JPN-EV-552019',
      validFrom: '2026-11-10',
      validUntil: '2027-02-10',
      status: 'Application Prepared',
    },
    {
      id: 'v-6',
      country: 'Singapore',
      visaType: 'Tourist eVisa + SG Arrival Card',
      referenceNumber: 'ICA-SG-319482',
      validFrom: '2026-11-15',
      validUntil: '2027-01-15',
      status: 'Application Prepared',
    },
  ],
  flights: [
    {
      id: 'fl-1',
      route: 'Hyderabad (HYD) → Dubai (DXB)',
      airline: 'Emirates',
      flightNumber: 'EK 527',
      pnrCode: 'WE7X9K',
      departureDateTime: '2026-11-10 10:00',
      terminalInfo: 'RGIA Terminal 1 → DXB Terminal 3',
    },
    {
      id: 'fl-2',
      route: 'Dubai (DXB) → Paris (CDG)',
      airline: 'Emirates',
      flightNumber: 'EK 073',
      pnrCode: 'WE7X9K',
      departureDateTime: '2026-11-13 08:20',
      terminalInfo: 'DXB Terminal 3 → CDG Terminal 2C',
    },
    {
      id: 'fl-3',
      route: 'Paris (Gare du Nord) → London (St Pancras)',
      airline: 'Eurostar High-Speed Rail',
      flightNumber: 'ES 9014',
      pnrCode: 'EU4M2P',
      departureDateTime: '2026-11-17 09:13',
      terminalInfo: 'Paris Nord International → London St Pancras',
    },
    {
      id: 'fl-4',
      route: 'London (LHR) → New York (JFK)',
      airline: 'British Airways',
      flightNumber: 'BA 117',
      pnrCode: 'BA9L4T',
      departureDateTime: '2026-11-20 08:25',
      terminalInfo: 'LHR Terminal 5 → JFK Terminal 8',
    },
    {
      id: 'fl-5',
      route: 'New York (JFK) → Tokyo (HND)',
      airline: 'Japan Airlines',
      flightNumber: 'JL 005',
      pnrCode: 'JL8K3W',
      departureDateTime: '2026-11-24 12:15',
      terminalInfo: 'JFK Terminal 8 → HND Terminal 3',
    },
    {
      id: 'fl-6',
      route: 'Tokyo (HND) → Singapore (SIN)',
      airline: 'Singapore Airlines',
      flightNumber: 'SQ 633',
      pnrCode: 'SQ5N8R',
      departureDateTime: '2026-11-28 09:15',
      terminalInfo: 'HND Terminal 3 → Changi Terminal 3',
    },
    {
      id: 'fl-7',
      route: 'Singapore (SIN) → Hyderabad (HYD)',
      airline: 'Singapore Airlines',
      flightNumber: 'SQ 522',
      pnrCode: 'SQ5N8R',
      departureDateTime: '2026-11-30 20:05',
      terminalInfo: 'Changi Terminal 2 → RGIA Hyderabad',
    },
  ],
  hotels: [
    {
      id: 'ht-1',
      city: 'Dubai',
      hotelName: 'Taj Dubai Business Bay',
      confirmationCode: 'TAJ-DXB-8012',
      checkIn: '2026-11-10',
      checkOut: '2026-11-13',
    },
    {
      id: 'ht-2',
      city: 'Paris',
      hotelName: 'Hôtel Citadines Tour Eiffel Paris',
      confirmationCode: 'CIT-PAR-4491',
      checkIn: '2026-11-13',
      checkOut: '2026-11-17',
    },
    {
      id: 'ht-3',
      city: 'London',
      hotelName: 'citizenM Tower of London',
      confirmationCode: 'CTM-LON-3319',
      checkIn: '2026-11-17',
      checkOut: '2026-11-20',
    },
    {
      id: 'ht-4',
      city: 'New York',
      hotelName: 'Arlo Midtown Manhattan',
      confirmationCode: 'ARL-NYC-6620',
      checkIn: '2026-11-20',
      checkOut: '2026-11-24',
    },
    {
      id: 'ht-5',
      city: 'Tokyo',
      hotelName: 'Hotel Groove Shinjuku / Tokyu Stay Ginza',
      confirmationCode: 'TKY-GIN-9104',
      checkIn: '2026-11-24',
      checkOut: '2026-11-28',
    },
    {
      id: 'ht-6',
      city: 'Singapore',
      hotelName: 'PARKROYAL COLLECTION Marina Bay',
      confirmationCode: 'PRK-SIN-5582',
      checkIn: '2026-11-28',
      checkOut: '2026-11-30',
    },
  ],
  emergencyContacts: [
    {
      id: 'ec-1',
      name: 'Ministry of External Affairs (MADAD / Indian Embassy 24x7 Helpline)',
      relationshipOrRole: 'Consular Emergency Support',
      phone: '+91-11-23012113 / 1800-11-3090',
      location: 'New Delhi / Worldwide Indian Missions',
    },
    {
      id: 'ec-2',
      name: 'Worldwide Travel Medical Assistance Desk',
      relationshipOrRole: '24/7 Cashless Hospitalization & Evacuation',
      phone: '+1-800-555-0199',
      location: 'Global Toll-Free',
    },
  ],
};

export function createDefaultHyderabadWorldTrip(): WorldTripPlan {
  const startingLocation = INDIAN_STARTING_CITIES[0]; // Hyderabad
  const selectedCityIds = [...FLAGSHIP_CITY_IDS];
  const cityDays = { ...DEFAULT_CITY_DAYS };
  const startDate = '2026-11-10';
  const totalDays = selectedCityIds.reduce((sum, id) => sum + (cityDays[id] || 3), 0);
  const endObj = new Date(startDate);
  endObj.setDate(endObj.getDate() + totalDays - 1);
  const endDate = endObj.toISOString().split('T')[0];

  const travelStyle: TravelStyle = 'Standard';
  const interests: InterestTag[] = ['History', 'Food', 'Nature', 'Shopping', 'Adventure'];
  const travelers = 2;

  const itinerary = generateTripItinerary(
    startingLocation,
    selectedCityIds,
    cityDays,
    startDate,
    travelStyle,
    interests
  );

  const packingList = generatePackingList(selectedCityIds, totalDays, interests);

  return {
    id: 'trip-hyd-world-flagship',
    name: 'Hyderabad Round-the-World Grand Circuit',
    startingLocation,
    selectedCityIds,
    cityDays,
    startDate,
    endDate,
    travelers,
    travelStyle,
    interests,
    targetBudgetINR: 1350000,
    currency: 'INR',
    itinerary,
    customBudgetOverrides: {},
    checklist: DEFAULT_TRAVEL_CHECKLIST.map((item) => ({ ...item })),
    packingList,
    updatedAt: new Date().toISOString(),
  };
}
