import { jsPDF } from 'jspdf';
import {
  calculateTripBudget,
  computeRouteLegs,
  DESTINATIONS,
  formatCurrency,
} from '../data/worldTripData';
import { CurrencyCode, WorldTripPlan } from '../types/travel';

export function downloadTripPlanAsPDF(
  trip: WorldTripPlan,
  activeCurrency: CurrencyCode,
  customRates?: Partial<Record<CurrencyCode, number>>
): void {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 14;
  const contentWidth = pageWidth - margin * 2;
  let y = 18;

  const ensureSpace = (neededMm: number) => {
    if (y + neededMm > pageHeight - 16) {
      doc.addPage();
      y = 18;
    }
  };

  // Header Banner
  doc.setFillColor(12, 74, 110); // Deep Sky Blue
  doc.rect(0, 0, pageWidth, 34, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.text('WORLD EXPLORER — OFFICIAL TRIP DOSSIER', margin, 14);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.text(trip.name, margin, 21);

  const routeNames = [
    trip.startingLocation.city,
    ...trip.selectedCityIds.map(
      (id) => DESTINATIONS.find((d) => d.id === id)?.city || id
    ),
    trip.startingLocation.city,
  ].join(' -> ');

  doc.setFontSize(8.5);
  const splitRoute = doc.splitTextToSize(`Route: ${routeNames}`, contentWidth);
  doc.text(splitRoute, margin, 27);

  y = 42;
  doc.setTextColor(15, 23, 42);

  // Executive Summary Metrics
  const legs = computeRouteLegs(trip.startingLocation, trip.selectedCityIds);
  const totalDistanceKm = legs.reduce((sum, l) => sum + l.distanceKm, 0);
  const totalDays = trip.itinerary.length;
  const budget = calculateTripBudget(
    trip.startingLocation,
    trip.selectedCityIds,
    trip.cityDays,
    trip.travelers,
    trip.travelStyle,
    trip.customBudgetOverrides
  );
  const totalBudgetINR = Object.values(budget).reduce((a, b) => a + b, 0);
  const dailyAvgINR = totalDays > 0 ? totalBudgetINR / totalDays : 0;
  const perTravelerINR = trip.travelers > 0 ? totalBudgetINR / trip.travelers : 0;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text('1. Trip Executive Summary', margin, y);
  y += 6;

  doc.setDrawColor(226, 232, 240);
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(margin, y, contentWidth, 28, 2, 2, 'FD');

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text(`Origin Gateway: ${trip.startingLocation.city}, ${trip.startingLocation.country} (${trip.startingLocation.airportCode})`, margin + 4, y + 6);
  doc.text(`Dates: ${trip.startDate} to ${trip.endDate} (${totalDays} Days)`, margin + 4, y + 12);
  doc.text(`Travelers & Style: ${trip.travelers} Traveler(s) · ${trip.travelStyle} Tier`, margin + 4, y + 18);
  doc.text(`Total Flight Distance: ${totalDistanceKm.toLocaleString()} km across ${trip.selectedCityIds.length} Countries`, margin + 4, y + 24);

  const rightColX = margin + contentWidth / 2 + 4;
  doc.setFont('helvetica', 'bold');
  doc.text(
    `Total Estimated Cost: ${formatCurrency(totalBudgetINR, activeCurrency, customRates)}`,
    rightColX,
    y + 8
  );
  doc.setFont('helvetica', 'normal');
  doc.text(
    `Cost per Traveler: ${formatCurrency(perTravelerINR, activeCurrency, customRates)}`,
    rightColX,
    y + 15
  );
  doc.text(
    `Daily Average: ${formatCurrency(dailyAvgINR, activeCurrency, customRates)} / day`,
    rightColX,
    y + 22
  );

  y += 36;

  // Section 2: Budget Breakdown
  ensureSpace(55);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text(`2. Estimated Budget Breakdown (${activeCurrency})`, margin, y);
  y += 5;

  const budgetRows: [string, number][] = [
    ['International Flights (Multi-City RTW)', budget.internationalFlights],
    ['Domestic / Regional Connections', budget.domesticFlights],
    ['Hotels & Accommodations', budget.hotels],
    ['Food & Dining', budget.food],
    ['Local Metro, Rail & Transfers', budget.localTransportation],
    ['Attractions & Guided Experiences', budget.attractions],
    ['Shopping & Souvenirs', budget.shopping],
    ['Visa Processing Fees', budget.visaCosts],
    ['Worldwide Travel Insurance', budget.travelInsurance],
    ['Emergency Reserve Buffer', budget.emergencyExpenses],
  ];

  doc.setFontSize(8.5);
  budgetRows.forEach(([label, valINR], idx) => {
    if (idx % 2 === 0) {
      doc.setFillColor(248, 250, 252);
      doc.rect(margin, y - 3.5, contentWidth, 5.5, 'F');
    }
    doc.setFont('helvetica', 'normal');
    doc.text(label, margin + 2, y);
    doc.setFont('helvetica', 'bold');
    doc.text(
      formatCurrency(valINR, activeCurrency, customRates),
      margin + contentWidth - 2,
      y,
      { align: 'right' }
    );
    y += 5.5;
  });

  y += 5;

  // Section 3: Day-by-Day Itinerary
  ensureSpace(20);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text('3. Complete Day-by-Day World Itinerary', margin, y);
  y += 6;

  trip.itinerary.forEach((day) => {
    ensureSpace(34);
    doc.setDrawColor(203, 213, 225);
    doc.line(margin, y, margin + contentWidth, y);
    y += 4.5;

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.setTextColor(3, 105, 161);
    doc.text(
      `Day ${day.dayNumber} (${day.date}) — ${day.city}, ${day.country}`,
      margin,
      y
    );
    doc.setTextColor(15, 23, 42);
    doc.text(
      `Est: ${formatCurrency(day.estimatedDailyCostINR, activeCurrency, customRates)}`,
      margin + contentWidth,
      y,
      { align: 'right' }
    );
    y += 4.5;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);

    const morningLines = doc.splitTextToSize(`Morning: ${day.morningActivity}`, contentWidth);
    doc.text(morningLines, margin, y);
    y += morningLines.length * 3.8;

    const afternoonLines = doc.splitTextToSize(`Afternoon: ${day.afternoonActivity}`, contentWidth);
    doc.text(afternoonLines, margin, y);
    y += afternoonLines.length * 3.8;

    const eveningLines = doc.splitTextToSize(`Evening: ${day.eveningActivity}`, contentWidth);
    doc.text(eveningLines, margin, y);
    y += eveningLines.length * 3.8;

    doc.setTextColor(71, 85, 105);
    const metaLine = doc.splitTextToSize(
      `Hotel: ${day.hotelSuggestion}  |  Transport: ${day.transportationMethod}  |  Dining: ${day.recommendedRestaurants.slice(0, 2).join(', ')}`,
      contentWidth
    );
    doc.text(metaLine, margin, y);
    doc.setTextColor(15, 23, 42);
    y += metaLine.length * 3.8 + 2;
  });

  // Section 4: Checklist & Packing Readiness
  ensureSpace(40);
  y += 4;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text('4. Essential Pre-Departure Checklist & Packing Summary', margin, y);
  y += 6;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  trip.checklist.forEach((item) => {
    ensureSpace(7);
    const status = item.completed ? '[COMPLETED]' : '[PENDING]  ';
    doc.text(`${status} ${item.category}: ${item.title}`, margin, y);
    y += 4.8;
  });

  const safeFileName = trip.name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

  doc.save(`${safeFileName || 'world-explorer-trip-plan'}.pdf`);
}
