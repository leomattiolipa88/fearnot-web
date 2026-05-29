'use client';

import { useEffect, useState } from 'react';
import Header from '@/app/components/Header';

// ============== Types ==============
type Conviction = {
  fecha: string;
  ticker: string;
  direccion: 'LONG' | 'SHORT' | 'NEUTRAL';
  horizonte: string;
  conviccion: number;
  position_size: string;
  precio_entrada: number | null;
  precio_salida: number | null;
  fecha_evaluacion: string | null;
  retorno_pct: number | null;
  mfe_pct: number | null;
  mae_pct: number | null;
  dias_hasta_mfe: number | null;
  dias_hasta_mae: number | null;
  volatilidad_pct: number | null;
  precio_max: number | null;
  precio_min: number | null;
  dias_trade: number | null;
  evaluado: number;
};

type PerformanceSummary = {
  n_evaluadas: number;
  n_aciertos?: number;
  win_rate?: number;
  avg_return_pct?: number;
  avg_mfe_pct?: number;
  avg_mae_pct?: number;
  avg_volatilidad_pct?: number;
  alpha_capture_pct?: number | null;
  mensaje?: string;
};

type WebData = {
  regimen?: { clasificacion: string; confianza: number };
  track_record: Conviction[];
  convicciones_pending: Conviction[];
  performance_summary: PerformanceSummary;
};

// ============== Helpers ==============
function formatPct(val: number | null | undefined, signed = true): string {
  if (val === null || val === undefined) return '—';
  const sign = signed && val > 0 ? '+' : '';
  return `${sign}${val.toFixed(1)}%`;
}

function formatPrice(val: number | null | undefined): string {
  if (val === null || val === undefined) return '—';
  return val.toFixed(2);
}

function classifyReturn(val: number | null): 'win' | 'loss' | 'neutral' {
  if (val === null) return 'neutral';
  return val > 0 ? 'win' : 'loss';
}

// ============== Components ==============
function MetricCard({
  label,
  value,
  hint,
  color = 'neutral',
}: {
  label: string;
  value: string;
  hint?: string;
  color?: 'win' | 'loss' | 'neutral';
}) {
  const colorClass =
    color === 'win'
      ? 'text-[#7cc943]'
      : color === 'loss'
      ? 'text-[#ff4d4d]'
      : 'text-white';

  return (
    <div className="bg-[#141414] border border-white/[0.08] rounded-xl p-5">
      <div className="text-xs uppercase tracking-wider text-[#a1a1a1] mb-2">
        {label}
      </div>
      <div className={`text-3xl font-medium tracking-tight ${colorClass}`}>
        {value}
      </div>
      {hint && <div className="text-xs text-[#666] mt-2">{hint}</div>}
    </div>
  );
}

function ClosedConvictionRow({ conv }: { conv: Conviction }) {
  const winLoss = classifyReturn(conv.retorno_pct);
  const isWin = winLoss === 'win';

  return (
    <div className="border-b border-white/[0.05] hover:bg-white/[0.02] transition-colors">
      <div className="grid grid-cols-12 gap-4 py-4 px-2 items-center text-sm">
        <div className="col-span-1 font-mono text-[#a1a1a1] text-xs">
          {conv.fecha}
        </div>
        <div className="col-span-1 font-medium">{conv.ticker}</div>
        <div className="col-span-1">
          <span
            className={`text-xs px-2 py-1 rounded ${
              conv.direccion === 'LONG'
                ? 'bg-[#7cc943]/10 text-[#7cc943]'
                : 'bg-[#ff4d4d]/10 text-[#ff4d4d]'
            }`}
          >
            {conv.direccion}
          </span>
        </div>
        <div className="col-span-1 font-mono text-xs">
          {formatPrice(conv.precio_entrada)}
        </div>
        <div className="col-span-1 font-mono text-xs">
          {formatPrice(conv.precio_salida)}
        </div>
        <div
          className={`col-span-1 font-mono text-xs ${
            isWin ? 'text-[#7cc943]' : 'text-[#ff4d4d]'
          }`}
        >
          {formatPct(conv.retorno_pct)}
        </div>
        <div className="col-span-1 font-mono text-xs text-[#7cc943]/70">
          {formatPct(conv.mfe_pct)}
        </div>
        <div className="col-span-1 font-mono text-xs text-[#ff4d4d]/70">
          {formatPct(conv.mae_pct)}
        </div>
        <div className="col-span-1 font-mono text-xs text-[#a1a1a1]">
          {conv.volatilidad_pct?.toFixed(1)}%
        </div>
        <div className="col-span-2 text-xs text-[#a1a1a1]">
          {conv.dias_trade}d trade · MFE d{conv.dias_hasta_mfe}
        </div>
        <div className="col-span-1 text-center">
          {isWin ? (
            <span className="text-[#7cc943] text-lg">✓</span>
          ) : (
            <span className="text-[#ff4d4d] text-lg">✕</span>
          )}
        </div>
      </div>
    </div>
  );
}

