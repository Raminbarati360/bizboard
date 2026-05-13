# Promptهای آماده توسعه با AI

## ساخت قابلیت جدید

این پروژه بیزبورد است. اول `AI_CONTEXT.md` و `AI_CODING_RULES.md` را بخوان. سپس feature request زیر را تحلیل کن. قبل از کدنویسی Technical Plan بده. بدون migration، test و OpenAPI کدنویسی نکن. فقط فایل‌های لازم را تغییر بده.

## اصلاح باگ

این باگ را بر اساس لاگ و رفتار توضیح داده‌شده پیدا کن. اول root cause بنویس. سپس حداقل تغییر لازم را پیشنهاد بده. تستی اضافه کن که دوباره این باگ تکرار نشود.

## ساخت صفحه فرانت

این صفحه را فقط با کامپوننت‌های design system بساز. RTL، mobile-first، loading، empty، error و skeleton state را رعایت کن. API جدید نساز مگر اینکه در plan توضیح داده باشی.

## ساخت migration

برای این تغییر دیتابیس migration بنویس. constraint، index، backfill strategy و ریسک lock شدن جدول را توضیح بده. اگر جدول بزرگ است، migration را مرحله‌ای کن.

## ساخت محتوای SEO

برای این دسته/کلمه کلیدی صفحه SEO ساختارمند بساز. خروجی باید شامل h1، meta title، meta description، intro، FAQ، comparison block، internal links و schema JSON باشد. محتوای تکراری یا ادعای غیرقابل اثبات ننویس.

## ساخت ابزار AI

برای این نیاز، tool schema طراحی کن. ورودی و خروجی JSON، validation، خطاها، محدودیت‌ها، permission و تست را مشخص کن. tool نباید داده غیرمعتبر یا تبلیغ را با نتیجه ارگانیک قاطی کند.
