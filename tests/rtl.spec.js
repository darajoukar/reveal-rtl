import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { test, expect, openDemo, slideIndex } from './helpers.js';

test( 'deck is RTL with Persian digits, Jalali date and Latin digits in code', async ( { page } ) => {
	await openDemo( page );
	await expect( page.locator( '.reveal' ) ).toHaveClass( /\brtl\b/ );
	await expect( page.locator( '.slide-number' ) ).toHaveText( /^\s*۱ \/ ۸\s*$/ );
	await expect( page.locator( 'time[data-jalali]' ) ).toHaveText( /[۰-۹]{4}/ );
	await expect( page.locator( 'pre code' ) ).toContainText( '123' );
	await expect( page.locator( 'li', { hasText: 'اعداد فارسی' } ) ).toContainText( '۱۴۰۴' );
} );

test( 'left arrow goes to the next slide in RTL', async ( { page } ) => {
	await openDemo( page );
	await page.keyboard.press( 'ArrowLeft' );
	await expect.poll( () => slideIndex( page ) ).toBe( 1 );
	await page.keyboard.press( 'ArrowRight' );
	await expect.poll( () => slideIndex( page ) ).toBe( 0 );
} );

test( 'on-slide notes are RTL with a Persian label', async ( { page } ) => {
	await openDemo( page );
	await page.evaluate( () => Reveal.configure( { showNotes: true } ) );
	const notes = page.locator( '.speaker-notes' );
	await expect( notes ).toBeVisible();
	await expect( notes ).toHaveCSS( 'direction', 'rtl' );
	expect( await notes.evaluate( el => getComputedStyle( el, '::before' ).content ) ).toBe( '"یادداشت‌ها"' );
} );

test( 'speaker view popup is mirrored with Persian labels', async ( { page } ) => {
	await openDemo( page );
	const [ popup ] = await Promise.all( [ page.waitForEvent( 'popup' ), page.keyboard.press( 's' ) ] );
	await popup.locator( '#reveal-rtl-speaker' ).waitFor( { state: 'attached' } );
	await expect( popup.locator( '#upcoming-slide .label' ) ).toHaveText( 'اسلاید بعدی' );
	await expect( popup.locator( '.speaker-controls-notes .label' ) ).toHaveText( 'یادداشت‌ها' );
	await expect( popup.locator( '.speaker-layout-label' ) ).toHaveText( /^چیدمان:/ );
	await expect( popup.locator( '#current-slide' ) ).toHaveCSS( 'right', '0px' );
	await expect( popup.locator( '.clock-value' ) ).toHaveText( /[۰-۹]/ );
} );

test( 'demo works when opened from disk (file://)', async ( { page } ) => {
	await page.goto( pathToFileURL( path.resolve( 'demo/index.html' ) ).href );
	await page.locator( '.reveal.ready' ).waitFor();
	await expect( page.locator( '.reveal' ) ).toHaveClass( /\brtl\b/ );
	await expect( page.locator( '.rtlui-toolbar' ) ).toBeAttached();
	await expect( page.locator( '.rtlui-item' ) ).toHaveCount( 8 );
} );
