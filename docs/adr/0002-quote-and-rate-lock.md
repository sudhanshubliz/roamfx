# ADR 0002: Server-Side Quote and Rate Lock

## Status

Accepted

## Context

The MVP showed indicative rates but did not persist enough quote detail to explain total payable, sell-back payout, or policy outcomes. Public beta needs transparent quote math and expiry behavior that cannot be bypassed in the browser.

## Decision

- Quote math is generated server-side from verified partner rates.
- Booking records persist locked rate, mid-market rate, spread, markup, service fee, taxes, fulfilment fee, total payable, payout amount, and lock expiry.
- Booking create accepts an optional idempotency key to reduce duplicate bookings caused by retries.
- Cash threshold and KYC rules remain server-side guardrails.

## Consequences

- Frontend components can be replaced without changing policy enforcement.
- The system is ready for future quote latency and conversion instrumentation.
- Future work should add row-level locking or inventory reservation when real stock is decremented.
