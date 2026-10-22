import defaultMdxComponents from 'fumadocs-ui/mdx';
import type { MDXComponents } from 'mdx/types';
import { Badge } from '@/components/badge';
import { MdxCallout } from '@/components/callout';
import { FactsStrip } from '@/components/facts-strip';
import { CommandChip, Kbd } from '@/components/kbd';
import { ReleaseLink } from '@/components/release-link';
import { Screenshot } from '@/components/screenshot';
import { Step, Steps } from '@/components/steps';

export function getMDXComponents(components?: MDXComponents) {
  return {
    ...defaultMdxComponents,
    Callout: MdxCallout,
    Badge,
    CommandChip,
    FactsStrip,
    Kbd,
    ReleaseLink,
    Screenshot,
    Step,
    Steps,
    ...components,
  } satisfies MDXComponents;
}

export const useMDXComponents = getMDXComponents;

declare global {
  type MDXProvidedComponents = ReturnType<typeof getMDXComponents>;
}
