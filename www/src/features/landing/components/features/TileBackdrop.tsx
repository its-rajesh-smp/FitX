import Image, { type StaticImageData } from "next/image";

/**
 * A very light photo behind a bento tile. The tile needs `isolate` so the
 * negative z-index keeps the photo under its content but over its background.
 */
export function TileBackdrop({ src }: { src: StaticImageData }) {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
      <Image
        src={src}
        alt=""
        fill
        quality={86}
        placeholder="blur"
        sizes="(min-width: 1024px) 560px, (min-width: 768px) 50vw, 100vw"
        className="object-cover object-bottom"
      />
      <div className="absolute inset-0 bg-linear-to-b from-white/60 via-white/30 to-transparent" />
    </div>
  );
}
