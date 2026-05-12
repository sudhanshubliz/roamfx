export const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "";

export type Role = "TRAVELLER" | "PARTNER_ADMIN" | "PLATFORM_ADMIN";

export type User = {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  country: string;
  role: Role;
  kycStatus: "NOT_STARTED" | "PENDING" | "VERIFIED";
};

export type RateView = {
  id: string;
  partnerId: string;
  partnerName: string;
  sourceCurrency: string;
  targetCurrency: string;
  buyRate: number;
  sellRate: number;
  midMarketRate: number;
  serviceFee: number;
  availableAmount: number;
  lastUpdatedAt: string;
  suspicious: boolean;
  freshness: string;
  rating: number;
  supportsDelivery: boolean;
};

export type Partner = {
  id: string;
  businessName: string;
  licenseType: string;
  verificationStatus: "VERIFIED" | "PENDING" | "REJECTED";
  city: string;
  country: string;
  rating: number;
  supportsDelivery: boolean;
  supportsPickup: boolean;
  supportsDigitalPayment: boolean;
  openingHours: string;
  contactPhone?: string;
  address?: string;
  latitude?: number;
  longitude?: number;
};

export type KycDocumentView = {
  id: string;
  bookingId?: string;
  documentType: "PASSPORT" | "PAN" | "VISA" | "FLIGHT_TICKET" | "ADDRESS_PROOF" | "CURRENCY_DECLARATION_FORM" | "OTHER";
  fileName: string;
  fileUrl: string;
  verificationStatus: "UPLOADED" | "UNDER_REVIEW" | "VERIFIED" | "REJECTED";
  rejectionReason?: string;
  createdAt: string;
  nextAction: string;
};

export type NearbyPartner = Partner & {
  distanceKm: number;
  bestSellRate: number;
  serviceFee: number;
  availableAmount: number;
  freshness: string;
  fulfilmentMode: string;
  suspicious: boolean;
};

export type Booking = {
  id: string;
  bookingReference: string;
  partner: Partner;
  bookingType: "BUY_FOREX" | "SELL_LEFTOVER_FOREX";
  sourceCurrency: string;
  targetCurrency: string;
  sourceAmount: number;
  targetAmountEstimate?: number;
  lockedRate?: number;
  midMarketRate?: number;
  spreadAmount?: number;
  markupAmount?: number;
  serviceFee?: number;
  taxes?: number;
  fulfilmentFee?: number;
  totalPayable: number;
  payoutAmount?: number;
  settlementState?: "NOT_REQUIRED" | "PENDING" | "INITIATED" | "SETTLED" | "FAILED";
  cancellationOutcome?: "NO_CHARGE" | "FEE_APPLIED" | "REFUND_PENDING" | "REFUNDED" | "NOT_ALLOWED";
  status:
    | "CREATED"
    | "KYC_PENDING"
    | "PARTNER_REVIEW"
    | "RATE_LOCKED"
    | "PAYMENT_PENDING"
    | "CONFIRMED"
    | "CANCELLED"
    | "EXPIRED";
  rateLockExpiresAt: string;
  payoutEta?: string;
};

export type QuoteBreakdown = {
  lockedRate: number;
  midMarketRate: number;
  fxAmount: number;
  spreadAmount: number;
  markupAmount: number;
  serviceFee: number;
  taxes: number;
  fulfilmentFee: number;
  totalPayable: number;
  payoutAmount: number;
  kycRequired: boolean;
  cashAllowed: boolean;
  rateLockExpiresAt: string;
  payoutEta: string;
  complianceNotice: string;
};

export type TravelMoneyPlan = {
  recommendedCashAmount: number;
  recommendedCardAmount: number;
  suggestedDenominations: string[];
  dailyBudgetEstimate: number;
  emergencyCashSuggestion: number;
  airportExchangeWarning: string;
  atmUsageAdvice: string;
  cardAcceptanceAdvice: string;
  scamWarnings: string[];
  countrySpecificTips: string[];
  checklist: string[];
  confidenceScore: number;
  disclaimer: string;
  provider: string;
};

type ApiEnvelope<T> = {
  success: boolean;
  message: string;
  data: T;
  errorCode: string | null;
  timestamp: string;
};

const now = () => new Date().toISOString();