function PendingRow({ conv }: { conv: Conviction }) {
  return (
    <div className="border-b border-white/[0.05] hover:bg-white/[0.02] transition-colors">
      <div className="grid grid-cols-12 gap-4 py-4 px-2 items-center text-sm">
        <div className="col-span-1 font-mono text-[#a1a1a1] text-xs">
          {conv.fecha}
        </div>
        <div className="col-span-1 font-medium">{conv.ticker}</div>
        <div className="col-span-1">
          <span
            className={`text-xs px-2 py-1 rounded ${
              conv.direccion === 'LONG'
                ? 'bg-[#7cc943]/10 text-[#7cc943]'
                : 'bg-[#ff4d4d]/10 text-[#ff4d4d]'
            }`}
          >
            {conv.direccion}
          </span>
        </div>
        <div className="col-span-2 font-mono text-xs">
          {formatPrice(conv.precio_entrada)}
        </div>
        <div className="col-span-2 text-xs text-[#a1a1a1]">
          {conv.horizonte}
        </div>
        <div className="col-span-3 text-xs text-[#a1a1a1] font-mono">
          Evals: {conv.fecha_evaluacion || '—'}
        </div>
        <div className="col-span-2 text-xs">
          <span className="text-[#a1a1a1]">Conv:</span>{' '}
          <span className="font-medium">{conv.conviccion}/10</span>
        </div>
      </div>
    </div>
  );
}

