import { WorkPage } from '@/components/work/work-page';
export const metadata = { title: 'Websites / GH Creative' };
export default function Websites() {
  return (
    <WorkPage
      title="Websites."
      number="01"
      description="Selected website work for CENTUM, Incredible Kitchens, Loverboy Club and KONSTRUKT."
      examples={[
        {
          title: 'CENTUM',
          label: 'WEBSITE',
          summary:
            'A training and nutrition platform built around a 100-day challenge.',
          media: [
            {
              type: 'image',
              src: '/assets/work/centum-thumbnail.jpg',
              width: 1440,
              height: 838,
              alt: 'CENTUM website thumbnail showing its boxing hero and wordmark',
              caption: 'CENTUM / website preview',
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
              src: '/assets/work/incredible-kitchens-thumbnail.jpg',
              width: 1440,
              height: 838,
              alt: 'Incredible Kitchens website thumbnail showing the homepage',
              caption: 'Incredible Kitchens / website preview',
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
              src: '/assets/work/loverboy-thumbnail.jpg',
              width: 1440,
              height: 838,
              alt: 'Loverboy Club website thumbnail showing the homepage',
              caption: 'Loverboy Club / website preview',
            },
          ],
        },
        {
          title: 'KONSTRUKT',
          label: 'WEBSITE',
          summary: 'A website for a construction intelligence platform.',
          media: [
            {
              type: 'image',
              src: '/assets/work/konstrukt-thumbnail.jpg',
              width: 1440,
              height: 868,
              alt: 'KONSTRUKT website thumbnail showing its construction intelligence homepage',
              caption: 'KONSTRUKT / website preview',
            },
          ],
        },
      ]}
    />
  );
}
