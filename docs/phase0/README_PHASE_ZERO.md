# فاز صفر بیزبورد — بسته آماده شروع ساخت

این پوشه «فاز صفر اجرایی» بیزبورد است؛ یعنی قبل از اینکه کدنویسی MVP شروع شود، قراردادهای اصلی پروژه، دیتابیس، API، AI Rules، وایرفریم‌ها، DevOps، SEO، پرداخت، QA و چک‌لیست Go/No-Go آماده شده‌اند.

هدف فاز صفر این نیست که کل سایت را بسازد؛ هدف این است که پروژه از روز اول طوری پایه‌گذاری شود که:

- شبیه WordPress/MySQL و postmeta نشود.
- با PostgreSQL، Node.js/NestJS، Next.js و Redis ساخته شود.
- برای AI coding آماده باشد.
- هر فیچر جدید با migration، OpenAPI، تست و مستندات اضافه شود.
- هوش مصنوعی وسط محصول باشد، نه فقط یک chatbot کنار سایت.
- سیستم محصول، فروشگاه، مینی‌سایت، سئو، پرداخت و ledger از ابتدا جدا و تمیز طراحی شود.

## خروجی‌های داخل این بسته

1. چک‌لیست Go/No-Go قبل از شروع کدنویسی
2. قفل دامنه MVP و دسته‌های شروع
3. معماری کلان Modular Monolith
4. ERD Mermaid
5. Migration اولیه PostgreSQL
6. Seed دسته‌بندی‌های فاز اول و attributeهای اصلی
7. OpenAPI اولیه backend
8. فایل‌های مخصوص AI coding
9. وایرفریم‌های متنی صفحات اصلی
10. Design Tokens و Component Inventory
11. Docker Compose توسعه
12. Env Example
13. SEO launch checklist و robots/sitemap strategy
14. Payment/Ledger flow
15. Scope پنل ادمین و پنل کسب‌وکار
16. QA، Security، Privacy و Legal checklist
17. Sprint backlog پیشنهادی MVP
18. اسکلت monorepo برای شروع ساخت

## ترتیب استفاده پیشنهادی

1. فایل `00_GO_NO_GO_CHECKLIST.md` را تکمیل کن.
2. فایل `01_SCOPE_LOCK_MVP.md` را قفل کن و چیز جدید وارد MVP نکن.
3. فایل‌های `06_AI/AI_CONTEXT.md` و `06_AI/AI_CODING_RULES.md` را به AI برنامه‌نویس بده.
4. از `04_DATABASE/001_initial_schema.sql` برای ساخت دیتابیس dev استفاده کن.
5. از `05_API/openapi.yaml` قرارداد API را مبنا قرار بده.
6. از `14_PROJECT_SCAFFOLD` برای ساخت monorepo واقعی استفاده کن.
7. هر فیچر جدید را با قالب `06_AI/AI_FEATURE_TEMPLATE.md` تعریف کن.

## تصمیم فنی قطعی فاز صفر

- Backend: Node.js + TypeScript + NestJS
- Frontend: Next.js + React + TypeScript + Tailwind + RTL Design System
- Database: PostgreSQL + pg_trgm + pgvector + PostGIS اختیاری
- Queue/Cache: Redis + BullMQ
- Deployment شروع: Docker Compose روی سرور/PaaS پارس‌پک
- معماری: Modular Monolith قابل جداسازی در آینده
- سرچ MVP: PostgreSQL FTS + trigram + vector
- مدل مالی: پرداخت به حساب بیزبورد، ثبت در escrow ledger، تسویه بعد از تایید/پایان بازه اعتراض
