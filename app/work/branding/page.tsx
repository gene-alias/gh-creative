import { WorkPage, type WorkExample } from '@/components/work/work-page';
import { aliasBrandingMedia as alias } from '@/lib/alias-branding';
import { centumBrandingMedia as centum } from '@/lib/centum-branding';

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
    caption: `Incredible Kitchens / ${caption}`,
    enlarge: true,
  };
}

const categories: WorkExample[] = [
  {
    id: 'logos-identity',
    title: 'Logos & identity',
    label: 'IDENTITY',
    summary:
      'Logo systems, standalone symbols and motion identities. Tap any artwork to view it larger.',
    media: [
      image(
        'logo-system',
        'Incredible Kitchens monogram and wordmark variants in cream, charcoal, green and gold',
        'Logo layouts, colour variations and profile icons.',
      ),
      alias.symbol,
      alias.motion,
      centum.mark,
      centum.appIcons,
      centum.splash,
    ],
  },
  {
    id: 'print-stationery',
    title: 'Print & stationery',
    label: 'PRINT',
    summary:
      'Business cards, letterheads, envelopes and stationery designed as part of a consistent identity.',
    media: [
      image(
        'business-cards',
        'Cream and charcoal Incredible Kitchens business cards, showing the logo and contact layouts on a stone surface',
        'Business card designs.',
      ),
      image(
        'stationery',
        'Business card fronts and backs, a branded letterhead and envelope, and a charcoal notebook',
        'Stationery suite.',
      ),
      image(
        'business-card-detail',
        'Cream and charcoal business card concepts with the Incredible Kitchens logo and a subtle embossed monogram mockup',
        'Business card concepts and embossed finish mockup.',
      ),
      alias.cardFront,
      alias.cardBack,
    ],
  },
  {
    id: 'business-documents',
    title: 'Business documents',
    label: 'DOCUMENTS',
    summary:
      'Branded invoice templates with clear layouts for client details, itemised services and payment information.',
    media: [
      image(
        'invoice',
        'Incredible Kitchens sample invoice with client and project fields, itemised services, totals and placeholder payment details',
        'Invoice template with sample content.',
      ),
      alias.invoice,
    ],
  },
  {
    id: 'advertising-campaigns',
    title: 'Advertising & campaigns',
    label: 'CAMPAIGNS',
    summary:
      'Campaign concepts and advertising creative, from bold headlines to image-led story layouts.',
    media: [
      image(
        'brand-applications',
        'A coordinated kitchen website concept and a vertical advertisement using the Incredible Kitchens identity',
        'Website and vertical ad concepts.',
      ),
      image(
        'story-ad-series',
        'Eight coordinated vertical Incredible Kitchens ads featuring kitchen and joinery photography, headlines and calls to action',
        'Eight-part story ad campaign.',
      ),
      image(
        'dream-kitchen-ad',
        'Vertical kitchen advertisement with the headline Your dream kitchen starts here and an Enquire now call to action',
        'Dream kitchen story creative.',
      ),
      image(
        'made-incredible-ad',
        'Vertical Incredible Kitchens ad showing a classic kitchen with the headline Your home made incredible',
        'Made incredible story creative.',
      ),
      centum.fiveTasks,
      centum.coastalRun,
      centum.eatToTrain,
      centum.restOnPlan,
      centum.everyRep,
      centum.doneLoggedScored,
      centum.postProof,
      centum.teamChallenge,
    ],
  },
  {
    id: 'social-assets',
    title: 'Social & sharing assets',
    label: 'SOCIAL',
    summary:
      'Profile covers, banners and link-preview graphics that carry a brand across social channels.',
    media: [
      image(
        'facebook-cover',
        'Incredible Kitchens Facebook cover with a black logo and tagline on a pale marble background',
        'Facebook cover.',
      ),
      image(
        'x-header',
        'Incredible Kitchens X header with the logo and tagline arranged for a wide social banner',
        'X header.',
      ),
      alias.linkPreview,
      alias.facebookDark,
      alias.facebookLight,
      centum.milestone,
    ],
  },
  {
    id: 'email-signatures',
    title: 'Email design',
    label: 'EMAIL',
    summary:
      'Email signatures, confirmation messages and welcome templates that carry a brand into the inbox.',
    media: [
      image(
        'email-signature',
        'Incredible Kitchens email signature with the IK monogram, Richard Wilson’s name and business contact details on a marble background',
        'Email signature.',
      ),
      alias.emailDark,
      alias.emailLight,
      centum.confirmEmail,
      centum.welcomeEmail,
    ],
  },
];

export default function Branding() {
  return (
    <WorkPage
      title="Branding."
      number="03"
      description="Identity design across logos, print, documents, advertising and everyday communication."
      examples={categories}
      mediaLayout="marquee"
    />
  );
}
