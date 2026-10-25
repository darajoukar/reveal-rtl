import { test, expect, openDemo } from './helpers.js';

const OWN_THEMES = [ 'parsi-light', 'parsi-dark' ];
const THEMES = [ ...OWN_THEMES, 'beige', 'black-contrast', 'black', 'blood', 'dracula', 'league', 'moon', 'night', 'serif', 'simple', 'sky', 'solarized', 'white-contrast', 'white' ];

for( const theme of THEMES ) {
	test( `RTL layout holds in the ${ theme } theme`, async ( { page } ) => {
		await openDemo( page, '#/2' );
		await page.evaluate( async name => {
			const link = document.getElementById( 'theme' );
			const href = name.startsWith( 'parsi-' ) ? new URL( `../themes/${ name }.css`, location.href ).href : `https://cdn.jsdelivr.net/npm/reveal.js@6.0.2/dist/theme/${ name }.css`;
			// Same URL (the demo's default theme) fires no load event.
			if( link.href !== href ) {
				const loaded = new Promise( resolve => link.addEventListener( 'load', resolve, { once: true } ) );
				link.href = href;
				await loaded;
			}
			await document.fonts.ready;
		}, theme );

		const result = await page.evaluate( () => {
			const style = el => getComputedStyle( document.querySelector( el ) );
			const list = document.querySelector( '.slides > section.present ul' );
			const slide = document.querySelector( '.slides > section.present' ).getBoundingClientRect();
			const overflow = [ ...document.querySelectorAll( '.slides > section.present *' ) ].filter( el => {
				const r = el.getBoundingClientRect();
				return r.width && ( r.left < slide.left - 1 || r.right > slide.right + 1 );
			} ).length;
			return {
				headingFont: style( '.slides > section.present h2' ).fontFamily,
				headingSpacing: style( '.slides > section.present h2' ).letterSpacing,
				listMarginRight: parseFloat( getComputedStyle( list ).marginRight ),
				listMarginLeft: parseFloat( getComputedStyle( list ).marginLeft ),
				listAlign: getComputedStyle( list ).textAlign,
				direction: style( '.slides > section.present' ).direction,
				overflow
			};
		} );

		expect( result.direction ).toBe( 'rtl' );
		expect( result.headingFont ).toContain( 'Vazirmatn' );
		expect( result.headingSpacing ).toBe( 'normal' );
		expect( result.listMarginRight ).toBeGreaterThan( 0 );
		expect( result.listMarginLeft ).toBe( 0 );
		expect( result.listAlign ).toMatch( /start|right/ );
		expect( result.overflow ).toBe( 0 );

		// Table cells align to the right as well.
		await page.evaluate( () => Reveal.slide( 5 ) );
		await expect( page.locator( '.slides > section.present th' ).first() ).toHaveCSS( 'text-align', /start|right/ );
	} );
}
