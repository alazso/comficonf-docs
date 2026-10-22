import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

const base =
  'inline-flex h-8 shrink-0 items-center gap-1.5 rounded-sm border px-3 text-sm font-medium whitespace-nowrap transition-colors [&_svg]:size-3.5';

const variants = {
  outline: 'border-control-border bg-surface text-text hover:bg-hover',
  primary: 'border-accent bg-accent text-accent-fg hover:border-accent-hover hover:bg-accent-hover',
} as const;

/** A header link drawn as a 4px radius button. Every header link leaves this site. */
export function NavButton({
  href,
  children,
  variant = 'outline',
  className,
}: {
  href: string;
  children: ReactNode;
  variant?: keyof typeof variants;
  className?: string;
}) {
  return (
    <a href={href} className={cn(base, variants[variant], 'nav-button', className)}>
      {children}
    </a>
  );
}
