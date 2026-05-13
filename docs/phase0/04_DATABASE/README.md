# دیتابیس فاز صفر

## اجرای پیشنهادی در محیط توسعه

```bash
psql "$DATABASE_URL" -f 001_initial_schema.sql
psql "$DATABASE_URL" -f 002_seed_phase1_categories.sql
psql "$DATABASE_URL" -f 003_seed_attributes.sql
```

## نکات مهم

- pgvector و PostGIS در migration کامنت شده‌اند، چون باید روی سرور نصب باشند.
- اگر پارس‌پک/سرور PostgreSQL extensionها را آماده داشت، خطوط مربوط را فعال کن.
- برای production، migration باید با ابزارهایی مثل Prisma Migrate، Drizzle Kit یا node-pg-migrate مدیریت شود.
- هیچ جدول key/value عمومی برای اطلاعات اصلی ساخته نشده است.
- JSONB فقط برای تنظیمات انعطاف‌پذیر، raw data و content blocks استفاده شده است.
