import { WorkPage } from '@/components/work/work-page';

export const metadata = { title: 'Visual Design / GH Creative' };

export default function VisualDesign() {
  return <WorkPage
    title="Visual design."
    number="02"
    description="Image, form and contrast. Visual ideas made to hold your attention."
    examples={[{
      title: 'Refraction portrait study',
      label: 'STUDIO EXPLORATION',
      summary: 'A study in refraction and contrast, developed as the central visual for the GH Creative website.',
      media: [
        {
          type: 'image',
          src: '/assets/hero-portrait.png',
          width: 780,
          height: 1122,
          alt: 'A red portrait distorted through vertical refraction',
          caption: 'Refraction portrait / image study',
        },
        {
          type: 'image',
          src: '/assets/mobile-hero-reference.png',
          width: 390,
          height: 844,
          alt: 'The refraction portrait placed in a GH Creative mobile website concept',
          caption: 'Portrait in context / mobile concept',
        },
      ],
    }]}
  />;
}
