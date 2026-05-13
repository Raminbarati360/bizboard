# پلن اجرایی بیزبورد — فقط ParsPack PaaS

## هدف Sprint 0

بالا آوردن staging سالم روی PaaS پارس‌پک، بدون سرور ابری، SSH، Docker Desktop یا اجرای local-first.

## معماری اجرایی

- `web`: Next.js public frontend
- `admin`: Next.js admin shell
- `api`: NestJS API + Swagger + health
- `worker`: BullMQ jobs
- `crawler`: crawler/import jobs
- `postgres`: PostgreSQL 16 داخل Compose برای Sprint 0
- `redis`: Redis 7 داخل Compose برای Sprint 0

## مسیر Deploy

1. ساخت Git repository.
2. Push کردن همین monorepo.
3. اجرای GitHub Action برای build و push imageها.
4. ساخت اپلیکیشن Docker Compose در ParsPack PaaS.
5. آپلود/تعریف `docker-compose.paas.yml` و `.env.paas.example` با مقدارهای واقعی.
6. اتصال دامنه‌ها:
   - `staging.bizboard.co` -> `web:3000`
   - `api-staging.bizboard.co` -> `api:4000`
   - `admin-staging.bizboard.co` -> `admin:3001`
7. public کردن فقط web/api/admin.
8. private نگه داشتن postgres/redis/worker/crawler.

## خروجی قابل قبول

- home page باز شود.
- `/api/v1/health` مقدار ok بدهد.
- `/api/docs` باز شود.
- migration و seed اولیه اجرا شده باشد.
- صفحه AI-first با chat mock دیده شود.
- secretها فقط در env پنل PaaS باشند.

## نکته مهم migration

در Sprint 0 مقدار `RUN_MIGRATIONS_ON_START=true` است تا staging بدون دسترسی shell بالا بیاید. در Sprintهای بعدی باید migration به release pipeline منتقل شود.
