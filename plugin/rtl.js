import { toPersianDigits, persianizeDigits, fillJalaliDates } from '../core/rtl.js';

/**
 * reveal.js plugin for right-to-left (Persian) presentations.
 *
 * Options go in `rtlOptions` in Reveal.initialize():
 *   digits: true  convert digits in slides and slide number to Persian
 */
export default () => ( {
	id: 'rtl',

	init( deck ) {
		const config = deck.getConfig();
		const options = { digits: true, ...config.rtlOptions };

		// Plugins init before reveal.js applies its config, so changing the config object
		// here takes effect on first render (no LTR flash). deck.configure() would need the DOM.
		config.rtl = true;

		if( options.digits && config.slideNumber && typeof config.slideNumber !== 'function' ) {
			// shortcut: always "c/t" format, ignores custom slideNumber strings; map formats if requested
			// One string: reveal.js only renders the "/ total" part when it is a number.
			config.slideNumber = slide => [
				toPersianDigits( `${ deck.getSlidePastCount( slide ) + 1 } / ${ deck.getTotalSlides() }` )
			];
		}

		// 'ready' fires after all plugins, so content from markdown etc. is already in the DOM.
		deck.on( 'ready', () => {
			const slides = deck.getSlidesElement();
			fillJalaliDates( slides );
			if( options.digits ) persianizeDigits( slides );
		} );
	}
} );
