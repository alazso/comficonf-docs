'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

const options = [
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
  { value: 'system', label: 'System' },
] as const;

/** Segmented Light, Dark and System control. The pressed option is unknown until the stored theme is read. */
export function ThemeSwitch({ className }: { className?: string }) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <div
      role="group"
      aria-label="Color theme"
      data-theme-switch=""
      className={cn(
        'inline-flex h-7 shrink-0 items-stretch overflow-hidden rounded-sm border border-control-border',
        className,
      )}
    >
      {options.map((option) => {
        const pressed = mounted && theme === option.value;
        return (
          <button
            key={option.value}
            type="button"
            aria-pressed={pressed}
            onClick={() => setTheme(option.value)}
            className={cn(
              'min-w-12 border-s border-control-border px-2 text-xs font-medium transition-colors first:border-s-0',
              pressed ? 'bg-accent text-accent-fg' : 'text-muted hover:bg-hover hover:text-text',
            )}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
