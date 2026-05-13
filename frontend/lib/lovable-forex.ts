export type LovableCurrency = {
  code: string;
  name: string;
  flag: string;
  buy: number;
  sell: number;
  card: number;
  transfer: number;
};

export const lovableCurrencies: LovableCurrency[] = [
  { code: "USD", name: "US Dollar", flag: "🇺🇸", buy: 84.12, sell: 83.05, card: 84.45, transfer: 84.21 },
  { code: "EUR", name: "Euro", flag: "🇪🇺", buy: 91.38, sell: 90.12, card: 91.62, transfer: 91.45 },
  { code: "GBP", name: "British Pound", flag: "🇬🇧", buy: 106.74, sell: 105.32, card: 107.10, transfer: 106.85 },
  { code: "AED", name: "UAE Dirham", flag: "🇦🇪", buy: 22.91, sell: 22.55, card: 23.02, transfer: 22.96 },
  { code: "CAD", name: "Canadian Dollar", flag: "🇨🇦", buy: 60.21, sell: 59.45, card: 60.41, transfer: 60.28 },
  { code: "AUD", name: "Australian Dollar", flag: "🇦🇺", buy: 55.32, sell: 54.62, card: 55.51, transfer: 55.38 },
  { code: "SGD", name: "Singapore Dollar", flag: "🇸🇬", buy: 62.85, sell: 62.10, card: 63.05, transfer: 62.91 },
  { code: "JPY", name: "Japanese Yen", flag: "🇯🇵", buy: 0.54, sell: 0.53, card: 0.55, transfer: 0.54 },
  { code: "THB", name: "Thai Baht", flag: "🇹🇭", buy: 2.46, sell: 2.41, card: 2.48, transfer: 2.47 }
];

export const lovableCities = ["Delhi", "Mumbai", "Bengaluru", "Hyderabad", "Chennai", "Pune", "Kolkata", "Ahmedabad", "Kochi"];

export const lovablePartners = [
  { name: "Global Forex Pvt. Ltd.", rate: 84.12, charges: 0, delivery: "Same day", badge: "Verified AD-I" },
  { name: "Travel Currency Exchange", rate: 84.18, charges: 50, delivery: "Next day", badge: "Verified FFMC" },
  { name: "World Forex Services", rate: 84.25, charges: 100, delivery: "Same day", badge: "Verified AD-II" },
  { name: "Unimoni India", rate: 84.21, charges: 75, delivery: "2 hours", badge: "Verified partner" }
];
