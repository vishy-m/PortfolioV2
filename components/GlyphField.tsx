'use client';

import { useEffect, useRef, useState } from 'react';
import { hold } from '@/lib/boot';

type Props = {
  // A picture to draw in characters, or leave it out for one of the engine's generated scenes.
  src?: string;
  scene?: string;
  label: string;
  className?: string;
  cellSize?: number;
};

export default function GlyphField({ src, scene = 'constellation', label, className = '', cellSize = 11 }: Props) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let dead = false;
    let field: { destroy: () => void } | null = null;
    const ready = hold('Cutting the characters');
    (async () => {
      try {
        await document.fonts.ready.catch(() => {});
        const { mountGlyphField, isGlyphFieldSupported, FIELD_PHOTO_CHARSET } = await import('asciify-engine/field');
        if (dead || !canvas.current) return;
        const soft = new URLSearchParams(window.location.search).has('soft');
        if (!isGlyphFieldSupported({ allowSoftware: soft })) throw new Error('no gpu');
        const font = getComputedStyle(document.body).fontFamily;
        field = src
          ? mountGlyphField(canvas.current, {
              source: src, charset: FIELD_PHOTO_CHARSET, glyphScale: 1, sample: 'shape',
              cellSize, cellAspect: 0.6, font, color: 'ink', ink: '#e9e6dc', highlight: '#ff6b1a',
              shade: 0.6, gamma: 0.7, drift: 0.2, hover: 'fluid', fluid: { radius: 0.09, refraction: 0.03, glow: 0.7 }, label,
            })
          : mountGlyphField(canvas.current, {
              scene: scene as 'constellation', charset: ' .,:;-=+*x#%@',
              cellSize, cellAspect: 0.6, font, color: 'ink', ink: '#e9e6dc', highlight: '#ff6b1a',
              shade: 0.7, speed: 0.7, hover: 'fluid', fluid: { radius: 0.08, refraction: 0.02, glow: 0.9 }, label,
            });
      } catch {
        if (!dead) setFailed(true);
      }
      ready();
    })();
    return () => {
      dead = true;
      ready();
      field?.destroy();
    };
  }, [src, scene, label, cellSize]);

  if (failed) {
    return src ? (
      // eslint-disable-next-line @next/next/no-img-element
      <img className={`glyph-field glyph-fallback ${className}`} src={src} alt={label} />
    ) : (
      <div className={`glyph-field glyph-fallback ${className}`} role="img" aria-label={label} />
    );
  }
  return <canvas ref={canvas} className={`glyph-field ${className}`} />;
}
