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
