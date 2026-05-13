# استراتژی تست MVP

## Unit Test

- normalization فارسی
- pricing utilities
- ranking formula
- payment state machine
- ledger calculations
- AI tool input validation
- SEO schema builders

## Integration Test

- auth OTP flow
- product search
- create business
- create product/offer
- AI search tool
- order creation
- payment callback verify mock
- ledger transaction
- admin moderation

## E2E Test

- کاربر محصول را سرچ کند و offer ببیند.
- کاربر با AI سوال خرید بپرسد و پیشنهاد بگیرد.
- فروشنده محصول ثبت کند.
- کاربر سفارش داخلی بسازد و پرداخت mock موفق شود.
- ادمین raw item را تایید کند.

## Migration Test

- migration روی دیتابیس خالی اجرا شود.
- seed اجرا شود.
- rollback strategy برای migrationهای خطرناک نوشته شود.

## Performance Smoke

- GET /products با ۱۰ هزار محصول تست شود.
- GET /category با cache تست شود.
- AI endpoint timeout مناسب داشته باشد.
