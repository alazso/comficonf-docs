import { gitConfig } from '@/lib/shared';

const sha = process.env.BUILD_SHA || 'local';
const builtAt = process.env.BUILD_DATE || '';

/** `2026-10-21T18:04:09Z` as `2026-10-21 18:04 UTC`. */
function formatBuildDate(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return `${date.toISOString().slice(0, 16).replace('T', ' ')} UTC`;
}

/** The commit and time of the build that produced this page, fixed at build time. */
export function BuildStamp() {
  const local = sha === 'local';
  const commitUrl = `https://github.com/${gitConfig.user}/${gitConfig.repo}/commit/${sha}`;
  return (
    <p className="build-stamp">
      Built from{' '}
      {local ? (
        <span className="font-mono">local</span>
      ) : (
        <a href={commitUrl} className="font-mono">
          {sha.slice(0, 7)}
        </a>
      )}{' '}
      on <time dateTime={builtAt}>{formatBuildDate(builtAt)}</time>
    </p>
  );
}

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <BuildStamp />
    </footer>
  );
}
