import { defineConfig, defineDocs } from 'fumadocs-mdx/config';
import { metaSchema, pageSchema } from 'fumadocs-core/source/schema';
import { createCssVariablesTheme } from 'shiki';
import { releaseLinks } from './lib/shared';

// Bridge version injected into content at build time. The deploy workflow sets COMFICONF_BRIDGE_VERSION from the
// newest version of the Modrinth project, or 0.1.0 when the Modrinth API returns no version.
const BRIDGE_VERSION = process.env.COMFICONF_BRIDGE_VERSION || '0.1.0';
const TOKEN = 'COMFICONF_BRIDGE_VERSION';

interface MdastNode {
  type?: string;
  name?: string | null;
  value?: unknown;
  children?: MdastNode[];
  attributes?: { type?: string; name?: string; value?: unknown }[];
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

const releaseStateElements = new Set(['Released', 'Unreleased']);

// Resolves <Released to="..."> and <Unreleased to="..."> against releaseLinks, so the page and its Markdown copy
// carry only the wording of the current release state. `to` lists release link keys separated by spaces. Released
// keeps its children when every key has a URL, Unreleased when none has one; a partly set list fails the build.
function remarkReleaseState() {
  return (tree: MdastNode, file: { path?: string }) => {
    const resolve = (node: MdastNode): MdastNode[] => {
      if (
        (node.type !== 'mdxJsxFlowElement' && node.type !== 'mdxJsxTextElement') ||
        !releaseStateElements.has(node.name ?? '')
      ) {
        if (node.children) node.children = node.children.flatMap(resolve);
        return [node];
      }
      const to = node.attributes?.find((attribute) => attribute.name === 'to')?.value;
      const keys = typeof to === 'string' ? to.split(/\s+/).filter(Boolean) : [];
      const unknown = keys.filter((key) => !Object.hasOwn(releaseLinks, key));
      if (keys.length === 0 || unknown.length > 0) {
        throw new Error(`${file.path}: <${node.name}> needs a "to" of release link keys from lib/shared.ts`);
      }
      const published = keys.filter((key) => releaseLinks[key as keyof typeof releaseLinks]).length;
      if (published > 0 && published < keys.length) {
        throw new Error(`${file.path}: <${node.name} to="${keys.join(' ')}"> has only some of its links set`);
      }
      if ((published === keys.length) !== (node.name === 'Released')) return [];
      return (node.children ?? []).flatMap(resolve);
    };
    tree.children = tree.children?.flatMap(resolve);
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
    remarkPlugins: [remarkReleaseState, remarkBridgeVersion],
    rehypeCodeOptions: {
      themes: { light: ledgerTheme, dark: ledgerTheme },
    },
  },
});
