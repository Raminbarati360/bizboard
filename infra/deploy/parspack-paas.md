# Deploy روی ParsPack PaaS با Docker Compose — PaaS-only

این پروژه برای شروع روی PaaS پارس‌پک آماده شده و مسیر سرور ابری/SSH ندارد.

## فایل اصلی

```txt
docker-compose.paas.yml
```

کپی همین فایل در مسیر زیر هم وجود دارد:

```txt
infra/parspack/docker-compose.parspack.yml
```

## قانون‌های مهم PaaS

- داخل Compose از `build:` استفاده نکنید.
- داخل Compose از bind-mount مثل `./file:/file` استفاده نکنید.
- imageهای `web`، `admin`، `api`، `worker` و `crawler` باید با CI ساخته و در Registry منتشر شوند.
- env واقعی را فقط در پنل PaaS / Config/Secret وارد کنید.

## مراحل

1. کد را در GitHub/GitLab قرار دهید.
2. Workflow `docker-publish-paas.yml` را اجرا کنید.
3. در ParsPack PaaS، نوع اپلیکیشن را Docker Compose انتخاب کنید.
4. فایل `docker-compose.paas.yml` را آپلود/انتخاب کنید.
5. فایل env را از `.env.paas.example` بسازید و در PaaS وارد کنید.
6. public access را فقط برای `web`، `api` و در صورت نیاز `admin` فعال کنید.
7. `postgres`، `redis`، `worker` و `crawler` باید private باشند.

## migration و seed

برای Sprint 0، migration و seed با startup سرویس API اجرا می‌شوند:

```txt
RUN_MIGRATIONS_ON_START=true
```

بعد از پایدار شدن staging، این مقدار را `false` کنید و migration را در release workflow کنترل‌شده اجرا کنید.

## تست نهایی

```txt
https://staging.bizboard.co
https://api-staging.bizboard.co/api/v1/health
https://api-staging.bizboard.co/api/docs
```
