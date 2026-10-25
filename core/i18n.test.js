import { test } from 'node:test';
import assert from 'node:assert/strict';
import { LOCALES, resolveLocale } from './i18n.js';

test( 'every language defines every UI key', () => {
	const uiKeys = Object.keys( LOCALES.fa ).filter( key => /^[a-z]/.test( key ) );
	for( const lang of [ 'ar', 'en' ] ) {
		const missing = uiKeys.filter( key => !( key in LOCALES[ lang ] ) );
		assert.deepEqual( missing, [], `${ lang } is missing ${ missing.join( ', ' ) }` );
	}
} );

test( 'resolveLocale picks language, digit style and fills placeholders', () => {
	assert.equal( resolveLocale().lang, 'fa' );
	assert.equal( resolveLocale().digits, 'persian' );
	assert.equal( resolveLocale( { lang: 'ar' } ).digits, 'arabic' );
	assert.equal( resolveLocale( { lang: 'en' } ).digits, 'latin' );
	assert.equal( resolveLocale( { lang: 'xx' } ).lang, 'fa' );
	assert.equal( resolveLocale( { digits: false } ).digits, 'latin' );
	assert.equal( resolveLocale( { lang: 'fa', digits: 'arabic' } ).digits, 'arabic' );
	assert.equal( resolveLocale( { lang: 'ar' } ).t( 'slideN', { n: 3 } ), 'الشريحة 3' );
	assert.equal( resolveLocale( { labels: { first: 'آغاز' } } ).t( 'first' ), 'آغاز' );
	// English keeps reveal.js's own help text, except the RTL arrow meaning.
	const en = resolveLocale( { lang: 'en' } );
	assert.equal( en.t( 'Next slide' ), 'Next slide' );
	assert.equal( en.t( 'Navigate left' ), 'Left: next slide' );
} );
