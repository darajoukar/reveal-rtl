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
