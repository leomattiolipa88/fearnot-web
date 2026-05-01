import Link from 'next/link';
import Header from '@/app/components/Header';
import { getAllPapers } from '@/app/lib/papers';

export default function Research() {
  const papers = getAllPapers();

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#f5f5f5] font-sans">

      <div className="fixed top-[-200px] left-1/2 -translate-x-1/2 w-[800px] h-[800px] pointer-events-none z-0"
           style={{ background: 'radial-gradient(circle, rgba(255,77,77,0.08) 0%, transparent 60%)' }} />

      <Header />

      <section className="max-w-[900px] mx-auto px-8 pt-24 pb-16 relative z-10">

        <Link href="/" className="text-xs uppercase tracking-widest text-[#a1a1a1] hover:text-white transition mb-12 inline-block">
          ← Back to Today
        </Link>

        <h1 className="font-serif text-[clamp(48px,8vw,96px)] leading-[1.05] tracking-tight mb-6">
          Research.
        </h1>

        <p className="text-xl leading-relaxed text-[#a1a1a1] max-w-[600px] mb-20">
          Two horizons. Daily pulse for the noise of markets,
          structural deep dives for what actually matters.
        </p>

        {/* Daily Pulse Section */}
        <div className="mb-20">
          <div className="flex items-center gap-3 mb-8">
            <span className="text-xs uppercase tracking-widest text-[#a1a1a1]">Daily pulse</span>
            <span className="flex-1 h-px bg-white/[0.08] max-w-[80px]" />
            <span className="text-xs text-[#6b6b6b]">Updated daily</span>
          </div>

          <Link href="/research/today"
                className="block bg-[#141414] border border-white/[0.08] rounded-xl p-8 hover:border-white/[0.14] transition-all group">
            <div className="flex items-center gap-2 text-xs text-[#6b6b6b] mb-3">
              <span className="w-1.5 h-1.5 bg-[#7cc943] rounded-full animate-pulse" />
              <span>LIVE — Today&apos;s macro thesis</span>
            </div>
            <h2 className="font-serif text-3xl mb-3 tracking-tight group-hover:text-[#ff4d4d] transition-colors">
              Today&apos;s regime, signals, and noise →
            </h2>
            <p className="text-base text-[#a1a1a1] leading-relaxed">
              The macro agent&apos;s daily read on the markets. Short, factual,
              context-aware. The kind of thing you check with your morning coffee
              before deciding whether to even open Bloomberg.
            </p>
          </Link>
        </div>

        {/* Deep Dives Section */}
        <div>
          <div className="flex items-center gap-3 mb-8">
            <span className="text-xs uppercase tracking-widest text-[#a1a1a1]">Deep dives</span>
            <span className="flex-1 h-px bg-white/[0.08] max-w-[80px]" />
            <span className="text-xs text-[#6b6b6b]">{papers.length} published</span>
          </div>

          {papers.length === 0 ? (
            <div className="bg-[#141414] border border-white/[0.08] rounded-xl p-12 text-center">
              <p className="text-[#6b6b6b] italic">
                The first deep dive is coming soon.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {papers.map((paper) => (
                <Link key={paper.slug} href={`/research/${paper.slug}`}
                      className="block bg-[#141414] border border-white/[0.08] rounded-xl p-8 hover:border-white/[0.14] transition-all group">

                  <div className="flex items-center gap-3 text-xs text-[#6b6b6b] mb-3 flex-wrap">
                    <span className="text-[#a1a1a1] uppercase tracking-wider">
                      {new Date(paper.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                    {paper.horizon && (
                      <>
                        <span>·</span>
                        <span>Horizon: {paper.horizon}</span>
                      </>
                    )}
                    {paper.sentiment && (
                      <>
                        <span>·</span>
                        <span className={
                          paper.sentiment === 'bull' ? 'text-[#7cc943]' :
                          paper.sentiment === 'bear' ? 'text-[#f27272]' :
                          'text-[#a1a1a1]'
                        }>
                          {paper.sentiment.toUpperCase()}
                        </span>
                      </>
                    )}
                  </div>

                  <h2 className="font-serif text-3xl mb-3 tracking-tight group-hover:text-[#ff4d4d] transition-colors">
                    {paper.title}
                  </h2>

                  {paper.subtitle && (
                    <p className="text-lg text-[#d4d4d4] leading-relaxed mb-4 italic font-serif">
                      {paper.subtitle}
                    </p>
                  )}

                  <p className="text-base text-[#a1a1a1] leading-relaxed mb-4">
                    {paper.excerpt}
                  </p>

                  <div className="flex items-center gap-3 flex-wrap">
                    {paper.tags?.map((tag) => (
                      <span key={tag} className="text-xs text-[#6b6b6b] px-2 py-1 bg-[#0a0a0a] rounded">
                        {tag}
                      </span>
                    ))}
                  </div>

                </Link>
              ))}
            </div>
          )}
        </div>

      </section>
    </div>
  );
}