#!/usr/bin/env node
/**
 * build-a11y-css.mjs — compiles the accessibility widget's Tailwind utilities into a
 * self-contained, prefixed stylesheet so the widget renders in hosts WITHOUT Tailwind.
 *
 *   npm run build:a11y-css
 *
 * Input : src/components/accessibility/tailwind.a11y.css   (theme + utilities, prefix `acc`, !important)
 * Output: src/components/accessibility/accessibility.widget.css   (generated — do not edit by hand)
 *
 * Why prefix + important + no preflight:
 *  - `acc:` prefix → the generated selectors can never collide with a host's own `.flex`/`.hidden`.
 *  - `important` → host element rules (`button {…}`, `h2 {…}`) cannot restyle the widget.
 *  - no preflight → nothing resets the host page; the widget carries its own scoped base
 *    (see "WIDGET BASE" in accessibility.base.css).
 *  - utilities stay UNLAYERED (Tailwind's sub-imports emit them that way) — required so the
 *    host-page rules in accessibility.css (stop-animations, big cursor, keyboard focus rings)
 *    keep winning inside the widget by specificity — which also requires accessibility.css to be
 *    imported LAST (see accessibility.base.css header).
 *
 * Re-run after any change to a `className` in src/components/accessibility/**.
 * The test src/__tests__/a11y-widget-class-prefix.test.ts fails when the file is stale.
 */
// Tailwind v4 internals, declared in devDependencies; their version must move together with `tailwindcss`.
import { compile } from '@tailwindcss/node';
import { Scanner } from '@tailwindcss/oxide';
import { createHash } from 'node:crypto';
import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const WIDGET_DIR = path.join(ROOT, 'src', 'components', 'accessibility');
const INPUT = path.join(WIDGET_DIR, 'tailwind.a11y.css');
const OUTPUT = path.join(WIDGET_DIR, 'accessibility.widget.css');

/** Header carries a hash of the input stylesheet so the test can detect a stale build in both directions. */
const header = (inputHash) => `/* =============================================================================
   GENERATED FILE — do not edit. Rebuild with: npm run build:a11y-css
   Source: tailwind.a11y.css + every className in src/components/accessibility/**.tsx
   Prefixed (acc:), !important, no preflight, unlayered utilities. See scripts/build-a11y-css.mjs
   Input hash: ${inputHash}
   ============================================================================= */
`;

const inputHashOf = (input) => createHash('sha256').update(input).digest('hex').slice(0, 12);

async function main() {
  const input = await readFile(INPUT, 'utf8');
  // onDependency is a no-op: this is a one-shot build, nothing watches the dependency graph.
  const compiler = await compile(input, { base: WIDGET_DIR, onDependency: () => {} });

  // Tailwind resolves `@source` into scan globs; the scanner turns the sources into candidates.
  const scanner = new Scanner({ sources: compiler.sources });
  const candidates = scanner.scan();
  const css = compiler.build(candidates);

  assertNoUnprefixedUtility(css);
  await writeFile(OUTPUT, header(inputHashOf(input)) + css, 'utf8');
  console.log(`a11y widget CSS: ${candidates.length} candidates → ${(css.length / 1024).toFixed(1)} KB → ${path.relative(ROOT, OUTPUT)}`);
}

/** Every utility selector must carry the prefix; a bare `.flex` here would leak into the host.
 *  Matches selectors at any indentation (Tailwind nests media-query rules two spaces in). */
function assertNoUnprefixedUtility(css) {
  const selectors = [...css.matchAll(/(?:^|\n)\s*(\.[A-Za-z][^{\n]*?)\s*\{/g)]
    .flatMap((m) => m[1].split(','))
    .map((s) => s.trim())
    .filter((s) => s.startsWith('.'));
  const bare = selectors.filter((s) => !s.startsWith('.acc\\:'));
  // @keyframes names are document-global and are NOT renamed by the prefix — they must be
  // namespaced by hand (see tailwind.a11y.css); a bare name would collide with a host animation.
  const keyframes = [...css.matchAll(/@keyframes\s+([A-Za-z][\w-]*)/g)].map((m) => m[1]);
  const bareKeyframes = keyframes.filter((n) => !/^(acc-|a11y-)/.test(n));
  const problems = [...bare.map((s) => `selector ${s}`), ...bareKeyframes.map((n) => `@keyframes ${n}`)];
  if (problems.length > 0) {
    const more = problems.length > 10 ? `\n  … and ${problems.length - 10} more` : '';
    throw new Error(`Unprefixed names in generated CSS (would collide with the host):\n  ${problems.slice(0, 10).join('\n  ')}${more}`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
