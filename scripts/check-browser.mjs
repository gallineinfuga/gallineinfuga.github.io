#!/usr/bin/env node
// Browser smoke checks on the real page, including mobile viewport and menu interaction.
import { chromium } from 'playwright';
import { spawn } from 'node:child_process';
import { mkdirSync } from 'node:fs';
import assert from 'node:assert/strict';
const server=spawn('python3',['-m','http.server','8769','--bind','127.0.0.1'],{stdio:'ignore'});
const browser=await chromium.launch({headless:true});
const widths=[320,375,390,768,1280];
try {
  mkdirSync('artifacts',{recursive:true});
  for(let i=0;i<30;i++){try{const r=await fetch('http://127.0.0.1:8769/');if(r.ok)break;}catch{}await new Promise(r=>setTimeout(r,250));}
  for(const width of widths){
    const page=await browser.newPage({viewport:{width,height:850},deviceScaleFactor:1});
    const errors=[];page.on('pageerror',e=>errors.push(e.message));
    await page.goto('http://127.0.0.1:8769/',{waitUntil:'networkidle'});
    await page.locator('#menu-grid details').first().locator('summary').click();
    assert.ok(await page.locator('#menu-grid details').first().getAttribute('open')!==null,'accordion opens');
    const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>window.innerWidth+1);
    assert.equal(overflow,false,`horizontal overflow at ${width}px`);
    assert.deepEqual(errors,[],`browser errors at ${width}px`);
    await page.screenshot({path:`artifacts/menu-${width}.png`,fullPage:true});
    console.log(`PASS mobile/desktop ${width}px`);
    await page.close();
  }
} finally {await browser.close();server.kill();}
