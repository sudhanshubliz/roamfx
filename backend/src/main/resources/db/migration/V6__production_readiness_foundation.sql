-- Production-readiness foundation for quote transparency, sell-back settlement,
-- partner onboarding, and branch-aware inventory.
--
-- Rollback notes:
--   1. Drop partner_inventory and partner_onboarding first.
--   2. Drop the added nullable bookings columns and unique index.
--   3. No existing MVP booking data is rewritten by this migration.

ALTER TABLE bookings
  ADD COLUMN mid_market_rate NUMERIC(18,6),
  ADD COLUMN spread_amount NUMERIC(18,2),
  ADD COLUMN markup_amount NUMERIC(18,2),
  ADD COLUMN taxes NUMERIC(18,2),
  ADD COLUMN fulfilment_fee NUMERIC(18,2),
  ADD COLUMN payout_amount NUMERIC(18,2),
  ADD COLUMN settlement_state TEXT NOT NULL DEFAULT 'NOT_REQUIRED',
  ADD COLUMN cancellation_outcome TEXT,
  ADD COLUMN payout_eta TIMESTAMPTZ,
  ADD COLUMN refund_amount NUMERIC(18,2),
  ADD COLUMN cancellation_reason TEXT,
  ADD COLUMN idempotency_key TEXT;

CREATE UNIQUE INDEX idx_bookings_idempotency_key
  ON bookings(idempotency_key)
  WHERE idempotency_key IS NOT NULL;

CREATE TABLE partner_onboarding (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id UUID NOT NULL UNIQUE REFERENCES partners(id),
  status TEXT NOT NULL DEFAULT 'DRAFT',
  kyb_checklist_json TEXT,
  submitted_at TIMESTAMPTZ,
  reviewed_at TIMESTAMPTZ,
  reviewer_email TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE partner_inventory (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id UUID NOT NULL REFERENCES partners(id),
  branch_name TEXT NOT NULL,
  currency_code VARCHAR(3) NOT NULL,
  available_amount NUMERIC(18,2) NOT NULL DEFAULT 0,
  reserved_amount NUMERIC(18,2) NOT NULL DEFAULT 0,
  reorder_level NUMERIC(18,2) NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_partner_inventory_partner_currency ON partner_inventory(partner_id, currency_code);

INSERT INTO partner_onboarding (partner_id, status, kyb_checklist_json, reviewed_at, reviewer_email, notes)
SELECT id, 'APPROVED',
  '{"licenseVerified":true,"bankAccountVerified":true,"kybDocuments":["license","gst","address_proof"],"makerCheckerRequired":true}',
  now(),
  'admin@roamfx.app',
  'Seed partner approved for beta demo.'
FROM partners
WHERE verification_status = 'VERIFIED'
ON CONFLICT DO NOTHING;

INSERT INTO partner_inventory (partner_id, branch_name, currency_code, available_amount, reserved_amount, reorder_level)
SELECT id, business_name || ' Main Branch', currency_code, available_amount, 0, available_amount * 0.15
FROM partners
CROSS JOIN (VALUES
  ('USD', 95000::NUMERIC),
  ('EUR', 65000::NUMERIC),
  ('GBP', 26000::NUMERIC),
  ('AED', 180000::NUMERIC)
) AS seed(currency_code, available_amount)
WHERE verification_status = 'VERIFIED';
