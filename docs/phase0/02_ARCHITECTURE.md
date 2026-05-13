# معماری کلان بیزبورد

## سبک معماری

شروع پروژه با Modular Monolith انجام می‌شود؛ یعنی یک backend اصلی NestJS داریم، اما ماژول‌ها از ابتدا طوری جدا می‌شوند که بعداً امکان جدا کردن worker، crawler، search یا payment service وجود داشته باشد.

## لایه‌ها

1. Web App: Next.js، SSR/ISR، صفحات سئو و داشبوردها
2. API App: NestJS، REST، OpenAPI، Auth، Business Logic
3. Worker App: BullMQ jobs، import، price update، email/sms، SEO generation
4. Crawler App: کشف و استخراج داده از منابع مجاز
5. Database: PostgreSQL
6. Cache/Queue: Redis
7. Object Storage: S3-compatible storage
8. AI Layer: tools، prompts، RAG، embeddings، guardrails

## ماژول‌های backend

- auth
- users
- businesses
- merchants
- catalog
- offers
- search
- ai
- crawler
- seo
- reviews
- orders
- payments
- finance
- payouts
- ads
- media
- admin
- analytics
- notifications
- moderation

## جریان داده محصول

1. فروشنده محصول را دستی وارد می‌کند یا CSV/feed می‌دهد.
2. داده وارد raw ingestion می‌شود.
3. normalizer داده را تمیز می‌کند.
4. duplicate matcher محصول را با محصول canonical تطبیق می‌دهد.
5. product و offer ساخته یا به‌روز می‌شوند.
6. price_history ثبت می‌شود.
7. search_vector و embedding ساخته می‌شود.
8. SEO page و sitemap در صورت نیاز revalidate می‌شود.
9. AI Assistant از product/offer/review/SEO chunks برای پاسخ استفاده می‌کند.

## جریان پرداخت

1. کاربر offer داخلی را انتخاب می‌کند.
2. order با pending_payment ساخته می‌شود.
3. payment_attempt با gateway ساخته می‌شود.
4. callback دریافت می‌شود اما تایید نهایی فقط با verify سمت سرور انجام می‌شود.
5. ledger entry برای escrow ثبت می‌شود.
6. فروشنده کالا/خدمت را ارسال/ارائه می‌کند.
7. مشتری تایید می‌کند یا auto-confirm بعد از SLA انجام می‌شود.
8. کارمزد جدا می‌شود.
9. مبلغ payable فروشنده آزاد می‌شود.
10. payout batch و رسید تسویه ثبت می‌شود.

## قانون مهم

هیچ عملیات مالی، تغییر وضعیت order، انتشار صفحه SEO، merge محصول، تایید claim کسب‌وکار یا حذف داده مهم، بدون audit log انجام نمی‌شود.
