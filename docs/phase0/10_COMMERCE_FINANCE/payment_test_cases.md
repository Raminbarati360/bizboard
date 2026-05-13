# تست‌های پرداخت و ledger

## Payment Callback

- [ ] callback موفق یک بار دریافت شود.
- [ ] callback موفق چند بار دریافت شود و دوباره ledger نسازد.
- [ ] callback با amount اشتباه fail شود.
- [ ] callback با order نامعتبر fail شود.
- [ ] verify gateway fail شود.
- [ ] network timeout با retry امن مدیریت شود.

## Order State

- [ ] order فقط بعد از verify به paid_pending_fulfillment تغییر کند.
- [ ] order cancelled قابل پرداخت مجدد نباشد.
- [ ] order disputed قابل settlement نباشد.

## Ledger

- [ ] هر payment verified یک transaction_id دارد.
- [ ] جمع debit/credit برابر است.
- [ ] پرداخت تکراری ledger تکراری نمی‌سازد.
- [ ] refund، escrow/payable را درست اصلاح می‌کند.
- [ ] payout فقط از payable انجام می‌شود.
