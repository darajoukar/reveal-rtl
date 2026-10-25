import { test as base, expect } from '@playwright/test';
import path from 'node:path';

export { expect };

export const DEMO = '/demo/';

// The demo loads reveal.js from jsDelivr and Vazirmatn from Google Fonts. Serve reveal.js from
// node_modules (same bytes, so SRI still passes) and stub the font CSS, so tests run offline and fast.
const REVEAL_CDN = /^https:\/\/cdn\.jsdelivr\.net\/npm\/reveal\.js@6\.0\.2\/(.+)$/;

export const test = base.extend( {
	context: async ( { context }, use ) => {
		await context.route( REVEAL_CDN, route => {
			const file = route.request().url().match( REVEAL_CDN )[1];
			return route.fulfill( { path: path.resolve( 'node_modules/reveal.js', file ) } );
		} );
		await context.route( /fonts\.(googleapis|gstatic)\.com/, route => route.fulfill( { contentType: 'text/css', body: '' } ) );
		await use( context );
	}
} );

// The toolbar fades out after 3s without mouse movement; wake it before interacting.
export async function wake( page ) {
	await page.mouse.move( 200 + Math.random() * 50, 200 );
}

// Auto-hide is timing-based and would make clicks flaky on slow runs.
const NO_IDLE_CSS = '.reveal.rtlui-idle .rtlui-toolbar, .reveal.rtlui-idle .rtlui-show { opacity: 1 !important; pointer-events: auto !important; }';

async function settle( page ) {
	await page.locator( '.reveal.ready' ).waitFor();
	await page.addStyleTag( { content: NO_IDLE_CSS } );
	await wake( page );
}

export async function openDemo( page, hash = '' ) {
	await page.goto( DEMO + hash );
	await settle( page );
}

export async function reloadDemo( page ) {
	await page.reload();
	await settle( page );
}

export const toolbarButton = ( page, name ) => page.locator( '.rtlui-toolbar' ).getByRole( 'button', { name, exact: true } );

export const slideIndex = page => page.evaluate( () => Reveal.getIndices().h );
