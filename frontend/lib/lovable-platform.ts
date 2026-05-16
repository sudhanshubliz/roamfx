export type ServiceType = "buy" | "sell" | "card" | "send" | "student" | "bundle";

export type FlightPrediction = "buy_now" | "wait" | "may_rise" | "may_drop";

export type FlightDeal = {
  id: string;
  airline: string;
  airlineCode: string;
  fromCode: string;
  toCode: string;
  departure: string;
  arrival: string;
  duration: string;
  stops: number;
  baggage: string;
  refundable: boolean;
  price: number;
  dealScore: number;
  couponEligible: boolean;
  prediction: FlightPrediction;
  predictionConfidence: number;
};

export type PartnerQuote = {
  id: string;
  name: string;
  licenseType: string;
  rating: number;
  rate: number;
  serviceFee: number;
  deliveryFee: number;
  deliveryTime: string;
  badges: string[];
};

export const flightDeals: FlightDeal[] = [
  { id: "f_ek_dxb", airline: "Emirates", airlineCode: "EK", fromCode: "DEL", toCode: "DXB", departure: "08:10", arrival: "10:20", duration: "4h 10m", stops: 0, baggage: "30kg + 7kg cabin", refundable: true, price: 22400, dealScore: 95, couponEligible: true, prediction: "buy_now", predictionConfidence: 92 },
  { id: "f_ai_dxb", airline: "Air India", airlineCode: "AI", fromCode: "DEL", toCode: "DXB", departure: "11:30", arrival: "13:45", duration: "3h 55m", stops: 0, baggage: "25kg + 7kg cabin", refundable: false, price: 24150, dealScore: 88, couponEligible: true, prediction: "may_rise", predictionConfidence: 84 },
  { id: "f_sq_sin", airline: "Singapore Airlines", airlineCode: "SQ", fromCode: "DEL", toCode: "SIN", departure: "21:10", arrival: "05:20", duration: "5h 40m", stops: 0, baggage: "30kg + 7kg cabin", refundable: true, price: 29800, dealScore: 90, couponEligible: false, prediction: "wait", predictionConfidence: 78 },
  { id: "f_tg_bkk", airline: "Thai Airways", airlineCode: "TG", fromCode: "DEL", toCode: "BKK", departure: "03:30", arrival: "09:15", duration: "4h 15m", stops: 0, baggage: "25kg + 7kg cabin", refundable: true, price: 19850, dealScore: 93, couponEligible: true, prediction: "may_drop", predictionConfidence: 76 }
];

export const checkoutPartners: PartnerQuote[] = [
  { id: "p_global", name: "Global Forex Pvt. Ltd.", licenseType: "AD-I", rating: 4.8, rate: 84.12, serviceFee: 0, deliveryFee: 0, deliveryTime: "Same day", badges: ["Best Value"] },
  { id: "p_travel_currency", name: "Travel Currency Exchange", licenseType: "FFMC", rating: 4.6, rate: 84.18, serviceFee: 50, deliveryFee: 0, deliveryTime: "Next day", badges: ["Lowest Fee"] },
  { id: "p_world_forex", name: "World Forex Services", licenseType: "AD-II", rating: 4.5, rate: 84.21, serviceFee: 75, deliveryFee: 100, deliveryTime: "2 hours", badges: ["Fastest Delivery"] },
  { id: "p_unimoni", name: "Unimoni India", licenseType: "Travel forex partner", rating: 4.4, rate: 84.25, serviceFee: 100, deliveryFee: 150, deliveryTime: "Same day", badges: [] }
];

export const coupons = [
  { code: "ROAMFIRST", title: "5% off first order", detail: "Max saving Rs 500" },
  { code: "STUDENTFX", title: "Student remittance discount", detail: "Education purpose flows" },
  { code: "FAMILYTRIP", title: "Family travel discount", detail: "3+ travellers" },
  { code: "FLIGHTFX", title: "Flight + forex bundle", detail: "Bundle-only saving" },
  { code: "AIRPORTSAVE", title: "Airport pickup saving", detail: "Airport pickup orders" }
];

export function applyDemoCoupon(code: string, service: ServiceType, total: number) {
  const normalized = code.trim().toUpperCase();
  if (!normalized) return { ok: false, error: "Enter a coupon code" };
  if (normalized === "ROAMFIRST") return { ok: true, discount: Math.min(500, Math.round(total * 0.05)) };
  if (normalized === "FLIGHTFX" && service === "bundle") return { ok: true, discount: Math.min(1500, Math.round(total * 0.08)) };
  if (normalized === "STUDENTFX" && (service === "student" || service === "send")) return { ok: true, discount: 750 };
  if (normalized === "FAMILYTRIP" && total >= 50000) return { ok: true, discount: 1000 };
  if (normalized === "AIRPORTSAVE") return { ok: true, discount: 250 };
  return { ok: false, error: "Coupon not valid for this service or amount" };
}
