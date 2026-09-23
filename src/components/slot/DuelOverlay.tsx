import duelist from "@/assets/duelist.png";
import type { DuelState } from "@/lib/slot/useSlot";

export function DuelOverlay({ duel }: { duel: DuelState | null }) {
  if (!duel) return null;

  return (
    <div className="pointer-events-none absolute inset-0 z-20 flex flex-col items-center justify-center bg-background/80 backdrop-blur-[2px]">
      <div className="anim-flash absolute inset-0 bg-accent/30" />

      <p className="font-display text-primary text-2xl sm:text-4xl tracking-widest">
        PÁRBAJ HAJNALBAN
      </p>

      <div className="mt-2 flex w-full max-w-lg items-end justify-between px-4">
        <img
          src={duelist}
          alt="Duelist"
          loading="lazy"
          width={376}
          height={448}
          className="anim-duelist-l h-32 w-auto sm:h-48"
        />
        <div className="flex flex-wrap items-center justify-center gap-2 pb-6">
          {duel.reels.map((reel, i) =>
            i < duel.revealed ? (
              <span
                key={reel}
                className="anim-rise font-display text-gold-shine text-4xl sm:text-6xl"
              >
                {duel.multipliers[reel]}X
              </span>
            ) : (
              <span
                key={reel}
                className="font-display text-3xl text-muted-foreground sm:text-5xl"
              >
                ?
              </span>
            ),
          )}
        </div>
        <img
          src={duelist}
          alt="Duelist"
          loading="lazy"
          width={376}
          height={448}
          className="anim-duelist-r h-32 w-auto sm:h-48"
        />
      </div>
    </div>
  );
}
