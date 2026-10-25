// Regenerates docs/*.png for the README and landing page. Needs a running server on :3000
// (npm run demo) and a browser: PW_CHANNEL=msedge node scripts/screenshots.js
import { chromium } from '@playwright/test';

const BASE = 'http://localhost:3000/demo/';
const browser = await chromium.launch( { channel: process.env.PW_CHANNEL || undefined } );
const page = await browser.newPage( { viewport: { width: 1280, height: 720 }, deviceScaleFactor: 1 } );

async function shot( url, theme, file, prepare = async () => {} ) {
	await page.goto( BASE + url );
	await page.locator( '.reveal.ready' ).waitFor();
	// Through the toolbar's theme menu, so the menu shows the right name.
	const loaded = page.evaluate( () => new Promise( resolve => document.getElementById( 'theme' ).addEventListener( 'load', resolve, { once: true } ) ) );
	await page.locator( '.rtlui-theme' ).selectOption( `../themes/${ theme }.css` );
	await loaded;
	await page.evaluate( () => document.fonts.ready );
	await page.mouse.move( 640, 360 );
	await prepare();
	await page.waitForTimeout( 800 );
	await page.screenshot( { path: `docs/${ file }` } );
	console.log( `docs/${ file }` );
}

await shot( '#/2', 'parsi-light', 'screenshot-light.png' );
await shot( '#/5', 'parsi-dark', 'screenshot-dark.png', async () => {
	await page.keyboard.press( 'm' );
	await page.locator( '.rtlui-search' ).blur();
} );
await browser.close();
