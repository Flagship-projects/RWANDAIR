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
  {
    title: "Africa's Best Regional Airline",
    issuer: "Skytrax World Airline Awards",
    year: "2025",
    image: "/assets/awards/SKYT_Airline_2025.png",
  },
  {
    title: "Africa's Best Airline Staff",
    issuer: "Skytrax World Airline Awards",
    year: "2021",
    image: "/assets/awards/awards.png",
  },
  {
    title: "Diamond — Health & Safety",
    issuer: "APEX, powered by SimpliFlying",
    year: "2021",
    image: "/assets/awards/safety.png",
  },
];

export type LoyaltyTier = {
  name: string;
  index: string;
  threshold: string;
  bonus: string;
  headline: string;
  benefits: string[];
  material: string;
  /** Jewel accent used for glow, hairlines and light-sweeps in the dark vault. */
  accent: string;
};

// Sourced from RwandAir's DreamMiles loyalty program — four real tiers, real
// qualification thresholds and published benefits (no invented perks).
export const loyaltyTiers: LoyaltyTier[] = [
  {
    name: "Emerald",
    index: "01",
    threshold: "Entry tier · free to join",
    bonus: "Base earn rate",
    headline: "Every journey starts earning",
    benefits: [
      "Earn DreamMiles from your very first flight",
      "Redeem miles for award tickets & upgrades",
      "Lounge access and extra baggage using miles",
    ],
    material: "/assets/loyalty/emerald.jpg",
    accent: "#1fae7a",
  },
  {
    name: "Silver",
    index: "02",
    threshold: "25,000 tier miles · 20 sectors",
    bonus: "+25% bonus miles",
    headline: "The climb begins",
    benefits: [
      "25% bonus miles on every flight",
      "10kg extra baggage allowance",
      "Discounted seat selection",
      "Priority waitlist clearance",
    ],
    material: "/assets/loyalty/silver.jpg",
    accent: "#cdd7e6",
  },
  {
    name: "Gold",
    index: "03",
    threshold: "50,000 tier miles · 40 sectors",
    bonus: "+50% bonus miles",
    headline: "Travel, elevated",
    benefits: [
      "50% bonus miles on every flight",
      "23kg extra baggage, piece concept",
      "Priority check-in & boarding",
      "Complimentary lounge access",
      "Free seat selection",
    ],
    material: "/assets/loyalty/gold.jpg",
    accent: "#f7c623",
  },
  {
    name: "Diamond",
    index: "04",
    threshold: "100,000 tier miles · 60 sectors",
    bonus: "+100% bonus miles",
    headline: "The summit of DreamMiles",
    benefits: [
      "100% bonus miles on every flight",
      "32kg extra baggage, piece concept",
      "Priority check-in & boarding",
      "Lounge access with a guest",
      "Free seat selection",
      "Tier status extension up to 1 year",
    ],
    material: "/assets/loyalty/diamond.jpg",
    accent: "#a9d8ff",
  },
];

export const services = [
  { label: "Kigali Stopover", detail: "Break your journey in Kigali with a stopover program built for transiting passengers." },
  { label: "Cargo", detail: "Freight solutions connecting Africa with Europe, the Middle East and Asia." },
  { label: "Travel Insurance", detail: "Optional cover added at the point of booking." },
  { label: "eSIM & eVisa", detail: "Digital travel essentials arranged before you fly." },
];

// Grouped into three balanced columns (each stacking 2-3 sections), mirroring
// rwandair.com's real footer so no column wraps or dangles alone.
export const footerColumnGroups: { title: string; links: string[] }[][] = [
  [
    { title: "About us", links: ["Who we are", "Fleet"] },
    { title: "Business solutions", links: ["Cargo", "Cargo Tracking"] },
    { title: "Internal Links", links: ["Webmail", "Q-pulse"] },
  ],
  [
    { title: "Media Center", links: ["Inzozi", "Newsroom", "Gallery", "Travel alerts"] },
    {
      title: "Our policies",
      links: [
        "Terms & Conditions of carriage",
        "Terms & Conditions of use",
        "Private & Cookie Policy",
        "Terms & Conditions for Online Payment",
        "General rules for the US market",
        "ADM Policy",
        "GESE Policy",
      ],
    },
  ],
  [
    { title: "Connect with us", links: ["Careers", "Contact us", "Tenders"] },
    { title: "External links", links: ["Immigration and Emigration", "Rwanda Development Board", "Visit Rwanda"] },
  ],
];

export const socialLinks: { label: string; icon: "facebook" | "x" | "youtube" | "instagram" | "linkedin" | "tiktok"; href: string }[] = [
  { label: "Facebook", icon: "facebook", href: "https://web.facebook.com/FlyRwandAir/" },
  { label: "X", icon: "x", href: "https://x.com/FlyRwandAir" },
  { label: "YouTube", icon: "youtube", href: "https://www.youtube.com/user/flyrwandair" },
  { label: "Instagram", icon: "instagram", href: "https://www.instagram.com/flyrwandair/" },
  { label: "LinkedIn", icon: "linkedin", href: "https://www.linkedin.com/company/flyrwandair/" },
  { label: "TikTok", icon: "tiktok", href: "https://www.tiktok.com/@thisisflyrwandair" },
];
