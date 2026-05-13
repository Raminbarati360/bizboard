# حساب‌های Ledger پیشنهادی

## حساب‌های پایه

1. Bizboard Cash
   - owner_type: bizboard
   - account_type: cash

2. Bizboard Escrow
   - owner_type: bizboard
   - account_type: escrow

3. Bizboard Commission Revenue
   - owner_type: bizboard
   - account_type: revenue

4. Seller Payable
   - owner_type: business
   - owner_id: business_id
   - account_type: payable

5. Refund Liability
   - owner_type: bizboard
   - account_type: refund

6. Gateway Fee
   - owner_type: gateway
   - account_type: fee

## نمونه ثبت پرداخت موفق

Transaction: payment_verified

- Debit: Bizboard Cash
- Credit: Bizboard Escrow

## نمونه آزادسازی پول بعد از تایید تحویل

Transaction: order_completed

- Debit: Bizboard Escrow
- Credit: Seller Payable
- Credit: Bizboard Commission Revenue

نکته: در پیاده‌سازی واقعی باید جمع debit و credit هر transaction برابر باشد. در فاز کدنویسی، constraint یا تست reconciliation اجباری شود.
