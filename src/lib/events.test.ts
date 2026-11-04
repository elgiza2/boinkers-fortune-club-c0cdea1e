import { describe, expect, it } from "vitest";
import { LIVE_EVENTS, addTokens, claimable, eventRun, tierNeed } from "./events";

describe("live events", () => {
  it("has more than 5 events lasting 24h or 48h", () => {
    expect(LIVE_EVENTS.length).toBeGreaterThan(5);
    expect(LIVE_EVENTS.every((e) => e.hours === 24 || e.hours === 48)).toBe(true);
  });
  it("restarts after its duration", () => {
    const e = LIVE_EVENTS[0]!; // 24h, no offset
    expect(eventRun(e, 0).run).not.toBe(eventRun(e, 24 * 3600_000).run);
    expect(eventRun(e, 0).run).toBe(eventRun(e, 23 * 3600_000).run);
  });
  it("counts even a single token", () => {
    expect(addTokens(undefined, 1, 1).tokens).toBe(1);
  });
  it("progress resets on a new run", () => {
    expect(addTokens({ run: 1, tokens: 9, claimed: 1 }, 2, 1)).toEqual({ run: 2, tokens: 1, claimed: 0 });
  });
  it("unlocks a milestone once enough tokens are collected", () => {
    expect(claimable({ run: 1, tokens: tierNeed(0) - 1, claimed: 0 })).toBe(0);
    expect(claimable({ run: 1, tokens: tierNeed(1), claimed: 0 })).toBe(2);
  });
});
