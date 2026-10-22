import { cn } from '@/lib/utils';

/** Where the brand is drawn: on the page canvas or on the graphite chrome. */
export type BrandTone = 'page' | 'chrome';

const markTone: Record<BrandTone, string> = {
  page: 'text-modified',
  chrome: 'text-chrome-modified',
};

const wordTone: Record<BrandTone, string> = {
  page: 'text-text',
  chrome: 'text-chrome-text',
};

const labelTone: Record<BrandTone, string> = {
  page: 'text-subtle',
  chrome: 'text-chrome-muted',
};

/** The ledger mark: a ruled sheet drawn in the brand brass. */
export function LogoMark({ className, tone = 'page' }: { className?: string; tone?: BrandTone }) {
  return (
    <svg
      viewBox="0 0 20 20"
      aria-hidden
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      className={cn('size-5 shrink-0', markTone[tone], className)}
    >
      <rect x="2.75" y="2.75" width="14.5" height="14.5" rx="3" />
      <path d="M6.5 7.25h7M6.5 10h7M6.5 12.75h4" />
    </svg>
  );
}

/** The mark followed by the "ComfiConf" wordmark in one color. The wordmark is the last child span. */
export function Wordmark({ className, tone = 'page' }: { className?: string; tone?: BrandTone }) {
  return (
    <span className={cn('flex items-center gap-2', className)}>
      <LogoMark tone={tone} />
      <span className={cn('text-base font-semibold', wordTone[tone])}>ComfiConf</span>
    </span>
  );
}

/** The wordmark with the site label in mono after it, as in the header. */
export function SiteMark({
  label,
  className,
  tone = 'page',
}: {
  label: string;
  className?: string;
  tone?: BrandTone;
}) {
  return (
    <span className={cn('flex items-center gap-2', className)}>
      <Wordmark tone={tone} />
      <span className={cn('font-mono text-xs font-medium', labelTone[tone])}>{label}</span>
    </span>
  );
}
