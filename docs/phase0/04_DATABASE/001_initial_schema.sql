-- Bizboard Phase 0 Initial PostgreSQL Schema
-- Target: PostgreSQL 16+
-- Notes: Requires pgcrypto. pg_trgm is needed for fuzzy search. pgvector/PostGIS are optional but recommended.

CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE EXTENSION IF NOT EXISTS pg_trgm;
CREATE EXTENSION IF NOT EXISTS unaccent;
-- CREATE EXTENSION IF NOT EXISTS vector;
-- CREATE EXTENSION IF NOT EXISTS postgis;

CREATE SCHEMA IF NOT EXISTS auth;
CREATE SCHEMA IF NOT EXISTS directory;
CREATE SCHEMA IF NOT EXISTS catalog;
CREATE SCHEMA IF NOT EXISTS commerce;
CREATE SCHEMA IF NOT EXISTS finance;
CREATE SCHEMA IF NOT EXISTS reviews;
CREATE SCHEMA IF NOT EXISTS ai;
CREATE SCHEMA IF NOT EXISTS crawler;
CREATE SCHEMA IF NOT EXISTS seo;
CREATE SCHEMA IF NOT EXISTS media;
CREATE SCHEMA IF NOT EXISTS admin;
CREATE SCHEMA IF NOT EXISTS analytics;

-- =========================
-- shared updated_at trigger
-- =========================
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- =========================
-- AUTH
-- =========================
CREATE TABLE auth.users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  phone text UNIQUE,
  email text UNIQUE,
  password_hash text,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active','suspended','deleted')),
  role_hint text NOT NULL DEFAULT 'user' CHECK (role_hint IN ('user','business','admin')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT users_phone_or_email CHECK (phone IS NOT NULL OR email IS NOT NULL)
);
CREATE TRIGGER trg_users_updated_at BEFORE UPDATE ON auth.users FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE auth.user_profiles (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text,
  avatar_asset_id uuid,
  city_id uuid,
  preferences jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE TRIGGER trg_user_profiles_updated_at BEFORE UPDATE ON auth.user_profiles FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE auth.roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text NOT NULL UNIQUE,
  title text NOT NULL
);

CREATE TABLE auth.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role_id uuid NOT NULL REFERENCES auth.roles(id) ON DELETE CASCADE,
  scope_type text,
  scope_id uuid,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX ux_user_roles_scope
  ON auth.user_roles (
    user_id,
    role_id,
    COALESCE(scope_type, ''),
    COALESCE(scope_id, '00000000-0000-0000-0000-000000000000'::uuid)
  );

CREATE TABLE auth.sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  refresh_token_hash text NOT NULL,
  user_agent text,
  ip_hash text,
  expires_at timestamptz NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE auth.otp_codes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  destination text NOT NULL,
  code_hash text NOT NULL,
  purpose text NOT NULL,
  attempts int NOT NULL DEFAULT 0,
  expires_at timestamptz NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- =========================
-- MEDIA
-- =========================
CREATE TABLE media.assets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_type text,
  owner_id uuid,
  storage_key text NOT NULL UNIQUE,
  public_url text,
  mime_type text NOT NULL,
  width int,
  height int,
  size_bytes bigint,
  alt_text text,
  checksum text,
  source_url text,
  license_status text NOT NULL DEFAULT 'unknown' CHECK (license_status IN ('unknown','owned','permitted','rejected')),
  created_at timestamptz NOT NULL DEFAULT now()
);

-- =========================
-- DIRECTORY
-- =========================
CREATE TABLE directory.businesses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  business_type text NOT NULL CHECK (business_type IN ('online_shop','local_store','restaurant','service_provider','brand','marketplace_vendor','real_estate','clinic','education','tourism')),
  source_type text NOT NULL DEFAULT 'manual' CHECK (source_type IN ('manual','crawler','import','partner_api','admin','wordpress_migration')),
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','pending','active','suspended','rejected')),
  short_description text,
  description text,
  logo_asset_id uuid REFERENCES media.assets(id) ON DELETE SET NULL,
  cover_asset_id uuid REFERENCES media.assets(id) ON DELETE SET NULL,
  website_url text,
  is_verified boolean NOT NULL DEFAULT false,
  trust_score numeric(5,2) NOT NULL DEFAULT 0,
  rating_avg numeric(3,2) NOT NULL DEFAULT 0,
  rating_count int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_businesses_status ON directory.businesses(status);
