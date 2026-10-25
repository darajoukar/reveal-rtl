// Renders docs/social-preview.png (1280×640) for GitHub Settings → Social preview.
// PW_CHANNEL=msedge node scripts/social-preview.js
import fs from 'node:fs';
import { chromium } from '@playwright/test';

const b64 = file => fs.readFileSync( file ).toString( 'base64' );
const browser = await chromium.launch( { channel: process.env.PW_CHANNEL || undefined } );
const page = await browser.newPage( { viewport: { width: 1280, height: 640 } } );
await page.setContent( `<!doctype html><html><style>
	@font-face { font-family: V; src: url(data:font/woff2;base64,${ b64( 'fonts/Vazirmatn-Variable.woff2' ) }) format('woff2'); font-weight: 100 900; }
	html, body { margin: 0; width: 1280px; height: 640px; overflow: hidden; }
	body { font-family: V, sans-serif; background: radial-gradient(circle at 75% 30%, #24305e, #10142a 70%); color: #e7e5df; display: flex; align-items: center; gap: 56px; padding: 0 64px; box-sizing: border-box; }
	.shot { flex: none; width: 560px; border-radius: 16px; box-shadow: 0 24px 60px rgb(0 0 0 / 0.5); border: 1px solid #2b3358; }
	.text { direction: rtl; text-align: right; flex: 1; }
	h1 { margin: 0; font-size: 84px; font-weight: 800; color: #f2c14e; direction: ltr; text-align: right; letter-spacing: -1px; }
	.fa { margin: 6px 0 0; font-size: 40px; font-weight: 700; }
	.ar { margin: 8px 0 0; font-size: 26px; color: #a9abb8; }
	.en { margin: 8px 0 0; font-size: 24px; color: #a9abb8; direction: ltr; text-align: right; }
	code { display: inline-block; margin-top: 28px; padding: 10px 18px; border-radius: 10px; background: #0b0f20; border: 1px solid #2b3358; font: 24px ui-monospace, Consolas, monospace; color: #e7e5df; direction: ltr; }
</style><body>
	<img class="shot" src="data:image/png;base64,${ b64( 'docs/screenshot-dark.png' ) }">
	<div class="text">
		<h1>reveal-rtl</h1>
		<p class="fa">ارائه‌ی راست‌به‌چپ با reveal.js</p>
		<p class="ar" lang="ar">عروض تقديمية من اليمين إلى اليسار</p>
		<p class="en">Persian &amp; Arabic presentations</p>
		<code>npm create reveal-rtl</code>
	</div>
</body></html>` );
await page.evaluate( () => document.fonts.ready );
await page.screenshot( { path: 'docs/social-preview.png' } );
await browser.close();
console.log( `docs/social-preview.png ${ Math.round( fs.statSync( 'docs/social-preview.png' ).size / 1024 ) } KB` );
