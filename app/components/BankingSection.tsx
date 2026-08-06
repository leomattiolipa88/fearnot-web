// Banking desk — monthly credit-cycle section.
// Renders only when data.banking exists (graceful absence by design).
export default function BankingSection({ banking }: { banking?: any }) {
  if (!banking || (!banking.annual && !banking.quarterly)) return null;
  const cards = [
    { tag: 'Annual · 10-K', d: banking.annual },
    { tag: 'Quarterly · 10-Q', d: banking.quarterly },
  ].filter((c) => c.d);
  return (
    <section className="max-w-[1200px] mx-auto px-8 py-24 relative z-10">
      <div className="flex items-center gap-3 mb-10 text-xs uppercase tracking-widest text-[#a1a1a1]">
        <span>The credit cycle · Banking desk</span>
        <span className="px-2 py-0.5 border border-white/[0.14] rounded-full text-[10px]">Monthly</span>
        <span className="flex-1 h-px bg-white/[0.08] max-w-[80px]" />
      </div>
      <div className="grid md:grid-cols-2 gap-6">
        {cards.map((c, i) => (
          <div key={i} className="bg-[#141414] border border-white/[0.08] rounded-xl p-7">
            <div className="flex justify-between items-center mb-4 text-[11px] uppercase tracking-wider text-[#6b6b6b]">
              <span>{c.tag}</span>
              <span>{c.d?.fecha || ''}</span>
            </div>
            <div className="font-serif italic text-3xl text-[var(--accent)] mb-1">
              {c.d?.regimen_credito?.clasificacion || '—'}
            </div>
            <div className="text-xs text-[#a1a1a1] mb-4">
              Confidence {c.d?.regimen_credito?.confianza ?? '—'}%
              {c.d?.periodo_analizado ? ` · ${c.d.periodo_analizado}` : ''}
            </div>
            <p className="text-sm leading-relaxed text-[#d4d4d4] line-clamp-6">
              {c.d?.tesis_principal || ''}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