CREATE INDEX idx_businesses_name_trgm ON directory.businesses USING gin (name gin_trgm_ops);
CREATE TRIGGER trg_businesses_updated_at BEFORE UPDATE ON directory.businesses FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE directory.business_profiles (
  business_id uuid PRIMARY KEY REFERENCES directory.businesses(id) ON DELETE CASCADE,
  legal_name text,
  national_id text,
  economic_code text,
  about text,
  policies jsonb NOT NULL DEFAULT '{}'::jsonb,
  seo_title text,
  seo_description text,
  ai_summary text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE TRIGGER trg_business_profiles_updated_at BEFORE UPDATE ON directory.business_profiles FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE directory.business_claims (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id uuid NOT NULL REFERENCES directory.businesses(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  claim_method text NOT NULL CHECK (claim_method IN ('phone','email','domain','document')),
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','approved','rejected')),
  evidence jsonb NOT NULL DEFAULT '{}'::jsonb,
  reviewed_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  reviewed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE directory.business_locations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id uuid NOT NULL REFERENCES directory.businesses(id) ON DELETE CASCADE,
  country text NOT NULL DEFAULT 'IR',
  province text,
  city text,
  district text,
  address text,
  lat numeric(10,7),
  lng numeric(10,7),
  is_primary boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_business_locations_business ON directory.business_locations(business_id);

CREATE TABLE directory.business_contacts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id uuid NOT NULL REFERENCES directory.businesses(id) ON DELETE CASCADE,
  type text NOT NULL CHECK (type IN ('phone','mobile','email','whatsapp','telegram','instagram','linkedin','aparat','website')),
  value text NOT NULL,
  is_public boolean NOT NULL DEFAULT true,
  is_verified boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE directory.business_working_hours (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id uuid NOT NULL REFERENCES directory.businesses(id) ON DELETE CASCADE,
  day_of_week smallint NOT NULL CHECK (day_of_week BETWEEN 0 AND 6),
  opens_at time,
  closes_at time,
  is_closed boolean NOT NULL DEFAULT false,
  is_24h boolean NOT NULL DEFAULT false,
  timezone text NOT NULL DEFAULT 'Asia/Tehran'
);

CREATE TABLE directory.business_mini_site_sections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id uuid NOT NULL REFERENCES directory.businesses(id) ON DELETE CASCADE,
  section_type text NOT NULL CHECK (section_type IN ('hero','about','products','services','gallery','menu','reviews','faq','contact','offers','articles','policies','custom')),
  title text,
  content jsonb NOT NULL DEFAULT '{}'::jsonb,
  sort_order int NOT NULL DEFAULT 0,
  is_enabled boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE TRIGGER trg_business_mini_site_sections_updated_at BEFORE UPDATE ON directory.business_mini_site_sections FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- =========================
-- CATALOG
-- =========================
CREATE TABLE catalog.categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_id uuid REFERENCES catalog.categories(id) ON DELETE SET NULL,
  slug text NOT NULL UNIQUE,
  title text NOT NULL,
  description text,
  category_type text NOT NULL CHECK (category_type IN ('product','business','service','content')),
  seo_title text,
  seo_description text,
  ai_content_status text NOT NULL DEFAULT 'draft' CHECK (ai_content_status IN ('draft','needs_review','published')),
  is_indexable boolean NOT NULL DEFAULT true,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_categories_parent ON catalog.categories(parent_id);
CREATE INDEX idx_categories_title_trgm ON catalog.categories USING gin (title gin_trgm_ops);
CREATE TRIGGER trg_categories_updated_at BEFORE UPDATE ON catalog.categories FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE catalog.category_closure (
  ancestor_id uuid NOT NULL REFERENCES catalog.categories(id) ON DELETE CASCADE,
  descendant_id uuid NOT NULL REFERENCES catalog.categories(id) ON DELETE CASCADE,
  depth int NOT NULL,
  PRIMARY KEY (ancestor_id, descendant_id)
);

CREATE TABLE catalog.brands (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  logo_asset_id uuid REFERENCES media.assets(id) ON DELETE SET NULL,
  official_url text,
  description text,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_brands_name_trgm ON catalog.brands USING gin (name gin_trgm_ops);

CREATE TABLE catalog.attributes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text NOT NULL UNIQUE,
  title text NOT NULL,
  data_type text NOT NULL CHECK (data_type IN ('text','number','boolean','select','multiselect','range','date')),
  unit text,
  is_filterable boolean NOT NULL DEFAULT false,
  is_comparable boolean NOT NULL DEFAULT false,
  is_required boolean NOT NULL DEFAULT false
);

CREATE TABLE catalog.category_attributes (
  category_id uuid NOT NULL REFERENCES catalog.categories(id) ON DELETE CASCADE,
  attribute_id uuid NOT NULL REFERENCES catalog.attributes(id) ON DELETE CASCADE,
  priority int NOT NULL DEFAULT 0,
  filter_type text NOT NULL DEFAULT 'checkbox' CHECK (filter_type IN ('checkbox','range','dropdown','search','switch')),
  is_key_attribute boolean NOT NULL DEFAULT false,
  PRIMARY KEY (category_id, attribute_id)
);

CREATE TABLE catalog.attribute_options (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  attribute_id uuid NOT NULL REFERENCES catalog.attributes(id) ON DELETE CASCADE,
  value text NOT NULL,
  label text NOT NULL,
  sort_order int NOT NULL DEFAULT 0,
  UNIQUE (attribute_id, value)
);

CREATE TABLE catalog.products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id uuid NOT NULL REFERENCES catalog.categories(id) ON DELETE RESTRICT,
  brand_id uuid REFERENCES catalog.brands(id) ON DELETE SET NULL,
  title text NOT NULL,
  normalized_title text NOT NULL,
  slug text NOT NULL UNIQUE,
  model_number text,
  gtin text,
  description text,
  ai_summary text,
  specs jsonb NOT NULL DEFAULT '{}'::jsonb,
  rating_avg numeric(3,2) NOT NULL DEFAULT 0,
  rating_count int NOT NULL DEFAULT 0,
  min_price numeric(18,2),
  max_price numeric(18,2),
  offer_count int NOT NULL DEFAULT 0,
  image_asset_id uuid REFERENCES media.assets(id) ON DELETE SET NULL,
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','active','merged','hidden')),
  canonical_product_id uuid REFERENCES catalog.products(id) ON DELETE SET NULL,
  search_vector tsvector,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_products_category_status ON catalog.products(category_id, status);
CREATE INDEX idx_products_brand ON catalog.products(brand_id);
CREATE INDEX idx_products_title_trgm ON catalog.products USING gin (title gin_trgm_ops);
CREATE INDEX idx_products_search_vector ON catalog.products USING gin (search_vector);
CREATE TRIGGER trg_products_updated_at BEFORE UPDATE ON catalog.products FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE catalog.product_assets (
  product_id uuid NOT NULL REFERENCES catalog.products(id) ON DELETE CASCADE,
  asset_id uuid NOT NULL REFERENCES media.assets(id) ON DELETE CASCADE,
  role text NOT NULL DEFAULT 'gallery' CHECK (role IN ('main','gallery','spec','og')),
  sort_order int NOT NULL DEFAULT 0,
  PRIMARY KEY (product_id, asset_id)
);

CREATE TABLE catalog.product_variants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid NOT NULL REFERENCES catalog.products(id) ON DELETE CASCADE,
  sku_key text NOT NULL,
  title text NOT NULL,
  attributes jsonb NOT NULL DEFAULT '{}'::jsonb,
  image_asset_id uuid REFERENCES media.assets(id) ON DELETE SET NULL,
  UNIQUE (product_id, sku_key)
);

CREATE TABLE catalog.product_attribute_values (
  product_id uuid NOT NULL REFERENCES catalog.products(id) ON DELETE CASCADE,
  attribute_id uuid NOT NULL REFERENCES catalog.attributes(id) ON DELETE CASCADE,
  value_text text,
  value_number numeric,
  value_boolean boolean,
  value_json jsonb,
  PRIMARY KEY (product_id, attribute_id)
);

CREATE TABLE catalog.merchants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id uuid NOT NULL REFERENCES directory.businesses(id) ON DELETE CASCADE,
  merchant_type text NOT NULL CHECK (merchant_type IN ('has_website','no_website','marketplace','affiliate')),
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','active','suspended','rejected')),
  feed_status text NOT NULL DEFAULT 'not_connected',
  trust_score numeric(5,2) NOT NULL DEFAULT 0,
  response_rate numeric(5,2),
  avg_shipping_days numeric(6,2),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE TRIGGER trg_merchants_updated_at BEFORE UPDATE ON catalog.merchants FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE catalog.merchant_feeds (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  merchant_id uuid NOT NULL REFERENCES catalog.merchants(id) ON DELETE CASCADE,
  feed_type text NOT NULL CHECK (feed_type IN ('api','xml','csv','sitemap','manual','crawler')),
  url text,
  auth_config_encrypted text,
  schedule_cron text,
  last_run_at timestamptz,
  status text NOT NULL DEFAULT 'inactive' CHECK (status IN ('inactive','active','failed','paused')),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE catalog.product_offers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid NOT NULL REFERENCES catalog.products(id) ON DELETE CASCADE,
  variant_id uuid REFERENCES catalog.product_variants(id) ON DELETE SET NULL,
  merchant_id uuid NOT NULL REFERENCES catalog.merchants(id) ON DELETE CASCADE,
  title_at_merchant text,
  merchant_product_url text,
  internal_checkout_enabled boolean NOT NULL DEFAULT false,
  price numeric(18,2) NOT NULL CHECK (price >= 0),
  old_price numeric(18,2),
  currency text NOT NULL DEFAULT 'IRR',
  availability text NOT NULL DEFAULT 'unknown' CHECK (availability IN ('in_stock','out_of_stock','preorder','unknown')),
  warranty text,
  shipping_info jsonb NOT NULL DEFAULT '{}'::jsonb,
  seller_sku text,
  last_seen_at timestamptz,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active','stale','removed')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_offers_product_availability_price ON catalog.product_offers(product_id, availability, price);
CREATE INDEX idx_offers_merchant_last_seen ON catalog.product_offers(merchant_id, last_seen_at DESC);
CREATE TRIGGER trg_product_offers_updated_at BEFORE UPDATE ON catalog.product_offers FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE catalog.price_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  offer_id uuid NOT NULL REFERENCES catalog.product_offers(id) ON DELETE CASCADE,
  price numeric(18,2) NOT NULL,
  availability text NOT NULL,
  captured_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_price_history_offer_time ON catalog.price_history(offer_id, captured_at DESC);

-- =========================
-- REVIEWS & Q&A
-- =========================
CREATE TABLE reviews.reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  target_type text NOT NULL CHECK (target_type IN ('product','business','order')),
  target_id uuid NOT NULL,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  order_id uuid,
  rating numeric(3,2) NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title text,
  body text,
  pros text[] NOT NULL DEFAULT '{}',
  cons text[] NOT NULL DEFAULT '{}',
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','published','rejected','flagged')),
  is_verified_purchase boolean NOT NULL DEFAULT false,
  sentiment_score numeric(5,2),
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_reviews_target ON reviews.reviews(target_type, target_id, status);

CREATE TABLE reviews.questions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  target_type text NOT NULL CHECK (target_type IN ('product','business')),
  target_id uuid NOT NULL,
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  question text NOT NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','published','rejected')),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE reviews.answers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  question_id uuid NOT NULL REFERENCES reviews.questions(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  business_id uuid REFERENCES directory.businesses(id) ON DELETE SET NULL,
  answer text NOT NULL,
  is_official boolean NOT NULL DEFAULT false,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','published','rejected')),
  created_at timestamptz NOT NULL DEFAULT now()
);

-- =========================
-- COMMERCE & FINANCE
-- =========================
CREATE TABLE commerce.orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE RESTRICT,
  merchant_id uuid NOT NULL REFERENCES catalog.merchants(id) ON DELETE RESTRICT,
  status text NOT NULL DEFAULT 'pending_payment' CHECK (status IN ('pending_payment','paid_pending_fulfillment','processing','shipped','delivered','completed','disputed','cancelled','refunded')),
  total_amount numeric(18,2) NOT NULL CHECK (total_amount >= 0),
  currency text NOT NULL DEFAULT 'IRR',
  customer_note text,
  shipping_address jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_orders_user_status ON commerce.orders(user_id, status);
CREATE INDEX idx_orders_merchant_status ON commerce.orders(merchant_id, status);
CREATE TRIGGER trg_orders_updated_at BEFORE UPDATE ON commerce.orders FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE commerce.order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES commerce.orders(id) ON DELETE CASCADE,
  product_id uuid NOT NULL REFERENCES catalog.products(id) ON DELETE RESTRICT,
  offer_id uuid NOT NULL REFERENCES catalog.product_offers(id) ON DELETE RESTRICT,
  title_snapshot text NOT NULL,
  price numeric(18,2) NOT NULL CHECK (price >= 0),
  quantity int NOT NULL CHECK (quantity > 0),
  status text NOT NULL DEFAULT 'active'
);

CREATE TABLE commerce.payment_attempts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES commerce.orders(id) ON DELETE CASCADE,
  gateway text NOT NULL CHECK (gateway IN ('zarinpal','zibal')),
  amount numeric(18,2) NOT NULL CHECK (amount >= 0),
  status text NOT NULL DEFAULT 'created' CHECK (status IN ('created','redirected','verified','failed','cancelled')),
  authority_or_track_id text,
  ref_id text,
  idempotency_key text NOT NULL UNIQUE,
  gateway_payload jsonb NOT NULL DEFAULT '{}'::jsonb,
  callback_payload jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  verified_at timestamptz
);
CREATE INDEX idx_payment_attempts_order ON commerce.payment_attempts(order_id);

