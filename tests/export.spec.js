import fs from 'node:fs/promises';
import { test, expect, openDemo, wake, toolbarButton } from './helpers.js';

async function exportItem( page, label ) {
	await wake( page );
	await toolbarButton( page, 'خروجی گرفتن' ).click();
	const menu = page.locator( '.rtlui-menu' );
	await expect( menu ).toBeVisible();
	return menu.getByRole( 'menuitem', { name: label, exact: true } );
}

async function downloadText( page, label ) {
	const item = await exportItem( page, label );
	const [ download ] = await Promise.all( [ page.waitForEvent( 'download' ), item.click() ] );
	return { name: download.suggestedFilename(), text: await fs.readFile( await download.path(), 'utf8' ) };
}

test( 'export menu has five items and works with the keyboard', async ( { page } ) => {
	await openDemo( page );
	await exportItem( page, 'JSON' );
	await expect( page.locator( '.rtlui-menu-item' ) ).toHaveText( [ 'PDF (چاپ)', 'تصویر این اسلاید (PNG)', 'JSON', 'متن Markdown', 'HTML', 'HTML آفلاین (یک فایل)', 'یادداشت‌های سخنران' ] );
	await expect( page.locator( '.rtlui-menu-item' ).first() ).toBeFocused();
	await page.keyboard.press( 'ArrowDown' );
	await expect( page.locator( '.rtlui-menu-item' ).nth( 1 ) ).toBeFocused();
	await page.keyboard.press( 'Escape' );
	await expect( page.locator( '.rtlui-menu' ) ).toBeHidden();
} );

test( 'JSON export', async ( { page } ) => {
	await openDemo( page );
	const { name, text } = await downloadText( page, 'JSON' );
	expect( name ).toMatch( /\.json$/ );
	const data = JSON.parse( text );
	expect( data.slideCount ).toBe( 8 );
	expect( data.slides[0].notes ).toContain( 'یادداشت سخنران' );
	expect( data.slides.find( s => s.title === 'جدول' ) ).toBeTruthy();
} );

