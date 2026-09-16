import type { Metadata, Viewport } from 'next';
import './globals.css';
import { ProjectBriefProvider } from '@/components/project/project-brief';
import '../design-system/project-brief.css';
import '../design-system/screens.css';
import '../design-system/pricing.css';
import '../design-system/motion.css';
export const viewport: Viewport = { themeColor: '#08080b', colorScheme: 'dark' };
export const metadata: Metadata = {
  icons: { icon: '/assets/gh-cube-logo.png', apple: '/assets/gh-cube-logo.png' },
  title: 'GH Creative — Make the signal clear.',
  description:
    'Independent creative services across brand, web, visual design and audio. Melbourne / Worldwide.',
};
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body><ProjectBriefProvider>{children}</ProjectBriefProvider></body>
    </html>
  );
}
