import Link from 'next/link';
import { ShellCard } from '@bizboard/ui';

export default async function BusinessPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <Link href="/" className="text-sm text-slate-500">← خانه</Link>
      <section className="mt-6 rounded-3xl bg-slate-900 p-8 text-white">
        <p className="text-sm text-slate-300">/b/{slug}</p>
        <h1 className="mt-3 text-4xl font-black">مینی‌سایت فروشنده نمونه</h1>
        <p className="mt-4 max-w-2xl leading-8 text-slate-200">کاور، لوگو، محصولات، نقدها، تماس، شبکه‌های اجتماعی و checkout داخلی برای فروشنده بدون سایت در این مسیر ساخته می‌شود.</p>
      </section>
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {['Overview', 'Products/Services', 'Reviews', 'Q&A', 'FAQ', 'Contact'].map((item) => <ShellCard key={item}>{item}</ShellCard>)}
      </div>
    </main>
  );
}
