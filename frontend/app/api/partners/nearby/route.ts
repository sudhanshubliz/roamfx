import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

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

type Origin = { latitude: number; longitude: number; label?: string };

type GooglePlace = {
  place_id: string;
  name: string;
  vicinity?: string;
  formatted_address?: string;
  business_status?: string;
  geometry?: { location?: { lat: number; lng: number } };
  rating?: number;
  user_ratings_total?: number;
  opening_hours?: { open_now?: boolean };
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

function envelope(success: boolean, message: string, data: unknown, errorCode: string | null = null, status = 200) {
  return NextResponse.json({
    success,
    message,
    data,
    errorCode,
    timestamp: new Date().toISOString()
  }, { status });
}

async function geocodeCity(city: string, apiKey: string): Promise<Origin | null> {
  if (!city.trim()) {
    return null;
  }

  const url = new URL("https://maps.googleapis.com/maps/api/geocode/json");
  url.searchParams.set("address", city);
  url.searchParams.set("key", apiKey);

  const response = await fetch(url, { cache: "no-store" });
  const payload = await response.json() as {
    status?: string;
    error_message?: string;
    results?: Array<{ formatted_address?: string; geometry?: { location?: { lat: number; lng: number } } }>;
  };

  if (!response.ok || (payload.status && !["OK", "ZERO_RESULTS"].includes(payload.status))) {
    throw new Error(payload.error_message ?? payload.status ?? "Google Geocoding request failed");
  }

  const location = payload.results?.[0]?.geometry?.location;
  if (!location) {
    return null;
  }

  return {
    latitude: location.lat,
    longitude: location.lng,
    label: payload.results?.[0]?.formatted_address ?? city
  };
}

async function fetchGoogleCurrencyExchangePlaces(origin: Origin, apiKey: string) {
  const radius = Math.min(Math.max(Number(process.env.GOOGLE_PLACES_RADIUS_METERS ?? 8000), 1000), 50000);
  const url = new URL("https://maps.googleapis.com/maps/api/place/nearbysearch/json");
  url.searchParams.set("location", `${origin.latitude},${origin.longitude}`);
  url.searchParams.set("radius", String(radius));
  url.searchParams.set("type", "currency_exchange");
  url.searchParams.set("key", apiKey);

  const response = await fetch(url, { cache: "no-store" });
  const payload = await response.json() as { status?: string; error_message?: string; results?: GooglePlace[] };

  if (!response.ok || (payload.status && !["OK", "ZERO_RESULTS"].includes(payload.status))) {
    throw new Error(payload.error_message ?? payload.status ?? "Google Places request failed");
  }

  return (payload.results ?? [])
    .filter((place) => place.geometry?.location)
    .slice(0, 12)
    .map((place) => {
      const latitude = place.geometry?.location?.lat ?? origin.latitude;
      const longitude = place.geometry?.location?.lng ?? origin.longitude;
      const address = place.vicinity ?? place.formatted_address ?? "Address available in Google Maps";
      const mapsUrl = new URL("https://www.google.com/maps/search/");
      mapsUrl.searchParams.set("api", "1");
      mapsUrl.searchParams.set("query", place.name);
      mapsUrl.searchParams.set("query_place_id", place.place_id);

      return {
        id: `google-${place.place_id}`,
        placeId: place.place_id,
        businessName: place.name,
        source: "GOOGLE_PLACES",
        licenseType: "UNKNOWN",
        verificationStatus: "GOOGLE_LISTING_UNVERIFIED",
        canBookOnRoamFX: false,
        address,
        city: origin.label ?? "Nearby",
        country: "India",
        latitude,
        longitude,
        contactPhone: null,
        openingHours: place.opening_hours?.open_now === undefined ? "See Google Maps" : place.opening_hours.open_now ? "Open now" : "May be closed",
        supportsPickup: true,
        supportsDelivery: false,
        rating: place.rating ?? null,
        userRatingsTotal: place.user_ratings_total ?? null,
        distanceKm: Number(distanceKm(origin, { latitude, longitude }).toFixed(2)),
        suspicious: false,
        mapsUrl: mapsUrl.toString(),
        complianceNotice: "Google listings are informational only. Book forex on RoamFX only through verified authorised partners after KYC and partner acceptance."
      };
    });
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const currency = (searchParams.get("currency") ?? "EUR").toUpperCase();
  const rawCity = searchParams.get("city") ?? "Delhi";
  const city = rawCity.toLowerCase();
  const latParam = searchParams.get("lat");
  const lngParam = searchParams.get("lng");
  const lat = latParam === null ? NaN : Number(latParam);
  const lng = lngParam === null ? NaN : Number(lngParam);
  const apiKey = process.env.GOOGLE_MAPS_API_KEY;
  let googleMessage = "";
  let googlePlaces: Awaited<ReturnType<typeof fetchGoogleCurrencyExchangePlaces>> = [];
  let origin: Origin = latParam !== null && lngParam !== null && Number.isFinite(lat) && Number.isFinite(lng)
    ? { latitude: lat, longitude: lng }
    : cityCoordinates[city] ?? cityCoordinates.delhi;

  if (apiKey) {
    try {
      if ((latParam === null || lngParam === null) && !cityCoordinates[city]) {
        origin = await geocodeCity(rawCity, apiKey) ?? origin;
      }
      googlePlaces = await fetchGoogleCurrencyExchangePlaces(origin, apiKey);
      googleMessage = googlePlaces.length > 0
        ? " Google Places live currency-exchange listings included for discovery."
        : " Google Places returned no nearby currency-exchange listings for this location.";
    } catch (error) {
      googleMessage = ` Google Places is temporarily unavailable: ${error instanceof Error ? error.message : "unknown error"}.`;
    }
  } else {
    googleMessage = " Google Places is not configured; set GOOGLE_MAPS_API_KEY on the server to enable live nearby listings.";
  }

  const verifiedPartners = partners
    .filter((partner) => partner.verificationStatus === "VERIFIED")
    .map((partner) => {
      const sellRate = partner.rates[currency as keyof typeof partner.rates] ?? partner.rates.EUR;
      const distance = distanceKm(origin, { latitude: partner.latitude, longitude: partner.longitude });
      return {
        ...partner,
        source: "ROAMFX_VERIFIED_PARTNER",
        canBookOnRoamFX: true,
        sourceCurrency: currency,
        targetCurrency: "INR",
        sellRate,
        serviceFee: partner.supportsDelivery ? 780 : 220,
        distanceKm: Number(distance.toFixed(2)),
        suspicious: Math.abs(sellRate - 91) / 91 > 0.08,
        mapsUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${partner.businessName}, ${partner.address}`)}`,
        complianceNotice: "RoamFX lists only verified authorised partners. No peer-to-peer cash exchange is supported."
      };
    })
    .sort((a, b) => a.distanceKm - b.distanceKm);

  const data = [...verifiedPartners, ...googlePlaces].sort((a, b) => a.distanceKm - b.distanceKm);

  return envelope(true, `Nearby forex discovery loaded.${googleMessage}`, data);
}
