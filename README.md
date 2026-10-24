# ComfiConf docs

The documentation for server owners who use [ComfiConf](https://app.comficonf.com), served at
https://docs.comficonf.com. Built with Next.js and Fumadocs, styled with Ledger, the design system of the ComfiConf
web app, in its paper treatment (light first, canvas frame, 16px prose). The developer documentation is a sibling
site, https://developers.comficonf.com.

## Local development

Requires Node.js 24 and npm.

```bash
npm ci
```

```bash
npm run dev -- -p 3101
```

The site runs at http://localhost:3101, with the docs index as the home page and every page at the root
(`/getting-started/install-the-bridge`, not `/docs/...`).

| Command | What it does |
| --- | --- |
| `npm run build` | Production build into `.next/standalone` |
| `npm run types:check` | Generates the MDX collections and route types, then runs `tsc` |
| `npm start` | Serves a production build |
| `node scripts/check-links.mjs <base url> [--map <origin>=<local origin>]` | Checks every link and anchor of a running site (see below) |

## Content

Pages are MDX files in `content/docs`. The sidebar order comes from `meta.json` in each folder; a folder's
`meta.json` also sets its title. Every page needs a `title` and a `description` in its front matter: they are the
page heading, the search entry, the OG image and the description in search results.

Write for a server owner, not a programmer, and describe behavior the way the owner sees it. Nothing about the
bridge's protocol, the backend or the service's internals belongs here.

- **UI names** are bold and written exactly as the app writes them, including capitalization and the final period
  of messages. Check every label against the web app's source before quoting it.
- **Commands** use `<CommandChip>/comficonf pair</CommandChip>`, keys use `<Kbd>Esc</Kbd>`, and config keys,
  permissions and file names use inline code.
- **No em or en dashes** anywhere, including front matter. Use commas, colons, parentheses or periods.
- `COMFICONF_BRIDGE_VERSION` anywhere in content (text, code, component props) is replaced at build time by the
  bridge version; see [Version stamping](#version-stamping).

Components available in MDX, besides Markdown:

| Component | Use |
| --- | --- |
| `<Callout tone="info" title="...">` | Notes. Tones `info`, `success`, `warning`, `danger`, `neutral`; Fumadocs' `type` (`info`, `warn`, `warning`, `error`, `success`, `idea`) works too |
| `<Steps>` / `<Step title="...">` | Numbered procedures |
| `<Screenshot id="editor" />` | A screenshot from `lib/screenshots.ts`, with its caption; links to the full-size file |
| `<FactsStrip facts={[...]} />` | Ruled cells of labelled values, as in the app |
| `<Badge tone="success">Applied</Badge>` | Status badges as the app draws them |
| `<CommandChip>`, `<Kbd>` | Commands and keys |
| `<ReleaseLink to="modrinth">Modrinth</ReleaseLink>` | A release location from `lib/shared.ts`; plain text while its URL is unset |
| `<Released to="modrinth hangar">`, `<Unreleased to="modrinth hangar">` | Wording for one release state, resolved at build time so the page and its Markdown copy match: `Released` keeps its content when every listed release link has a URL, `Unreleased` when none has one, and a partly set list fails the build |

`Callout`, `FactsStrip`, `Steps`, `Kbd` and `CommandChip` have the same name and API in both documentation
repositories, and `Callout`, `FactsStrip` and `Badge` match the web app's components.

### Screenshots

Screenshots are 1600 by 900 PNG files in `public/images`, registered in `lib/screenshots.ts` with their alt text
and caption. They come from the store listing images of the ComfiConf release. Two listing images are not used
here because they were taken on a local stack: the pairing page (it shows a local address and a setup step the
hosted app does not have) and the console after `/comficonf pair`. Retake both against app.comficonf.com before
adding them.

## Site constants and release links

`lib/shared.ts` holds the site origin, the app and sibling site addresses, the GitHub repository used for commit
links, and `releaseLinks`: the Modrinth and Hangar pages, the public API repository and its GitHub release. A
release link set to `null` renders its text without a link and is skipped by the link check. Set each URL once
the page is published.

## Design

`app/global.css` holds the Ledger tokens with the web app's names and values (light in `@theme`, dark under
`.dark`), maps the Fumadocs colors onto them, and sets the paper treatment. The additions of the documentation
sites are `--color-code-surface`, `--color-code-text`, `--color-code-border`, `--font-size-body`,
`--line-height-body` and `--content-max-width`. Syntax colors come from a Shiki CSS variables theme
(`source.config.ts`) and the `--shiki-*` properties.

The stylesheet keeps Ledger's rules: no `backdrop-filter`, radii of 3, 4 and 6px, and `--shadow-lg` as the only
shadow. Check them in a production build:

```bash
grep -oh 'backdrop-filter[^;}]*\|9999px\|box-shadow:[^;}]*' .next/static/chunks/*.css | sort | uniq -c
```

The expected hits are `box-shadow: var(--shadow-lg)`, `box-shadow: none`, Tailwind's composite `box-shadow` of the
`.shadow-lg` utility (its `--tw-shadow` is the `--shadow-lg` value, and global.css sets the utility to
`var(--shadow-lg)`), and the typography plugin's `kbd` shadow, which global.css replaces with `box-shadow: none`.
Nothing else, and no `backdrop-filter` at all.

## Version stamping

- The footer of every page names the commit and the time of the build, from the `GIT_SHA` and `BUILD_DATE` build
  arguments, fixed at build time. A build without them shows `local` and the time of the build, so a stale deploy is
  visible on the page.
- `COMFICONF_BRIDGE_VERSION` in content is replaced by the build argument of the same name. The deploy workflow
  takes the `version_number` of the newest version of the Modrinth project `comficonf`, and falls back to `0.1.0`
  while the project does not exist.

## Checking links

With both sites running locally (this one on 3101, the developer site on 3102):

```bash
node scripts/check-links.mjs http://localhost:3101 --map https://developers.comficonf.com=http://localhost:3102
```

The script reads the pages from `sitemap.xml`, follows every link on them, checks in-page anchors, maps the
sibling site to its local server, and requests external links such as app.comficonf.com. Unset release links
render no link, so they are not checked. Links to this repository on GitHub (the commit in the footer, the
**Open** menu) answer only once the repository exists.

## Deployment

`.github/workflows/deploy.yml` builds the Docker image and pushes it to `ghcr.io/alazso/comficonf-docs` with the
tags `latest` and `sha-<short sha>`, on every push to `main` and on demand (**Run workflow**, `workflow_dispatch`).
The image is a Next.js standalone server on `node:24.22.1-alpine`, listening on port 3000 as the `node` user.

Run the image behind a reverse proxy and publish its port 3000 on localhost only. Updating means pulling
`ghcr.io/alazso/comficonf-docs:latest` again and recreating the container.

### Notes

- **GHCR packages are private by default.** The server cannot pull the image until the package is made public
  (on GitHub: the package, **Package settings**, **Change visibility**) or the host runs `docker login ghcr.io`
  with a token that has the `read:packages` scope.
- **Scheduled workflows.** GitHub disables scheduled workflows in a public repository after 60 days without
  repository activity. The deploy workflow has no schedule, so it is not affected. If a schedule is added later and
  the workflow shows as disabled under **Actions**, choose **Enable workflow**. If a push does not start a deploy,
  run the workflow with `workflow_dispatch`.
- **Check a deploy** by the footer: it names the commit the running image was built from.

## Fonts

The IBM Plex fonts in `lib/og/fonts` are licensed under the SIL Open Font License 1.1 (`lib/og/fonts/OFL.txt`).
