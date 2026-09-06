import type { Metadata } from 'next';
import './globals.css';
import '../design-system/screens.css';
import '../design-system/motion.css';
export const metadata: Metadata = {
  title: 'GH Creative — Make the signal clear.',
  description:
    'Independent creative services across brand, web, visual design and audio. Melbourne / Worldwide.',
};
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
