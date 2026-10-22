import { notFound } from 'next/navigation';
import { ImageResponse } from 'next/og';
import { OgCard, ogFonts, ogSize } from '@/lib/og/card';
import { getPageImage, source } from '@/lib/source';

export const revalidate = false;

export async function GET(_req: Request, { params }: RouteContext<'/og/[...slug]'>) {
  const { slug } = await params;
  const page = source.getPage(slug.slice(0, -1));
  if (!page) notFound();

  return new ImageResponse(
    <OgCard title={page.data.title} description={page.data.description} />,
    { ...ogSize, fonts: await ogFonts() },
  );
}

export function generateStaticParams() {
  return source.getPages().map((page) => ({
    slug: getPageImage(page).segments,
  }));
}
