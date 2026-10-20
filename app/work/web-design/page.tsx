import { WorkPage } from '@/components/work/work-page';
export const metadata = { title: 'Websites / GH Creative' };
export default function Websites() {
  return (
    <WorkPage
      title="Websites."
      number="01"
      description="Selected website work for CENTUM, Incredible Kitchens, Loverboy Club, KONSTRUKT and ALIAS."
      examples={[
        {
          title: 'CENTUM',
          label: 'WEBSITE',
          summary:
            'A training and nutrition platform built around a 100-day challenge.',
          media: [
            {
              type: 'video',
              src: '/assets/work/videos/centum.mp4',
              poster: '/assets/work/centum-thumbnail.jpg',
              width: 1440,
              height: 838,
              label: 'CENTUM website video preview',
              caption: 'CENTUM / website walkthrough',
            },
          ],
        },
        {
          title: 'Incredible Kitchens',
          label: 'WEBSITE',
          summary:
            'Custom kitchens and joinery, from design and manufacture through to installation.',
          media: [
            {
              type: 'video',
              src: '/assets/work/videos/incredible-kitchens.mp4',
              poster: '/assets/work/incredible-kitchens-thumbnail.jpg',
              width: 1440,
              height: 838,
              label: 'Incredible Kitchens website video preview',
              caption: 'Incredible Kitchens / website walkthrough',
            },
          ],
        },
        {
          title: 'Loverboy Club',
          label: 'WEBSITE',
          summary: 'An online storefront for Loverboy Club.',
          media: [
            {
              type: 'video',
              src: '/assets/work/videos/loverboy.mp4',
              poster: '/assets/work/loverboy-thumbnail.jpg',
              width: 1440,
              height: 838,
              label: 'Loverboy Club website video preview',
              caption: 'Loverboy Club / website walkthrough',
            },
          ],
        },
        {
          title: 'KONSTRUKT',
          label: 'WEBSITE',
          summary: 'A website for a construction intelligence platform.',
          media: [
            {
              type: 'video',
              src: '/assets/work/videos/konstrukt.mp4',
              poster: '/assets/work/konstrukt-thumbnail.jpg',
              width: 1440,
              height: 868,
              label: 'KONSTRUKT website video preview',
              caption: 'KONSTRUKT / website walkthrough',
            },
          ],
        },
        {
          id: 'alias-website',
          title: 'ALIAS',
          label: 'WEBSITE',
          summary:
            'A digital home for ALIAS, with a service-led layout and a showcase of selected work.',
          media: [
            {
              type: 'video',
              src: '/assets/work/videos/alias.mp4',
              poster: '/assets/work/alias-thumbnail.jpg',
              width: 1440,
              height: 838,
              label: 'ALIAS Creative website video preview',
              caption: 'ALIAS / website walkthrough',
            },
          ],
        },
      ]}
    />
  );
}
