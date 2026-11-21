import type { Metadata } from 'next';
import { Doto, Martian_Mono } from 'next/font/google';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { Analytics } from '@vercel/analytics/next';
import Shell from '@/components/Shell';
import { site } from '@/lib/site';
import './globals.css';
import '@/components/reactbits/TargetCursor.css';

// The name is the first thing on screen, so it waits for its own face rather than flashing a stand-in.
const display = Doto({ subsets: ['latin'], variable: '--font-display', weight: 'variable', display: 'block' });
const mono = Martian_Mono({ subsets: ['latin'], variable: '--font-mono', weight: 'variable', axes: ['wdth'] });

export const metadata: Metadata = {
  title: { default: site.name, template: `%s, ${site.name}` },
  description: `${site.name}. ${site.line}. A portfolio you explore: five projects live inside a night scene drawn in characters.`,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const hasResume = existsSync(join(process.cwd(), 'public', site.resumeFile));
  return (
    <html lang="en" className={`${display.variable} ${mono.variable}`}>
      <body>
        <noscript>
          <style>{'.loader{display:none}'}</style>
        </noscript>
        <Shell hasResume={hasResume}>{children}</Shell>
        {/* Counts visits. In production its script and reports stay on this host, so the content policy needs no exception. */}
        <Analytics />
      </body>
    </html>
  );
}
