import Image from 'next/image';

type WebsitePreviewProps = {
  animation: string;
  poster: string;
  label: string;
  width: number;
  height: number;
};

/** Animated image previews loop without browser video controls or autoplay policy. */
export function WebsitePreview({
  animation,
  poster,
  label,
  width,
  height,
}: WebsitePreviewProps) {
  return (
    <picture className="mini-website-video">
      <source media="(prefers-reduced-motion: reduce)" srcSet={poster} />
      <Image
        unoptimized
        src={animation}
        alt={label}
        width={width}
        height={height}
        sizes="(min-width: 900px) 65vw, 90vw"
      />
    </picture>
  );
}
