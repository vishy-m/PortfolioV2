'use client';

import { createContext, useCallback, useContext, useEffect, useRef } from 'react';
import type { AnchorHTMLAttributes, MouseEvent, ReactNode } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import gsap from 'gsap';

const RIBS = 18;

type Go = (href: string, x?: number) => void;
const Ctx = createContext<Go>(() => {});

const reduced = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Covers the page with ribs of fluted glass, swaps the route behind them, then lifts them.
export function TransitionProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const wrap = useRef<HTMLDivElement>(null);
  const busy = useRef(false);
  const covered = useRef(false);

  const go = useCallback<Go>(
    (href, x) => {
      if (busy.current || href === pathname) return;
      const el = wrap.current;
      if (!el || reduced()) {
        router.push(href);
        return;
      }
      busy.current = true;
      const ribs = Array.from(el.children);
      const from = x == null ? 0 : Math.round((x / window.innerWidth) * (ribs.length - 1));
      el.style.visibility = 'visible';
      gsap.fromTo(
        ribs,
        { scaleY: 0, transformOrigin: '50% 0%' },
        {
          scaleY: 1,
          duration: 0.55,
          ease: 'power3.inOut',
          stagger: { each: 0.022, from },
          onComplete: () => {
            covered.current = true;
            router.push(href);
          },
        },
      );
    },
    [pathname, router],
  );

  useEffect(() => {
    if (!covered.current || !wrap.current) return;
    covered.current = false;
    const el = wrap.current;
    window.scrollTo(0, 0);
    gsap.to(Array.from(el.children), {
      scaleY: 0,
      transformOrigin: '50% 100%',
      duration: 0.6,
      delay: 0.12,
      ease: 'power3.inOut',
      stagger: { each: 0.022, from: 'start' },
      onComplete: () => {
        el.style.visibility = 'hidden';
        busy.current = false;
      },
    });
  }, [pathname]);

  return (
    <Ctx.Provider value={go}>
      {children}
      <div className="ribs" ref={wrap} aria-hidden="true">
        {Array.from({ length: RIBS }, (_, i) => (
          <span key={i} />
        ))}
      </div>
    </Ctx.Provider>
  );
}

type TLinkProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> & { href: string };

export function TLink({ href, onClick, children, ...rest }: TLinkProps) {
  const go = useContext(Ctx);
  const click = (e: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(e);
    if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
    e.preventDefault();
    go(href, e.clientX);
  };
  return (
    <a href={href} onClick={click} {...rest}>
      {children}
    </a>
  );
}
