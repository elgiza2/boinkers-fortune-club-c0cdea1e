import { useState } from "react";
import { Info } from "lucide-react";
import { Modal } from "@/components/game/Shell";
import { ART, SYM_ART } from "@/lib/art";
import { fmt } from "@/lib/game";
import { PAYTABLE, odds, symChance, type SlotWin } from "@/lib/slots";

const ICON: Record<string, string> = { coin: SYM_ART.coin, chest: SYM_ART.chest, bolt: SYM_ART.bolt, wheel: ART.wheelSpin, gem: SYM_ART.gem };
const pct = (x: number) => `${(x * 100).toFixed(x < 0.01 ? 2 : 1)}%`;
function Prize({ r }: { r: Partial<SlotWin> }) {
  const [img, n] = r.coins ? [ART.coin, fmt(r.coins)] : r.spins ? [ART.bolt, String(r.spins)] : r.tickets ? [ART.wheelSpin, String(r.tickets)] : [ART.ton, String(r.ton)];
  return <span className="flex items-center justify-end gap-1"><img src={img} alt="" className="h-5 w-5" /><span className="font-display text-sm text-cream">{n}</span></span>;
}

export function Paytable() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button onClick={() => setOpen(true)} aria-label="Show pay table" className="grid h-7 w-7 shrink-0 place-items-center rounded-full border-2 border-ink bg-sky text-cream active:scale-90"><Info className="h-4 w-4" strokeWidth={3} /></button>
      <Modal open={open} onClose={() => setOpen(false)} title="Pay table">
        <div className="space-y-1.5 text-xs text-cream/70">
          <div className="grid grid-cols-[32px_1fr_1fr] gap-2 px-1 font-display text-[10px] text-cream/50"><span /><span className="text-right">3 MATCH</span><span className="text-right">2 MATCH</span></div>
          {PAYTABLE.map((row) => {
            const o = odds(row.sym);
            return (
              <div key={row.sym} className="grid grid-cols-[32px_1fr_1fr] items-center gap-2 rounded-xl bg-ink/45 px-1 py-1.5">
                <img src={ICON[row.sym]} alt={row.label} className="h-8 w-8 object-contain" />
                <div className="text-right"><Prize r={row.three} /><span className="text-[10px]">{pct(o.three)}</span></div>
                <div className="text-right"><Prize r={row.two} /><span className="text-[10px]">{pct(o.two)}</span></div>
              </div>
            );
          })}
          <p className="pt-2 text-center">Event tokens count one by one — no need to match 3. Chance per reel: {pct(symChance("token") + symChance("live"))}. Prizes multiply by your bet.</p>
        </div>
      </Modal>
    </>
  );
}
