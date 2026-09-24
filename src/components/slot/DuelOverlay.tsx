import duelist from "@/assets/duelist.png";
import type { DuelState } from "@/lib/slot/useSlot";

export function DuelOverlay({ duel }: { duel: DuelState | null }) {
  if (!duel) return null;

  const activeReel = duel.reels[duel.revealed];

  return (
    <div className="pointer-events-none absolute inset-0 z-20 flex flex-col items-center justify-center overflow-hidden bg-background/90 backdrop-blur-[2px]">
      <div className="anim-flash absolute inset-0 bg-accent/30" />

      <div className="relative z-10 text-center">
        <p className="font-display text-primary text-xs uppercase sm:text-base">Duel at Dawn</p>
        <p className="font-display text-gold-shine text-3xl sm:text-5xl">PÁRBAJ A WILDÉRT</p>
      </div>

      <div className="relative z-10 -mt-2 flex w-full max-w-2xl items-end justify-between px-1 sm:-mt-5 sm:px-5">
        <img
          src={duelist}
          alt="Bal oldali holló bandita"
          width={376}
          height={448}
          className="anim-duelist-l h-36 w-auto object-contain sm:h-64"
        />
        <div className="flex min-w-24 flex-col items-center pb-5 text-center sm:min-w-40 sm:pb-12">
          <span className="font-display text-xs text-muted-foreground sm:text-sm">
            {activeReel === undefined ? "GYŐZTES SZORZÓ" : `${activeReel + 1}. OSZLOP`}
          </span>
          <span className="duel-shot font-display text-gold-shine text-5xl sm:text-8xl">
            {activeReel === undefined ? "WILD" : "?"}
          </span>
        </div>
        <img
          src={duelist}
          alt="Jobb oldali holló bandita"
          width={376}
          height={448}
          className="anim-duelist-r h-36 w-auto object-contain sm:h-64"
        />
      </div>

      <div className="absolute inset-x-2 bottom-2 z-20 grid grid-cols-5 gap-1 sm:inset-x-4 sm:bottom-4 sm:gap-2">
        {Array.from({ length: 5 }, (_, reel) => {
          const duelIndex = duel.reels.indexOf(reel);
          const revealed = duelIndex >= 0 && duelIndex < duel.revealed;
          const waiting = duelIndex >= 0 && !revealed;
          return (
            <div key={reel} className="flex h-10 items-center justify-center sm:h-14">
              {revealed ? (
                <span className="anim-rise font-display text-gold-shine text-3xl sm:text-5xl">
                  {duel.multipliers[reel]}X
                </span>
              ) : waiting ? (
                <span className="font-display text-2xl text-muted-foreground sm:text-4xl">?</span>
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}
