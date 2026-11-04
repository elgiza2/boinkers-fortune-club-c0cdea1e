import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { useGame, fmt, clock } from "@/lib/game";
import { ART, TOKEN_ART, OFFER_ART } from "@/lib/art";
import { LIVE_EVENTS, claimable, eventRun, progressFor, type EventReward } from "@/lib/events";
import { currentOffers, type Offer } from "@/lib/offers";
import { Modal } from "@/components/game/Shell";
import { Timer } from "lucide-react";

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

function OfferChip({ img, timer, price, hot }: { img: string; timer: string; price: number; hot: boolean }) {
  return (
    <span className={`relative flex w-[62px] shrink-0 flex-col items-center rounded-[18px] border-2 border-ink px-1 pb-1 pt-2 shadow-[0_3px_0_var(--ink)] ${hot ? "bg-gradient-to-b from-grape to-berry" : "bg-gradient-to-b from-grape to-berry/70"}`}>
      <span className="absolute -top-2 left-1/2 z-10 flex -translate-x-1/2 items-center gap-0.5 whitespace-nowrap rounded-full border-2 border-ink bg-cream px-1.5 py-px font-display text-[9px] leading-none text-ink shadow-[0_2px_0_var(--ink)]">
        <img src={ART.ton} alt="" className="h-2.5 w-2.5 object-contain" />
        {price}
      </span>
      {hot && <span className="absolute -right-1 top-1 z-10 rounded-full border-2 border-ink bg-sun px-1 font-display text-[7px] leading-[11px] text-ink">HOT</span>}
      <img src={img} alt="" className="h-10 w-10 object-contain drop-shadow-[0_3px_0_var(--ink)]" />
      <span className="mt-1 flex items-center gap-0.5 rounded-full bg-cream px-1.5 font-display text-[9px] leading-[14px] text-berry">
        <Timer className="h-2.5 w-2.5" strokeWidth={3} />
        {timer}
      </span>
    </span>
  );
}

export function EventsRow({ now }: { now: number }) {
  const { s } = useGame();
  const [open, setOpen] = useState<Offer | null>(null);
  const offers = currentOffers(now || 0);
  return (
    <>
      <div className="flex gap-1.5 overflow-x-auto px-1 pb-1 pt-2.5 [scrollbar-width:none]">
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
            <OfferChip img={OFFER_ART[o.key]!} timer={now ? clock(o.endsIn) : "--:--:--"} price={o.ton} hot={o.ton >= 1.5} />
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
