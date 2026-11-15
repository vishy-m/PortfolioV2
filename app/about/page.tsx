import type { Metadata } from 'next';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import GlyphField from '@/components/GlyphField';
import { TLink } from '@/components/Transition';
import { projects } from '@/lib/projects';
import { site } from '@/lib/site';

export const metadata: Metadata = { title: 'About' };

export default function About() {
  const has = (f: string) => existsSync(join(process.cwd(), 'public', f));
  const contacts = [
    site.email && { label: site.email, href: `mailto:${site.email}` },
    { label: 'GitHub', href: site.github },
    site.linkedin && { label: 'LinkedIn', href: site.linkedin },
    has(site.resumeFile) && { label: 'Resume (PDF)', href: `/${site.resumeFile}` },
  ].filter(Boolean) as { label: string; href: string }[];

  return (
    <main className="page">
      <h1 className="display">About</h1>
      <div className="cols about">
        <div className="portrait">
          {has(site.portraitFile) ? (
            <GlyphField src={`/${site.portraitFile}`} className="portrait-field" cellSize={7} label={`Portrait of ${site.name}, drawn in characters`} />
          ) : (
            <GlyphField scene="halo" className="portrait-field" label="A placeholder where the portrait will go" />
          )}
        </div>
        <div className="prose">
          <p className="lede">
            I&rsquo;m {site.name.split(' ')[0]}, a computer science student at UT Austin who likes building things people can poke at.
          </p>
          <p>
            Most of what I make starts as something I wanted for myself: an assistant that knows my class schedule, a way to
            find out what a club is really like before joining, a wallpaper with fish that follow the cursor. I work across
            the stack, from native macOS apps in Swift to web apps in TypeScript and Python.
          </p>
          <p>
            I care about how software feels as much as what it does, which is why this site is a scene to wander through
            and not a list. Everything on it is drawn in characters or dithered down to two colours.
          </p>
          <ul className="plain">
            {projects.map((p) => (
              <li key={p.slug}>
                <TLink href={`/work/${p.slug}`} className="cursor-target">
                  {p.name}
                </TLink>
              </li>
            ))}
          </ul>
          <p className="links">
            {contacts.map((c) => (
              <a key={c.href} href={c.href} className="cursor-target" target="_blank" rel="noreferrer">
                {c.label}
              </a>
            ))}
          </p>
        </div>
      </div>
    </main>
  );
}
