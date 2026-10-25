import { test } from 'node:test';
import assert from 'node:assert/strict';
import { toPersianDigits, toLatinDigits, formatJalali, normalizeForSearch, formatDuration, formatSlideNumber, timerDisplay } from './rtl.js';

test( 'localizeDigits supports Persian, Arabic and Latin', async () => {
	const { localizeDigits } = await import( './rtl.js' );
	assert.equal( localizeDigits( 'v2.10', 'persian' ), 'v۲.۱۰' );
	assert.equal( localizeDigits( 'v2.10', 'arabic' ), 'v٢.١٠' );
	assert.equal( localizeDigits( 'v2.10', 'latin' ), 'v2.10' );
} );

test( 'formatHijri gives the Umm al-Qura date in each language', async () => {
	const { formatHijri } = await import( './rtl.js' );
	const day = new Date( 2025, 2, 21 ); // 21 Ramadan 1446
	assert.match( formatHijri( day, 'ar', 'arabic' ), /رمضان ١٤٤٦/ );
	assert.match( formatHijri( day, 'fa', 'persian' ), /رمضان ۱۴۴۶/ );
	assert.match( formatHijri( day, 'en', 'latin' ), /Ramadan 21, 1446/ );
} );

test( 'toLatinDigits converts Persian and Arabic digits', () => {
	assert.equal( toLatinDigits( '۱۲ و ٣٤' ), '12 و 34' );
} );

test( 'timerDisplay counts up, counts down, warns and goes negative', () => {
	assert.deepEqual( timerDisplay( 75.9, null, 300 ), { text: '1:15', state: 'normal' } );
	assert.deepEqual( timerDisplay( 60, 1200, 300 ), { text: '19:00', state: 'normal' } );
	assert.deepEqual( timerDisplay( 900, 1200, 300 ), { text: '5:00', state: 'warn' } );
	assert.deepEqual( timerDisplay( 1200, 1200, 300 ), { text: '0:00', state: 'warn' } );
	assert.deepEqual( timerDisplay( 1272, 1200, 300 ), { text: '-1:12', state: 'over' } );
} );

test( 'formatSlideNumber supports every reveal.js format', () => {
	const vertical = { h: 6, v: 1, vertical: true, pastCount: 7, total: 8, uncounted: false, horizontalCount: 7 };
	const flat = { ...vertical, h: 2, v: 0, vertical: false, pastCount: 2 };
	assert.equal( formatSlideNumber( true, vertical ), '7.2' );
	assert.equal( formatSlideNumber( 'h.v', flat ), '3' );
	assert.equal( formatSlideNumber( 'h/v', vertical ), '7/2' );
	assert.equal( formatSlideNumber( 'c', vertical ), '8' );
	assert.equal( formatSlideNumber( 'c/t', flat ), '3 / 8' );
	assert.equal( formatSlideNumber( 'h.v', { ...flat, horizontalCount: 1 } ), '3' );
	assert.equal( formatSlideNumber( 'c', { ...flat, uncounted: true } ), '2' );
} );

test( 'normalizeForSearch unifies Arabic letters, digits and ZWNJ', () => {
	assert.equal( normalizeForSearch( 'كتابي ۱۲' ), normalizeForSearch( 'کتابی 12' ) );
	assert.equal( normalizeForSearch( '٣ Reveal' ), '3 reveal' );
	assert.equal( normalizeForSearch( 'می‌شود' ), 'می شود' );
} );

test( 'formatDuration pads minutes and seconds', () => {
	assert.equal( formatDuration( 0 ), '0:00' );
	assert.equal( formatDuration( 75 ), '1:15' );
	assert.equal( formatDuration( 3661 ), '1:01:01' );
} );

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
