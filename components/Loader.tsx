'use client';

import { useEffect, useState } from 'react';
import type { CSSProperties } from 'react';
import { usePathname } from 'next/navigation';
import { hold, isRevealed, progress, reveal } from '@/lib/boot';
import { site } from '@/lib/site';

const RIBS = 18;
const CELLS = 32;
const STEP = 20; // ms for the bar to fill one more cell
const SHORTEST = 900; // ms after the page was requested: a curtain that only flashes reads as a glitch
const LONGEST = 12000; // lift anyway if something never reports back
const LIFT = 1150; // the last rib's delay plus its travel, matching the CSS

// The curtain is in the page's HTML and animated by CSS alone, so it is on screen before any
// script arrives. Once the script runs, the bar follows what is really loading.
export default function Loader() {
  const home = usePathname() === '/';
  const [phase, setPhase] = useState<'load' | 'lift' | 'gone'>('load');
  const [filled, setFilled] = useState(0);
  const [label, setLabel] = useState('Loading');

  useEffect(() => {
    if (isRevealed()) {
      setPhase('gone');
      return;
    }
    const type = hold('Setting type');
    document.fonts.ready.then(type, type);

    let raf = 0;
    let timer = 0;
    let shown = 0;
    let stepped = 0;
    let full = 0;
    let text = '';
    const tick = (now: number) => {
      raf = requestAnimationFrame(tick);
      const state = progress();
      const all = state.done === state.total || now > LONGEST;
      // The script arriving counts as the first step, so the bar moves as soon as it can.
      const target = all ? CELLS : Math.min(CELLS - 1, Math.floor(((state.done + 1) / (state.total + 1)) * CELLS));
      if (shown < target && now - stepped >= STEP) {
        shown += 1;
        stepped = now;
        setFilled(shown);
      }
      // The words keep pace with the bar: "Ready" only once it has filled.
      const next = all ? (shown === CELLS ? 'Ready' : text) : (state.label ?? text);
      if (next && next !== text) {
        text = next;
        setLabel(next);
      }
      if (!all || shown < CELLS || now < SHORTEST) return;
      full ||= now;
      if (now - full < 180) return;
      cancelAnimationFrame(raf);
      setPhase('lift');
      reveal();
      timer = window.setTimeout(() => setPhase('gone'), LIFT);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(timer);
      type();
    };
  }, []);

  if (phase === 'gone') return null;
  return (
    <div className={`loader${phase === 'lift' ? ' is-done' : ''}${home ? ' loader-home' : ''}`}>
      <div className="loader-ribs" aria-hidden="true">
        {Array.from({ length: RIBS }, (_, i) => (
          <span key={i} style={{ '--i': i } as CSSProperties} />
        ))}
      </div>
      {/* The same block, in the same place, as the name on the home page: it stays put as the curtain lifts. */}
      <div className="hero loader-hero" aria-hidden="true">
        <div className="display">{site.name}</div>
        <p>{site.line}</p>
        <p>{site.role}</p>
      </div>
      <div className="loader-foot">
        <p role="status">{label}</p>
        <div className="loader-bar" aria-hidden="true">
          <span className="loader-track">
            {Array.from({ length: CELLS }, (_, i) => (
              <i
                key={i}
                className={i < filled ? (i === filled - 1 && filled < CELLS ? 'on head' : 'on') : undefined}
                style={{ '--i': i } as CSSProperties}
              />
            ))}
          </span>
          <span className="loader-count">{String(Math.round((filled / CELLS) * 100)).padStart(3, '0')}</span>
        </div>
      </div>
    </div>
  );
}
