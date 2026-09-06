/**
 * Gate for the standalone accessibility widget (src/components/accessibility).
 *
 * 1. Every class token in every `className` of the widget carries the `acc:` prefix (or is one of
 *    the widget's own `a11y-*` classes). Parsed with the TypeScript AST — deliberately NOT the
 *    regex the one-off codemod used, so the two cannot share a blind spot.
 * 2. Every `acc:` token used in the sources has a matching selector in the generated
 *    accessibility.widget.css, and the generated header carries the hash of the current input
 *    stylesheet — i.e. the generated file is not stale in either direction. Rebuild: npm run build:a11y-css
 */
import { describe, expect, it } from 'vitest';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import path from 'node:path';
import ts from 'typescript';
import { createHash } from 'node:crypto';

const WIDGET_DIR = path.resolve(__dirname, '..', 'components', 'accessibility');
const GENERATED_CSS = path.join(WIDGET_DIR, 'accessibility.widget.css');
const INPUT_CSS = path.join(WIDGET_DIR, 'tailwind.a11y.css');
const ALLOWED = /^(acc:|a11y-|animate-a11y-)/;

function listTsx(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const full = path.join(dir, name);
    if (statSync(full).isDirectory()) return listTsx(full);
    return name.endsWith('.tsx') ? [full] : [];
  });
}

/** All string fragments that live inside a `className` JSX attribute, found via the TS AST. */
function classNameFragments(file: string): string[] {
  const source = ts.createSourceFile(file, readFileSync(file, 'utf8'), ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  const fragments: string[] = [];
  // A string that is an operand of `===` / `!==` inside the expression is a value being compared
  // (e.g. dockSide === 'right'), not a class name — skip it.
  const isComparisonOperand = (node: ts.Node) =>
    ts.isBinaryExpression(node.parent) &&
    [ts.SyntaxKind.EqualsEqualsEqualsToken, ts.SyntaxKind.ExclamationEqualsEqualsToken].includes(node.parent.operatorToken.kind);
  const collectStrings = (node: ts.Node) => {
    if ((ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) && !isComparisonOperand(node)) fragments.push(node.text);
    else if (ts.isTemplateHead(node) || ts.isTemplateMiddle(node) || ts.isTemplateTail(node)) fragments.push(node.text);
    ts.forEachChild(node, collectStrings);
  };
  const visit = (node: ts.Node) => {
    if (ts.isJsxAttribute(node) && node.name.getText() === 'className' && node.initializer) collectStrings(node.initializer);
    ts.forEachChild(node, visit);
  };
  visit(source);
  return fragments;
}

const tokensByFile = new Map<string, string[]>();
for (const file of listTsx(WIDGET_DIR)) {
  const tokens = classNameFragments(file).flatMap((f) => f.split(/\s+/).filter(Boolean));
  tokensByFile.set(path.relative(WIDGET_DIR, file), tokens);
}

describe('accessibility widget — standalone class prefix', () => {
  it('scans the widget components', () => {
    expect(tokensByFile.size).toBeGreaterThanOrEqual(15);
    expect([...tokensByFile.values()].flat().length).toBeGreaterThan(500);
  });

  it('every className token is prefixed (acc:) or a widget-own class (a11y-*)', () => {
    const offenders: string[] = [];
    for (const [file, tokens] of tokensByFile) {
      for (const token of tokens) if (!ALLOWED.test(token)) offenders.push(`${file}: ${token}`);
    }
    expect(offenders).toEqual([]);
  });

  it('generated accessibility.widget.css contains a selector for every acc: token (exact match)', () => {
    const css = readFileSync(GENERATED_CSS, 'utf8');
    // Exact class names emitted in the file, unescaped — a substring check would let `acc:flex` pass on `acc:flex-col`.
    const emitted = new Set([...css.matchAll(/\.((?:\\.|[\w-])+)/g)].map((m) => m[1].replace(/\\(.)/g, '$1')));
    const missing: string[] = [];
    for (const [file, tokens] of tokensByFile) {
      for (const token of tokens) {
        if (!token.startsWith('acc:')) continue;
        // `acc:group` / `acc:peer` are markers used by other selectors, never emitted on their own
        if (/^acc:(group|peer)$/.test(token)) continue;
        if (!emitted.has(token)) missing.push(`${file}: ${token}`);
      }
    }
    expect(missing, 'run: npm run build:a11y-css').toEqual([]);
  });

  it('generated accessibility.widget.css was built from the current tailwind.a11y.css', () => {
    const stamped = readFileSync(GENERATED_CSS, 'utf8').match(/Input hash: ([0-9a-f]{12})/)?.[1];
    const current = createHash('sha256').update(readFileSync(INPUT_CSS, 'utf8')).digest('hex').slice(0, 12);
    expect(stamped, 'run: npm run build:a11y-css').toBe(current);
  });
});
