# Technical Plan — شروع بیزبورد فقط روی ParsPack PaaS

## هدف

بالا آوردن staging بیزبورد روی PaaS پارس‌پک بدون استفاده از سرور ابری، SSH، Docker Desktop یا اجرای local-first.

## تصمیم‌های اجرایی

1. اپلیکیشن به شکل monorepo Node.js نگه داشته می‌شود.
2. imageها خارج از PaaS با CI ساخته می‌شوند.
3. PaaS فقط image آماده، env و Docker Compose را دریافت می‌کند.
4. برای Compose در PaaS هیچ `build:` و bind-mount استفاده نمی‌شود.
5. دامنه و SSL از پنل PaaS مدیریت می‌شود.
6. PostgreSQL و Redis در Sprint 0 داخل Compose هستند؛ بعداً می‌توانند جدا/managed شوند.
7. API در Sprint 0 migration/seed را در startup اجرا می‌کند تا staging بدون shell بالا بیاید.

## سرویس‌ها

- `web`: Next.js public site
- `admin`: Next.js admin shell
- `api`: NestJS API + Swagger + health
- `worker`: BullMQ jobs
- `crawler`: crawler/import jobs
- `postgres`: PostgreSQL 16
- `redis`: Redis 7

## فایل‌های اصلی

- `docker-compose.paas.yml`
- `.env.paas.example`
- `.github/workflows/docker-publish-paas.yml`
- `infra/docker/*.Dockerfile`
- `README_DEPLOY_PARSPACK_PAAS.md`

## مراحل CI/CD

1. Push به branch `main` یا اجرای دستی workflow.
2. Build پنج image: web, admin, api, worker, crawler.
3. Push به GHCR یا registry خصوصی.
4. Deploy در ParsPack PaaS با Compose.
5. API اجرا می‌شود، migration/seed را انجام می‌دهد و بعد NestJS را شروع می‌کند.
6. health و Swagger تست می‌شوند.

## ریسک‌ها

- اجرای migration در startup برای production ایده‌آل نیست؛ فقط برای Sprint 0 staging مجاز است.
- اگر چند replica از API فعال شود، migration ممکن است هم‌زمان اجرا شود؛ تا قبل از release pipeline، replica API را 1 نگه دارید.
- PostgreSQL داخل Compose برای شروع سریع خوب است، اما backup و restore باید زودتر برنامه‌ریزی شود.
