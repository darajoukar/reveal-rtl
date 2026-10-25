import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { test, expect } from './helpers.js';

test( 'landing page switches between Persian, Arabic and English', async ( { page } ) => {
	await page.goto( '/' );
	await expect( page.locator( 'html' ) ).toHaveAttribute( 'dir', 'rtl' );
	await expect( page.locator( 'h1' ) ).toHaveText( 'ارائه‌ی راست‌به‌چپ با reveal.js' );

	await page.getByRole( 'button', { name: 'English' } ).click();
	await expect( page.locator( 'html' ) ).toHaveAttribute( 'dir', 'ltr' );
	await expect( page.locator( 'h1' ) ).toHaveText( 'Right-to-left presentations with reveal.js' );

	await page.reload();
	await expect( page.locator( 'html' ) ).toHaveAttribute( 'lang', 'en' ); // remembered

	await page.goto( '/?lang=ar' );
	await expect( page.locator( 'h1' ) ).toHaveText( 'عروض تقديمية من اليمين إلى اليسار مع reveal.js' );
	await expect( page.getByRole( 'link', { name: 'شاهد العرض التجريبي' } ) ).toHaveAttribute( 'href', 'demo/' );
	for( const img of await page.locator( '.shots img' ).all() ) {
		expect( await img.evaluate( el => el.complete && el.naturalWidth > 0 ) ).toBe( true );
	}
} );

test( 'npm create reveal-rtl output opens and runs (reveal-rtl CDN served from this repo)', async ( { page, context } ) => {
	const { createPresentation } = await import( '../create-reveal-rtl/index.js' );
	const target = test.info().outputPath( 'talk' );
	createPresentation( target, { lang: 'fa' } );
	// Not published yet when this runs: point the reveal-rtl CDN range at the local files.
	await context.route( /^https:\/\/cdn\.jsdelivr\.net\/npm\/reveal-rtl@[\d.]+\/(.+)$/, route => {
		const file = route.request().url().match( /reveal-rtl@[\d.]+\/(.+)$/ )[1];
		return route.fulfill( { path: path.resolve( file ) } );
	} );
	await page.goto( pathToFileURL( path.join( target, 'index.html' ) ).href );
	await page.locator( '.reveal.ready' ).waitFor();
	await expect( page.locator( '.reveal' ) ).toHaveClass( /\brtl\b/ );
	expect( await page.evaluate( () => Reveal.getTotalSlides() ) ).toBe( 3 );
	await expect( page.locator( '.slide-number' ) ).toHaveText( /۱ \/ ۳/ );
	await expect( page.locator( '.rtlui-toolbar' ) ).toBeAttached();
} );
