import { test, expect, openDemo, slideIndex } from './helpers.js';

// reveal.js listens to pointer events; Playwright has no swipe gesture, so dispatch touch pointers.
async function swipe( page, fromX, toX ) {
	await page.evaluate( ( [ a, b ] ) => {
		const el = document.querySelector( '.reveal .slides' );
		const fire = ( type, x ) => el.dispatchEvent( new PointerEvent( type, { pointerType: 'touch', pointerId: 1, isPrimary: true, clientX: x, clientY: 400, bubbles: true, cancelable: true } ) );
		fire( 'pointerdown', a );
		fire( 'pointermove', ( a + b ) / 2 );
		fire( 'pointermove', b );
		fire( 'pointerup', b );
	}, [ fromX, toX ] );
}

test( 'swiping changes slides (no scroll view) in RTL direction', async ( { page } ) => {
	await openDemo( page );
	expect( await page.evaluate( () => Reveal.isScrollView() ) ).toBe( false );
	await swipe( page, 80, 300 );
	await expect.poll( () => slideIndex( page ) ).toBe( 1 );
	await swipe( page, 300, 80 );
	await expect.poll( () => slideIndex( page ) ).toBe( 0 );
} );

test( 'toolbar fits the screen on one row without wide-only controls', async ( { page } ) => {
	await openDemo( page );
	const box = await page.locator( '.rtlui-toolbar' ).boundingBox();
	const width = page.viewportSize().width;
	expect( box.x ).toBeGreaterThanOrEqual( 0 );
	expect( box.x + box.width ).toBeLessThanOrEqual( width );
	expect( box.height ).toBeLessThan( 50 );
	for( const el of await page.locator( '.rtlui-wide-only' ).all() ) await expect( el ).toBeHidden();
} );

test( 'export menu stays inside the screen', async ( { page } ) => {
	await openDemo( page );
	await page.locator( '.rtlui-toolbar' ).getByRole( 'button', { name: 'خروجی گرفتن' } ).click();
	const box = await page.locator( '.rtlui-menu' ).boundingBox();
	expect( box.x ).toBeGreaterThanOrEqual( 0 );
	expect( box.x + box.width ).toBeLessThanOrEqual( page.viewportSize().width );
} );
