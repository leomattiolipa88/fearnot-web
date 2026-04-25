'use client';

import { useEffect, useState } from 'react';

// ============== Types ==============
type WebData = {
  metadata: {
    generado: string;
    fecha: string;
  };
  regimen: {
    clasificacion: string;
    confianza: number;
    razonamiento: string;
  };
  tesis_principal: string;
  indicadores_clave: Record<string, { valor: number; fecha: string }>;
  senales: Array<{
    activo: string;
    macro: { direccion: string; conviccion: number; razonamiento: string } | null;
    tecnico: { direccion: string; conviccion: number; razonamiento: string } | null;
    consenso: string;
  }>;
  eventos_clave: string[];
  confianza_consolidada: number | null;
};

// ============== Helpers ==============
function formatNumber(val: number | undefined | null, decimals = 2): string {
  if (val === null || val === undefined) return '—';
  return Number(val).toFixed(decimals);
}

function interpretIndicator(key: string, value: number): string {
  switch (key) {
    case 'yield_curve':
      return value > 0 ? 'Normal · no recession' : 'Inverted · warning';
    case 'vix':
      return value < 16 ? 'Calm markets' : value < 22 ? 'Elevated' : 'Stress';
    case 'hy_spread':
      return value < 4 ? 'Contained · OK' : 'Widening · risk';
    case 'usdjpy_mkt':
      return value > 158 ? 'Near BoJ intervention' : 'Stable';
    default:
      return '';
  }
}

const REGIME_TITLES: Record<string, string> = {
  GOLDILOCKS: 'Goldilocks is real —\nand getting boring.',
  REFLACION: 'Inflation returns —\nstage left.',
  DESACELERACION: 'The wheels,\nthey are turning slowly.',
  STAGFLATION: 'Stagflation\ntakes the wheel.',
};

