import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

const chip =
  'inline-flex items-center rounded-xs border px-1.5 py-px align-baseline font-mono font-medium leading-snug whitespace-nowrap text-(length:--font-size-inline-code)';

/** A key or key combination, such as Enter or Alt+Up. */
export function Kbd({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <kbd className={cn(chip, 'border-control-border bg-surface text-text', className)}>
      {children}
    </kbd>
  );
}

/** A command to type in the server console or in game, such as `/comficonf pair`. */
export function CommandChip({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <code className={cn(chip, 'command-chip border-border-strong bg-sunken text-text', className)}>
      {children}
    </code>
  );
}
