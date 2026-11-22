import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import FlutedImage from '@/components/FlutedImage';
import GlyphField from '@/components/GlyphField';
import Toc from '@/components/Toc';
import { TLink } from '@/components/Transition';
import { getProject, projects } from '@/lib/projects';

type Params = { params: Promise<{ slug: string }> };

export const generateStaticParams = () => projects.map((p) => ({ slug: p.slug }));
// Only the listed projects exist. Any other address is a plain 404, with nothing rendered on request.
export const dynamicParams = false;

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const p = getProject((await params).slug);
  return p ? { title: p.name, description: p.summary } : {};
}

export default async function Work({ params }: Params) {
  const { slug } = await params;
  const p = getProject(slug);
  if (!p) notFound();
  const next = projects[(projects.indexOf(p) + 1) % projects.length];
  const chapters = p.sections.map((s) => ({ ...s, id: s.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') }));

  return (
    <main className="page">
      <h1 className="display work-title">{p.name}</h1>

      {p.cover ? (
        <FlutedImage {...p.cover} />
      ) : (
        <GlyphField scene={p.scene} className="hero-field" label={`${p.figure}, drawn in characters. Move across it to stir it.`} />
      )}

      {p.links.length > 0 && (
        <p className="links">
          {p.links.map((l) => (
            <a key={l.href} href={l.href} className="cursor-target" target="_blank" rel="noreferrer">
              {l.label}
            </a>
          ))}
        </p>
      )}

      <div className="story">
        <Toc items={chapters.map(({ id, title }) => ({ id, title }))} />
        <div>
          {chapters.map((c) => (
            <section className="chapter" id={c.id} key={c.id}>
              <h2>{c.title}</h2>
              {c.body.map((part, i) =>
                typeof part === 'string' ? <p key={i}>{part}</p> : <FlutedImage key={part.src} {...part} color />,
              )}
              {c.diagram && (
                <pre className="diagram" role="img" aria-label={`Diagram: ${c.title}`}>
                  {c.diagram}
                </pre>
              )}
            </section>
          ))}
        </div>
      </div>

      <TLink href={`/work/${next.slug}`} className="next cursor-target">
        <span>Next project</span>
        <b className="display">{next.name}</b>
      </TLink>
    </main>
  );
}
