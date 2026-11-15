'use client';

import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import type { PointerEvent } from 'react';
import gsap from 'gsap';

const RIBS = 26;
const SQUEEZE = 0.42;
// A pane wider than this is a big picture on the page, so it starts dithered even if colour was asked for.
const COLOR_MAX_WIDTH = 640;

// Atkinson dither to two colours: ink on ground, nothing in between.
function dither(img: HTMLImageElement, width: number) {
  const w = Math.min(width, img.naturalWidth);
  const h = Math.round((w * img.naturalHeight) / img.naturalWidth);
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  const ctx = c.getContext('2d')!;
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, w, h);
  ctx.drawImage(img, 0, 0, w, h);
  const data = ctx.getImageData(0, 0, w, h);
  const d = data.data;
  const lum = new Float32Array(w * h);
  const hist = new Uint32Array(256);
  let lo = 255;
  let hi = 0;
  for (let i = 0; i < w * h; i++) {
    const v = 0.299 * d[i * 4] + 0.587 * d[i * 4 + 1] + 0.114 * d[i * 4 + 2];
    lum[i] = v;
    hist[Math.round(v)]++;
    if (v < lo) lo = v;
    if (v > hi) hi = v;
  }
  // A flat dark background, such as an app window in dark mode, should fall to solid ground and
  // not to a field of speckle. If one dark level covers much of the picture, treat it as black.
  let mode = 0;
  for (let k = 1; k < 96; k++) if (hist[k] > hist[mode]) mode = k;
  if (hist[mode] > w * h * 0.06) lo = Math.max(lo, Math.min(mode + 6, hi - 1));
  const span = Math.max(1, hi - lo);
  // Lift the midtones a little: most of these pictures are dark screens.
  for (let i = 0; i < w * h; i++) lum[i] = Math.pow(Math.max(0, (lum[i] - lo) / span), 0.72) * 255;
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const i = y * w + x;
      const on = lum[i] > 110;
      const err = (lum[i] - (on ? 255 : 0)) / 8;
      if (x + 1 < w) lum[i + 1] += err;
      if (x + 2 < w) lum[i + 2] += err;
      if (y + 1 < h) {
        if (x > 0) lum[i + w - 1] += err;
        lum[i + w] += err;
        if (x + 1 < w) lum[i + w + 1] += err;
      }
      if (y + 2 < h) lum[i + 2 * w] += err;
      d[i * 4] = on ? 233 : 0;
      d[i * 4 + 1] = on ? 230 : 0;
      d[i * 4 + 2] = on ? 220 : 0;
      d[i * 4 + 3] = 255;
    }
  }
  ctx.putImageData(data, 0, 0);
  return c.toDataURL('image/png');
}

// `color` starts a small pane on the full-colour picture; the toggle still switches to the dither.
type Props = { src: string; alt: string; w: number; h: number; color?: boolean };

// A 1-bit picture behind reeded glass. Each rib squeezes its slice of the picture, as real
// fluted glass does; pointing at the pane relaxes the ribs so the picture comes clear.
export default function FlutedImage({ src, alt, w, h, color = false }: Props) {
  const pane = useRef<HTMLDivElement>(null);
  const [bitmap, setBitmap] = useState<string | null>(null);
  const [original, setOriginal] = useState(color);

  useLayoutEffect(() => {
    if (color && pane.current && pane.current.offsetWidth > COLOR_MAX_WIDTH) setOriginal(false);
  }, [color]);

  useEffect(() => {
    let off = false;
    const img = new Image();
    img.onload = () => {
      if (!off) setBitmap(dither(img, 720));
    };
    img.src = src;
    return () => {
      off = true;
    };
  }, [src]);

  const clear = (on: boolean, e?: PointerEvent) => {
    const el = pane.current;
    if (!el) return;
    const slices = el.querySelectorAll('.rib-slice');
    const rect = el.getBoundingClientRect();
    const from = e ? Math.max(0, Math.min(RIBS - 1, Math.floor(((e.clientX - rect.left) / rect.width) * RIBS))) : 'center';
    const quick = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    gsap.to(slices, {
      scaleX: on ? 1 : SQUEEZE,
      duration: quick ? 0 : on ? 0.5 : 0.7,
      ease: 'power3.out',
      stagger: quick ? 0 : { each: 0.014, from },
      overwrite: true,
    });
    el.classList.toggle('is-clear', on);
  };

  const shown = original ? src : bitmap;

  return (
    <figure className="fluted">
      <div
        className="fluted-pane cursor-target"
        ref={pane}
        style={{ aspectRatio: `${w} / ${h}` }}
        role="img"
        aria-label={alt}
        tabIndex={0}
        onPointerEnter={(e) => clear(true, e)}
        onPointerLeave={(e) => clear(false, e)}
        onFocus={() => clear(true)}
        onBlur={() => clear(false)}
      >
        {shown &&
          Array.from({ length: RIBS }, (_, i) => (
            <span className="rib" key={i} style={{ left: `${(i / RIBS) * 100}%`, width: `${100 / RIBS + 0.05}%` }}>
              <span
                className="rib-slice"
                style={{
                  width: `${RIBS * 100}%`,
                  left: `${-i * 100}%`,
                  backgroundImage: `url(${shown})`,
                  transformOrigin: `${((i + 0.5) / RIBS) * 100}% 50%`,
                  transform: `scaleX(${SQUEEZE})`,
                  imageRendering: original ? 'auto' : 'pixelated',
                }}
              />
            </span>
          ))}
      </div>
      <figcaption>
        <span>{alt}</span>
        <button type="button" className="cursor-target" aria-pressed={original} onClick={() => setOriginal((v) => !v)}>
          {original ? 'Show dithered' : 'Show original'}
        </button>
      </figcaption>
    </figure>
  );
}
