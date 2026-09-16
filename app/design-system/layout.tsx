import type { Metadata } from 'next';
export const metadata: Metadata = {
  title: 'GH Creative / Design System',
  description:
    'Colour, typography, components and tokens for the GH Creative visual identity.',
};
export default function SystemLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
