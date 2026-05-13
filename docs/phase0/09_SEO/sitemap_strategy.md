# استراتژی Sitemap

## فایل‌های sitemap

- `/sitemap.xml` index اصلی
- `/sitemaps/categories.xml`
- `/sitemaps/products-1.xml`, `/sitemaps/products-2.xml`, ...
- `/sitemaps/businesses.xml`
- `/sitemaps/seo-pages.xml`

## قوانین ورود URL به sitemap

URL فقط وقتی وارد sitemap می‌شود که:

- status فعال باشد.
- index_status برابر index باشد.
- quality_score حداقل ۷۰ باشد.
- محصول canonical باشد و merged/hidden نباشد.
- صفحه دسته thin نباشد.
- قیمت/offer اگر لازم است، خیلی کهنه نباشد.

## حذف URL

- صفحات merged redirect می‌شوند.
- صفحات حذف‌شده 410 یا 301 مناسب می‌گیرند.
- صفحات کم‌کیفیت noindex و از sitemap حذف می‌شوند.
