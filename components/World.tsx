'use client';

import { useEffect, useRef, useState } from 'react';
import { hold, onReveal } from '@/lib/boot';
import { projects } from '@/lib/projects';
import { TLink } from './Transition';

type Box = { x: number; y: number; w: number; h: number };
type Layout = { horizon: number; road: number; boxes: Record<string, Box> };

// Positions are fractions of the viewport, so the scene re-composes for phones.
function layoutFor(aspect: number): Layout {
  if (aspect < 0.85) {
    return {
      horizon: 0.52,
      road: 0.63,
      boxes: {
        assistant: { x: 0.42, y: 0.27, w: 0.5, h: 0.13 },
        ratemyclub: { x: 0.03, y: 0.39, w: 0.38, h: 0.13 },
        toyyo: { x: 0.42, y: 0.57, w: 0.46, h: 0.08 },
        tidepool: { x: 0.08, y: 0.77, w: 0.76, h: 0.12 },
      },
    };
  }
  return {
    horizon: 0.6,
    road: 0.72,
    boxes: {
      assistant: { x: 0.57, y: 0.13, w: 0.25, h: 0.3 },
      ratemyclub: { x: 0.34, y: 0.38, w: 0.22, h: 0.22 },
      toyyo: { x: 0.55, y: 0.635, w: 0.2, h: 0.11 },
      tidepool: { x: 0.1, y: 0.78, w: 0.34, h: 0.16 },
    },
  };
}

const INK = [233, 230, 220];
const ACC = [255, 107, 26];
const tone = (p: number, a: number) =>
  `rgba(${INK.map((v, i) => Math.round(v + (ACC[i] - v) * p)).join(',')},${a})`;

