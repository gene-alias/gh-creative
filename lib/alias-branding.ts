import assets from './alias-brand-assets.json';

function image(name: keyof typeof assets, alt: string, caption: string) {
  return {
    type: 'image' as const,
    ...assets[name],
    alt,
    caption: `ALIAS / ${caption}`,
    enlarge: true,
  };
}

export const aliasBrandingMedia = {
  symbol: image(
    'app-icon',
    'Silver layered ALIAS outline symbol centred on a black app icon',
    'App icon and standalone symbol.',
  ),
  motion: {
    type: 'video' as const,
    src: '/assets/work/alias/liquid-metal.mp4',
    animation: '/assets/work/alias/liquid-metal-cover.gif',
    poster: '/assets/work/alias/liquid-metal-poster.jpg',
    width: 1080,
    height: 1080,
    label: 'ALIAS liquid-metal logo animation',
    caption: 'ALIAS / Motion identity in a looping liquid-metal treatment.',
  },
  cardFront: image(
    'business-card-front',
    'Black ALIAS business card front with a white symbol and wordmark framed by fine corner marks',
    'Business card front.',
  ),
  cardBack: image(
    'business-card-back',
    'ALIAS business card reverse with Gene Humphreys’s name, business email and website on black',
    'Business card reverse.',
  ),
  invoice: image(
    'invoice',
    'Dark ALIAS sample invoice showing placeholder client fields, example line items, totals and a large outline symbol watermark',
    'Invoice template with sample content.',
  ),
  emailDark: image(
    'email-dark',
    'Dark ALIAS email signature with Gene Humphreys’s name, business contact details, a dotted symbol and a blue accent',
    'Email signature, dark treatment.',
  ),
  emailLight: image(
    'email-light',
    'Light ALIAS email signature with the same contact layout, dotted symbol and blue accent',
    'Email signature, light treatment.',
  ),
  linkPreview: image(
    'link-preview',
    'Silver ALIAS symbol and wordmark arranged across a black link-preview graphic',
    'Link-preview graphic.',
  ),
  facebookDark: image(
    'facebook-dark',
    'Dark ALIAS Facebook cover with the headline High impact AI, zero hyped BS, a large dotted symbol and blue accents',
    'Facebook cover, dark treatment.',
  ),
  facebookLight: image(
    'facebook-light',
    'Light ALIAS Facebook cover using the same headline, dotted symbol and blue accents',
    'Facebook cover, light treatment.',
  ),
};
