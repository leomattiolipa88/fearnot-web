import Link from 'next/link';
import Header from '@/app/components/Header';
import { getAllPapers } from '@/app/lib/papers';
import ConvictionsSection from './ConvictionsSection';
import DailyPulseCard from './DailyPulseCard';
import EnergyPulseSection from './EnergyPulseSection';

export default function ResearchPage() {
  const papers = getAllPapers();

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#f5f5f5] font-sans">
      <div className="fixed top-[-200px] left-1/2 -translate-x-1/2 w-[800px] h-[800px] pointer-events-none z-0"
           style={{ background: 'radial-gradient(circle, rgba(255,77,77,0.08) 0%, transparent 60%)' }} />

      <Header />

      <main className="max-w-[1100px] mx-auto px-8 pt-24 pb-32 relative z-10">

        <div className="mb-20">
          <div className="flex items-center gap-3 text-xs uppercase tracking-widest text-[#a1a1a1] mb-4">
            <span className="w-1.5 h-1.5 bg-[#ff4d4d] rounded-full" />
            <span>Research</span>
          </div>
          <h1 className="font-serif text-[clamp(56px,9vw,112px)] leading-[1.05] tracking-tight">
            Research <em className="italic text-[#ff4d4d]">archive</em>
          </h1>
        </div>

        {/* SECTION 1: Daily Pulse (macro + technical) */}
        <section className="mb-24">
          <SectionHeader title="Daily Pulse" subtitle="Macro and technical regime" />
          <DailyPulseCard />
        </section>

        {/* SECTION 2: Energy Pulse (O&G + LPG) */}
        <section className="mb-24">
          <SectionHeader title="Energy Pulse" subtitle="Energy desk view: oil, natural gas, LPG" />
          <EnergyPulseSection />
        </section>

        {/* SECTION 3: Convictions */}
        <section className="mb-24">
          <SectionHeader
            title="This Week's Convictions"
            subtitle="Where multiple agents converge on a single trade"
          />
          <ConvictionsSection />
        </section>

        {/* SECTION 4: Deep Dives */}
        <section>
          <SectionHeader
            title="Deep Dives"
            subtitle="Structural analyses with editorial voice"
          />

          {papers.length === 0 ? (
            <div className="bg-[#141414] border border-white/[0.08] rounded-xl p-8">
              <p className="text-[#a1a1a1] text-sm">No deep dives published yet.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {papers.map((paper) => (
                <Link key={paper.slug} href={`/research/${paper.slug}`}>
                  <div className="bg-[#141414] border border-white/[0.08] rounded-xl p-6 hover:border-[#ff4d4d]/40 transition cursor-pointer group">
                    <div className="flex items-start justify-between gap-6 flex-wrap">
                      <div className="flex-1 min-w-[300px]">
                        <h3 className="font-serif text-2xl mb-2 group-hover:text-[#ff4d4d] transition">
                          {paper.title}
                        </h3>
                        {paper.subtitle && (
                          <p className="text-[#a1a1a1] text-sm leading-relaxed">
                            {paper.subtitle}
                          </p>
                        )}
                        <div className="flex gap-3 mt-4 flex-wrap">
                          {paper.tags?.map((tag) => (
                            <span key={tag} className="text-[10px] px-2 py-1 rounded bg-white/[0.05] text-[#6b6b6b] tracking-wider uppercase">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <div className="text-xs text-[#6b6b6b] uppercase tracking-wider mb-1">{paper.horizon}</div>
                        <div className="text-xs text-[#a1a1a1]">{paper.date}</div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>

      </main>
    </div>
  );
}

function SectionHeader({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="mb-8">
      <div className="flex items-center gap-3 mb-3">
        <h2 className="font-serif text-4xl tracking-tight">{title}</h2>
        <span className="flex-1 h-px bg-white/[0.08] max-w-[100px]" />
      </div>
      <p className="text-sm text-[#6b6b6b] italic">{subtitle}</p>
    </div>
  );
}
