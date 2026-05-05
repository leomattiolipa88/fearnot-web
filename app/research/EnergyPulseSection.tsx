'use client';

import { useEffect, useState } from 'react';
import { loadWebData } from '@/app/lib/data';

interface EnergyPulse {
  fecha: string;
  regimen_oil: { clasificacion: string; confianza: number; razonamiento: string };
  regimen_natgas: { clasificacion: string; confianza: number; razonamiento: string };
  regimen_lpg: { clasificacion: string; confianza: number; razonamiento: string };
  tesis_principal: string;
  senales: Array<{
    activo: string;
    direccion: string;
    conviccion: number;
    razonamiento: string;
  }>;
  eventos_clave: string[];
  contradicciones: string;
  invalidadores: string[];
  data_gaps: string;
}

export default function EnergyPulseSection() {
  const [pulse, setPulse] = useState<EnergyPulse | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    loadWebData()
      .then((data: any) => {
        setPulse(data?.energy_pulse || null);
        setLoaded(true);
      })
      .catch(() => setLoaded(true));
  }, []);

  if (!loaded) {
    return (
      <div className="bg-[#141414] border border-white/[0.08] rounded-xl p-8">
        <p className="text-[#6b6b6b] italic text-sm">Loading energy desk...</p>
      </div>
    );
  }

  if (!pulse) {
    return (
      <div className="bg-[#141414] border border-white/[0.08] rounded-xl p-8">
        <div className="flex items-center gap-3 text-xs uppercase tracking-widest text-[#6b6b6b] mb-3">
          <span className="w-1.5 h-1.5 bg-[#6b6b6b] rounded-full" />
          <span>Energy desk offline</span>
        </div>
        <p className="text-[#a1a1a1] text-sm">
          The energy agent has not produced a memo yet today.
        </p>
      </div>
    );
  }

  const regimenColor = (clas: string) => {
    if (clas?.includes('TIGHT')) return 'text-[#f5bd4f]';
    if (clas?.includes('OVERSUPPLIED')) return 'text-[#7cc943]';
    return 'text-[#a1a1a1]';
  };

  const dirColor = (dir: string) =>
    dir === 'LONG' ? 'text-[#7cc943]' :
    dir === 'SHORT' ? 'text-[#f27272]' :
    'text-[#a1a1a1]';
  const dirBg = (dir: string) =>
    dir === 'LONG' ? 'bg-[#7cc943]/[0.12]' :
    dir === 'SHORT' ? 'bg-[#f27272]/[0.12]' :
    'bg-[#a1a1a1]/[0.12]';

  return (
    <div className="bg-[#141414] border border-white/[0.08] rounded-xl overflow-hidden hover:border-white/[0.15] transition">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full p-8 text-left"
      >
        <div className="flex items-center gap-3 text-xs uppercase tracking-widest text-[#cyan] mb-4">
          <span className="w-1.5 h-1.5 bg-[#06b6d4] rounded-full animate-pulse"
                style={{ boxShadow: '0 0 8px rgba(6,182,212,0.5)' }} />
          <span style={{ color: '#06b6d4' }}>Energy Desk · Updated daily</span>
        </div>

        {/* Three regime grid */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { name: 'OIL', regime: pulse.regimen_oil },
            { name: 'NATGAS', regime: pulse.regimen_natgas },
            { name: 'LPG', regime: pulse.regimen_lpg },
          ].map(({ name, regime }) => (
            <div key={name} className="bg-[#0a0a0a] border border-white/[0.05] rounded-lg p-5">
              <div className="text-xs text-[#6b6b6b] uppercase tracking-widest mb-2">{name}</div>
              <div className={`font-serif text-base ${regimenColor(regime.clasificacion)} mb-1`}>
                {regime.clasificacion}
              </div>
              <div className="text-xs text-[#6b6b6b]">{regime.confianza}% confidence</div>
            </div>
          ))}
        </div>

        {/* Tesis principal preview */}
        <div className="text-xs uppercase tracking-widest text-[#6b6b6b] mb-3">The thesis</div>
        <p className="text-base leading-relaxed text-[#d4d4d4] mb-4">
          {expanded ? pulse.tesis_principal : `${pulse.tesis_principal.slice(0, 320)}...`}
        </p>

        <div className="text-xs text-[#6b6b6b] tracking-wider">
          {expanded ? '▼ Hide full memo' : '▶ See full memo'}
        </div>
      </button>

      {expanded && (
        <div className="px-8 pb-8 border-t border-white/[0.05] pt-8 space-y-8">

          {/* Razonamiento de cada regimen */}
          <div>
            <div className="text-xs uppercase tracking-widest text-[#6b6b6b] mb-4">Regime reasoning</div>
            <div className="space-y-4">
              {[
                { name: 'Oil', regime: pulse.regimen_oil },
                { name: 'Natural Gas', regime: pulse.regimen_natgas },
                { name: 'LPG', regime: pulse.regimen_lpg },
              ].map(({ name, regime }) => (
                <div key={name} className="bg-[#0a0a0a] border border-white/[0.05] rounded-lg p-5">
                  <div className="flex items-baseline gap-3 mb-2">
                    <span className="text-xs text-[#6b6b6b] uppercase tracking-wider">{name}</span>
                    <span className={`text-xs font-medium ${regimenColor(regime.clasificacion)}`}>
                      {regime.clasificacion}
                    </span>
                    <span className="text-xs text-[#6b6b6b]">{regime.confianza}%</span>
                  </div>
                  <p className="text-sm text-[#a1a1a1] leading-relaxed">{regime.razonamiento}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Senales por activo */}
          <div>
            <div className="text-xs uppercase tracking-widest text-[#6b6b6b] mb-4">
              Asset signals ({pulse.senales.length})
            </div>
            <div className="bg-[#0a0a0a] border border-white/[0.05] rounded-lg overflow-hidden">
              <div className="grid grid-cols-[80px_80px_60px_1fr] gap-3 px-5 py-3 text-xs uppercase tracking-widest text-[#6b6b6b] border-b border-white/[0.05]">
                <span>Asset</span>
                <span>Direction</span>
                <span className="text-right">Conv.</span>
                <span>Reasoning</span>
              </div>
              {pulse.senales.map((s, i) => (
                <div key={i} className="grid grid-cols-[80px_80px_60px_1fr] gap-3 px-5 py-3 items-start border-b border-white/[0.05] last:border-b-0">
                  <span className="text-sm font-medium pt-0.5">{s.activo}</span>
                  <span>
                    <span className={`inline-flex justify-center text-[10px] font-semibold px-2 py-1 rounded tracking-wider ${dirBg(s.direccion)} ${dirColor(s.direccion)}`}>
                      {s.direccion === 'NEUTRAL' ? 'NEUT' : s.direccion}
                    </span>
                  </span>
                  <span className="text-sm font-medium text-right tabular-nums pt-0.5">
                    {s.conviccion}/10
                  </span>
                  <span className="text-xs text-[#a1a1a1] leading-relaxed">{s.razonamiento}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Eventos clave */}
          {pulse.eventos_clave?.length > 0 && (
            <div>
              <div className="text-xs uppercase tracking-widest text-[#6b6b6b] mb-4">
                Key events this week
              </div>
              <ul className="space-y-3">
                {pulse.eventos_clave.map((evento, i) => (
                  <li key={i} className="flex gap-3 items-start">
                    <span className="text-[#06b6d4] mt-1 shrink-0">•</span>
                    <p className="text-sm text-[#a1a1a1] leading-relaxed">{evento}</p>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Contradicciones */}
          {pulse.contradicciones && (
            <div className="bg-[#0a0a0a] border border-[#06b6d4]/[0.2] rounded-lg p-5">
              <div className="text-xs uppercase tracking-widest text-[#06b6d4] mb-3">
                Contradictions observed
              </div>
              <p className="text-sm text-[#a1a1a1] leading-relaxed italic">
                {pulse.contradicciones}
              </p>
            </div>
          )}

          {/* Invalidadores */}
          {pulse.invalidadores?.length > 0 && (
            <div>
              <div className="text-xs uppercase tracking-widest text-[#6b6b6b] mb-4">
                What would invalidate this
              </div>
              <ul className="space-y-2">
                {pulse.invalidadores.map((inv, i) => (
                  <li key={i} className="text-sm text-[#a1a1a1] flex gap-3 items-start">
                    <span className="text-[#ff4d4d] mt-1">×</span>
                    <span>{inv}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Data gaps - transparencia */}
          {pulse.data_gaps && (
            <div className="bg-[#0a0a0a] border border-white/[0.05] rounded-lg p-5">
              <div className="text-xs uppercase tracking-widest text-[#6b6b6b] mb-3">
                Data gaps (what we don't know)
              </div>
              <p className="text-xs text-[#6b6b6b] leading-relaxed">
                {pulse.data_gaps}
              </p>
            </div>
          )}

          {/* Footer */}
          <div className="text-xs text-[#6b6b6b] pt-4 border-t border-white/[0.05]">
            Generated by the energy desk agent (Claude Sonnet 4.6) on {pulse.fecha}.
            Sources: yfinance, EIA, NewsAPI.
          </div>
        </div>
      )}
    </div>
  );
}
