export const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080";

export type RateView = {
  id: string; partnerId: string; partnerName: string; sourceCurrency: string; targetCurrency: string;
  buyRate: number; sellRate: number; midMarketRate: number; serviceFee: number; availableAmount: number;
  lastUpdatedAt: string; suspicious: boolean; freshness: string;
};
export type Partner = { id: string; businessName: string; licenseType: string; verificationStatus: string; city: string; country: string; rating: number; supportsDelivery: boolean; supportsPickup: boolean; supportsDigitalPayment: boolean; openingHours: string };
export type Booking = { id: string; bookingReference: string; partner: Partner; bookingType: string; sourceCurrency: string; targetCurrency: string; sourceAmount: number; totalPayable: number; status: string; rateLockExpiresAt: string };
type ApiEnvelope<T> = { success: boolean; message: string; data: T; errorCode: string | null; timestamp: string };

export async function api<T>(path: string, init: RequestInit = {}): Promise<T> {
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
