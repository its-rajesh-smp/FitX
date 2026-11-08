
/**
 * A very light photo behind a bento tile. The tile needs `isolate` so the
 * negative z-index keeps the photo under its content but over its background.
 */
export function TileBackdrop({ src }: { src: string }) {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
      <img
        src={src}
        alt=""
        loading="lazy"
        decoding="async"
        className="absolute inset-0 size-full object-cover object-bottom"
      />
      <div className="absolute inset-0 bg-linear-to-b from-white/60 via-white/30 to-transparent" />
    </div>
  );
}
