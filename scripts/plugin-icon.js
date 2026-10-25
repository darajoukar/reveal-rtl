// Renders plugins/reveal-rtl/.claude-plugin/icon.png (512×512) for the Claude plugin listing.
// PW_CHANNEL=msedge node scripts/plugin-icon.js
import fs from 'node:fs';
import { chromium } from '@playwright/test';

const font = fs.readFileSync( 'fonts/Vazirmatn-Variable.woff2' ).toString( 'base64' );
const browser = await chromium.launch( { channel: process.env.PW_CHANNEL || undefined } );
const page = await browser.newPage( { viewport: { width: 512, height: 512 } } );
await page.setContent( `<!doctype html><html dir="rtl"><style>
	@font-face { font-family: V; src: url(data:font/woff2;base64,${ font }) format('woff2'); font-weight: 100 900; }
	html, body { margin: 0; width: 512px; height: 512px; }
	body { display: grid; place-items: center; background: radial-gradient(circle at 50% 35%, #24305e, #10142a); font-family: V; }
	.screen { width: 360px; height: 250px; border-radius: 26px; background: #faf7f0; display: grid; place-items: center; box-shadow: 0 18px 0 -6px #f2c14e; }
	.screen b { font-size: 132px; font-weight: 800; color: #1d3557; line-height: 1; }
	.screen i { display: block; width: 190px; height: 16px; margin: 18px auto 0; border-radius: 8px; background: #c2410c; }
</style><body><div class="screen"><div><b>ارائه</b><i></i></div></div></body></html>` );
await page.evaluate( () => document.fonts.ready );
await page.screenshot( { path: 'plugins/reveal-rtl/.claude-plugin/icon.png' } );
await browser.close();
console.log( 'plugins/reveal-rtl/.claude-plugin/icon.png' );
