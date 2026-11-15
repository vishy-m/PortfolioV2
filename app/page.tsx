import World from '@/components/World';
import { site } from '@/lib/site';

export default function Home() {
  return (
    <main className="home">
      <World />
      <div className="hero">
        <h1 className="display">{site.name}</h1>
        <p>{site.line}</p>
        <p>{site.role}</p>
      </div>
    </main>
  );
}