export const demoUsers: Record<string, User & { password: string }> = {
  "traveller@roamfx.app": {
    id: "usr_traveller",
    fullName: "Aarav Sharma",
    email: "traveller@roamfx.app",
    password: "password123",
    phone: "+91 98765 43210",
    country: "India",
    role: "TRAVELLER",
    kycStatus: "PENDING"
  },
  "partner@roamfx.app": {
    id: "usr_partner",
    fullName: "Delhi Forex Hub Admin",
    email: "partner@roamfx.app",
    password: "password123",
    phone: "+91 98111 11111",
    country: "India",
    role: "PARTNER_ADMIN",
    kycStatus: "VERIFIED"
  },
  "admin@roamfx.app": {
    id: "usr_admin",
    fullName: "RoamFX Admin",
    email: "admin@roamfx.app",
    password: "password123",
    phone: "+91 90000 00000",
    country: "India",
    role: "PLATFORM_ADMIN",
    kycStatus: "VERIFIED"
  }
};

export const demoPartners: Partner[] = [
  {
    id: "global-forex",
    businessName: "Global Forex Pvt. Ltd.",
    licenseType: "AD_CATEGORY_I",
    verificationStatus: "VERIFIED",
    city: "Delhi",
    country: "India",
    rating: 4.8,
    supportsDelivery: false,
    supportsPickup: true,
    supportsDigitalPayment: true,
    openingHours: "08:00 - 22:00",
    contactPhone: "+911145551010",
    address: "T3, Delhi Airport",
    latitude: 28.5562,
    longitude: 77.1
  },
  {
    id: "travel-currency",
    businessName: "Travel Currency Exchange",
    licenseType: "FFMC",
    verificationStatus: "VERIFIED",
    city: "Delhi",
    country: "India",
    rating: 4.6,
    supportsDelivery: true,
    supportsPickup: true,
    supportsDigitalPayment: true,
    openingHours: "09:00 - 20:00",
    contactPhone: "+911145552020",
    address: "Connaught Place, Delhi",
    latitude: 28.6315,
    longitude: 77.2167
  },
  {
    id: "world-forex",
    businessName: "World Forex Services",
    licenseType: "AD_CATEGORY_II",
    verificationStatus: "VERIFIED",
    city: "Delhi",
    country: "India",
    rating: 4.5,
    supportsDelivery: false,
    supportsPickup: true,
    supportsDigitalPayment: true,
    openingHours: "09:30 - 21:00",
    contactPhone: "+911145553030",
    address: "Aerocity, Delhi",
    latitude: 28.5483,
    longitude: 77.1217
  },
  {
    id: "unimoni-india",
    businessName: "Unimoni India",
    licenseType: "TRAVEL_FOREX_PARTNER",
    verificationStatus: "VERIFIED",
    city: "Mumbai",
    country: "India",
    rating: 4.4,
    supportsDelivery: true,
    supportsPickup: true,
    supportsDigitalPayment: true,
    openingHours: "10:00 - 19:00",
    contactPhone: "+912245551010",
    address: "Bandra Kurla Complex, Mumbai",
    latitude: 19.0669,
    longitude: 72.8675
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

const rateMatrix: Record<string, Array<Omit<RateView, "id" | "sourceCurrency" | "targetCurrency" | "lastUpdatedAt" | "freshness">>> = {
  USD: [
    { partnerId: "global-forex", partnerName: "Global Forex Pvt. Ltd.", buyRate: 82.8, sellRate: 83.44, midMarketRate: 83.12, serviceFee: 220, availableAmount: 95000, suspicious: false, rating: 4.8, supportsDelivery: false },
    { partnerId: "travel-currency", partnerName: "Travel Currency Exchange", buyRate: 82.5, sellRate: 83.21, midMarketRate: 83.12, serviceFee: 780, availableAmount: 78000, suspicious: false, rating: 4.6, supportsDelivery: true },
    { partnerId: "world-forex", partnerName: "World Forex Services", buyRate: 82.2, sellRate: 82.98, midMarketRate: 83.12, serviceFee: 1150, availableAmount: 52000, suspicious: false, rating: 4.5, supportsDelivery: false }
  ],
  EUR: [
    { partnerId: "global-forex", partnerName: "Global Forex Pvt. Ltd.", buyRate: 90.5, sellRate: 91.32, midMarketRate: 90.9, serviceFee: 220, availableAmount: 65000, suspicious: false, rating: 4.8, supportsDelivery: false },
    { partnerId: "travel-currency", partnerName: "Travel Currency Exchange", buyRate: 90.1, sellRate: 90.83, midMarketRate: 90.9, serviceFee: 780, availableAmount: 47000, suspicious: false, rating: 4.6, supportsDelivery: true },
    { partnerId: "world-forex", partnerName: "World Forex Services", buyRate: 89.7, sellRate: 90.43, midMarketRate: 90.9, serviceFee: 1150, availableAmount: 41000, suspicious: false, rating: 4.5, supportsDelivery: false }
  ],
  GBP: [
    { partnerId: "global-forex", partnerName: "Global Forex Pvt. Ltd.", buyRate: 105.4, sellRate: 106.12, midMarketRate: 105.8, serviceFee: 249, availableAmount: 26000, suspicious: false, rating: 4.8, supportsDelivery: false },
    { partnerId: "travel-currency", partnerName: "Travel Currency Exchange", buyRate: 105.0, sellRate: 105.76, midMarketRate: 105.8, serviceFee: 699, availableAmount: 21000, suspicious: false, rating: 4.6, supportsDelivery: true }
  ],
  AED: [
    { partnerId: "global-forex", partnerName: "Global Forex Pvt. Ltd.", buyRate: 22.3, sellRate: 22.83, midMarketRate: 22.6, serviceFee: 199, availableAmount: 180000, suspicious: false, rating: 4.8, supportsDelivery: false },
    { partnerId: "travel-currency", partnerName: "Travel Currency Exchange", buyRate: 22.2, sellRate: 22.71, midMarketRate: 22.6, serviceFee: 499, availableAmount: 140000, suspicious: false, rating: 4.6, supportsDelivery: true }
  ],
  SGD: [
    { partnerId: "global-forex", partnerName: "Global Forex Pvt. Ltd.", buyRate: 61.4, sellRate: 62.2, midMarketRate: 61.8, serviceFee: 249, availableAmount: 38000, suspicious: false, rating: 4.8, supportsDelivery: false }
  ],
  THB: [
    { partnerId: "world-forex", partnerName: "World Forex Services", buyRate: 2.25, sellRate: 2.62, midMarketRate: 2.3, serviceFee: 399, availableAmount: 250000, suspicious: true, rating: 4.5, supportsDelivery: false },
    { partnerId: "travel-currency", partnerName: "Travel Currency Exchange", buyRate: 2.24, sellRate: 2.39, midMarketRate: 2.3, serviceFee: 599, availableAmount: 190000, suspicious: false, rating: 4.6, supportsDelivery: true }
  ],
  JPY: [
    { partnerId: "unimoni-india", partnerName: "Unimoni India", buyRate: 0.53, sellRate: 0.61, midMarketRate: 0.55, serviceFee: 499, availableAmount: 900000, suspicious: true, rating: 4.4, supportsDelivery: true },
    { partnerId: "global-forex", partnerName: "Global Forex Pvt. Ltd.", buyRate: 0.52, sellRate: 0.57, midMarketRate: 0.55, serviceFee: 299, availableAmount: 740000, suspicious: false, rating: 4.8, supportsDelivery: false }
  ]
};

const demoBookings: Booking[] = [
  {
    id: "bkg_10482",
    bookingReference: "RFX-10482",
    partner: demoPartners[0],
    bookingType: "BUY_FOREX",
    sourceCurrency: "INR",
    targetCurrency: "USD",
    sourceAmount: 100000,
    totalPayable: 100220,
    targetAmountEstimate: 1198.46,
    lockedRate: 83.44,
    midMarketRate: 83.12,
    spreadAmount: 384,
    markupAmount: 410,
    serviceFee: 220,
    taxes: 39.6,
    fulfilmentFee: 0,
    settlementState: "NOT_REQUIRED",
    status: "KYC_PENDING",
    rateLockExpiresAt: new Date(Date.now() + 18 * 60 * 1000).toISOString()
  },
  {
    id: "bkg_10479",
    bookingReference: "RFX-10479",
    partner: demoPartners[1],
    bookingType: "BUY_FOREX",
    sourceCurrency: "INR",
    targetCurrency: "EUR",
    sourceAmount: 75000,
    totalPayable: 75780,
    targetAmountEstimate: 826.72,
    lockedRate: 90.83,
    midMarketRate: 90.9,
    spreadAmount: 58,
    markupAmount: 306,
    serviceFee: 780,
    taxes: 140.4,
    fulfilmentFee: 250,
    settlementState: "NOT_REQUIRED",
    status: "PARTNER_REVIEW",
    rateLockExpiresAt: new Date(Date.now() + 26 * 60 * 1000).toISOString()
  }
];

const demoDocuments: KycDocumentView[] = [
  {
    id: "doc_passport",
    bookingId: "bkg_10482",
    documentType: "PASSPORT",
    fileName: "passport-metadata.pdf",
    fileUrl: "local://passport-metadata.pdf",
    verificationStatus: "UNDER_REVIEW",
    createdAt: now(),
    nextAction: "Partner compliance team is reviewing the passport metadata."
  },
  {
    id: "doc_pan",
    bookingId: "bkg_10482",
    documentType: "PAN",
    fileName: "pan-card-metadata.pdf",
    fileUrl: "local://pan-card-metadata.pdf",
    verificationStatus: "UPLOADED",
    createdAt: now(),
    nextAction: "Awaiting review. Keep original document ready at pickup."
  }
];

function envelope<T>(data: T, message = "OK"): ApiEnvelope<T> {
  return { success: true, message, data, errorCode: null, timestamp: now() };
}

function planner(body: Record<string, unknown>): TravelMoneyPlan {
  const days = Number(body.tripDays ?? 7);
  const travellers = Number(body.travellerCount ?? 1);
  const planned = Number(body.plannedCashAmount ?? 0);
  const style = String(body.travelStyle ?? "MID_RANGE");
  const currency = String(body.preferredCurrency ?? "USD").toUpperCase();
  const multiplier = style === "LUXURY" ? 95 : style === "BUDGET" ? 38 : 62;
  const daily = multiplier * travellers;
  const estimated = daily * days;
  const recommendedCash = Math.max(planned, Math.round(estimated * 0.45));
  const emergency = Math.round(daily * 1.5);

  return {
    recommendedCashAmount: recommendedCash,
    recommendedCardAmount: Math.round(estimated - recommendedCash + emergency),
    suggestedDenominations: [`Carry mixed ${currency} notes`, "Keep small notes for taxis, tips, and street food", "Split cash across wallet and luggage"],
    dailyBudgetEstimate: daily,
    emergencyCashSuggestion: emergency,
    airportExchangeWarning: "Avoid airport counters except emergencies; compare verified partner rates before departure.",
    atmUsageAdvice: "Use bank ATMs in daylight, decline dynamic currency conversion, and keep backup cards separate.",
    cardAcceptanceAdvice: "Cards are useful in hotels and malls; keep cash for local transport, markets, and small vendors.",
    scamWarnings: ["Avoid street money changers", "Do not meet strangers for cash exchange", "Check receipt, rate, service fee, and licence display"],
    countrySpecificTips: [`Confirm current rules for ${body.destinationCountry ?? "your destination"} before travel`, "Keep passport and travel proof ready for authorised partner KYC"],
    checklist: ["Compare verified partners", "Reserve rate", "Complete KYC if threshold applies", "Use non-cash payment for INR equivalent >= 50,000"],
    confidenceScore: 0.86,
    disclaimer: "RoamFX provides preparation guidance only. Rates and rules may change; transactions must be completed through verified authorised partners subject to applicable laws, KYC, and partner acceptance.",
    provider: "MockTravelMoneyAdvisor"
  };
}

function quoteBreakdown(body: Record<string, unknown>): QuoteBreakdown {
  const bookingType = String(body.bookingType ?? "BUY_FOREX");
  const amount = Number(body.sourceAmount ?? 1000);
  const currency = String(body.sourceCurrency ?? "EUR").toUpperCase();
  const fulfilmentMode = String(body.fulfilmentMode ?? "PICKUP");
  const paymentMode = String(body.paymentMode ?? "UPI");
  const rate = rateMatrix[currency]?.[0] ?? rateMatrix.EUR[0];
  const lockedRate = bookingType === "SELL_LEFTOVER_FOREX" ? rate.buyRate : rate.sellRate;
  const fxAmount = Number((amount * lockedRate).toFixed(2));
  const spreadAmount = Number((amount * Math.abs(lockedRate - rate.midMarketRate)).toFixed(2));
  const markupAmount = Number((fxAmount * 0.0045).toFixed(2));
  const serviceFee = rate.serviceFee;
  const taxes = Number((serviceFee * 0.18).toFixed(2));
  const fulfilmentFee = fulfilmentMode === "DELIVERY" ? 250 : 0;
  const totalPayable = bookingType === "BUY_FOREX" ? Number((fxAmount + serviceFee + taxes + fulfilmentFee).toFixed(2)) : 0;
  const payoutAmount = bookingType === "SELL_LEFTOVER_FOREX" ? Number(Math.max(0, fxAmount - serviceFee - taxes - fulfilmentFee).toFixed(2)) : 0;
  const thresholdBase = bookingType === "BUY_FOREX" ? totalPayable : fxAmount;
  const cashAllowed = paymentMode !== "CASH" || thresholdBase < 50000;
  return {
    lockedRate,
    midMarketRate: rate.midMarketRate,
    fxAmount,
    spreadAmount,
    markupAmount,
    serviceFee,
    taxes,
    fulfilmentFee,
    totalPayable,
    payoutAmount,
    kycRequired: thresholdBase >= 50000 || bookingType === "SELL_LEFTOVER_FOREX",
    cashAllowed,
    rateLockExpiresAt: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
    payoutEta: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
    complianceNotice: cashAllowed
      ? "Quote is indicative until rate lock. All exchange flows must be completed through verified authorised partners."
      : "INR equivalent >= 50000 cannot use cash. Select UPI, card, or bank transfer."
  };
}

async function mockApi<T>(path: string, init: RequestInit = {}): Promise<T> {
  await new Promise((resolve) => setTimeout(resolve, 250));
  const method = (init.method ?? "GET").toUpperCase();
  const url = new URL(path, "https://mock.roamfx.local");
  const parseBody = () => init.body ? JSON.parse(String(init.body)) as Record<string, unknown> : {};

  if (url.pathname === "/api/auth/login" && method === "POST") {
    const body = parseBody();
    const user = demoUsers[String(body.email ?? "").toLowerCase()];
    if (!user || user.password !== body.password) throw new Error("Invalid demo credentials");
    const { password: _password, ...safeUser } = user;
    return envelope({ accessToken: `demo-token-${safeUser.role.toLowerCase()}`, user: safeUser }, "Signed in") .data as T;
  }

  if (url.pathname === "/api/auth/register" && method === "POST") {
    const body = parseBody();
    const user: User = {
      id: "usr_new",
      fullName: String(body.fullName ?? "Demo Traveller"),
      email: String(body.email ?? "new@roamfx.app"),
      phone: String(body.phone ?? ""),
      country: String(body.country ?? "India"),
      role: "TRAVELLER",
      kycStatus: "NOT_STARTED"
    };
    return envelope({ accessToken: "demo-token-traveller", user }, "Registered") .data as T;
  }

  if (url.pathname === "/api/auth/me") {
    return envelope(demoUsers["traveller@roamfx.app"], "Profile loaded").data as T;
  }

  if (url.pathname === "/api/rates/search") {
    const currency = (url.searchParams.get("sourceCurrency") ?? "USD").toUpperCase();
    const sort = url.searchParams.get("sort") ?? "best-rate";
    const rows = [...(rateMatrix[currency] ?? [])].map((rate, index) => ({
      ...rate,
      id: `${currency}-${rate.partnerId}`,
      sourceCurrency: currency,
      targetCurrency: "INR",
      lastUpdatedAt: now(),
      freshness: index === 0 ? "just now" : `${8 + index * 3} min ago`
    }));
    rows.sort((a, b) => {
      if (sort === "rating") return b.rating - a.rating;
      if (sort === "delivery") return Number(b.supportsDelivery) - Number(a.supportsDelivery);
      return a.sellRate - b.sellRate;
    });
    return envelope(rows, "Rates loaded").data as T;
  }

  if (url.pathname === "/api/partners") return envelope(demoPartners, "Partners loaded").data as T;
  if (url.pathname === "/api/partners/nearby") {
    const currency = (url.searchParams.get("currency") ?? "EUR").toUpperCase();
    const city = (url.searchParams.get("city") ?? "Delhi").toLowerCase();
    const latParam = url.searchParams.get("lat");
    const lngParam = url.searchParams.get("lng");
    const latitude = latParam === null ? NaN : Number(latParam);
    const longitude = lngParam === null ? NaN : Number(lngParam);
    const origin = latParam !== null && lngParam !== null && Number.isFinite(latitude) && Number.isFinite(longitude)
      ? { latitude, longitude }
      : cityCoordinates[city] ?? cityCoordinates.delhi;
    const rates = rateMatrix[currency] ?? rateMatrix.EUR;
    const rows = demoPartners
      .filter((partner) => partner.verificationStatus === "VERIFIED")
      .map((partner, index) => {
        const rate = rates.find((item) => item.partnerId === partner.id) ?? rates[index % rates.length];
        return {
          ...partner,
          distanceKm: partner.latitude && partner.longitude ? distanceKm(origin, { latitude: partner.latitude, longitude: partner.longitude }) : 0,
          bestSellRate: rate.sellRate,
          serviceFee: rate.serviceFee,
          availableAmount: rate.availableAmount,
          freshness: index === 0 ? "just now" : `${7 + index * 4} min ago`,
          fulfilmentMode: partner.supportsDelivery ? "Home delivery / pickup" : "Store or airport pickup",
          suspicious: rate.suspicious
        };
      })
      .sort((a, b) => a.distanceKm - b.distanceKm);
    return envelope(rows, "Nearby verified partners loaded").data as T;
  }
  if (url.pathname === "/api/bookings/my") return envelope(demoBookings, "Bookings loaded").data as T;
  if (url.pathname === "/api/documents/my") return envelope(demoDocuments, "Documents loaded").data as T;
  if (url.pathname === "/api/documents" && method === "POST") {
    const body = parseBody();
    return envelope({
      id: `doc_${Date.now()}`,
      bookingId: body.bookingId,
      documentType: body.documentType ?? "OTHER",
      fileName: body.fileName ?? "document-metadata.pdf",
      fileUrl: body.fileUrl ?? "local://document-metadata.pdf",
      verificationStatus: "UPLOADED",
      createdAt: now(),
      nextAction: "Uploaded metadata is queued for partner/admin review."
    }, "Document metadata uploaded").data as T;
  }
  if (url.pathname === "/api/bookings/quote" && method === "POST") return envelope(quoteBreakdown(parseBody()), "Quote generated").data as T;
  if (url.pathname === "/api/bookings" && method === "POST") {
    const body = parseBody();
    const partner = demoPartners.find((item) => item.id === body.partnerId) ?? demoPartners[0];
    const quote = quoteBreakdown(body);
    return envelope({
      id: `bkg_${Date.now()}`,
      bookingReference: `RFX-${String(Date.now()).slice(-5)}`,
      partner,
      bookingType: body.bookingType ?? "BUY_FOREX",
      sourceCurrency: body.sourceCurrency ?? "EUR",
      targetCurrency: body.targetCurrency ?? "INR",
      sourceAmount: Number(body.sourceAmount ?? 1000),
      targetAmountEstimate: quote.fxAmount,
      lockedRate: quote.lockedRate,
      midMarketRate: quote.midMarketRate,
      spreadAmount: quote.spreadAmount,
      markupAmount: quote.markupAmount,
      serviceFee: quote.serviceFee,
      taxes: quote.taxes,
      fulfilmentFee: quote.fulfilmentFee,
      totalPayable: quote.totalPayable,
      payoutAmount: quote.payoutAmount,
      settlementState: body.bookingType === "SELL_LEFTOVER_FOREX" ? "PENDING" : "NOT_REQUIRED",
      status: quote.kycRequired ? "KYC_PENDING" : "RATE_LOCKED",
      rateLockExpiresAt: quote.rateLockExpiresAt,
      payoutEta: quote.payoutEta
    }, "Booking created").data as T;
  }
  if (url.pathname === "/api/ai/travel-money-plan" && method === "POST") return envelope(planner(parseBody()), "Plan generated").data as T;

  return envelope(null as T, "Mock endpoint not implemented").data;
}

function shouldUseMock() {
  return process.env.NEXT_PUBLIC_USE_MOCK_API !== "false" || !API_URL;
}

export async function api<T>(path: string, init: RequestInit = {}): Promise<T> {
  if (shouldUseMock()) return mockApi<T>(path, init);

  const token = typeof window !== "undefined" ? localStorage.getItem("roamfx_token") : null;
  const res = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}), ...init.headers },
    cache: "no-store"
  });
  const payload = await res.json().catch(() => null) as ApiEnvelope<T> | null;
  if (!res.ok || payload?.success === false) throw new Error(payload?.message ?? "Request failed");
  if (payload && "data" in payload) return payload.data;
  return payload as T;
}
