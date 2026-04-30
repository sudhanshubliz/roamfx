# RoamFX Business Gap Analysis + Master Codex Prompt

## 1) What exists today (from codebase)

RoamFX already has a strong MVP skeleton:
- Role-based surfaces for Traveller, Partner Admin, and Platform Admin.
- Booking lifecycle states and compliance-aware flows (including sell leftover currency routed to partner, not P2P).
- Core entities for users, partners, rates, bookings, reviews, KYC docs, audit logs, and waitlist.
- JWT auth and basic API envelope.

However, a large portion of UI and operator workflows are currently demo/static placeholders instead of fully wired business capabilities.

---

## 2) Missing capabilities by user persona

## A. Traveller perspective

### Critical missing
1. **End-to-end checkout reliability**
   - Live quote -> lock -> payment intent -> confirmation timeline is not implemented as a robust journey.
2. **Transparent total cost breakdown**
   - Need guaranteed final payable decomposition: base FX, markup, service fee, GST/tax, delivery fee.
3. **Fulfilment tracking**
   - Need order tracking events (received, KYC approved, packed, ready, delivered/picked up).
4. **Issue resolution workflows**
   - Cancellations/refunds, SLA promises, dispute flow, and resolution communication.
5. **Trust artefacts**
   - Partner credential verification badges with expiry date, license metadata, and complaint history snippets.
6. **Destination intelligence**
   - "How much cash vs card" recommendations by country, fraud/risk alerts, and spending bands.
7. **Leftover currency sell-back UX**
   - Quote, pickup/store options, settlement ETA, and payout mode transparency.

### Important missing
8. Saved traveller profiles, frequent routes, and repeat-booking in 1 click.
9. Smart reminders (rate watch, trip date reminders, document expiry reminders).
10. Multilingual support + accessibility improvements.
11. Loyalty/referral and traveller retention mechanics.

---

## B. Foreign exchange shop owner / partner perspective

### Critical missing
1. **Onboarding ops stack**
   - Full KYB partner onboarding, document upload, verification checklist, and status pipeline.
2. **Inventory + treasury management**
   - Per-currency stock, reorder thresholds, replenishment recommendations, and branch-wise allocations.
3. **Advanced pricing engine**
   - Configurable spreads by currency/time/channel/customer segment + guardrails.
4. **Lead routing and SLA controls**
   - Queue assignment, response timers, breach alerts, shift scheduling.
5. **Settlement and reconciliation**
   - Ledger, receivables/payables, payout files, branch reconciliation exports.
6. **Staff controls**
   - Sub-roles (cashier/compliance/officer/manager), approvals, maker-checker patterns.
7. **Operational compliance tooling**
   - Suspicious transaction patterns, audit-grade logs, document retention policies.

### Important missing
8. CRM-lite tooling (notes, callbacks, conversion funnel).
9. Conversion analytics (quote-to-book, book-to-complete, cancellation reasons).
10. Campaign tooling for partner promotions and geo-targeted offers.

---

## C. Platform admin perspective

1. Marketplace-level policy engine and dynamic risk scoring are limited.
2. Monetization controls (commission plans, subscriptions, featured partner slots) are not complete.
3. Data governance: stronger privacy controls, PII masking defaults, retention automation.
4. Fraud and abuse stack for community/moderation is basic.
5. Experimentation framework (A/B testing) is missing.

---

## 3) Market insights to shape requirements (2026)

### Market pattern summary
- Digital travel-forex users are price-sensitive, but **trust + compliance + fulfilment reliability** decide conversion.
- Leading competitors emphasize:
  - rate competitiveness,
  - app-first ordering,
  - multi-currency cards,
  - doorstep/service convenience,
  - transparent fee storytelling.
- Traveller behavior increasingly uses a **hybrid stack**: prepaid forex card + no/low-forex bank card + small cash buffer.

### Similar platforms and product patterns
- **BookMyForex (India):** strong online ordering and rate-led messaging with app support.
- **Thomas Cook India Forex:** omnichannel network + prepaid card + branch depth.
- **Wise (global):** transparent conversion experience and multi-currency account/card UX.
- **Revolut (global):** fast in-app exchange and card spend controls/travel UX.

### Specific problem RoamFX solves that many alternatives do not fully solve
- **Compliance-safe leftover currency liquidation**: travellers can request sell-back of leftover forex without being pushed into risky informal peer-to-peer exchanges; requests are routed to verified authorized partners only.
- **Marketplace-level trust orchestration**: instead of a single-provider experience, RoamFX can compare multiple verified partners while preserving auditability and policy checks.
- **Partner operations + compliance in one layer**: most alternatives focus either on consumer ordering UX or on branch operations, but RoamFX is positioned to unify traveller discovery, partner workflow, and admin risk controls in a single system.
- **Transparent all-in economics**: RoamFX aims to show landed cost and operational SLAs together (price + trust + fulfilment), reducing hidden-fee anxiety for travellers and conversion uncertainty for partners.

### Implication for RoamFX
RoamFX can win as a **compliance-first forex marketplace orchestration layer** for India:
- superior trust and auditability compared with informal channels,
- stronger partner operations than pure lead-gen models,
- better traveller clarity on total landed cost and ETA.

