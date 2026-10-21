export const visualCoverFrames = [
  {
    src: '/assets/work/visual/fashion-eyewear/021.webp',
    width: 1800,
    height: 1005,
  },
  {
    src: '/assets/work/visual/architecture-interiors/056.webp',
    width: 1800,
    height: 1005,
  },
  {
    src: '/assets/work/visual/jewellery-portraits/048.webp',
    width: 1800,
    height: 1013,
  },
  {
    src: '/assets/work/visual/cinematic-character/040.webp',
    width: 1664,
    height: 960,
  },
  {
    src: '/assets/work/visual/fitness-training/069.webp',
    width: 1800,
    height: 1018,
  },
];

export const workCovers = [
  {
    category: 'Websites',
    description: 'Custom websites. Online stores. Digital experiences.',
    href: '/work/web-design',
    image: '/assets/work/videos/centum-cover.gif',
    still: '/assets/work/centum-thumbnail.jpg',
    width: 480,
    height: 279,
    alt: 'A looping preview of a custom website.',
    treatment: 'web',
  },
  {
    category: 'Visual',
    description: 'Image-making. Art direction. Visual concepts.',
    href: '/work/visual-design',
    image: visualCoverFrames[0].src,
    still: visualCoverFrames[0].src,
    width: 1800,
    height: 1005,
    alt: 'Selected visual work across fashion, architecture, portraits and fitness.',
    treatment: 'visual',
  },
  {
    category: 'Branding',
    description: 'Logo design. Visual identities. Brand systems.',
    href: '/work/branding',
    image: '/assets/work/alias/liquid-metal-cover.gif',
    still: '/assets/work/alias/liquid-metal-poster.jpg',
    width: 640,
    height: 640,
    alt: 'ALIAS liquid-metal chrome identity on black.',
    treatment: 'brand',
  },
];

export type WorkCoverItem = (typeof workCovers)[number];
