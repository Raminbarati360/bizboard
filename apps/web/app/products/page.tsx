import Link from 'next/link';
import { createBizboardClient } from '@bizboard/api-client';
import { ShellCard } from '@bizboard/ui';

export default async function ProductsPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q } = await searchParams;
  const api = createBizboardClient();
  let products = [] as Awaited<ReturnType<typeof api.products>>;
  try {
    products = await api.products(q ?? '');
  } catch {
    products = [];
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <Link href="/" className="text-sm text-slate-500">← خانه</Link>
      <h1 className="mt-4 text-3xl font-black">جستجو و مقایسه محصولات</h1>
      <form className="mt-6 flex gap-2">
        <input name="q" defaultValue={q} className="min-w-0 flex-1 rounded-2xl border px-4 py-3" placeholder="نام محصول، برند یا نیازتان" />
        <button className="rounded-2xl bg-slate-900 px-5 py-3 text-white">جستجو</button>
      </form>
      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {products.length ? products.map((product) => (
          <ShellCard key={product.id}>
            <h2 className="text-xl font-bold"><Link href={`/products/${product.slug}`}>{product.title}</Link></h2>
            <p className="mt-2 text-sm text-slate-500">{product.brandName ?? 'برند نامشخص'} · {product.offerCount} فروشنده</p>
            <p className="mt-4 font-bold">از {product.minPrice?.toLocaleString('fa-IR')} ریال</p>
          </ShellCard>
        )) : <ShellCard>هنوز محصولی پیدا نشد. بعد از اتصال دیتابیس و seed واقعی، نتایج اینجا نمایش داده می‌شود.</ShellCard>}
      </div>
    </main>
  );
}
