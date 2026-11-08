import { TONE_INK, type CardTone } from "@/features/landing/constants/cardTones";

/** Bento title: the first words take the tile's pastel ink, the rest stays ink. */
export function TileHeading({
  tone,
  lead,
  rest,
  text,
}: {
  tone: CardTone;
  lead: string;
  rest: string;
  text: string;
}) {
  return (
    <div>
      <h3 className="text-2xl leading-tight font-medium tracking-[-0.035em] text-balance">
        <span className={TONE_INK[tone]}>{lead}</span> {rest}
      </h3>
      <p className="mt-2 text-[15px] leading-relaxed text-pretty text-muted">{text}</p>
    </div>
  );
}
