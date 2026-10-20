import type { WorkExample } from '@/components/work/work-page';
import assets from './alias-brand-assets.json';

function image(name: keyof typeof assets, alt: string, caption: string) {
  return {
    type: 'image' as const,
    ...assets[name],
    alt,
    caption,
    enlarge: true,
  };
}

export const aliasBranding: WorkExample = {
  id: 'alias-branding',
  title: 'ALIAS',
  label: 'BRAND IDENTITY & ROLLOUT',
  summary:
    'A visual identity built around a layered symbol, a widely spaced wordmark and precise technical typography. Black and white layouts, chrome treatments and small blue accents carry the same character across stationery, business documents, email and social channels.',
  media: [
    {
      type: 'video',
      src: '/assets/work/alias/liquid-metal.mp4',
      poster: '/assets/work/alias/liquid-metal-poster.jpg',
      width: 1080,
      height: 1080,
      label: 'ALIAS liquid-metal logo animation',
      caption:
        'Motion identity / the symbol and wordmark in a looping liquid-metal treatment.',
    },
  ],
  sections: [
    {
      title: 'Symbol & digital identity',
      description:
        'The layered outline symbol gives ALIAS a recognisable mark of its own. In the app icon, a silver gradient on black adds depth while keeping the shape clear at smaller sizes. The liquid-metal animation above extends that same identity into motion.',
      media: [
        image(
          'app-icon',
          'Silver layered ALIAS outline symbol centred on a black app icon',
          'App icon / the standalone symbol in silver on black.',
        ),
      ],
    },
    {
      title: 'Business cards & stationery',
      description:
        'A restrained black and white business card system pairs the symbol and wordmark with generous space. The front focuses on the identity; the reverse brings the name and contact details into a clear hierarchy, with bracketed labels and fine lines carrying the technical visual language.',
      media: [
        image(
          'business-card-front',
          'Black ALIAS business card front with a white symbol and wordmark framed by fine corner marks',
          'Business card / front, featuring the full identity.',
        ),
        image(
          'business-card-back',
          'ALIAS business card reverse with Gene Humphreys’s name, business email and website on black',
          'Business card / reverse, with name and contact details.',
        ),
      ],
    },
    {
      title: 'Business documents',
      description:
        'The invoice design brings the brand into a practical client document. A large title, structured project and billing fields, itemised services and clear totals make the information easy to scan. A subtle oversized symbol and fine rules tie it back to the identity.',
      media: [
        image(
          'invoice',
          'Dark ALIAS sample invoice showing placeholder client fields, example line items, totals and a large outline symbol watermark',
          'Invoice template / sample content and placeholder client and payment details.',
        ),
      ],
    },
    {
      title: 'Email signatures',
      description:
        'Matching dark and light email signatures keep everyday correspondence consistent. The wordmark, name and contact details sit alongside a dotted version of the symbol, with a small blue accent adding a recognisable detail across both colour treatments.',
      media: [
        image(
          'email-dark',
          'Dark ALIAS email signature with Gene Humphreys’s name, business contact details, a dotted symbol and a blue accent',
          'Email signature / dark treatment.',
        ),
        image(
          'email-light',
          'Light ALIAS email signature with the same contact layout, dotted symbol and blue accent',
          'Email signature / light treatment.',
        ),
      ],
    },
    {
      title: 'Social & sharing assets',
      description:
        'A dedicated link-preview graphic keeps the full identity clear when a page is shared. Matching dark and light Facebook covers extend the system with a direct headline, dotted symbol artwork and blue accents, adapting the brand to a wide social format.',
      media: [
        image(
          'link-preview',
          'Silver ALIAS symbol and wordmark arranged across a black link-preview graphic',
          'Link preview / a clear identity for shared pages.',
        ),
        image(
          'facebook-dark',
          'Dark ALIAS Facebook cover with the headline High impact AI, zero hyped BS, a large dotted symbol and blue accents',
          'Facebook cover / dark treatment, brand message and dotted symbol.',
        ),
        image(
          'facebook-light',
          'Light ALIAS Facebook cover using the same headline, dotted symbol and blue accents',
          'Facebook cover / light treatment.',
        ),
      ],
    },
  ],
};
