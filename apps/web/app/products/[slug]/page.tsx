import Link from 'next/link';
import { notFound } from 'next/navigation';
import { createBizboardClient } from '@bizboard/api-client';
import { productJsonLd } from '@bizboard/seo';
import { ShellCard } from '@bizboard/ui';
import type { OfferDto, ProductDto } from '@bizboard/types';

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const api = createBizboardClient();
  let product: ProductDto;
  let offers: OfferDto[] = [];
  try {
    product = await api.product(slug);
    offers = await api.offers(product.id);
  } catch {
    notFound();
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd(product, offers)) }} />
      <Link href="/products" className="text-sm text-slate-500">← محصولات</Link>
      <h1 className="mt-4 text-3xl font-black">{product.title}</h1>
      <p className="mt-3 text-slate-600">خلاصه AI، مشخصات، قیمت‌ها و فروشنده‌ها در این صفحه تکمیل می‌شود.</p>
      <div className="mt-8 grid gap-4 md:grid-cols-[1fr_0.8fr]">
        <ShellCard>
          <h2 className="font-bold">خلاصه هوشمند</h2>
          <p className="mt-3 leading-8 text-slate-600">برای پیشنهاد قطعی، AI باید به product/offers/reviews واقعی وصل شود. این shell ساختار صفحه canonical محصول را آماده کرده است.</p>
        </ShellCard>
        <ShellCard>
          <h2 className="font-bold">قیمت‌ها و فروشنده‌ها</h2>
          <div className="mt-4 grid gap-3">
            {offers.map((offer) => (
              <div key={offer.id} className="rounded-2xl border p-4">
                <div className="font-bold">{offer.merchantName}</div>
                <div className="mt-1 text-sm text-slate-500">آخرین بروزرسانی: {new Date(offer.lastSeenAt).toLocaleString('fa-IR')}</div>
                <div className="mt-3 text-lg font-black">{offer.price.toLocaleString('fa-IR')} ریال</div>
              </div>
            ))}
          </div>
        </ShellCard>
      </div>
    </main>
  );
}
