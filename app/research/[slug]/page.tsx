import { notFound } from 'next/navigation';
import Link from 'next/link';
import Header from '@/app/components/Header';
import { getPaperBySlug, getAllPapers } from '@/app/lib/papers';

// Genera las rutas estáticas en build time
export async function generateStaticParams() {
  const papers = getAllPapers();
  return papers.map((paper) => ({ slug: paper.slug }));
}

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function PaperPage({ params }: Props) {
  const { slug } = await params;
  const paper = await getPaperBySlug(slug);

  if (!paper) notFound();

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#f5f5f5] font-sans">

      <div className="fixed top-[-200px] left-1/2 -translate-x-1/2 w-[800px] h-[800px] pointer-events-none z-0"
           style={{ background: 'radial-gradient(circle, rgba(255,77,77,0.08) 0%, transparent 60%)' }} />

      <Header />

      <article className="max-w-[750px] mx-auto px-8 pt-24 pb-32 relative z-10">

        <Link href="/research" className="text-xs uppercase tracking-widest text-[#a1a1a1] hover:text-white transition mb-12 inline-block">
          ← Back to Research
        </Link>

        {/* Metadata */}
        <div className="flex items-center gap-3 text-xs text-[#6b6b6b] mb-6 flex-wrap">
          <span className="text-[#a1a1a1] uppercase tracking-wider">
            {new Date(paper.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
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

        {/* Title + Subtitle */}
        <h1 className="font-serif text-[clamp(40px,6vw,72px)] leading-[1.1] tracking-tight mb-6">
          {paper.title}
        </h1>

        {paper.subtitle && (
          <p className="font-serif italic text-2xl text-[#d4d4d4] leading-relaxed mb-12">
            {paper.subtitle}
          </p>
        )}

        {/* Tags */}
        {paper.tags && paper.tags.length > 0 && (
          <div className="flex items-center gap-2 mb-16 flex-wrap">
            {paper.tags.map((tag) => (
              <span key={tag} className="text-xs text-[#6b6b6b] px-3 py-1 bg-[#141414] border border-white/[0.08] rounded-full">
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Content */}
        <div
          className="prose-fearnot"
          dangerouslySetInnerHTML={{ __html: paper.content }}
        />

        {/* Footer */}
        <div className="mt-24 pt-8 border-t border-white/[0.08]">
          <Link href="/research" className="text-sm text-[#a1a1a1] hover:text-white transition">
            ← All research
          </Link>
        </div>

      </article>
    </div>
  );
}