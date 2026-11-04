import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { TrendingDown, TrendingUp } from "lucide-react";
import { useGame, fmt, clock } from "@/lib/game";
import { ART, TOKEN_ART } from "@/lib/art";
import { LIVE_EVENTS, claimable, eventRun, progressFor, type EventReward } from "@/lib/events";
import { currentOffers, type Offer } from "@/lib/offers";
import { Modal } from "@/components/game/Shell";

export function RewardChip({ r, size = "md" }: { r: EventReward; size?: "md" | "lg" }) {
  const [img, n] = r.spins ? [ART.bolt, fmt(r.spins)] : r.tickets ? [ART.wheelSpin, fmt(r.tickets)] : [ART.ton, String(r.ton ?? 0)];
  return (
    <span className="flex items-center gap-1.5">
      <img src={img} alt="" className={size === "lg" ? "h-9 w-9 object-contain" : "h-7 w-7 object-contain"} />
      <span className={`font-display leading-none text-cream text-outline ${size === "lg" ? "text-2xl" : "text-xl"}`}>{n}</span>
    </span>
  );
}

function Chip({ img, timer, label, badge, badgeIcon }: { img: string; timer: string; label: string; badge?: string | number; badgeIcon?: string }) {
  return (
    <span className="relative flex w-[62px] shrink-0 flex-col items-center">
      {!!badge && (
        <span className="absolute right-0 top-0 z-10 flex h-4 min-w-4 items-center gap-0.5 rounded-full border-2 border-ink bg-berry px-0.5 font-display text-[9px] leading-none text-cream">
          {badgeIcon && <img src={badgeIcon} alt="" className="h-2.5 w-2.5 object-contain" />}
          {badge}
        </span>
      )}
      <img src={img} alt="" className="h-11 w-11 object-contain drop-shadow-[0_3px_0_var(--ink)]" />
      <span className="mt-0.5 rounded-full bg-cream px-1.5 font-display text-[9px] leading-[14px] text-berry">{timer}</span>
      <span className="mt-0.5 line-clamp-2 text-center font-display text-[9px] leading-[10px] text-cream text-outline">{label}</span>
    </span>
  );
}

const OFFER_ART: Record<string, string> = { mega: ART.rocket, wheel: ART.wheel, starter: ART.bag, whale: ART.chest };

export function EventsRow({ now }: { now: number }) {
  const { s } = useGame();
  const [open, setOpen] = useState<Offer | null>(null);
  const offers = currentOffers(now || 0);
  return (
    <>
      <div className="flex gap-1.5 overflow-x-auto px-1 pb-1 [scrollbar-width:none]">
        {LIVE_EVENTS.map((e) => {
          const { run, endsIn } = eventRun(e, now || 0);
          return (
            <Link key={e.key} to="/event/$key" params={{ key: e.key }} aria-label={`Open ${e.name}`} className="transition-transform active:scale-90">
              <Chip img={TOKEN_ART[e.key]!} timer={now ? clock(endsIn) : "--:--:--"} label={e.name.toUpperCase()} badge={claimable(e, progressFor(s.live[e.key], run))} />
            </Link>
          );
        })}
        {offers.map((o) => (
          <button key={o.key} onClick={() => setOpen(o)} aria-label={`Open ${o.name} offer`} className="transition-transform active:scale-90">
            <Chip img={OFFER_ART[o.key]!} timer={now ? clock(o.endsIn) : "--:--:--"} label={o.name.toUpperCase()} badge={o.ton} badgeIcon={ART.ton} />
          </button>
        ))}
      </div>

export function OffersRow({ now }: { now: number }) {
  const [open, setOpen] = useState<Offer | null>(null);
  const offers = currentOffers(now || 0);
  return (
    <>
      <div className="flex gap-2 overflow-x-auto px-1 pb-1 [scrollbar-width:none]">
        {offers.map((o) => (
          <button key={o.key} onClick={() => setOpen(o)} aria-label={`Open ${o.name} offer`} className="relative flex w-[104px] shrink-0 flex-col items-center rounded-2xl border-2 border-ink bg-gradient-to-b from-grape to-berry px-1.5 pb-1.5 pt-1 shadow-[0_3px_0_var(--ink)] transition-transform active:scale-95">
            <span className="font-display text-[10px] leading-tight text-cream text-outline">{o.name.toUpperCase()}</span>
            <span className="mt-1 flex items-center gap-1">
              <img src={ART.bolt} alt="" className="h-6 w-6" /><span className="font-display text-xs text-cream">{fmt(o.spins)}</span>
              <img src={ART.wheelSpin} alt="" className="h-5 w-5" /><span className="font-display text-xs text-cream">{o.tickets}</span>
            </span>
            <span className="mt-1 flex w-full items-center justify-center gap-1 rounded-full bg-cream py-0.5">
              <img src={ART.ton} alt="" className="h-4 w-4" />
              <span className="font-display text-xs leading-none text-ink">{o.ton}</span>
              {o.trend === "up" ? <TrendingUp className="h-3 w-3 text-berry" strokeWidth={3} /> : <TrendingDown className="h-3 w-3 text-grape" strokeWidth={3} />}
            </span>
            <span className="mt-0.5 font-display text-[9px] leading-none text-cream/70">{now ? clock(o.endsIn) : ""}</span>
          </button>
        ))}
      </div>
      <Modal open={!!open} onClose={() => setOpen(null)} title={open?.name ?? ""}>
        {open && (
          <div className="flex flex-col items-center gap-3">
            <div className="flex items-center gap-4"><RewardChip r={{ spins: open.spins }} size="lg" /><RewardChip r={{ tickets: open.tickets }} size="lg" /></div>
            <p className="text-center text-xs text-cream/70">Price and amounts change every 4 hours · {clock(open.endsIn)} left</p>
            <button className="chunk-btn h-12 w-full rounded-full bg-gradient-to-b from-sun to-sun-dark gap-2"><img src={ART.ton} alt="" className="h-6 w-6" /><span className="font-display text-lg">{open.ton} TON</span></button>
            <p className="text-center text-[11px] text-cream/50">Payments will be connected soon — nothing is charged yet.</p>
          </div>
        )}
      </Modal>
    </>
  );
}
