import { NextResponse } from "next/server";

const partners = [
  {
    id: "global-forex",
    businessName: "Global Forex Pvt. Ltd.",
    licenseType: "AD_CATEGORY_I",
    verificationStatus: "VERIFIED",
    address: "T3, Delhi Airport",
    city: "Delhi",
    country: "India",
    latitude: 28.5562,
    longitude: 77.1,
    contactPhone: "+911145551010",
    openingHours: "08:00 - 22:00",
    supportsPickup: true,
    supportsDelivery: false,
    rating: 4.8,
    rates: { EUR: 91.32, USD: 83.44, GBP: 106.12, AED: 22.83, SGD: 62.2, THB: 2.42, JPY: 0.57 }
  },
  {
    id: "travel-currency",
    businessName: "Travel Currency Exchange",
    licenseType: "FFMC",
    verificationStatus: "VERIFIED",
    address: "Connaught Place, Delhi",
    city: "Delhi",
    country: "India",
    latitude: 28.6315,
    longitude: 77.2167,
    contactPhone: "+911145552020",
    openingHours: "09:00 - 20:00",
    supportsPickup: true,
    supportsDelivery: true,
    rating: 4.6,
    rates: { EUR: 90.83, USD: 83.21, GBP: 105.76, AED: 22.71, SGD: 62.45, THB: 2.39, JPY: 0.58 }
  },
  {
    id: "world-forex",
    businessName: "World Forex Services",
    licenseType: "AD_CATEGORY_II",
    verificationStatus: "VERIFIED",
    address: "Aerocity, Delhi",
    city: "Delhi",
    country: "India",
    latitude: 28.5483,
    longitude: 77.1217,
    contactPhone: "+911145553030",
    openingHours: "09:30 - 21:00",
    supportsPickup: true,
    supportsDelivery: false,
    rating: 4.5,
    rates: { EUR: 90.43, USD: 82.98, GBP: 105.11, AED: 22.62, SGD: 62.8, THB: 2.62, JPY: 0.59 }
  },
  {
    id: "unimoni-india",
    businessName: "Unimoni India",
    licenseType: "TRAVEL_FOREX_PARTNER",
    verificationStatus: "VERIFIED",
    address: "Bandra Kurla Complex, Mumbai",
    city: "Mumbai",
    country: "India",
    latitude: 19.0669,
    longitude: 72.8675,
    contactPhone: "+912245551010",
    openingHours: "10:00 - 19:00",
    supportsPickup: true,
    supportsDelivery: true,
    rating: 4.4,
    rates: { EUR: 91.05, USD: 83.36, GBP: 105.91, AED: 22.78, SGD: 62.35, THB: 2.44, JPY: 0.61 }
  }
];

const cityCoordinates: Record<string, { latitude: number; longitude: number }> = {
  delhi: { latitude: 28.6139, longitude: 77.209 },
  "delhi ncr": { latitude: 28.6139, longitude: 77.209 },
  mumbai: { latitude: 19.076, longitude: 72.8777 },
  bengaluru: { latitude: 12.9716, longitude: 77.5946 },
  bangalore: { latitude: 12.9716, longitude: 77.5946 }
};

function distanceKm(from: { latitude: number; longitude: number }, to: { latitude: number; longitude: number }) {
  const toRad = (value: number) => (value * Math.PI) / 180;
  const earthKm = 6371;
  const dLat = toRad(to.latitude - from.latitude);
  const dLng = toRad(to.longitude - from.longitude);
  const lat1 = toRad(from.latitude);
  const lat2 = toRad(to.latitude);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return 2 * earthKm * Math.asin(Math.sqrt(h));
}

export function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const currency = (searchParams.get("currency") ?? "EUR").toUpperCase();
  const city = (searchParams.get("city") ?? "Delhi").toLowerCase();
  const lat = Number(searchParams.get("lat"));
  const lng = Number(searchParams.get("lng"));
  const origin = Number.isFinite(lat) && Number.isFinite(lng)
    ? { latitude: lat, longitude: lng }
    : cityCoordinates[city] ?? cityCoordinates.delhi;

  const data = partners
    .filter((partner) => partner.verificationStatus === "VERIFIED")
    .map((partner) => {
      const sellRate = partner.rates[currency as keyof typeof partner.rates] ?? partner.rates.EUR;
      const distance = distanceKm(origin, { latitude: partner.latitude, longitude: partner.longitude });
      return {
        ...partner,
        sourceCurrency: currency,
        targetCurrency: "INR",
        sellRate,
        serviceFee: partner.supportsDelivery ? 780 : 220,
        distanceKm: Number(distance.toFixed(2)),
        suspicious: Math.abs(sellRate - 91) / 91 > 0.08,
        complianceNotice: "RoamFX lists only verified authorised partners. No peer-to-peer cash exchange is supported."
      };
    })
    .sort((a, b) => a.distanceKm - b.distanceKm);

  return NextResponse.json({
    success: true,
    message: "Nearby verified forex partners loaded",
    data,
    errorCode: null,
    timestamp: new Date().toISOString()
  });
}
