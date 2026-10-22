import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

/** A numbered procedure: ruled steps, numbered in mono by a CSS counter (`.ledger-steps` in global.css). */
export function Steps({ children, className }: { children: ReactNode; className?: string }) {
  return <ol className={cn('ledger-steps', className)}>{children}</ol>;
}

/** One step of `Steps`: an optional title line, then the step's content. */
export function Step({
  title,
  children,
  className,
}: {
  title?: ReactNode;
  children?: ReactNode;
  className?: string;
}) {
  return (
    <li className={cn('ledger-step', className)}>
      {title ? <p className="ledger-step-title">{title}</p> : null}
      {children ? <div className="ledger-step-body">{children}</div> : null}
    </li>
  );
}
