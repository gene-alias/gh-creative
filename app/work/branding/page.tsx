import { WorkPage } from '@/components/work/work-page';

export const metadata = { title: 'Branding / GH Creative' };

export default function Branding() {
  return <WorkPage
    title="Branding."
    number="03"
    description="Distinctive identities, built to connect every expression of a brand."
    examples={[{
      title: 'GH Creative identity direction',
      label: 'STUDIO EXPLORATION',
      summary: 'The studio’s own identity direction: an angular wordmark, scarlet accents and a system of outline echoes.',
      media: [
        {
          type: 'image',
          src: '/assets/brand-direction.png',
          width: 1086,
          height: 1448,
          alt: 'GH Creative identity with a red angular wordmark and repeated outline lettering',
          caption: 'Identity direction / typographic system',
        },
        {
          type: 'image',
          src: '/assets/gh-cube-red.png',
          width: 1302,
          height: 1208,
          alt: 'Red GH cube mark on a dark background',
          caption: 'GH cube / symbol study',
        },
        {
          type: 'image',
          src: '/assets/gh-geometric-symbol.png',
          width: 1536,
          height: 1024,
          alt: 'White geometric GH symbol on black',
          caption: 'Geometric mark / alternate study',
        },
      ],
    }]}
  />;
}
