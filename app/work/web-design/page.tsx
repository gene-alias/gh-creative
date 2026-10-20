import { WorkPage } from '@/components/work/work-page';

export const metadata = { title: 'Web Design / GH Creative' };

export default function WebDesign() {
  return <WorkPage
    title="Web design."
    number="01"
    description="Digital experiences with a clear purpose and a distinct point of view."
    examples={[{
      title: 'GH Creative website',
      label: 'STUDIO EXPLORATION',
      summary: 'The live studio site: a desktop-first composition with a clear headline, a direct next step, and motion that stays in service of the work.',
      media: [
        {
          type: 'image',
          src: '/assets/work/gh-creative-monitor-mockup.png',
          width: 1152,
          height: 864,
          alt: 'GH Creative website shown on a cinematic desktop monitor',
          caption: 'Desktop homepage / 3D monitor',
        },
        {
          type: 'image',
          src: '/assets/work/gh-creative-desktop.png',
          width: 1600,
          height: 1000,
          alt: 'GH Creative desktop homepage with SHARE YOUR VISION WITH THE WORLD',
          caption: 'Desktop homepage / live site',
        },
        {
          type: 'image',
          src: '/assets/mobile-hero-reference.png',
          width: 390,
          height: 844,
          alt: 'GH Creative mobile website concept with a red portrait and bold headline',
          caption: 'Mobile concept / hero composition',
        },
        {
          type: 'image',
          src: '/assets/services-code-background.png',
          width: 576,
          height: 1024,
          alt: 'Red code artwork used in the GH Creative services direction',
          caption: 'Services visual / code texture',
        },
      ],
    }]}
  />;
}
