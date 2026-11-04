import { useState } from "react";
import { Lock, X } from "lucide-react";
import { toast } from "sonner";
import { useGame, fmt, clock } from "@/lib/game";
import { ART, TOKEN_ART } from "@/lib/art";
import { LIVE_EVENTS, TIER_COUNT, claimable, eventRun, progressFor, tierNeed, tierReward, type EventDef, type EventReward } from "@/lib/events";

function RewardChip({ r }: { r: EventReward }) {
  const [img, n] = r.coins ? [ART.coin, r.coins] : r.spins ? [ART.bolt, r.spins] : [ART.gem, r.tickets ?? 0];
  return (
    <span className="flex items-center gap-1.5">
      <img src={img} alt="" className="h-7 w-7 object-contain" />
      <span className="font-display text-xl leading-none text-cream text-outline">{fmt(n)}</span>
    </span>
  );
}

export function EventsRow({ now }: { now: number }) {
  const { s } = useGame();
  const [open, setOpen] = useState<EventDef | null>(null);
  return (
    <>
      <div className="mt-3 -mx-1 flex gap-2 overflow-x-auto px-1 pb-1 [scrollbar-width:none]">
        {LIVE_EVENTS.map((e) => {
          const { run, endsIn } = eventRun(e, now || 0);
          const p = progressFor(s.live[e.key], run);
          const ready = claimable(p);
          return (
            <button key={e.key} onClick={() => setOpen(e)} aria-label={`Open ${e.name}`} className="relative flex w-[62px] shrink-0 flex-col items-center transition-transform active:scale-90">
              {ready > 0 && <span className="absolute right-0 top-0 z-10 grid h-4 min-w-4 place-items-center rounded-full border-2 border-ink bg-berry px-0.5 font-display text-[9px] leading-none text-cream">{ready}</span>}
              <img src={TOKEN_ART[e.key]} alt="" className="h-11 w-11 object-contain drop-shadow-[0_3px_0_var(--ink)]" />
              <span className="mt-0.5 rounded-full bg-cream px-1.5 font-display text-[9px] leading-[14px] text-berry">{now ? clock(endsIn) : "--:--:--"}</span>
              <span className="mt-0.5 line-clamp-2 text-center font-display text-[9px] leading-[10px] text-cream text-outline">{e.name.toUpperCase()}</span>
            </button>
          );
        })}
      </div>
      {open && <EventSheet def={open} now={now} onClose={() => setOpen(null)} />}
    </>
  );
}

function EventSheet({ def, now, onClose }: { def: EventDef; now: number; onClose: () => void }) {
  const { s, claimLive } = useGame();
  const { run, endsIn } = eventRun(def, now);
  const p = progressFor(s.live[def.key], run);
  const claim = () => { const r = claimLive(def.key); if (r) toast.success("Reward claimed!"); };
  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-ink/85 backdrop-blur-md" onClick={onClose}>
      <div className="mx-auto flex h-full w-full max-w-md flex-col px-4 pb-6 pt-4" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 rounded-full bg-ink/70 py-1 pl-1 pr-3">
            <img src={TOKEN_ART[def.key]} alt="" className="h-8 w-8 object-contain" />
            <span className="font-display text-lg leading-none text-cream">{p.tokens}</span>
          </span>
          <button onClick={onClose} aria-label="Close event" className="ml-auto grid h-10 w-10 place-items-center rounded-full border-[3px] border-ink bg-berry text-cream shadow-[0_3px_0_var(--ink)] active:scale-90"><X className="h-5 w-5" strokeWidth={4} /></button>
        </div>
        <div className="mt-3 text-center">
          <img src={TOKEN_ART[def.key]} alt="" className="mx-auto h-20 w-20 object-contain drop-shadow-[0_4px_0_var(--ink)]" />
          <h2 className="font-display text-3xl leading-none text-sun text-outline">{def.name.toUpperCase()}</h2>
          <p className="mt-1 font-display text-xs text-cream/70">{def.hours}H EVENT · ENDS IN {clock(endsIn)}</p>
          <p className="mt-1 text-xs text-cream/60">Land this token on the reels — every token counts.</p>
        </div>
        <div className="mt-4 flex-1 space-y-3 overflow-y-auto pb-4">
          {Array.from({ length: TIER_COUNT }, (_, i) => {
            const need = tierNeed(i), done = i < p.claimed, ready = i === p.claimed && p.tokens >= need;
            const pct = Math.min(100, (p.tokens / need) * 100);
            return (
              <div key={i} className={`rounded-[22px] border-[3px] border-ink p-3 shadow-[0_4px_0_var(--ink)] ${done ? "bg-ink/50 opacity-60" : "bg-gradient-to-b from-sun to-sun-dark"}`}>
                <div className="flex items-center gap-3">
                  <span className="relative shrink-0">
                    <img src={TOKEN_ART[def.key]} alt="" className="h-12 w-12 object-contain" />
                    <span className="absolute -bottom-1 right-0 font-display text-base leading-none text-cream text-outline">{need}</span>
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="bar"><div className="bar-fill" style={{ width: `${Math.max(4, pct)}%`, background: "linear-gradient(90deg, var(--berry), var(--lime))" }} /><span className="bar-label">{Math.min(p.tokens, need)}/{need}</span></div>
                  </div>
                  <button disabled={!ready} onClick={claim} className={`flex h-11 min-w-[96px] items-center justify-center gap-1 rounded-2xl border-[3px] border-ink px-2 shadow-[0_3px_0_var(--ink)] transition-transform active:scale-95 ${ready ? "bg-gradient-to-b from-lime to-sky" : "bg-ink/40"}`}>
                    {done ? <span className="font-display text-sm text-cream">CLAIMED</span> : <>{!ready && <Lock className="h-4 w-4 text-cream" strokeWidth={3} />}<RewardChip r={tierReward(i)} /></>}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
