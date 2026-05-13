# ماتریس Endpointهای MVP

| دامنه | Endpoint | نقش | توضیح |
|---|---|---|---|
| Auth | POST /auth/request-otp | عمومی | درخواست کد ورود |
| Auth | POST /auth/verify-otp | عمومی | تایید و ساخت توکن |
| Catalog | GET /categories | عمومی | لیست دسته‌ها |
| Catalog | GET /products | عمومی | سرچ و فیلتر محصولات |
| Catalog | GET /products/{slug} | عمومی | صفحه محصول |
| Offers | GET /products/{id}/offers | عمومی | قیمت‌ها و فروشنده‌ها |
| Business | POST /businesses | صاحب کسب‌وکار | ساخت کسب‌وکار/مینی‌سایت |
| Business | GET /businesses/{slug} | عمومی | نمایش مینی‌سایت |
| Business Catalog | POST /businesses/{id}/products | صاحب کسب‌وکار | ثبت محصول و offer |
| AI | POST /ai/conversations | عمومی/کاربر | شروع چت |
| AI | POST /ai/conversations/{id}/messages | عمومی/کاربر | پیام به AI |
| Commerce | POST /orders | کاربر | ساخت سفارش داخلی |
| Payments | POST /payments/{orderId}/attempts | کاربر | ساخت تلاش پرداخت |
| Payments | POST /payments/callback/{gateway} | Gateway | callback امن و idempotent |
| Admin | GET /admin/products | ادمین | مدیریت محصولات |
| Admin | GET /admin/raw-ingestion-items | ادمین | بررسی داده خام |
