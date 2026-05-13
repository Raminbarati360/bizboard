# Runbook عملیاتی بیزبورد

## Health checks

- API: `GET /api/v1/health`
- Web: `GET /api/health`
- Admin: `GET /api/health`

## Secret policy

- هیچ secret داخل Git ذخیره نمی‌شود.
- `.env` فقط روی محیط deploy است.
- `.env.production.example` فقط template است.

## Backup

- PostgreSQL: روزانه، نگهداری حداقل ۷ روز.
- Restore test: حداقل ماهی یک‌بار.
- Object storage جداگانه backup شود.

## Payment safety

- callback درگاه بدون verify سمت سرور معتبر نیست.
- تغییر status سفارش باید idempotent باشد.
- هر تغییر مالی باید audit log و ledger entry داشته باشد.

## SEO safety

- خروجی AI مستقیم index نشود.
- صفحه filter بی‌ارزش noindex شود.
- schemaهای Product/Offer/Breadcrumb/FAQ باید validate شوند.