// ============== Main Page ==============
export default function PerformancePage() {
  const [data, setData] = useState<WebData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/web_data.json')
      .then((r) => r.json())
      .then((d: WebData) => {
        setData(d);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white">
        <Header />
        <div className="max-w-[1200px] mx-auto px-8 py-20 text-center text-[#a1a1a1]">
          Loading performance data...
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white">
        <Header />
        <div className="max-w-[1200px] mx-auto px-8 py-20 text-center text-[#ff4d4d]">
          Error loading data.
        </div>
      </div>
    );
  }

  const perf = data.performance_summary;
  const closed = data.track_record || [];
  const pending = data.convicciones_pending || [];

  const hasData = perf.n_evaluadas > 0;

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <Header
        regimen={data.regimen?.clasificacion}
        confianza={data.regimen?.confianza}
      />

      <main className="max-w-[1200px] mx-auto px-8 py-12">
        {/* Title */}
        <div className="mb-12">
          <h1 className="text-5xl font-light tracking-tight mb-3">
            Performance
          </h1>
          <p className="text-[#a1a1a1] text-lg max-w-3xl">
            Track record of every conviction the system has made. Every trade
            is evaluated path-dependent: not just the final return, but
            Maximum Favorable Excursion (MFE), Maximum Adverse Excursion (MAE),
            and realized volatility — the same way professional funds measure trades.
          </p>
        </div>

        {/* Summary Cards */}
        {hasData ? (
          <>
            <h2 className="text-sm uppercase tracking-wider text-[#a1a1a1] mb-4">
              System Performance
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
              <MetricCard
                label="Win Rate"
                value={`${perf.win_rate?.toFixed(0)}%`}
                hint={`${perf.n_aciertos}/${perf.n_evaluadas} convictions`}
                color={
                  (perf.win_rate || 0) >= 50 ? 'win' : 'loss'
                }
              />
              <MetricCard
                label="Avg Return"
                value={formatPct(perf.avg_return_pct)}
                hint="Mean final return per trade"
                color={
                  (perf.avg_return_pct || 0) > 0 ? 'win' : 'loss'
                }
              />
              <MetricCard
                label="Alpha Capture"
                value={
                  perf.alpha_capture_pct !== null &&
                  perf.alpha_capture_pct !== undefined
                    ? `${perf.alpha_capture_pct.toFixed(0)}%`
                    : '—'
                }
                hint="% of peak captured at close"
              />
              <MetricCard
                label="Avg MFE / MAE"
                value={`${formatPct(perf.avg_mfe_pct)} / ${formatPct(perf.avg_mae_pct)}`}
                hint="Typical upside / drawdown"
              />
            </div>
          </>
        ) : (
          <div className="bg-[#141414] border border-white/[0.08] rounded-xl p-8 mb-12 text-center">
            <p className="text-[#a1a1a1]">
              No convictions have been evaluated yet. Performance metrics will
              appear once trades reach their evaluation horizon.
            </p>
          </div>
        )}

        {/* Closed Convictions */}
        {closed.length > 0 && (
          <section className="mb-16">
            <h2 className="text-sm uppercase tracking-wider text-[#a1a1a1] mb-4">
              Closed Convictions ({closed.length})
            </h2>
            <div className="bg-[#141414] border border-white/[0.08] rounded-xl overflow-hidden">
              {/* Header row */}
              <div className="grid grid-cols-12 gap-4 py-3 px-2 border-b border-white/[0.08] text-xs uppercase tracking-wider text-[#666]">
                <div className="col-span-1">Date</div>
                <div className="col-span-1">Ticker</div>
                <div className="col-span-1">Dir</div>
                <div className="col-span-1">Entry</div>
                <div className="col-span-1">Exit</div>
                <div className="col-span-1">Final</div>
                <div className="col-span-1">MFE</div>
                <div className="col-span-1">MAE</div>
                <div className="col-span-1">Vol</div>
                <div className="col-span-2">Trade</div>
                <div className="col-span-1 text-center">Win</div>
              </div>
              {closed.map((conv, i) => (
                <ClosedConvictionRow key={`${conv.fecha}-${conv.ticker}-${i}`} conv={conv} />
              ))}
            </div>
          </section>
        )}

        {/* Pending Convictions */}
        {pending.length > 0 && (
          <section>
            <h2 className="text-sm uppercase tracking-wider text-[#a1a1a1] mb-4">
              Active Convictions ({pending.length})
            </h2>
            <p className="text-sm text-[#a1a1a1] mb-4 max-w-3xl">
              Convictions still open. Will be evaluated automatically when the
              evaluation date is reached.
            </p>
            <div className="bg-[#141414] border border-white/[0.08] rounded-xl overflow-hidden">
              <div className="grid grid-cols-12 gap-4 py-3 px-2 border-b border-white/[0.08] text-xs uppercase tracking-wider text-[#666]">
                <div className="col-span-1">Date</div>
                <div className="col-span-1">Ticker</div>
                <div className="col-span-1">Dir</div>
                <div className="col-span-2">Entry</div>
                <div className="col-span-2">Horizon</div>
                <div className="col-span-3">Evaluates</div>
                <div className="col-span-2">Conviction</div>
              </div>
              {pending.map((conv, i) => (
                <PendingRow key={`${conv.fecha}-${conv.ticker}-${i}`} conv={conv} />
              ))}
            </div>
          </section>
        )}

        {/* Methodology note */}
        <div className="mt-16 pt-8 border-t border-white/[0.08]">
          <h3 className="text-xs uppercase tracking-wider text-[#a1a1a1] mb-3">
            Methodology
          </h3>
          <p className="text-sm text-[#a1a1a1] max-w-3xl leading-relaxed">
            Each conviction is evaluated when its horizon expires (WEEKS = 7d,
            MONTHS = 30d, QUARTERS = 90d from publication). The evaluator
            downloads the full daily price series between entry and exit, then
            computes MFE (maximum favorable excursion: best possible exit),
            MAE (maximum adverse excursion: worst drawdown), realized
            volatility, and final return. This is path-dependent evaluation —
            single-point evaluation hides the trade&apos;s real shape.
          </p>
        </div>
      </main>
    </div>
  );
}
