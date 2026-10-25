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

test( 'timer counts down from a set duration, warns, goes negative and remembers the duration', async ( { page } ) => {
	await openDemo( page );
	page.once( 'dialog', dialog => dialog.accept( '۰.۰۵' ) ); // 3 seconds, typed with Persian digits
	const timer = page.locator( '.rtlui-timer' );
	await timer.click();
	await expect( timer ).toHaveText( '۰:۰۳' );
	await expect( timer ).toHaveAttribute( 'aria-label', /زمان باقی‌مانده/ );

	await toolbarButton( page, 'شروع تایمر' ).click();
	await expect( timer ).toHaveClass( /rtlui-timer-warn/, { timeout: 5000 } );
	await expect( timer ).toHaveClass( /rtlui-timer-over/, { timeout: 5000 } );
	await expect( timer ).toHaveText( /^-/ );

	await reloadDemo( page );
	await expect( timer ).toHaveClass( /rtlui-timer-over/ );

	page.once( 'dialog', dialog => dialog.accept( '' ) ); // back to counting up
	await timer.click();
	await expect( timer ).not.toHaveClass( /rtlui-timer-(warn|over)/ );
	await expect( timer ).not.toHaveText( /^-/ );
} );

test( 'pen draws on the slide, E erases, drawings are per slide; laser follows the mouse', async ( { page } ) => {
	await openDemo( page );
	const inked = () => page.evaluate( () => {
		const canvas = document.querySelector( '.rtlui-canvas' );
		const data = canvas.getContext( '2d' ).getImageData( 0, 0, canvas.width, canvas.height ).data;
		for( let i = 3; i < data.length; i += 4 ) if( data[i] ) return true;
		return false;
	} );

	await page.keyboard.press( 'd' );
	await expect( toolbarButton( page, 'قلم (D)' ) ).toHaveAttribute( 'aria-pressed', 'true' );
	await page.mouse.move( 200, 150 );
	await page.mouse.down();
	await page.mouse.move( 500, 180, { steps: 5 } );
	await page.mouse.up();
	expect( await inked() ).toBe( true );

	await page.keyboard.press( 'ArrowLeft' ); // next slide: its own (empty) drawing
	await expect.poll( inked ).toBe( false );
	await page.keyboard.press( 'ArrowRight' );
	await expect.poll( inked ).toBe( true );
	await page.keyboard.press( 'e' );
	await expect.poll( inked ).toBe( false );

	await page.keyboard.press( 'z' );
	await expect( page.locator( '.reveal' ) ).toHaveClass( /rtlui-laser-on/ );
	await expect( toolbarButton( page, 'قلم (D)' ) ).toHaveAttribute( 'aria-pressed', 'false' );
	await page.mouse.move( 300, 300 );
	await expect( page.locator( '.rtlui-laser' ) ).toBeVisible();
	await page.keyboard.press( 'z' );
	await expect( page.locator( '.rtlui-laser' ) ).toBeHidden();
} );

test( 'hovering a slide in the list shows its preview', async ( { page } ) => {
	await openDemo( page );
	await page.keyboard.press( 'm' );
	await page.locator( '.rtlui-item', { hasText: 'جدول' } ).hover();
	const preview = page.locator( '.rtlui-preview' );
	await expect( preview ).toBeVisible();
	await expect( preview ).toContainText( 'ویژگی' );
	await expect( preview.locator( 'aside.notes' ) ).toHaveCount( 0 );
	await page.keyboard.press( 'Escape' );
	await expect( preview ).toBeHidden();
} );

test( 'pen drawings survive a reload and appear on the PDF print pages', async ( { page } ) => {
	await openDemo( page );
	await page.keyboard.press( 'd' );
	await page.mouse.move( 300, 200 );
	await page.mouse.down();
	await page.mouse.move( 600, 260, { steps: 6 } );
	await page.mouse.up();
	await page.keyboard.press( 'd' );

	const saved = await page.evaluate( () => JSON.parse( localStorage.getItem( 'reveal-rtl-ui:drawings:/demo/' ) ) );
	expect( Object.keys( saved ) ).toEqual( [ '0/0' ] );
	// Strokes are stored relative to the slide box (0..1).
	expect( saved['0/0'][0].flat().every( n => n >= 0 && n <= 1 ) ).toBe( true );

	const inked = () => page.evaluate( () => {
		const canvas = document.querySelector( '.rtlui-canvas' );
		const data = canvas.getContext( '2d' ).getImageData( 0, 0, canvas.width, canvas.height ).data;
		for( let i = 3; i < data.length; i += 4 ) if( data[i] ) return true;
		return false;
	} );
	await reloadDemo( page );
	await expect.poll( inked ).toBe( true );

	await page.goto( '/demo/?print-pdf' );
	await page.locator( '.pdf-page' ).first().waitFor();
	const printCanvas = page.locator( '.pdf-page' ).first().locator( '.rtlui-print-canvas' );
	await expect( printCanvas ).toHaveCount( 1 );
	await expect( page.locator( '.rtlui-print-canvas' ) ).toHaveCount( 1 ); // only the drawn slide
	expect( await printCanvas.evaluate( canvas => {
		const data = canvas.getContext( '2d' ).getImageData( 0, 0, canvas.width, canvas.height ).data;
		for( let i = 3; i < data.length; i += 4 ) if( data[i] ) return true;
		return false;
	} ) ).toBe( true );

	// E clears this slide's drawing and its saved copy.
	await openDemo( page );
	await page.keyboard.press( 'e' );
	expect( await page.evaluate( () => localStorage.getItem( 'reveal-rtl-ui:drawings:/demo/' ) ) ).toBeNull();
} );