---

## 4) Prioritized business requirement backlog (from user perspective)

## Phase 1: Conversion + trust foundation (0-8 weeks)
- Live quote orchestration with expiry and total-cost calculator.
- Booking progress tracker and proactive notifications.
- Partner trust card (license details, verification date, ratings, SLA stats).
- Cancellation/refund policies surfaced pre-checkout.
- Full leftover sell-back journey with payout timeline.

## Phase 2: Partner operating system (8-16 weeks)
- Inventory + branch pricing controls.
- Lead queue + SLA + staff sub-roles.
- KYB/KYC workbench and compliance dashboard.
- Basic settlement/reconciliation exports.

## Phase 3: Marketplace scale levers (16-28 weeks)
- Dynamic commissions and partner monetization plans.
- Fraud/risk scoring and moderation automation.
- Experimentation framework and growth loops (referrals, loyalty, retargeting).
- City expansion toolkit and localized onboarding playbooks.

---

## 5) Master Codex prompt (copy-paste)

```text
You are GPT-5.3-Codex acting as a senior product engineer + business analyst + solution architect.

Goal:
Upgrade the existing RoamFX codebase from MVP demo surfaces to a production-grade, compliance-first forex marketplace for two primary personas:
1) Travellers buying/selling travel forex.
2) Authorized foreign exchange shop owners (partners) running daily forex operations.

Context and constraints:
- Keep the platform compliance-safe: no direct user-to-user exchange flow.
- All forex transactions must route through verified authorized partners.
- Preserve and extend existing booking lifecycle and role model.
- Maintain existing stack conventions (Next.js frontend, Spring Boot backend, PostgreSQL/Flyway).
- Build incrementally, with feature flags where risk is high.

What to do first:
1. Scan current code and produce a gap matrix by persona (Traveller, Partner Admin, Platform Admin).
2. Create or update architecture decision records for each major subsystem you add.
3. Produce an implementation plan grouped into 3 releases:
   - Release A: Conversion + trust foundation
   - Release B: Partner operating system
   - Release C: Marketplace scale + monetization
4. For each release, define:
   - user stories,
   - acceptance criteria,
   - data model changes,
   - API contracts,
   - frontend screens/components,
   - analytics events,
   - test plan.

Mandatory feature delivery scope:
A) Traveller
- Live quote + rate lock with countdown and expiry fallback.
- Full price breakdown: FX rate, markup/spread, service fee, taxes, delivery/pickup fees.
- Booking timeline tracker with status transitions and ETA communication.
- Document upload/verification status and actionable feedback.
- Leftover currency sell-back journey with quote, pickup/store option, payout ETA, settlement state.
- Cancellation/refund workflow with policy-aware outcomes.
- Saved profiles, repeat bookings, trip reminders.

B) Partner (shop owner)
- Partner onboarding workflow (KYB docs, checklist, approval states).
- Branch-aware inventory management by currency.
- Rate engine with configurable spreads and suspicious deviation safeguards.
- Lead inbox with SLA timers, assignment, response templates.
- Staff RBAC (owner/manager/cashier/compliance roles) with maker-checker approvals.
- Settlement and reconciliation exports.
- Conversion funnel analytics dashboard.

C) Platform Admin
- Policy and risk rules engine for suspicious behavior and compliance thresholds.
- Monetization controls (commission plans, featured listings, subscription tiers).
- Audit and privacy controls (PII masking defaults, retention settings).
- Moderation workflow improvements for unsafe community content.

D) Non-functional requirements
- Observability: structured logs, trace IDs, dashboard-ready metrics.
- Security: harden auth, token handling, permission checks, data minimization.
- Reliability: idempotent booking APIs, retries/backoff, race-condition protections.
- Performance: optimize top traveller funnel pages and quote latency.
- Accessibility: WCAG-oriented improvements on critical flows.

Deliverables format:
1. A `docs/product-gap-matrix.md` with prioritized gaps and rationale.
2. A `docs/release-plan.md` with milestones and dependencies.
3. Migration files for schema changes with rollback notes.
4. Updated backend APIs and tests.
5. Updated frontend journeys and component tests.
6. A `docs/metrics-and-events.md` instrumentation map.
7. A final summary listing:
   - implemented stories,
   - deferred stories,
   - known risks,
   - next recommended sprint.

Definition of done:
- Critical traveller and partner journeys are fully functional end-to-end (not static mock-only).
- Role-based permissions and compliance constraints are enforced server-side.
- Tests pass and docs are updated.
- No P2P cash meetup functionality is introduced.
```

---

## 6) Optional focused Codex prompts (by stream)

1. **Traveller conversion optimization stream**: ask Codex to implement quote transparency, checkout confidence UI, and abandonment recovery.
2. **Partner operations stream**: ask Codex to build inventory + SLA + staff approvals.
3. **Compliance/risk stream**: ask Codex for rules engine and suspicious behavior monitoring.
4. **Monetization stream**: ask Codex to implement commission plans and sponsored ranking slots with fairness controls.

