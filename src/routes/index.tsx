import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Info, Minus, Plus, RotateCcw } from "lucide-react";

import graveyard from "@/assets/bg-graveyard.jpg";
import { DuelOverlay } from "@/components/slot/DuelOverlay";
import { Paytable } from "@/components/slot/Paytable";
import { SlotGrid } from "@/components/slot/SlotGrid";
import { Button } from "@/components/ui/button";
import { BET_STEPS, BUY_COST } from "@/lib/slot/config";
import { useSlot } from "@/lib/slot/useSlot";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Mad Crow – Duel at Dawn" },
      {
        name: "description",
        content: "Gótikus 5×5-ös nyerőgép kiterjedő wild oszlopokkal és párbajszorzókkal.",
      },
      { property: "og:title", content: "Mad Crow – Duel at Dawn" },
      {
        property: "og:description",
        content: "A hollók párbaja: teljes wild oszlopok, akár 100× szorzóval.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const money = (value: number) =>
  new Intl.NumberFormat("hu-HU", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);

function Index() {
  const game = useSlot();
  const [showPaytable, setShowPaytable] = useState(false);

  const status = game.inFree
    ? `INGYENPÖRGETÉS · ${game.freeLeft} MARADT`
    : game.lastWin > 0
      ? `NYEREMÉNY ${money(game.lastWin)}`
      : "15 NYERŐVONAL · AKÁR 12 500×";

  return (
    <main className="relative min-h-screen overflow-hidden bg-background text-foreground">
      <img
        src={graveyard}
        alt="Holdfényes, ködös temető a Mad Crow játék hátterében"
        className="fixed inset-0 h-full w-full object-cover object-center"
      />
      <div className="fixed inset-0 bg-background/35" />
      <div className="fixed inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-background via-background/55 to-transparent" />

      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-6xl flex-col px-3 py-3 sm:px-6 sm:py-5">
        <header className="flex items-start justify-between gap-4">
          <div>
            <p className="font-display text-xs uppercase text-primary sm:text-sm">
              Duel at Dawn
            </p>
            <h1 className="font-display text-gold-shine text-4xl leading-none sm:text-6xl">
              MAD CROW
            </h1>
          </div>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={game.resetBalance}
              disabled={game.busy}
              aria-label="Egyenleg visszaállítása"
              title="Egyenleg visszaállítása"
              className="border-border/80 bg-background/70"
            >
              <RotateCcw />
            </Button>
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() => setShowPaytable(true)}
              aria-label="Nyereménytábla"
              title="Nyereménytábla"
              className="border-border/80 bg-background/70"
            >
              <Info />
            </Button>
          </div>
        </header>

        <section className="mx-auto mt-2 flex w-full max-w-4xl flex-1 flex-col justify-center sm:mt-0">
          <div className="mb-2 flex min-h-7 items-center justify-center text-center">
            <p className="font-display text-sm text-bone sm:text-lg">{status}</p>
          </div>

          <div className="panel relative rounded-md p-1.5 sm:p-3">
            <div className="pointer-events-none absolute inset-x-5 -top-px h-px bg-primary/70 shadow-glow" />
            <SlotGrid
              grid={game.grid}
              spinningReels={game.spinningReels}
              wildReels={game.wildReels}
              multipliers={game.multipliers}
              winCells={game.winCells}
            />
            <DuelOverlay duel={game.duel} />
            {game.banner ? (
              <div className="absolute inset-0 z-30 flex items-center justify-center bg-background/85 text-center backdrop-blur-sm">
                <div className="anim-rise px-5">
                  <p className="font-display text-primary text-2xl sm:text-4xl">
                    {game.banner.kind === "trigger" ? "DUEL AT DAWN" : "A PÁRBAJ VÉGET ÉRT"}
                  </p>
                  <p className="font-display text-gold-shine mt-2 text-5xl sm:text-7xl">
                    {game.banner.kind === "trigger"
                      ? `${game.banner.value} PÖRGETÉS`
                      : `${money(game.banner.value)} NYEREMÉNY`}
                  </p>
                </div>
              </div>
            ) : null}
          </div>

          <div className="mt-3 grid grid-cols-3 gap-2 sm:mt-4 sm:gap-3">
            <div className="panel flex min-h-16 flex-col justify-center rounded-md px-3 text-center">
              <span className="text-[10px] uppercase text-muted-foreground sm:text-xs">Egyenleg</span>
              <strong className="font-display text-lg text-bone sm:text-2xl">{money(game.balance)}</strong>
            </div>

            <div className="panel flex min-h-16 items-center justify-between rounded-md px-1 sm:px-2">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => game.changeBet(-1)}
                disabled={game.busy || game.betIndex === 0}
                aria-label="Tét csökkentése"
              >
                <Minus />
              </Button>
              <div className="min-w-0 text-center">
                <span className="block text-[10px] uppercase text-muted-foreground sm:text-xs">Tét</span>
                <strong className="font-display text-lg text-primary sm:text-2xl">{money(game.bet)}</strong>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => game.changeBet(1)}
                disabled={game.busy || game.betIndex === BET_STEPS.length - 1}
                aria-label="Tét növelése"
              >
                <Plus />
              </Button>
            </div>

            <div className="panel flex min-h-16 flex-col justify-center rounded-md px-3 text-center">
              <span className="text-[10px] uppercase text-muted-foreground sm:text-xs">Bónusz nyeremény</span>
              <strong className="font-display text-lg text-bone sm:text-2xl">{money(game.freeTotal)}</strong>
            </div>
          </div>

          <div className="mt-3 grid grid-cols-[minmax(0,1fr)_4.5rem] gap-2 sm:grid-cols-[minmax(0,1fr)_6rem] sm:gap-3">
            <Button
              type="button"
              variant="secondary"
              onClick={game.buyBonus}
              disabled={game.busy || game.balance < game.bet * BUY_COST}
              className="h-14 border border-border bg-secondary/90 font-display text-base sm:h-16 sm:text-xl"
            >
              BÓNUSZ VÁSÁRLÁS · {money(game.bet * BUY_COST)}
            </Button>
            <Button
              type="button"
              onClick={game.spin}
              disabled={game.busy || game.balance < game.bet}
              aria-label="Pörgetés"
              className="spin-button h-14 rounded-full border-2 border-primary-foreground/30 font-display text-lg sm:h-16 sm:text-xl"
            >
              {game.busy ? "…" : "SPIN"}
            </Button>
          </div>
        </section>

        <footer className="mt-3 text-center text-[10px] uppercase text-muted-foreground sm:text-xs">
          Demo játék · Valódi pénz nélkül
        </footer>
      </div>

      {showPaytable ? <Paytable onClose={() => setShowPaytable(false)} /> : null}
    </main>
  );
}
