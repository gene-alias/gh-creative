import Image from 'next/image';

/** Supplied GH cube artwork, shared by navigation and contact surfaces. */
export function GHMonogram({ wordmark = false }: { wordmark?: boolean }) {
  return (
    <Image
      className={wordmark ? 'hero-wordmark' : 'hero-monogram'}
      src={wordmark ? '/assets/gh-logo-wordmark.svg' : '/assets/gh-cube-logo.png'}
      width={wordmark ? 744 : 1302}
      height={wordmark ? 95 : 1208}
      alt=""
      aria-hidden="true"
      unoptimized
    />
  );
}
