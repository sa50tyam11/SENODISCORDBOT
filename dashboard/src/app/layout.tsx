import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'SENO Studio Dashboard',
  description: 'Internal Management Dashboard for SENO Studio',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-[#09090b] text-zinc-100 antialiased min-h-screen flex`}>
        {children}
      </body>
    </html>
  );
}
