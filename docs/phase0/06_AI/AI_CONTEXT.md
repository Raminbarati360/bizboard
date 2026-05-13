# AI_CONTEXT — زمینه ثابت پروژه بیزبورد برای AI برنامه‌نویس

تو روی پروژه بیزبورد کار می‌کنی.

بیزبورد یک سایت رتبه‌بندی، مقایسه و خرید هوشمند است. فاز اول محصول‌محور است و باید به کاربر کمک کند محصول مناسب را پیدا کند، فروشنده‌ها را مقایسه کند و در صورت نیاز از فروشنده بدون سایت، داخل بیزبورد خرید کند.

## هسته محصول

- کاربر وسط صفحه با AI Assistant چت می‌کند.
- AI باید از دیتابیس محصولات، offerها، فروشنده‌ها، نقدها، قیمت‌ها و صفحات SEO استفاده کند.
- AI نباید بدون داده واقعی پیشنهاد قطعی بدهد.
- فروشنده دارای سایت می‌تواند لینک خروجی داشته باشد.
- فروشنده بدون سایت از مینی‌سایت بیزبورد و checkout داخلی استفاده می‌کند.
- پول پرداخت‌شده اول وارد حساب بیزبورد و ledger escrow می‌شود، سپس بعد از تایید/پایان بازه اعتراض قابل تسویه است.

## تکنولوژی

- Backend: Node.js + TypeScript + NestJS
- Frontend: Next.js + React + TypeScript
- UI: Tailwind CSS + RTL Design System
- Database: PostgreSQL
- Queue/Cache: Redis + BullMQ
- Object Storage: S3-compatible
- API: REST + OpenAPI
- Architecture: Modular Monolith

## دامنه‌های اصلی

- auth
- directory
- catalog
- commerce
- finance
- reviews
- ai
- crawler
- seo
- media
- admin
- analytics

## قانون حیاتی دیتابیس

پروژه نباید شبیه WordPress/MySQL ساخته شود. هیچ مدل عمومی مثل posts/postmeta مجاز نیست. هر entity جدول واقعی خودش را دارد.

## فاز اول دسته‌ها

- موبایل و لوازم جانبی
- لپ‌تاپ و کامپیوتر
- لوازم خانگی دیجیتال و برقی
- صوتی و تصویری
- گجت و کالای هوشمند

## صفحات اصلی

- صفحه اصلی AI-first
- صفحه جستجو/اکسپلور
- صفحه دسته‌بندی محصول
- صفحه محصول
- صفحه فروشگاه/مینی‌سایت
- صفحه مقایسه
- داشبورد کسب‌وکار
- پنل ادمین

## اصول سئو

- SSR/ISR در Next.js
- URL پایدار و کوتاه
- title/h1/meta دقیق
- schema JSON-LD برای Product/Offer/Breadcrumb/FAQ
- noindex برای صفحات فیلتر بی‌ارزش
- human/quality review برای محتوای AI-generated

## اصول توسعه با AI

هر فیچر جدید باید قبل از کدنویسی این خروجی‌ها را داشته باشد:

1. Technical Plan
2. فایل‌های درگیر
3. تغییرات دیتابیس و migration
4. تغییرات OpenAPI
5. تست‌های لازم
6. اثر روی security، finance، SEO، AI و performance
7. PR Summary
