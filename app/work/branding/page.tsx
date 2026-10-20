import { WorkPage } from '@/components/work/work-page';

export const metadata = { title: 'Branding / GH Creative' };

const artwork = {
  'business-cards': [1600, 1067],
  'logo-system': [1600, 1345],
  'business-card-detail': [1536, 1024],
  stationery: [1536, 1024],
  invoice: [1588, 2246],
  'brand-applications': [1536, 1024],
  'story-ad-series': [2560, 2300],
  'dream-kitchen-ad': [941, 1672],
  'made-incredible-ad': [1080, 1920],
  'facebook-cover': [1600, 609],
  'x-header': [1500, 500],
  'email-signature': [1240, 420],
} as const;

function image(name: keyof typeof artwork, alt: string, caption: string) {
  const [width, height] = artwork[name];
  return {
    type: 'image' as const,
    src: `/assets/work/incredible-kitchens/${name}.webp`,
    width,
    height,
    alt,
    caption,
    enlarge: true,
  };
}

export default function Branding() {
  return (
    <WorkPage
      title="Branding."
      number="03"
      description="Selected identity work for Incredible Kitchens and ALIAS."
      examples={[
        {
          title: 'Incredible Kitchens',
          label: 'BRAND IDENTITY & ROLLOUT',
          summary:
            'A complete visual identity for a custom kitchen and joinery business, carried across print, everyday communication and advertising. Warm neutrals, charcoal, deep green and muted gold give the brand a considered feel, with a consistent logo and clear typography tying everything together.',
          media: [
            image(
              'business-cards',
              'Cream and charcoal Incredible Kitchens business cards, showing the logo and contact layouts on a stone surface',
              'The identity in print / business card design. Tap any artwork to view it larger.',
            ),
          ],
          sections: [
            {
              title: 'Logo & visual identity',
              description:
                'A distinctive IK monogram paired with a clean wordmark. Horizontal, stacked and standalone versions give the identity flexibility across signs, documents, social profiles and smaller digital spaces. The overview shows how each version works across the brand colour palette.',
              media: [
                image(
                  'logo-system',
                  'Incredible Kitchens monogram and wordmark variants in cream, charcoal, green and gold',
                  'Logo system / layouts, colour variations and profile icons.',
                ),
              ],
            },
            {
              title: 'Print & stationery',
              description:
                'Business cards, letterhead, envelopes and a branded notebook bring the identity into the details clients handle. Cream and charcoal layouts, generous spacing and restrained typography create a coordinated set for introductions, correspondence and project presentations.',
              media: [
                image(
                  'stationery',
                  'Business card fronts and backs, a branded letterhead and envelope, and a charcoal notebook',
                  'Stationery suite / business cards, letterhead, envelope and notebook.',
                ),
                image(
                  'business-card-detail',
                  'Cream and charcoal business card concepts with the Incredible Kitchens logo and a subtle embossed monogram mockup',
                  'Business card concepts / contrasting colours and a tactile embossed finish mockup.',
                ),
              ],
            },
            {
              title: 'Business documents',
              description:
                'A branded invoice template makes practical information easy to follow. Clear sections for client and project details, itemised services, totals and payment information keep the document useful while maintaining the same visual language as the rest of the brand.',
              media: [
                image(
                  'invoice',
                  'Incredible Kitchens sample invoice with client and project fields, itemised services, totals and placeholder payment details',
                  'Invoice design / a reusable business document template.',
                ),
              ],
            },
            {
              title: 'Advertising & campaign assets',
              description:
                'Kitchen imagery, focused headlines and clear calls to action translate the identity into advertising. Website and ad concepts sit alongside a coordinated story series, with both bold headline treatments and quieter, image-led layouts for different messages and formats.',
              media: [
                image(
                  'brand-applications',
                  'A coordinated kitchen website concept and a vertical advertisement using the Incredible Kitchens identity',
                  'Digital applications / website and vertical ad concepts.',
                ),
                image(
                  'story-ad-series',
                  'Eight coordinated vertical Incredible Kitchens ads featuring kitchen and joinery photography, headlines and calls to action',
                  'Story campaign / eight coordinated kitchen and joinery ads.',
                ),
                image(
                  'dream-kitchen-ad',
                  'Vertical kitchen advertisement with the headline Your dream kitchen starts here and an Enquire now call to action',
                  'Story creative / a bold headline, warm timber kitchen imagery and a direct inquiry prompt.',
                ),
                image(
                  'made-incredible-ad',
                  'Vertical Incredible Kitchens ad showing a classic kitchen with the headline Your home made incredible',
                  'Story creative / an image-led layout with the logo, brand framing and a conversation-led call to action.',
                ),
              ],
            },
            {
              title: 'Social brand assets',
              description:
                'Matching Facebook and X profile covers extend the identity across social channels. A pale marble texture, clear logo placement and a shared tagline create a recognisable presence while adapting the composition to each platform’s proportions.',
              media: [
                image(
                  'facebook-cover',
                  'Incredible Kitchens Facebook cover with a black logo and tagline on a pale marble background',
                  'Facebook cover / logo, marble texture and brand tagline.',
                ),
                image(
                  'x-header',
                  'Incredible Kitchens X header with the logo and tagline arranged for a wide social banner',
                  'X header / the same identity adapted to a wider format.',
                ),
              ],
            },
            {
              title: 'Email signatures',
              description:
                'A branded email signature brings the same consistency to everyday conversations. The monogram, name, role and contact details sit in a clear hierarchy over a subtle marble background, making the sender easy to identify and contact.',
              media: [
                image(
                  'email-signature',
                  'Incredible Kitchens email signature with the IK monogram, Richard Wilson’s name and business contact details on a marble background',
                  'Email signature / a consistent finish for client correspondence.',
                ),
              ],
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
              src: '/assets/work/alias-thumbnail.jpg',
              width: 1440,
              height: 838,
              alt: 'ALIAS identity and visual direction applied to a website',
              caption: 'ALIAS / digital brand application',
            },
          ],
        },
      ]}
    />
  );
}
