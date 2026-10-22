import type { CSSProperties, ReactNode } from 'react';
import { cn } from '@/lib/utils';

/** Small uppercase label above a value. */
export const eyebrowClasses = 'text-xs font-semibold uppercase tracking-wider text-subtle';

export interface Fact {
  label: string;
  value: ReactNode;
  /** Shown on hover, for example the full date. */
  title?: string;
  /** Sans text instead of mono. Defaults to mono. */
  mono?: boolean;
  /** Muted value, for "Unknown". */
  muted?: boolean;
  /**
   * Two columns wide from a 36rem strip, for ids and long version strings. Cells fill rows in order, so a wide fact
   * should complete a row.
   */
  wide?: boolean;
}

/** The most columns of a facts strip below a 36rem container, from 36rem, and from 64rem. */
const FACT_COLUMN_LIMITS = [2, 4, 8] as const;

/** The largest column count up to `limit` that `units` single-column cells fill completely, or 1. */
function fullColumns(units: number, limit: number): number {
  for (let columns = Math.min(units, limit); columns > 1; columns -= 1) {
    if (units % columns === 0) return columns;
  }
  return 1;
}

/** Column count of one width tier, and the span of wide facts in it. */
function factsTier(facts: readonly Fact[], limit: number, spanWide: boolean) {
  const wide = facts.filter((fact) => fact.wide).length;
  if (spanWide && wide > 0) {
    const columns = fullColumns(facts.length + wide, limit);
    if (columns >= 2) return { columns, span: 2 };
  }
  return { columns: fullColumns(facts.length, limit), span: 1 };
}

/**
 * Ruled cells of labelled values on a grid whose column count divides the cells, so every row is full and the rules
 * of all rows line up. Each cell draws its left and bottom rule and extends 1px past its grid area on those sides, so
 * the rules of the first column and the last row fall outside the clipped box and only inner rules show.
 */
export function FactsStrip({ facts, className }: { facts: readonly Fact[]; className?: string }) {
  const [narrow, medium, wide] = FACT_COLUMN_LIMITS.map((limit, tier) =>
    factsTier(facts, limit, tier > 0),
  );
  const grid = {
    '--facts-columns-1': narrow!.columns,
    '--facts-columns-2': medium!.columns,
    '--facts-columns-3': wide!.columns,
    '--facts-span-2': medium!.span,
    '--facts-span-3': wide!.span,
  } as CSSProperties;
  return (
    <div className={cn('facts-strip not-prose @container/facts', className)}>
      <dl
        style={grid}
        className="grid grid-cols-[repeat(var(--facts-columns-1),minmax(0,1fr))] overflow-hidden rounded-md border border-border bg-surface @xl/facts:grid-cols-[repeat(var(--facts-columns-2),minmax(0,1fr))] @5xl/facts:grid-cols-[repeat(var(--facts-columns-3),minmax(0,1fr))]"
      >
        {facts.map((fact) => (
          <div
            key={fact.label}
            className={cn(
              '-mb-px -ml-px min-w-0 border-b border-l border-border px-3 py-1.5',
              fact.wide &&
                '@xl/facts:col-span-(--facts-span-2) @5xl/facts:col-span-(--facts-span-3)',
            )}
          >
            <dt className={eyebrowClasses}>{fact.label}</dt>
            <dd
              title={fact.title}
              className={cn(
                'text-xs [overflow-wrap:anywhere]',
                fact.mono === false ? 'font-sans' : 'font-mono',
                fact.muted ? 'text-subtle' : 'text-text',
              )}
            >
              {fact.value}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
