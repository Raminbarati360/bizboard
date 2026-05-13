# Bizboard — PaaS-first Node.js/NestJS Monorepo

این ریپو اسکلت شروع بیزبورد روی ParsPack PaaS است؛ نه سرور ابری و نه local-first.

## Stack

- `apps/web`: Next.js + React + TypeScript
- `apps/admin`: Next.js admin shell
- `apps/api`: NestJS + TypeScript
- `apps/worker`: Node.js + BullMQ
- `apps/crawler`: Node.js crawler/ingestion worker
- `packages/database`: PostgreSQL migrations/seeds
- `packages/ai-core`: provider-agnostic AI gateway contracts

## PaaS deployment files

- `docker-compose.paas.yml`
- `infra/parspack/docker-compose.parspack.yml`
- `.env.paas.example`
- `README_DEPLOY_PARSPACK_PAAS.md`

در ParsPack PaaS از `build:` داخل Compose استفاده نمی‌کنیم. imageها با GitHub Actions ساخته و به Registry push می‌شوند.

## First target URLs

- `https://staging.bizboard.co`
- `https://api-staging.bizboard.co/api/v1/health`
- `https://api-staging.bizboard.co/api/docs`

## AI development rules

قبل از هر فیچر، فایل‌های زیر خوانده شوند:

- `docs/ai/AI_CONTEXT.md`
- `docs/ai/AI_CODING_RULES.md`
- `docs/feature-request-template.md`

هیچ provider AI مستقیم در business logic صدا زده نمی‌شود؛ همه چیز باید از AiRouterService عبور کند.
