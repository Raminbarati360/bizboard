# جریان پرداخت، escrow و ledger

## سناریوی خرید داخلی

1. کاربر محصولی را انتخاب می‌کند که `internal_checkout_enabled=true` دارد.
2. API سفارش را می‌سازد:
   - order.status = pending_payment
   - order_items با price snapshot ساخته می‌شود.
3. payment_attempt ساخته می‌شود:
   - gateway = zarinpal یا zibal
   - idempotency_key ساخته می‌شود.
4. کاربر به درگاه می‌رود.
5. callback دریافت می‌شود.
6. backend به صورت server-to-server پرداخت را verify می‌کند.
7. اگر verify موفق بود:
   - payment_attempt.status = verified
   - order.status = paid_pending_fulfillment
   - ledger transaction برای ورود پول به escrow ثبت می‌شود.
8. فروشنده سفارش را پردازش و ارسال می‌کند.
9. مشتری تایید دریافت می‌زند یا بعد از SLA، auto-confirm انجام می‌شود.
10. کارمزد بیزبورد جدا می‌شود.
11. سهم فروشنده از escrow به payable منتقل می‌شود.
12. تسویه batch انجام و settlement.paid ثبت می‌شود.

## قوانین حیاتی

- callback ممکن است چند بار برسد؛ باید idempotent باشد.
- هیچ پرداختی فقط با querystring تایید نمی‌شود.
- amount سمت سرور با order total مقایسه می‌شود.
- اگر اختلاف وجود داشت، payment_attempt باید failed/needs_review شود.
- هر تغییر مالی باید ledger entry و audit log داشته باشد.
- تسویه بدون KYC/KYB ممنوع است.

## وضعیت‌های سفارش MVP

- pending_payment
- paid_pending_fulfillment
- processing
- shipped
- delivered
- completed
- disputed
- cancelled
- refunded
