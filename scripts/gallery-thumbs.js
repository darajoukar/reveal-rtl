// Screenshots the first slide of each gallery deck into gallery/<name>/thumb.png.
// Needs `npm run demo` on :3000: PW_CHANNEL=msedge node scripts/gallery-thumbs.js
import fs from 'node:fs';
import { chromium } from '@playwright/test';

const browser = await chromium.launch( { channel: process.env.PW_CHANNEL || undefined } );
const page = await browser.newPage( { viewport: { width: 1280, height: 720 }, deviceScaleFactor: 0.5 } );
for( const name of fs.readdirSync( 'gallery' ).filter( n => fs.existsSync( `gallery/${ n }/index.html` ) ) ) {
	await page.goto( `http://localhost:3000/gallery/${ name }/` );
	await page.locator( '.reveal.ready' ).waitFor();
	await page.addStyleTag( { content: '.rtlui-toolbar, .rtlui-show, .controls, .progress { display: none !important; }' } );
	await page.evaluate( () => document.fonts.ready );
	await page.waitForTimeout( 500 );
	await page.screenshot( { path: `gallery/${ name }/thumb.png` } );
	console.log( `gallery/${ name }/thumb.png` );
}
await browser.close();