// ============== Main Component ==============
export default function Home() {
  const [data, setData] = useState<WebData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/web_data.json')
      .then((res) => {
        if (!res.ok) throw new Error('Could not load data');
        return res.json();
      })
      .then(setData)
      .catch((err) => setError(err.message));
  }, []);

  if (error) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-[#f5f5f5] flex items-center justify-center">
        <p className="text-[#f27272]">Error: {error}</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-[#f5f5f5] flex items-center justify-center">
        <p className="text-[#6b6b6b] italic">Loading...</p>
      </div>
    );
  }

  const regimeTitle = REGIME_TITLES[data.regimen.clasificacion] || data.regimen.clasificacion;
  const thesisSentences = data.tesis_principal.split(/\. /);
  const paragraphs: string[] = [];
  for (let i = 0; i < thesisSentences.length; i += 2) {
    const chunk = thesisSentences.slice(i, i + 2).join('. ');
    if (chunk.trim()) paragraphs.push(chunk + (chunk.endsWith('.') ? '' : '.'));
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#f5f5f5] font-sans">
      {/* Background glow */}
      <div className="fixed top-[-200px] left-1/2 -translate-x-1/2 w-[800px] h-[800px] pointer-events-none z-0"
           style={{ background: 'radial-gradient(circle, rgba(255,77,77,0.08) 0%, transparent 60%)' }} />

      {/* Topbar */}
      <div className="sticky top-0 backdrop-blur-xl bg-[#0a0a0a]/80 border-b border-white/[0.08] z-50">
        <div className="max-w-[1200px] mx-auto px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5 text-base font-medium tracking-tight">
            <div className="w-6 h-6 bg-[#ff4d4d] rounded-md relative overflow-hidden">
              <div className="absolute inset-0" style={{ background: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.3), transparent 70%)' }} />
            </div>
            <span>FearNot</span>
          </div>
          <div className="hidden md:flex gap-8">
            <a href="#" className="text-sm text-white">Today</a>
            <a href="#" className="text-sm text-[#a1a1a1] hover:text-white transition">Research</a>
            <a href="#" className="text-sm text-[#a1a1a1] hover:text-white transition">Signals</a>
            <a href="#" className="text-sm text-[#a1a1a1] hover:text-white transition">Performance</a>
            <a href="#" className="text-sm text-[#a1a1a1] hover:text-white transition">Manifesto</a>
          </div>
          <div className="flex items-center gap-2 text-xs text-[#a1a1a1] px-3 py-1.5 bg-[#141414] border border-white/[0.08] rounded-full">
            <span className="w-1.5 h-1.5 bg-[#7cc943] rounded-full animate-pulse" style={{ boxShadow: '0 0 8px rgba(124,201,67,0.5)' }} />
            <span>Live · {data.regimen.clasificacion} {data.regimen.confianza}%</span>
          </div>
        </div>
      </div>

      {/* Hero */}
      <section className="max-w-[1200px] mx-auto px-8 pt-32 pb-24 relative z-10">
        <div className="inline-block text-xs uppercase tracking-widest text-[#a1a1a1] px-3.5 py-1.5 bg-[#141414] border border-white/[0.08] rounded-full mb-8">
          — A macro research house
        </div>
        <h1 className="font-serif text-[clamp(64px,12vw,140px)] leading-[0.95] tracking-tight mb-8">
          In chaos,<br />
          <em className="italic text-[#ff4d4d]">fear not.</em>
        </h1>
        <p className="text-xl leading-relaxed text-[#a1a1a1] max-w-[600px] mb-10">
          We look where others won&apos;t. Systematic macro research, powered by a multi-agent AI architecture and grounded in 150 years of market evidence. We take markets seriously. Ourselves, less so.
        </p>
        <div className="flex gap-3">
          <button className="px-6 py-3 bg-white text-black rounded-lg text-sm font-medium hover:bg-[#a1a1a1] hover:-translate-y-0.5 transition-all">
            Read today&apos;s thesis →
          </button>
          <button className="px-6 py-3 text-white border border-white/[0.14] rounded-lg text-sm font-medium hover:bg-[#141414] hover:border-[#a1a1a1] transition-all">
            How it works
          </button>
        </div>
      </section>

      <div className="h-px bg-white/[0.08] max-w-[1200px] mx-auto" />

      {/* Indicators + Thesis */}
      <section className="max-w-[1200px] mx-auto px-8 py-24 relative z-10">
        <SectionLabel>Market indicators</SectionLabel>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
          {[
            { key: 'yield_curve', label: 'Yield curve', suffix: '%' },
            { key: 'vix', label: 'VIX', suffix: '' },
            { key: 'hy_spread', label: 'HY Spread', suffix: '%' },
            { key: 'usdjpy_mkt', label: 'USD/JPY', suffix: '' },
          ].map((card) => {
            const ind = data.indicadores_clave[card.key];
            if (!ind) return null;
            return (
              <div key={card.key} className="bg-[#141414] border border-white/[0.08] rounded-xl p-5">
                <div className="text-[11px] text-[#6b6b6b] uppercase tracking-wider mb-2">{card.label}</div>
                <div className="font-serif text-[32px] tracking-tight mb-1">{formatNumber(ind.valor)}{card.suffix}</div>
                <div className="text-[11px] text-[#6b6b6b]">{interpretIndicator(card.key, ind.valor)}</div>
              </div>
            );
          })}
        </div>

        <SectionLabel>Thesis of the day</SectionLabel>

        <div className="grid md:grid-cols-[1.4fr_1fr] gap-16">
          <div>
            <h2 className="font-serif text-5xl leading-tight tracking-tight mb-6 whitespace-pre-line">
              {regimeTitle}
            </h2>
            <div className="flex gap-4 text-xs text-[#6b6b6b] mb-8 flex-wrap items-center">
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-[#7cc943] rounded-full" />
                Regime confidence {data.regimen.confianza}%
              </div>
              <span>·</span>
              <span>{data.senales.length} signals generated</span>
              <span>·</span>
              <span>Consolidated {formatNumber(data.confianza_consolidada, 0)}%</span>
            </div>
            {paragraphs.slice(0, 3).map((p, i) => (
              <p key={i} className="text-base leading-relaxed text-[#a1a1a1] mb-5">{p.trim()}</p>
            ))}
            <a href="#" className="inline-flex items-center gap-2 text-sm font-medium text-white border-b border-white pb-1 mt-2 hover:gap-3 transition-all">
              Read full thesis →
            </a>
          </div>

          <div className="bg-[#141414] border border-white/[0.08] rounded-xl p-6">
            <div className="flex justify-between text-xs uppercase tracking-widest text-[#a1a1a1] mb-5">
              <span>Today&apos;s signals</span>
              <span className="text-[#6b6b6b]">Conviction</span>
            </div>
            {data.senales.map((s, i) => {
              const primary = s.tecnico || s.macro;
              if (!primary) return null;
              const dir = primary.direccion;
              const badgeColor = dir === 'LONG' ? 'bg-[#7cc943]/[0.12] text-[#7cc943]' : dir === 'SHORT' ? 'bg-[#f27272]/[0.12] text-[#f27272]' : 'bg-[#a1a1a1]/[0.12] text-[#a1a1a1]';
              const dirLabel = dir === 'NEUTRAL' ? 'NEUT' : dir;
              const reason = primary.razonamiento ? primary.razonamiento.split('.')[0] : '';
              const consensusTag = s.consenso === 'CONVERGENTE' ? (
                <span className="inline-block text-[9px] px-1.5 py-0.5 rounded bg-[#7cc943]/[0.15] text-[#7cc943] ml-1.5 tracking-wider">SYNC</span>
              ) : s.consenso === 'DIVERGENTE' ? (
                <span className="inline-block text-[9px] px-1.5 py-0.5 rounded bg-[#f5bd4f]/[0.15] text-[#f5bd4f] ml-1.5 tracking-wider">SPLIT</span>
              ) : null;

              return (
                <div key={i} className="grid grid-cols-[50px_72px_1fr_32px] gap-3 items-center py-3.5 border-b border-white/[0.08] last:border-b-0">
                  <div className="text-sm font-medium">{s.activo}</div>
                  <div>
                    <span className={`inline-flex justify-center text-[10px] font-semibold px-2.5 py-1 rounded tracking-wider ${badgeColor}`}>{dirLabel}</span>
                    {consensusTag}
                  </div>
                  <div className="text-xs text-[#a1a1a1] leading-tight">{reason.substring(0, 55)}</div>
                  <div className="text-[15px] font-medium text-right tabular-nums">{primary.conviccion}</div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-20"><SectionLabel>What moved the market</SectionLabel></div>

        <div className="grid md:grid-cols-2 gap-4 mt-6">
          {data.eventos_clave.slice(0, 4).map((event, i) => (
            <div key={i} className="bg-[#141414] border border-white/[0.08] rounded-xl p-5">
              <div className="text-sm leading-relaxed text-[#a1a1a1]">{event}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Quote */}
      <div className="h-px bg-white/[0.08] max-w-[1200px] mx-auto" />
      <section className="max-w-[1200px] mx-auto px-8 py-32 text-center">
        <p className="font-serif text-[clamp(32px,5vw,56px)] leading-tight tracking-tight max-w-[900px] mx-auto mb-8">
          &ldquo;The whole trick in investing is: <em className="italic text-[#ff4d4d]">how do I keep from losing everything?</em>&rdquo;
        </p>
        <p className="text-xs uppercase tracking-widest text-[#a1a1a1]">— Paul Tudor Jones</p>
      </section>
      <div className="h-px bg-white/[0.08] max-w-[1200px] mx-auto" />

      {/* Philosophy */}
      <section className="max-w-[1200px] mx-auto px-8 py-24">
        <SectionLabel>What we do</SectionLabel>
        <div className="grid md:grid-cols-3 gap-12">
          {[
            { num: '01', title: 'A committee of ghosts', text: 'Dalio on regimes. Druckenmiller on liquidity. Soros on reflexivity. Taleb on tails. Tudor Jones on the 200DMA. Simons on data. Six managers, one system, zero tantrums.' },
            { num: '02', title: 'Evidence over opinion', text: 'We only run indicators with out-of-sample evidence. MACD, Fibonacci, candlestick patterns — thank you, next. What remains: momentum, trend, carry, vol. The boring stuff that works.' },
            { num: '03', title: "Look where others won't", text: 'Rare earths. Argentine sovereigns. Oil pods reading Trafigura&apos;s playbook. Options flow in backwaters. If the Bloomberg terminal is ignoring it, we are probably writing about it.' },
          ].map((p) => (
            <div key={p.num} className="pt-5 border-t border-white/[0.08]">
              <span className="font-serif italic text-4xl text-[#ff4d4d] mb-4 block">{p.num}</span>
              <h3 className="text-xl font-medium mb-3 tracking-tight">{p.title}</h3>
              <p className="text-sm leading-relaxed text-[#a1a1a1]" dangerouslySetInnerHTML={{ __html: p.text }} />
            </div>
          ))}
        </div>
      </section>

      {/* Stats */}
      <div className="max-w-[1200px] mx-auto px-8 py-20 grid grid-cols-1 md:grid-cols-3 gap-12 border-y border-white/[0.08]">
        {[
          { num: '6', label: 'Specialized agents' },
          { num: '150y', label: 'Of market evidence' },
          { num: '24/7', label: 'Data ingestion' },
        ].map((s) => (
          <div key={s.num}>
            <span className="font-serif text-5xl tracking-tight mb-2 block">{s.num}</span>
            <span className="text-sm text-[#a1a1a1]">{s.label}</span>
          </div>
        ))}
      </div>

      {/* Newsletter */}
      <section className="max-w-[700px] mx-auto px-8 py-24 text-center">
        <h3 className="font-serif text-5xl leading-tight tracking-tight mb-5">
          Weekly notes,<br />for those who read.
        </h3>
        <p className="text-lg text-[#a1a1a1] mb-8">
          Every Friday. No price targets, no hot takes. Just what we noticed the market is choosing to ignore.
        </p>
        <div className="flex gap-2 max-w-[440px] mx-auto">
          <input type="email" placeholder="your@email.com" className="flex-1 px-4 py-3 bg-[#141414] border border-white/[0.14] rounded-lg text-sm outline-none focus:border-[#a1a1a1]" />
          <button className="px-5 py-3 bg-white text-black rounded-lg text-sm font-medium hover:bg-[#a1a1a1] transition-all">
            Subscribe
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="max-w-[1200px] mx-auto px-8 py-10 border-t border-white/[0.08] flex justify-between items-center text-xs text-[#6b6b6b] flex-wrap gap-5">
        <div>© 2026 · <span className="font-serif text-sm">FearNot</span> · Research only, not investment advice.</div>
        <div className="flex gap-6">
          <a href="#" className="hover:text-white transition">Twitter</a>
          <a href="#" className="hover:text-white transition">Instagram</a>
          <a href="#" className="hover:text-white transition">Substack</a>
          <a href="#" className="hover:text-white transition">Contact</a>
        </div>
      </footer>
    </div>
  );
}

// ============== Helper Component ==============
function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 mb-10 text-xs uppercase tracking-widest text-[#a1a1a1]">
      <span>{children}</span>
      <span className="flex-1 h-px bg-white/[0.08] max-w-[80px]" />
    </div>
  );
}
