// Verify Galline in Fuga 16/10 approved list; run: node scripts/verify-menu-20261016.mjs
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
const site = JSON.parse(await readFile(new URL("../data/site.json", import.meta.url), "utf8"));
const code = await readFile(new URL("../domain.js", import.meta.url), "utf8");
const { pizzaPriceCents, validateSiteData } = await import("data:text/javascript;base64," + Buffer.from(code).toString("base64"));
assert.deepEqual(validateSiteData(site), []);
assert.equal(site.menuItems.length, 38);
assert.equal(site.menuItems.filter(x => x.categoryId === "pizzeria").length, 21);
for (const id of ["rustica", "pistacchiosa", "la-migliore"]) assert.ok(!site.menuItems.some(x => x.id === id));
const buf = site.menuItems.find(x => x.id === "bufalina");
assert.equal(buf.ingredients.it, "Pomodoro, mozzarella di bufala");
for (const channel of ["hub", "order"]) assert.ok(!/pomodorini|cherry tomatoes/i.test(JSON.stringify(buf.editorial[channel])));
assert.equal(site.menuItems.find(x => x.id === "pollo-intero").priceCents, 1400);
assert.equal(site.menuItems.find(x => x.id === "mezzo-pollo").priceCents, 700);
for (const [date, active] of [["2026-10-16T12:00:00Z", true], ["2026-10-17T12:00:00Z", false], ["2026-10-19T12:00:00Z", true], ["2026-10-23T12:00:00Z", true], ["2026-10-24T12:00:00Z", false]]) {
  for (const group of site.menuGroups) {
    for (const [variant, offer] of [["normale", 600], ["familiare", 1200]]) {
      const base = group.prices.find(x => x.id === variant)?.priceCents;
      if (base == null) continue;
      assert.equal(pizzaPriceCents(site, group, variant, new Date(date)), active ? offer : base, date + " " + group.id + " " + variant);
    }
  }
}
console.log("MENU_20261016 PASS");
