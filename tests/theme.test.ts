import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const css = readFileSync("app/theme.css", "utf8");
const token = (name: string): string => {
  const m = css.match(new RegExp(`--${name}:\\s*(#[0-9a-fA-F]{6})`));
  assert.ok(m, `--${name} is missing from theme.css`);
  return m[1];
};

function luminance(hex: string): number {
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255).map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}
const contrast = (a: string, b: string): number => {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
};

test("the SGT logo colours are the brand and accent colours", () => {
  assert.equal(token("brand").toLowerCase(), "#0060aa");
  assert.equal(token("accent").toLowerCase(), "#ef7f1a");
});

test("text stays readable on every pairing the pages use (WCAG AA, 4.5:1)", () => {
  assert.ok(contrast("#ffffff", token("brand")) >= 4.5, "white on brand buttons");
  assert.ok(contrast("#ffffff", token("brand-hover")) >= 4.5, "white on hovered buttons");
  assert.ok(contrast(token("brand"), token("page")) >= 4.5, "brand text on the page");
  assert.ok(contrast(token("muted"), token("page")) >= 4.5, "secondary text on the page");
  assert.ok(contrast(token("ink"), token("page")) >= 7, "main text on the page");
  assert.ok(contrast(token("ink"), token("accent")) >= 4.5, "dark text on the orange accent");
});

