import { test } from 'node:test';
import assert from 'node:assert/strict';
import { lintPersian } from './lint.js';

const rules = text => lintPersian( text ).map( i => i.rule );

test( 'flags Arabic letters, missing ZWNJ and digit problems', () => {
	assert.deepEqual( rules( 'كتابي' ), [ 'arabic-kaf', 'arabic-yeh' ] );
	assert.deepEqual( rules( 'او می رود' ), [ 'zwnj-mi' ] );
	assert.deepEqual( rules( 'نمی دانم' ), [ 'zwnj-mi' ] );
	assert.deepEqual( rules( 'کتاب ها و بزرگ ترین' ), [ 'zwnj-suffix', 'zwnj-suffix' ] );
	assert.deepEqual( rules( 'سال ۱4۰۴' ), [ 'mixed-digits' ] );
	assert.deepEqual( rules( 'سال ١٤٠٤' ), [ 'arabic-digits' ] );
} );

test( 'clean Persian passes', () => {
	assert.deepEqual( lintPersian( 'می‌رود، کتاب‌ها، بزرگ‌ترین، سال ۱۴۰۴ و 2026، کیمیا' ), [] );
	// "می" inside a word is fine
	assert.deepEqual( lintPersian( 'سیمین' ), [] );
} );

test( 'code is skipped and positions are 1-based', () => {
	const text = 'خط اول\n```js\nconst ي = 1;\n```\n<code>ك</code> `ي`\nکتاب ها';
	const issues = lintPersian( text );
	assert.equal( issues.length, 1 );
	assert.deepEqual( { line: issues[0].line, column: issues[0].column, rule: issues[0].rule }, { line: 6, column: 5, rule: 'zwnj-suffix' } );
	assert.equal( issues[0].suggestion, '‌ها' );
} );

test( 'other-language elements and disable comments are skipped', () => {
	assert.deepEqual( lintPersian( '<p lang="ar">كتاب عربي ١٢٣</p> <span lang="fa">كتاب</span>' ).map( i => i.found ), [ 'ك' ] );
	assert.deepEqual( lintPersian( '<!-- reveal-rtl-lint-disable -->كي<!-- reveal-rtl-lint-enable --> ي' ).length, 1 );
} );

test( 'suggestions', () => {
	const [ mixed ] = lintPersian( '۱4' );
	assert.equal( mixed.suggestion, '۱۴' );
	const [ mi ] = lintPersian( 'می رود' );
	assert.equal( mi.suggestion, 'می‌' );
} );
