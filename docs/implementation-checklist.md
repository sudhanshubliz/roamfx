# RoamFX Prioritized Implementation Checklist

This checklist translates the product gap analysis into engineering work grouped by persona. Items marked `Done` are implemented in code or docs; items marked `Next` should be prioritized in the next sprint.

## Traveller

| Priority | Status | Item | Acceptance Signal |
|---:|---|---|---|
| P0 | Done | Quote-to-book dashboard | Traveller can enter city/currency/amount, compare rates, generate a quote, see price breakdown, and create a locked booking. |
| P0 | Done | Booking timeline tracker | Dashboard and bookings screen show the latest status and next actions. |
| P0 | Done | Leftover sell-back flow | Sell-back quote creates `SELL_LEFTOVER_FOREX` booking and shows payout ETA/settlement state without any P2P path. |
| P0 | Done | KYC document metadata UI | Traveller can upload metadata, view checklist, status, rejection guidance, and privacy warnings. |
| P1 | Done | Saved traveller/profile workspace | Traveller can manage demo saved travellers, preferences, and reminder settings. |
| P1 | Next | Booking detail route | Add `/bookings/{id}` with cancellation policy, receipt placeholder, document checklist, and partner communication timeline. |
| P1 | Next | Real notification jobs | Rate-lock expiry, KYC rejection, trip reminder, and partner confirmation notifications. |

## Partner Admin / Forex Shop Owner

| Priority | Status | Item | Acceptance Signal |
|---:|---|---|---|
| P0 | Done | Partner onboarding foundation | `partner_onboarding` schema and admin review endpoint exist. |
| P0 | Done | Branch inventory foundation | `partner_inventory` schema and partner update endpoint exist. |
| P0 | Done | Partner operations summary API | `/api/partner/operations/summary` returns bookings, pending KYC, low stock, and suspicious rates. |
| P0 | Next | Partner dashboard API integration | Replace static partner dashboard arrays with operations summary, inventory, bookings, and rates APIs. |
| P0 | Next | Staff RBAC | Add OWNER, MANAGER, CASHIER, COMPLIANCE staff table, endpoint permission checks, and UI switching. |
| P0 | Next | Maker-checker rate approvals | Risky rate updates must create approval requests before publishing. |
| P1 | Next | Settlement ledger and exports | Daily branch/currency ledger with CSV export and settlement states. |

## Platform Admin

| Priority | Status | Item | Acceptance Signal |
|---:|---|---|---|
| P0 | Partial | Admin overview | Dashboard exists but still contains some static summaries. |
| P0 | Next | Policy/risk rules engine | Cash/KYC/rate/content thresholds configurable from database and audited. |
| P0 | Next | Moderation workflow | Flag queue with unsafe P2P intent category, hide/reinstate actions, and audit trail. |
| P1 | Next | Monetization controls | Commission plans, subscription tiers, featured listings, and fairness rules. |
| P1 | Next | Privacy controls | PII masking defaults, retention settings, audit access restrictions. |

## Non-Functional

| Priority | Status | Item | Acceptance Signal |
|---:|---|---|---|
| P0 | Partial | Server-side compliance checks | Verified partner, cash threshold, KYC requirement, no P2P guardrails are enforced in key flows. |
| P0 | Next | Journey tests | Add backend integration and frontend flow tests for quote -> booking -> KYC -> partner review. |
| P1 | Next | Observability | Add trace IDs, structured logs, metrics counters, and deployment dashboards. |
| P1 | Next | Real provider integrations | Email, analytics, maps Places API New, payment intent abstraction, secure document storage. |
