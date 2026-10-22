import type { ComponentProps } from 'react';
import { cn } from '@/lib/utils';

export type BadgeTone = 'neutral' | 'modified' | 'accent' | 'success' | 'warning' | 'danger';

const base =
  'inline-flex h-5 shrink-0 items-center gap-1 whitespace-nowrap rounded-xs border px-1.5 align-middle text-xs font-medium [&_svg]:size-3';

const tones: Record<BadgeTone, string> = {
  neutral: 'border-border-strong bg-transparent text-muted',
  modified: 'border-transparent bg-modified-soft text-modified-fg',
  accent: 'border-transparent bg-accent-soft text-accent-soft-fg',
  success: 'border-transparent bg-success-soft text-success-soft-fg',
  warning: 'border-transparent bg-warning-soft text-warning-soft-fg',
  danger: 'border-transparent bg-danger-soft text-danger-soft-fg',
};

/**
 * Status tags. `neutral` is the neutral outline used for facts such as "Restart required" and counts; `modified`
 * marks what changed; `danger`, `warning` and `success` carry outcomes; `accent` is the accent tint for work in
 * progress.
 */
export function Badge({
  className,
  tone = 'neutral',
  ...props
}: ComponentProps<'span'> & { tone?: BadgeTone }) {
  return <span className={cn(base, tones[tone], className)} {...props} />;
}
