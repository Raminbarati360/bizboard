# Sprint Backlog پیشنهادی MVP

## Sprint 0 — Foundation

- راه‌اندازی monorepo
- راه‌اندازی Next.js و NestJS
- Docker Compose dev
- اتصال PostgreSQL و Redis
- migration اولیه
- seed دسته‌ها و attributeها
- OpenAPI setup
- CI اولیه

## Sprint 1 — Auth + Catalog Base

- OTP auth mock/واقعی
- roles و RBAC پایه
- category API
- product model/service/controller
- product list/detail frontend
- basic search با pg_trgm/FTS

## Sprint 2 — Business + Mini-site

- create business
- business profile
- merchant model
- mini-site page
- business dashboard shell
- product creation by merchant

## Sprint 3 — Offers + Search + SEO

- product offers
- offer table
- category page SSR/ISR
- SEO metadata/schema
- sitemap/robots
- search filters

## Sprint 4 — AI Assistant MVP

- ai conversations/messages
- tool schemas
- search_products tool
- get_product_offers tool
- compare_products tool ساده
- AI chat UI در صفحه اصلی
- structured response UI

## Sprint 5 — Orders + Payment + Ledger

- order creation
- payment_attempt
- gateway mock adapter
- Zarinpal/Zibal adapter interface
- payment callback idempotency
- ledger accounts/entries
- order status flow

## Sprint 6 — Admin + Moderation

- admin shell
- users/businesses/products/offers list
- raw ingestion review پایه
- SEO pages list/review
- audit logs
- feature flags

## Sprint 7 — Business Panel Enhancements

- CSV import ساده
- product completeness
- orders dashboard
- reviews/Q&A base
- analytics پایه کلیک/بازدید
- KYC/KYB فرم اولیه

## Sprint 8 — Launch Hardening

- QA full pass
- security checklist
- SEO checklist
- payment test cases
- performance smoke
- backup/restore test
- production env docs
