import { describe, expect, it } from "vitest";
import { WHEEL_PRIZES, wheelLandingRotation } from "./wheel";

describe("Wheel rewards", () => {
  it("offers more prizes than the previous eight", () => {
    expect(WHEEL_PRIZES.length).toBeGreaterThan(8);
  });
  it("lands the awarded segment under the pointer on repeated spins", () => {
    for (const rotation of [0, 2190, 7890]) {
      WHEEL_PRIZES.forEach((_, index) => {
        const next = wheelLandingRotation(rotation, index);
        expect((next + index * 360 / WHEEL_PRIZES.length) % 360).toBe(0);
        expect(next - rotation).toBeGreaterThanOrEqual(2160);
      });
    }
  });
});