CREATE TABLE finance.ledger_accounts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_type text NOT NULL CHECK (owner_type IN ('bizboard','customer','business','gateway')),
  owner_id uuid,
  account_type text NOT NULL CHECK (account_type IN ('cash','escrow','payable','revenue','refund','fee')),
  currency text NOT NULL DEFAULT 'IRR',
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (owner_type, owner_id, account_type, currency)
);

CREATE TABLE finance.ledger_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  transaction_id uuid NOT NULL,
  account_id uuid NOT NULL REFERENCES finance.ledger_accounts(id) ON DELETE RESTRICT,
  debit numeric(18,2) NOT NULL DEFAULT 0 CHECK (debit >= 0),
  credit numeric(18,2) NOT NULL DEFAULT 0 CHECK (credit >= 0),
  description text,
  reference_type text,
  reference_id uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT ledger_debit_or_credit CHECK ((debit > 0 AND credit = 0) OR (credit > 0 AND debit = 0))
);
CREATE INDEX idx_ledger_entries_transaction ON finance.ledger_entries(transaction_id);
CREATE INDEX idx_ledger_entries_account_time ON finance.ledger_entries(account_id, created_at DESC);

CREATE TABLE finance.settlements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id uuid NOT NULL REFERENCES directory.businesses(id) ON DELETE RESTRICT,
  amount numeric(18,2) NOT NULL CHECK (amount > 0),
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','approved','paid','failed','rejected')),
  destination_iban text,
  batch_id uuid,
  approved_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  paid_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE commerce.disputes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES commerce.orders(id) ON DELETE CASCADE,
  opened_by uuid NOT NULL REFERENCES auth.users(id) ON DELETE RESTRICT,
  reason text NOT NULL,
  status text NOT NULL DEFAULT 'open' CHECK (status IN ('open','in_review','resolved_customer','resolved_business','refunded','rejected')),
  resolution text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE TRIGGER trg_disputes_updated_at BEFORE UPDATE ON commerce.disputes FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- =========================
