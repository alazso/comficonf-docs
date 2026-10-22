import { defineConfig, defineDocs } from 'fumadocs-mdx/config';
import { metaSchema, pageSchema } from 'fumadocs-core/source/schema';
import { createCssVariablesTheme } from 'shiki';

// Bridge version injected into content at build time. The deploy workflow sets COMFICONF_BRIDGE_VERSION from the
// newest version of the Modrinth project, or 0.1.0 while the project does not exist.
const BRIDGE_VERSION = process.env.COMFICONF_BRIDGE_VERSION || '0.1.0';
const TOKEN = 'COMFICONF_BRIDGE_VERSION';

interface MdastNode {
  value?: unknown;
  children?: MdastNode[];
  attributes?: { type?: string; value?: unknown }[];
}

const replaceToken = (text: string) => text.split(TOKEN).join(BRIDGE_VERSION);

// Replaces string literals in the estree of a JSX attribute expression, such as the facts of a FactsStrip.
function replaceInEstree(node: unknown) {
  if (!node || typeof node !== 'object') return;
  const literal = node as { type?: string; value?: unknown; raw?: unknown };
  if (literal.type === 'Literal' && typeof literal.value === 'string') {
    literal.value = replaceToken(literal.value);
    if (typeof literal.raw === 'string') literal.raw = replaceToken(literal.raw);
  }
  for (const child of Object.values(node)) {
    if (Array.isArray(child)) child.forEach(replaceInEstree);
    else if (child && typeof child === 'object') replaceInEstree(child);
  }
}

// Replaces the version token in text, code and JSX attributes before syntax highlighting.
function remarkBridgeVersion() {
  return (tree: MdastNode) => {
    const walk = (node: MdastNode) => {
      if (typeof node.value === 'string') {
        node.value = replaceToken(node.value);
      }
      for (const attribute of node.attributes ?? []) {
        if (typeof attribute.value === 'string') {
          attribute.value = replaceToken(attribute.value);
        } else if (attribute.value && typeof attribute.value === 'object') {
          const expression = attribute.value as { value?: unknown; data?: { estree?: unknown } };
          if (typeof expression.value === 'string') expression.value = replaceToken(expression.value);
          replaceInEstree(expression.data?.estree);
        }
      }
      node.children?.forEach(walk);
    };
    walk(tree);
  };
}

// Token colors come from the --shiki-* custom properties in app/global.css, which follow the color theme.
const ledgerTheme = createCssVariablesTheme({ name: 'ledger', variablePrefix: '--shiki-' });

export const docs = defineDocs({
  dir: 'content/docs',
  docs: {
    schema: pageSchema,
    postprocess: { includeProcessedMarkdown: true },
  },
  meta: { schema: metaSchema },
});

export default defineConfig({
  mdxOptions: {
    remarkPlugins: [remarkBridgeVersion],
    rehypeCodeOptions: {
      themes: { light: ledgerTheme, dark: ledgerTheme },
    },
  },
});
