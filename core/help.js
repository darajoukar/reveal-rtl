// Persian, right-to-left version of the reveal.js keyboard help overlay (? key).
// reveal.js 6 builds it from English strings in js/controllers/keyboard.js and overlay.js.

const TEXT = {
	'Keyboard Shortcuts': 'میان‌برهای صفحه‌کلید',
	'KEY': 'کلید',
	'ACTION': 'کار',
	'Next slide': 'اسلاید بعدی',
	'Previous slide': 'اسلاید قبلی',
	// In RTL mode reveal.js maps left to "next" and right to "previous".
	'Navigate left': 'چپ: اسلاید بعدی',
	'Navigate right': 'راست: اسلاید قبلی',
	'Navigate up': 'بالا',
	'Navigate down': 'پایین',
	'Navigate without fragments': 'جابه‌جایی بدون مراحل (fragment)',
	'Jump to first/last slide': 'رفتن به اولین/آخرین اسلاید',
	'Pause': 'مکث (صفحه‌ی سیاه)',
	'Fullscreen': 'تمام‌صفحه',
	'Jump to slide': 'رفتن به اسلاید با شماره',
	'Slide overview': 'نمای کلی اسلایدها',
	'Speaker notes view': 'پنجره‌ی سخنران'
};

export function translateHelp( text ) {
	return TEXT[ text.trim() ] ?? text;
}

// overlay: the .r-overlay-help element. Unknown strings (other plugins) stay as they are.
export function localizeHelp( overlay ) {
	const content = overlay?.querySelector( '.r-overlay-help-content' );
	if( !content ) return;
	content.dir = 'rtl';
	content.lang = 'fa';
	content.querySelectorAll( '.title, th, td:nth-child(2)' ).forEach( el => {
		el.textContent = translateHelp( el.textContent );
	} );
	// Key names and arrows read left-to-right.
	content.querySelectorAll( 'td:first-child' ).forEach( el => {
		el.dir = 'ltr';
	} );
}
