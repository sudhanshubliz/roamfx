# ADR 0004: API-Backed Traveller Workflows

## Status

Accepted

## Context

Several traveller-facing RoamFX pages were static `PageTemplate` surfaces. That was acceptable for an investor mock, but it did not demonstrate the core marketplace journey: quote, compare, lock, upload KYC metadata, track booking, and sell leftover currency through verified partners.

## Decision

- Replace static traveller dashboard, documents, profile, and partners pages with interactive workflows.
- Keep the frontend API abstraction so pages work in mock mode and can switch to the Spring backend using environment configuration.
- Add DTO-backed backend endpoints for document status and partner operations summary, instead of adding more raw entity exposure for new surfaces.
- Preserve the compliance boundary: all booking and sell-back calls route through verified partner booking APIs.

## Consequences

- The investor demo now better reflects the traveller operating journey.
- Real backend adoption is easier because screens already call API-shaped contracts.
- More work is still needed to add a dedicated booking detail route, E2E tests, and production notification jobs.
