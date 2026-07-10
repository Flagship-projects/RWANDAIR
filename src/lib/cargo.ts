// RwandAir Cargo content — sourced from RwandAir's published cargo operations.
// No invented services; figures reflect publicly reported operations (2024–2025).

export type CargoService = {
  code: string;
  title: string;
  blurb: string;
};

export const cargoServices: CargoService[] = [
  {
    code: "01",
    title: "General Cargo",
    blurb:
      "Everyday freight moved reliably across our passenger network — from documents and parcels to industrial goods.",
  },
  {
    code: "02",
    title: "Perishables",
    blurb:
      "Flowers, fruit, vegetables, meat and fresh fish, carried farm-fresh from the region to Europe, the UK and the Gulf.",
  },
  {
    code: "03",
    title: "Pharmaceuticals",
    blurb:
      "Temperature-controlled cold-chain handling for medicines and vaccines, with tight control of ground dwell times.",
  },
  {
    code: "04",
    title: "Live Animals",
    blurb:
      "Careful, welfare-first transport of live animals under IATA Live Animals Regulations.",
  },
  {
    code: "05",
    title: "Dangerous Goods",
    blurb:
      "Hazardous materials accepted under the IATA Dangerous Goods Regulations — every category except radioactive.",
  },
  {
    code: "06",
    title: "Valuable Cargo",
    blurb:
      "Secure, monitored handling for high-value and vulnerable shipments from origin to destination.",
  },
];

export const cargoStats = [
  { value: 31, label: "Destinations reachable", suffix: "" },
  { value: 3, label: "Continents served", suffix: "" },
  { value: 24, label: "Farm to table", suffix: "h" },
  { value: 6, label: "Africa–Europe growth, H1 2025", suffix: "%" },
];

export const cargoFacts = {
  hub: {
    title: "Kigali — the heart of Africa",
    body: "Positioned at the centre of the continent and away from the world's most congested trade corridors, Kigali is the shortest path between where things grow and where the world needs them.",
  },
  freighter: {
    title: "A growing freighter fleet",
    body: "In 2024 RwandAir launched dedicated freighter services to Dubai and Djibouti with a Boeing 737-800 converted freighter, complementing belly-hold capacity across the passenger network.",
  },
  coldChain:
    "From a Rwandan farm to a European table in under twenty-four hours.",
};
