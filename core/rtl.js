// Framework-independent RTL helpers. No reveal.js imports here.

const PERSIAN_DIGITS = '۰۱۲۳۴۵۶۷۸۹';

// Elements whose text must keep Latin digits.
const SKIP_SELECTOR = 'pre, code, kbd, samp, script, style, math, svg, [dir="ltr"], .no-fa-digits';

export function toPersianDigits( value ) {
	return String( value ).replace( /[0-9]/g, d => PERSIAN_DIGITS[d] );
}

// Converts digits in every text node under root, except inside SKIP_SELECTOR.
export function persianizeDigits( root ) {
	const walker = root.ownerDocument.createTreeWalker( root, NodeFilter.SHOW_TEXT, {
		acceptNode: node => node.parentElement?.closest( SKIP_SELECTOR )
			? NodeFilter.FILTER_REJECT
			: NodeFilter.FILTER_ACCEPT
	} );

	for( let node = walker.nextNode(); node; node = walker.nextNode() ) {
		if( /[0-9]/.test( node.nodeValue ) ) node.nodeValue = toPersianDigits( node.nodeValue );
	}
}

// Lowercases and unifies Arabic/Persian letter and digit variants so "كتاب ۱" matches "کتاب 1".
export function normalizeForSearch( text ) {
	return String( text )
		.replace( /ي|ى/g, 'ی' )
		.replace( /ك/g, 'ک' )
		.replace( /[۰-۹]/g, d => d.charCodeAt( 0 ) - 0x06F0 )
		.replace( /[٠-٩]/g, d => d.charCodeAt( 0 ) - 0x0660 )
		.replace( /‌/g, ' ' )
		.toLowerCase();
}

// Seconds to "m:ss", or "h:mm:ss" from one hour.
export function formatDuration( totalSeconds ) {
	const h = Math.floor( totalSeconds / 3600 );
	const m = Math.floor( totalSeconds % 3600 / 60 );
	const s = String( totalSeconds % 60 ).padStart( 2, '0' );
	return h ? `${ h }:${ String( m ).padStart( 2, '0' ) }:${ s }` : `${ m }:${ s }`;
}

export function formatJalali( date = new Date(), options = { dateStyle: 'long' } ) {
	return new Intl.DateTimeFormat( 'fa-IR-u-ca-persian', options ).format( date );
}

// Fills <time data-jalali> elements. Uses the datetime attribute when present, otherwise today.
export function fillJalaliDates( root ) {
	root.querySelectorAll( 'time[data-jalali]' ).forEach( el => {
		const date = el.dateTime ? new Date( el.dateTime ) : new Date();
		if( !isNaN( date ) ) el.textContent = formatJalali( date );
	} );
}
