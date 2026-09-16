import { WorkPage } from '@/components/work/work-page';

export const metadata = { title: 'Web Design / GH Creative' };

export default function WebDesign() {
  return <WorkPage
    title="Web design."
    number="01"
    description="Digital experiences with a clear purpose and a distinct point of view."
    image="/assets/mobile-hero-reference.png"
    imageWidth={390}
    imageHeight={844}
    imageAlt="GH Creative mobile website concept with a red portrait and bold headline"
    caption="An early mobile concept for the studio: expressive imagery, direct messaging and a clear next step."
  />;
}
