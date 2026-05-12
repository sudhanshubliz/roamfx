# RoamFX Release Plan

## Release A: Conversion + Trust Foundation

Goal: make the traveller buying/selling journey trustworthy, transparent, and enforceable.

### User Stories

- As a traveller, I can request a live quote with full price breakdown before creating a booking.
- As a traveller, I can lock a rate for a short countdown window and see expiry fallback messaging.
- As a traveller, I can cancel before confirmation and see whether a refund is pending or no charge applies.
- As a traveller selling leftover currency, I can see estimated payout, pickup/store options, payout ETA, and settlement state.

### Acceptance Criteria

- Quote API returns locked rate, mid-market rate, spread, markup, service fee, taxes, fulfilment fee, total payable, payout amount, KYC requirement, cash eligibility, and rate-lock expiry.
- Cash payment is rejected for INR equivalent >= 50000.
- Bookings can be created idempotently with an idempotency key.
- Leftover currency requests never expose user-to-user meetup or direct P2P exchange.

### Data Model Changes

- Add quote breakdown fields to `bookings`.
- Add `settlement_state`, `payout_eta`, `payout_amount`, `cancellation_outcome`, `refund_amount`, and `idempotency_key`.

### API Contracts

- `POST /api/bookings/quote`
- `POST /api/bookings`
- `PUT /api/bookings/{id}/cancel`

### Frontend Screens/Components

- Rate comparison price breakdown panel.
- Booking timeline tracker.
- Sell leftover currency quote and payout panel.
- Document status/action card.
- API-backed traveller dashboard replacing the previous static dashboard.
- Functional partner discovery page with list/map mode, filters, trust card, call, and directions actions.
- Profile workspace for saved travellers, repeat-booking preferences, and reminder settings.

### Analytics Events

- `quote_requested`
- `quote_returned`
- `booking_started`
- `rate_locked`
- `booking_cancelled`
- `sellback_started`

### Test Plan

- Unit tests for quote math, KYC threshold, cash threshold, sell-back payout.
- Controller tests for unauthenticated/protected booking paths.
- Frontend tests for quote loading, empty/error states, and cash warning display.

## Release B: Partner Operating System

Goal: give authorised forex partners the tools to run daily branch operations.

### User Stories

- As a partner owner, I can complete KYB onboarding and track approval state.
- As a partner manager, I can manage branch inventory by currency.
- As a partner cashier, I can accept, reject, mark ready, and complete booking requests.
- As a compliance staff member, I can review KYC metadata before fulfilment.

### Acceptance Criteria

- Partner onboarding has review states and audit logs.
- Inventory supports available, reserved, and reorder levels per branch/currency.
- Suspicious rate deviation is flagged before customers see rates.
- Staff actions are role-gated with maker-checker for risky rate changes.

### Data Model Changes

- `partner_onboarding`
- `partner_inventory`
- Future: `partner_staff`, `rate_change_requests`, `settlement_batches`

### API Contracts

- `GET /api/partner/inventory`
- `PUT /api/partner/inventory/{id}`
- `GET /api/admin/partners/{id}/onboarding`
- `PUT /api/admin/partners/{id}/onboarding`
- `GET /api/partner/operations/summary`

### Frontend Screens/Components

- Partner onboarding checklist.
- Inventory table with low-stock badges.
- Lead inbox with SLA timer.
- Rate engine panel with suspicious-rate warning.

### Analytics Events

- `partner_onboarding_submitted`
- `partner_onboarding_approved`
- `inventory_updated`
- `booking_partner_accepted`
- `booking_partner_rejected`
- `rate_update_flagged`

### Test Plan

- Permission tests for partner/admin endpoints.
- Inventory update validation tests.
- Suspicious rate threshold tests.
- Partner dashboard component tests for loading/empty/error states.

## Release C: Marketplace Scale + Monetization

Goal: scale supply, trust, and revenue controls while preserving compliance.

### User Stories

- As platform admin, I can configure risk rules for cash, KYC, suspicious rates, and unsafe content.
- As platform admin, I can configure commission plans, featured listings, and partner subscription tiers.
- As privacy admin, I can set retention periods and default PII masking.
- As moderator, I can triage unsafe community content and block P2P exchange attempts.

### Acceptance Criteria

- Rules can change without code deploy for supported policy knobs.
- Commission and featured-listing logic is auditable.
- Audit logs include actor, action, target, metadata, and trace context.
- Unsafe community posts cannot produce transaction routes.

### Data Model Changes

- `risk_rules`
- `commission_plans`
- `partner_subscriptions`
- `moderation_cases`
- `privacy_retention_policies`

### API Contracts

- `GET/PUT /api/admin/risk-rules`
- `GET/PUT /api/admin/commission-plans`
- `GET/PUT /api/admin/privacy-settings`
- `GET/PUT /api/admin/moderation-cases`

### Frontend Screens/Components

- Policy/risk rules dashboard.
- Monetization settings.
- Audit/privacy console.
- Moderation queue.

### Analytics Events

- `risk_rule_changed`
- `commission_plan_changed`
- `featured_listing_enabled`
- `community_post_flagged`
- `moderation_case_resolved`

### Test Plan

- Rules engine unit tests.
- Admin permission tests.
- Audit log integrity tests.
- Load tests for quote/search endpoints.
