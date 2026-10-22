import { DocsPage } from 'fumadocs-ui/layouts/notebook/page';
import type { Metadata } from 'next';
import Link from 'next/link';
import { NavButton } from '@/components/nav-button';
import { SiteFooter } from '@/components/site-footer';
import { appUrl } from '@/lib/shared';

export const metadata: Metadata = {
  title: 'Page not found',
};

export default function NotFound() {
  return (
    <DocsPage breadcrumb={{ enabled: false }} footer={{ children: <SiteFooter /> }}>
      <div className="not-found flex flex-col gap-3 py-12">
        <p className="font-mono text-xs text-subtle">404</p>
        <h1 className="text-2xl font-semibold text-text">Page not found</h1>
        <p className="max-w-prose text-(length:--font-size-body) leading-(--line-height-body) text-muted">
          This page does not exist or has moved. Search the documentation, or start again from the
          home page.
        </p>
        <div className="mt-2 flex flex-wrap gap-2">
          <Link
            href="/"
            className="nav-button inline-flex h-8 items-center rounded-sm border border-accent bg-accent px-3 text-sm font-medium text-accent-fg transition-colors hover:border-accent-hover hover:bg-accent-hover"
          >
            Documentation home
          </Link>
          <NavButton href={appUrl}>Open ComfiConf</NavButton>
        </div>
      </div>
    </DocsPage>
  );
}
