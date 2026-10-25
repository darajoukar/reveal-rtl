import { toPersianDigits, persianizeDigits, fillJalaliDates, formatSlideNumber } from '../core/rtl.js';
import { watchSpeakerView } from '../core/speaker.js';
import { localizeHelp } from '../core/help.js';

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
			const format = config.slideNumber;
			// One string: reveal.js only renders the "/ total" part when it is a number.
			config.slideNumber = slide => {
				const { h, v } = deck.getIndices( slide );
				return [ toPersianDigits( formatSlideNumber( format, {
					h, v,
					vertical: deck.isVerticalSlide( slide ),
					pastCount: deck.getSlidePastCount( slide ),
					total: deck.getTotalSlides(),
					uncounted: slide?.dataset.visibility === 'uncounted',
					horizontalCount: deck.getHorizontalSlides().length
				} ) ) ];
			};
		}

		// The PDF print view numbers pages with Latin digits after layout.
		if( options.digits ) {
			deck.on( 'pdf-ready', () => document.querySelectorAll( '.slide-number-pdf' ).forEach( persianizeDigits ) );
		}

		// Keyboard help overlay (? key) in Persian.
		deck.on( 'showhelp', () => localizeHelp( deck.getRevealElement().querySelector( '.r-overlay-help' ) ) );

		// Speaker view (notes plugin, S key): RTL layout and Persian labels.
		if( !deck.isSpeakerNotes() ) watchSpeakerView( { digits: options.digits } );

		// 'ready' fires after all plugins, so content from markdown etc. is already in the DOM.
		deck.on( 'ready', () => {
			const slides = deck.getSlidesElement();
			fillJalaliDates( slides );
			if( options.digits ) persianizeDigits( slides );
		} );
	}
} );
