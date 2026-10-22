import { DocsLayout } from 'fumadocs-ui/layouts/notebook';
import { RootProvider } from 'fumadocs-ui/provider/next';
import type { Metadata, Viewport } from 'next';
import { IBM_Plex_Mono, IBM_Plex_Sans } from 'next/font/google';
import type { ReactNode } from 'react';
import { layoutOptions } from '@/lib/layout.shared';
import { site } from '@/lib/shared';
import { source } from '@/lib/source';
import './global.css';

export const metadata: Metadata = {
  metadataBase: new URL(site.origin),
  title: {
    template: `%s | ${site.title}`,
    default: site.title,
  },
  description: site.description,
  openGraph: { siteName: site.title, type: 'website' },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f3f2ee' },
    { media: '(prefers-color-scheme: dark)', color: '#131716' },
  ],
};

const sans = IBM_Plex_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-plex-sans',
});

const mono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-plex-mono',
});

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${sans.variable} ${mono.variable}`} suppressHydrationWarning>
      <body>
        <RootProvider theme={{ attribute: 'class', defaultTheme: 'light', enableSystem: true }}>
          <DocsLayout tree={source.getPageTree()} {...layoutOptions()}>
            {children}
          </DocsLayout>
        </RootProvider>
      </body>
    </html>
  );
}
