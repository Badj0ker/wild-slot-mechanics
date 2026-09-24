import { useCallback, useEffect, useRef, useState } from "react";
import {
  BET_STEPS,
  BUY_COST,
  FREE_SPINS,
  START_BALANCE,
  type SymbolId,
} from "./config";
import {
  applyWilds,
  blankGrid,
  countScatters,
  evaluate,
  generateSpin,
  type Grid,
  type WinLine,
} from "./engine";

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
const STORE_KEY = "madcrow.state.v1";
const INITIAL_GRID: Grid = [
  ["chalice", "skull", "raven", "lantern", "gravedigger"],
  ["raven", "lantern", "chalice", "crowking", "skull"],
  ["gravedigger", "chalice", "skull", "raven", "lantern"],
  ["lantern", "raven", "crowking", "skull", "chalice"],
  ["skull", "gravedigger", "lantern", "chalice", "raven"],
];

export interface DuelState {
  reels: number[];
  multipliers: Record<number, number>;
  revealed: number;
}

export function useSlot() {
  const [balance, setBalance] = useState(START_BALANCE);
  const [betIndex, setBetIndex] = useState(2);
  const [grid, setGrid] = useState<Grid>(() => INITIAL_GRID.map((column) => [...column]));
  const [spinningReels, setSpinningReels] = useState<number[]>([]);
  const [wildReels, setWildReels] = useState<number[]>([]);
  const [multipliers, setMultipliers] = useState<Record<number, number>>({});
  const [wins, setWins] = useState<WinLine[]>([]);
  const [lastWin, setLastWin] = useState(0);
  const [duel, setDuel] = useState<DuelState | null>(null);
  const [freeLeft, setFreeLeft] = useState(0);
  const [inFree, setInFree] = useState(false);
  const [freeTotal, setFreeTotal] = useState(0);
  const [banner, setBanner] = useState<null | {
    kind: "trigger" | "summary";
    value: number;
  }>(null);
  const [busy, setBusy] = useState(false);
  const busyRef = useRef(false);

  const bet = BET_STEPS[betIndex]!;

  // restore / persist
  useEffect(() => {
    setGrid(blankGrid());
    try {
      const raw = localStorage.getItem(STORE_KEY);
      if (raw) {
        const s = JSON.parse(raw) as { balance?: number; betIndex?: number };
        if (typeof s.balance === "number") setBalance(s.balance);
        if (typeof s.betIndex === "number") setBetIndex(s.betIndex);
      }
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORE_KEY, JSON.stringify({ balance, betIndex }));
    } catch {
      /* ignore */
    }
  }, [balance, betIndex]);

  const spinOnce = useCallback(
    async (freeSpin: boolean, stake: number): Promise<{ win: number; scatters: number }> => {
      setWins([]);
      setLastWin(0);
      setWildReels([]);
      setMultipliers({});

      const result = generateSpin(freeSpin);
      setSpinningReels([0, 1, 2, 3, 4]);
      await sleep(420);

      for (let reel = 0; reel < 5; reel++) {
        setGrid((current) => {
          const next = current.map((c) => [...c]) as Grid;
          next[reel] = [...result.grid[reel]!] as SymbolId[];
          return next;
        });
        setSpinningReels((s) => s.filter((r) => r !== reel));
        await sleep(150);
      }

      let finalGrid = result.grid;

      if (result.vsReels.length > 0) {
        await sleep(250);
        setDuel({ reels: result.vsReels, multipliers: result.multipliers, revealed: 0 });
        for (let i = 0; i < result.vsReels.length; i++) {
          await sleep(620);
          setDuel((d) => (d ? { ...d, revealed: i + 1 } : d));
        }
        await sleep(650);
        setDuel(null);
        finalGrid = applyWilds(result.grid, result.vsReels);
        setGrid(finalGrid);
        setWildReels(result.vsReels);
        setMultipliers(result.multipliers);
        await sleep(300);
      }

      const { wins: lines, total } = evaluate(
        finalGrid,
        result.vsReels,
        result.multipliers,
        stake,
      );

      if (total > 0) {
        setWins(lines);
        setLastWin(total);
        setBalance((b) => b + total);
      }

      return { win: total, scatters: countScatters(result.grid) };
    },
    [],
  );

  const runFreeSpins = useCallback(
    async (stake: number) => {
      setInFree(true);
      setBanner({ kind: "trigger", value: FREE_SPINS });
      await sleep(1800);
      setBanner(null);

      let total = 0;
      for (let i = 0; i < FREE_SPINS; i++) {
        setFreeLeft(FREE_SPINS - i);
        const { win } = await spinOnce(true, stake);
        total += win;
        setFreeTotal(total);
        await sleep(win > 0 ? 1100 : 500);
      }
      setFreeLeft(0);
      setInFree(false);
      setBanner({ kind: "summary", value: total });
      await sleep(2600);
      setBanner(null);
      setFreeTotal(0);
    },
    [spinOnce],
  );

  const spin = useCallback(async () => {
    if (busyRef.current) return;
    if (balance < bet) return;
    busyRef.current = true;
    setBusy(true);
    const stake = bet;
    setBalance((b) => b - stake);

    const { scatters } = await spinOnce(false, stake);
    if (scatters >= 3) {
      await sleep(900);
      await runFreeSpins(stake);
    }

    busyRef.current = false;
    setBusy(false);
  }, [balance, bet, runFreeSpins, spinOnce]);

  const buyBonus = useCallback(async () => {
    if (busyRef.current) return;
    const cost = bet * BUY_COST;
    if (balance < cost) return;
    busyRef.current = true;
    setBusy(true);
    const stake = bet;
    setBalance((b) => b - cost);
    await runFreeSpins(stake);
    busyRef.current = false;
    setBusy(false);
  }, [balance, bet, runFreeSpins]);

  const changeBet = useCallback(
    (dir: -1 | 1) => {
      if (busyRef.current) return;
      setBetIndex((i) => Math.min(BET_STEPS.length - 1, Math.max(0, i + dir)));
    },
    [],
  );

  const resetBalance = useCallback(() => {
    if (busyRef.current) return;
    setBalance(START_BALANCE);
  }, []);

  const winCells = new Set<string>();
  wins.forEach((w) => w.cells.forEach((c) => winCells.add(`${c.reel}-${c.row}`)));

  return {
    balance,
    bet,
    betIndex,
    grid,
    spinningReels,
    wildReels,
    multipliers,
    wins,
    winCells,
    lastWin,
    duel,
    freeLeft,
    inFree,
    freeTotal,
    banner,
    busy,
    spin,
    buyBonus,
    changeBet,
    resetBalance,
  };
}
