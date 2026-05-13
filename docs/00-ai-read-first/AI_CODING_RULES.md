# AI_CODING_RULES — قوانین اجباری کدنویسی با AI

## 1. قبل از کدنویسی

- اول این فایل و `AI_CONTEXT.md` را بخوان.
- برای هر فیچر، فایل feature request را تحلیل کن.
- قبل از کد، Technical Plan بده.
- بدون برنامه، مستقیم کد نزن.
- اگر ابهام حیاتی وجود دارد، فرضیات را شفاف بنویس.

## 2. محدودیت تغییرات

- فقط فایل‌های لازم را تغییر بده.
- refactor بزرگ بدون درخواست صریح ممنوع است.
- dependency جدید فقط با دلیل قانع‌کننده اضافه شود.
- migration، OpenAPI، تست و مستندات با کد هماهنگ شوند.

## 3. Backend

- NestJS module/service/controller pattern رعایت شود.
- Validation با DTO انجام شود.
- هیچ SQL string ناامن نوشته نشود.
- برای لیست‌های بزرگ pagination cursor-based استفاده شود.
- عملیات مالی idempotent باشد.
- هر عملیات حساس audit log داشته باشد.

## 4. Database

- هیچ جدول postmeta/key-value عمومی برای داده اصلی نساز.
- تغییر دیتابیس فقط با migration انجام شود.
- constraint و index را فراموش نکن.
- JSONB فقط برای داده نیمه‌ساخت‌یافته مجاز است.
- product و offer را قاطی نکن.
- payment و ledger را قاطی نکن.

## 5. Frontend

- RTL و فارسی از ابتدا رعایت شود.
- Mobile-first طراحی شود.
- loading، empty، error و skeleton state داشته باشد.
- componentهای مشترک داخل design system باشد.
- صفحه‌های SEO با SSR/ISR ساخته شوند.

## 6. AI Assistant

- پاسخ AI باید از tool/RAG/دیتا پشتیبانی شود.
- اگر دیتا ناقص است، صادقانه بگو.
- قیمت باید با زمان آخرین بروزرسانی نمایش داده شود.
- تبلیغ با پیشنهاد ارگانیک قاطی نشود.
- خروجی AI برای UI باید structured JSON داشته باشد.

## 7. تست

حداقل چک‌ها:

- typecheck
- lint
- unit test
- integration test برای APIهای حساس
- migration test
- build

## 8. Pull Request Summary

بعد از هر تغییر بنویس:

- چه چیزی اضافه شد؟
- چه فایل‌هایی تغییر کرد؟
- چطور تست شد؟
- چه ریسک‌هایی باقی مانده؟
- چه چیزی نیاز به review انسانی دارد؟
