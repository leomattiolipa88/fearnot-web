'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

type Props = {
  regimen?: string;
  confianza?: number;
};

export default function Header({ regimen, confianza }: Props) {
  const pathname = usePathname();

  const links = [
    { href: '/', label: 'Today' },
    { href: '/research', label: 'Research' },
    { href: '/agents', label: 'Agents' },
    { href: '/performance', label: 'Performance' },
    { href: '/manifesto', label: 'Manifesto' },
  ];

  return (
    <div className="sticky top-0 backdrop-blur-xl bg-[#0a0a0a]/80 border-b border-white/[0.08] z-50">
      <div className="max-w-[1200px] mx-auto px-8 py-4 flex items-center justify-between">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 text-base font-medium tracking-tight">
          <div className="w-6 h-6 bg-[#ff4d4d] rounded-md relative overflow-hidden">
            <div
              className="absolute inset-0"
              style={{ background: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.3), transparent 70%)' }}
            />
          </div>
          <span>FearNot</span>
        </Link>

        {/* Navigation */}
        <div className="hidden md:flex gap-8">
          {links.map((link) => {
            const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm transition-colors ${
                  isActive ? 'text-white' : 'text-[#a1a1a1] hover:text-white'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        {/* Status badge */}
        {regimen && confianza !== undefined ? (
          <div className="flex items-center gap-2 text-xs text-[#a1a1a1] px-3 py-1.5 bg-[#141414] border border-white/[0.08] rounded-full">
            <span
              className="w-1.5 h-1.5 bg-[#7cc943] rounded-full animate-pulse"
              style={{ boxShadow: '0 0 8px rgba(124,201,67,0.5)' }}
            />
            <span>Live · {regimen} {confianza}%</span>
          </div>
        ) : (
          <div className="w-[180px]"></div>
        )}

      </div>
    </div>
  );
}