import { WorkPage } from '@/components/work/work-page';
export const metadata = { title: 'Websites / GH Creative' };
export default function Websites() {
  return (
    <WorkPage
      title="Websites."
      number="01"
      description="Selected website work for CENTUM, Incredible Kitchens and Loverboy Club."
      examples={[
        {
          title: 'CENTUM',
          label: 'WEBSITE',
          summary:
            'A training and nutrition platform built around a 100-day challenge.',
          media: [
            {
              type: 'image',
              src: '/assets/work/centum-hero.jpg',
              width: 1920,
              height: 1080,
              alt: 'CENTUM website hero imagery featuring runners',
              caption: 'CENTUM / hero imagery',
              presentation: 'cover',
            },
          ],
        },
        {
          title: 'Incredible Kitchens',
          label: 'WEBSITE',
          summary: 'An online home for kitchen projects and design services.',
          media: [
            {
              type: 'image',
              src: '/assets/work/incredible-kitchens-hero.webp',
              width: 2160,
              height: 3840,
              alt: 'Kitchen imagery from the Incredible Kitchens website',
              caption: 'Incredible Kitchens / website imagery',
              presentation: 'cover',
            },
          ],
        },
        {
          title: 'Loverboy Club',
          label: 'WEBSITE',
          summary: 'An online storefront for Loverboy Club.',
          media: [
            {
              type: 'image',
              src: '/assets/work/loverboy-hero.jpg',
              width: 2400,
              height: 1350,
              alt: 'Loverboy Club website hero imagery',
              caption: 'Loverboy Club / hero imagery',
              presentation: 'cover',
            },
          ],
        },
      ]}
    />
  );
}
