import { WorkPage } from '@/components/work/work-page';

export const metadata = { title: 'Branding — GH Creative' };

export default function Branding() {
  return <WorkPage
    title="Branding."
    number="03"
    description="Distinctive identities, built to connect every expression of a brand."
    image="/assets/brand-direction.png"
    imageWidth={1086}
    imageHeight={1448}
    imageAlt="GH Creative identity with a red angular wordmark and repeated outline lettering"
    caption="The studio’s own identity direction: an angular wordmark, scarlet accents and a system of outline echoes."
  />;
}
