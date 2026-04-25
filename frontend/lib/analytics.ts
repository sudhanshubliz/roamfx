export type AnalyticsEvent =
  | "landing_viewed"
  | "rate_search_started"
  | "waitlist_joined"
  | "booking_started"
  | "booking_completed";

export function trackEvent(event: AnalyticsEvent, properties: Record<string, unknown> = {}) {
  // TODO: Wire to PostHog, Segment, RudderStack, or first-party analytics.
  if (typeof window !== "undefined") {
    console.info("[analytics placeholder]", event, properties);
  }
}
