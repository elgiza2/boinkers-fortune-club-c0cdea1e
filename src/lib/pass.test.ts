import { describe, it, expect } from "vitest";
import { addPassXp, passGift, passNeed } from "./game";
describe("spin pass", () => {
  it("each spin used adds XP and levels up at the threshold", () => {
    const r = addPassXp(99, 1, 1, false);
    expect(r.level).toBe(2); expect(r.xp).toBe(0);
  });
  it("higher levels need more XP", () => { expect(passNeed(5)).toBeGreaterThan(passNeed(1)); });
  it("premium gifts are double plus a ticket", () => {
    const f = passGift(4, false), p = passGift(4, true);
    expect(p.coins).toBe(f.coins * 2); expect(p.tickets).toBe(1); expect(f.tickets).toBe(0);
  });
});

import { addEventTokens, evNeed, evReward, COINS_PER_TOKEN } from "./game";
describe("48h event tokens", () => {
  it("even one token pays coins", () => {
    expect(addEventTokens({ eventId: 1, evTokens: 0, evTier: 0 }, 1, 1).coins).toBe(COINS_PER_TOKEN);
  });
  it("finishing a tier pays a bigger reward each tier, endlessly", () => {
    expect(evReward(3)).toBeGreaterThan(evReward(2)); expect(evNeed(10)).toBeGreaterThan(evNeed(9));
    const r = addEventTokens({ eventId: 1, evTokens: 4, evTier: 0 }, 1, 1);
    expect(r.evTier).toBe(1); expect(r.coins).toBe(COINS_PER_TOKEN + evReward(0));
  });
  it("a new 48h event resets progress", () => {
    const r = addEventTokens({ eventId: 1, evTokens: 3, evTier: 5 }, 2, 1);
    expect(r.evTier).toBe(0); expect(r.evTokens).toBe(1);
  });
});
