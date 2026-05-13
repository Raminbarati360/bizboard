# استقرار روی پارس‌پک — طرح فاز صفر

## حالت شروع پیشنهادی

برای شروع از Docker Compose روی سرور ابری یا PaaS استفاده می‌شود:

- web: Next.js
- api: NestJS
- worker: BullMQ worker
- crawler: crawler worker محدود
- postgres: بهتر است managed یا سرور جدا باشد؛ در dev می‌تواند container باشد.
- redis: cache/queue
- nginx/caddy: reverse proxy + SSL

## دامنه‌ها

- `bizboard.co` یا دامنه اصلی برای web
- `api.bizboard.co` برای API
- `admin.bizboard.co` در صورت جداسازی پنل ادمین
- `cdn.bizboard.co` برای assets در صورت اتصال CDN/object storage

## متغیرهای حساس

- Secretها در Git ذخیره نشوند.
- `.env.example` فقط template است.
- برای production از secret manager یا env panel پارس‌پک استفاده شود.

## Backup

- backup روزانه PostgreSQL
- نگهداری حداقل ۷ روز backup در شروع
- تست restore حداقل ماهی یک‌بار
- backup فایل‌های object storage جدا از دیتابیس

## مانیتورینگ حداقلی

- Sentry برای خطا
- health endpoint برای web/api
- log rotation
- alert برای disk، memory، cpu، database connection، queue backlog
