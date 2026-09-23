import {
  MULTIPLIERS,
  MAX_WIN,
  PAYLINES,
  PAYS,
  REELS,
  REEL_POOL,
  ROWS,
  SCATTER_CHANCE,
  VS_CHANCE_BASE,
  VS_CHANCE_FREE,
  type SymbolId,
} from "./config";

export type Grid = SymbolId[][]; // [reel][row]

export interface SpinResult {
  grid: Grid;
  vsReels: number[];
  multipliers: Record<number, number>;
  scatters: number;
}

export interface WinLine {
  line: number;
  symbol: SymbolId;
  count: number;
  multiplier: number;
  amount: number;
  cells: Array<{ reel: number; row: number }>;
}

function pick<T>(list: { v: T; w: number }[]): T {
  const total = list.reduce((s, a) => s + a.w, 0);
  let r = Math.random() * total;
  for (const a of list) {
    r -= a.w;
    if (r <= 0) return a.v;
  }
  return list[list.length - 1]!.v;
}

export function randomSymbol(): SymbolId {
  return pick(REEL_POOL);
}

export function blankGrid(): Grid {
  return Array.from({ length: REELS }, () =>
    Array.from({ length: ROWS }, () => randomSymbol()),
  );
}

export function generateSpin(freeSpin: boolean): SpinResult {
  const vsChance = freeSpin ? VS_CHANCE_FREE : VS_CHANCE_BASE;
  const grid: Grid = [];
  const vsReels: number[] = [];
  const multipliers: Record<number, number> = {};
  let scatters = 0;

  for (let reel = 0; reel < REELS; reel++) {
    const column: SymbolId[] = Array.from({ length: ROWS }, () => randomSymbol());
    if (Math.random() < vsChance) {
      vsReels.push(reel);
      multipliers[reel] = pick(MULTIPLIERS);
      column[Math.floor(Math.random() * ROWS)] = "vs";
    } else if (!freeSpin && Math.random() < SCATTER_CHANCE) {
      column[Math.floor(Math.random() * ROWS)] = "scatter";
      scatters++;
    }
    grid.push(column);
  }

  return { grid, vsReels, multipliers, scatters };
}

/** Expand every VS reel into a full wild reel. */
export function applyWilds(grid: Grid, vsReels: number[]): Grid {
  return grid.map((column, reel) =>
    vsReels.includes(reel) ? column.map(() => "wild" as SymbolId) : [...column],
  );
}

export function evaluate(
  grid: Grid,
  vsReels: number[],
  multipliers: Record<number, number>,
  bet: number,
): { wins: WinLine[]; total: number } {
  const wins: WinLine[] = [];

  PAYLINES.forEach((line, lineIndex) => {
    const symbols = line.map((row, reel) => grid[reel]![row]!);

    let target: SymbolId | null = null;
    for (const s of symbols) {
      if (s === "wild") continue;
      if (s === "scatter" || s === "vs") break;
      target = s;
      break;
    }
    if (target === null) target = "crowking"; // all-wild line pays the top symbol

    let count = 0;
    for (const s of symbols) {
      if (s === "wild" || s === target) count++;
      else break;
    }
    if (count < 3) return;

    const pay = PAYS[target]?.[count - 3] ?? 0;
    if (pay <= 0) return;

    let multSum = 0;
    for (let reel = 0; reel < count; reel++) {
      if (vsReels.includes(reel)) multSum += multipliers[reel] ?? 0;
    }
    const multiplier = multSum > 0 ? multSum : 1;

    wins.push({
      line: lineIndex,
      symbol: target,
      count,
      multiplier,
      amount: pay * bet * multiplier,
      cells: line.slice(0, count).map((row, reel) => ({ reel, row })),
    });
  });

  const raw = wins.reduce((s, w) => s + w.amount, 0);
  const total = Math.min(raw, MAX_WIN * bet);
  return { wins, total };
}

export function countScatters(grid: Grid): number {
  return grid.reduce(
    (sum, column) => sum + column.filter((s) => s === "scatter").length,
    0,
  );
}