-- AI
-- =========================
CREATE TABLE ai.conversations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  session_id text,
  intent text NOT NULL DEFAULT 'shopping' CHECK (intent IN ('shopping','business_search','support','seo','business_dashboard')),
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active','closed')),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE ai.messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id uuid NOT NULL REFERENCES ai.conversations(id) ON DELETE CASCADE,
  role text NOT NULL CHECK (role IN ('user','assistant','system','tool')),
  content text NOT NULL,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_ai_messages_conversation_time ON ai.messages(conversation_id, created_at);

CREATE TABLE ai.tool_calls (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id uuid NOT NULL REFERENCES ai.conversations(id) ON DELETE CASCADE,
  tool_name text NOT NULL,
  input jsonb NOT NULL DEFAULT '{}'::jsonb,
  output jsonb NOT NULL DEFAULT '{}'::jsonb,
  status text NOT NULL DEFAULT 'created' CHECK (status IN ('created','succeeded','failed')),
  latency_ms int,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE ai.documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_type text NOT NULL CHECK (entity_type IN ('product','business','category','review','seo_page','article','faq')),
  entity_id uuid NOT NULL,
  title text NOT NULL,
  content text NOT NULL,
  language text NOT NULL DEFAULT 'fa',
  source_type text NOT NULL DEFAULT 'internal',
  quality_score numeric(5,2) NOT NULL DEFAULT 0,
  last_indexed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(entity_type, entity_id, source_type)
);

