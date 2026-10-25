// Records docs/demo.gif (toolbar, slide list search, pen, laser, theme switch) for the README.
// Needs `npm run demo` running on :3000 and a browser: PW_CHANNEL=msedge node scripts/demo-gif.js
import fs from 'node:fs';
import { chromium } from '@playwright/test';

const BASE = 'http://localhost:3000';
const SIZE = { width: 960, height: 540 };
const browser = await chromium.launch( { channel: process.env.PW_CHANNEL || undefined } );
const page = await browser.newPage( { viewport: SIZE } );
const frames = [];

async function frame( delay = 700 ) {
	await page.waitForTimeout( 450 ); // let transitions settle
	frames.push( { png: ( await page.screenshot() ).toString( 'base64' ), delay } );
}

await page.goto( `${ BASE }/demo/` );
await page.locator( '.reveal.ready' ).waitFor();
// Keep the toolbar visible for the recording (it fades after 3s without mouse movement).
await page.addStyleTag( { content: '.reveal.rtlui-idle .rtlui-toolbar { opacity: 1 !important; }' } );
await page.evaluate( () => document.fonts.ready );
await page.mouse.move( 480, 300 );

await frame( 1600 );
await page.keyboard.press( 'ArrowLeft' );
await page.keyboard.press( 'ArrowLeft' );
await frame( 1200 );

await page.keyboard.press( 'm' );
await frame( 900 );
for( const text of [ 'ج', 'جد', 'جدول' ] ) {
	await page.locator( '.rtlui-search' ).fill( text );
	await frame( 450 );
}
await page.keyboard.press( 'Enter' );
await frame( 1100 );

await page.keyboard.press( 'd' );
await page.mouse.move( 330, 205 );
await page.mouse.down();
for( const x of [ 410, 500, 590, 640 ] ) {
	await page.mouse.move( x, 208, { steps: 4 } );
	await frame( 250 );
}
await page.mouse.up();
await page.keyboard.press( 'd' );
await frame( 900 );

await page.keyboard.press( 'z' );
for( const [ x, y ] of [ [ 380, 270 ], [ 500, 300 ], [ 600, 330 ] ] ) {
	await page.mouse.move( x, y, { steps: 3 } );
	await frame( 350 );
}
await page.keyboard.press( 'z' );

const loaded = page.evaluate( () => new Promise( resolve => document.getElementById( 'theme' ).addEventListener( 'load', resolve, { once: true } ) ) );
await page.locator( '.rtlui-theme' ).selectOption( '../themes/parsi-dark.css' );
await loaded;
await page.mouse.move( 480, 300 );
await frame( 2200 );

// Encode in the browser with gifenc (served from node_modules by the demo server).
const encoder = await browser.newPage();
await encoder.goto( `${ BASE }/` );
const gif = await encoder.evaluate( async ( { frames, width, height } ) => {
	const { GIFEncoder, quantize, applyPalette } = await import( '/node_modules/gifenc/dist/gifenc.esm.js' );
	const canvas = new OffscreenCanvas( width, height );
	const ctx = canvas.getContext( '2d', { willReadFrequently: true } );
	const gif = GIFEncoder();
	for( const { png, delay } of frames ) {
		const bitmap = await createImageBitmap( await ( await fetch( `data:image/png;base64,${ png }` ) ).blob() );
		ctx.drawImage( bitmap, 0, 0 );
		const { data } = ctx.getImageData( 0, 0, width, height );
		const palette = quantize( data, 256 );
		gif.writeFrame( applyPalette( data, palette ), width, height, { palette, delay } );
	}
	gif.finish();
	let binary = '';
	for( const byte of gif.bytes() ) binary += String.fromCharCode( byte );
	return btoa( binary );
}, { frames, ...SIZE } );

fs.writeFileSync( 'docs/demo.gif', Buffer.from( gif, 'base64' ) );
console.log( `docs/demo.gif: ${ frames.length } frames, ${ Math.round( fs.statSync( 'docs/demo.gif' ).size / 1024 ) } KB` );
await browser.close();
