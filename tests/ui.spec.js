import { test, expect, openDemo, reloadDemo, wake, toolbarButton, slideIndex } from './helpers.js';

test( 'slide list opens with M, search filters (Arabic letters and Persian digits), click navigates', async ( { page } ) => {
	await openDemo( page );
	await page.keyboard.press( 'm' );
	const panel = page.locator( '.rtlui-panel' );
	await expect( panel ).toBeVisible();
	await expect( page.locator( '.rtlui-search' ) ).toBeFocused();

	await page.locator( '.rtlui-search' ).fill( 'جدول' );
	await expect( page.locator( '.rtlui-list li:visible' ) ).toHaveCount( 1 );

	await page.locator( '.rtlui-search' ).fill( 'زيراسلايد' ); // Arabic yeh
	await expect( page.locator( '.rtlui-list li:visible' ) ).toHaveCount( 1 );
	await page.locator( '.rtlui-search' ).fill( 'كد و' ); // Arabic kaf
	await expect( page.locator( '.rtlui-list li:visible' ) ).toHaveCount( 1 );

	await page.locator( '.rtlui-search' ).fill( '' );
	await page.locator( '.rtlui-item', { hasText: 'جدول' } ).click();
	await expect( panel ).toBeHidden();
	await expect.poll( () => slideIndex( page ) ).toBe( 5 );
	await expect( page.locator( '.rtlui-item-current' ) ).toContainText( 'جدول' );
} );

test( 'first, last and grid view buttons', async ( { page } ) => {
	await openDemo( page );
	await toolbarButton( page, 'آخرین اسلاید' ).click();
	await expect.poll( () => slideIndex( page ) ).toBe( 6 );
	await wake( page );
	await toolbarButton( page, 'اولین اسلاید' ).click();
	await expect.poll( () => slideIndex( page ) ).toBe( 0 );

	await wake( page );
	const grid = toolbarButton( page, 'نمای شبکه‌ای (Esc)' );
	await grid.click();
	await expect( page.locator( '.reveal' ) ).toHaveClass( /\boverview\b/ );
	await expect( grid ).toHaveAttribute( 'aria-pressed', 'true' );
	await page.keyboard.press( 'Escape' );
	await expect( page.locator( '.reveal' ) ).not.toHaveClass( /\boverview\b/ );
} );

test( 'zoom in, out, reset and limits', async ( { page } ) => {
	await openDemo( page );
	const value = page.locator( '.rtlui-zoom-value' );
	const zoomVar = () => page.locator( '.reveal' ).evaluate( el => el.style.getPropertyValue( '--rtlui-zoom' ) );

	await toolbarButton( page, 'بزرگ‌نمایی' ).click();
	await toolbarButton( page, 'بزرگ‌نمایی' ).click();
	await expect( value ).toHaveText( '۱۲۰%' );
	expect( await zoomVar() ).toBe( '1.2' );

	for( let i = 0; i < 12; i++ ) await toolbarButton( page, 'کوچک‌نمایی' ).click();
	await expect( value ).toHaveText( '۵۰%' );

	await value.click();
	await expect( value ).toHaveText( '۱۰۰%' );
} );

test( 'timer keeps running across a page refresh and stays paused when paused', async ( { page } ) => {
	await openDemo( page );
	await toolbarButton( page, 'شروع تایمر' ).click();
	await page.waitForTimeout( 2100 );
	await reloadDemo( page );
	await wake( page );
	await expect( toolbarButton( page, 'توقف تایمر' ) ).toBeVisible();
	await expect( page.locator( '.rtlui-timer' ) ).not.toHaveText( '۰:۰۰' );

	await toolbarButton( page, 'توقف تایمر' ).click();
	const paused = await page.locator( '.rtlui-timer' ).textContent();
	await reloadDemo( page );
	await page.waitForTimeout( 1200 );
	await expect( page.locator( '.rtlui-timer' ) ).toHaveText( paused );
	await expect( toolbarButton( page, 'شروع تایمر' ) ).toBeAttached();
} );

test( 'theme choice is applied and remembered', async ( { page } ) => {
	await openDemo( page );
	await page.locator( '.rtlui-theme' ).selectOption( { label: 'مشکی' } );
	await expect( page.locator( '#theme' ) ).toHaveAttribute( 'href', /black\.css$/ );
	await reloadDemo( page );
	await expect( page.locator( '#theme' ) ).toHaveAttribute( 'href', /black\.css$/ );
	await expect( page.locator( '.rtlui-theme' ) ).toHaveValue( /black\.css$/ );
} );

test( 'toolbar hides to a handle with the button or T, and is remembered', async ( { page } ) => {
	await openDemo( page );
	await toolbarButton( page, 'پنهان کردن نوار ابزار (T)' ).click();
	await expect( page.locator( '.rtlui-toolbar' ) ).toBeHidden();
	const show = page.locator( '.rtlui-show' );
	await expect( show ).toBeVisible();

	await reloadDemo( page );
	await expect( page.locator( '.rtlui-toolbar' ) ).toBeHidden();

	await page.keyboard.press( 't' );
	await wake( page );
	await expect( page.locator( '.rtlui-toolbar' ) ).toBeVisible();
	await expect( show ).toBeHidden();
} );

test( 'notes button toggles notes on the slide', async ( { page } ) => {
	await openDemo( page );
	const button = toolbarButton( page, 'نمایش یادداشت‌ها' );
	await button.click();
	await expect( button ).toHaveAttribute( 'aria-pressed', 'true' );
	await expect( page.locator( '.speaker-notes' ) ).toBeVisible();
	await expect( page.locator( '.speaker-notes' ) ).toContainText( 'یادداشت سخنران' );
} );

test( 'speaker view button opens the speaker popup', async ( { page } ) => {
	await openDemo( page );
	const [ popup ] = await Promise.all( [ page.waitForEvent( 'popup' ), toolbarButton( page, 'پنجره‌ی سخنران (S)' ).click() ] );
	await popup.locator( '#reveal-rtl-speaker' ).waitFor( { state: 'attached' } );
} );

test( 'fullscreen button enters and leaves fullscreen', async ( { page } ) => {
	await openDemo( page );
	await toolbarButton( page, 'تمام‌صفحه' ).click();
	await expect.poll( () => page.evaluate( () => !!document.fullscreenElement ) ).toBe( true );
	await wake( page );
	await toolbarButton( page, 'تمام‌صفحه' ).click();
	await expect.poll( () => page.evaluate( () => !!document.fullscreenElement ) ).toBe( false );
} );
