import { SYMBOL_IMAGES } from "@/lib/slot/symbols";
import type { Grid } from "@/lib/slot/engine";
import type { SymbolId } from "@/lib/slot/config";

interface Props {
  grid: Grid;
  spinningReels: number[];
  wildReels: number[];
  multipliers: Record<number, number>;
  winCells: Set<string>;
}

const BLUR_SET: SymbolId[] = [
  "chalice",
  "skull",
  "lantern",
  "raven",
  "gravedigger",
  "crowking",
];

function Symbol({ id, win }: { id: SymbolId; win: boolean }) {
  return (
    <img
      src={SYMBOL_IMAGES[id]}
      alt={id}
      loading="lazy"
      width={512}
      height={512}
      className={`h-full w-full object-contain drop-shadow-[0_4px_10px_oklch(0_0_0/0.6)] ${
        win ? "anim-win" : ""
      }`}
    />
  );
}

export function SlotGrid({
  grid,
  spinningReels,
  wildReels,
  multipliers,
  winCells,
}: Props) {
  return (
    <div className="grid grid-cols-5 gap-1 sm:gap-2">
      {grid.map((column, reel) => {
        const spinning = spinningReels.includes(reel);
        const isWild = wildReels.includes(reel);
        return (
          <div
            key={reel}
            className={`relative overflow-hidden rounded-md border border-border/70 bg-background/55 ${
              isWild ? "wild-column" : ""
            }`}
          >
            <div className="flex flex-col gap-1 p-1">
              {column.map((sym, row) => {
                const win = winCells.has(`${reel}-${row}`);
                return (
                  <div
                    key={row}
                    className={`relative aspect-square rounded-sm p-[6%] ${
                      win ? "cell-glow" : ""
                    }`}
                  >
                    {spinning ? (
                      <div className="anim-reel h-full w-full">
                        <Symbol
                          id={BLUR_SET[(reel * 3 + row) % BLUR_SET.length]!}
                          win={false}
                        />
                      </div>
                    ) : (
                      <div
                        key={sym + String(row)}
                        className="anim-drop h-full w-full"
                      >
                        <Symbol id={sym} win={win} />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {isWild && multipliers[reel] ? (
              <div className="pointer-events-none absolute inset-x-0 bottom-1 flex justify-center">
                <span className="anim-rise font-display text-gold-shine text-3xl sm:text-5xl drop-shadow-[0_2px_8px_oklch(0_0_0/0.9)]">
                  {multipliers[reel]}X
                </span>
              </div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
