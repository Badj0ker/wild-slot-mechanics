import { PAYABLE, PAYS, SYMBOL_NAMES } from "@/lib/slot/config";
import { SYMBOL_IMAGES } from "@/lib/slot/symbols";

export function Paytable({ onClose }: { onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-background/85 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="panel my-8 w-full max-w-2xl rounded-lg p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h2 className="font-display text-3xl text-primary">Nyereménytábla</h2>
          <button
            onClick={onClose}
            className="rounded border border-border px-3 py-1 text-sm text-muted-foreground transition hover:text-foreground"
          >
            Bezár
          </button>
        </div>

        <p className="mt-2 text-sm text-muted-foreground">
          Kifizetések a teljes tét szorzójában, balról jobbra, 15 nyerővonalon.
        </p>

        <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
          {PAYABLE.map((id) => (
            <div
              key={id}
              className="flex items-center gap-3 rounded border border-border/60 bg-card/60 p-2"
            >
              <img
                src={SYMBOL_IMAGES[id]}
                alt={id}
                loading="lazy"
                width={512}
                height={512}
                className="h-12 w-12 object-contain"
              />
              <div className="text-sm">
                <p className="font-display text-lg text-bone">{SYMBOL_NAMES[id]}</p>
                <p className="text-muted-foreground">
                  5: {PAYS[id]![2]}x · 4: {PAYS[id]![1]}x · 3: {PAYS[id]![0]}x
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 space-y-4 text-sm leading-relaxed text-muted-foreground">
          <div className="flex gap-3">
            <img
              src={SYMBOL_IMAGES.vs}
              alt="VS"
              loading="lazy"
              width={512}
              height={512}
              className="h-14 w-14 shrink-0 object-contain"
            />
            <p>
              <span className="font-display text-lg text-primary">
                DuelReels™ – VS szimbólum
              </span>
              <br />
              Ha VS szimbólum érkezik egy tárcsára, az egész oszlop wildra terjed
              ki, és lezajlik egy párbaj. A győztes szorzója (2x–100x) az egész
              oszlopra érvényes. Ha több wild oszlop van ugyanabban a nyerő
              kombinációban, a szorzóik <strong>összeadódnak</strong>, és úgy
              szorozzák a vonalnyereményt.
            </p>
          </div>

          <div className="flex gap-3">
            <img
              src={SYMBOL_IMAGES.scatter}
              alt="Scatter"
              loading="lazy"
              width={512}
              height={512}
              className="h-14 w-14 shrink-0 object-contain"
            />
            <p>
              <span className="font-display text-lg text-primary">
                Duel at Dawn
              </span>
              <br />
              3 vagy több DUEL scatter 10 ingyenpörgetést indít, ahol jóval
              gyakoribbak a VS szimbólumok – akár mind az 5 oszlop wild lehet
              egyszerre. Megvásárolható a tét 100-szorosáért.
            </p>
          </div>

          <div className="flex gap-3">
            <img
              src={SYMBOL_IMAGES.wild}
              alt="Wild"
              loading="lazy"
              width={512}
              height={512}
              className="h-14 w-14 shrink-0 object-contain"
            />
            <p>
              <span className="font-display text-lg text-primary">Wild</span>
              <br />
              Minden kifizető szimbólumot helyettesít. Maximális nyeremény:{" "}
              <strong>12 500x</strong> a tét.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
