// GIF-MVP-001: smoke checks using only built-in Node.js modules.
// Run from any directory: node scripts/verify-hub.mjs
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { validateSiteData } from "../domain.js";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const read = (path) => readFileSync(resolve(root, path), "utf8");
const site = JSON.parse(read("data/site.json"));
let tests = 0;
function check(title, condition, detail = "") {
  tests++;
  assert.ok(condition, title + (detail ? ": " + detail : ""));
  console.log("PASS", title);
}
const errors = validateSiteData(site);
check("Canonical data passes validation", errors.length === 0, errors.join("; "));
check("Seven intended categories", site.categories.length === 7);
check("Forty-one catalog entries in audited baseline", site.menuItems.length === 41);
check("Unique item IDs", new Set(site.menuItems.map(x => x.id)).size === site.menuItems.length);
check("Service modes takeaway/delivery only", site.serviceModes.length === 2 && site.serviceModes.includes("takeaway") && site.serviceModes.includes("delivery"));
check("Online checkout stays explicitly disabled", site.capabilities.onlineOrdering.enabled === false && !site.capabilities.onlineOrdering.href);
check("Opening hours and Sunday closure", ["monday","tuesday","wednesday","thursday","friday","saturday"].every(d => site.hours[d] === "16:00–23:00") && site.hours.sunday === "closed");
check("Counter-only Palermo savouries not online orderable", site.categories.find(c => c.id === "rosticceria-palermitana")?.onlineOrderable === false && site.menuItems.filter(i => i.categoryId === "rosticceria-palermitana").every(i => i.saleRule === "counter-only"));
check("Mignon sold only in 0.5 kg increments", site.categories.find(c => c.id === "rosticceria-mignon")?.weightIncrementKg === 0.5 && site.menuItems.filter(i => i.categoryId === "rosticceria-mignon").every(i => i.unit === "kg"));
check("Pizza extras preserve approved cents", site.pizzaAdditions.regularCents === 150 && site.pizzaAdditions.familyCents === 300);
check("All menu items have bilingual names", site.menuItems.every(i => i.name?.it?.trim() && i.name?.en?.trim()));
check("All price sources unambiguous in schema", site.menuItems.every(i => [i.priceCents, i.priceChoicesCents, i.priceGroup].filter(x => x !== undefined).length === 1));
check("24 pizzas / 2 chicken items", site.menuItems.filter(i=>i.categoryId==="pizzeria").length === 24 && site.menuItems.filter(i=>i.categoryId==="polleria").length===2);
check("No active unverified review link", site.capabilities.reviews.enabled === false);
const html = read("index.html");
check("Home loads canonical app and location modules", html.includes('src="./app.js"') && html.includes('src="./location.js"'));
check("Home link targets present", ["menu-grid","primary-actions","hours-list","contact-title","location-map"].every(id => html.includes('id="'+id+'"')));
check("Privacy page exists", existsSync(resolve(root,"privacy.html")));
check("Service worker keeps canonical data offline", read("sw.js").includes('"./data/site.json"'));
const story = read("chi-siamo.html");
check("Story does not falsely link Order Now to the menu", !/href="\.\/#menu">ORDINA ORA</i.test(story));
check("Story offers explicit WhatsApp contact", story.includes("SCRIVICI SU WHATSAPP") && story.includes("wa.me/393337309933"));
for (const filename of ["index.html","chi-siamo.html","privacy.html","contatti.html","lavora-con-noi.html","404.html"]) {
  const content = read(filename);
  const attrs = [...content.matchAll(/(?:href|src)="(\.\/?[^"#?]+)"/g)].map(x => x[1]);
  check("Local file references resolve: " + filename, attrs.every(x => existsSync(resolve(root,x))));
}
// Negative tests: intentionally invalid data must fail closed.
const badCounter = structuredClone(site);
badCounter.categories.find(c => c.id === "rosticceria-palermitana").onlineOrderable = true;
check("Reject counter-only items offered online", validateSiteData(badCounter).some(x => x.includes("Counter-only")));
const badWeight = structuredClone(site);
badWeight.categories.find(c => c.id === "rosticceria-mignon").weightIncrementKg = 0.25;
check("Reject noncanonical mignon increments", validateSiteData(badWeight).some(x => x.includes("0.5 kg")));
const badCapability = structuredClone(site);
badCapability.capabilities.onlineOrdering.enabled = true;
check("Reject enabled ordering with no destination", validateSiteData(badCapability).some(x => x.includes("requires href")));
const badPrice = structuredClone(site);
badPrice.menuItems[0].priceCents = -1;
check("Reject ambiguous or invalid item prices", validateSiteData(badPrice).some(x => x.includes("price source")));
const badDuplicate = structuredClone(site);
badDuplicate.menuItems[1].id = badDuplicate.menuItems[0].id;
check("Reject duplicate product IDs", validateSiteData(badDuplicate).some(x => x.includes("duplicate")));

console.log("PASS", tests, "regression checks; live browser QA and commercial verification still required.");
