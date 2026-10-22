import Image from 'next/image';
import { screenshots, type ScreenshotId } from '@/lib/screenshots';

/**
 * A screenshot of the web app: a 1px rule, a 6px radius and a caption, at most the content width. The image links to
 * the full-size file.
 */
export function Screenshot({ id, caption }: { id: ScreenshotId; caption?: string }) {
  const { image, alt, caption: defaultCaption } = screenshots[id];
  const text = caption ?? defaultCaption;
  return (
    <figure className="ledger-screenshot not-prose">
      <a href={image.src}>
        <Image
          src={image}
          alt={alt}
          sizes="(min-width: 1024px) 40rem, 100vw"
          className="block h-auto w-full"
        />
        <span className="sr-only"> Opens the full-size image.</span>
      </a>
      <figcaption>{text}</figcaption>
    </figure>
  );
}
