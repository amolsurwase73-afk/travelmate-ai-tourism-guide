export type TravelStyle = 'Luxury' | 'Budget' | 'Adventure' | 'Family' | 'Solo';

export type InterestType = 'Nature' | 'History' | 'Food' | 'Shopping' | 'Temples' | 'Beaches' | 'Wildlife';

export interface TripPlannerInput {
  destination: string;
  startDate: string;
  endDate: string;
  durationDays: number;
  travelersCount: number;
  budgetLevel: 'Budget' | 'Moderate' | 'Luxury';
  currency: string;
  travelStyle: TravelStyle;
  interests: InterestType[];
}

export interface DayItinerarySlot {
  title: string;
  description: string;
  location: string;
  time: string;
  duration: string;
  estimatedCost: string;
  tip: string;
}

export interface DayItinerary {
  dayNumber: number;
  title: string;
  morning: DayItinerarySlot;
  afternoon: DayItinerarySlot;
  evening: DayItinerarySlot;
  night?: DayItinerarySlot;
}

export interface AttractionItem {
  id: string;
  name: string;
  category: 'top_attraction' | 'hidden_gem' | 'historical' | 'adventure' | 'family_friendly' | 'free';
  description: string;
  openingHours: string;
  suggestedDuration: string;
  entryFee: string;
  highlights: string[];
  insiderTip: string;
}

export interface FamousDish {
  name: string;
  description: string;
  vegOrNonVeg: 'Veg' | 'Non-Veg' | 'Vegan' | 'Both';
  priceRange: string;
  whereToTry: string;
}

export interface RestaurantItem {
  name: string;
  cuisine: string;
  type: 'Budget' | 'Fine Dining' | 'Local Street Food';
  address: string;
  priceRange: string;
  signatureDish: string;
}

export interface StreetFoodSpot {
  spotName: string;
  famousFor: string;
  budgetLevel: string;
  hygieneTip: string;
}

export interface DessertItem {
  name: string;
  description: string;
}

export interface FoodGuide {
  famousDishes: FamousDish[];
  topRestaurants: RestaurantItem[];
  streetFoodSpots: StreetFoodSpot[];
  vegetarianOptions: string[];
  desserts: DessertItem[];
}

export interface BudgetCostItem {
  estimatedTotal: number;
  details: string;
}

export interface BudgetBreakdown {
  currency: string;
  currencySymbol: string;
  hotelCost: BudgetCostItem;
  foodExpenses: BudgetCostItem;
  localTransport: BudgetCostItem;
  entryTickets: BudgetCostItem;
  shoppingBudget: BudgetCostItem;
  emergencyBudget: BudgetCostItem;
  grandTotalCost: BudgetCostItem;
  costSavingTips: string[];
}

export interface TravelTips {
  safetyTips: string[];
  localCustoms: string[];
  weatherAdvice: string;
  commonScamsToAvoid: string[];
  publicTransportTips: string[];
}

export interface EmergencyInfo {
  policeNumber: string;
  ambulanceNumber: string;
  touristHelpline: string;
  embassyOrLocalAssistance: string;
  nearbyHospitals: string[];
}

export interface PackingCategory {
  category: string;
  items: string[];
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface DestinationOverview {
  name: string;
  tagline: string;
  description: string;
  bestTimeToVisit: string;
  estimatedTravelTime: string;
  currencySymbol: string;
  recommendedDuration: string;
}

export interface TravelGuideData {
  id: string;
  createdAt: string;
  inputs: TripPlannerInput;
  overview: DestinationOverview;
  itinerary: DayItinerary[];
  attractions: AttractionItem[];
  foodGuide: FoodGuide;
  budgetBreakdown: BudgetBreakdown;
  travelTips: TravelTips;
  emergencyInfo: EmergencyInfo;
  packingChecklist: PackingCategory[];
  faqs: FAQItem[];
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
}
