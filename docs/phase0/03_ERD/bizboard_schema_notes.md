# توضیح ERD فاز صفر

ERD فاز صفر فقط برای قفل کردن دامنه و ارتباطات اصلی است. جزئیات نهایی constraintها، triggerها و indexها در migration اولیه آمده است.

## اصول طراحی

- هر دامنه schema مستقل دارد.
- هیچ جدول عمومی شبیه postmeta وجود ندارد.
- محصول و پیشنهاد فروش از هم جدا هستند.
- کسب‌وکار و merchant از هم جدا هستند.
- ledger از payment جداست.
- داده خام crawler از داده تمیز catalog جداست.
- AI document/chunk/embedding از entity اصلی جداست.
- SEO page versioning دارد.

## تصمیم‌های قابل بررسی بعدی

- استفاده از PostGIS در production یا فقط lat/lng در MVP
- استفاده از vector در جدول product یا فقط ai_document_chunks
- انتخاب closure table یا ltree برای دسته‌بندی
- اضافه کردن OpenSearch بعد از رشد دیتا
