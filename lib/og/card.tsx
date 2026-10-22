import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { site } from '@/lib/shared';

/** Light canvas and text tokens of the Ledger theme, the default theme of this site. */
const tokens = {
  background: '#f3f2ee',
  text: '#1c2120',
  muted: '#444c49',
  subtle: '#5d6561',
  border: '#dedbd3',
  modified: '#b07a35',
};

export const ogSize = { width: 1200, height: 630 };

/**
 * The fonts of the card. ImageResponse reads TTF, OTF and WOFF but not WOFF2, and next/font does not apply to it, so
 * the WOFF files are read from lib/og/fonts.
 */
export async function ogFonts() {
  const dir = join(process.cwd(), 'lib', 'og', 'fonts');
  const [regular, semibold, mono] = await Promise.all([
    readFile(join(dir, 'ibm-plex-sans-latin-400-normal.woff')),
    readFile(join(dir, 'ibm-plex-sans-latin-600-normal.woff')),
    readFile(join(dir, 'ibm-plex-mono-latin-500-normal.woff')),
  ]);
  return [
    { name: 'IBM Plex Sans', data: regular, weight: 400 as const, style: 'normal' as const },
    { name: 'IBM Plex Sans', data: semibold, weight: 600 as const, style: 'normal' as const },
    { name: 'IBM Plex Mono', data: mono, weight: 500 as const, style: 'normal' as const },
  ];
}

/** The Ledger card: mark, wordmark and site label, a 1px rule, then the page title and description. */
export function OgCard({ title, description }: { title: string; description?: string }) {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: tokens.background,
        color: tokens.text,
        fontFamily: 'IBM Plex Sans',
        padding: '64px 72px',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <svg
          width="44"
          height="44"
          viewBox="0 0 20 20"
          fill="none"
          stroke={tokens.modified}
          strokeWidth="1.5"
          strokeLinecap="round"
        >
          <rect x="2.75" y="2.75" width="14.5" height="14.5" rx="3" />
          <path d="M6.5 7.25h7M6.5 10h7M6.5 12.75h4" />
        </svg>
        <div style={{ display: 'flex', fontSize: 32, fontWeight: 600 }}>{site.name}</div>
        <div
          style={{
            display: 'flex',
            fontFamily: 'IBM Plex Mono',
            fontWeight: 500,
            fontSize: 24,
            color: tokens.subtle,
          }}
        >
          {site.label}
        </div>
      </div>
      <div style={{ display: 'flex', height: 1, backgroundColor: tokens.border, marginTop: 40 }} />
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          flexGrow: 1,
          justifyContent: 'center',
          gap: 24,
        }}
      >
        <div style={{ display: 'flex', fontSize: 68, fontWeight: 600, lineHeight: 1.15 }}>
          {title}
        </div>
        {description ? (
          <div
            style={{
              display: 'flex',
              fontSize: 30,
              lineHeight: 1.45,
              color: tokens.muted,
              maxWidth: 1000,
            }}
          >
            {description}
          </div>
        ) : null}
      </div>
      <div
        style={{
          display: 'flex',
          fontFamily: 'IBM Plex Mono',
          fontWeight: 500,
          fontSize: 22,
          color: tokens.subtle,
        }}
      >
        {new URL(site.origin).host}
      </div>
    </div>
  );
}