function rng(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// The second brain: a small graph of notes.
const NODES: [number, number][] = [
  [0.08, 0.55], [0.2, 0.22], [0.36, 0.42], [0.3, 0.8], [0.5, 0.12],
  [0.55, 0.62], [0.7, 0.34], [0.74, 0.86], [0.9, 0.18], [0.94, 0.6],
];
const EDGES: [number, number][] = [
  [0, 1], [0, 2], [0, 3], [1, 2], [1, 4], [2, 5], [3, 5], [4, 6],
  [5, 6], [5, 7], [6, 8], [6, 9], [7, 9], [8, 9], [2, 4],
];

type Fish = { x: number; y: number; a: number; ph: number; r: number };

export default function World() {
  const stage = useRef<HTMLDivElement>(null);
  const src = useRef<HTMLCanvasElement>(null);
  const out = useRef<HTMLCanvasElement>(null);
  const fogEl = useRef<HTMLDivElement>(null);
  const hot = useRef<string | null>(null);
  const [layout, setLayout] = useState<Layout | null>(null);
  const [active, setActive] = useState<string | null>(null);
  const [plain, setPlain] = useState(false);

  const setHot = (slug: string | null) => {
    hot.current = slug;
    setActive(slug);
  };

  useEffect(() => {
    const canvas = src.current!;
    const ctx = canvas.getContext('2d')!;
    const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let sw = 0;
    let sh = 0;
    let quiet: Box | null = null; // where the name sits; the sky stays clear behind it
    let u = 1; // source pixels per three CSS pixels, so marks keep their weight on phones
    let lay = layoutFor(1.6);
    let raf = 0;
    let dead = false;
    let field: { redraw: () => void; destroy: () => void } | null = null;
    let fog: ReturnType<typeof import('vanta/dist/vanta.fog.min').default> | null = null;
    const ease: Record<string, number> = {};
    const pointer = { x: -1, y: -1 };
    const fish: Fish[] = Array.from({ length: 5 }, (_, i) => ({
      x: 0, y: 0, a: 0, ph: (i / 5) * Math.PI * 2, r: 0.35 + (i % 3) * 0.2,
    }));
    const starRand = rng(7);
    const stars = Array.from({ length: 150 }, () => ({
      x: starRand(), y: starRand(), s: 0.4 + starRand() * 1.6, ph: starRand() * 6.28, b: 0.25 + starRand() * 0.6,
    }));
    // The figures resolve out of static once the loading curtain starts to lift, not before.
    let start = Infinity;
    const shown = onReveal(() => {
      start = performance.now();
    });
    const holds = {
      fog: hold('Rolling in the fog'),
      glyphs: hold('Cutting the characters'),
      scene: hold('Drawing the scene'),
    };
    let frames = 0;

    const size = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      sw = Math.min(640, Math.max(200, Math.round(w / 3)));
      sh = Math.round((sw * h) / w);
      u = (sw / w) * 3;
      canvas.width = sw;
      canvas.height = sh;
      lay = layoutFor(w / h);
      setLayout(lay);
      for (const f of fish) { f.x = 0; f.y = 0; }
      const hr = document.querySelector('.hero')?.getBoundingClientRect();
      quiet = hr ? { x: (hr.left / w) * sw, y: (hr.top / h) * sh, w: (hr.width / w) * sw, h: (hr.height / h) * sh } : null;
    };
    size();
    window.addEventListener('resize', size);

    const move = (e: PointerEvent) => {
      pointer.x = (e.clientX / window.innerWidth) * sw;
      pointer.y = (e.clientY / window.innerHeight) * sh;
    };
    window.addEventListener('pointermove', move, { passive: true });

    const px = (b: Box) => ({ x: b.x * sw, y: b.y * sh, w: b.w * sw, h: b.h * sh });

    // Static eats into a figure until you point at it.
    const noise = (b: Box, amount: number, seed: number) => {
      if (amount <= 0.01) return;
      const r = rng(seed);
      const q = px(b);
      const n = ((q.w * q.h) / 4) * 0.5 * amount;
      ctx.fillStyle = '#000';
      for (let i = 0; i < n; i++) ctx.fillRect(q.x + r() * q.w, q.y + r() * q.h, 2, 2);
    };

    const drawSky = (t: number, hy: number) => {
      if (fog) {
        try {
          fog.renderer.render(fog.scene, fog.camera);
          // Multiplying the fog by itself keeps the cloud cores and drops the haze between them.
          ctx.drawImage(fog.renderer.domElement, 0, 0, sw, hy);
          ctx.globalCompositeOperation = 'multiply';
          ctx.drawImage(fog.renderer.domElement, 0, 0, sw, hy);
          ctx.globalCompositeOperation = 'source-over';
          ctx.fillStyle = 'rgba(0,0,0,0.6)';
          ctx.fillRect(0, 0, sw, hy);
        } catch {
          fog = null;
        }
      }
      const g = ctx.createLinearGradient(0, hy * 0.35, 0, hy);
      g.addColorStop(0, 'rgba(0,0,0,0)');
      g.addColorStop(1, 'rgba(0,0,0,1)');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, sw, hy);
      if (quiet) {
        const pad = 14 * u;
        ctx.filter = `blur(${6 * u}px)`;
        ctx.fillStyle = '#000';
        ctx.fillRect(quiet.x - pad, quiet.y - pad, quiet.w + pad * 2, quiet.h + pad * 2);
        ctx.filter = 'none';
      }
      for (const s of stars) {
        const a = s.b * (0.55 + 0.45 * Math.sin(t * s.s + s.ph));
        ctx.fillStyle = tone(0, a);
        ctx.fillRect(s.x * sw, s.y * hy * 0.92, 2 * u, 2.6 * u);
      }
    };

    const drawGround = (t: number, hy: number, ry: number, speed: number) => {
      // Hills, then a low skyline behind the longhorn.
      ctx.beginPath();
      ctx.moveTo(0, hy);
      for (let x = 0; x <= sw; x += 4) {
        const u = x / sw;
        ctx.lineTo(x, hy - (Math.sin(u * 5.1 + 1) * 0.5 + Math.sin(u * 13.7) * 0.25 + 0.75) * sh * 0.035);
      }
      ctx.lineTo(sw, hy);
      ctx.closePath();
      ctx.fillStyle = tone(0, 0.2);
      ctx.fill();
      const r = rng(31);
      for (let i = 0; i < 16; i++) {
        const bw = (0.012 + r() * 0.02) * sw;
        const bh = (0.02 + r() * 0.07) * sh;
        ctx.fillStyle = tone(0, 0.1 + r() * 0.14);
        ctx.fillRect(r() * sw, hy - bh, bw, bh);
      }
      ctx.fillStyle = tone(0, 0.5);
      ctx.fillRect(0, hy, sw, 1);
      // Road: two edges and a centre line that runs under the car.
      ctx.fillStyle = tone(0, 0.28);
      ctx.fillRect(0, ry + sh * 0.03, sw, 1);
      const dash = sw * 0.035;
      const off = (t * speed * dash * 2) % (dash * 2);
      ctx.fillStyle = tone(0, 0.4);
      for (let x = -off; x < sw; x += dash * 2) ctx.fillRect(x, ry + sh * 0.055, dash, 1.5);
    };

    // Bevo: a longhorn standing side-on with its head turned to face you.
    const drawSteer = (b: Box, t: number, p: number) => {
      const q = px(b);
      const X = (f: number) => q.x + q.w * f;
      const Y = (f: number) => q.y + q.h * f;
      const poly = (pts: number[][]) => {
        ctx.beginPath();
        pts.forEach(([x, y], i) => (i ? ctx.lineTo(X(x), Y(y)) : ctx.moveTo(X(x), Y(y))));
        ctx.closePath();
        ctx.fill();
      };
      ctx.fillStyle = tone(p, 0.82 + p * 0.18);
      // Tail first: it hangs off the rump and swings a little.
      const swing = Math.sin(t * 1.6) * 0.02;
      poly([[0.91, 0.42], [0.96, 0.44], [0.985 + swing, 0.76], [1 + swing, 0.9], [0.95 + swing, 0.9], [0.95 + swing * 0.6, 0.74]]);
      // Body, hump to hooves.
      poly([
        [0.34, 0.44], [0.45, 0.37], [0.62, 0.41], [0.85, 0.39], [0.94, 0.46], [0.94, 0.64],
        [0.93, 1], [0.865, 1], [0.86, 0.76], [0.81, 0.74], [0.8, 1], [0.74, 1], [0.73, 0.74],
        [0.56, 0.77], [0.55, 1], [0.49, 1], [0.48, 0.79], [0.44, 0.79], [0.43, 1], [0.37, 1], [0.36, 0.77],
        [0.32, 0.66],
      ]);
      // Head, facing out: broad at the brow and narrowing to the muzzle.
      // A dark edge keeps the face apart from the shoulder behind it.
      const hx = 0.27;
      const head = [
        [hx - 0.08, 0.12], [hx + 0.08, 0.12], [hx + 0.075, 0.38], [hx + 0.05, 0.6],
        [hx - 0.05, 0.6], [hx - 0.075, 0.38],
      ];
      ctx.strokeStyle = '#000';
      ctx.lineWidth = q.w * 0.035;
      poly(head);
      ctx.stroke();
      poly(head);
      for (const d of [-1, 1]) {
        // Horns run out level, then turn up at the tips.
        ctx.beginPath();
        ctx.moveTo(X(hx + d * 0.06), Y(0.1));
        ctx.quadraticCurveTo(X(hx + d * 0.22), Y(0.12), X(hx + d * 0.27), Y(0));
        ctx.quadraticCurveTo(X(hx + d * 0.27), Y(0.27), X(hx + d * 0.06), Y(0.23));
        ctx.closePath();
        ctx.fill();
        // Ears hang just under them.
        poly([[hx + d * 0.075, 0.27], [hx + d * 0.14, 0.31], [hx + d * 0.075, 0.35]]);
      }
      ctx.fillStyle = '#000';
      for (const d of [-1, 1]) ctx.fillRect(X(hx + d * 0.04) - q.w * 0.011, Y(0.27), q.w * 0.022, q.h * 0.05);
    };

    const drawCar = (b: Box, t: number, p: number) => {
      const q = px(b);
      const bob = Math.sin(t * 7) * q.h * 0.012;
      const X = (f: number) => q.x + q.w * f;
      const Y = (f: number) => q.y + q.h * f + bob;
      // Headlight beam first, so the body sits over it.
      const beam = ctx.createLinearGradient(X(0.98), 0, X(1.7), 0);
      beam.addColorStop(0, tone(p, 0.42));
      beam.addColorStop(1, tone(p, 0));
      ctx.fillStyle = beam;
      ctx.beginPath();
      ctx.moveTo(X(0.98), Y(0.56));
      ctx.lineTo(X(1.7), Y(0.3));
      ctx.lineTo(X(1.7), Y(0.98));
      ctx.fill();
      ctx.fillStyle = tone(p, 0.86 + p * 0.14);
      ctx.beginPath();
      ctx.moveTo(X(0.02), Y(0.78));
      ctx.lineTo(X(0.03), Y(0.5));
      ctx.lineTo(X(0.2), Y(0.42));
      ctx.lineTo(X(0.36), Y(0.08));
      ctx.lineTo(X(0.64), Y(0.08));
      ctx.lineTo(X(0.8), Y(0.44));
      ctx.lineTo(X(0.97), Y(0.52));
      ctx.lineTo(X(1), Y(0.78));
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = '#000';
      ctx.beginPath();
      ctx.moveTo(X(0.28), Y(0.42));
      ctx.lineTo(X(0.39), Y(0.17));
      ctx.lineTo(X(0.49), Y(0.17));
      ctx.lineTo(X(0.49), Y(0.42));
      ctx.closePath();
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(X(0.53), Y(0.42));
      ctx.lineTo(X(0.53), Y(0.17));
      ctx.lineTo(X(0.62), Y(0.17));
      ctx.lineTo(X(0.73), Y(0.42));
      ctx.closePath();
      ctx.fill();
      for (const wx of [0.22, 0.78]) {
        ctx.fillStyle = '#000';
        ctx.beginPath();
        ctx.arc(X(wx), q.y + q.h * 0.78, q.h * 0.27, 0, 6.3);
        ctx.fill();
        ctx.fillStyle = tone(p, 0.85);
        ctx.beginPath();
        ctx.arc(X(wx), q.y + q.h * 0.78, q.h * 0.2, 0, 6.3);
        ctx.fill();
        ctx.fillStyle = '#000';
        ctx.beginPath();
        ctx.arc(X(wx), q.y + q.h * 0.78, q.h * 0.08, 0, 6.3);
        ctx.fill();
      }
    };

    const drawPond = (b: Box, t: number, p: number, dt: number) => {
      const q = px(b);
      const cx = q.x + q.w / 2;
      const cy = q.y + q.h / 2;
      const rx = q.w / 2;
      const ry = q.h / 2;
      ctx.fillStyle = tone(p, 0.2 + p * 0.06);
      ctx.beginPath();
      ctx.ellipse(cx, cy, rx, ry, 0, 0, 6.3);
      ctx.fill();
      ctx.lineWidth = 1.4 * u;
      ctx.strokeStyle = tone(p, 0.55 + p * 0.35);
      ctx.stroke();
      for (let i = 0; i < 3; i++) {
        const k = (t * 0.16 + i / 3) % 1;
        ctx.strokeStyle = tone(p, (1 - k) * 0.3);
        ctx.beginPath();
        ctx.ellipse(cx - rx * 0.3, cy + ry * 0.1, rx * 0.5 * k, ry * 0.5 * k, 0, 0, 6.3);
        ctx.stroke();
      }
      ctx.fillStyle = tone(p, 0.4);
      for (const [lx, ly] of [[0.55, -0.35], [0.7, 0.15], [-0.7, -0.1]]) {
        ctx.beginPath();
        ctx.ellipse(cx + rx * lx, cy + ry * ly, rx * 0.06, ry * 0.11, 0, 0.5, 6);
        ctx.fill();
      }
      // Koi circle the pond and turn toward the pointer when it is over the water.
      const inside = ((pointer.x - cx) / rx) ** 2 + ((pointer.y - cy) / ry) ** 2 < 1.2;
      const len = Math.max(5, rx * 0.11);
      for (const f of fish) {
        const ang = t * 0.5 * (f.r > 0.5 ? 1 : -1) + f.ph;
        let tx = cx + Math.cos(ang) * rx * f.r * 0.9;
        let ty = cy + Math.sin(ang) * ry * f.r * 0.9;
        if (inside) {
          tx = pointer.x + Math.cos(f.ph + t) * len;
          ty = pointer.y + Math.sin(f.ph + t) * len * 0.5;
        }
        if (!f.x) { f.x = tx; f.y = ty; }
        const k = Math.min(1, dt * (inside ? 1.6 : 3));
        const nx = f.x + (tx - f.x) * k;
        const ny = f.y + (ty - f.y) * k;
        if (Math.hypot(nx - f.x, ny - f.y) > 0.02) f.a = Math.atan2(ny - f.y, nx - f.x);
        f.x = nx;
        f.y = ny;
        ctx.save();
        ctx.translate(f.x, f.y);
        ctx.rotate(f.a);
        ctx.fillStyle = tone(p, 0.95);
        ctx.beginPath();
        ctx.ellipse(0, 0, len * 0.5, len * 0.2, 0, 0, 6.3);
        ctx.fill();
        const wag = Math.sin(t * 6 + f.ph) * len * 0.12;
        ctx.beginPath();
        ctx.moveTo(-len * 0.4, 0);
        ctx.lineTo(-len * 0.85, -len * 0.22 + wag);
        ctx.lineTo(-len * 0.85, len * 0.22 + wag);
        ctx.fill();
        ctx.restore();
      }
    };

    const drawGraph = (b: Box, t: number, p: number) => {
      const q = px(b);
      const P = (i: number) => [q.x + NODES[i][0] * q.w, q.y + NODES[i][1] * q.h] as const;
      ctx.lineWidth = 1.5 * u;
      ctx.strokeStyle = tone(p, 0.46 + p * 0.45);
      EDGES.forEach(([a, c], i) => {
        const [x0, y0] = P(a);
        const [x1, y1] = P(c);
        ctx.beginPath();
        ctx.moveTo(x0, y0);
        ctx.lineTo(x1, y1);
        ctx.stroke();
        // A thought travels each link once the graph is awake.
        if (p > 0.05) {
          const k = (t * 0.5 + i * 0.37) % 1;
          ctx.fillStyle = tone(p, p);
          ctx.fillRect(x0 + (x1 - x0) * k - 1.5 * u, y0 + (y1 - y0) * k - 1.5 * u, 3 * u, 3 * u);
        }
      });
      NODES.forEach((_, i) => {
        const [x, y] = P(i);
        const r = (3.1 + (i % 3) * 0.9 + Math.sin(t * 1.3 + i) * 0.5 + p) * u;
        ctx.fillStyle = tone(p, 0.85 + p * 0.15);
        ctx.beginPath();
        ctx.arc(x, y, r, 0, 6.3);
        ctx.fill();
      });
    };

    let last = performance.now();
    const frame = (now: number) => {
      if (dead) return;
      raf = requestAnimationFrame(frame);
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const t = still ? 12 : now / 1000;
      const intro = still ? 1 : Math.max(0, Math.min(1, (now - start) / 1800));
      const tick = still ? 3 : Math.floor(now / 110);
      const hy = lay.horizon * sh;
      for (const pr of projects) {
        const target = hot.current === pr.slug ? 1 : 0;
        ease[pr.slug] = (ease[pr.slug] ?? 0) + (target - (ease[pr.slug] ?? 0)) * Math.min(1, dt * 9);
      }
      const p = (s: string) => ease[s] ?? 0;
      const static_ = (s: string) => (1 - p(s)) * 0.42 + (1 - intro) * 1.6;

      ctx.fillStyle = '#000';
      ctx.fillRect(0, 0, sw, sh);
      drawSky(t, hy);
      drawGraph(lay.boxes.assistant, t, p('assistant'));
      noise(lay.boxes.assistant, static_('assistant') * 0.5, tick + 1);
      drawGround(t, hy, lay.road * sh, 0.6 + p('toyyo') * 2.4);
      drawSteer(lay.boxes.ratemyclub, t, p('ratemyclub'));
      noise(lay.boxes.ratemyclub, static_('ratemyclub'), tick + 2);
      drawCar(lay.boxes.toyyo, t, p('toyyo'));
      noise(lay.boxes.toyyo, static_('toyyo'), tick + 3);
      drawPond(lay.boxes.tidepool, t, p('tidepool'), dt);
      noise(lay.boxes.tidepool, static_('tidepool') * 0.6, tick + 4);
      field?.redraw();
      // Two frames in, the scene is really on the glass.
      if (++frames === 2) holds.scene();
    };

    (async () => {
      // Both downloads start at once; only the mounting waits for the typeface.
      const weather =
        !still && fogEl.current
          ? Promise.all([import('three'), import('vanta/dist/vanta.fog.min')]).catch(() => null)
          : Promise.resolve(null);
      const engine = import('asciify-engine/field').catch(() => null);
      await document.fonts.ready.catch(() => {});
      // Vanta's fog is the weather: it renders off to the side and the scene samples it.
      const mods = await weather;
      if (dead) return;
      if (mods && fogEl.current) {
        try {
          const [THREE, FOG] = mods;
          fog = FOG.default({
            el: fogEl.current, THREE, mouseControls: true, touchControls: true, gyroControls: false,
            minHeight: 100, minWidth: 100, scale: 4, scaleMobile: 4,
            highlightColor: 0xffffff, midtoneColor: 0x8a8a8a, lowlightColor: 0x1c1c1c, baseColor: 0x000000,
            blurFactor: 0.55, speed: 1.4, zoom: 0.7,
          });
        } catch {
          fog = null;
        }
      }
      holds.fog();
      const mod = await engine;
      if (dead) return;
      try {
        if (!mod) throw new Error('no engine');
        const { mountGlyphField, isGlyphFieldSupported } = mod;
        const soft = new URLSearchParams(window.location.search).has('soft');
        if (!isGlyphFieldSupported({ allowSoftware: soft })) throw new Error('no gpu');
        const small = window.innerWidth < 700;
        field = mountGlyphField(out.current!, {
          source: canvas,
          live: true,
          charset: '  .,:;-=+*x#%@',
          cellSize: small ? 10 : 13,
          cellAspect: 0.6,
          font: getComputedStyle(document.body).fontFamily,
          fontWeight: 500,
          color: 'source',
          levels: 'none',
          shade: 0,
          background: 'transparent',
          hover: 'fluid',
          fluid: { radius: 0.06, refraction: 0.018, glow: 0.7 },
          tap: 'ring',
          label:
            'A night scene drawn in characters: a constellation, a longhorn, a car on a road and a koi pond. Each one opens a project.',
        });
      } catch {
        setPlain(true);
      }
      holds.glyphs();
      raf = requestAnimationFrame(frame);
    })();

    return () => {
      dead = true;
      cancelAnimationFrame(raf);
      shown();
      Object.values(holds).forEach((release) => release());
      window.removeEventListener('resize', size);
      window.removeEventListener('pointermove', move);
      field?.destroy();
      try { fog?.destroy(); } catch {}
    };
  }, []);

  return (
    <div className="world" ref={stage}>
      <div className="world-fog" ref={fogEl} aria-hidden="true" />
      <canvas ref={src} className={plain ? 'world-canvas world-plain' : 'world-src'} aria-hidden="true" />
      {!plain && <canvas ref={out} className="world-canvas" />}
      {layout &&
        projects.map((pr) => {
          const b = layout.boxes[pr.slug];
          return (
            <TLink
              key={pr.slug}
              href={`/work/${pr.slug}`}
              className={`hot hot-${pr.slug} cursor-target${active === pr.slug ? ' is-on' : ''}`}
              style={{ left: `${b.x * 100}%`, top: `${b.y * 100}%`, width: `${b.w * 100}%`, height: `${b.h * 100}%` }}
              onPointerEnter={() => setHot(pr.slug)}
              onPointerLeave={() => setHot(null)}
              onFocus={() => setHot(pr.slug)}
              onBlur={() => setHot(null)}
            >
              <span className="hot-label">
                <b>{pr.name}</b>
                <i>{pr.figure}</i>
              </span>
            </TLink>
          );
        })}
      <nav className="index" aria-label="Projects">
        <ul>
          {projects.map((pr) => (
            <li key={pr.slug}>
              <TLink
                href={`/work/${pr.slug}`}
                className={`cursor-target${active === pr.slug ? ' is-on' : ''}`}
                onPointerEnter={() => setHot(pr.slug)}
                onPointerLeave={() => setHot(null)}
                onFocus={() => setHot(pr.slug)}
                onBlur={() => setHot(null)}
              >
                <b>{pr.name}</b>
              </TLink>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
