// Dependency-free HUB structural smoke tests (run: node --test tests/hub-structure.test.mjs)
import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
const read = (p) => readFileSync(new URL("../" + p, import.meta.url), "utf8");
test("Hub has a single accessible page heading and navigation", () => {
  const html = read("index.html");
  assert.equal((html.match(/<h1\b/g) || []).length, 1);
  for (const id of ["menu", "menu-grid", "hours-list", "primary-actions", "app-status"]) {
    assert.match(html, new RegExp('id="' + id + '"'));
  }
  assert.match(html, /class="skip-link" href="#menu"/);
  assert.match(html, /data-locale="it"/);
  assert.match(html, /data-locale="en"/);
});
test("Visual system preserves keyboard focus and reduced motion", () => {
  const css = read("styles.css");
  assert.match(css, /:focus-visible/);
  assert.match(css, /prefers-reduced-motion:\s*reduce/);
  assert.match(css, /@media\s*\(max-width:\s*480px\)/);
});
test("Hub keeps existing domain-driven menu and capability gates", () => {
  const js = read("app.js");
  assert.match(js, /validateSiteData\(site\)/);
  assert.match(js, /site\.capabilities\.onlineOrdering/);
  assert.match(js, /site\.capabilities\.whatsapp/);
  assert.match(js, /category\.saleRule === "counter-only"/);
  assert.match(js, /weightIncrementKg === 0\.5/);
});
test("Site configuration is valid JSON", () => {
  const data = JSON.parse(read("data/site.json"));
  assert.ok(data.brand?.name);
  assert.ok(Array.isArray(data.categories));
  assert.ok(Array.isArray(data.menuItems));
});
