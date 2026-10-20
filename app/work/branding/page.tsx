import { WorkPage } from '@/components/work/work-page';
export const metadata = { title: 'Branding / GH Creative' };
export default function Branding() {
  return (
    <WorkPage
      title="Branding."
      number="03"
      description="Selected identity work for Incredible Kitchens and ALIAS."
      examples={[
        {
          title: 'Incredible Kitchens',
          label: 'BRAND IDENTITY',
          summary:
            'The Incredible Kitchens identity, shown across signage and brand applications.',
          media: [
            {
              type: 'image',
              src: '/assets/work/incredible-kitchens-branding.webp',
              width: 800,
              height: 533,
              alt: 'Incredible Kitchens branding on a building, reception area and van',
              caption: 'Incredible Kitchens / identity applications',
            },
          ],
        },
        {
          title: 'ALIAS',
          label: 'BRAND IDENTITY',
          summary: 'The ALIAS identity applied across its digital presence.',
          media: [
            {
              type: 'image',
              src: '/assets/work/alias-identity.webp',
              width: 800,
              height: 533,
              alt: 'ALIAS identity and visual direction applied to a website',
              caption: 'ALIAS / digital brand application',
            },
          ],
        },
      ]}
    />
  );
}
