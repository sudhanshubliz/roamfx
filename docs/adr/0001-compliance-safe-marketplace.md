# ADR 0001: Compliance-Safe Marketplace Boundary

## Status

Accepted

## Context

RoamFX must not enable unlicensed peer-to-peer cash currency exchange. Travellers may discover rates, partners, safety guidance, and leftover sell-back intent, but fulfilment must be routed through verified authorised partners subject to KYC and partner acceptance.

## Decision

- Booking creation requires a verified partner.
- Community leftover currency interest is treated as a sell-back lead, not as a P2P listing.
- Google Places and other external discovery sources are informational only unless the partner is onboarded and verified in RoamFX.
- Compliance notices are part of quote, booking, and discovery responses.

## Consequences

- Growth loops are intentionally partner-led rather than user-to-user.
- Some marketplace liquidity is deferred until partner onboarding scales.
- The product has a clearer regulatory posture for public beta.
