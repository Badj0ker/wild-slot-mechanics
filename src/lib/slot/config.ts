export type SymbolId =
  | "crowking"
  | "gravedigger"
  | "raven"
  | "lantern"
  | "skull"
  | "chalice"
  | "wild"
  | "scatter"
  | "vs";

export const ROWS = 5;
export const REELS = 5;

/** Pays are expressed as a multiple of the TOTAL bet, for [3, 4, 5] of a kind. */
export const PAYS: Record<string, [number, number, number]> = {
  crowking: [0.5, 2, 10],
  gravedigger: [0.3, 1.2, 5],
  raven: [0.2, 0.8, 3],
  lantern: [0.1, 0.4, 1.5],
  skull: [0.08, 0.3, 1],
  chalice: [0.06, 0.2, 0.8],
};

export const PAYABLE: SymbolId[] = [
  "crowking",
  "gravedigger",
  "raven",
  "lantern",
  "skull",
  "chalice",
];

export const SYMBOL_NAMES: Record<SymbolId, string> = {
  crowking: "Crow King",
  gravedigger: "Sírásó",
  raven: "Holló",
  lantern: "Lidérclámpás",
  skull: "Koponya",
  chalice: "Kehely",
  wild: "Wild",
  scatter: "Duel Scatter",
  vs: "VS",
};

/** 15 fixed paylines on the 5x5 grid (row index per reel). */
export const PAYLINES: number[][] = [
  [0, 0, 0, 0, 0],
  [1, 1, 1, 1, 1],
  [2, 2, 2, 2, 2],
  [3, 3, 3, 3, 3],
  [4, 4, 4, 4, 4],
  [0, 1, 2, 3, 4],
  [4, 3, 2, 1, 0],
  [0, 1, 0, 1, 0],
  [4, 3, 4, 3, 4],
  [1, 2, 3, 2, 1],
  [3, 2, 1, 2, 3],
  [2, 1, 0, 1, 2],
  [2, 3, 4, 3, 2],
  [0, 0, 1, 0, 0],
  [4, 4, 3, 4, 4],
];

export const REEL_POOL: { v: SymbolId; w: number }[] = [
  { v: "chalice", w: 22 },
  { v: "skull", w: 20 },
  { v: "lantern", w: 18 },
  { v: "raven", w: 12 },
  { v: "gravedigger", w: 9 },
  { v: "crowking", w: 6 },
  { v: "wild", w: 3 },
];

/** DuelReels multiplier table (up to 100x). */
export const MULTIPLIERS: { v: number; w: number }[] = [
  { v: 2, w: 34 },
  { v: 3, w: 22 },
  { v: 4, w: 14 },
  { v: 5, w: 10 },
  { v: 8, w: 7 },
  { v: 10, w: 5 },
  { v: 15, w: 3 },
  { v: 20, w: 2 },
  { v: 25, w: 1.5 },
  { v: 50, w: 0.8 },
  { v: 100, w: 0.3 },
];

export const VS_CHANCE_BASE = 0.05;
export const VS_CHANCE_FREE = 0.32;
export const SCATTER_CHANCE = 0.085;

export const FREE_SPINS = 10;
export const BUY_COST = 100; // x bet
export const MAX_WIN = 12500; // x bet

export const BET_STEPS = [0.2, 0.4, 1, 2, 5, 10, 20, 50, 75];
export const START_BALANCE = 1000;
