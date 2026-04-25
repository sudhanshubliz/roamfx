CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  phone TEXT,
  country TEXT,
  kyc_status TEXT NOT NULL,
  role TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE partners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_name TEXT NOT NULL,
  license_type TEXT NOT NULL,
  license_number TEXT NOT NULL,
  verification_status TEXT NOT NULL,
  address TEXT,
  city TEXT,
  state TEXT,
  country TEXT,
  latitude NUMERIC(12,8),
  longitude NUMERIC(12,8),
  contact_phone TEXT,
  contact_email TEXT,
  opening_hours TEXT,
  supports_pickup BOOLEAN NOT NULL DEFAULT false,
  supports_delivery BOOLEAN NOT NULL DEFAULT false,
  supports_cash_payment BOOLEAN NOT NULL DEFAULT false,
  supports_digital_payment BOOLEAN NOT NULL DEFAULT true,
  rating NUMERIC(3,2) NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_partners_city_country ON partners(city, country);
CREATE INDEX idx_partners_lat_lng ON partners(latitude, longitude);

CREATE TABLE currencies (
  code VARCHAR(3) PRIMARY KEY,
  name TEXT NOT NULL,
  symbol TEXT,
  active BOOLEAN NOT NULL DEFAULT true
);

CREATE TABLE exchange_rates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id UUID NOT NULL REFERENCES partners(id),
  source_currency VARCHAR(3) NOT NULL,
  target_currency VARCHAR(3) NOT NULL,
  buy_rate NUMERIC(18,6) NOT NULL,
  sell_rate NUMERIC(18,6) NOT NULL,
  mid_market_rate NUMERIC(18,6) NOT NULL,
  markup_percent NUMERIC(8,4) NOT NULL,
  service_fee NUMERIC(18,2) NOT NULL,
  available_amount NUMERIC(18,2) NOT NULL,
  last_updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_exchange_rates_pair ON exchange_rates(source_currency, target_currency);

CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_reference TEXT NOT NULL UNIQUE,
  traveller_id UUID NOT NULL REFERENCES users(id),
  partner_id UUID NOT NULL REFERENCES partners(id),
  booking_type TEXT NOT NULL,
  source_currency VARCHAR(3),
  target_currency VARCHAR(3),
  source_amount NUMERIC(18,2),
  target_amount_estimate NUMERIC(18,2),
  locked_rate NUMERIC(18,6),
  service_fee NUMERIC(18,2),
  total_payable NUMERIC(18,2),
  payment_mode TEXT,
  fulfilment_mode TEXT,
  status TEXT NOT NULL,
  travel_country TEXT,
  travel_date DATE,
  purpose_of_travel TEXT,
  notes TEXT,
  rate_lock_expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_bookings_traveller ON bookings(traveller_id);
CREATE INDEX idx_bookings_partner ON bookings(partner_id);
CREATE INDEX idx_bookings_status ON bookings(status);

CREATE TABLE kyc_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id),
  booking_id UUID REFERENCES bookings(id),
  document_type TEXT,
  file_name TEXT,
  file_url TEXT,
  verification_status TEXT,
  rejection_reason TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_kyc_documents_booking ON kyc_documents(booking_id);

CREATE TABLE community_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id),
  post_type TEXT,
  destination_country TEXT,
  currency_code VARCHAR(3),
  content TEXT,
  status TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_community_destination ON community_posts(destination_country);

CREATE TABLE partner_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id UUID NOT NULL REFERENCES partners(id),
  user_id UUID NOT NULL REFERENCES users(id),
  booking_id UUID NOT NULL UNIQUE REFERENCES bookings(id),
  rating INT NOT NULL,
  comment TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_email TEXT,
  action TEXT,
  target_type TEXT,
  target_id TEXT,
  metadata TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE platform_settings (
  setting_key TEXT PRIMARY KEY,
  setting_value TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
