'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Header from '@/app/components/Header';
import { loadWebData, WebData, formatNumber } from '@/app/lib/data';

export default function TodayPulse() {
  const [data, setData] = useState<WebData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadWebData()
      .then(setData)
      .catch((err) => setError(err.message));
  }, []);

  if (error) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-[#f5f5f5]">
        <Header />
        <div className="flex items-center justify-center pt-32">
          <p className="text-[#f27272]">Error: {error}</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-[#f5f5f5]">
        <Header />
        <div className="flex items-center justify-center pt-32">
          <p className="text-[#6b6b6b] italic">Loading today&apos;s pulse...</p>
        </div>
      </div>
    );
  }

  // Split tesis en parrafos legibles
  const sentences = data.tesis_principal.split(/\. /);
  const paragraphs: string[] = [];
  for (let i = 0; i < sentences.length; i += 2) {
    const chunk = sentences.slice(i, i + 2).join('. ');
    if (chunk.trim()) paragraphs.push(chunk + (chunk.endsWith('.') ? '' : '.'));
  }

  const displayDate = new Date(data.metadata.fecha).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  const generatedAt = new Date(data.metadata.generado).toLocaleString('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#f5f5f5] font-sans">

      <div className="fixed top-[-200px] left-1/2 -translate-x-1/2 w-[800px] h-[800px] pointer-events-none z-0"
           style={{ background: 'radial-gradient(circle, rgba(255,77,77,0.08) 0%, transparent 60%)' }} />

      <Header regimen={data.regimen.clasificacion} confianza={data.regimen.confianza} />

      <article className="max-w-[850px] mx-auto px-8 pt-24 pb-32 relative z-10">

        <Link href="/research" className="text-xs uppercase tracking-widest text-[#a1a1a1] hover:text-white transition mb-12 inline-block">
          ← Back to Research
        </Link>

        {/* Header */}
        <div className="flex items-center gap-3 text-xs uppercase tracking-widest text-[#a1a1a1] mb-6">
          <span className="w-1.5 h-1.5 bg-[#7cc943] rounded-full animate-pulse"
                style={{ boxShadow: '0 0 8px rgba(124,201,67,0.5)' }} />
          <span>Daily Pulse · {displayDate}</span>
        </div>

        <h1 className="font-serif text-[clamp(48px,8vw,96px)] leading-[1.05] tracking-tight mb-6">
          Regime: <em className="italic text-[#ff4d4d]">{data.regimen.clasificacion}</em>
        </h1>

        <div className="flex flex-wrap gap-4 text-sm text-[#a1a1a1] mb-16">
          <span className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-[#7cc943] rounded-full" />
            Confidence {data.regimen.confianza}%
          </span>
          <span>·</span>
          <span>{data.senales.length} signals</span>
          <span>·</span>
          <span>Consolidated {formatNumber(data.confianza_consolidada, 0)}%</span>
        </div>

        {/* The macro thesis */}
        <section className="mb-20">
          <SectionTitle>The macro thesis</SectionTitle>
          {paragraphs.map((p, i) => (
            <p key={i} className="text-lg leading-relaxed text-[#d4d4d4] mb-6">
              {p.trim()}
            </p>
          ))}
        </section>

        {/* Why this regime */}
        <section className="mb-20">
          <SectionTitle>Why this regime</SectionTitle>
          <div className="bg-[#141414] border border-white/[0.08] rounded-xl p-8">
            <p className="text-base leading-relaxed text-[#a1a1a1]">
              {data.regimen.razonamiento}
            </p>
          </div>
        </section>

        {/* Today's signals */}
        <section className="mb-20">
          <SectionTitle>Today&apos;s signals</SectionTitle>
          <div className="bg-[#141414] border border-white/[0.08] rounded-xl overflow-hidden">
            <div className="grid grid-cols-[60px_90px_1fr_60px] gap-4 px-6 py-3 text-xs uppercase tracking-widest text-[#6b6b6b] border-b border-white/[0.08]">
              <span>Asset</span>
              <span>Direction</span>
              <span>Reasoning</span>
              <span className="text-right">Conv.</span>
            </div>
            {data.senales.map((s, i) => {
              const primary = s.tecnico || s.macro;
              if (!primary) return null;
              const dir = primary.direccion;
              const badgeClass =
                dir === 'LONG' ? 'bg-[#7cc943]/[0.12] text-[#7cc943]' :
                dir === 'SHORT' ? 'bg-[#f27272]/[0.12] text-[#f27272]' :
                'bg-[#a1a1a1]/[0.12] text-[#a1a1a1]';
              const dirLabel = dir === 'NEUTRAL' ? 'NEUT' : dir;
              const consensusTag =
                s.consenso === 'CONVERGENTE' ? (
                  <span className="inline-block text-[9px] px-1.5 py-0.5 rounded bg-[#7cc943]/[0.15] text-[#7cc943] ml-2 tracking-wider">SYNC</span>
                ) : s.consenso === 'DIVERGENTE' ? (
                  <span className="inline-block text-[9px] px-1.5 py-0.5 rounded bg-[#f5bd4f]/[0.15] text-[#f5bd4f] ml-2 tracking-wider">SPLIT</span>
                ) : null;

              return (
                <div key={i} className="grid grid-cols-[60px_90px_1fr_60px] gap-4 px-6 py-4 items-start border-b border-white/[0.08] last:border-b-0">
                  <span className="text-sm font-medium pt-0.5">{s.activo}</span>
                  <span>
                    <span className={`inline-flex justify-center text-[10px] font-semibold px-2.5 py-1 rounded tracking-wider ${badgeClass}`}>{dirLabel}</span>
                    {consensusTag}
                  </span>
                  <span className="text-sm text-[#a1a1a1] leading-relaxed">{primary.razonamiento}</span>
                  <span className="text-base font-medium text-right tabular-nums pt-0.5">{primary.conviccion}</span>
                </div>
              );
            })}
          </div>
        </section>

        {/* Key indicators */}
        <section className="mb-20">
          <SectionTitle>Key indicators</SectionTitle>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(data.indicadores_clave).map(([key, ind]) => (
              <div key={key} className="bg-[#141414] border border-white/[0.08] rounded-xl p-5">
                <div className="text-[11px] text-[#6b6b6b] uppercase tracking-wider mb-2">
                  {key.replace(/_/g, ' ')}
                </div>
                <div className="font-serif text-3xl tracking-tight mb-1">{formatNumber(ind.valor)}</div>
                <div className="text-[10px] text-[#6b6b6b]">{ind.fecha}</div>
              </div>
            ))}
          </div>
        </section>

        {/* What moved the market */}
        {data.eventos_clave.length > 0 && (
          <section className="mb-20">
            <SectionTitle>What moved the market</SectionTitle>
            <div className="space-y-4">
              {data.eventos_clave.map((event, i) => (
                <div key={i} className="bg-[#141414] border border-white/[0.08] rounded-xl p-6">
                  <p className="text-base leading-relaxed text-[#a1a1a1]">{event}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* What would break this thesis */}
        {data.invalidadores.length > 0 && (
          <section className="mb-20">
            <SectionTitle>What would break this thesis</SectionTitle>
            <div className="space-y-3">
              {data.invalidadores.map((inv, i) => (
                <div key={i} className="flex gap-4 items-start">
                  <span className="font-serif italic text-2xl text-[#ff4d4d] mt-1 shrink-0">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <p className="text-base leading-relaxed text-[#a1a1a1] flex-1 pt-2">{inv}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Transparency footer */}
        <footer className="mt-24 pt-8 border-t border-white/[0.08]">
          <div className="bg-[#141414] border border-white/[0.08] rounded-xl p-6">
            <div className="text-xs uppercase tracking-widest text-[#6b6b6b] mb-3">
              About this analysis
            </div>
            <p className="text-sm leading-relaxed text-[#a1a1a1] mb-4">
              This pulse is generated automatically by the macro agent (Claude Sonnet) and the technical agent (Claude Opus), without human editing. The agents read fresh macro data from FRED, real-time market data from yfinance, and curated news from NewsAPI. Their conclusions are presented here exactly as produced.
            </p>
            <p className="text-sm leading-relaxed text-[#a1a1a1]">
              For structural analyses with editorial voice, see our <Link href="/research" className="text-white border-b border-white hover:text-[#ff4d4d] hover:border-[#ff4d4d] transition">Deep Dives</Link>.
            </p>
            <div className="flex gap-4 text-xs text-[#6b6b6b] mt-4 flex-wrap">
              <span>Generated: {generatedAt}</span>
              <span>·</span>
              <span>Sources: FRED · yfinance · NewsAPI</span>
              <span>·</span>
              <span>Macro tesis: {data.metadata.tesis_macro_fecha}</span>
              {data.metadata.tesis_tecnica_fecha && (
                <>
                  <span>·</span>
                  <span>Technical tesis: {data.metadata.tesis_tecnica_fecha}</span>
                </>
              )}
            </div>
          </div>
        </footer>

      </article>
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 mb-6">
      <h2 className="font-serif text-3xl tracking-tight">{children}</h2>
      <span className="flex-1 h-px bg-white/[0.08] max-w-[120px]" />
    </div>
  );
}