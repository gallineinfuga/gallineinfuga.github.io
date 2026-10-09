#!/usr/bin/env node
// Zero-dependency source regression checks; run: node scripts/check-visual-contract.mjs
import { readFileSync } from 'node:fs';
import assert from 'node:assert/strict';
const html=readFileSync('index.html','utf8');
const css=readFileSync('styles.css','utf8');
const js=readFileSync('app.js','utf8');
const site=JSON.parse(readFileSync('data/site.json','utf8'));
const check=(ok,msg)=>{assert.ok(ok,msg);console.log('PASS',msg);};
check(html.includes('name="viewport"'),'mobile viewport');
check(html.includes('id="menu-grid"'),'single menu rendering target');
check(css.includes('menu-items--pizza .menu-item') && css.includes('grid-template-columns'),'pizza dual price columns');
check(css.includes(':focus-visible'),'keyboard focus styling');
check(css.includes('prefers-reduced-motion'),'reduced motion');
check(js.includes('site.menuItems') && js.includes('site.menuGroups'),'canonical catalogue used by UI');
check(js.includes('capability?.enabled === true'),'disabled capabilities not falsely clickable');
check(site.menuItems.some(x=>x.id==='nutellosa' && x.categoryId==='dolci'),'Nutellosa in desserts');
check(site.menuGroups.some(x=>x.categoryId==='pizzeria' && /classiche/i.test(x.name?.it||'')),'classic pizza group');
check(site.menuGroups.some(x=>x.categoryId==='pizzeria' && /speciali/i.test(x.name?.it||'')),'special pizza group');
check(site.menuGroups.some(x=>x.categoryId==='pizzeria' && /ma che bont/i.test(x.name?.it||'')),'Ma che Bontà group');
check(site.categories.some(x=>x.id==='rosticceria-palermitana' && x.saleRule==='counter-only'),'counter-only Palermo rosticceria');
console.log('Static contract checks passed; browser layout, deployment and checkout require separate testing.');
