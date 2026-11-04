/** Spin-page live events. Each event lasts 24h or 48h and restarts automatically with fresh progress. */
export type EventReward = { coins?: number; spins?: number; tickets?: number };
export interface EventDef { key: string; name: string; hours: 24 | 48; offsetH: number }

export const LIVE_EVENTS: EventDef[] = [
  { key: "house", name: "Tabletop Frenzy", hours: 24, offsetH: 0 },
  { key: "dice", name: "Game Night", hours: 48, offsetH: 6 },
  { key: "pumpkin", name: "Pumpkin Party", hours: 24, offsetH: 12 },
  { key: "frog", name: "Frog Frenzy", hours: 48, offsetH: 18 },
  { key: "star", name: "Star Rush", hours: 24, offsetH: 4 },
  { key: "ghost", name: "Spooky Stitch", hours: 48, offsetH: 30 },
];

/** Run number of an event (changes when the event restarts) and time left. */
export function eventRun(def: EventDef, now: number) {
  const ms = def.hours * 3600_000, t = now + def.offsetH * 3600_000;
  return { run: Math.floor(t / ms), endsIn: ms - (t % ms) };
}

/** Reward milestones: tokens needed (cumulative) and what each pays. */
export const TIER_COUNT = 12;
export function tierNeed(i: number) { return [5, 5, 7, 7, 10, 12, 15, 18, 22, 26, 30, 35].slice(0, i + 1).reduce((a, b) => a + b, 0); }
export function tierReward(i: number): EventReward {
  const kind = i % 3;
  if (kind === 0) return { coins: Math.round(2000 * Math.pow(1.6, i)) };
  if (kind === 1) return { spins: 10 + i * 5 };
  return { tickets: 1 + Math.floor(i / 4) };
}

export interface EventProgress { run: number; tokens: number; claimed: number }
/** Progress for the current run; resets to zero when the event restarted. */
export function progressFor(p: EventProgress | undefined, run: number): EventProgress {
  return p && p.run === run ? p : { run, tokens: 0, claimed: 0 };
}
/** Add landed tokens (every single token counts). */
export function addTokens(p: EventProgress | undefined, run: number, n: number): EventProgress {
  const cur = progressFor(p, run);
  return { ...cur, tokens: cur.tokens + n };
}
/** Number of reached-but-unclaimed milestones. */
export function claimable(p: EventProgress) {
  let n = 0;
  for (let i = p.claimed; i < TIER_COUNT && p.tokens >= tierNeed(i); i++) n++;
  return n;
}
