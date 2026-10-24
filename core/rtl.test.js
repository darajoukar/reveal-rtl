import { test } from 'node:test';
import assert from 'node:assert/strict';
import { toPersianDigits, formatJalali } from './rtl.js';

test( 'toPersianDigits converts every Latin digit', () => {
	assert.equal( toPersianDigits( 'اسلاید 12 از 30' ), 'اسلاید ۱۲ از ۳۰' );
	assert.equal( toPersianDigits( 1234567890 ), '۱۲۳۴۵۶۷۸۹۰' );
	assert.equal( toPersianDigits( 'بدون عدد' ), 'بدون عدد' );
} );

test( 'formatJalali uses the Persian calendar', () => {
	// 2025-03-21 is 1 Farvardin 1404.
	const text = formatJalali( new Date( 2025, 2, 21 ) );
	assert.match( text, /۱۴۰۴/ );
	assert.match( text, /فروردین/ );
} );
