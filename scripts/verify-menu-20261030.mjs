import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { pizzaPriceCents, validateSiteData } from "../domain.js";
const site=JSON.parse(readFileSync(new URL("../data/site.json",import.meta.url),"utf8"));
assert.deepEqual(validateSiteData(site),[]);
assert.equal(site.menuItems.length,43);
assert.equal(site.menuItems.filter(x=>x.categoryId==="pizzeria").length,21);
assert.equal(site.menuItems.filter(x=>x.categoryId==="bevande").length,11);
for(const retired of ["rustica","pistacchiosa","la-migliore"]) assert(!site.menuItems.some(x=>x.id===retired));
assert.equal(site.menuItems.find(x=>x.id==="mezzo-pollo").priceCents,700);
assert.equal(site.menuItems.find(x=>x.id==="pollo-intero").priceCents,1400);
assert(!/pomodorini|cherry tomatoes/i.test(JSON.stringify(site.menuItems.find(x=>x.id==="bufalina"))));
assert.equal(site.menuItems.find(x=>x.id==="acqua").priceCents,100);
assert(!site.menuItems.some(x=>x.id==="birre-assortite"));
assert.equal(site.capabilities.onlineOrdering.enabled,false);
assert.equal(site.capabilities.whatsapp.enabled,true);
const special=site.menuGroups.find(x=>x.id==="special");
for(const [date,r,f] of [["2026-10-30T12:00:00Z",600,1200],["2026-10-31T12:00:00Z",750,1500],["2026-11-02T12:00:00Z",600,1200]]){
assert.equal(pizzaPriceCents(site,special,"normale",new Date(date)),r);
assert.equal(pizzaPriceCents(site,special,"familiare",new Date(date)),f);
}
console.log("PASS menu 30/10: 43 voci, 21 pizze, 11 bevande, prezzi Rome e ordini inattivi.");

import { readFileSync as readFile } from "node:fs";
const hubHtml=readFile(new URL("../index.html", import.meta.url),"utf8");
const links=JSON.parse(readFile(new URL("../config/links.json", import.meta.url),"utf8"));
assert.equal(site.hours.sunday,"hours-pending");
assert(hubHtml.includes("domenica aperto, orario da confermare"));
assert(!hubHtml.includes("091 673 4874") && !hubHtml.includes("0916734874"));
assert(hubHtml.includes('href="tel:+393337309933"'));
const activeSocial=links.items.filter(x=>x.enabled && ["instagram","facebook"].includes(x.type));
assert.equal(activeSocial.length,2);
assert.equal(activeSocial.find(x=>x.id==="instagram")?.url,"https://www.instagram.com/gallineinfugapalermo/");
assert.equal(activeSocial.find(x=>x.id==="facebook")?.url,"https://www.facebook.com/people/Galline-in-Fuga/61591158700839/");
assert(!links.items.some(x=>x.type==="tiktok" && x.enabled));
console.log("PASS official contact, Sunday status and source-verified social links.");
