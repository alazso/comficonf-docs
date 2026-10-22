import type { ReactNode } from 'react';
import { releaseLinks, type ReleaseLinkKey } from '@/lib/shared';

/** A link to a release location from `releaseLinks`, or its text without a link while the URL is unset. */
export function ReleaseLink({ to, children }: { to: ReleaseLinkKey; children: ReactNode }) {
  const href = releaseLinks[to];
  if (!href) return <span data-release-placeholder={to}>{children}</span>;
  return <a href={href}>{children}</a>;
}
