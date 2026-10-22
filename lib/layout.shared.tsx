import type { DocsLayoutProps } from 'fumadocs-ui/layouts/notebook';
import { SiteMark } from '@/components/brand';
import { NavButton } from '@/components/nav-button';
import { ThemeSwitch } from '@/components/theme-switch';
import { appUrl, developersUrl, site } from './shared';

export function layoutOptions(): Omit<DocsLayoutProps, 'tree' | 'children'> {
  return {
    nav: {
      mode: 'top',
      title: <SiteMark label={site.label} />,
      url: '/',
    },
    links: [
      {
        type: 'custom',
        children: <NavButton href={developersUrl}>Developer docs</NavButton>,
      },
      {
        type: 'custom',
        children: (
          <NavButton href={appUrl} variant="primary">
            Open ComfiConf
          </NavButton>
        ),
      },
    ],
    slots: { themeSwitch: ThemeSwitch },
    sidebar: { collapsible: false },
  };
}
