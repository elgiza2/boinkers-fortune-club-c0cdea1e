export const WHEEL_PRIZES = [
  { label: "500K", kind: "chest", reward: { coins: 500000 } },
  { label: "25", kind: "bolt", reward: { spins: 25 } },
  { label: "5K", kind: "coin", reward: { coins: 5000 } },
  { label: "100", kind: "bolt", reward: { spins: 100 } },
  { label: "10K", kind: "gem", reward: { solo: 10000 } },
  { label: "50", kind: "bolt", reward: { spins: 50 } },
  { label: "2", kind: "ticket", reward: { tickets: 2 } },
  { label: "20K", kind: "coin", reward: { coins: 20000 } },
  { label: "10", kind: "bolt", reward: { spins: 10 } },
  { label: "50K", kind: "coin", reward: { coins: 50000 } },
  { label: "5K", kind: "gem", reward: { solo: 5000 } },
  { label: "250", kind: "bolt", reward: { spins: 250 } },
] as const;

export function wheelLandingRotation(rotation: number, index: number) {
  return rotation + 2160 + ((360 - index * 360 / WHEEL_PRIZES.length - rotation % 360) % 360 + 360) % 360;
}