import { ShellCard } from '@bizboard/ui';

const modules = [
  'کاربران', 'کسب‌وکارها', 'محصولات', 'Offerها', 'Raw Ingestion', 'SEO Pages', 'AI Logs', 'Payments', 'Ledger', 'Audit Logs'
];

export default function AdminHome() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-10">
      <h1 className="text-3xl font-black">پنل مدیریت بیزبورد</h1>
      <p className="mt-3 text-slate-600">Shell اولیه مدیریت. permission-aware UI و audit-aware actions در Sprint 6 کامل می‌شود.</p>
      <div className="mt-8 grid gap-4 md:grid-cols-5">
        {modules.map((item) => <ShellCard key={item} className="font-bold">{item}</ShellCard>)}
      </div>
    </main>
  );
}
