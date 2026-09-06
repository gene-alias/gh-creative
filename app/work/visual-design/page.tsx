import { WorkPage } from '@/components/work/work-page';

export const metadata = { title: 'Visual Design — GH Creative' };

export default function VisualDesign() {
  return <WorkPage
    title="Visual design."
    number="02"
    description="Image, form and contrast. Visual ideas made to hold your attention."
    image="/assets/hero-portrait.png"
    imageWidth={780}
    imageHeight={1122}
    imageAlt="A red portrait distorted through vertical refraction"
    caption="A study in refraction and contrast, developed as the central visual for the GH Creative website."
  />;
}
