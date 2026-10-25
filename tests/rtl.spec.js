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

test( 'bundled Vazirmatn font loads without Google Fonts', async ( { page } ) => {
	await openDemo( page );
	await expect.poll( () => page.evaluate( async () => {
		await document.fonts.ready;
		return document.fonts.check( '700 40px Vazirmatn', 'ارائه' );
	} ) ).toBe( true );
	expect( await page.evaluate( () => [ ...document.fonts ].some( f => f.family.includes( 'Vazirmatn' ) && f.status === 'loaded' ) ) ).toBe( true );
} );

test( 'left arrow goes to the next slide in RTL', async ( { page } ) => {
	await openDemo( page );
	await page.keyboard.press( 'ArrowLeft' );
	await expect.poll( () => slideIndex( page ) ).toBe( 1 );
	await page.keyboard.press( 'ArrowRight' );
	await expect.poll( () => slideIndex( page ) ).toBe( 0 );
} );

test( 'keyboard help overlay is Persian and RTL', async ( { page } ) => {
	await openDemo( page );
	await page.keyboard.press( 'Shift+Slash' );
	const help = page.locator( '.r-overlay-help-content' );
	await expect( help ).toBeVisible();
	await expect( help ).toHaveAttribute( 'dir', 'rtl' );
	await expect( help.locator( '.title' ) ).toHaveText( 'میان‌برهای صفحه‌کلید' );
	await expect( help ).toContainText( 'اسلاید بعدی' );
	await expect( help ).toContainText( 'فهرست اسلایدها' ); // the UI plugin's own M binding
	await expect( help ).not.toContainText( 'Next slide' );
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

test( 'jump to slide (G) accepts Persian digits and has a Persian placeholder', async ( { page } ) => {
	await openDemo( page );
	await page.keyboard.press( 'g' );
	const input = page.locator( '.jump-to-slide-input' );
	await expect( input ).toHaveAttribute( 'placeholder', 'رفتن به اسلاید (شماره یا متن)' );
	await input.pressSequentially( '۶' );
	await expect( input ).toHaveJSProperty( 'value', '6' );
	await page.keyboard.press( 'Enter' );
	await expect.poll( () => slideIndex( page ) ).toBe( 5 );
} );

test( 'Arabic UI: labels, Arabic-Indic digits, help and jump placeholder', async ( { page } ) => {
	await openDemo( page, '?lang=ar' );
	await expect( page.locator( '.reveal' ) ).toHaveAttribute( 'lang', 'ar' );
	await expect( page.locator( '.rtlui-toolbar' ).getByRole( 'button', { name: 'الشريحة الأولى', exact: true } ) ).toBeAttached();
	await expect( page.locator( '.slide-number' ) ).toHaveText( /^\s*١ \/ ٨\s*$/ );
	await page.evaluate( () => Reveal.slide( 3 ) );
	await expect( page.locator( '.slides > section.present ol' ) ).toHaveCSS( 'list-style-type', 'arabic-indic' );
	await page.keyboard.press( 'Shift+Slash' );
	await expect( page.locator( '.r-overlay-help-content .title' ) ).toHaveText( 'اختصارات لوحة المفاتيح' );
	await page.keyboard.press( 'Escape' );
	await page.keyboard.press( 'g' );
	await expect( page.locator( '.jump-to-slide-input' ) ).toHaveAttribute( 'placeholder', 'الانتقال إلى شريحة (رقم أو نص)' );
} );

test( 'English UI keeps Latin digits and reveal.js help, with RTL arrow hints', async ( { page } ) => {
	await openDemo( page, '?lang=en' );
	await expect( page.locator( '.rtlui-toolbar' ).getByRole( 'button', { name: 'First slide', exact: true } ) ).toBeAttached();
	// Latin digits: reveal.js renders the number itself, in separate spans (whitespace-normalized match).
	await expect( page.locator( '.slide-number' ) ).toHaveText( '1 / 8' );
	await expect( page.locator( 'time[data-jalali]' ) ).toHaveText( /\d{4}/ );
	await page.keyboard.press( 'Shift+Slash' );
	await expect( page.locator( '.r-overlay-help-content' ) ).toContainText( 'Next slide' );
	await expect( page.locator( '.r-overlay-help-content' ) ).toContainText( 'Left: next slide' );
} );

test( 'digits option overrides the language default', async ( { page } ) => {
	await openDemo( page, '?lang=fa&digits=latin' );
	await expect( page.locator( '.rtlui-toolbar' ).getByRole( 'button', { name: 'اولین اسلاید', exact: true } ) ).toBeAttached();
	await expect( page.locator( '.slide-number' ) ).toHaveText( '1 / 8' );
	await expect( page.locator( 'li', { hasText: 'اعداد فارسی' } ) ).toContainText( '1404' );
} );

test( 'Markdown demo: slides, notes and RTL from Markdown', async ( { page } ) => {
	await page.goto( '/demo/markdown.html' );
	await page.locator( '.reveal.ready' ).waitFor();
	expect( await page.evaluate( () => Reveal.getTotalSlides() ) ).toBe( 7 );
	await expect( page.locator( '.slide-number' ) ).toHaveText( /۱ \/ ۷/ );
	await expect( page.locator( '.rtlui-item' ) ).toHaveCount( 7 );
	await expect( page.locator( 'li', { hasText: 'اعداد' } ) ).toContainText( '۲۰۲۶' );
	await expect( page.locator( 'pre code' ) ).toContainText( '42' );
	await expect( page.locator( 'aside.notes' ).first() ).toContainText( 'یادداشت سخنران' );
} );

test( 'Hijri date in each language', async ( { page } ) => {
	await openDemo( page );
	await expect( page.locator( 'time[data-hijri]' ) ).toHaveText( /[۰-۹]{4}/ );
	await openDemo( page, '?lang=ar' );
	await expect( page.locator( 'time[data-hijri]' ) ).toHaveText( /[٠-٩]{4} هـ/ );
	await openDemo( page, '?lang=en' );
	await expect( page.locator( 'time[data-hijri]' ) ).toHaveText( /\d{4} AH/ );
} );
