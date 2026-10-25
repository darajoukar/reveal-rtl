// Localized, right-to-left version of the reveal.js keyboard help overlay (? key).
// reveal.js 6 builds it from English strings in js/controllers/keyboard.js and overlay.js;
// t() (core/i18n.js) maps them, and unknown strings (other plugins) stay as they are.

// overlay: the .r-overlay-help element.
export function localizeHelp( overlay, t, lang = 'fa' ) {
	const content = overlay?.querySelector( '.r-overlay-help-content' );
	if( !content ) return;
	content.dir = 'rtl';
	content.lang = lang;
	content.querySelectorAll( '.title, th, td:nth-child(2)' ).forEach( el => {
		el.textContent = t( el.textContent.trim() );
	} );
	// Key names and arrows read left-to-right.
	content.querySelectorAll( 'td:first-child' ).forEach( el => {
		el.dir = 'ltr';
	} );
}