test( 'Markdown export', async ( { page } ) => {
	await openDemo( page );
	const { name, text } = await downloadText( page, 'متن Markdown' );
	expect( name ).toMatch( /\.md$/ );
	expect( text ).toMatch( /^# ارائه‌ی راست‌به‌چپ/ );
	expect( text ).toContain( '\n---\n' );
	expect( text ).toContain( 'Note: ' );
	expect( text ).toContain( '| ویژگی | وضعیت |' );
} );

test( 'HTML export is the original page with absolute URLs and no toolbar', async ( { page } ) => {
	await openDemo( page );
	const { name, text } = await downloadText( page, 'HTML' );
	expect( name ).toMatch( /\.html$/ );
	expect( text ).toMatch( /^<!doctype html>/ );
	expect( text ).toMatch( /src="http:\/\/localhost:\d+\/dist\/reveal-rtl\.js"/ );
	expect( text ).not.toContain( 'rtlui-toolbar' );
	expect( text ).toContain( 'Reveal.initialize' );
} );

test( 'offline HTML export is one file that runs with the network blocked', async ( { page, browser } ) => {
	await openDemo( page );
	page.on( 'dialog', dialog => { throw new Error( `unexpected alert: ${ dialog.message() }` ); } );
	const item = await exportItem( page, 'HTML آفلاین (یک فایل)' );
	const [ download ] = await Promise.all( [ page.waitForEvent( 'download' ), item.click() ] );
	expect( download.suggestedFilename() ).toMatch( /-offline\.html$/ );
	const file = await download.path();
	const html = await fs.readFile( file, 'utf8' );
	expect( html ).not.toMatch( /<link[^>]+stylesheet/ );
	expect( html ).not.toMatch( /<script[^>]+src=/ );
	expect( html ).toContain( 'data:font/woff2;base64,' );

	// Fresh context with every network request refused: everything must come from the file itself.
	const offline = await browser.newContext();
	await offline.route( /^https?:/, route => route.abort() );
	const view = await offline.newPage();
	const copy = test.info().outputPath( 'offline.html' );
	await fs.copyFile( file, copy );
	await view.goto( 'file:///' + copy.replace( /\\/g, '/' ) );
	await view.locator( '.reveal.ready' ).waitFor();
	await expect( view.locator( '.reveal' ) ).toHaveClass( /\brtl\b/ );
	await expect( view.locator( '.rtlui-toolbar' ) ).toBeAttached();
	await expect( view.locator( '.slide-number' ) ).toHaveText( /۱ \/ ۸/ );
	expect( await view.evaluate( async () => { await document.fonts.ready; return document.fonts.check( '40px Vazirmatn', 'ارائه' ); } ) ).toBe( true );
	await offline.close();
} );

test( 'speaker notes export', async ( { page } ) => {
	await openDemo( page );
	const { name, text } = await downloadText( page, 'یادداشت‌های سخنران' );
	expect( name ).toMatch( /-notes\.txt$/ );
	expect( text ).toMatch( /^یادداشت‌های سخنران:/ );
	expect( text ).toContain( '1. ارائه‌ی راست‌به‌چپ' );
} );

test( 'PDF export opens the print view and prints it', async ( { page, context } ) => {
	await context.addInitScript( () => {
		window.print = () => { window.__printed = true; };
	} );
	await openDemo( page );
	const item = await exportItem( page, 'PDF (چاپ)' );
	const [ popup ] = await Promise.all( [ page.waitForEvent( 'popup' ), item.click() ] );
	await popup.waitForFunction( () => window.__printed === true, null, { timeout: 15_000 } );
	expect( popup.url() ).toContain( 'print-pdf' );
	await expect( popup.locator( 'html' ) ).toHaveClass( /print-pdf/ );
	await expect( popup.locator( '.pdf-page' ) ).toHaveCount( 8 );
	await expect( popup.locator( '.slide-number-pdf' ).first() ).toHaveText( '۱' );
	await expect( popup.locator( '.rtlui-toolbar' ) ).toHaveCount( 0 );
} );

test( 'slide image export: PNG of the slide with the pen drawing, without the toolbar', async ( { page } ) => {
	await openDemo( page );
	await page.keyboard.press( 'd' );
	await page.mouse.move( 300, 120 );
	await page.mouse.down();
	await page.mouse.move( 700, 130, { steps: 8 } );
	await page.mouse.up();
	await page.keyboard.press( 'd' );

	const item = await exportItem( page, 'تصویر این اسلاید (PNG)' );
	const [ download ] = await Promise.all( [ page.waitForEvent( 'download' ), item.click() ] );
	expect( download.suggestedFilename() ).toMatch( /-slide-1\.png$/ );
	const png = ( await fs.readFile( await download.path() ) ).toString( 'base64' );

	// Decode in the page and sample pixels: red ink on the stroke, no toolbar at the bottom center.
	const viewport = page.viewportSize();
	const sample = await page.evaluate( async ( { png, viewport } ) => {
		const bitmap = await createImageBitmap( await ( await fetch( `data:image/png;base64,${ png }` ) ).blob() );
		const canvas = new OffscreenCanvas( bitmap.width, bitmap.height );
		const ctx = canvas.getContext( '2d' );
		ctx.drawImage( bitmap, 0, 0 );
		const sx = bitmap.width / viewport.width, sy = bitmap.height / viewport.height;
		const at = ( x, y ) => [ ...ctx.getImageData( Math.round( x * sx ), Math.round( y * sy ), 1, 1 ).data ];
		const toolbar = document.querySelector( '.rtlui-toolbar' ).getBoundingClientRect();
		return { width: bitmap.width, height: bitmap.height, ink: at( 500, 125 ), toolbarSpot: at( toolbar.left + 20, toolbar.top + toolbar.height / 2 ), background: at( 10, viewport.height / 2 ) };
	}, { png, viewport } );

	expect( sample.width / sample.height ).toBeCloseTo( viewport.width / viewport.height, 1 );
	const [ r, g, b ] = sample.ink;
	expect( r > 180 && g < 120 && b < 120 ).toBe( true ); // pen red
	expect( sample.toolbarSpot.slice( 0, 3 ) ).toEqual( sample.background.slice( 0, 3 ) ); // toolbar hidden
	await expect( page.locator( '.reveal' ) ).not.toHaveClass( /rtlui-capturing/ );
} );

test( 'offline HTML inlines slide background images and lazy images', async ( { page } ) => {
	await page.goto( '/demo/media.html' );
	await page.locator( '.reveal.ready' ).waitFor();
	await page.addStyleTag( { content: '.reveal.rtlui-idle .rtlui-toolbar { opacity: 1 !important; pointer-events: auto !important; }' } );
	page.on( 'dialog', dialog => { throw new Error( `unexpected alert: ${ dialog.message() }` ); } );
	const item = await exportItem( page, 'HTML آفلاین (یک فایل)' );
	const [ download ] = await Promise.all( [ page.waitForEvent( 'download' ), item.click() ] );
	const html = await fs.readFile( await download.path(), 'utf8' );
	expect( html ).toMatch( /data-background-image="data:image\/svg\+xml;base64,/ );
	expect( html ).toMatch( /data-src="data:image\/svg\+xml;base64,/ );
	expect( html ).not.toContain( 'images/pattern.svg' );
	expect( html ).not.toContain( 'images/illustration.svg' );
} );

test( 'plain HTML export makes background paths absolute', async ( { page } ) => {
	await page.goto( '/demo/media.html' );
	await page.locator( '.reveal.ready' ).waitFor();
	await page.addStyleTag( { content: '.reveal.rtlui-idle .rtlui-toolbar { opacity: 1 !important; pointer-events: auto !important; }' } );
	const item = await exportItem( page, 'HTML' );
	const [ download ] = await Promise.all( [ page.waitForEvent( 'download' ), item.click() ] );
	const html = await fs.readFile( await download.path(), 'utf8' );
	expect( html ).toMatch( /data-background-image="http:\/\/localhost:\d+\/demo\/images\/pattern\.svg"/ );
	expect( html ).toMatch( /data-src="http:\/\/localhost:\d+\/demo\/images\/illustration\.svg"/ );
} );
