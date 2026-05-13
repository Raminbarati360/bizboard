# چک‌لیست ساخت اپ در ParsPack PaaS

## قبل از Deploy

- [ ] imageهای `web/admin/api/worker/crawler` در registry موجود هستند.
- [ ] `IMAGE_REGISTRY` و `IMAGE_TAG` در env درست است.
- [ ] `POSTGRES_PASSWORD` قوی است.
- [ ] `DATABASE_URL` با همان password هماهنگ است.
- [ ] `GAPGPT_API_KEY` فقط در env سرویس API تعریف شده است.
- [ ] دامنه‌های staging به سرویس‌های درست وصل شده‌اند.

## تنظیم public access

- [ ] `web` public
- [ ] `api` public
- [ ] `admin` public فقط در صورت نیاز
- [ ] `postgres` private
- [ ] `redis` private
- [ ] `worker` private
- [ ] `crawler` private

## بعد از Deploy

- [ ] `/api/v1/health` ok است.
- [ ] `/api/docs` باز می‌شود.
- [ ] home page چت mock را نشان می‌دهد.
- [ ] migration و seed بدون خطا اجرا شده‌اند.
- [ ] logهای API خطای اتصال DB/Redis ندارند.
