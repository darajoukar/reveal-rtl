// Framework-independent RTL helpers. No reveal.js imports here.

const DIGITS = { persian: '۰۱۲۳۴۵۶۷۸۹', arabic: '٠١٢٣٤٥٦٧٨٩' };

// Elements whose text must keep Latin digits.
const SKIP_SELECTOR = 'pre, code, kbd, samp, script, style, math, svg, [dir="ltr"], .no-fa-digits, .latin-digits';

// style: 'persian' | 'arabic' | 'latin' (unchanged)
export function localizeDigits( value, style = 'persian' ) {
	const set = DIGITS[ style ];
	return set ? String( value ).replace( /[0-9]/g, d => set[d] ) : String( value );
}

export const toPersianDigits = value => localizeDigits( value, 'persian' );

// Converts digits in every text node under root, except inside SKIP_SELECTOR.
export function localizeDigitsIn( root, style = 'persian' ) {
	if( !DIGITS[ style ] ) return;
	const walker = root.ownerDocument.createTreeWalker( root, NodeFilter.SHOW_TEXT, {
		acceptNode: node => node.parentElement?.closest( SKIP_SELECTOR )
			? NodeFilter.FILTER_REJECT
			: NodeFilter.FILTER_ACCEPT
	} );

	for( let node = walker.nextNode(); node; node = walker.nextNode() ) {
		if( /[0-9]/.test( node.nodeValue ) ) node.nodeValue = localizeDigits( node.nodeValue, style );
	}
}

export const persianizeDigits = root => localizeDigitsIn( root, 'persian' );

// Persian (۱) and Arabic (١) digits to Latin (1).
export function toLatinDigits( text ) {
	return String( text )
		.replace( /[۰-۹]/g, d => d.charCodeAt( 0 ) - 0x06F0 )
		.replace( /[٠-٩]/g, d => d.charCodeAt( 0 ) - 0x0660 );
}

// Lowercases and unifies Arabic/Persian letter and digit variants so "كتاب ۱" matches "کتاب 1".
export function normalizeForSearch( text ) {
	return toLatinDigits( text )
		.replace( /ي|ى/g, 'ی' )
		.replace( /ك/g, 'ک' )
		.replace( /‌/g, ' ' )
		.toLowerCase();
}

/**
 * Timer text and state. Without a duration it counts up; with one it counts down,
 * turns 'warn' at warnAt seconds left and 'over' (negative, "-m:ss") past the end.
 */
export function timerDisplay( elapsedSeconds, durationSeconds, warnAtSeconds ) {
	const elapsed = Math.floor( elapsedSeconds );
	if( !durationSeconds ) return { text: formatDuration( elapsed ), state: 'normal' };
	const remaining = durationSeconds - elapsed;
	if( remaining < 0 ) return { text: '-' + formatDuration( -remaining ), state: 'over' };
	return { text: formatDuration( remaining ), state: remaining <= warnAtSeconds ? 'warn' : 'normal' };
}

// Seconds to "m:ss", or "h:mm:ss" from one hour.
export function formatDuration( totalSeconds ) {
	const h = Math.floor( totalSeconds / 3600 );
	const m = Math.floor( totalSeconds % 3600 / 60 );
	const s = String( totalSeconds % 60 ).padStart( 2, '0' );
	return h ? `${ h }:${ String( m ).padStart( 2, '0' ) }:${ s }` : `${ m }:${ s }`;
}

/**
 * Slide number text for reveal.js formats 'h.v' (default), 'h/v', 'c' and 'c/t', mirroring
 * reveal.js 6's own logic (js/controllers/slidenumber.js) so Persian digits keep every format.
 * s: { h, v, vertical, pastCount, total, uncounted, horizontalCount }
 */
export function formatSlideNumber( format, s ) {
	if( typeof format !== 'string' ) format = 'h.v';
	// reveal.js: with a single horizontal stack, a non-"c" format falls back to "c".
	if( !/c/.test( format ) && s.horizontalCount === 1 ) format = 'c';
	const offset = s.uncounted ? 0 : 1;
	switch( format ) {
		case 'c': return String( s.pastCount + offset );
		case 'c/t': return `${ s.pastCount + offset } / ${ s.total }`;
		default: {
			const sep = format === 'h/v' ? '/' : '.';
			return s.vertical ? `${ s.h + offset }${ sep }${ s.v + 1 }` : String( s.h + offset );
		}
	}
}

// Unicode numbering systems for the digit styles.
const NUMBERING = { persian: 'arabext', arabic: 'arab', latin: 'latn' };

export function formatJalali( date = new Date(), options = { dateStyle: 'long' }, digits = 'persian' ) {
	return new Intl.DateTimeFormat( `fa-IR-u-ca-persian-nu-${ NUMBERING[ digits ] || 'arabext' }`, options ).format( date );
}

// Fills <time data-jalali> elements. Uses the datetime attribute when present, otherwise today.
export function fillJalaliDates( root, digits = 'persian' ) {
	root.querySelectorAll( 'time[data-jalali]' ).forEach( el => {
		const date = el.dateTime ? new Date( el.dateTime ) : new Date();
		if( !isNaN( date ) ) el.textContent = formatJalali( date, undefined, digits );
	} );
}
