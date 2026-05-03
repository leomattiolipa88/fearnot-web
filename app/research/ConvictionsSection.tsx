'use client';

import { useEffect, useState } from 'react';
import { loadWebData } from '@/app/lib/data';

interface Conviction {
  id: number;
  fecha: string;
  tipo: string;
  ticker: string;
  direccion: string;
  horizonte: string;
  conviccion: number;
  position_size: string;
  thesis: string[];
  fundamental_case: {
    macro_context?: string;
    sectoral_dynamics?: string;
    technical_setup?: string;
    why_this_expression?: string;
  };
  invalidators: string[];
  agents_aligned: string[];
  entry_strategy: string;
  stop_loss_logic: string;
  profit_target: string;
  wrong_about: string;
  precio_entrada: number | null;
  fecha_evaluacion: string;
}

export default function ConvictionsSection() {
  const [convictions, setConvictions] = useState<Conviction[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [expandedConv, setExpandedConv] = useState<number | null>(null);

  useEffect(() => {
    loadWebData()
      .then((data: any) => {
        setConvictions(data?.convicciones || []);
        setLoaded(true);
      })
      .catch(() => setLoaded(true));
  }, []);

  if (!loaded) {
    return (
      <div className="bg-[#141414] border border-white/[0.08] rounded-xl p-8">
        <p className="text-[#6b6b6b] italic text-sm">Loading convictions...</p>
      </div>
    );
  }

  if (convictions.length === 0) {
    return (
      <div className="bg-[#141414] border border-white/[0.08] rounded-xl p-8">
        <div className="flex items-center gap-3 text-xs uppercase tracking-widest text-[#6b6b6b] mb-3">
          <span className="w-1.5 h-1.5 bg-[#6b6b6b] rounded-full" />
          <span>No active convictions</span>
        </div>
        <p className="text-[#a1a1a1] text-sm leading-relaxed max-w-xl">
          The Synthesizer applies three filters: multiple agents must agree, the causal chain must be explainable, and risk/reward must be asymmetric. When no trade clears all three, we publish nothing. Scarcity of conviction is a feature.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {convictions.map((conv) => {
        const isExpanded = expandedConv === conv.id;
        const dirColor = conv.direccion === 'LONG' ? 'text-[#7cc943]' : 'text-[#f27272]';
        const dirBg = conv.direccion === 'LONG' ? 'bg-[#7cc943]/[0.12]' : 'bg-[#f27272]/[0.12]';
        const sizeColor =
          conv.position_size === 'CONCENTRATED' ? 'text-[#ff4d4d]' :
          conv.position_size === 'STANDARD' ? 'text-[#f5bd4f]' :
          'text-[#a1a1a1]';

        return (
          <div
            key={conv.id}
            className="bg-[#141414] border border-white/[0.08] rounded-xl overflow-hidden hover:border-white/[0.15] transition"
          >
            <button
              onClick={() => setExpandedConv(isExpanded ? null : conv.id)}
              className="w-full p-8 text-left"
            >
              <div className="flex items-start justify-between gap-6 flex-wrap">
                <div className="flex-1 min-w-[300px]">
                  <div className="flex items-center gap-4 mb-4 flex-wrap">
                    <span className="font-serif text-4xl tracking-tight">{conv.ticker}</span>
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded tracking-wider ${dirBg} ${dirColor}`}>
                      {conv.direccion}
                    </span>
                    <span className="text-xs text-[#6b6b6b] tracking-wider">{conv.horizonte}</span>
                    <span className={`text-xs font-medium tracking-wider ${sizeColor}`}>
                      {conv.position_size}
                    </span>
                  </div>
                  <p className="text-base leading-relaxed text-[#d4d4d4] mb-2">
                    {conv.thesis[0]}
                  </p>
                </div>

                <div className="text-right shrink-0">
                  <div className="text-xs text-[#6b6b6b] uppercase tracking-wider mb-1">Conviction</div>
                  <div className="font-serif text-4xl tabular-nums">
                    {conv.conviccion}<span className="text-[#6b6b6b] text-2xl">/10</span>
                  </div>
                  {conv.precio_entrada && (
                    <div className="text-xs text-[#6b6b6b] mt-2">
                      Entry: ${conv.precio_entrada.toFixed(2)}
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-6 text-xs text-[#6b6b6b] tracking-wider">
                {isExpanded ? '▼ Hide full thesis' : '▶ Read full thesis'}
              </div>
            </button>

            {isExpanded && (
              <div className="px-8 pb-8 border-t border-white/[0.05] pt-8 space-y-8">
                <div>
                  <div className="text-xs uppercase tracking-widest text-[#6b6b6b] mb-4">The thesis</div>
                  <ol className="space-y-3">
                    {conv.thesis.map((frase, i) => (
                      <li key={i} className="flex gap-4">
                        <span className="font-serif italic text-xl text-[#ff4d4d] shrink-0">
                          {String(i + 1).padStart(2, '0')}
                        </span>
                        <p className="text-base leading-relaxed text-[#d4d4d4] pt-1">{frase}</p>
                      </li>
                    ))}
                  </ol>
                </div>

                <div>
                  <div className="text-xs uppercase tracking-widest text-[#6b6b6b] mb-4">Fundamental case</div>
                  <div className="space-y-4">
                    {conv.fundamental_case.macro_context && (
                      <div>
                        <span className="text-xs text-[#6b6b6b] uppercase tracking-wider">Macro</span>
                        <p className="text-sm text-[#a1a1a1] leading-relaxed mt-1">{conv.fundamental_case.macro_context}</p>
                      </div>
                    )}
                    {conv.fundamental_case.sectoral_dynamics && (
                      <div>
                        <span className="text-xs text-[#6b6b6b] uppercase tracking-wider">Sectoral</span>
                        <p className="text-sm text-[#a1a1a1] leading-relaxed mt-1">{conv.fundamental_case.sectoral_dynamics}</p>
                      </div>
                    )}
                    {conv.fundamental_case.technical_setup && (
                      <div>
                        <span className="text-xs text-[#6b6b6b] uppercase tracking-wider">Technical</span>
                        <p className="text-sm text-[#a1a1a1] leading-relaxed mt-1">{conv.fundamental_case.technical_setup}</p>
                      </div>
                    )}
                    {conv.fundamental_case.why_this_expression && (
                      <div>
                        <span className="text-xs text-[#6b6b6b] uppercase tracking-wider">Why this expression</span>
                        <p className="text-sm text-[#a1a1a1] leading-relaxed mt-1">{conv.fundamental_case.why_this_expression}</p>
                      </div>
                    )}
                  </div>
                </div>

                {conv.agents_aligned.length > 0 && (
                  <div>
                    <div className="text-xs uppercase tracking-widest text-[#6b6b6b] mb-4">Agents aligned</div>
                    <ul className="space-y-2">
                      {conv.agents_aligned.map((a, i) => (
                        <li key={i} className="text-sm text-[#a1a1a1] flex gap-3 items-start">
                          <span className="text-[#7cc943] mt-1">✓</span>
                          <span>{a}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {conv.entry_strategy && (
                    <div className="bg-[#0a0a0a] border border-white/[0.05] rounded-lg p-4">
                      <div className="text-xs text-[#6b6b6b] uppercase tracking-wider mb-2">Entry</div>
                      <p className="text-xs text-[#a1a1a1] leading-relaxed">{conv.entry_strategy}</p>
                    </div>
                  )}
                  {conv.stop_loss_logic && (
                    <div className="bg-[#0a0a0a] border border-white/[0.05] rounded-lg p-4">
                      <div className="text-xs text-[#6b6b6b] uppercase tracking-wider mb-2">Stop</div>
                      <p className="text-xs text-[#a1a1a1] leading-relaxed">{conv.stop_loss_logic}</p>
                    </div>
                  )}
                  {conv.profit_target && (
                    <div className="bg-[#0a0a0a] border border-white/[0.05] rounded-lg p-4">
                      <div className="text-xs text-[#6b6b6b] uppercase tracking-wider mb-2">Target</div>
                      <p className="text-xs text-[#a1a1a1] leading-relaxed">{conv.profit_target}</p>
                    </div>
                  )}
                </div>

                {conv.invalidators.length > 0 && (
                  <div>
                    <div className="text-xs uppercase tracking-widest text-[#6b6b6b] mb-4">This conviction is broken if</div>
                    <ul className="space-y-2">
                      {conv.invalidators.map((inv, i) => (
                        <li key={i} className="text-sm text-[#a1a1a1] flex gap-3 items-start">
                          <span className="text-[#ff4d4d] mt-1">×</span>
                          <span>{inv}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {conv.wrong_about && (
                  <div className="bg-[#0a0a0a] border border-white/[0.05] rounded-lg p-5">
                    <div className="text-xs uppercase tracking-widest text-[#6b6b6b] mb-3">What we could be wrong about</div>
                    <p className="text-sm text-[#a1a1a1] leading-relaxed italic">{conv.wrong_about}</p>
                  </div>
                )}

                <div className="flex justify-between text-xs text-[#6b6b6b] pt-4 border-t border-white/[0.05]">
                  <span>Published {conv.fecha}</span>
                  <span>Evaluation: {conv.fecha_evaluacion}</span>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
