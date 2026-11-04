import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Screen } from "@/components/game/Shell";
import { useGame, beep, haptic } from "@/lib/game";
import prizeBolt from "@/assets/wheel-prize-bolt.png";
import prizeCoin from "@/assets/wheel-prize-coin.png";
import prizeGem from "@/assets/wheel-prize-gem.png";
import prizeChest from "@/assets/wheel-prize-chest.png";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Star, Ticket } from "lucide-react";
import mascot from "@/assets/merge-mascot-3.png";
import { WHEEL_PRIZES, wheelLandingRotation } from "@/lib/wheel";

export const Route = createFileRoute("/wheel")({
  head: () => ({
    meta: [
      { title: "Wheel of Fortune — Solo Slots" },
      { name: "description", content: "Use roulette tickets to spin the wheel for coins, spins and Solo." },
      { property: "og:title", content: "Wheel of Fortune — Solo Slots" },
      { property: "og:description", content: "Spin the wheel for big prizes." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: WheelPage,
});

const PRIZES = WHEEL_PRIZES;
const prizeArt = { bolt: prizeBolt, coin: prizeCoin, gem: prizeGem, chest: prizeChest };
function WheelPage() {
  const { s, spend, grant } = useGame();
  const [rot, setRot] = useState(0);
  const [busy, setBusy] = useState(false);
  const [winner, setWinner] = useState<string | null>(null);
  const seg = 360 / PRIZES.length;
  const go = () => {
    if (busy) return;
    if (!spend({ tickets: 1 })) { toast.error("Need a roulette ticket"); return; }
    setBusy(true); setWinner(null); haptic();
    const idx = Math.floor(Math.random() * PRIZES.length);
    setRot(wheelLandingRotation(rot, idx));
    setTimeout(() => { const p = PRIZES[idx]; if (p) { grant(p.reward); beep(s.sound, 1000, 0.3); setWinner(p.label); toast.success(`You won ${p.label}!`); } setBusy(false); }, 4200);
  };
  return (
    <Screen bare scroll={false} navigation={false}>
      <div className="fortune-page">
        <Link to="/" className="fortune-back" aria-label="Back to slots"><ArrowLeft size={24} /></Link>
        <h1 className="fortune-title">WHEEL OF FORTUNE</h1>
        <div className="fortune-stage">
          <div className="fortune-stand"><span>SOLO</span></div>
          <div className="fortune-wheel" aria-label="Prize wheel">
          <Star className="fortune-pointer" strokeWidth={1.8} />
          <div className="fortune-rim">
            {Array.from({ length: 12 }, (_, i) => <span key={i} className={`fortune-bulb ${i % 2 ? "fortune-bulb-pink" : ""}`} style={{ transform: `rotate(${i * 30 + 15}deg)` }}><i /></span>)}
          </div>
          <div className="fortune-disc" style={{ transform: `rotate(${rot}deg)` }}>
            {PRIZES.map((p, i) => (
              <div key={i} className="fortune-prize" style={{ transform: `translateX(-50%) rotate(${i * seg}deg)` }}>
                <div className="fortune-prize-content">
                  {p.kind === "ticket" ? <Ticket className="fortune-ticket-prize" /> : <img src={prizeArt[p.kind]} alt="" />}
                  <span>{p.label}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="fortune-hub"><img src={mascot} alt="Golden mascot" /></div>
          </div>
        </div>
        <div className="fortune-controls">
          <span className="fortune-result" role="status">{winner ? `+${winner}` : ""}</span>
          <Button onClick={go} disabled={busy} className="fortune-spin" aria-label="Spin prize wheel">{busy ? "SPINNING" : "SPIN"}</Button>
          <span className="fortune-tickets"><Ticket size={16} />{s.tickets} {s.tickets === 1 ? "ticket" : "tickets"}</span>
        </div>
      </div>
    </Screen>
  );
}
