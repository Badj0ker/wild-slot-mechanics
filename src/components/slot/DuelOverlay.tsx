import duelist from "@/assets/duelist.png";
import wildColumn from "@/assets/sym-wild-column.png";
import type { DuelState } from "@/lib/slot/useSlot";

export function DuelOverlay({ duel }: { duel: DuelState | null }) {
  if (!duel) return null;

  return (
    <div className="pointer-events-none absolute inset-1.5 z-20 grid grid-cols-5 gap-1 sm:inset-3 sm:gap-2">
      {Array.from({ length: 5 }, (_, reel) => {
        const duelIndex = duel.reels.indexOf(reel);
        if (duelIndex < 0) return <div key={reel} />;

        const revealed = duelIndex < duel.revealed;
        const active = duelIndex === duel.revealed;

        return (
          <div
            key={reel}
            className={`relative overflow-hidden rounded-md ${active ? "duel-reel-active" : ""}`}
          >
            {revealed ? (
              <div className="anim-wild-expand absolute inset-0 flex items-center justify-center">
                <img
                  src={wildColumn}
                  alt="Kiterjedt Mad Crow WILD"
                  className="h-full w-full object-contain"
                />
                <span className="wild-multiplier anim-rise font-display text-gold-shine">
                  {duel.multipliers[reel]}X
                </span>
              </div>
            ) : active ? (
              <div className="absolute inset-0 overflow-hidden bg-background/80">
                <div className="anim-flash absolute inset-0 bg-accent/30" />
                <img
                  src={duelist}
                  alt="Bal oldali holló bandita"
                  className="anim-duelist-l absolute -left-[34%] bottom-0 h-[82%] max-w-none object-contain"
                />
                <img
                  src={duelist}
                  alt="Jobb oldali holló bandita"
                  className="anim-duelist-r absolute -right-[34%] bottom-0 h-[82%] max-w-none object-contain"
                />
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <span className="font-display text-[9px] uppercase text-primary sm:text-xs">Párbaj</span>
                  <span className="duel-vs font-display text-gold-shine text-3xl sm:text-5xl">VS</span>
                </div>
              </div>
            ) : (
              <div className="absolute inset-0 bg-background/35" />
            )}
          </div>
        );
      })}
    </div>
  );
}
