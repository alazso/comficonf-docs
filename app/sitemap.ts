import type { MetadataRoute } from 'next';
import { site } from '@/lib/shared';
import { source } from '@/lib/source';

export const revalidate = false;

export default function sitemap(): MetadataRoute.Sitemap {
  return source.getPages().map((page) => ({
    url: new URL(page.url, site.origin).toString(),
    priority: page.slugs.length === 0 ? 1 : 0.7,
  }));
}