CREATE TABLE ai.document_chunks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id uuid NOT NULL REFERENCES ai.documents(id) ON DELETE CASCADE,
  chunk_text text NOT NULL,
  chunk_order int NOT NULL DEFAULT 0,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  text_hash text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(document_id, text_hash)
);

-- =========================
-- CRAWLER
-- =========================
CREATE TABLE crawler.sources (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  source_type text NOT NULL CHECK (source_type IN ('website','feed','api','manual','wordpress')),
  name text NOT NULL,
  base_url text,
  robots_policy jsonb NOT NULL DEFAULT '{}'::jsonb,
  crawl_allowed boolean NOT NULL DEFAULT false,
  priority int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE crawler.crawl_jobs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  source_id uuid REFERENCES crawler.sources(id) ON DELETE CASCADE,
  job_type text NOT NULL CHECK (job_type IN ('discover','sitemap','product_page','category_page','business_page','price_check')),
  status text NOT NULL DEFAULT 'queued' CHECK (status IN ('queued','running','succeeded','failed','cancelled')),
  scheduled_at timestamptz NOT NULL DEFAULT now(),
  started_at timestamptz,
  finished_at timestamptz,
  error text
);

CREATE TABLE crawler.crawled_pages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  source_id uuid REFERENCES crawler.sources(id) ON DELETE CASCADE,
  url text NOT NULL,
  url_hash text NOT NULL UNIQUE,
  http_status int,
  content_hash text,
  title text,
  canonical_url text,
  raw_html_asset_id uuid REFERENCES media.assets(id) ON DELETE SET NULL,
  extracted_json jsonb NOT NULL DEFAULT '{}'::jsonb,
  parsed_at timestamptz,
  last_seen_at timestamptz
);

