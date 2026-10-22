import { CircleAlert, CircleCheck, Info, TriangleAlert } from 'lucide-react';
import type { ComponentProps, ReactNode } from 'react';
import { cn } from '@/lib/utils';

export type CalloutTone = 'info' | 'success' | 'warning' | 'danger' | 'neutral';

const base = 'flex gap-2.5 rounded-md border px-3.5 py-3 text-sm text-text';

const tones: Record<CalloutTone, string> = {
  info: 'border-accent/40 bg-accent-soft [--callout-fg:var(--color-accent-soft-fg)]',
  success: 'border-success/40 bg-success-soft [--callout-fg:var(--color-success-soft-fg)]',
  warning: 'border-warning/40 bg-warning-soft [--callout-fg:var(--color-warning-soft-fg)]',
  danger: 'border-danger/40 bg-danger-soft [--callout-fg:var(--color-danger-soft-fg)]',
  neutral: 'border-border bg-sunken [--callout-fg:var(--color-muted)]',
};

const icons = {
  info: Info,
  success: CircleCheck,
  warning: TriangleAlert,
  danger: CircleAlert,
  neutral: Info,
} as const;

export interface CalloutProps extends Omit<ComponentProps<'div'>, 'title'> {
  tone?: CalloutTone | null;
  title?: ReactNode;
  icon?: ReactNode;
  actions?: ReactNode;
}

/**
 * Inline message block: a tinted panel with a 1px tone border, the tone icon and title in the tone's text color,
 * and body text in the regular text color. Pass role="alert" for messages that must be announced immediately.
 */
export function Callout({
  tone = 'info',
  title,
  icon,
  actions,
  children,
  className,
  ...props
}: CalloutProps) {
  const Icon = icons[tone ?? 'info'];
  return (
    <div className={cn(base, tones[tone ?? 'info'], className)} {...props}>
      <div className="mt-0.5 shrink-0 text-(--callout-fg) [&_svg]:size-4">
        {icon ?? <Icon aria-hidden />}
      </div>
      <div className="min-w-0 flex-1 space-y-1">
        {title ? <p className="font-semibold text-(--callout-fg)">{title}</p> : null}
        {children ? <div className="[&_a]:font-medium [&_a]:underline">{children}</div> : null}
        {actions ? <div className="flex flex-wrap gap-2 pt-1.5">{actions}</div> : null}
      </div>
    </div>
  );
}

/** The callout types of Fumadocs MDX and the Ledger tone each one renders as. */
const mdxTypes: Record<string, CalloutTone> = {
  info: 'info',
  warn: 'warning',
  warning: 'warning',
  error: 'danger',
  success: 'success',
  idea: 'info',
};

/**
 * `Callout` for MDX content: accepts the Fumadocs `type` as well as `tone` and sets the body in the prose size.
 * The `mdx-callout` rules in global.css replace the prose margins inside it.
 */
export function MdxCallout({
  type,
  tone,
  className,
  children,
  ...props
}: CalloutProps & { type?: string }) {
  return (
    <Callout
      tone={tone ?? (type ? mdxTypes[type] : undefined) ?? 'info'}
      className={cn('mdx-callout my-6 text-(length:--font-size-body)', className)}
      {...props}
    >
      {children}
    </Callout>
  );
}
