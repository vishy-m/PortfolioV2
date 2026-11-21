'use client';

import { useEffect, useRef, useState, type CSSProperties } from 'react';

const srOnly: CSSProperties = {
  position: 'absolute',
  width: '1px',
  height: '1px',
  padding: 0,
  margin: '-1px',
  overflow: 'hidden',
  clip: 'rect(0,0,0,0)',
  whiteSpace: 'nowrap',
  border: 0
};
const cell: CSSProperties = { position: 'relative', display: 'inline-block' };
// the random glyph sits over a hidden copy of the real letter so the cell keeps its width
const glyph: CSSProperties = { position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)' };

interface DecryptedTextProps {
  text: string;
  animateOn?: 'hover';
  speed?: number;
  maxIterations?: number;
  characters?: string;
}

export default function DecryptedText({ text, speed = 50, maxIterations = 10, characters = '.:-=+*#%@' }: DecryptedTextProps) {
  const [shown, setShown] = useState<string[] | null>(null);
  const timer = useRef<ReturnType<typeof setInterval>>(undefined);

  const stop = () => {
    clearInterval(timer.current);
    timer.current = undefined;
    setShown(null);
  };

  const start = () => {
    if (timer.current || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const pool = Array.from(characters);
    const scramble = () =>
      setShown(Array.from(text, c => (/\s/.test(c) ? c : pool[Math.floor(Math.random() * pool.length)])));
    let tick = 0;
    scramble();
    timer.current = setInterval(() => (++tick >= maxIterations ? stop() : scramble()), speed);
  };

  useEffect(() => () => clearInterval(timer.current), []);

  let offset = 0;
  return (
    <span style={{ display: 'inline-block', whiteSpace: 'pre-wrap' }} onMouseEnter={start} onMouseLeave={stop}>
      <span style={srOnly}>{text}</span>
      <span aria-hidden="true">
        {text.split(/(\s+)/).map((part, w) => {
          const letters = Array.from(part);
          const at = offset;
          offset += letters.length;
          if (!part || /\s/.test(part)) return part;
          return (
            <span key={w} style={{ whiteSpace: 'nowrap' }}>
              {letters.map((char, i) =>
                shown ? (
                  <span key={i} style={cell}>
                    <span style={{ visibility: 'hidden' }}>{char}</span>
                    <span style={glyph}>{shown[at + i]}</span>
                  </span>
                ) : (
                  <span key={i}>{char}</span>
                )
              )}
            </span>
          );
        })}
      </span>
    </span>
  );
}
