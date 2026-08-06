'use client';
// Banking desk — monthly credit-cycle section, expandable cards.
import { useState } from 'react';

function BankCard({ tag, d }: { tag: string; d: any }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="bg-[#141414] border border-white/[0.08] rounded-xl p-7">
      <div className="flex justify-between items-center mb-4 text-[11px] uppercase tracking-wider text-[#6b6b6b]">
        <span>{tag}</span>
        <span>{d?.fecha || ''}</span>
      </div>
      <div className="font-serif italic text-3xl text-[var(--accent)] mb-1">
        {d?.regimen_credito?.clasificacion || '—'}
      </div>
      <div className="text-xs text-[#a1a1a1] mb-4">
        Confidence {d?.regimen_credito?.confianza ?? '—'}%
        {d?.periodo_analizado ? ` · ${d.periodo_analizado}` : ''}
      </div>
      <p className={`text-sm leading-relaxed text-[#d4d4d4] ${open ? '' : 'line-clamp-6'}`}>
        {d?.tesis_principal || ''}
      </p>
      <button
        onClick={() => setOpen(!open)}
        className="mt-4 text-xs uppercase tracking-wider text-[var(--accent)] hover:text-[var(--accent-bright)] transition-colors"
      >
        {open ? '↑ Show less' : '↓ Read full thesis'}
      </button>
    </div>
  );
}

export default function BankingSection({ banking }: { banking?: any }) {
  if (!banking || (!banking.annual && !banking.quarterly)) return null;
  return (
    <section className="max-w-[1200px] mx-auto px-8 py-24 relative z-10">
      <div className="flex items-center gap-3 mb-10 text-xs uppercase tracking-widest text-[#a1a1a1]">
        <span>The credit cycle · Banking desk</span>
        <span className="px-2 py-0.5 border border-white/[0.14] rounded-full text-[10px]">Monthly</span>
        <span className="flex-1 h-px bg-white/[0.08] max-w-[80px]" />
      </div>
      <div className="grid md:grid-cols-2 gap-6">
        {banking.annual && <BankCard tag="Annual · 10-K" d={banking.annual} />}
        {banking.quarterly && <BankCard tag="Quarterly · 10-Q" d={banking.quarterly} />}
      </div>
    </section>
  );
}
