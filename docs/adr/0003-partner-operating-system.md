# ADR 0003: Partner Operating System Foundation

## Status

Accepted

## Context

Authorised forex shop owners need more than public listing pages. They need onboarding, inventory, rate controls, booking workflow, and reconciliation. The MVP only covered partner profile and rates.

## Decision

- Add `partner_onboarding` for KYB checklist and approval states.
- Add `partner_inventory` for branch/currency available, reserved, and reorder amounts.
- Keep partner admin operations behind `/api/partner/**` and platform review behind `/api/admin/**`.
- Audit inventory and onboarding review changes.

## Consequences

- Partner dashboards can move from static cards to operational data.
- Future staff RBAC can attach to partner and branch records.
- Settlement/reconciliation exports can use inventory and booking state as input.
