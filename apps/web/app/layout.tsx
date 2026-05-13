import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'بیزبورد | مقایسه و خرید هوشمند',
  description: 'دستیار هوشمند خرید، مقایسه قیمت، فروشگاه‌ها و مینی‌سایت کسب‌وکارها'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fa" dir="rtl">
      <body>{children}</body>
    </html>
  );
}
