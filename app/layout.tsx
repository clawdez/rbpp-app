import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'RBPP — Reverse Bitcoin-Backed Premium Policy',
  description: 'Insurance innovation on Stacks: sBTC-backed reserves that reward claim-free policyholders with Bitcoin appreciation discounts.',
  keywords: ['sBTC', 'Stacks', 'Bitcoin', 'Insurance', 'DeFi', 'Clarity', 'RBPP'],
  openGraph: {
    title: 'RBPP — Bitcoin-Backed Insurance Reserves',
    description: 'Policyholders earn premium discounts from sBTC reserve appreciation. Built on Stacks.',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen antialiased">
        {children}
      </body>
    </html>
  );
}