CREATE TABLE crawler.raw_ingestion_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  source_id uuid REFERENCES crawler.sources(id) ON DELETE SET NULL,
  item_type text NOT NULL CHECK (item_type IN ('product','business','offer','category','review')),
  raw_payload jsonb NOT NULL,
  normalized_payload jsonb NOT NULL DEFAULT '{}'::jsonb,
  quality_score numeric(5,2) NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','accepted','rejected','needs_review')),
  error text,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- =========================
-- SEO
-- =========================
CREATE TABLE seo.pages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  page_type text NOT NULL CHECK (page_type IN ('category','brand','product_compare','best_of','local','business','product')),
  slug text NOT NULL UNIQUE,
  canonical_url text,
  title text NOT NULL,
  h1 text NOT NULL,
  meta_description text,
  intro text,
  content_blocks jsonb NOT NULL DEFAULT '[]'::jsonb,
  faq jsonb NOT NULL DEFAULT '[]'::jsonb,
  schema_jsonld jsonb NOT NULL DEFAULT '{}'::jsonb,
  index_status text NOT NULL DEFAULT 'noindex' CHECK (index_status IN ('index','noindex')),
  quality_score numeric(5,2) NOT NULL DEFAULT 0,
  ai_generated boolean NOT NULL DEFAULT false,
  human_review_status text NOT NULL DEFAULT 'pending' CHECK (human_review_status IN ('pending','approved','rejected')),
  published_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_seo_pages_slug_index ON seo.pages(slug, index_status);
CREATE TRIGGER trg_seo_pages_updated_at BEFORE UPDATE ON seo.pages FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE seo.keyword_clusters (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  primary_keyword text NOT NULL,
  intent text NOT NULL CHECK (intent IN ('informational','commercial','transactional','local')),
  category_id uuid REFERENCES catalog.categories(id) ON DELETE SET NULL,
  difficulty_estimate numeric(5,2),
  priority int NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'planned' CHECK (status IN ('planned','draft','published','paused'))
);

-- =========================
-- ADMIN / AUDIT / FLAGS
-- =========================
CREATE TABLE admin.audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  action text NOT NULL,
  entity_type text NOT NULL,
  entity_id uuid,
  before jsonb,
  after jsonb,
  ip_hash text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE admin.feature_flags (
  key text PRIMARY KEY,
  value jsonb NOT NULL DEFAULT '{}'::jsonb,
  enabled boolean NOT NULL DEFAULT false,
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- =========================
-- ANALYTICS
-- =========================
CREATE TABLE analytics.search_queries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  query text NOT NULL,
  normalized_query text NOT NULL,
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  results_count int,
  clicked_entity_type text,
  clicked_entity_id uuid,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_search_queries_normalized ON analytics.search_queries(normalized_query);
