# استقرار بیزبورد روی ParsPack PaaS — نسخه PaaS-only v1.2

این نسخه برای حالتی ساخته شده که نمی‌خواهید از سرور ابری پارس‌پک استفاده کنید. مسیر اجرا فقط PaaS است.

## تصمیم قطعی

- مسیر سرور ابری، SSH، Caddy/Nginx و bootstrap سرور از برنامه شروع حذف شده است.
- Build داخل ParsPack Docker Compose انجام نمی‌شود.
- imageها باید بیرون از پارس‌پک، مثلاً با GitHub Actions، ساخته و در Registry منتشر شوند.
- PaaS فقط image آماده + env + Docker Compose را اجرا می‌کند.

## فایل اصلی PaaS

```txt
docker-compose.paas.yml
```

همین فایل در این مسیر هم کپی شده است:

```txt
infra/parspack/docker-compose.parspack.yml
```

این Compose هیچ `build:` و هیچ bind-mount مثل `./path:/path` ندارد.

## ترتیب اجرا در PaaS

1. ریپو را روی GitHub/GitLab بسازید.
2. فایل‌های پروژه را push کنید.
3. Workflow زیر را اجرا کنید تا imageها ساخته و push شوند:

```txt
.github/workflows/docker-publish-paas.yml
```

4. در ParsPack PaaS نوع برنامه را Docker Compose انتخاب کنید.
5. فایل `docker-compose.paas.yml` را بدهید.
6. فایل env را از `.env.paas.example` بسازید و در پنل PaaS آپلود/تعریف کنید.
7. فقط سرویس‌های زیر public باشند:
   - `web`
   - `api`
   - `admin`، فقط اگر پنل جدا می‌خواهید
8. سرویس‌های زیر private بمانند:
   - `postgres`
   - `redis`
   - `worker`
   - `crawler`

## دامنه‌ها

در پنل PaaS دامنه‌ها را به سرویس‌ها وصل کنید:

```txt
staging.bizboard.co       -> web:3000
api-staging.bizboard.co   -> api:4000
admin-staging.bizboard.co -> admin:3001
```

SSL و routing از سمت PaaS مدیریت می‌شود؛ برای شروع نیازی به Caddy یا Nginx داخل پروژه نیست.

## migration و seed در Sprint 0

برای اینکه staging بدون SSH و بدون سرور بالا بیاید، در `docker-compose.paas.yml` برای سرویس `api` این گزینه فعال است:

```txt
RUN_MIGRATIONS_ON_START=true
```

با این کار، API قبل از شروع NestJS این دو دستور را اجرا می‌کند:

```txt
pnpm --filter @bizboard/database migrate
pnpm --filter @bizboard/database seed
```

این کار برای Sprint 0 و staging خوب است. بعد از پایدار شدن staging، مقدار را `false` کنید و migration را به release step کنترل‌شده در CI/CD منتقل کنید.

## متغیرهای ضروری

```txt
IMAGE_REGISTRY
IMAGE_TAG
POSTGRES_PASSWORD
DATABASE_URL
REDIS_URL
JWT_ACCESS_SECRET
JWT_REFRESH_SECRET
GAPGPT_API_KEY
GAPGPT_BASE_URL
NEXT_PUBLIC_WEB_URL
NEXT_PUBLIC_API_URL
API_CORS_ORIGINS
```

هیچ secret نباید داخل frontend یا Git commit شود.

## تست بعد از Deploy

```txt
https://staging.bizboard.co
https://api-staging.bizboard.co/api/v1/health
https://api-staging.bizboard.co/api/docs
```

## معیار Go برای staging

- صفحه web باز شود.
- API health مقدار `ok: true` بدهد.
- Swagger باز شود.
- migration و seed اولیه اجرا شده باشد.
- دیتابیس PostgreSQL غیروردپرسی باشد.
- Redis وصل باشد.
- کلید GapGPT فقط در env سرویس API باشد.
- worker و crawler public نباشند.

## نکته مهم درباره دیتابیس داخل PaaS

در این نسخه، PostgreSQL و Redis برای سرعت شروع داخل Compose آمده‌اند و volume نام‌دار دارند. برای production یا بعد از رشد، دیتابیس و Redis بهتر است به سرویس مدیریت‌شده/جدا منتقل شوند تا backup، restore و scaling کنترل‌شده‌تر شود.