test("orange is never used behind white text (it fails contrast)", () => {
  assert.ok(contrast("#ffffff", token("accent")) < 4.5);
  const walk = (dir: string): string[] => readdirSync(dir).flatMap((f) => (statSync(join(dir, f)).isDirectory() ? walk(join(dir, f)) : f.endsWith(".tsx") ? [join(dir, f)] : []));
  for (const f of [...walk("app"), ...walk("components")]) {
    const src = readFileSync(f, "utf8");
    assert.ok(!/bg-\[#EF7F1A\][^"'`]*text-white|text-white[^"'`]*bg-\[#EF7F1A\]/i.test(src), `${f} puts white text on orange`);
  }
});

test("the old maroon and serif styling are gone from every page and component", () => {
  const walk = (dir: string): string[] => readdirSync(dir).flatMap((f) => (statSync(join(dir, f)).isDirectory() ? walk(join(dir, f)) : f.endsWith(".tsx") ? [join(dir, f)] : []));
  for (const f of [...walk("app"), ...walk("components")]) {
    const src = readFileSync(f, "utf8");
    assert.ok(!/#831843|#701237/i.test(src), `${f} still has the old maroon`);
    assert.ok(!/font-serif/.test(src), `${f} still uses font-serif`);
  }
});

test("motion respects reduced-motion settings", () => {
  const fx = readFileSync("app/effects.css", "utf8");
  assert.match(fx, /prefers-reduced-motion:\s*reduce/);
  assert.match(fx, /\.page-enter/);
  assert.match(fx, /\.auth-toast/);
});

test("pages open at the top: no global smooth scrolling that would leave a new page half-way down", () => {
  const fx = readFileSync("app/effects.css", "utf8").replace(/\/\*[\s\S]*?\*\//g, "");
  assert.doesNotMatch(fx, /scroll-behavior\s*:\s*smooth/);
  assert.doesNotMatch(readFileSync("app/theme.css", "utf8").replace(/\/\*[\s\S]*?\*\//g, ""), /scroll-behavior\s*:\s*smooth/);
});

test("the page-change animation only fades, so pop-ups stay centred on the screen", () => {
  const fx = readFileSync("app/effects.css", "utf8");
  const block = fx.match(/@keyframes page-enter\s*\{([\s\S]*?\n\})/);
  assert.ok(block, "page-enter keyframes not found");
  assert.doesNotMatch(block[1], /transform|translate|scale|rotate|filter|perspective/i);
  const rule = fx.match(/\.page-enter\s*\{([^}]*)\}/);
  assert.ok(rule, ".page-enter rule not found");
  assert.doesNotMatch(rule[1], /transform|translate|scale|will-change|filter/i);
  assert.doesNotMatch(rule[1], /\b(both|forwards)\b/); // no fill that would keep the effect applied after it ends
});

test("expanding content and pop-ups all have an effect", () => {
  const fx = readFileSync("app/effects.css", "utf8");
  assert.match(fx, /\[role="dialog"\]\[aria-modal="true"\]:not\(\.modal-backdrop\)\s*>\s*:first-child/);
  assert.match(fx, /\.accordion-panel/);
  assert.match(fx, /\.dropdown-reveal/);
  assert.match(fx, /\.click-pulse/);
  const home = readFileSync("app/page.tsx", "utf8");
  assert.doesNotMatch(home, /<details/, "the FAQ must use the animated Accordion, not a plain <details>");
  assert.match(home, /<Accordion /);
  assert.match(readFileSync("app/layout.tsx", "utf8"), /<ClickPulse \/>/);
});

test("a box that is animated with a transform never has a pop-up inside it", () => {
  // .reveal and the animated alert/status boxes use transform; anything that would hold a fixed pop-up must not use them.
  const walk = (dir: string): string[] => readdirSync(dir).flatMap((f) => (statSync(join(dir, f)).isDirectory() ? walk(join(dir, f)) : f.endsWith(".tsx") ? [join(dir, f)] : []));
  for (const f of [...walk("app"), ...walk("components")]) {
    const src = readFileSync(f, "utf8");
    assert.ok(!/className="[^"]*\breveal\b[^"]*"[^>]*>\s*[\s\S]{0,40}fixed inset-0/.test(src), `${f}: a .reveal box wraps a pop-up`);
  }
});

test("every pop-up plays a closing animation before it is removed", () => {
  const fx = readFileSync("app/effects.css", "utf8");
  assert.match(fx, /\[data-closing="true"\]:not\(\.modal-backdrop\)\s*>\s*:first-child/);
  const walk = (dir: string): string[] => readdirSync(dir).flatMap((f) => (statSync(join(dir, f)).isDirectory() ? walk(join(dir, f)) : f.endsWith(".tsx") ? [join(dir, f)] : []));
  for (const f of [...walk("app"), ...walk("components")]) {
    const src = readFileSync(f, "utf8");
    // every pop-up (a fixed full-screen backdrop with role="dialog") must carry data-closing
    for (const m of src.matchAll(/<div\b[^>]*fixed inset-0[^>]*role="dialog"[^>]*>/g)) {
      assert.match(m[0], /data-closing=/, `${f}: a pop-up has no data-closing, so it would vanish instantly`);
    }
  }
});

test("the closing time in code matches the CSS (0.22s)", () => {
  assert.match(readFileSync("lib/useExit.ts", "utf8"), /EXIT_MS\s*=\s*220/);
  assert.match(readFileSync("app/effects.css", "utf8"), /data-closing="true"\][^}]*\n?[^}]*animation:\s*fade-out 0\.22s/);
});

test("the sign-in control is in one shared header that every page gets", () => {
  const layout = readFileSync("app/layout.tsx", "utf8");
  assert.match(layout, /<SiteHeader \/>/);
  const header = readFileSync("components/SiteHeader.tsx", "utf8");
  assert.match(header, /openSignIn\(\)/);
  assert.match(header, /Sign out/);
  assert.match(header, /Talent Gateway/);
  // the home page no longer carries a second header of its own
  assert.doesNotMatch(readFileSync("app/page.tsx", "utf8"), /<header\b/);
});

test("the header never contains a pop-up (its backdrop-filter would break the pop-up's position)", () => {
  const header = readFileSync("components/SiteHeader.tsx", "utf8");
  const inside = header.slice(header.indexOf("<header"), header.indexOf("</header>"));
  assert.doesNotMatch(inside, /SalaryEstimatorModal|fixed inset-0/);
  assert.match(header, /<\/header>\s*\n\s*\{showSalary && <SalaryEstimatorModal/);
});

test("resume uploading lives in the Talent Gateway only: no upload button on the home page", () => {
  const home = readFileSync("app/page.tsx", "utf8");
  assert.doesNotMatch(home, /Upload Resume/);
  assert.doesNotMatch(home, /portal\/student/);
});

test("scroll effects: content glides in, and nothing that holds a pop-up is animated that way", () => {
  const fx = readFileSync("app/effects.css", "utf8");
  assert.match(fx, /html\.reveal-ready \[data-reveal\]/);
  assert.match(fx, /\[data-reveal\]\.in-view/);
  assert.match(readFileSync("app/layout.tsx", "utf8"), /<ScrollReveal \/>/);
  const walk = (dir: string): string[] => readdirSync(dir).flatMap((f) => (statSync(join(dir, f)).isDirectory() ? walk(join(dir, f)) : f.endsWith(".tsx") ? [join(dir, f)] : []));
  for (const f of [...walk("app"), ...walk("components")]) {
    const src = readFileSync(f, "utf8");
    assert.ok(!/data-reveal[^>]*>\s*[\s\S]{0,60}fixed inset-0/.test(src), `${f}: a data-reveal box wraps a pop-up`);
  }
});

test("the motion is soft: pop-ups take at least 0.35s to open and content at least 0.4s to appear", () => {
  const fx = readFileSync("app/effects.css", "utf8");
  assert.match(fx, /modal-in 0\.4\ds/);
  assert.match(fx, /\.reveal \{\s*animation: reveal-in 0\.5\ds/);
  assert.match(fx, /grid-template-rows 0\.4\ds/);
});

test("scroll effects switch on before the first paint and never leave content hidden without scripts", () => {
  const layout = readFileSync("app/layout.tsx", "utf8");
  assert.match(layout, /classList\.add\('reveal-ready'\)/);
  assert.match(layout, /<noscript>[\s\S]*\[data-reveal\]\{opacity:1!important/);
  assert.match(layout, /suppressHydrationWarning/);
});

test("signing out clears the login and then refreshes the page", () => {
  const header = readFileSync("components/SiteHeader.tsx", "utf8");
  assert.match(header, /const handleSignOut = \(\) => \{\s*signOut\(\);\s*window\.location\.reload\(\);/);
  assert.match(header, /onClick=\{handleSignOut\}/);
});
