# RoamFX Metrics and Events

## Event Naming

Events use lower snake case and include `persona`, `role`, `city`, `currency_pair`, `partner_id`, and `booking_reference` when available. Do not send raw document content, passport numbers, PAN numbers, JWTs, or full addresses into analytics.

## Traveller Funnel

| Event | Trigger | Required Properties |
|---|---|---|
| `landing_viewed` | Landing/home viewed | `source`, `device_type` |
| `rate_search_started` | Traveller starts rate search | `city`, `source_currency`, `target_currency`, `location_mode` |
| `nearby_exchange_loaded` | Nearby partner/Google listing API returns | `city`, `result_count`, `google_places_enabled` |
| `quote_requested` | Quote API called | `booking_type`, `partner_id`, `currency_pair`, `fulfilment_mode` |
| `quote_returned` | Quote rendered | `cash_allowed`, `kyc_required`, `rate_lock_minutes` |
| `booking_started` | Traveller opens booking flow | `booking_type`, `partner_id` |
| `rate_locked` | Booking created in locked/pending KYC state | `booking_reference`, `expires_at` |
| `document_uploaded` | KYC metadata uploaded | `document_type`, `booking_reference` |
| `booking_cancelled` | Traveller cancels before confirmation | `booking_reference`, `cancellation_outcome` |
| `sellback_started` | Leftover sell-back journey begins | `currency`, `amount`, `fulfilment_mode` |

## Partner Operations

| Event | Trigger | Required Properties |
|---|---|---|
| `partner_onboarding_submitted` | Partner sends KYB checklist | `partner_id`, `license_type` |
| `partner_onboarding_approved` | Admin approves onboarding | `partner_id`, `reviewer_role` |
| `inventory_updated` | Partner updates branch inventory | `partner_id`, `branch_name`, `currency_code` |
| `rate_update_submitted` | Partner creates/updates rate | `partner_id`, `currency_pair`, `suspicious` |
| `booking_partner_accepted` | Partner confirms booking | `booking_reference`, `partner_id` |
| `booking_partner_rejected` | Partner rejects booking | `booking_reference`, `reason_code` |

## Platform/Risk

| Event | Trigger | Required Properties |
|---|---|---|
| `cash_threshold_blocked` | CASH selected for INR equivalent >= 50000 | `booking_type`, `amount_band` |
| `suspicious_rate_detected` | Rate deviates beyond threshold | `partner_id`, `currency_pair`, `deviation_percent` |
| `community_post_flagged` | Community content flagged | `post_type`, `reason_code` |
| `risk_rule_changed` | Admin updates policy rule | `rule_key`, `actor_role` |
| `audit_log_viewed` | Admin opens audit viewer | `actor_role` |

## Dashboard Metrics

- Quote latency p50/p95.
- Quote-to-book conversion.
- Rate-lock expiry rate.
- KYC pending age.
- Partner SLA breach count.
- Inventory low-stock count by currency.
- Suspicious rate count.
- Sell-back settlement pending age.
- Cancellation and refund rate.

## Privacy Guardrails

- Mask phone/email in analytics dashboards by default.
- Store document metadata only unless a regulated storage provider is configured.
- Keep audit logs immutable from UI flows.
- Never track direct user-to-user exchange intent as a fulfilment path; unsafe content should route to moderation.
