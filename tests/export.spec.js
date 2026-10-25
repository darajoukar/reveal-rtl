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
	await expect( page.locator( '.rtlui-menu-item' ) ).toHaveText( [ 'PDF (چاپ)', 'JSON', 'متن Markdown', 'HTML', 'یادداشت‌های سخنران' ] );
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
	await expect( popup.locator( '.rtlui-toolbar' ) ).toHaveCount( 0 );
} );
