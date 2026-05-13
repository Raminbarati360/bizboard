import Link from 'next/link';
import { ShellCard, Badge } from '@bizboard/ui';

const prompts = [
  'بهترین گوشی تا ۳۰ میلیون با دوربین خوب چی بخرم؟',
  'لپ‌تاپ برای برنامه‌نویسی تا ۵۰ میلیون',
  'تلویزیون اقتصادی برای خانه ۸۰ متری',
  'هدفون مناسب مکالمه و نویز کنسلینگ'
];

export default function HomePage() {
  return (
    <main className="min-h-screen px-4 py-8 md:px-10">
      <nav className="mx-auto flex max-w-6xl items-center justify-between py-4">
        <Link href="/" className="text-xl font-black">بیزبورد</Link>
        <div className="flex gap-3 text-sm">
          <Link href="/products">محصولات</Link>
          <Link href="/business/sample-store">مینی‌سایت نمونه</Link>
        </div>
      </nav>

      <section className="mx-auto grid max-w-6xl gap-6 py-12 md:grid-cols-[1.2fr_0.8fr] md:items-center">
        <div>
          <Badge>AI-first commerce directory</Badge>
          <h1 className="mt-5 text-4xl font-black leading-tight md:text-6xl">
            چی می‌خوای بخری؟ بیزبورد کمکت می‌کند تصمیم درست بگیری.
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
            محصول، فروشنده، قیمت، موجودی، اعتبار و نقدها در یک تجربه واحد؛ با دستیار هوش مصنوعی وسط سایت.
          </p>
        </div>

        <ShellCard className="bg-white/90">
          <h2 className="text-xl font-bold">دستیار خرید بیزبورد</h2>
          <form className="mt-4 flex gap-2" action="/products">
            <input name="q" className="min-w-0 flex-1 rounded-2xl border px-4 py-3 outline-none focus:ring-2 focus:ring-slate-300" placeholder="مثلاً گوشی با دوربین خوب تا ۳۰ میلیون" />
            <button className="rounded-2xl bg-slate-900 px-5 py-3 font-bold text-white">بپرس</button>
          </form>
          <div className="mt-5 grid gap-2">
            {prompts.map((prompt) => (
              <Link key={prompt} href={`/products?q=${encodeURIComponent(prompt)}`} className="rounded-2xl bg-slate-50 px-4 py-3 text-sm hover:bg-slate-100">
                {prompt}
              </Link>
            ))}
          </div>
        </ShellCard>
      </section>

      <section className="mx-auto grid max-w-6xl gap-4 md:grid-cols-5">
        {['موبایل', 'لپ‌تاپ', 'لوازم خانگی', 'صوتی تصویری', 'گجت هوشمند'].map((item) => (
          <ShellCard key={item} className="text-center font-bold">{item}</ShellCard>
        ))}
      </section>
    </main>
  );
}
