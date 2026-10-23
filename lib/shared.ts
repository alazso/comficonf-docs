/** Site identity and every external address the site links to. */
export const site = {
  name: 'ComfiConf',
  label: 'docs',
  title: 'ComfiConf docs',
  description:
    'Install the ComfiConf bridge, pair your Minecraft server and edit plugin settings in the browser.',
  origin: 'https://docs.comficonf.com',
} as const;

export const appUrl = 'https://app.comficonf.com';
export const pairUrl = `${appUrl}/pair`;
export const docsUrl = 'https://docs.comficonf.com';
export const developersUrl = 'https://developers.comficonf.com';

export const gitConfig = {
  user: 'alazso',
  repo: 'comficonf-docs',
  branch: 'main',
};

/**
 * Release locations. A `null` entry is not published yet: it renders as plain text and is skipped by the link check
 * (`scripts/check-links.mjs`); set the URL once the page is published.
 */
export const releaseLinks: Record<ReleaseLinkKey, string | null> = {
  /** Modrinth project page, slug `comficonf`: https://modrinth.com/plugin/comficonf */
  modrinth: null,
  /** Hangar project page. */
  hangar: null,
  /** Public repository with the developer API, the demo plugin and the developer guide. */
  apiRepository: 'https://github.com/alazso/comficonf-api',
  /** GitHub release of the public API repository with the API JAR, the demo plugin JAR and SHA256SUMS. */
  githubRelease: null,
};

export type ReleaseLinkKey = 'modrinth' | 'hangar' | 'apiRepository' | 'githubRelease';

/** Routes of the generated files. */
export const ogImageRoute = '/og';
export const markdownRoute = '/llms.mdx';
