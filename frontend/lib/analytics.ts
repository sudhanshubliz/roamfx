export type AnalyticsEvent =
  | "landing_viewed"
  | "rate_search_started"
  | "waitlist_joined"
  | "booking_started"
  | "booking_completed"
  | "quote_requested"
  | "quote_returned"
  | "rate_locked"
  | "booking_cancelled"
  | "sellback_started"
  | "nearby_exchange_loaded"
  | "document_uploaded"
  | "partner_onboarding_submitted"
  | "partner_onboarding_approved"
  | "inventory_updated"
  | "rate_update_flagged";

export function trackEvent(event: AnalyticsEvent, properties: Record<string, unknown> = {}) {
  // TODO: Wire to PostHog, Segment, RudderStack, or first-party analytics.
  if (typeof window !== "undefined") {
    console.info("[analytics placeholder]", event, properties);
  }
}
