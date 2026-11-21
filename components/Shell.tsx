'use client';

import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import Lenis from 'lenis';
import { TLink, TransitionProvider } from './Transition';
import TargetCursor from './reactbits/TargetCursor';
import DecryptedText from './reactbits/DecryptedText';
import Loader from './Loader';
import { site } from '@/lib/site';

function SmoothScroll() {
  const pathname = usePathname();
  useEffect(() => {
    if (pathname === '/' || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const lenis = new Lenis({ autoRaf: true, lerp: 0.11 });
    return () => lenis.destroy();
  }, [pathname]);
  return null;
}

function Cursor() {
  const [fine, setFine] = useState(false);
  useEffect(() => setFine(window.matchMedia('(hover: hover) and (pointer: fine)').matches), []);
  if (!fine) return null;
  return (
    <TargetCursor
      targetSelector=".cursor-target"
      cursorColor="#e9e6dc"
      cursorColorOnTarget="#ff6b1a"
      blendMode="normal"
      showLabel={false}
      spinDuration={6}
      size={26}
      cornerSize={9}
      thickness={2}
      padding={5}
      matchRadius={false}
    />
  );
}

const scramble = { animateOn: 'hover' as const, speed: 28, maxIterations: 8, characters: '.:-=+*#%@/\\<>' };

export default function Shell({ children, hasResume }: { children: ReactNode; hasResume: boolean }) {
  const pathname = usePathname();
  const home = pathname === '/';
  return (
    <TransitionProvider>
      <Loader />
      <SmoothScroll />
      <Cursor />
      <header className={`top${home ? ' top-home' : ''}`}>
        {home ? (
          <span />
        ) : (
          <TLink href="/" className="top-name cursor-target">
            <DecryptedText text="Back to the scene" {...scramble} />
          </TLink>
        )}
        <nav aria-label="Site">
          <TLink href="/about" className="cursor-target" aria-current={pathname === '/about' ? 'page' : undefined}>
            <DecryptedText text="About" {...scramble} />
          </TLink>
          {hasResume && (
            <a href={`/${site.resumeFile}`} className="cursor-target" target="_blank" rel="noreferrer">
              <DecryptedText text="Resume" {...scramble} />
            </a>
          )}
          {site.github && (
            <a href={site.github} className="cursor-target" target="_blank" rel="noreferrer">
              <DecryptedText text="GitHub" {...scramble} />
            </a>
          )}
        </nav>
      </header>
      {children}
    </TransitionProvider>
  );
}
