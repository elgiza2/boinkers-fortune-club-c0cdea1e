import { createFileRoute } from "@tanstack/react-router";
import { Screen } from "@/components/game/Shell";
import { ART } from "@/lib/art";
import { useGame, passNeed, fmt } from "@/lib/game";

export const Route = createFileRoute("/pass")({
  head: () => ({
    meta: [
      { title: "Spin Pass Gifts — Solo Slots" },
      { name: "description", content: "Level up your spin pass and collect gifts." },
      { property: "og:title", content: "Spin Pass Gifts — Solo Slots" },
      { property: "og:description", content: "Level up your spin pass and collect gifts." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: PassPage,
});

function PassPage() {
  const { s } = useGame();
  return (
    <Screen scroll={false}>
      <div className="flex h-full flex-col items-center justify-center gap-4 pb-14 text-center">
        <div className="glass-card flex w-full max-w-xs flex-col items-center gap-4 p-6">
          <img src={ART.chest} alt="" className="h-24 w-24 animate-bob object-contain" />
          <h1 className="font-display text-3xl text-sun">SPIN PASS</h1>
          <p className="font-display text-cream">Level {s.passLevel} · {fmt(s.passXp)}/{fmt(passNeed(s.passLevel))}</p>
          <div className="bar w-full">
            <div className="bar-fill" style={{ width: `${Math.max(4, Math.min(100, (s.passXp / passNeed(s.passLevel)) * 100))}%`, background: "linear-gradient(90deg, var(--lime), var(--sky))" }} />
            <span className="bar-label">{fmt(s.passXp)}/{fmt(passNeed(s.passLevel))}</span>
          </div>
          <p className="text-sm text-cream/70">Gifts page coming soon</p>
        </div>
      </div>
    </Screen>
  );
}
