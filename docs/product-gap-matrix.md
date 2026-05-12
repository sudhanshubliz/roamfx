# RoamFX Product Gap Matrix

RoamFX is positioned as a compliance-first travel forex marketplace. The highest-priority gaps are the places where the MVP still behaves like a static demo or where operational controls are not yet enforceable server-side.

## Prioritized Persona Gaps

| Persona | Priority | Gap | Current State | Target State | Rationale |
|---|---:|---|---|---|---|
| Traveller | P0 | Transparent quote and rate lock | Rate and service fee shown, limited breakdown | Server-generated quote includes rate, mid-market reference, spread, markup, fees, taxes, fulfilment fees, cash/KYC warnings, lock expiry | Conversion and trust depend on showing why total payable changes before booking |
| Traveller | P0 | Compliance-safe booking lifecycle | Basic status changes | Status timeline with rate expiry, KYC pending, partner review, confirmation, cancellation and refund outcomes | Reduces support ambiguity and prevents unsafe cash flows |
| Traveller | P0 | Leftover currency sell-back | Routed as booking type but limited settlement fields | Sell-back quote, pickup/store option, payout ETA, settlement state, partner acceptance | Keeps leftover-currency demand away from P2P meetups |
| Traveller | P1 | Document feedback | Upload metadata exists | Document checklist, rejection reasons, next action text | Helps travellers complete KYC quickly |
| Traveller | P1 | Repeat bookings and reminders | Not modeled | Saved traveller profiles, trip reminder triggers, repeat booking copy | Improves retention and reduces form friction |
| Partner Admin | P0 | Partner onboarding/KYB | Admin can create/verify partner | Onboarding record, KYB checklist, review states, audit trail | Enables controlled supply onboarding |
| Partner Admin | P0 | Branch inventory | Not modeled | Branch/currency inventory with available/reserved/reorder levels | Required for realistic booking acceptance and fulfilment |
| Partner Admin | P0 | Rate operating controls | Rates CRUD exists with suspicious flag | Spread configuration, deviation safeguards, maker-checker approval for risky updates | Prevents accidental or abusive pricing |
| Partner Admin | P1 | Lead inbox and SLA | Booking list exists | SLA timers, assignment, response templates, status workflow | Makes shop-owner daily operations usable |
| Partner Admin | P1 | Settlement exports | Not modeled | Reconciliation exports by branch, currency, and settlement date | Needed for finance operations |
| Platform Admin | P0 | Risk rules | Thresholds are hardcoded | Policy/risk rules table for cash, KYC, suspicious rates, content safety | Allows policy changes without redeploying |
| Platform Admin | P1 | Monetization controls | Placeholder summary | Commission plans, featured listing eligibility, subscription tiers | Enables marketplace revenue |
| Platform Admin | P1 | Privacy controls | Basic DTO/API response | PII masking defaults, retention settings, audit access | Improves launch readiness and investor confidence |
| Platform Admin | P1 | Community moderation | Flagging exists | Moderation queue with unsafe exchange content categories | Keeps community layer compliance-safe |

## Implemented in This Slice

- Server-side quote breakdown contract for traveller bookings.
- Idempotency key support for booking creation.
- Cancellation outcome/refund fields.
- Sell-back payout amount, payout ETA, and settlement state fields.
- Partner onboarding and branch inventory schema and APIs.
- Google Places nearby discovery endpoint remains informational only and does not create unverified partner booking paths.
- Traveller dashboard is now an API-backed quote-to-book workspace with rate comparison, full price breakdown, KYC/cash signals, and latest booking timeline.
- Traveller documents, profile, and partners pages now provide functional workflows instead of static `PageTemplate` surfaces.
- Added DTO-backed `/api/documents/my` and `/api/partner/operations/summary` surfaces for production migration away from frontend mock data.

## Remaining Critical Gaps

- Staff RBAC/maker-checker approval workflow.
- Persistent rules engine for configurable policy thresholds.
- Settlement ledger/export generation.
- Automated E2E coverage for the complete traveller quote-to-book journey.
- Production payment intent abstraction for Razorpay/Stripe without processing real forex payments until compliance approval.
- Real notification provider for KYC, rate-lock expiry, partner SLA, and settlement events.
- Partner dashboard still needs to consume the new operations summary and replace remaining static dashboard arrays.
