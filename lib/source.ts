import { docs } from 'collections/server';
import { loader } from 'fumadocs-core/source';
import { markdownRoute, ogImageRoute, site } from './shared';

export const source = loader({
  baseUrl: '/',
  source: docs.toFumadocsSource(),
});

export type Page = (typeof source)['$inferPage'];

export function getPageImage(page: Page) {
  const segments = [...page.slugs, 'image.png'];
  return { segments, url: `${ogImageRoute}/${segments.join('/')}` };
}

export function getPageMarkdownUrl(page: Page) {
  const segments = [...page.slugs, 'content.md'];
  return { segments, url: `${markdownRoute}/${segments.join('/')}` };
}

export async function getLLMText(page: Page) {
  const processed = await page.data.getText('processed');
  return `# ${page.data.title} (${new URL(page.url, site.origin).toString()})\n\n${processed}`;
}
