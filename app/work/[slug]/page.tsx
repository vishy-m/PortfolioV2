import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import FlutedImage from '@/components/FlutedImage';
import GlyphField from '@/components/GlyphField';
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
  const [lead, ...rest] = p.images;

  return (
    <main className="page">
      <h1 className="display">{p.name}</h1>
      <p className="lede">{p.summary}</p>

      {lead ? (
        <FlutedImage {...lead} />
      ) : (
        <GlyphField scene={p.scene} className="hero-field" label={`${p.figure}, drawn in characters. Move across it to stir it.`} />
      )}

      <div className="cols">
        <dl className="facts">
          {p.facts.map((f) => (
            <div key={f.k}>
              <dt>{f.k}</dt>
              <dd className={f.hot ? 'key' : undefined}>{f.v}</dd>
            </div>
          ))}
        </dl>
        <div className="prose">
          {p.body.map((t) => (
            <p key={t.slice(0, 24)}>{t}</p>
          ))}
          <p className="links">
            {p.links.map((l) => (
              <a key={l.href} href={l.href} className="cursor-target" target="_blank" rel="noreferrer">
                {l.label}
              </a>
            ))}
          </p>
        </div>
      </div>

      <div className="sections">
        {p.sections.map((sec, i) => (
          <section className="cols sect" key={sec.title}>
            <h2>
              <span>{String(i + 1).padStart(2, '0')}</span>
              {sec.title}
            </h2>
            <div className="prose">
              {sec.body.map((t) => (
                <p key={t.slice(0, 24)}>{t}</p>
              ))}
              {sec.diagram && (
                <pre className="diagram" role="img" aria-label={`Diagram: ${sec.title}`}>
                  {sec.diagram}
                </pre>
              )}
            </div>
          </section>
        ))}
      </div>

      {rest.length > 0 && (
        <div className="gallery">
          {rest.map((img) => (
            <FlutedImage key={img.src} {...img} color />
          ))}
        </div>
      )}

      <TLink href={`/work/${next.slug}`} className="next cursor-target">
        <span>Next project</span>
        <b className="display">{next.name}</b>
      </TLink>
    </main>
  );
}
