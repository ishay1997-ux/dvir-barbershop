<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Accessibility widget (src/components/accessibility)
- `accessibility.widget.css` is GENERATED. After changing any `className` in that folder or `tailwind.a11y.css`, run `npm run build:a11y-css` (script: `scripts/build-a11y-css.mjs`).
- Gate: `src/__tests__/a11y-widget-class-prefix.test.ts` fails on an unprefixed class or a stale generated file.
- CSS import order in the widget is load-bearing: widget.css → base.css → accessibility.css (host rules last).
