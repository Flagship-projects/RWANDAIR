export type Destination = {
  city: string;
  country: string;
  code: string;
  region: "East Africa" | "Central Africa" | "West Africa" | "Southern Africa" | "Europe" | "Middle East";
  lat: number;
  lon: number;
  hub?: boolean;
};

// Sourced from RwandAir's published route network — no invented destinations.
export const destinations: Destination[] = [
  // East Africa
  { city: "Kigali", country: "Rwanda", code: "KGL", region: "East Africa", lat: -1.9686, lon: 30.1395, hub: true },
  { city: "Kamembe", country: "Rwanda", code: "KME", region: "East Africa", lat: -2.4678, lon: 28.9075 },
  { city: "Entebbe", country: "Uganda", code: "EBB", region: "East Africa", lat: 0.0424, lon: 32.4435 },
  { city: "Nairobi", country: "Kenya", code: "NBO", region: "East Africa", lat: -1.3192, lon: 36.9278 },
  { city: "Mombasa", country: "Kenya", code: "MBA", region: "East Africa", lat: -4.0348, lon: 39.5942 },
  { city: "Kilimanjaro", country: "Tanzania", code: "JRO", region: "East Africa", lat: -3.4294, lon: 37.0745 },
  { city: "Dar es Salaam", country: "Tanzania", code: "DAR", region: "East Africa", lat: -6.8781, lon: 39.2026 },
  { city: "Juba", country: "South Sudan", code: "JUB", region: "East Africa", lat: 4.8720, lon: 31.6011 },
  { city: "Addis Ababa", country: "Ethiopia", code: "ADD", region: "East Africa", lat: 8.9779, lon: 38.7993 },
  // Central Africa
  { city: "Bujumbura", country: "Burundi", code: "BJM", region: "Central Africa", lat: -3.3240, lon: 29.3186 },
  { city: "Bangui", country: "Central African Republic", code: "BGF", region: "Central Africa", lat: 4.3985, lon: 18.5182 },
  { city: "Brazzaville", country: "Congo", code: "BZV", region: "Central Africa", lat: -4.2517, lon: 15.2530 },
  { city: "Kinshasa", country: "DR Congo", code: "FIH", region: "Central Africa", lat: -4.3857, lon: 15.4446 },
  { city: "Douala", country: "Cameroon", code: "DLA", region: "Central Africa", lat: 4.0061, lon: 9.7195 },
  { city: "Libreville", country: "Gabon", code: "LBV", region: "Central Africa", lat: 0.4586, lon: 9.4123 },
  // West Africa
  { city: "Lagos", country: "Nigeria", code: "LOS", region: "West Africa", lat: 6.5774, lon: 3.3212 },
  { city: "Abuja", country: "Nigeria", code: "ABV", region: "West Africa", lat: 9.0067, lon: 7.2632 },
  { city: "Accra", country: "Ghana", code: "ACC", region: "West Africa", lat: 5.6052, lon: -0.1668 },
  { city: "Cotonou", country: "Benin", code: "COO", region: "West Africa", lat: 6.3572, lon: 2.3844 },
  { city: "Abidjan", country: "Ivory Coast", code: "ABJ", region: "West Africa", lat: 5.2614, lon: -3.9263 },
  { city: "Conakry", country: "Guinea", code: "CKY", region: "West Africa", lat: 9.5769, lon: -13.6120 },
  { city: "Bamako", country: "Mali", code: "BKO", region: "West Africa", lat: 12.5335, lon: -7.9499 },
  // Southern Africa
  { city: "Johannesburg", country: "South Africa", code: "JNB", region: "Southern Africa", lat: -26.1392, lon: 28.246 },
  { city: "Cape Town", country: "South Africa", code: "CPT", region: "Southern Africa", lat: -33.9648, lon: 18.6017 },
  { city: "Harare", country: "Zimbabwe", code: "HRE", region: "Southern Africa", lat: -17.9318, lon: 31.0928 },
  { city: "Lusaka", country: "Zambia", code: "LUN", region: "Southern Africa", lat: -15.3308, lon: 28.4526 },
  // Europe
  { city: "London", country: "United Kingdom", code: "LHR", region: "Europe", lat: 51.4700, lon: -0.4543 },
  { city: "Paris", country: "France", code: "CDG", region: "Europe", lat: 49.0097, lon: 2.5479 },
  { city: "Brussels", country: "Belgium", code: "BRU", region: "Europe", lat: 50.9014, lon: 4.4844 },
  // Middle East
  { city: "Dubai", country: "United Arab Emirates", code: "DXB", region: "Middle East", lat: 25.2532, lon: 55.3657 },
  { city: "Doha", country: "Qatar", code: "DOH", region: "Middle East", lat: 25.2609, lon: 51.6138 },
];

export const navLinks = [
  { label: "Book & Travel", href: "#book" },
  { label: "Destinations & Offers", href: "#destinations" },
  { label: "Experience & Info", href: "#experience" },
  { label: "Loyalty", href: "#loyalty" },
  { label: "Holidays", href: "#holidays" },
];

export const fleet = [
  {
    name: "Airbus A330-200",
    role: "Long-haul flagship",
    detail: "The backbone of RwandAir's long-haul network, connecting Kigali to Europe, the Middle East and beyond in Economy and Business Class comfort.",
  },
  {
    name: "Airbus A330-300",
    role: "High-capacity long-haul",
    detail: "A stretched sister to the A330-200, deployed on RwandAir's busiest long-haul corridors with the same two-cabin experience.",
  },
];

export const cabins = [
  {
    name: "Economy Class",
    points: ["Ergonomic seating across the network", "Curated in-flight dining", "Personal entertainment on long-haul routes"],
  },
  {
    name: "Business Class",
    points: ["Lie-flat comfort on long-haul aircraft", "Priority check-in and boarding", "Elevated dining and dedicated service"],
  },
];

export const awards = [
  "Africa's Best Regional Airline — 2025",
  "Africa's Best Airline Staff",
  "APEX Diamond Award for Health & Safety",
];

export const loyaltyTiers = [
  {
    tier: "Member",
    benefit: "Earn DreamMiles on every RwandAir flight from your very first trip.",
  },
  {
    tier: "Silver / Gold / Platinum",
    benefit: "Unlock cabin upgrades, extra baggage allowance and priority services as your miles grow.",
  },
  {
    tier: "Partner Network",
    benefit: "Redeem DreamMiles for free tickets and offers across RwandAir's partner airlines.",
  },
];

export const services = [
  { label: "Kigali Stopover", detail: "Break your journey in Kigali with a stopover program built for transiting passengers." },
  { label: "Cargo", detail: "Freight solutions connecting Africa with Europe, the Middle East and Asia." },
  { label: "Travel Insurance", detail: "Optional cover added at the point of booking." },
  { label: "eSIM & eVisa", detail: "Digital travel essentials arranged before you fly." },
];

export const footerColumns = [
  {
    title: "Book & Travel",
    links: ["Book a flight", "Manage booking", "Check-in", "Flight schedules", "Hotels & cars"],
  },
  {
    title: "Destinations & Offers",
    links: ["Where we fly", "Route map", "Latest offers", "Holidays"],
  },
  {
    title: "Experience & Info",
    links: ["Before you fly", "Baggage", "Onboard", "Restricted items"],
  },
  {
    title: "Loyalty",
    links: ["DreamMiles", "Tiers & benefits", "Partner offers"],
  },
];

export const socialLinks = ["Facebook", "X", "Instagram", "LinkedIn", "YouTube", "TikTok"];
