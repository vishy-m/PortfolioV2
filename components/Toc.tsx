'use client';

import { useEffect, useState } from 'react';

type Item = { id: string; title: string };

// The index beside a project's story. It stays put while the story scrolls, and marks the section being read.
export default function Toc({ items }: { items: Item[] }) {
  const [active, setActive] = useState<string | undefined>(items[0]?.id);

  useEffect(() => {
    const sections = items.map((i) => document.getElementById(i.id)).filter((el): el is HTMLElement => el !== null);
    const update = () => {
      // A section is current once its top passes a line a third of the way down the screen.
      const line = window.innerHeight * 0.35;
      let current: string | undefined = sections[0]?.id;
      for (const el of sections) if (el.getBoundingClientRect().top <= line) current = el.id;
      // A short last section may never reach the line, so the bottom of the page belongs to it.
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2) current = sections.at(-1)?.id;
      setActive(current);
    };
    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, [items]);

  return (
    <nav className="toc" aria-label="Sections">
      <ol>
        {items.map((item, i) => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              className={`cursor-target${active === item.id ? ' is-on' : ''}`}
              aria-current={active === item.id ? 'location' : undefined}
            >
              <span>{i + 1}.</span>
              {item.title}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
